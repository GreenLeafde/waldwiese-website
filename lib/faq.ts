import { CONTACT } from "./site";

/**
 * Häufige Fragen zur Startseite — sichtbar als Liste und als FAQPage-Schema.
 * Kurze, faktische Antworten, die Google und KI-Suchen (ChatGPT, Perplexity,
 * Google AI Overviews) direkt zitieren können. Nur belegte Fakten aus
 * lib/site.ts, lib/menu.ts, lib/dinner-menu.ts, den Landingpages und der CI.
 */
export const HOME_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Wann hat Wald & Wiese geöffnet?",
    a: "Brunch gibt es täglich von 8 bis 14 Uhr, ab 11:30 Uhr kommt der Mittagstisch dazu. Abendessen gibt es Freitag, Samstag und Sonntag von 17 bis 22 Uhr.",
  },
  {
    q: "Wo liegt das Restaurant?",
    a: `In der ${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city}, am Waldrand im Landkreis Regensburg, etwa zehn Minuten von Regensburg-Süd. Parkplätze gibt es direkt am Haus.`,
  },
  {
    q: "Wie kann ich einen Tisch reservieren?",
    a: `Online über restaurant-waldwiese.de/reservieren, dort wählst du Brunch oder Abendessen. Telefonisch erreichst du uns unter ${CONTACT.phone}. Für Feiern und größere Gruppen schreibst du uns am besten vorher.`,
  },
  {
    q: "Was kostet der Brunch?",
    a: "Die Frühstücke kosten 11,90 € bis 17,90 €, „Der gute alte Sepp“ für zwei Personen 32,90 €. Brote kosten 11,90 € bis 16,90 €, Bowls 9,90 €, das Kinderfrühstück „Der kleine Hansi“ 6,90 €. Die ganze Karte mit allen Preisen steht unter restaurant-waldwiese.de/speisekarte.",
  },
  {
    q: "Gibt es vegane und vegetarische Gerichte?",
    a: "Ja, vegan und vegetarisch stehen gleichberechtigt auf der Karte, zum Beispiel das vegane Frühstück „Die grüne Gretl“, die Bowl „Wiesenschmuserl“ und abends Burger mit veganem Patty.",
  },
  {
    q: "Sind Hunde erlaubt?",
    a: "Ja, Hunde sind bei uns willkommen, drinnen und auf der Terrasse. Unser Burger „Der klassische Heinzi“ ist sogar nach unserem Hund Henry benannt.",
  },
  {
    q: "Kann ich einen Gutschein kaufen?",
    a: "Ja, Wertgutscheine ab 10 € gibt es online bei BON BON, sofort als PDF per E-Mail oder als Karte per Post. Sie gelten drei Jahre für Brunch, Abendessen und Getränke.",
  },
];
