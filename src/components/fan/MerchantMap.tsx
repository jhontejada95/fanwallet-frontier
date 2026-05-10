import React, { useState } from 'react';
import { useApp } from '../../lib/appContext';
import { MERCHANTS } from '../../lib/mockData';

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🗺️' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'drinks', label: 'Drinks', emoji: '🍺' },
  { id: 'merch', label: 'Merch', emoji: '👕' },
  { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  { id: 'transport', label: 'Transport', emoji: '🚕' },
];

const FILTERS = [
  { id: 'deals', label: '🔥 Deals' },
  { id: 'top', label: '⭐ 4.5+' },
  { id: 'stadium', label: '📍 Near stadium' },
];

// Mock map with positioned merchant pins
function MockMap({ merchants, onSelect, selected }: {
  merchants: typeof MERCHANTS;
  onSelect: (id: string) => void;
  selected: string | null;
}) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-gray-700"
         style={{ height: 280, background: 'linear-gradient(135deg, #0d1a0d 0%, #111d11 50%, #0d1a0d 100%)' }}>
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'linear-gradient(rgba(0,166,81,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,166,81,0.3) 1px, transparent 1px)',
             backgroundSize: '30px 30px',
           }} />

      {/* Street lines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700 opacity-60" />
      <div className="absolute top-1/3 left-0 right-0 h-px bg-gray-700 opacity-40" />
      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-700 opacity-40" />
      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-700 opacity-40" />

      {/* Stadium marker */}
      <div className="absolute" style={{ top: '20%', left: '55%' }}>
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl px-2 py-1 text-xs text-yellow-400 font-bold whitespace-nowrap">
          🏟️ Estadio Azteca
        </div>
      </div>

      {/* Merchant pins */}
      {merchants.map((m, i) => {
        const positions = [
          { top: '55%', left: '30%' },
          { top: '65%', left: '50%' },
          { top: '40%', left: '70%' },
          { top: '70%', left: '20%' },
        ];
        const pos = positions[i % positions.length];
        const isSelected = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="absolute transition-all duration-200"
            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`flex flex-col items-center gap-1 transition-all ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 ${
                isSelected ? 'border-white bg-brand-green' : 'border-brand-green bg-gray-900'
              }`}>
                {m.emoji}
              </div>
              {isSelected && (
                <div className="bg-brand-green text-white text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                  {m.name}
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* User location */}
      <div className="absolute" style={{ bottom: '25%', left: '45%' }}>
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-3">
        <span className="text-xs text-gray-600">Powered by Mapbox</span>
      </div>
    </div>
  );
}

export default function MerchantMap() {
  const { setFanScreen, setSelectedMerchant } = useApp();
  const [category, setCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');

  const filtered = MERCHANTS.filter(m =>
    (category === 'all' || m.category === category) &&
    (!activeFilters.includes('top') || m.rating >= 4.5) &&
    (!activeFilters.includes('deals') || m.deal !== null)
  );

  const handleView = (id: string) => {
    setSelectedMerchant(id);
    setFanScreen('merchant');
  };

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  return (
    <div className="min-h-screen field-bg flex flex-col">
      <div className="px-5 pt-12 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-black text-white text-xl">Discover</h1>
          <p className="text-xs text-gray-400">{filtered.length} FanWallet merchants nearby</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('map')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${view === 'map' ? 'bg-brand-green text-white' : 'glass-card text-gray-400 border border-gray-700'}`}>
            🗺️ Map
          </button>
          <button onClick={() => setView('list')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${view === 'list' ? 'bg-brand-green text-white' : 'glass-card text-gray-400 border border-gray-700'}`}>
            ☰ List
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-brand-green text-white'
                  : 'glass-card text-gray-400 border border-gray-700'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle filters */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                activeFilters.includes(f.id)
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                  : 'glass-card text-gray-500 border-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        {/* Map */}
        {view === 'map' && (
          <div className="mb-4">
            <MockMap merchants={filtered} onSelect={setSelectedPin} selected={selectedPin} />
          </div>
        )}

        {/* Merchant list */}
        <div className="space-y-3 pb-4">
          {filtered.map(merchant => (
            <button
              key={merchant.id}
              onClick={() => handleView(merchant.id)}
              className={`w-full glass-card rounded-2xl p-4 border text-left active:scale-98 transition-all ${
                selectedPin === merchant.id ? 'border-brand-green' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl shrink-0">
                  {merchant.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-white">{merchant.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-yellow-400 text-xs">★ {merchant.rating}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{merchant.reviewCount} reviews</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{merchant.distance}</span>
                      </div>
                    </div>
                    {merchant.pointsMultiplier > 1 && (
                      <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full shrink-0">
                        {merchant.pointsMultiplier}x pts
                      </span>
                    )}
                  </div>
                  {merchant.deal && (
                    <div className="mt-2 bg-brand-green/10 border border-brand-green/20 rounded-xl px-3 py-1.5">
                      <p className="text-xs text-brand-green font-semibold">{merchant.deal.title}</p>
                    </div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {merchant.languages.map(l => (
                      <span key={l} className="text-xs text-gray-600">{l.split(' ')[0]}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
