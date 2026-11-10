import { Link } from 'react-router-dom';
import { usePokedexStore } from '../store/usePokedexStore';
import { PokemonCard } from '../components/PokemonCard';

export const FavoritesPage = () => {
  const favorites = usePokedexStore((state) => state.favorites);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="border-b-2 border-pokeBorder pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-pokeRed tracking-wide uppercase">
            POKÉMON FAVORIT
          </h1>
          <p className="text-sm font-medium text-gray-600">
            Daftar Pokémon yang Anda simpan di memori lokal.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-pokeRed text-white px-3 py-1 border border-pokeBorder">
          TOTAL: {favorites.length}
        </span>
      </div>

      {favorites.length === 0 && (
        <div className="bg-white border-2 border-pokeBorder p-12 text-center my-8 shadow-[4px_4px_0px_0px_rgba(44,44,44,1)]">
          <span className="text-5xl block mb-3">💔</span>
          <h3 className="text-xl font-black text-pokeBorder mb-2">
            Belum Ada Pokémon Favorit
          </h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
            Anda belum menambahkan Pokémon apa pun ke daftar favorit. Klik ikon hati (❤️) pada kartu Pokémon untuk menyimpannya di sini.
          </p>
          <Link
            to="/"
            className="inline-block bg-pokeRed text-white font-bold px-6 py-2.5 border-2 border-pokeBorder hover:bg-red-800 transition-colors uppercase text-sm shadow-[2px_2px_0px_0px_rgba(44,44,44,1)]"
          >
            Jelajahi Pokédex
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((id) => (
            <PokemonCard key={id} id={id} />
          ))}
        </div>
      )}
    </main>
  );
};