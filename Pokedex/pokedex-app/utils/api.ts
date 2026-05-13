import axios from 'axios';
import { 
  PokemonBasic, 
  PokemonDetail, 
  PokemonListResponse, 
  PokemonSpecies, 
  EvolutionChain,
  TypeInfo 
} from '@/types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const apiCache = new Map<string, any>();

export async function fetchPokemonList(limit: number = 1025, offset: number = 0): Promise<PokemonListResponse> {
  const cacheKey = `pokemon-list-${limit}-${offset}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon`, {
      params: { limit, offset }
    });
    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw error;
  }
}

export async function fetchPokemonDetails(nameOrId: string): Promise<PokemonDetail> {
  const cacheKey = `pokemon-details-${nameOrId}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${nameOrId.toLowerCase()}`);
    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${nameOrId}:`, error);
    throw error;
  }
}

export async function fetchPokemonSpecies(nameOrId: string): Promise<PokemonSpecies> {
  const cacheKey = `pokemon-species-${nameOrId}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon-species/${nameOrId.toLowerCase()}`);
    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokémon species for ${nameOrId}:`, error);
    throw error;
  }
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const cacheKey = `evolution-${url}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await axios.get(url);
    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    throw error;
  }
}

export async function fetchTypeInfo(typeName: string): Promise<TypeInfo> {
  const cacheKey = `type-info-${typeName}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/type/${typeName}`);
    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching type info for ${typeName}:`, error);
    throw error;
  }
}

export function getTypeColor(type: string): string {
  const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  return typeColors[type] || 'bg-gray-500';
}

export function getTypeGradient(type: string): string {
  const gradients: { [key: string]: string } = {
    normal: 'from-gray-400 to-gray-500',
    fire: 'from-orange-500 to-red-500',
    water: 'from-blue-500 to-blue-600',
    electric: 'from-yellow-400 to-yellow-500',
    grass: 'from-green-500 to-green-600',
    ice: 'from-blue-200 to-blue-300',
    fighting: 'from-red-700 to-red-800',
    poison: 'from-purple-500 to-purple-600',
    ground: 'from-yellow-700 to-yellow-800',
    flying: 'from-indigo-300 to-indigo-400',
    psychic: 'from-pink-500 to-pink-600',
    bug: 'from-lime-500 to-lime-600',
    rock: 'from-yellow-800 to-yellow-900',
    ghost: 'from-purple-700 to-purple-800',
    dragon: 'from-indigo-700 to-indigo-800',
    dark: 'from-gray-800 to-gray-900',
    steel: 'from-gray-500 to-gray-600',
    fairy: 'from-pink-300 to-pink-400',
  };
  return gradients[type] || 'from-gray-400 to-gray-500';
}

export function formatHeight(heightDecimeters: number): string {
  const meters = (heightDecimeters / 10).toFixed(1);
  const feet = (heightDecimeters * 0.328084).toFixed(1);
  return `${meters}m (${feet}ft)`;
}

export function formatWeight(weightHectograms: number): string {
  const kg = (weightHectograms / 10).toFixed(1);
  const lbs = (weightHectograms * 0.220462).toFixed(1);
  return `${kg}kg (${lbs}lbs)`;
}

export function getPokemonId(imageUrl: string): string {
  const matches = imageUrl.match(/\/(\d+)\./);
  return matches ? matches[1].padStart(3, '0') : '000';
}

export const typeIcons: { [key: string]: string } = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '⛰️',
  flying: '🕊️',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨',
};