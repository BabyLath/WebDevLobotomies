export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  other: {
    'official-artwork': {
      front_default: string;
      front_shiny?: string;
    };
    'dream_world': {
      front_default: string;
    };
  };
  versions: {
    'generation-v': {
      'black-white': {
        animated: {
          front_default: string;
        };
      };
    };
  };
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
  capture_rate: number;
  base_happiness: number;
  habitat: {
    name: string;
  } | null;
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface EvolutionChain {
  chain: EvolutionDetail;
}

export interface EvolutionDetail {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionDetail[];
  evolution_details: Array<{
    min_level: number | null;
    item: {
      name: string;
    } | null;
    trigger: {
      name: string;
    };
  }>;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface TypeInfo {
  name: string;
  damage_relations: {
    double_damage_from: Array<{ name: string }>;
    double_damage_to: Array<{ name: string }>;
    half_damage_from: Array<{ name: string }>;
    half_damage_to: Array<{ name: string }>;
    no_damage_from: Array<{ name: string }>;
    no_damage_to: Array<{ name: string }>;
  };
}