import { Link } from 'react-router-dom';
import { usePokedexStore } from '../store/usePokedexStore';
import { usePokemonDetailQuery } from '../hooks/usePokemon';
import {
  formatPokemonId,
  getGenerationFromId,
  getOfficialArtworkUrl,
  TYPE_TRANSLATIONS,
  TYPE_COLORS,
} from '../utils/pokemon';

interface PokemonCardProps {
  id: number;
  name?: string;
}

const CARD_BG_BY_TYPE: Record<string, string> = {
  grass: 'bg-[#e8f3e8]',
  fire: 'bg-[#fcf0e6]',
  water: 'bg-[#e8f1f8]',
  bug: 'bg-[#f0f4e4]',
  normal: 'bg-[#f0ede6]',
  poison: 'bg-[#f4eaf4]',
  electric: 'bg-[#fcf7e4]',
  ground: 'bg-[#f4efe4]',
  fairy: 'bg-[#fcf0f4]',
  fighting: 'bg-[#f8eae4]',
  psychic: 'bg-[#fcf0f0]',
  rock: 'bg-[#f4f0e4]',
  ghost: 'bg-[#ece8f4]',
  ice: 'bg-[#e8f8f8]',
  dragon: 'bg-[#e8eaf8]',
  steel: 'bg-[#ecf0f4]',
  dark: 'bg-[#e8e8e8]',
  flying: 'bg-[#eef0f8]',
};

export const PokemonCard = ({ id, name }: PokemonCardProps) => {
  const formattedId = formatPokemonId(id);
  const genName = getGenerationFromId(id);

  const favorite = usePokedexStore((state) => state.favorites.includes(id));
  const toggleFavorite = usePokedexStore((state) => state.toggleFavorite);

  const { data: detail } = usePokemonDetailQuery(id);
  const displayName = detail?.name ?? name ?? '...';

  const primaryType = detail?.types[0]?.type.name || 'normal';
  const cardBgColor = CARD_BG_BY_TYPE[primaryType] || 'bg-white';

  const totalBst = detail?.stats.reduce((acc, s) => acc + s.base_stat, 0) ?? 0;

  return (
    <div className="bg-pokeCard border-2 border-pokeBorder flex flex-col justify-between relative group hover:-translate-y-1 transition-transform shadow-[3px_3px_0px_0px_rgba(44,44,44,1)] overflow-hidden">
      <div className="flex justify-between items-center text-xs font-mono font-bold text-pokeBorder border-b-2 border-pokeBorder px-3 py-1.5 bg-white">
        <span>No. {formattedId}</span>
        
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 border border-pokeBorder px-1.5 py-0.5 rounded-sm text-[10px]">
            {genName}
          </span>
          <button
            onClick={() => toggleFavorite(id)}
            title={favorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            className="hover:scale-125 transition-transform text-sm leading-none p-0.5"
          >
            {favorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <Link to={`/pokemon/${id}`} className="flex-1 flex flex-col">
        <div className={`${cardBgColor} border-b-2 border-pokeBorder p-6 flex justify-center items-center h-44 transition-colors`}>
          <img
            src={getOfficialArtworkUrl(id)}
            alt={displayName}
            loading="lazy"
            className="h-36 w-36 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="p-3 flex justify-between items-end bg-pokeCard flex-1">
          <div>
            <h3 className="text-lg font-black text-pokeBorder capitalize tracking-wide mb-2">
              {displayName}
            </h3>

            <div className="flex flex-wrap gap-1">
              {detail?.types.map((t) => {
                const typeNameEn = t.type.name;
                const typeNameId = TYPE_TRANSLATIONS[typeNameEn] || typeNameEn;
                const color = TYPE_COLORS[typeNameEn] || { bg: 'bg-gray-400', text: 'text-white' };

                return (
                  <span
                    key={typeNameEn}
                    className={`text-[10px] font-bold px-2 py-0.5 border border-pokeBorder uppercase tracking-wider ${color.bg} ${color.text}`}
                  >
                    {typeNameId}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="border-2 border-pokeBorder bg-white px-2 py-1 text-center shadow-[2px_2px_0px_0px_rgba(44,44,44,1)]">
            <span className="block text-[9px] font-mono font-bold text-gray-500 uppercase leading-none">BST</span>
            <span className="text-sm font-black font-mono text-pokeBorder">{totalBst || '---'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};