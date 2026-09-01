import { holeNachweis } from "@/lib/nachweise";

/**
 * Liefert ein Foto oder eine Unterschrift aus.
 *
 * Die Schichtansicht ist bewusst ohne Anmeldung erreichbar, deshalb ist die
 * zufällige Kennung im Pfad der Zugang: Sie steht nur an der erledigten
 * Aufgabe und im Backend, ist nicht erratbar und nicht durchzählbar. Die
 * Antwort wird nicht zwischengespeichert und nicht von Suchmaschinen erfasst.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/.test(id)) {
    return new Response("Nicht gefunden.", { status: 404 });
  }

  const nachweis = await holeNachweis(id);
  if (!nachweis) {
    return new Response("Nicht gefunden.", { status: 404 });
  }

  return new Response(new Uint8Array(nachweis.daten), {
    headers: {
      "Content-Type": nachweis.typ,
      "Content-Length": String(nachweis.daten.byteLength),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, noimageindex",
      "Content-Disposition": "inline",
    },
  });
}
