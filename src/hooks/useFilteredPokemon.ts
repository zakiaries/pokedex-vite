import { useMemo } from 'react';
import { useAllPokemonQuery, usePokemonByTypeQuery } from './usePokemon';
import { usePokedexStore } from '../store/usePokedexStore';
import { formatPokemonId, getGenerationRange, getPokemonIdFromUrl } from '../utils/pokemon';

export const useFilteredPokemon = () => {
  const filters = usePokedexStore((state) => state.filters);

  const { data: allPokemon, isLoading: loadingAll, isError, refetch } = useAllPokemonQuery();
  const { data: namesByType, isLoading: loadingByType } = usePokemonByTypeQuery(filters.type);

  const filteredPokemon = useMemo(() => {
    let result = allPokemon?.results ?? [];

    if (filters.type && namesByType) {
      result = result.filter((p) => namesByType.includes(p.name));
    }

    if (filters.generation) {
      const range = getGenerationRange(filters.generation);
      if (range) {
        result = result.filter((p) => {
          const id = getPokemonIdFromUrl(p.url);
          return id >= range.start && id <= range.end;
        });
      }
    }

    if (filters.search) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter((p) => {
        const id = getPokemonIdFromUrl(p.url);
        return (
          p.name.toLowerCase().includes(query) ||
          String(id).includes(query) ||
          formatPokemonId(id).includes(query)
        );
      });
    }

    return [...result].sort((a, b) => {
      const idA = getPokemonIdFromUrl(a.url);
      const idB = getPokemonIdFromUrl(b.url);

      if (filters.sortBy === 'nomor-desc') return idB - idA;
      if (filters.sortBy === 'nama-asc') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'nama-desc') return b.name.localeCompare(a.name);
      return idA - idB;
    });
  }, [allPokemon, namesByType, filters]);

  return {
    filteredPokemon,
    isLoading: loadingAll || (!!filters.type && loadingByType),
    isError,
    refetch,
  };
};
