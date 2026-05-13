'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import PokedexCard from './PokedexCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { fetchPokemonList, fetchPokemonDetails } from '@/utils/api';
import { PokemonBasic, PokemonDetail } from '@/types/pokemon';

interface PokemonWithTypes extends PokemonBasic {
  id: number;
  types?: string[];
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<PokemonWithTypes[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonWithTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(24);
  const loaderRef = useRef<HTMLDivElement>(null);

  const limit = 24;

  useEffect(() => {
    loadInitialPokemon();
  }, []);

  useEffect(() => {
    filterPokemon();
  }, [searchQuery, selectedType, pokemon]);

  useEffect(() => {
    if (!loading && !loadingMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && filteredPokemon.length === pokemon.length) {
            loadMorePokemon();
          }
        },
        { threshold: 0.1 }
      );

      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }

      return () => observer.disconnect();
    }
  }, [loading, loadingMore, hasMore, filteredPokemon.length, pokemon.length]);

  const loadInitialPokemon = async () => {
    try {
      setLoading(true);
      const data = await fetchPokemonList(limit, 0);
      
      // Fetch basic type info for first batch
      const pokemonWithData = await Promise.all(
        data.results.map(async (p, index) => {
          const details = await fetchPokemonDetails(p.name);
          return {
            ...p,
            id: details.id,
            types: details.types.map(t => t.type.name)
          };
        })
      );
      
      setPokemon(pokemonWithData);
      setFilteredPokemon(pokemonWithData);
      setOffset(limit);
      setHasMore(data.results.length === limit);
      
      // Collect unique types
      const typesSet = new Set<string>();
      pokemonWithData.forEach(p => {
        p.types?.forEach(type => typesSet.add(type));
      });
      setAllTypes(Array.from(typesSet).sort());
      
      setError(null);
    } catch (err) {
      setError('Failed to load Pokémon. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemon = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const data = await fetchPokemonList(limit, offset);
      
      const newPokemonWithData = await Promise.all(
        data.results.map(async (p) => {
          const details = await fetchPokemonDetails(p.name);
          return {
            ...p,
            id: details.id,
            types: details.types.map(t => t.type.name)
          };
        })
      );
      
      setPokemon(prev => [...prev, ...newPokemonWithData]);
      setFilteredPokemon(prev => [...prev, ...newPokemonWithData]);
      setOffset(prev => prev + limit);
      setHasMore(data.results.length === limit);
      
      // Add new types
      const typesSet = new Set(allTypes);
      newPokemonWithData.forEach(p => {
        p.types?.forEach(type => typesSet.add(type));
      });
      setAllTypes(Array.from(typesSet).sort());
      
    } catch (err) {
      console.error('Error loading more Pokémon:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filterPokemon = () => {
    let filtered = [...pokemon];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(p =>
        p.types?.includes(selectedType)
      );
    }

    setFilteredPokemon(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type);
  };

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 24, filteredPokemon.length));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadInitialPokemon} />;

  const displayedPokemon = filteredPokemon.slice(0, displayCount);

  return (
    <div className="min-h-screen">
      {/* Pokédex Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-2xl p-6 mb-8 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Pokédex</h2>
            <p className="text-red-100">Discover and explore Pokémon from all regions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-900 rounded-full w-4 h-4"></div>
            <div className="bg-red-900 rounded-full w-4 h-4"></div>
            <div className="bg-green-500 rounded-full w-4 h-4"></div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Pokémon
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Pokémon name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none transition-colors"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => handleTypeFilter('')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  selectedType === ''
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Types
              </button>
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all capitalize ${
                    selectedType === type
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Found {filteredPokemon.length} Pokémon
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedType && ` of type ${selectedType}`}
        </div>
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {displayedPokemon.map((pokemon) => (
          <PokedexCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < filteredPokemon.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg"
          >
            Load More Pokémon
          </button>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && filteredPokemon.length === pokemon.length && (
        <div ref={loaderRef} className="py-8">
          {loadingMore && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}