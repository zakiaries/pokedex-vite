import React from 'react';
import { useFilteredPokemon } from '../hooks/useFilteredPokemon';
import { usePokedexStore } from '../store/usePokedexStore';
import { PokemonCard } from '../components/PokemonCard';
import { FilterPanel } from '../components/FilterPanel';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getPokemonIdFromUrl } from '../utils/pokemon';

const ITEMS_PER_PAGE = 20;

export const HomePage: React.FC = () => {
  const currentPage = usePokedexStore((state) => state.currentPage);
  const { filteredPokemon, isLoading, isError, refetch } = useFilteredPokemon();

  const totalItems = filteredPokemon.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredPokemon.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-pokeCard border-2 border-pokeBorder p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(59,42,26,1)] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-pokeRed uppercase tracking-widest">
            National Pokédex
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-pokeBorder tracking-tight mt-1">
            Pokédex
          </h1>
          <p className="text-xs md:text-sm font-mono text-gray-700 mt-2 max-w-2xl">
            Jelajahi seluruh 1.025 spesies dasar Pokédex Nasional. Cari nama atau nomor, lalu persempit daftar menurut generasi dan tipe.
          </p>
        </div>
        <div className="text-right font-mono text-xs font-bold text-pokeBorder border-2 border-pokeBorder bg-white p-3 shadow-[3px_3px_0px_0px_rgba(59,42,26,1)]">
          <span className="block text-pokeRed text-sm">001–1025</span>
          <span>GEN I–IX</span>
        </div>
      </div>

      <FilterPanel />

      <div className="flex justify-end mb-4">
        <span className="font-mono text-xs font-bold text-pokeBorder">
          {totalItems} Pokémon Ditemukan &bull; Halaman {currentPage} dari {totalPages}
        </span>
      </div>

      {isError ? (
        <div className="bg-red-100 border-2 border-pokeRed p-8 text-center font-mono shadow-[4px_4px_0px_0px_rgba(44,44,44,1)] my-6">
          <h3 className="text-base font-black text-pokeRed mb-2">Gagal Memuat Data</h3>
          <p className="text-xs text-gray-700 mb-4">Terjadi kendala jaringan saat menghubungkan ke peladen PokéAPI.</p>
          <button
            onClick={() => refetch()}
            className="bg-pokeRed text-white font-bold px-4 py-2 text-xs border border-pokeBorder uppercase shadow-[2px_2px_0px_0px_rgba(44,44,44,1)] cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      ) : isLoading ? (
        <LoadingSpinner message="Memproses Data Pokédex..." />
      ) : currentItems.length === 0 ? (
        <div className="bg-pokeCard border-2 border-pokeBorder p-12 text-center font-mono shadow-[4px_4px_0px_0px_rgba(44,44,44,1)]">
          <p className="text-base font-black text-pokeBorder mb-2">Tidak ada Pokémon yang cocok</p>
          <p className="text-xs text-gray-600">Coba ubah kata kunci pencarian atau atur ulang filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              id={getPokemonIdFromUrl(pokemon.url)}
              name={pokemon.name}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <Pagination totalPages={totalPages} />
      )}
    </main>
  );
};