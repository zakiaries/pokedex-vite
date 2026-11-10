import { useQuery } from '@tanstack/react-query';
import {
  fetchAllPokemon,
  fetchEvolutionChain,
  fetchPokemonByType,
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchTypeCounts,
  fetchTypesList,
} from '../api/pokeapi';

const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

export const useAllPokemonQuery = () =>
  useQuery({
    queryKey: ['pokemon-all'],
    queryFn: fetchAllPokemon,
    staleTime: ONE_HOUR,
  });

export const usePokemonDetailQuery = (idOrName: number | string) =>
  useQuery({
    queryKey: ['pokemon-detail', idOrName],
    queryFn: () => fetchPokemonDetail(idOrName),
    enabled: !!idOrName,
    staleTime: ONE_HOUR,
  });

export const usePokemonSpeciesQuery = (idOrName: number | string) =>
  useQuery({
    queryKey: ['pokemon-species', idOrName],
    queryFn: () => fetchPokemonSpecies(idOrName),
    enabled: !!idOrName,
    staleTime: ONE_HOUR,
  });

export const useEvolutionChainQuery = (evolutionChainUrl?: string) =>
  useQuery({
    queryKey: ['evolution-chain', evolutionChainUrl],
    queryFn: () => (evolutionChainUrl ? fetchEvolutionChain(evolutionChainUrl) : null),
    enabled: !!evolutionChainUrl,
    staleTime: ONE_HOUR,
  });

export const useTypesListQuery = () =>
  useQuery({
    queryKey: ['types-list'],
    queryFn: fetchTypesList,
    staleTime: ONE_DAY,
  });

export const usePokemonByTypeQuery = (typeName: string) =>
  useQuery({
    queryKey: ['pokemon-by-type', typeName],
    queryFn: () => fetchPokemonByType(typeName),
    enabled: !!typeName,
    staleTime: ONE_HOUR,
  });

export const useTypeCountsQuery = (types: string[]) =>
  useQuery({
    queryKey: ['pokemon-type-counts', types],
    queryFn: () => fetchTypeCounts(types),
    enabled: types.length > 0,
    staleTime: ONE_DAY,
  });
