import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Memuat data Pokémon...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 border-4 border-pokeBorder rounded-full bg-white relative animate-poke-spin flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(59,42,26,1)] mb-4 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-pokeRed border-b-2 border-pokeBorder"></div>
        <div className="w-5 h-5 bg-white border-2 border-pokeBorder rounded-full z-10 flex items-center justify-center">
          <div className="w-2 h-2 bg-pokeBorder rounded-full"></div>
        </div>
      </div>
      <p className="font-mono text-xs font-bold text-pokeBorder uppercase tracking-wider">{message}</p>
    </div>
  );
};