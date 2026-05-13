'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTypeColor, formatHeight, formatWeight, typeIcons } from '@/utils/api';
import { PokemonBasic, PokemonDetail } from '@/types/pokemon';

interface PokedexDeviceProps {
  pokemon: PokemonBasic;
  details: PokemonDetail | null;
  onNavigate: (direction: 'prev' | 'next') => void;
  onClose: () => void;
}

export default function PokedexDevice({ pokemon, details, onNavigate, onClose }: PokedexDeviceProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'abilities'>('info');
  const [isOpen, setIsOpen] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Simulate scanning animation when opening
    setScanning(true);
    const timer = setTimeout(() => setScanning(false), 1000);
    return () => clearTimeout(timer);
  }, [pokemon.name]);

  if (!details) return null;

  const pokemonId = String(details.id).padStart(3, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative transform transition-all duration-500 scale-in">
        {/* Pokédex Device Outer Shell */}
        <div className="relative w-[800px] h-[600px] bg-gradient-to-br from-red-600 to-red-800 rounded-[3rem] shadow-2xl">
          
          {/* Top Hinge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-xl"></div>
          
          {/* Left Side - Screen Area */}
          <div className="absolute top-8 left-8 right-[340px] bottom-8 bg-gray-900 rounded-2xl shadow-inner border-4 border-gray-700">
            {/* Screen Bezel */}
            <div className="absolute inset-2 bg-black rounded-xl overflow-hidden">
              {/* Screen Content */}
              <div className="relative w-full h-full bg-gradient-to-b from-green-900 to-green-800 p-4">
                {/* Scanning Effect */}
                {scanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent animate-scan"></div>
                )}
                
                {/* Pokémon Sprite */}
                <div className="relative h-48 mb-4 bg-black/30 rounded-lg flex items-center justify-center">
                  {details.sprites.other['official-artwork'].front_default ? (
                    <Image
                      src={details.sprites.other['official-artwork'].front_default}
                      alt={details.name}
                      width={160}
                      height={160}
                      className="object-contain pixelated"
                    />
                  ) : (
                    <div className="text-green-400 font-pixel text-center">
                      LOADING...
                    </div>
                  )}
                </div>
                
                {/* Pokémon Name and Number */}
                <div className="bg-black/50 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-green-400 font-pixel text-sm uppercase tracking-wider">
                      {details.name}
                    </h2>
                    <span className="text-green-400 font-pixel text-xs">
                      No. {pokemonId}
                    </span>
                  </div>
                </div>
                
                {/* Type Display */}
                <div className="flex gap-2 mb-3">
                  {details.types.map((type) => (
                    <div key={type.type.name} className="flex-1 bg-black/50 rounded-lg p-2 text-center">
                      <span className="text-green-400 font-pixel text-xs uppercase">
                        {type.type.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Tab Buttons */}
                <div className="flex gap-2 mb-3">
                  {(['info', 'stats', 'abilities'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-xs font-pixel uppercase transition-colors ${
                        activeTab === tab
                          ? 'bg-green-500 text-black'
                          : 'bg-black/50 text-green-400 hover:bg-black/70'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                {/* Tab Content */}
                <div className="bg-black/50 rounded-lg p-3 h-32 overflow-y-auto">
                  {activeTab === 'info' && (
                    <div className="space-y-2 text-green-400 font-mono text-xs">
                      <p>HT: {formatHeight(details.height)}</p>
                      <p>WT: {formatWeight(details.weight)}</p>
                      <p>EXP: {details.base_experience}</p>
                    </div>
                  )}
                  
                  {activeTab === 'stats' && (
                    <div className="space-y-1 text-green-400 font-mono text-xs">
                      {details.stats.map((stat) => (
                        <div key={stat.stat.name}>
                          <span className="uppercase">{stat.stat.name.slice(0, 3)}: </span>
                          <span>{stat.base_stat}</span>
                          <div className="w-full bg-green-900 h-1 mt-0.5">
                            <div 
                              className="bg-green-400 h-full" 
                              style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 'abilities' && (
                    <div className="space-y-1 text-green-400 font-mono text-xs">
                      {details.abilities.map((ability) => (
                        <div key={ability.ability.name}>
                          • {ability.ability.name.replace('-', ' ').toUpperCase()}
                          {ability.is_hidden && <span className="ml-2 text-yellow-400">(HIDDEN)</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Screen Indicator LED */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Right Side - Controls Area */}
          <div className="absolute top-8 right-8 bottom-8 w-[300px]">
            {/* Top LED Indicators */}
            <div className="flex gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            
            {/* Directional Pad */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gray-800 rounded-full shadow-lg"></div>
              <button 
                onClick={() => onNavigate('prev')}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-700 rounded-t-lg hover:bg-gray-600 transition-colors"
              >
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white mx-auto mt-2"></div>
              </button>
              <button 
                onClick={() => onNavigate('next')}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-700 rounded-b-lg hover:bg-gray-600 transition-colors"
              >
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white mx-auto mt-3"></div>
              </button>
              <button className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 rounded-l-lg hover:bg-gray-600 transition-colors">
                <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-t-transparent border-b-transparent border-r-white mx-auto"></div>
              </button>
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 rounded-r-lg hover:bg-gray-600 transition-colors">
                <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white mx-auto"></div>
              </button>
              <div className="absolute inset-0 m-auto w-8 h-8 bg-gray-600 rounded-full"></div>
            </div>
            
            {/* A and B Buttons */}
            <div className="flex justify-center gap-8 mb-8">
              <button className="relative w-16 h-16 bg-red-600 rounded-full shadow-xl hover:bg-red-500 transition-all active:scale-95">
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">A</span>
                <div className="absolute inset-1 rounded-full bg-red-500/50"></div>
              </button>
              <button className="relative w-16 h-16 bg-blue-600 rounded-full shadow-xl hover:bg-blue-500 transition-all active:scale-95">
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">B</span>
                <div className="absolute inset-1 rounded-full bg-blue-500/50"></div>
              </button>
            </div>
            
            {/* Start and Select Buttons */}
            <div className="flex justify-center gap-6 mb-8">
              <button className="w-12 h-4 bg-gray-600 rounded-sm shadow-md"></button>
              <button className="w-12 h-4 bg-gray-600 rounded-sm shadow-md"></button>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-700 text-white font-pixel text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              CLOSE
            </button>
          </div>
          
          {/* Bottom Decorative Panel */}
          <div className="absolute bottom-4 left-8 right-8 h-12 bg-gradient-to-b from-red-700 to-red-900 rounded-xl"></div>
          
          {/* Brand Text */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/30 text-xs font-pixel">
            POKÉMON COMPANY
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        .animate-scan {
          animation: scan 1s linear;
        }
        
        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
}