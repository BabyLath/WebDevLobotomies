'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getTypeColor, typeIcons } from '@/utils/api';

interface PokedexCardProps {
  pokemon: {
    name: string;
    url: string;
    id?: number;
  };
}

export default function PokedexCard({ pokemon }: PokedexCardProps) {
  const [imageError, setImageError] = useState(false);
  const pokemonId = pokemon.id || pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div className="group relative bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Pokédex Number Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
          #{String(pokemonId).padStart(3, '0')}
        </div>
        
        {/* Image Container */}
        <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 p-6 pt-8">
          <div className="relative w-full h-48 mx-auto">
            <Image
              src={imageError ? fallbackImage : imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={parseInt(pokemonId as string) <= 151}
            />
          </div>
        </div>
        
        {/* Info Container */}
        <div className="p-4 bg-white">
          <h3 className="text-xl font-bold text-center text-gray-800 capitalize mb-2">
            {pokemon.name}
          </h3>
          
          {/* Type Placeholder - Will be filled with actual types */}
          <div className="flex justify-center gap-2">
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Pokédex Button */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}