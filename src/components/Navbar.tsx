import { Link, useLocation } from 'react-router-dom';
import { usePokedexStore } from '../store/usePokedexStore';

export const Navbar = () => {
  const location = useLocation();
  const favorites = usePokedexStore((state) => state.favorites);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-pokeBg border-b-2 border-pokeBorder sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-black text-pokeRed tracking-widest uppercase flex items-center gap-2">
          <span>POKÉMON</span>
        </Link>

        <nav className="flex gap-3 font-bold text-sm">
          <Link
            to="/"
            className={`px-4 py-1.5 border-2 border-pokeBorder transition-all ${
              isActive('/')
                ? 'bg-pokeRed text-white shadow-[2px_2px_0px_0px_rgba(44,44,44,1)]'
                : 'bg-white text-pokeBorder hover:bg-gray-100'
            }`}
          >
            POKÉDEX
          </Link>
          <Link
            to="/favorites"
            className={`px-4 py-1.5 border-2 border-pokeBorder flex items-center gap-2 transition-all ${
              isActive('/favorites')
                ? 'bg-pokeRed text-white shadow-[2px_2px_0px_0px_rgba(44,44,44,1)]'
                : 'bg-white text-pokeBorder hover:bg-gray-100'
            }`}
          >
            <span>FAVORIT</span>
            <span
              className={`text-xs px-2 py-0.5 font-black border border-pokeBorder ${
                isActive('/favorites') ? 'bg-white text-pokeRed' : 'bg-pokeRed text-white'
              }`}
            >
              {favorites.length}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};