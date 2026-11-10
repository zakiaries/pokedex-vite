import axios from 'axios';
import type {
  EvolutionChainResponse,
  PokemonDetail,
  PokemonListResponse,
  PokemonSpecies,
  TypeResponse,
} from '../types';
import { TOTAL_POKEMON, getPokemonIdFromUrl } from '../utils/pokemon';

const client = axios.create({ baseURL: 'https://pokeapi.co/api/v2' });

const IGNORED_TYPES = ['unknown', 'shadow', 'stellar'];

export const fetchAllPokemon = async (): Promise<PokemonListResponse> => {
  const { data } = await client.get<PokemonListResponse>('/pokemon', {
    params: { limit: TOTAL_POKEMON },
  });
  return data;
};

export const fetchPokemonDetail = async (idOrName: number | string): Promise<PokemonDetail> => {
  const { data } = await client.get<PokemonDetail>(`/pokemon/${idOrName}`);
  return data;
};

export const fetchPokemonSpecies = async (idOrName: number | string): Promise<PokemonSpecies> => {
  const { data } = await client.get<PokemonSpecies>(`/pokemon-species/${idOrName}`);
  return data;
};

export const fetchEvolutionChain = async (url: string): Promise<EvolutionChainResponse> => {
  const { data } = await client.get<EvolutionChainResponse>(url);
  return data;
};

export const fetchTypesList = async (): Promise<string[]> => {
  const { data } = await client.get<{ results: { name: string }[] }>('/type');
  return data.results.map((t) => t.name).filter((name) => !IGNORED_TYPES.includes(name));
};

export const fetchPokemonByType = async (type: string): Promise<string[]> => {
  const { data } = await client.get<TypeResponse>(`/type/${type}`);
  return data.pokemon
    .map((entry) => entry.pokemon)
    .filter((p) => getPokemonIdFromUrl(p.url) <= TOTAL_POKEMON)
    .map((p) => p.name);
};

export const fetchTypeCounts = async (types: string[]): Promise<Record<string, number>> => {
  const entries = await Promise.all(
    types.map(async (type) => {
      try {
        const names = await fetchPokemonByType(type);
        return [type, names.length] as const;
      } catch {
        return [type, 0] as const;
      }
    })
  );
  return Object.fromEntries(entries);
};
