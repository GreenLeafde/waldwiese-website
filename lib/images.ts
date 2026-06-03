/**
 * Zentrales Bilder-Register. Alle Pfade relativ zu /public.
 * Quelle: überwiegend aus der bestehenden restaurant-waldwiese.de,
 * dazu das Avocado-Foto aus dem Projektordner.
 *
 * Vor Launch idealerweise durch echte Fotoshoot-Bilder ersetzen —
 * dann muss nur diese Datei angefasst werden.
 */
export const IMG = {
  hero: {
    src: "/photos/fruehstueck-avocado-toast.jpg",
    alt: "Avocado-Toast mit Kresse und Cherrytomaten auf Sauerteig",
    width: 1600,
    height: 2400,
  },
  // Echtes Gästefoto (2026-06): Frühstück auf der Terrasse
  fruehstueckFoto: {
    src: "/photos/fruehstueck-sauerteig.jpg",
    alt: "Frühstück in der Sonne: Sauerteigbrote mit Lachs, Avocado, Rucola, eingelegten Zwiebeln und Sesam, dazu ein Glas Orangensaft",
    width: 900,
    height: 1600,
  },
  haus: {
    src: "/photos/haus-sw.webp",
    alt: "Das Haus von Wald & Wiese in Sinzing, schwarz-weiß",
    width: 1080,
    height: 1350,
  },
  teamPortrait: {
    src: "/photos/team-portrait.jpg",
    alt: "Familie Leber — Wald & Wiese",
    width: 1675,
    height: 2283,
  },
  interiorWarm: {
    src: "/photos/interior-warm.jpg",
    alt: "Warmer Innenraum mit Pflanzen",
    width: 1150,
    height: 2048,
  },
  foodShot1: {
    src: "/photos/food-shot-1.jpg",
    alt: "Gericht aus der Wald & Wiese-Küche",
    width: 1477,
    height: 1962,
  },
  foodShot2: {
    src: "/photos/food-shot-2.jpg",
    alt: "Gericht aus der Wald & Wiese-Küche",
    width: 2040,
    height: 930,
  },
  foodBowl: {
    src: "/photos/food-bowl.jpg",
    alt: "Bowl mit Gemüse und Körnern",
    width: 1600,
    height: 1600,
  },
  foodBurger: {
    src: "/photos/food-burger.jpg",
    alt: "Burger mit Salat",
    width: 1600,
    height: 1329,
  },
  foodBreakfast: {
    src: "/photos/food-breakfast-spread.jpg",
    alt: "Frühstückstisch mit Brot, Kaffee und Obst",
    width: 1600,
    height: 1067,
  },
  // Echte Restaurant-Fotos von restaurant-waldwiese.de
  wwFood1: {
    src: "/photos/ww-00002.jpeg",
    alt: "Gericht aus dem Wald & Wiese",
    width: 1600,
    height: 899,
  },
  wwFood2: {
    src: "/photos/ww-00003.jpeg",
    alt: "Gericht aus dem Wald & Wiese",
    width: 1600,
    height: 899,
  },
  wwFood3: {
    src: "/photos/ww-00008.jpeg",
    alt: "Gericht aus dem Wald & Wiese",
    width: 1600,
    height: 899,
  },
  wwFood4: {
    src: "/photos/ww-00009.jpeg",
    alt: "Gericht aus dem Wald & Wiese",
    width: 899,
    height: 1600,
  },
  wwFood5: {
    src: "/photos/ww-00010.jpeg",
    alt: "Gericht aus dem Wald & Wiese",
    width: 899,
    height: 1600,
  },
  wwEvent: {
    src: "/photos/ww-event.jpg",
    alt: "Wald & Wiese Restaurant",
    width: 1536,
    height: 1025,
  },
  // Aufgeklärte Inhalte der "scene-*" Dateien (vom Live-Site übernommen):
  burger: {
    src: "/photos/scene-dinner.png",
    alt: "Burger mit Ziegenkäse und Rucola — die mähende Moni",
    width: 1024,
    height: 683,
  },
  kartoffelspalten: {
    src: "/photos/scene-table.png",
    alt: "Würzige Kartoffelspalten",
    width: 1536,
    height: 1024,
  },
  dipsBowls: {
    src: "/photos/scene-portrait.png",
    alt: "Vielfalt an Dips und Aufstrichen",
    width: 683,
    height: 1024,
  },
  pistazientiramisu: {
    src: "/photos/scene-warm.png",
    alt: "Pistazientiramisu mit Himbeeren — unser Klassiker",
    width: 1536,
    height: 1024,
  },
  interiorScene: {
    src: "/photos/scene-festive.png",
    alt: "Innenraum mit Gästen — Wald & Wiese",
    width: 1024,
    height: 683,
  },
  steak: {
    src: "/photos/scene-vertical.png",
    alt: "Steak mit Kräuterbutter",
    width: 1024,
    height: 1536,
  },
  teamBar: {
    src: "/photos/dessert-square.png",
    alt: "Team vom Wald & Wiese an der Bar",
    width: 1024,
    height: 1024,
  },
  cocktail: {
    src: "/photos/cocktail.webp",
    alt: "Cocktail mit frischer Minze",
    width: 1667,
    height: 2500,
  },
  hundTerrasse: {
    src: "/photos/hund-terrasse.jpg",
    alt: "Hund liegt entspannt auf der Restaurant-Terrasse",
    width: 2000,
    height: 2997,
  },
  hundWald: {
    src: "/photos/hund-wald.jpg",
    alt: "Zwei Hunde sitzen entspannt im sonnendurchfluteten Wald",
    width: 1195,
    height: 896,
  },
  teamSven: {
    src: "/photos/interior-warm.jpg",
    alt: "Sven Leber an der Bar mit Cocktail-Shaker",
    width: 1150,
    height: 2048,
  },
  teamKueche: {
    src: "/photos/dessert-square.png",
    alt: "Tanja, Julia und Kollegin im Wald & Wiese — Küchen- und Service-Team",
    width: 1024,
    height: 1024,
  },
  teamFamilie: {
    src: "/photos/team-familie.jpg",
    alt: "Familie Leber — Tanja, Sven, Sophia, Julia und Emilian",
    width: 1024,
    height: 1536,
  },
  magicBalloon: {
    src: "/photos/magic-balloon.jpg",
    alt: "Magicel (Emilian Leber) bei der Tischzauberei mit rotem Luftballon",
    width: 3335,
    height: 5000,
  },
  magicCards: {
    src: "/photos/magic-cards.jpg",
    alt: "Magicel mit Spielkarten beim Magic Dinner",
    width: 5000,
    height: 3335,
  },

  // Echte Terrassen- & Gebäudefotos (vom Betreiber, 2026-06)
  terrasseOlivenbaum: {
    src: "/photos/terrasse-olivenbaum.jpg",
    alt: "Terrasse von Wald & Wiese mit Olivenbaum, im Grünen am Waldrand",
    width: 1500,
    height: 2000,
  },
  terrasseTische: {
    src: "/photos/terrasse-tische.jpg",
    alt: "Terrasse mit gedeckten Tischen und Loungemöbeln im Grünen",
    width: 1500,
    height: 2000,
  },
  gebaeudeAbend: {
    src: "/photos/gebaeude-abend.jpg",
    alt: "Wald & Wiese bei Abendlicht — Holzfassade, beleuchtete Fenster, Eingang",
    width: 1506,
    height: 2000,
  },
  gebaeudeLuft: {
    src: "/photos/gebaeude-luft.webp",
    alt: "Wald & Wiese in Sinzing von oben, am Waldrand",
    width: 1600,
    height: 1200,
  },

  // Alias-Kompatibilität für ältere Verwendungen
  dessert: {
    src: "/photos/scene-warm.png",
    alt: "Pistazientiramisu mit Himbeeren",
    width: 1536,
    height: 1024,
  },
  sceneDinner: {
    src: "/photos/scene-dinner.png",
    alt: "Burger Closeup",
    width: 1024,
    height: 683,
  },
  sceneTable: {
    src: "/photos/scene-table.png",
    alt: "Würzige Kartoffelspalten",
    width: 1536,
    height: 1024,
  },
  scenePortrait: {
    src: "/photos/scene-portrait.png",
    alt: "Vielfalt an Dips und Aufstrichen",
    width: 683,
    height: 1024,
  },
  sceneWarm: {
    src: "/photos/scene-warm.png",
    alt: "Pistazientiramisu",
    width: 1536,
    height: 1024,
  },
  sceneFestive: {
    src: "/photos/scene-festive.png",
    alt: "Restaurant Innenraum mit Gästen",
    width: 1024,
    height: 683,
  },
  sceneVertical: {
    src: "/photos/scene-vertical.png",
    alt: "Steak mit Kräuterbutter",
    width: 1024,
    height: 1536,
  },
} as const;
