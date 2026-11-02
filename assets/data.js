/* Safraan catalogue. Concept data for a demo store. */
const U = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const SIZES = [
  { key: "10", label: "10 ml decant", mult: 0.19 },
  { key: "50", label: "50 ml", mult: 0.66 },
  { key: "100", label: "100 ml", mult: 1 },
];

const PRODUCTS = [
  {
    id: "saffron-atlas", name: "Saffron Atlas", origin: "Kashmir", family: "Spice",
    conc: "Extrait de parfum", price: 1180, tag: "Bestseller", img: "1638295916768-459f6cf440bc",
    mood: ["warm", "evening", "bold"],
    top: ["Saffron", "Pink pepper"], heart: ["Taif rose", "Suede"], base: ["Oud", "Ambergris"],
    desc: "Crimson saffron threads laid over Taif rose and a slow-burning oud base. Gold at first, smoke by midnight.",
    rating: 4.9, reviews: 212,
  },
  {
    id: "sandstone-oud", name: "Sandstone Oud", origin: "Assam", family: "Woods & Resins",
    conc: "Eau de parfum", price: 1240, tag: "New", img: "1743309043742-9b4976a16478",
    mood: ["warm", "evening", "bold"],
    top: ["Cardamom", "Bergamot"], heart: ["Agarwood", "Papyrus"], base: ["Sandalwood", "Labdanum"],
    desc: "Sun-warmed stone and wild agarwood. Dry, resinous and quietly addictive on skin.",
    rating: 4.8, reviews: 96,
  },
  {
    id: "dhofar-smoke", name: "Dhofar Smoke", origin: "Oman", family: "Woods & Resins",
    conc: "Eau de parfum", price: 1090, img: "1716857591457-7d7fa45199c6",
    mood: ["warm", "evening", "soft"],
    top: ["Elemi", "Black pepper"], heart: ["Frankincense", "Myrrh"], base: ["Cistus", "Vetiver"],
    desc: "Silver frankincense tears from the Dhofar hills, burned slowly in a cool stone room.",
    rating: 4.7, reviews: 141,
  },
  {
    id: "ylang-comore", name: "Ylang Comore", origin: "Comoros", family: "Florals",
    conc: "Eau de parfum", price: 960, tag: "Bestseller", img: "1720423514789-15a33e59fc81",
    mood: ["fresh", "day", "soft"],
    top: ["Neroli", "Mandarin"], heart: ["Ylang-ylang", "Jasmine sambac"], base: ["White musk", "Benzoin"],
    desc: "Creamy ylang-ylang picked at dawn on Grande Comore, softened with jasmine and clean musk.",
    rating: 4.8, reviews: 188,
  },
  {
    id: "frangipani-lune", name: "Frangipani Lune", origin: "Bali", family: "Florals",
    conc: "Eau de parfum", price: 920, img: "1760920250029-36af9369a0bb",
    mood: ["fresh", "day", "soft"],
    top: ["Coconut water", "Sea salt"], heart: ["Frangipani", "Tiare"], base: ["Sandalwood", "Driftwood"],
    desc: "A temple garden after rain. Frangipani and salt air over a pale, milky sandalwood.",
    rating: 4.6, reviews: 77,
  },
  {
    id: "java-vetiver", name: "Java Vetiver", origin: "Java", family: "Fresh",
    conc: "Eau de parfum", price: 880, img: "1705899853374-d91c048b81d2",
    mood: ["fresh", "day", "bold"],
    top: ["Grapefruit", "Ginger"], heart: ["Vetiver", "Clary sage"], base: ["Patchouli", "Cedar"],
    desc: "Green vetiver root with a bright grapefruit opening. The one you reach for at 7 a.m.",
    rating: 4.7, reviews: 133,
  },
  {
    id: "atlas-cedar", name: "Atlas Cedar", origin: "Morocco", family: "Woods & Resins",
    conc: "Eau de parfum", price: 990, img: "1749191745108-c636380b2898",
    mood: ["warm", "day", "soft"],
    top: ["Fig leaf", "Cumin"], heart: ["Atlas cedar", "Orris"], base: ["Tonka", "Cashmeran"],
    desc: "Cedar from the High Atlas, fig leaves and a soft tonka finish. Calm, polished, easy to wear.",
    rating: 4.6, reviews: 64,
  },
  {
    id: "nosy-be-vanilla", name: "Nosy Be Vanilla", origin: "Madagascar", family: "Ambers",
    conc: "Extrait de parfum", price: 1150, tag: "Limited", img: "1765031117402-93b2e530edec",
    mood: ["warm", "evening", "soft"],
    top: ["Dark rum", "Clove"], heart: ["Bourbon vanilla", "Tobacco leaf"], base: ["Tonka", "Benzoin"],
    desc: "Black vanilla pods cured in the sun, a splash of dark rum and dry tobacco leaf.",
    rating: 4.9, reviews: 254,
  },
  {
    id: "zanzibar-clove", name: "Zanzibar Clove", origin: "Zanzibar", family: "Spice",
    conc: "Eau de parfum", price: 940, img: "1594125311687-3b1b3eafa9f4",
    mood: ["fresh", "day", "bold"],
    top: ["Clove bud", "Ginger"], heart: ["Nutmeg", "Black tea"], base: ["Vetiver", "Guaiac wood"],
    desc: "Stone Town spice stalls at noon. Clove and ginger over smoky black tea.",
    rating: 4.5, reviews: 58,
  },
];

const FAMILIES = ["All", "Spice", "Woods & Resins", "Florals", "Ambers", "Fresh"];

const priceFor = (p, size = "100") => {
  const s = SIZES.find((x) => x.key === size) || SIZES[2];
  return Math.round((p.price * s.mult) / 5) * 5;
};
const money = (n) => "TT$" + n.toLocaleString("en-US");
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
