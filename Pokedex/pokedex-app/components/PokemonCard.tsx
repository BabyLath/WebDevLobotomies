import Image from 'next/image';
import Link from 'next/link';
import { PokemonBasic } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonBasic;
  index: number;
}

export default function PokemonCard({ pokemon, index }: PokemonCardProps) {
  const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  
  return (
    <Link href={`/${pokemon.name}`}>
      <div className="pokemon-card group">
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="absolute top-2 right-2 bg-pokemon-red text-white text-sm font-bold px-2 py-1 rounded-full">
            #{String(pokemonId).padStart(3, '0')}
          </div>
          <div className="relative w-full h-48 mb-4">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="text-xl font-bold text-center text-gray-800 capitalize mt-4">
            {pokemon.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}