/**
 * Sammel-Export aller versendeten Kampagnen (Admin-only).
 *
 *   GET /api/admin/versand/html
 *
 * Liefert EINE Datei, die pro Kampagne den HTML-Quelltext als lesbaren Code
 * enthält (komplette Mail + Editor-Inhalt) — zum Archivieren, Nachschlagen und
 * Weitergeben. Der Code steht escaped in <pre>-Blöcken, wird also angezeigt und
 * nicht gerendert.
 *
 * Route-Handler laufen NICHT durch das Admin-Layout → Auth hier explizit.
 */

import { isAuthed } from "@/lib/admin-auth";
import { listNewslettersWithStats } from "@/lib/newsletters";
import { escapeHtml, renderFullEmail } from "@/lib/newsletter-export";

const STYLE = `
  body { margin:0; background:#f7f6f3; color:#2e3d2c;
         font-family:Helvetica,Arial,sans-serif; line-height:1.6; }
  main { max-width:1000px; margin:0 auto; padding:48px 24px 80px; }
  h1 { font-family:Georgia,'Times New Roman',serif; font-weight:400;
       font-size:32px; letter-spacing:1px; margin:0 0 6px; }
  h2 { font-family:Georgia,'Times New Roman',serif; font-weight:400;
       font-size:24px; margin:0 0 4px; }
  h3 { font-size:11px; text-transform:uppercase; letter-spacing:2px;
       color:#c97c5d; margin:28px 0 8px; }
  .meta { font-size:13px; color:#6b7a68; margin:0; }
  article { background:#fff; border:1px solid rgba(46,61,44,0.1);
            border-radius:16px; padding:26px 28px; margin-top:22px; }
  pre { background:#2e3d2c; color:#f2ead8; border-radius:12px;
        padding:18px 20px; overflow:auto; max-height:32rem;
        font-family:'SF Mono',Menlo,Consolas,monospace; font-size:12px;
        line-height:1.55; white-space:pre-wrap; word-break:break-word; }
`;

export async function GET() {
  if (!(await isAuthed())) {
    return new Response("Nicht angemeldet.", { status: 401 });
  }

  const items = await listNewslettersWithStats().catch(() => null);
  if (!items) {
    return new Response("Datenbank nicht erreichbar.", { status: 503 });
  }

  // Chronologisch (ältester zuerst) — als Archiv besser lesbar.
  const chronologisch = [...items].reverse();

  const abschnitte = chronologisch
    .map((n, i) => {
      const titel = escapeHtml(n.name || n.subject);
      const betreff = escapeHtml(n.subject);
      const geplant = n.scheduledAt != null;
      return `<article>
  <h2>${i + 1}. ${titel}</h2>
  <p class="meta">Betreff: ${betreff}</p>
  <p class="meta">${
    geplant
      ? `Geplant für ${escapeHtml(n.scheduledAtLabel ?? "")}`
      : `Versendet am ${escapeHtml(n.sentAtLabel)}`
  } · ${n.sentCount} / ${n.recipientCount} gesendet · ${n.opens} Öffnungen · ${
    n.clicks
  } Klicks · ${n.unsubs} Abmeldungen</p>
  <h3>Komplette E-Mail</h3>
  <pre>${escapeHtml(renderFullEmail(n))}</pre>
  <h3>Editor-Inhalt (Vorlage mit Platzhaltern)</h3>
  <pre>${escapeHtml(n.html)}</pre>
</article>`;
    })
    .join("\n");

  const heute = new Date();
  const stand = heute.toLocaleString("de-DE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const doc = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Newsletter-Export · Wald &amp; Wiese</title>
<style>${STYLE}</style>
</head>
<body>
<main>
  <h1>Newsletter-Export</h1>
  <p class="meta">Wald &amp; Wiese · ${chronologisch.length} Kampagne${
    chronologisch.length === 1 ? "" : "n"
  } · Stand ${escapeHtml(stand)}</p>
  <p class="meta">„Komplette E-Mail" ist die versendete Mail ohne Klick-Umleitung
  und Zähl-Pixel. „Editor-Inhalt" ist die Vorlage aus dem Composer inklusive
  Platzhaltern.</p>
  ${
    chronologisch.length === 0
      ? '<article><p class="meta">Noch kein Newsletter versendet.</p></article>'
      : abschnitte
  }
</main>
</body>
</html>`;

  const datum = heute.toISOString().slice(0, 10);
  return new Response(doc, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="wald-wiese-newsletter-export-${datum}.html"`,
      "Cache-Control": "no-store",
    },
  });
}
