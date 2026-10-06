/**
 * Ratgeber-/Content-Seiten (Blog light). Reine Text-Artikel für Content-SEO —
 * gegründet auf allgemeingültiges Wissen + unsere echten Fakten (Konzept,
 * Öffnungszeiten, hundefreundlich). Keine erfundenen Fakten übers Haus.
 * Neue Artikel hier ergänzen — Index, Route & Sitemap ziehen automatisch nach.
 */

export type GuideSection = { heading: string; body: string[] };

export type Guide = {
  slug: string;
  /** H1 */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Eyebrow über der H1 */
  kicker: string;
  /** Kurztext für Index + Meta */
  teaser: string;
  intro: string;
  sections: GuideSection[];
  faq?: { q: string; a: string }[];
  related?: { label: string; href: string }[];
  cta?: { label: string; href: string };
  publishedAt: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "fruehstueck-oder-brunch-unterschied",
    title: "Frühstück oder Brunch? Der feine Unterschied",
    metaTitle:
      "Frühstück oder Brunch? Der Unterschied einfach erklärt | Wald & Wiese",
    metaDescription:
      "Frühstück, Brunch, Mittag — was ist was? Wir erklären den Unterschied, woher der Brunch kommt und wie du in Sinzing bei Regensburg beides in einem bekommst.",
    kicker: "Ratgeber · Genießen",
    teaser:
      "Frühstück, Brunch, Mittagstisch — die Grenzen verschwimmen. Was steckt dahinter, und wann passt was?",
    intro:
      "„Gehen wir frühstücken oder brunchen?“ — die Frage hört man oft, und so richtig klar ist der Unterschied selten. Kein Wunder: Beides überschneidet sich. Hier erklären wir kurz und ohne Fachchinesisch, was Frühstück, Brunch und Mittag unterscheidet — und warum bei uns alles fließend ineinander übergeht.",
    sections: [
      {
        heading: "Woher kommt der Brunch?",
        body: [
          "Das Wort „Brunch“ ist eine Mischung aus den englischen Wörtern breakfast (Frühstück) und lunch (Mittagessen) — also die Mahlzeit dazwischen. Gemeint ist ein spätes, entspanntes Frühstück, das gern bis in den Mittag reicht und bei dem Süßes und Herzhaftes nebeneinander auf dem Tisch stehen.",
          "Typisch für den Brunch ist vor allem eins: Zeit. Man kommt später, bleibt länger und muss sich nicht entscheiden, ob es jetzt das Ei oder lieber schon der Burger sein soll.",
        ],
      },
      {
        heading: "Frühstück, Brunch, Mittag — die Unterschiede",
        body: [
          "Frühstück ist die klassische Morgenmahlzeit: eher früh, eher überschaubar — Brot, Ei, Joghurt, Obst und guter Kaffee. Der ruhige Start in den Tag.",
          "Brunch ist quasi das Frühstück in groß und in gemütlich: später am Vormittag, mehr Auswahl, süß und herzhaft zugleich. Man isst in Etappen und lässt sich Zeit.",
          "Mittag bringt dann die warmen, sättigenden Gerichte — bei uns zum Beispiel Currywurst, Burger oder einen großen Salat, ab 11:30 Uhr.",
        ],
      },
      {
        heading: "Wie wir beides verbinden",
        body: [
          "Bei Wald & Wiese in Sinzing musst du dich gar nicht festlegen. Von 8 bis 14 Uhr gibt es durchgehend Frühstücke, Brote und Bowls — und ab 11:30 Uhr kommen die Mittagsgerichte dazu. Frühstück fließt also ganz natürlich in Mittag über.",
          "Statt Buffet servieren wir à la carte: Du bestellst frisch, was dir schmeckt, und wühlst dich nicht durch aufgewärmte Bleche. So ist für den frühen Vogel und den Langschläfer am selben Tisch gesorgt.",
        ],
      },
      {
        heading: "Wann kommst du am besten?",
        body: [
          "Wer es ruhig mag, kommt früh — der erste Kaffee auf der Terrasse, bevor viel los ist. Wer ausschlafen will, trifft ab 11:30 Uhr auf die volle Auswahl aus Frühstück und Mittag.",
          "Am Wochenende wird es schön voll, gerade draußen im Grünen — dann lohnt sich eine Reservierung. Und der Hund darf natürlich mit.",
        ],
      },
    ],
    faq: [
      {
        q: "Ist Brunch dasselbe wie Frühstück?",
        a: "Nicht ganz. Brunch ist ein spätes, größeres Frühstück, das bis in den Mittag reicht und süße wie herzhafte Gerichte kombiniert. Bei uns gehen Frühstück und Mittag von 8 bis 14 Uhr fließend ineinander über.",
      },
      {
        q: "Bis wann kann man bei euch brunchen?",
        a: "Täglich bis 14 Uhr. Frühstücke, Brote und Bowls gibt es ab 8 Uhr, die Mittagsgerichte ab 11:30 Uhr.",
      },
      {
        q: "Braucht Brunch immer ein Buffet?",
        a: "Nein. Ein Buffet ist nur eine mögliche Form. Bei uns brunchst du à la carte — frisch bestellt, in Ruhe, ohne Gedränge.",
      },
    ],
    related: [
      { label: "Zur Speisekarte", href: "/speisekarte" },
      { label: "Brunch Regensburg", href: "/brunch-regensburg" },
      { label: "Wochenendbrunch Regensburg", href: "/wochenendbrunch-regensburg" },
    ],
    cta: { label: "Tisch reservieren", href: "/reservieren" },
    publishedAt: "2026-07-13",
  },
  {
    slug: "brunch-mit-hund-regensburg",
    title: "Brunch & Essen mit Hund bei Regensburg",
    metaTitle:
      "Mit Hund essen & brunchen bei Regensburg — Tipps | Wald & Wiese Sinzing",
    metaDescription:
      "Mit Hund essen gehen bei Regensburg? So klappt der entspannte Brunch mit Vierbeiner — praktische Tipps und ein hundefreundlicher Platz im Grünen in Sinzing.",
    kicker: "Ratgeber · Mit Hund",
    teaser:
      "Mit Hund essen gehen, ohne schräge Blicke? Worauf es ankommt — und wie der Brunch mit Vierbeiner entspannt bleibt.",
    intro:
      "Ein gemütlicher Brunch, und der Hund liegt entspannt unter dem Tisch — für viele der perfekte Vormittag. In der Praxis ist „hundefreundlich“ aber nicht überall gleich. Hier ein paar Tipps, worauf du achten kannst, damit der Besuch für alle schön wird.",
    sections: [
      {
        heading: "Hundefreundlich heißt nicht überall dasselbe",
        body: [
          "Manche Lokale dulden Hunde nur, andere heißen sie wirklich willkommen. Der Unterschied zeigt sich an Kleinigkeiten: Gibt es einen Wassernapf? Ist genug Platz zwischen den Tischen? Darf der Hund auch drinnen mit, oder nur auf die Terrasse?",
          "Ein Blick auf die Website oder ein kurzer Anruf vorab spart Enttäuschungen — besonders am Wochenende, wenn es voller wird.",
        ],
      },
      {
        heading: "Tipps für entspanntes Essen mit Hund",
        body: [
          "Vor dem Besuch eine Runde Gassi gehen — ein ausgelasteter Hund liegt gemütlicher unter dem Tisch als ein aufgedrehter.",
          "Nach einem ruhigeren Platz fragen, etwa am Rand oder auf der Terrasse. Dort ist weniger Trubel, und niemand muss über die Leine steigen.",
          "Wasser anbieten und die eigene Decke oder ein vertrautes Spielzeug mitnehmen — so kommt der Hund schneller zur Ruhe. Und: Stoßzeiten am Wochenende meiden, wenn dein Hund es lieber ruhig mag.",
        ],
      },
      {
        heading: "Bei uns ist der Hund echter Gast",
        body: [
          "Wald & Wiese in Sinzing liegt direkt am Waldrand — mit Terrasse im Grünen und eigenem Parkplatz. Dein Hund ist bei uns drinnen wie draußen herzlich willkommen, nicht nur geduldet.",
          "Wie sehr wir Vierbeiner mögen, sieht man sogar auf der Karte: Unser Burger „Heinzi“ ist nach unserem Hund Henry benannt. Und weil wir am Waldrand sind, passt die Gassi-Runde vor oder nach dem Brunch perfekt dazu.",
        ],
      },
      {
        heading: "So planst du deinen Besuch",
        body: [
          "Am ruhigsten ist es früh am Vormittag — ideal, wenn dein Hund es gern gelassen mag. Gebruncht wird bei uns täglich von 8 bis 14 Uhr.",
          "Gerade am Wochenende und für die Terrasse empfehlen wir eine Reservierung. Dann ist dein Platz im Grünen sicher — für dich und den Vierbeiner.",
        ],
      },
    ],
    faq: [
      {
        q: "Darf mein Hund mit ins Restaurant?",
        a: "Ja. Bei Wald & Wiese in Sinzing ist dein Hund drinnen wie auf der Terrasse willkommen.",
      },
      {
        q: "Gibt es Wasser für den Hund?",
        a: "Sprich uns einfach an — für den Vierbeiner ist gesorgt.",
      },
      {
        q: "Wann ist es am ruhigsten für einen Besuch mit Hund?",
        a: "Früh am Vormittag ist am wenigsten los. Am Wochenende wird es voller, dann lohnt sich eine Reservierung und ein Platz auf der Terrasse.",
      },
    ],
    related: [
      {
        label: "Hundefreundliches Restaurant Regensburg",
        href: "/hundefreundliches-restaurant-regensburg",
      },
      { label: "Zur Speisekarte", href: "/speisekarte" },
      { label: "Brunch Regensburg", href: "/brunch-regensburg" },
    ],
    cta: { label: "Tisch reservieren", href: "/reservieren" },
    publishedAt: "2026-07-13",
  },
  {
    slug: "weihnachtsfeier-planen",
    title: "Warum es sich lohnt, die Weihnachtsfeier jetzt schon zu planen",
    metaTitle:
      "Weihnachtsfeier planen: Warum der Spätsommer der richtige Zeitpunkt ist | Wald & Wiese",
    metaDescription:
      "Der beste Zeitpunkt für die Weihnachtsfeier-Planung liegt im Spätsommer. Wir erklären, warum — und worauf es bei der Wahl der Location bei Regensburg ankommt.",
    kicker: "Ratgeber · Feiern",
    teaser:
      "Weihnachten fühlt sich weit weg an, wenn draußen die Sonne scheint. Trotzdem entscheidet sich jetzt, wo ihr feiert — und warum frühe Planung entspannter ist.",
    intro:
      "Weihnachten fühlt sich weit weg an, wenn draußen dreißig Grad sind und man abends noch im Garten sitzt. Und doch entscheidet sich genau jetzt, wo die Weihnachtsfeier stattfindet. Wer bis in den Herbst wartet, hat bei den guten Terminen kaum noch eine Wahl. Wir schreiben das nicht, um Druck zu machen, sondern aus Erfahrung: Bei uns sind die beliebten Advent-Termine oft schon im Spätsommer vergeben.",
    sections: [
      {
        heading: "Warum August und September der richtige Zeitpunkt sind",
        body: [
          "Die Weihnachtsfeier-Saison ist kürzer, als man denkt. Interessant sind für die meisten Firmen die drei, vier Wochenenden im Advent — und die verteilen sich auf wenige Häuser in der Region. Rechnerisch geht das schnell nicht mehr auf.",
          "Wer früh plant, hat gleich mehrere Vorteile: Die beliebten Wochenenden am 1., 2. und 3. Advent sind zuerst weg. Im Spätsommer haben Restaurants noch Ruhe für ein gutes Gespräch. Und die Menü-Planung — Zutaten, Wein, Sonderwünsche, Unverträglichkeiten — braucht ohnehin etwas Vorlauf.",
          "Die Kehrseite kennt jeder, der schon einmal spät dran war: Wer erst im November bucht, nimmt oft das, was übrig ist — einen Dienstag statt des Freitags, ein Ausweichlokal statt der Wunsch-Location. Wer im Sommer plant, wählt aus. Wer im Herbst plant, nimmt, was übrig ist.",
        ],
      },
      {
        heading: "Worauf es bei der Wahl der Location ankommt",
        body: [
          "Ob eine Weihnachtsfeier gelingt, hängt weniger vom großen Programm ab als von ein paar handfesten Dingen. Größe und Flexibilität zum Beispiel: Kann der Ort mit zwölf Leuten genauso wie mit dreißig? Kleine Runden brauchen einen Rahmen, in dem sie nicht verloren wirken, größere genug Platz.",
          "Dann die Küche: Entsteht das Essen im Haus oder kommt es aus dem Karton? Fragt ruhig nach, wie viel selbst gekocht wird und woher die Zutaten stammen. Vegetarische und vegane Optionen sind heute keine Sonderlocke mehr, sondern eine Standard-Erwartung — eine gute Location hat dafür vollwertige Gerichte.",
          "Und schließlich die Kleinigkeiten, die am Abend viel ausmachen: Gibt es Parkplätze? Passt die Stimmung zum Team? Wie schnell und klar antwortet die Location auf Nachfragen? Wer schon bei der Anfrage verlässlich ist, ist es meist auch am Abend selbst.",
        ],
      },
      {
        heading: "Familiengeführt oder Kettenlokal?",
        body: [
          "Beide Modelle haben ihre Berechtigung, und es kommt auf die Runde an. In einem Familienbetrieb sprecht ihr mit den Menschen, die am Abend auch selbst am Herd stehen. Absprachen laufen direkt, kleine Häuser können flexibler auf Wünsche eingehen, und die Betreuung ist persönlich.",
          "Kettenlokale bieten dafür standardisierte Abläufe und größere Kapazitäten. Für kleine bis mittlere Runden ist ein Familienbetrieb aus unserer Sicht meist die stimmigere Wahl — nicht besser, sondern näher dran.",
        ],
      },
      {
        heading: "So plant ihr eure Weihnachtsfeier bei Wald & Wiese",
        body: [
          "Damit das nicht graue Theorie bleibt, kurz zu uns: Wald & Wiese ist ein familiengeführtes Restaurant in Sinzing, rund zehn Minuten von Regensburg-Süd, direkt am Waldrand mit Parkplätzen am Haus. Die Küche ist komplett hausgemacht und regional, vegetarisch und vegan gleichberechtigt. Für den Aperitif gibt es die Terrasse im Grünen — im Winter mit Heizstrahlern, wenn das Wetter mitspielt.",
          "Zur Wahl stehen drei Menü-Wege: klassisch mit drei Gängen, festlich mit vier Gängen und Aperitif, oder ein Buffet für größere Runden. Mehr Details findet ihr auf unserer Seite zur Weihnachtsfeier.",
          "Eine Anfrage ist schnell gemacht und unverbindlich: über die Weihnachtsfeier-Seite, per Mail an info@restaurant-waldwiese.de oder telefonisch bei Sven Leber unter 0160 4265772. Wir melden uns in der Regel innerhalb von 24 Stunden mit einem persönlichen Vorschlag zurück.",
        ],
      },
    ],
    faq: [
      {
        q: "Wann sollte man die Weihnachtsfeier buchen?",
        a: "Für die Wochenenden im Advent lohnt sich eine frühe Anfrage — schon im Spätsommer, also August oder September. Die beliebten Termine sind erfahrungsgemäß zuerst vergeben.",
      },
      {
        q: "Worauf sollte man bei der Location achten?",
        a: "Auf Größe und Flexibilität, hausgemachte statt zugekaufte Küche, vollwertige vegetarische und vegane Optionen, Erreichbarkeit und Parkplätze — und darauf, wie klar und schnell die Location auf Anfragen antwortet.",
      },
      {
        q: "Lohnt sich für eine kleine Feier ein Familienbetrieb?",
        a: "Für kleine bis mittlere Runden meist ja. Ihr plant direkt mit den Menschen, die kochen und servieren, Absprachen sind kurz und die Betreuung ist persönlich.",
      },
    ],
    related: [
      { label: "Weihnachtsfeier bei Wald & Wiese", href: "/weihnachtsfeier" },
      { label: "Feiern & Feste", href: "/feiern" },
      { label: "Über uns", href: "/ueber-uns" },
    ],
    cta: { label: "Weihnachtsfeier anfragen", href: "/weihnachtsfeier" },
    publishedAt: "2026-07-27",
  },
  {
    slug: "alkoholfrei-anstossen-regensburg",
    title: "Alkoholfrei anstoßen — ohne Kompromiss im Glas",
    metaTitle:
      "Alkoholfreie Cocktails & Spritz bei Regensburg | Wald & Wiese Sinzing",
    metaDescription:
      "Alkoholfrei anstoßen in Sinzing bei Regensburg: Gin Tonic, Moscow Mule, Mojito, Aperol Spritz und Hugo gibt es bei uns auch ohne Alkohol — dazu hausgemachte Limonaden und alkoholfreies Bio-Bier.",
    kicker: "Ratgeber · Trinken",
    teaser:
      "Wer nicht trinkt, bekommt Cola. So war das lange. Was heute alkoholfrei im Glas möglich ist — und was bei uns auf der Karte steht.",
    intro:
      "Am Tisch sitzt fast immer jemand, der nichts trinkt: weil er fährt, weil sie schwanger ist, weil morgen früh der Wecker klingelt oder einfach, weil keine Lust. Früher hieß das Cola oder Apfelschorle. Inzwischen geht deutlich mehr — und zwar ohne dass es nach Verzicht schmeckt.",
    sections: [
      {
        heading: "Warum alkoholfrei nicht mehr der Notnagel ist",
        body: [
          "Der entscheidende Unterschied liegt in den Grundstoffen. Statt den Alkohol einfach wegzulassen, gibt es heute alkoholfreie Destillate, Aperitifs und Sekte, die eigenständig gebaut sind — mit Botanicals, Bitterstoffen und Säure. Genau die Dinge also, die einen Drink interessant machen.",
          "Das ändert die Logik: Ein guter alkoholfreier Drink ist kein reduzierter Cocktail, sondern ein eigenes Rezept. Bitterkeit und Säure müssen die Rolle übernehmen, die sonst der Alkohol spielt — sonst wird es schnell nur süß.",
        ],
      },
      {
        heading: "Was bei uns alkoholfrei im Glas landet",
        body: [
          "Unsere Cocktails und Spritz stehen auf dem Aufsteller am Tisch — und bei den meisten steht gleich die alkoholfreie Variante daneben. Gin Tonic und Munich Mule bauen wir mit Wonderleaf statt Gin, der Moscow Mule kommt mit Ginger Beer und Limette, der Mojito mit Ginger Ale.",
          "Beim Spritz läuft es über alkoholfreien Sekt: Aperol Spritz wird zum Orange Spritz mit Sekt 0,0 und Soda, der Campari Spritz bekommt Monin Bitter, der Limoncello Spritz Pallini Limonzero. Auch den Hugo gibt es mit Sekt 0,0.",
          "Die alkoholfreien Varianten kosten je nach Drink 6,90 bis 9,50 Euro — teils günstiger als das Original, teils gleich teuer, weil die alkoholfreien Grundstoffe ihren Preis haben.",
        ],
      },
      {
        heading: "Jenseits der Cocktailkarte",
        body: [
          "Unsere Limonaden machen wir selbst — Erdbeer-Basilikum, Granatapfel-Rosmarin, Grapefruit-Hibiskus, Gurke-Basilikum und Karibischer Pfirsich, je 0,5 Liter eiskalt für 5,90 Euro. Sie sind weniger süß als gekaufte Limonade und vertragen sich deshalb auch gut zum Essen.",
          "Beim Bier setzen wir auf das Neumarkter Lammsbräu in Bio-Qualität, und zwar auch alkoholfrei: Helles, Dunkles Weizen und Radler. Wer einfach Wasser will, bekommt Bio-Kristallwasser medium oder still.",
        ],
      },
      {
        heading: "Ein Gedanke zum Gastgeben",
        body: [
          "Wenn du eine Feier planst, lohnt es sich, die alkoholfreie Auswahl genauso ernst zu nehmen wie die Weinkarte. Ein Tisch, auf dem alle etwas Schönes im Glas haben, fühlt sich anders an als einer, auf dem zwei Leute Mineralwasser trinken.",
          "Für größere Runden stimmen wir das gerne vorher mit euch ab — schreibt uns einfach.",
        ],
      },
    ],
    faq: [
      {
        q: "Gibt es bei Wald & Wiese alkoholfreie Cocktails?",
        a: "Ja. Gin Tonic und Munich Mule gibt es mit Wonderleaf statt Gin, den Moscow Mule mit Ginger Beer und Limette, den Mojito mit Ginger Ale. Die alkoholfreien Varianten kosten 7,90 bis 9,50 Euro.",
      },
      {
        q: "Gibt es Spritz auch ohne Alkohol?",
        a: "Ja. Aperol Spritz, Campari Spritz, Limoncello Spritz und Hugo gibt es mit alkoholfreiem Sekt 0,0 — je nach Drink für 6,90 bis 8,50 Euro.",
      },
      {
        q: "Was kostet eine hausgemachte Limonade?",
        a: "5,90 Euro für 0,5 Liter. Zur Auswahl stehen Erdbeer-Basilikum, Granatapfel-Rosmarin, Grapefruit-Hibiskus, Gurke-Basilikum und Karibischer Pfirsich.",
      },
      {
        q: "Habt ihr alkoholfreies Bier?",
        a: "Ja, vom Neumarkter Lammsbräu in Bio-Qualität: Helles und Dunkles Weizen (0,5 l, 4,90 Euro) sowie Dunkles und Natur Radler (0,33 l, 3,90 Euro).",
      },
    ],
    related: [
      { label: "Zur Getränkekarte", href: "/getraenke" },
      { label: "Feiern & Feste", href: "/feiern" },
      { label: "Zur Speisekarte", href: "/speisekarte" },
    ],
    cta: { label: "Tisch reservieren", href: "/reservieren" },
    publishedAt: "2026-10-06",
  },
  {
    slug: "was-kostet-brunch-regensburg",
    title: "Was kostet Brunch? Ein ehrlicher Blick auf die Rechnung",
    metaTitle:
      "Was kostet Brunch in Regensburg? Preise im Überblick | Wald & Wiese",
    metaDescription:
      "Was kostet Brunch bei Regensburg wirklich? Unsere aktuellen Preise: Frühstücke ab 11,90 €, Bowls 9,90 €, Mittagsgerichte ab 12,90 €, Kaffee ab 2,80 € — und warum à la carte oft günstiger ist als ein Buffet.",
    kicker: "Ratgeber · Gut zu wissen",
    teaser:
      "Brunch-Buffets starten oft bei 30 Euro pro Person. Warum à la carte meistens anders rechnet — mit unseren echten Preisen als Beispiel.",
    intro:
      "„Was kostet das denn ungefähr?“ ist eine völlig berechtigte Frage, die aber selten jemand stellt, bevor er sich hinsetzt. Dabei ist der Unterschied zwischen Buffet und à la carte erheblich — und zwar in beide Richtungen. Hier rechnen wir es offen durch, mit unseren Preisen.",
    sections: [
      {
        heading: "Buffet oder à la carte — zwei verschiedene Rechnungen",
        body: [
          "Beim Brunch-Buffet zahlst du einen Pauschalpreis pro Person, oft zwischen 25 und 40 Euro. Das lohnt sich, wenn du richtig Hunger hast und mehrere Runden gehst. Wer nur einen Kaffee und ein Croissant will, zahlt beim Buffet drauf.",
          "À la carte zahlst du, was du bestellst. Für den großen Hunger kann das ähnlich teuer werden, für den kleinen deutlich günstiger. Dafür kommt alles frisch aus der Küche statt vom Warmhaltebecken.",
        ],
      },
      {
        heading: "Unsere Preise, konkret",
        body: [
          "Die Frühstücke liegen zwischen 11,90 Euro für die süße Mizzi und 17,90 Euro für den guten alten Sepp oder die grüne Gretl. Den Sepp gibt es auch für zwei Personen, dann kostet er 32,90 Euro.",
          "Die Brote bewegen sich zwischen 11,90 und 16,90 Euro, die Bowls kosten jeweils 9,90 Euro. Ab 11:30 Uhr kommen die Mittagsgerichte dazu: Currywurst 12,90 Euro, Salat 12,90 Euro, Burger 13,90 bis 14,90 Euro.",
          "Beim Kaffee geht es bei 2,80 Euro für den Espresso los, der Cappuccino kostet 4,20 Euro, der Latte Macchiato 4,90 Euro. Für Kinder bis 12 Jahre gibt es den kleinen Hansi für 6,90 Euro.",
        ],
      },
      {
        heading: "Was zwei Personen realistisch zahlen",
        body: [
          "Zwei Frühstücke mit je einem Cappuccino landen bei rund 32 bis 44 Euro — je nachdem, ob es die süße Mizzi oder der große Sepp wird. Wer sich den Sepp zu zweit teilt und zwei Cappuccino dazu nimmt, ist bei etwa 41 Euro.",
          "Kleiner geht es auch: ein Brot und ein Kaffee liegen bei rund 16 bis 21 Euro pro Person. Wer nur eine Bowl und einen Espresso möchte, kommt mit knapp 13 Euro raus.",
        ],
      },
      {
        heading: "Woran man Qualität auch am Preis erkennt",
        body: [
          "Hausgemachtes kostet mehr in der Herstellung als zugekauftes. Bei uns sind Dips, Soßen, Aufstriche, Granola, Marmelade, Bananenbrot und die Desserts selbst gemacht — das steckt im Preis, aber eben auch im Teller.",
          "Dazu kommen die Lieferanten aus der Region: Gemüsebau Espach, Geflügelhof Hüttner, Metzgerei Schwindl, Bäckerei Biendl & Weber und der Weinkontor Sinzing. Kurze Wege sind nicht immer der billigste Weg, aber meist der bessere.",
          "Und wer vegan isst, bekommt bei uns kein Gericht, bei dem einfach etwas weggelassen wurde, sondern ein eigenes — zum gleichen Preisniveau wie alles andere.",
        ],
      },
    ],
    faq: [
      {
        q: "Was kostet Frühstück bei Wald & Wiese?",
        a: "Die Frühstücke kosten zwischen 11,90 und 17,90 Euro. Der gute alte Sepp ist für zwei Personen für 32,90 Euro zu haben, für Kinder bis 12 Jahre gibt es den kleinen Hansi für 6,90 Euro.",
      },
      {
        q: "Was kostet ein Kaffee?",
        a: "Espresso 2,80 Euro, Tasse Filterkaffee 3,20 Euro, Kaffee Crema 3,50 Euro, Cappuccino 4,20 Euro, Latte Macchiato 4,90 Euro. Alles auch entkoffeiniert, mit Hafermilch oder laktosefrei; Sirup kostet 1,00 Euro extra.",
      },
      {
        q: "Habt ihr ein Brunch-Buffet?",
        a: "Nein. Bei uns wird à la carte bestellt und frisch gekocht. Das heißt: Du zahlst, was du isst, statt einen Pauschalpreis.",
      },
      {
        q: "Was kostet ein Brunch für zwei Personen?",
        a: "Je nach Hunger ungefähr 35 bis 45 Euro für zwei Frühstücke mit Kaffee. Wer sich den guten alten Sepp zu zweit teilt und zwei Cappuccino dazu nimmt, liegt bei rund 41 Euro.",
      },
    ],
    related: [
      { label: "Zur Speisekarte", href: "/speisekarte" },
      { label: "Brunch Regensburg", href: "/brunch-regensburg" },
      { label: "Frühstück oder Brunch?", href: "/ratgeber/fruehstueck-oder-brunch-unterschied" },
    ],
    cta: { label: "Tisch reservieren", href: "/reservieren" },
    publishedAt: "2026-10-06",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
