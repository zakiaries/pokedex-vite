export const TOTAL_POKEMON = 1025;

export const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Api',
  water: 'Air',
  grass: 'Rumput',
  electric: 'Listrik',
  ice: 'Es',
  fighting: 'Petarung',
  poison: 'Racun',
  ground: 'Tanah',
  flying: 'Terbang',
  psychic: 'Psikis',
  bug: 'Serangga',
  rock: 'Batu',
  ghost: 'Hantu',
  dragon: 'Naga',
  dark: 'Kegelapan',
  steel: 'Baja',
  fairy: 'Peri',
};

export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal: { bg: 'bg-stone-200', text: 'text-stone-800' },
  fire: { bg: 'bg-red-600', text: 'text-white' },
  water: { bg: 'bg-blue-600', text: 'text-white' },
  grass: { bg: 'bg-emerald-700', text: 'text-white' },
  electric: { bg: 'bg-amber-400', text: 'text-stone-900' },
  ice: { bg: 'bg-cyan-200', text: 'text-cyan-950' },
  fighting: { bg: 'bg-orange-800', text: 'text-white' },
  poison: { bg: 'bg-purple-700', text: 'text-white' },
  ground: { bg: 'bg-amber-700', text: 'text-white' },
  flying: { bg: 'bg-indigo-300', text: 'text-indigo-950' },
  psychic: { bg: 'bg-pink-600', text: 'text-white' },
  bug: { bg: 'bg-lime-700', text: 'text-white' },
  rock: { bg: 'bg-stone-600', text: 'text-white' },
  ghost: { bg: 'bg-purple-900', text: 'text-white' },
  dragon: { bg: 'bg-indigo-800', text: 'text-white' },
  dark: { bg: 'bg-stone-900', text: 'text-white' },
  steel: { bg: 'bg-slate-500', text: 'text-white' },
  fairy: { bg: 'bg-pink-300', text: 'text-pink-950' },
};

// Warna solid (hex) untuk kotak kecil di dropdown filter tipe
export const TYPE_SWATCH_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const GENERATION_RANGES = [
  { id: 'gen-1', name: 'GEN I', label: 'Generasi I (Kanto)', start: 1, end: 151 },
  { id: 'gen-2', name: 'GEN II', label: 'Generasi II (Johto)', start: 152, end: 251 },
  { id: 'gen-3', name: 'GEN III', label: 'Generasi III (Hoenn)', start: 252, end: 386 },
  { id: 'gen-4', name: 'GEN IV', label: 'Generasi IV (Sinnoh)', start: 387, end: 493 },
  { id: 'gen-5', name: 'GEN V', label: 'Generasi V (Unova)', start: 494, end: 649 },
  { id: 'gen-6', name: 'GEN VI', label: 'Generasi VI (Kalos)', start: 650, end: 721 },
  { id: 'gen-7', name: 'GEN VII', label: 'Generasi VII (Alola)', start: 722, end: 809 },
  { id: 'gen-8', name: 'GEN VIII', label: 'Generasi VIII (Galar)', start: 810, end: 905 },
  { id: 'gen-9', name: 'GEN IX', label: 'Generasi IX (Paldea)', start: 906, end: 1025 },
];

// gen: '1'..'9' (nilai filter generasi di store)
export const getGenerationRange = (gen: string) =>
  GENERATION_RANGES.find((g) => g.id === `gen-${gen}`);

export const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export const formatPokemonId = (id: number | string): string => {
  return String(id).padStart(4, '0');
};

export const getGenerationFromId = (id: number): string => {
  const gen = GENERATION_RANGES.find((g) => id >= g.start && id <= g.end);
  return gen ? gen.name : 'GEN I';
};

export const getOfficialArtworkUrl = (id: number | string): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};