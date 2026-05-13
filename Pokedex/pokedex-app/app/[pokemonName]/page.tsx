import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain, getTypeColor, getTypeGradient, formatHeight, formatWeight, typeIcons } from '@/utils/api';
import { PokemonDetail, PokemonSpecies, EvolutionChain as EvolutionChainType } from '@/types/pokemon';

interface PokemonPageProps {
  params: {
    pokemonName: string;
  };
}

// Generate static pages for ALL Pokémon (up to 1025)
export async function generateStaticParams() {
  const pokemonIds = Array.from({ length: 1025 }, (_, i) => i + 1);
  
  return pokemonIds.map((id) => ({
    pokemonName: id.toString(),
  }));
}

async function getPokemonData(nameOrId: string) {
  const [pokemon, species] = await Promise.all([
    fetchPokemonDetails(nameOrId),
    fetchPokemonSpecies(nameOrId)
  ]);
  
  let evolutionChain: EvolutionChainType | null = null;
  if (species.evolution_chain?.url) {
    evolutionChain = await fetchEvolutionChain(species.evolution_chain.url);
  }
  
  return { pokemon, species, evolutionChain };
}

function getEvolutionChain(evolutionChain: EvolutionChainType | null) {
  if (!evolutionChain) return [];
  
  const evolutions: Array<{ name: string; id: number }> = [];
  
  function traverse(chain: any) {
    if (chain.species) {
      const id = chain.species.url.split('/').filter(Boolean).pop();
      evolutions.push({
        name: chain.species.name,
        id: parseInt(id)
      });
    }
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evo: any) => traverse(evo));
    }
  }
  
  traverse(evolutionChain.chain);
  return evolutions;
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  try {
    const { pokemon, species, evolutionChain } = await getPokemonData(params.pokemonName);
    const evolutions = getEvolutionChain(evolutionChain);
    
    // Get English flavor text
    const flavorText = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    )?.flavor_text.replace(/[\f\n\r]/g, ' ') || 'No description available.';
    
    // Get English genus
    const genus = species.genera.find(
      g => g.language.name === 'en'
    )?.genus || 'Pokémon';

    const mainType = pokemon.types[0].type.name;
    const gradientClass = getTypeGradient(mainType);

    return (
      <div className="min-h-screen pb-12">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Pokédex
          </Link>
        </div>

        {/* Main Card */}
        <div className={`bg-gradient-to-br ${gradientClass} rounded-3xl shadow-2xl overflow-hidden`}>
          {/* Header */}
          <div className="bg-black bg-opacity-30 p-6 text-white">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-5xl font-bold capitalize mb-2">
                  {pokemon.name}
                </h1>
                <p className="text-xl opacity-90">{genus}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">#{String(pokemon.id).padStart(4, '0')}</p>
                <div className="flex gap-2 mt-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`${getTypeColor(type.type.name)} px-4 py-1 rounded-full text-white font-semibold capitalize shadow-md flex items-center gap-1`}
                    >
                      <span>{typeIcons[type.type.name]}</span>
                      <span>{type.type.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Images */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
                  <div className="relative w-full h-80 mb-4">
                    <Image
                      src={pokemon.sprites.other['official-artwork'].front_default}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  </div>
                  {pokemon.sprites.other['official-artwork'].front_shiny && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2 text-center">Shiny Form</p>
                      <div className="relative w-full h-40">
                        <Image
                          src={pokemon.sprites.other['official-artwork'].front_shiny}
                          alt={`Shiny ${pokemon.name}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-2">
                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{flavorText}</p>
                </div>

                {/* Physical Attributes */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Height</h3>
                    <p className="text-2xl font-bold text-gray-800">{formatHeight(pokemon.height)}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Weight</h3>
                    <p className="text-2xl font-bold text-gray-800">{formatWeight(pokemon.weight)}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Base Experience</h3>
                    <p className="text-2xl font-bold text-gray-800">{pokemon.base_experience}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Catch Rate</h3>
                    <p className="text-2xl font-bold text-gray-800">{species.capture_rate}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Base Happiness</h3>
                    <p className="text-2xl font-bold text-gray-800">{species.base_happiness}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Habitat</h3>
                    <p className="text-2xl font-bold text-gray-800 capitalize">
                      {species.habitat?.name || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Abilities */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Abilities</h2>
                  <div className="flex flex-wrap gap-3">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.ability.name}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full capitalize"
                      >
                        {ability.ability.name.replace('-', ' ')}
                        {ability.is_hidden && (
                          <span className="ml-2 text-xs bg-blue-800 text-white px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Base Stats</h2>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => {
                      const percentage = (stat.base_stat / 255) * 100;
                      return (
                        <div key={stat.stat.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {stat.stat.name.replace('-', ' ')}
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {stat.base_stat}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Total Base Stats: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                    </p>
                  </div>
                </div>

                {/* Evolution Chain */}
                {evolutions.length > 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Evolution Chain</h2>
                    <div className="flex items-center justify-center flex-wrap gap-4">
                      {evolutions.map((evo, index) => (
                        <div key={evo.name} className="flex items-center">
                          <Link
                            href={`/pokemon/${evo.name}`}
                            className="text-center hover:scale-105 transition-transform"
                          >
                            <div className="w-24 h-24 bg-gray-100 rounded-full p-2 mx-auto">
                              <div className="relative w-full h-full">
                                <Image
                                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                                  alt={evo.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                            <p className="mt-2 font-semibold capitalize text-gray-800">
                              {evo.name}
                            </p>
                          </Link>
                          {index < evolutions.length - 1 && (
                            <div className="text-3xl text-gray-400 mx-2">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legendary/Mythical Badge */}
                {(species.is_legendary || species.is_mythical) && (
                  <div className="mt-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      species.is_legendary ? 'bg-yellow-500' : 'bg-purple-500'
                    } text-white font-semibold`}>
                      <span>⭐</span>
                      <span>{species.is_legendary ? 'Legendary Pokémon' : 'Mythical Pokémon'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}