import React, { useState, useRef, useEffect } from 'react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number | string;
  color?: string;
  isAll?: boolean;
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
        break;
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[10px] font-mono font-bold uppercase text-pokeBorder mb-1">
        {label}
      </label>

      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full bg-pokeCard border-2 border-pokeBorder px-3 py-2 text-xs font-mono font-bold text-pokeBorder flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(59,42,26,1)] rounded-sm focus:outline-none"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.color && (
            <span
              className="w-4 h-4 rounded-xs inline-block flex-shrink-0 border border-pokeBorder"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <span
          className={`transform transition-transform duration-200 text-pokeBorder ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-pokeCard border-2 border-pokeBorder max-h-60 overflow-y-auto shadow-[3px_3px_0px_0px_rgba(59,42,26,1)] rounded-sm focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer font-mono text-xs border-b border-pokeBorder/10 last:border-none transition-colors ${
                  isSelected
                    ? 'bg-pokeCardHover font-bold'
                    : isHighlighted
                    ? 'bg-pokeCardHover/50'
                    : 'hover:bg-pokeCardHover/30'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-4 flex-shrink-0 text-pokeRed font-bold text-center">
                    {isSelected ? '✓' : ''}
                  </span>

                  {option.color && (
                    <span
                      className="w-4 h-4 rounded-xs inline-block flex-shrink-0 border border-pokeBorder"
                      style={{ backgroundColor: option.color }}
                    />
                  )}

                  <span className="truncate text-pokeBorder">{option.label}</span>
                </div>

                {option.count !== undefined && (
                  <span className="bg-badgeBg text-pokeBorder text-[10px] px-1.5 py-0.5 rounded font-mono ml-2 flex-shrink-0 border border-pokeBorder/20">
                    {option.count}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};