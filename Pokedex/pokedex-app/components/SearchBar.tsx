import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onTypeFilter: (type: string) => void;
  types: string[];
  selectedType: string;
}

export default function SearchBar({ onSearch, onTypeFilter, types, selectedType }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pokemon-red focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTypeFilter('')}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
            selectedType === ''
              ? 'bg-pokemon-red text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeFilter(type)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors capitalize ${
              selectedType === type
                ? 'bg-pokemon-red text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}