import { usePokedexStore } from '../store/usePokedexStore';

interface PaginationProps {
  totalPages: number;
}

export const Pagination = ({ totalPages }: PaginationProps) => {
  const { currentPage, setCurrentPage } = usePokedexStore();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-12 font-mono">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 border-2 border-pokeBorder bg-white font-bold text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(44,44,44,1)] transition-all"
      >
        ◄ Sebelumnya
      </button>

      <div className="px-4 py-1.5 border-2 border-pokeBorder bg-pokeRed text-white font-black text-sm shadow-[2px_2px_0px_0px_rgba(44,44,44,1)]">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 border-2 border-pokeBorder bg-white font-bold text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(44,44,44,1)] transition-all"
      >
        Selanjutnya ►
      </button>
    </div>
  );
};