# Admin-Backend einrichten (`/admin`)

Das Backend liegt unter **`/admin`** und ist mit einem gemeinsamen Passwort
geschützt. Aktuell enthält es die **Newsletter-Verwaltung** (Kontakte +
Versand). Der Analyse-Bereich folgt als Phase 2.

## Was wo gespeichert wird

- **Newsletter-Kontakte** liegen in **unserer eigenen Datenbank** (libSQL).
  Versendet wird über **Resend** (Batch-Versand mit deinem HTML, inkl.
  automatischem Absender-Footer + Abmeldelink/`List-Unsubscribe`).
- `RESEND_AUDIENCE_ID` wird **nicht mehr gebraucht** (die Liste gehört jetzt
  uns, nicht Resend).

## 1. Login-Passwort setzen

In `.env.local` (lokal) bzw. in den Vercel-Environment-Variables:

```bash
ADMIN_PASSWORD=ein-gutes-passwort        # bitte ÄNDERN (Default lokal: waldwiese-test)
ADMIN_SESSION_SECRET=<zufallswert>       # via: openssl rand -base64 32
```

`ADMIN_SESSION_SECRET` signiert die Login-Session. Einmal setzen, nicht mehr
ändern (sonst werden alle eingeloggt-Sessions ungültig).

## 2. Datenbank

**Lokal** ist nichts zu tun — es wird automatisch die Datei
`./.data/wald-wiese.db` genutzt (liegt in `.gitignore`).

**Auf Vercel** braucht es eine echte Datenbank, weil das Dateisystem dort
flüchtig ist. Empfohlen: **Turso** (kostenloser Tarif reicht locker).

1. Auf <https://turso.tech> registrieren.
2. Eine Datenbank anlegen (`turso db create wald-wiese` oder im Dashboard).
3. Verbindungsdaten holen:
   - URL: `turso db show wald-wiese --url` → beginnt mit `libsql://…`
   - Token: `turso db tokens create wald-wiese`
4. In Vercel als Environment Variables setzen:

```bash
TURSO_DATABASE_URL=libsql://wald-wiese-...turso.io
TURSO_AUTH_TOKEN=<token>
```

Die Tabellen legt der Code beim ersten Zugriff selbst an — kein Migrations-Schritt nötig.

## 3. Alle Env-Variablen auf Vercel

Im Vercel-Dashboard → Project → **Settings → Environment Variables** setzen:

| Variable | Zweck |
| --- | --- |
| `RESEND_API_KEY` | Versand (Resend) |
| `CONTACT_FROM_EMAIL` | Absenderadresse (verifizierte Domain) |
| `CONTACT_TO_EMAIL` | Zielpostfach Kontaktformular |
| `NEWSLETTER_SECRET` | Signatur Bestätigungs-/Abmeldelinks |
| `ADMIN_PASSWORD` | Login-Passwort Backend |
| `ADMIN_SESSION_SECRET` | Signatur Login-Session |
| `TURSO_DATABASE_URL` | Datenbank |
| `TURSO_AUTH_TOKEN` | Datenbank-Token |

Danach neu deployen.

## 4. Bedienung

- **`/admin`** → Login → Übersicht (Kontaktzahlen).
- **`/admin/newsletter`**:
  - Kontakte **hinzufügen** (E-Mail + optional Name), **umbenennen** (Name
    direkt editieren), **ab-/anmelden**, **löschen**.
  - Neue Anmeldungen aus dem Frühstücks-Sommelier (Double-Opt-in) landen
    automatisch hier.
  - **Newsletter schreiben**: Betreff + HTML, Live-Vorschau, Bestätigungshaken,
    senden an alle Angemeldeten. Absender-Footer + Abmeldelink kommen automatisch dazu.

## Auswertungen (`/admin/analytics`)

First-Party-Tracking — **anonym, cookielos, ohne IP/personenbezogene Daten**,
in dieselbe Datenbank:

- **Seitenaufrufe, CTA-Klicks, Reservierungs-Öffnungen, Sommelier-Abschlüsse**
  werden client-seitig erfasst — aber **nur mit Statistik-Einwilligung** der
  Besucher (gleiches Consent wie GA4/Hotjar). `/admin`-Seiten zählen nicht mit.
- **Newsletter-Anmeldungen, bestätigte Anmeldungen, Kontakt-Nachrichten**
  werden server-seitig immer gezählt (bewusste Aktionen, anonym).
- Dashboard mit Zeitraum (Heute / 7 / 30 Tage), Tagesverlauf, Top-Seiten,
  Button-Klicks.

> Hinweis „Impressionen/CTR": echte **Such**-Impressionen/CTR liefert nur die
> Google Search Console — das hier zeigt Aufrufe + Button-/CTA-Klicks.

## Sicherheit / To-dos

- **`ADMIN_PASSWORD` vom Test-Wert ändern**, bevor es live geht.
- **Resend-API-Key rotieren** (wurde früher im Chat geteilt).
- **Datenschutzerklärung ergänzen**: ein kurzer Absatz über das anonyme,
  cookielose First-Party-Tracking (am besten vom Anwalt gegenlesen lassen).
- Backend-Seiten sind auf `noindex` gesetzt und bei jeder Aktion serverseitig
  gegen den Login geprüft.
