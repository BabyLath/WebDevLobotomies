'use client';

interface GenerationBadgeProps {
  id: number;
}

export default function GenerationBadge({ id }: GenerationBadgeProps) {
  const getGeneration = (id: number) => {
    if (id <= 151) return { gen: 1, name: 'Kanto', color: 'bg-red-500' };
    if (id <= 251) return { gen: 2, name: 'Johto', color: 'bg-yellow-500' };
    if (id <= 386) return { gen: 3, name: 'Hoenn', color: 'bg-blue-500' };
    if (id <= 493) return { gen: 4, name: 'Sinnoh', color: 'bg-purple-500' };
    if (id <= 649) return { gen: 5, name: 'Unova', color: 'bg-green-500' };
    if (id <= 721) return { gen: 6, name: 'Kalos', color: 'bg-pink-500' };
    if (id <= 809) return { gen: 7, name: 'Alola', color: 'bg-indigo-500' };
    if (id <= 898) return { gen: 8, name: 'Galar', color: 'bg-orange-500' };
    return { gen: 9, name: 'Paldea', color: 'bg-cyan-500' };
  };

  const gen = getGeneration(id);
  
  return (
    <div className={`${gen.color} text-white text-xs font-pixel px-2 py-0.5 rounded-full inline-block`}>
      Gen {gen.gen}
    </div>
  );
}