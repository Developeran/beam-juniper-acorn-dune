export type ShkreliPosition = {
  symbol: string;
  side: "long" | "short";
  companyName: string;
  category?: string;
  description?: string;
};

export const SHKRELI_SHORTS: ShkreliPosition[] = [
  { symbol: "IONQ", side: "short", companyName: "IonQ, Inc.", category: "Quantum Computing" },
  { symbol: "CAPR", side: "short", companyName: "Capricor Therapeutics", category: "Biotech" },
  { symbol: "AGEN", side: "short", companyName: "Agenus Inc.", category: "Immuno-oncology" },
  { symbol: "TWST", side: "short", companyName: "Twist Bioscience", category: "Synthetic Biology" },
  { symbol: "SLS", side: "short", companyName: "SELLAS Life Sciences Group", category: "Biotech" },
  { symbol: "QBTS", side: "short", companyName: "D-Wave Quantum Inc.", category: "Quantum Computing" },
  { symbol: "SDGR", side: "short", companyName: "Schrödinger, Inc.", category: "Biotech / Software" },
  { symbol: "SNDK", side: "short", companyName: "SNDK", category: "Tech / Speculative" },
  { symbol: "CRWV", side: "short", companyName: "Crown Electrokinetics", category: "Clean Tech" },
  { symbol: "VKTX", side: "short", companyName: "Viking Therapeutics", category: "Metabolic / Obesity" },
  { symbol: "CLDX", side: "short", companyName: "Celldex Therapeutics", category: "Biotech" },
  { symbol: "CBRS", side: "short", companyName: "Cerebras / Cabaletta Bio", category: "Biotech / Tech" },
  { symbol: "QNT", side: "short", companyName: "Quant / Quanterix", category: "Diagnostics / Crypto" },
  { symbol: "RGTI", side: "short", companyName: "Rigetti Computing", category: "Quantum Computing" },
  { symbol: "BTQ", side: "short", companyName: "BTQ Technologies", category: "Post-Quantum Security" },
  { symbol: "KOD", side: "short", companyName: "Kodiak Sciences", category: "Ophthalmology" },
  { symbol: "IVA", side: "short", companyName: "Inventiva S.A.", category: "Biotech / NASH" },
  { symbol: "JAGX", side: "short", companyName: "Jaguar Health", category: "Commercial Biotech" },
];

export const SHKRELI_LONGS: ShkreliPosition[] = [
  { symbol: "RARE", side: "long", companyName: "Ultragenyx Pharmaceutical", category: "Rare Diseases" },
  { symbol: "PRAX", side: "long", companyName: "Praxis Precision Medicines", category: "CNS / Neurology" },
  { symbol: "SPRB", side: "long", companyName: "Spruce Biosciences", category: "Endocrinology" },
  { symbol: "ALNY", side: "long", companyName: "Alnylam Pharmaceuticals", category: "RNAi Therapeutics" },
  { symbol: "SPOT", side: "long", companyName: "Spotify Technology S.A.", category: "Digital Media" },
  { symbol: "ASND", side: "long", companyName: "Ascendis Pharma A/S", category: "Biopharma" },
  { symbol: "BCRX", side: "long", companyName: "BioCryst Pharmaceuticals", category: "Rare Diseases" },
  { symbol: "SYRE", side: "long", companyName: "Spyre Therapeutics", category: "IBD / Immunology" },
  { symbol: "ARGX", side: "long", companyName: "argenx SE", category: "Immunology" },
  { symbol: "RVMD", side: "long", companyName: "Revolution Medicines", category: "RAS Oncology" },
  { symbol: "XENE", side: "long", companyName: "Xenon Pharmaceuticals", category: "Neuroscience" },
  { symbol: "IRD", side: "long", companyName: "IRADIMED Corporation", category: "Medical Devices" },
  { symbol: "PTCT", side: "long", companyName: "PTC Therapeutics", category: "Rare Disorders" },
  { symbol: "MDGL", side: "long", companyName: "Madrigal Pharmaceuticals", category: "NASH / MASH" },
  { symbol: "RYTM", side: "long", companyName: "Rhythm Pharmaceuticals", category: "Rare Genetic Diseases" },
  { symbol: "CELC", side: "long", companyName: "Celcuity Inc.", category: "Precision Oncology" },
  { symbol: "DXYZ", side: "long", companyName: "Destiny Tech100", category: "Private Tech Fund" },
];

export const ALL_SHKRELI_POSITIONS: ShkreliPosition[] = [...SHKRELI_LONGS, ...SHKRELI_SHORTS];

export const SHKRELI_SHORT_SYMBOLS = SHKRELI_SHORTS.map((p) => p.symbol);
export const SHKRELI_LONG_SYMBOLS = SHKRELI_LONGS.map((p) => p.symbol);
export const ALL_SHKRELI_SYMBOLS = [...SHKRELI_LONG_SYMBOLS, ...SHKRELI_SHORT_SYMBOLS];
