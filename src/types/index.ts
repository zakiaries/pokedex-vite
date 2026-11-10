export interface PokemonBase {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBase[];
}

export interface TypeResponse {
  pokemon: { pokemon: PokemonBase }[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number; // dalam desimeter
  weight: number; // dalam hektogram
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  color: { name: string };
  habitat: { name: string } | null;
  egg_groups: { name: string }[];
  capture_rate: number;
  growth_rate: { name: string };
  evolution_chain: { url: string };
  genera: { genus: string; language: { name: string } }[];
}

export interface EvolutionChainNode {
  species: { name: string; url: string };
  evolves_to: EvolutionChainNode[];
}

export interface EvolutionChainResponse {
  chain: EvolutionChainNode;
}

export type SortOption = 'nomor-asc' | 'nomor-desc' | 'nama-asc' | 'nama-desc';

export interface PokedexFilters {
  search: string;
  generation: string;
  type: string;
  sortBy: SortOption;
}