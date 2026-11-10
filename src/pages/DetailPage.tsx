import { useParams, Link } from 'react-router-dom';
import {
  usePokemonDetailQuery,
  usePokemonSpeciesQuery,
  useEvolutionChainQuery,
} from '../hooks/usePokemon';
import { usePokedexStore } from '../store/usePokedexStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { EvolutionChainNode } from '../types';
import {
  formatPokemonId,
  getOfficialArtworkUrl,
  getGenerationFromId,
  TYPE_TRANSLATIONS,
  TYPE_COLORS,
  getPokemonIdFromUrl,
} from '../utils/pokemon';

const COLOR_TRANSLATIONS: Record<string, string> = {
  green: 'Hijau',
  red: 'Merah',
  blue: 'Biru',
  yellow: 'Kuning',
  brown: 'Cokelat',
  purple: 'Ungu',
  pink: 'Merah Muda',
  gray: 'Abu-abu',
  white: 'Putih',
  black: 'Hitam',
};

const HABITAT_TRANSLATIONS: Record<string, string> = {
  grassland: 'Padang Rumput',
  forest: 'Hutan',
  waters_edge: 'Pinggir Perairan',
  sea: 'Lautan',
  cave: 'Gua',
  mountain: 'Gunung',
  rough_terrain: 'Medan Terjal',
  urban: 'Perkotaan',
  rare: 'Langka',
};

const parseEvolutionChain = (
  node: EvolutionChainNode,
  arr: { name: string; id: number }[] = []
): { name: string; id: number }[] => {
  const id = getPokemonIdFromUrl(node.species.url);
  arr.push({ name: node.species.name, id });
  node.evolves_to.forEach((next) => parseEvolutionChain(next, arr));
  return arr;
};

export const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);

  const { data: pokemon, isLoading: loadingDetail, isError } = usePokemonDetailQuery(pokemonId);
  const { data: species, isLoading: loadingSpecies } = usePokemonSpeciesQuery(pokemonId);
  const { data: evolutionData } = useEvolutionChainQuery(species?.evolution_chain?.url);

  const favorite = usePokedexStore((state) => state.favorites.includes(pokemonId));
  const toggleFavorite = usePokedexStore((state) => state.toggleFavorite);

  if (loadingDetail || loadingSpecies) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-pokeCard border-2 border-pokeBorder p-12 shadow-[6px_6px_0px_0px_rgba(44,44,44,1)] text-center">
          <LoadingSpinner message="Membuka Data Detail Pokémon..." />
        </div>
      </main>
    );
  }

  if (isError || !pokemon) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border-2 border-pokeRed p-8 shadow-[4px_4px_0px_0px_rgba(44,44,44,1)]">
          <h2 className="text-xl font-bold text-pokeRed mb-2">Detail Pokémon Tidak Ditemukan</h2>
          <Link
            to="/"
            className="inline-block bg-pokeRed text-white font-bold px-4 py-2 border border-pokeBorder hover:bg-red-800 transition-colors uppercase text-sm"
          >
            ◄ Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const formattedId = formatPokemonId(pokemon.id);
  const genName = getGenerationFromId(pokemon.id);
  const totalBst = pokemon.stats.reduce((acc: number, s: { base_stat: number }) => acc + s.base_stat, 0);
  const genusName = species?.genera?.find((g: { language: { name: string } }) => g.language.name === 'en')?.genus || 'Pokémon';
  const colorId = species?.color?.name ? COLOR_TRANSLATIONS[species.color.name] || species.color.name : '-';
  const habitatId = species?.habitat?.name ? HABITAT_TRANSLATIONS[species.habitat.name] || species.habitat.name : 'Lainnya';

  const evolutionList = evolutionData ? parseEvolutionChain(evolutionData.chain) : [{ name: pokemon.name, id: pokemon.id }];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-pokeBorder font-bold px-4 py-2 border-2 border-pokeBorder hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(44,44,44,1)] transition-all text-sm uppercase"
        >
          <span>◄</span> Kembali ke Pokédex
        </Link>

        <button
          onClick={() => toggleFavorite(pokemon.id)}
          className={`px-4 py-2 font-bold border-2 border-pokeBorder flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_rgba(44,44,44,1)] ${
            favorite ? 'bg-red-100 text-pokeRed' : 'bg-white text-pokeBorder hover:bg-gray-100'
          }`}
        >
          <span>{favorite ? '❤️' : '🤍'}</span>
          <span>{favorite ? 'Dalam Favorit' : 'Tambah Favorit'}</span>
        </button>
      </div>

      <div className="bg-pokeCard border-2 border-pokeBorder grid grid-cols-1 md:grid-cols-12 shadow-[6px_6px_0px_0px_rgba(44,44,44,1)] mb-10 overflow-hidden">
        <div className="md:col-span-5 bg-white border-b-2 md:border-b-0 md:border-r-2 border-pokeBorder p-8 flex justify-center items-center relative">
          <img
            src={getOfficialArtworkUrl(pokemon.id)}
            alt={pokemon.name}
            className="h-72 w-72 object-contain drop-shadow-xl"
          />
        </div>

        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="p-6 border-b-2 border-pokeBorder">
            <div className="text-xs font-mono font-bold text-gray-600 mb-1">
              No. {formattedId} &bull; {genName}
            </div>
            <h1 className="text-4xl font-black text-pokeBorder capitalize tracking-wide mb-1">
              {pokemon.name}
            </h1>
            <p className="text-sm font-medium text-gray-600 italic mb-4">{genusName}</p>

            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((t: { type: { name: string } }) => {
                const typeEn = t.type.name;
                const typeId = TYPE_TRANSLATIONS[typeEn] || typeEn;
                const color = TYPE_COLORS[typeEn] || { bg: 'bg-gray-400', text: 'text-white' };
                return (
                  <span
                    key={typeEn}
                    className={`text-xs font-bold px-3 py-1 border border-pokeBorder uppercase tracking-wider ${color.bg} ${color.text}`}
                  >
                    {typeId}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 bg-gray-50 text-xs font-mono border-t-2 border-pokeBorder">
            <div className="p-4 border-r-2 border-b-2 border-pokeBorder">
              <span className="text-gray-500 block uppercase font-bold mb-1">Tinggi</span>
              <span className="text-lg font-black text-pokeBorder">{pokemon.height / 10} m</span>
            </div>
            <div className="p-4 border-b-2 border-pokeBorder">
              <span className="text-gray-500 block uppercase font-bold mb-1">Berat</span>
              <span className="text-lg font-black text-pokeBorder">{pokemon.weight / 10} kg</span>
            </div>
            <div className="p-4 border-r-2 border-pokeBorder">
              <span className="text-gray-500 block uppercase font-bold mb-1">Warna</span>
              <span className="text-base font-black text-pokeBorder capitalize">{colorId}</span>
            </div>
            <div className="p-4">
              <span className="text-gray-500 block uppercase font-bold mb-1">Habitat</span>
              <span className="text-base font-black text-pokeBorder capitalize">{habitatId}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-black text-pokeBorder uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-pokeRed font-mono">01</span> PERBANDINGANNYA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-pokeBorder p-4 shadow-[3px_3px_0px_0px_rgba(44,44,44,1)]">
            <span className="text-xs font-bold text-gray-500 uppercase">Tinggi</span>
            <div className="text-2xl font-black font-mono text-pokeRed my-1">{pokemon.height / 10} m</div>
            <div className="text-xs text-gray-600 border-t border-gray-200 pt-2 flex justify-between">
              <span>Rata-rata Spesies</span>
              <span className="font-bold">Normal</span>
            </div>
          </div>
          <div className="bg-white border-2 border-pokeBorder p-4 shadow-[3px_3px_0px_0px_rgba(44,44,44,1)]">
            <span className="text-xs font-bold text-gray-500 uppercase">Berat</span>
            <div className="text-2xl font-black font-mono text-pokeRed my-1">{pokemon.weight / 10} kg</div>
            <div className="text-xs text-gray-600 border-t border-gray-200 pt-2 flex justify-between">
              <span>Rata-rata Spesies</span>
              <span className="font-bold">Normal</span>
            </div>
          </div>
          <div className="bg-white border-2 border-pokeBorder p-4 shadow-[3px_3px_0px_0px_rgba(44,44,44,1)]">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Statistik Dasar (BST)</span>
            <div className="text-2xl font-black font-mono text-pokeRed my-1">{totalBst}</div>
            <div className="text-xs text-gray-600 border-t border-gray-200 pt-2 flex justify-between">
              <span>Kategori</span>
              <span className="font-bold">{totalBst > 450 ? 'Kuat' : 'Standar'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-pokeCard border-2 border-pokeBorder p-6 shadow-[4px_4px_0px_0px_rgba(44,44,44,1)]">
          <h3 className="text-sm font-black text-pokeBorder uppercase tracking-wider border-b-2 border-pokeBorder pb-2 mb-4">
            Kemampuan (Abilities)
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {pokemon.abilities.map((a: { ability: { name: string }; is_hidden: boolean }) => (
              <span
                key={a.ability.name}
                className="bg-white border border-pokeBorder px-3 py-1 text-xs font-bold text-pokeBorder capitalize shadow-[2px_2px_0px_0px_rgba(44,44,44,1)]"
              >
                {a.ability.name.replace('-', ' ')}
                {a.is_hidden && <span className="text-pokeRed ml-1 text-[10px]">(TERSEMBUNYI)</span>}
              </span>
            ))}
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Tingkat Tangkapan (Capture Rate)</span>
              <span className="font-bold text-pokeBorder">{species?.capture_rate ?? '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Laju Pertumbuhan</span>
              <span className="font-bold text-pokeBorder capitalize">{species?.growth_rate?.name ?? '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Kelompok Telur (Egg Groups)</span>
              <span className="font-bold text-pokeBorder capitalize">
                {species?.egg_groups?.map((e: { name: string }) => e.name).join(', ') ?? '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-pokeCard border-2 border-pokeBorder p-6 shadow-[4px_4px_0px_0px_rgba(44,44,44,1)]">
          <div className="flex justify-between items-center border-b-2 border-pokeBorder pb-2 mb-4">
            <h3 className="text-sm font-black text-pokeBorder uppercase tracking-wider">
              Statistik Dasar
            </h3>
            <span className="font-mono font-black text-pokeRed text-base">{totalBst}</span>
          </div>
          <div className="space-y-3">
            {pokemon.stats.map((s: { stat: { name: string }; base_stat: number }) => (
              <div key={s.stat.name}>
                <div className="flex justify-between text-xs font-mono font-bold mb-1">
                  <span className="uppercase text-gray-600">{s.stat.name}</span>
                  <span className="text-pokeBorder">{s.base_stat}</span>
                </div>
                <div className="w-full bg-white border border-pokeBorder h-2.5">
                  <div
                    className="bg-pokeRed h-full"
                    style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-black text-pokeBorder uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-pokeRed font-mono">03</span> RANTAI EVOLUSI
        </h2>
        <div className="bg-pokeCard border-2 border-pokeBorder p-6 shadow-[4px_4px_0px_0px_rgba(44,44,44,1)] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {evolutionList.map((evo: { name: string; id: number }, index: number) => {
            const isCurrent = evo.id === pokemonId;
            return (
              <Link
                key={evo.name}
                to={`/pokemon/${evo.id}`}
                className={`border-2 p-4 flex items-center gap-4 bg-white transition-all hover:shadow-[3px_3px_0px_0px_rgba(44,44,44,1)] ${
                  isCurrent ? 'border-pokeRed ring-2 ring-pokeRed' : 'border-pokeBorder'
                }`}
              >
                <span className="font-mono font-bold text-xs text-gray-400">0{index + 1}</span>
                <div>
                  <span className="block text-[10px] uppercase font-mono font-bold text-gray-500">Tahap {index + 1}</span>
                  <span className="text-base font-black text-pokeBorder capitalize">{evo.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};