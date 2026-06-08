# Resend einrichten (Kontaktformular)

Das Kontaktformular auf `/kontakt` verschickt Nachrichten per **Resend**. Bis der
API-Key gesetzt ist, funktioniert das Formular (mit Validierung), zeigt beim
Absenden aber einen freundlichen Hinweis mit Telefon/E-Mail statt zu senden.
Sobald die drei Env-Variablen gesetzt sind, geht jede Nachricht direkt ins
Postfach.

## 1. Account anlegen

1. Auf <https://resend.com> registrieren (kostenloser Tarif reicht für den
   Start: 3.000 Mails/Monat, 100/Tag).
2. E-Mail bestätigen, einloggen.

## 2. Domain verifizieren (`restaurant-waldwiese.de`)

Damit Mails nicht im Spam landen, muss die Absender-Domain verifiziert werden.

1. Im Resend-Dashboard → **Domains** → **Add Domain**.
2. `restaurant-waldwiese.de` eintragen, Region **EU (Ireland)** wählen
   (DSGVO-freundlich, Server in Europa).
3. Resend zeigt dir mehrere **DNS-Records** (MX, TXT/SPF, DKIM, optional DMARC).
4. Diese Records beim **Domain-Hoster** (wo `restaurant-waldwiese.de`
   registriert ist — z. B. IONOS, Strato, GoDaddy) im DNS-Bereich eintragen.
   - Tipp: nur die von Resend vorgegebenen Einträge hinzufügen, bestehende
     MX-Einträge des E-Mail-Postfachs **nicht** löschen.
5. Zurück in Resend auf **Verify** klicken. DNS kann ein paar Minuten bis
   wenige Stunden brauchen, bis es grün ist.

## 3. API-Key erstellen

1. Resend-Dashboard → **API Keys** → **Create API Key**.
2. Name z. B. `wald-und-wiese-website`, Permission **Sending access**.
3. Key kopieren (beginnt mit `re_…`) — wird nur **einmal** angezeigt.

## 4. Env-Variablen setzen

Im Projektordner `website/` eine Datei **`.env.local`** anlegen (steht in
`.gitignore`, wird nie committet) und füllen:

```bash
RESEND_API_KEY=re_dein_key_hier
CONTACT_FROM_EMAIL="Wald & Wiese <kontakt@restaurant-waldwiese.de>"
CONTACT_TO_EMAIL=info@restaurant-waldwiese.de
```

- **`CONTACT_FROM_EMAIL`**: Der Teil hinter dem `@` muss die in Schritt 2
  verifizierte Domain sein. Das Postfach (`kontakt@…`) muss **nicht** real
  existieren — Resend versendet im Namen der Domain. Antworten landen dank
  `reply-to` trotzdem bei der Person, die das Formular ausgefüllt hat.
- **`CONTACT_TO_EMAIL`**: Wohin die Anfragen kommen. Default ist
  `info@restaurant-waldwiese.de`, falls leer gelassen.

## 5. Testen

1. Dev-Server neu starten (`npm run dev`), damit `.env.local` geladen wird.
2. Auf `/kontakt` das Formular ausfüllen und absenden.
3. Postfach (`CONTACT_TO_EMAIL`) prüfen — die Mail sollte da sein, mit der
   Absenderadresse der Person im **Antworten-an**.

## 6. Frühstücks-Launch-Liste (optional, für den Sommelier)

Das Ergebnis des Frühstücks-Sommeliers bietet eine Anmeldung zur Launch-Liste
mit **Double-Opt-in** (Bestätigungsmail). Dafür zwei zusätzliche Variablen:

```bash
NEWSLETTER_SECRET=eine_lange_zufallszeichenkette
RESEND_AUDIENCE_ID=aud_xxxxxxxx
```

- **`NEWSLETTER_SECRET`**: signiert die Bestätigungslinks (so kann sich niemand
  ohne Bestätigung selbst eintragen). Einmal erzeugen, z. B. im Terminal mit
  `openssl rand -base64 32`, und nie ändern (sonst werden offene
  Bestätigungslinks ungültig).
- **`RESEND_AUDIENCE_ID`**: Resend-Dashboard → **Audiences** → Liste anlegen →
  ID kopieren. Bestätigte Anmeldungen landen automatisch in dieser Liste, aus
  der ihr später per Resend-**Broadcast** den Launch-Newsletter verschicken
  könnt. Ohne ID funktioniert die Anmeldung trotzdem — ihr bekommt dann nur
  eine E-Mail pro bestätigter Anmeldung.

Ablauf für Gäste: E-Mail eintragen → Bestätigungsmail klicken → Eintrag in die
Liste + Erfolgsseite. Ohne `RESEND_API_KEY`/`NEWSLETTER_SECRET` zeigt die
Anmeldung einen freundlichen Hinweis (Instagram) statt zu senden.

## Beim Deployment (z. B. Vercel)

Dieselben drei Variablen im Hosting-Dashboard unter **Environment Variables**
hinterlegen (nicht die `.env.local` hochladen). Danach neu deployen.

## Fehlersuche

- **Mail kommt nicht an / Spam:** Domain-Verifizierung in Resend prüfen (alle
  Records grün?). DMARC-Record hilft gegen Spam-Einstufung.
- **„Postfach gerade nicht erreichbar"-Hinweis im Formular:** `RESEND_API_KEY`
  fehlt oder ist falsch / Server wurde nach dem Setzen nicht neu gestartet.
- **Server-Logs** zeigen Details (`[contact] …`).
