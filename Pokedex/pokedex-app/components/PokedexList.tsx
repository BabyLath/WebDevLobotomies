'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from '@/utils/api';
import { PokemonBasic, PokemonDetail } from '@/types/pokemon';
import PokedexDevice from './PokedexDevice';

// Total Pokémon up to Gen 9 (including all forms)
const TOTAL_POKEMON = 1025; // Up to Gen 9
const POKEMON_PER_PAGE = 50;

export default function PokedexList() {
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [allPokemon, setAllPokemon] = useState<PokemonBasic[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonBasic | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<PokemonDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<number>(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Generation ranges
  const generations = {
    1: { name: 'Kanto', start: 1, end: 151 },
    2: { name: 'Johto', start: 152, end: 251 },
    3: { name: 'Hoenn', start: 252, end: 386 },
    4: { name: 'Sinnoh', start: 387, end: 493 },
    5: { name: 'Unova', start: 494, end: 649 },
    6: { name: 'Kalos', start: 650, end: 721 },
    7: { name: 'Alola', start: 722, end: 809 },
    8: { name: 'Galar', start: 810, end: 898 },
    9: { name: 'Paldea', start: 899, end: 1025 },
  };

  useEffect(() => {
    loadInitialPokemon();
  }, []);

  useEffect(() => {
    // Filter Pokémon based on search and generation
    let filtered = [...allPokemon];
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGeneration !== 0) {
      const gen = generations[selectedGeneration as keyof typeof generations];
      filtered = filtered.filter(p => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
        return id >= gen.start && id <= gen.end;
      });
    }
    
    setPokemonList(filtered);
  }, [searchTerm, selectedGeneration, allPokemon]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !searchTerm && selectedGeneration === 0) {
          loadMorePokemon();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, searchTerm, selectedGeneration]);

  const loadInitialPokemon = async () => {
    try {
      setLoading(true);
      const data = await fetchPokemonList(POKEMON_PER_PAGE, 0);
      setAllPokemon(data.results);
      setPokemonList(data.results);
      setOffset(POKEMON_PER_PAGE);
      setHasMore(data.results.length === POKEMON_PER_PAGE);
    } catch (err) {
      console.error('Error loading Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemon = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const data = await fetchPokemonList(POKEMON_PER_PAGE, offset);
      
      if (data.results.length > 0) {
        setAllPokemon(prev => [...prev, ...data.results]);
        setPokemonList(prev => [...prev, ...data.results]);
        setOffset(prev => prev + POKEMON_PER_PAGE);
        setHasMore(data.results.length === POKEMON_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more Pokémon:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const openPokedex = async (pokemon: PokemonBasic, index: number) => {
    const details = await fetchPokemonDetails(pokemon.name);
    setSelectedPokemon(pokemon);
    setSelectedDetails(details);
    setCurrentIndex(index);
  };

  const navigatePokemon = async (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < pokemonList.length - 1) {
      newIndex = currentIndex + 1;
    }
    
    if (newIndex !== currentIndex) {
      const newPokemon = pokemonList[newIndex];
      const newDetails = await fetchPokemonDetails(newPokemon.name);
      setSelectedPokemon(newPokemon);
      setSelectedDetails(newDetails);
      setCurrentIndex(newIndex);
    }
  };

  const getGenerationBadge = (id: number) => {
    for (const [gen, range] of Object.entries(generations)) {
      if (id >= range.start && id <= range.end) {
        return { gen: parseInt(gen), name: range.name };
      }
    }
    return { gen: 0, name: 'Unknown' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-pixel text-sm">BOOTING UP POKÉDEX...</p>
          <p className="mt-2 text-green-400 font-pixel text-xs">LOADING ALL {TOTAL_POKEMON} POKÉMON</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Pokédex Device Interface */}
      <div className="relative w-[1000px] h-[700px] bg-gradient-to-br from-red-700 to-red-900 rounded-[3rem] shadow-2xl">
        {/* Top Hinge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl"></div>
        
        {/* Top Screen */}
        <div className="absolute top-6 left-6 right-6 h-48 bg-gray-900 rounded-2xl border-4 border-gray-700 shadow-inner">
          <div className="relative h-full bg-gradient-to-b from-green-900 to-green-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-green-400 font-pixel text-2xl mb-4">POKÉDEX</div>
              <div className="text-green-400/80 font-pixel text-xs text-center px-4">
                {allPokemon.length} / {TOTAL_POKEMON} POKÉMON REGISTERED
              </div>
              <div className="text-green-400/60 font-pixel text-[10px] mt-4 animate-pulse">
                ALL GENERATIONS AVAILABLE
              </div>
            </div>
            
            {/* Screen Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-scanlines"></div>
          </div>
        </div>
        
        {/* Bottom Controls Area */}
        <div className="absolute bottom-6 left-6 right-6 top-[220px]">
          {/* Search and Filter */}
          <div className="mb-4 space-y-2">
            <div className="bg-gray-800 rounded-lg p-1 flex items-center gap-2 border-2 border-gray-600">
              <span className="text-green-400 font-pixel text-xs px-2">SEARCH:</span>
              <input
                type="text"
                placeholder="POKÉMON NAME..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-black text-green-400 font-mono text-sm px-2 py-1 outline-none"
              />
            </div>
            
            {/* Generation Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button
                onClick={() => setSelectedGeneration(0)}
                className={`px-3 py-1 rounded-lg font-pixel text-xs transition-all whitespace-nowrap ${
                  selectedGeneration === 0
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                }`}
              >
                ALL GENS
              </button>
              {Object.entries(generations).map(([gen, data]) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGeneration(parseInt(gen))}
                  className={`px-3 py-1 rounded-lg font-pixel text-xs transition-all whitespace-nowrap ${
                    selectedGeneration === parseInt(gen)
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  }`}
                >
                  GEN {gen} - {data.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Pokémon Grid */}
          <div className="h-[280px] overflow-y-auto custom-scrollbar mb-2">
            <div className="grid grid-cols-5 gap-2">
              {pokemonList.map((pokemon, index) => {
                const pokemonId = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
                const genInfo = getGenerationBadge(pokemonId);
                return (
                  <button
                    key={pokemon.name}
                    onClick={() => openPokedex(pokemon, index)}
                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-2 transition-all group relative"
                  >
                    {/* Generation Badge */}
                    <div className="absolute top-0 right-0 bg-green-500 text-black text-[8px] font-pixel px-1 rounded-bl-lg">
                      G{genInfo.gen}
                    </div>
                    
                    <div className="relative w-full h-16 mb-1">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                        alt={pokemon.name}
                        className="w-full h-full object-contain pixelated"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-pixel text-[10px]">
                        #{String(pokemonId).padStart(4, '0')}
                      </div>
                      <div className="text-white text-xs font-bold truncate">
                        {pokemon.name.toUpperCase()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="text-center py-4">
                <div className="inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-green-400 font-pixel text-xs mt-2">LOADING MORE...</p>
              </div>
            )}
            
            {/* Infinite Scroll Trigger */}
            {hasMore && !searchTerm && selectedGeneration === 0 && (
              <div ref={loaderRef} className="h-10"></div>
            )}
          </div>
          
          {/* Stats Bar */}
          <div className="bg-gray-800 rounded-lg p-2 flex justify-between items-center">
            <div className="text-green-400 font-pixel text-[10px]">
              DISPLAYING: {pokemonList.length} POKÉMON
            </div>
            <div className="text-green-400 font-pixel text-[10px]">
              TOTAL: {TOTAL_POKEMON}
            </div>
          </div>
          
          {/* D-Pad and Buttons */}
          <div className="flex justify-between items-center mt-3">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-t-lg"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-b-lg"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-l-lg"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-r-lg"></div>
              <div className="absolute inset-0 m-auto w-6 h-6 bg-gray-500 rounded-full"></div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full shadow-lg"></div>
              <div className="w-12 h-12 bg-blue-600 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom LED */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Pokédex Device Modal */}
      {selectedPokemon && selectedDetails && (
        <PokedexDevice
          pokemon={selectedPokemon}
          details={selectedDetails}
          onNavigate={navigatePokemon}
          onClose={() => {
            setSelectedPokemon(null);
            setSelectedDetails(null);
          }}
        />
      )}
      
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        
        .bg-scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 2px,
            transparent 2px,
            transparent 4px
          );
        }
      `}</style>
    </>
  );
}