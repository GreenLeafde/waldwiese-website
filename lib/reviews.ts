/**
 * Echte Google-Rezensionen (vom Betreiber übernommen, Stand 2026-06).
 * Alle 5 Sterne. Texte leicht gekürzt fürs Layout, Sinn unverändert.
 * Quelle: Google-Rezensionen zu Wald & Wiese, Sinzing.
 */
export type Review = {
  name: string;
  text: string;
  when: string;
  rating: number;
};

export const REVIEWS: Review[] = [
  {
    name: "Dominic Pfannenstein",
    text: "Wir waren das erste Mal bei Wald & Wiese. Das Essen war sehr lecker und der Service äußerst zuvorkommend. Sicherlich nicht das letzte Mal, dass wir dort essen!",
    when: "vor 4 Tagen",
    rating: 5,
  },
  {
    name: "Sabine Beer",
    text: "Ein ganz besonderer Ort zum Genießen. Die Speisekarte ist sehr originell und macht Lust auf mehr. Ausgezeichneter Service und mega gutes Essen — wir kommen wieder.",
    when: "vor 2 Wochen",
    rating: 5,
  },
  {
    name: "Stefan Beer",
    text: "Sehr netter und persönlicher Service. Die Burger sind erstklassig. Schön, dass es so ein tolles Lokal in Sinzing gibt!",
    when: "vor 2 Wochen",
    rating: 5,
  },
  {
    name: "Lukas",
    text: "Ein absoluter Glücksgriff in Sinzing! Der Burger mit Pommes war mega lecker, die Aioli ein echtes Highlight. Modernes, gemütliches Ambiente, aufmerksamer Service — und vieles gibt's auch vegetarisch oder vegan.",
    when: "vor einem Monat",
    rating: 5,
  },
  {
    name: "Feuer Jumper 3",
    text: "Schon das dritte Mal dort, inklusive Zaubershow — jedes Mal absolut klasse! Die Burger ein Gaumenschmaus, das Rinderfilet zum Magic Dinner hervorragend, das Pistazientiramisu ein Traum. Danke an das ganze Team!",
    when: "vor einem Monat",
    rating: 5,
  },
  {
    name: "Gabriele Hartkopf",
    text: "Burger und „Prinzessin auf der Kichererbse“ genossen — sehr lecker. Nicht ganz billig, aber die Qualität ist's wert.",
    when: "vor 3 Monaten",
    rating: 5,
  },
];
