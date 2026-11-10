import React from 'react';
import { usePokedexStore } from '../store/usePokedexStore';
import { useTypesListQuery, useTypeCountsQuery } from '../hooks/usePokemon';
import {
  GENERATION_RANGES,
  TOTAL_POKEMON,
  TYPE_SWATCH_COLORS,
  TYPE_TRANSLATIONS,
} from '../utils/pokemon';
import { FilterSelect, type FilterOption } from './FilterSelect';
import type { SortOption } from '../types';

const generationOptions: FilterOption[] = [
  { value: '', label: 'Semua', count: TOTAL_POKEMON, isAll: true },
  ...GENERATION_RANGES.map((g) => ({
    value: g.id.replace('gen-', ''),
    label: `Generasi ${g.name.replace('GEN ', '')} (${g.start}-${g.end})`,
    count: g.end - g.start + 1,
  })),
];

const sortOptions: FilterOption[] = [
  { value: 'nomor-asc', label: 'Nomor (Terkecil)', isAll: true },
  { value: 'nomor-desc', label: 'Nomor (Terbesar)' },
  { value: 'nama-asc', label: 'Nama (A-Z)' },
  { value: 'nama-desc', label: 'Nama (Z-A)' },
];

export const FilterPanel: React.FC = () => {
  const { filters, setFilters, resetFilters } = usePokedexStore();
  const { data: typesList = [] } = useTypesListQuery();
  const { data: typeCounts = {} } = useTypeCountsQuery(typesList);

  const typeOptions: FilterOption[] = [
    { value: '', label: 'Semua', count: TOTAL_POKEMON, isAll: true },
    ...typesList.map((t) => ({
      value: t,
      label: TYPE_TRANSLATIONS[t] || t,
      color: TYPE_SWATCH_COLORS[t],
      count: typeCounts[t] ?? '...',
    })),
  ];

  return (
    <div className="bg-pokeCard border-2 border-pokeBorder p-6 shadow-[4px_4px_0px_0px_rgba(59,42,26,1)] mb-8">
      <div className="mb-4">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Cari Pokémon atau nomor..."
          className="w-full bg-white border-2 border-pokeBorder px-4 py-2.5 text-xs font-mono font-bold text-pokeBorder placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(59,42,26,1)] focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center border-b-2 border-pokeBorder pb-2 mb-4">
        <span className="font-mono font-black text-xs uppercase text-pokeBorder">Filter & Urutkan</span>
        {(filters.search || filters.generation || filters.type || filters.sortBy !== 'nomor-asc') && (
          <button
            onClick={resetFilters}
            className="text-xs font-mono font-bold text-pokeRed underline hover:opacity-80"
          >
            Reset Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FilterSelect
          label="Generasi"
          value={filters.generation}
          onChange={(val) => setFilters({ generation: val })}
          options={generationOptions}
        />
        <FilterSelect
          label="Tipe"
          value={filters.type}
          onChange={(val) => setFilters({ type: val })}
          options={typeOptions}
        />
        <FilterSelect
          label="Urutkan"
          value={filters.sortBy}
          onChange={(val) => setFilters({ sortBy: val as SortOption })}
          options={sortOptions}
        />
      </div>
    </div>
  );
};
