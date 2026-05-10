import React, { useState } from 'react';

const INITIAL_DEALS = [
  {
    id: 'd1',
    title: '10% off — Mexico match days!',
    description: 'Special discount for all Mexican national team matches',
    discount: 10,
    multiplier: 2,
    active: true,
    matches: 'Mexico games',
    expires: 'Jun 30',
  },
  {
    id: 'd2',
    title: 'Free agua fresca with tacos',
    description: 'Buy any taco combo and get a free drink',
    discount: 0,
    multiplier: 3,
    active: true,
    matches: 'All matches today',
    expires: 'Today only',
  },
];

export default function Deals() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', discount: '', multiplier: '1', matches: 'all-today'
  });

  const toggleDeal = (id: string) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleCreate = () => {
    if (!form.title) return;
    const newDeal = {
      id: `d${Date.now()}`,
      title: form.title,
      description: form.description,
      discount: parseFloat(form.discount) || 0,
      multiplier: parseInt(form.multiplier),
      active: true,
      matches: form.matches === 'all-today' ? 'All matches today' : 'Tournament',
      expires: 'Jun 30',
    };
    setDeals(prev => [newDeal, ...prev]);
    setShowCreate(false);
    setForm({ title: '', description: '', discount: '', multiplier: '1', matches: 'all-today' });
  };

  return (
    <div className="min-h-screen field-bg overflow-y-auto">
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-black text-white">Match Day Deals</h1>
            <p className="text-xs text-gray-400">{deals.filter(d => d.active).length} active deals</p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 rounded-2xl font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            + Create
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="glass-card rounded-2xl p-4 border border-brand-green/40 mb-5 animate-slide-up">
            <p className="font-bold text-white mb-3">New Deal</p>
            <input
              type="text"
              placeholder="Deal title (e.g. '10% off on match days')"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full glass-card rounded-xl px-3 py-2 text-white placeholder-gray-600 border border-gray-700 focus:border-brand-green outline-none text-sm mb-2"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={2}
              className="w-full glass-card rounded-xl px-3 py-2 text-white placeholder-gray-600 border border-gray-700 focus:border-brand-green outline-none text-sm resize-none mb-2"
            />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Discount %</p>
                <input
                  type="number"
                  placeholder="0"
                  value={form.discount}
                  onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                  className="w-full glass-card rounded-xl px-3 py-2 text-white border border-gray-700 outline-none text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Points multiplier</p>
                <select
                  value={form.multiplier}
                  onChange={e => setForm(p => ({ ...p, multiplier: e.target.value }))}
                  className="w-full glass-card rounded-xl px-3 py-2 text-white border border-gray-700 outline-none text-sm bg-gray-900"
                >
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              {[
                { id: 'all-today', label: 'All matches today' },
                { id: 'tournament', label: 'Full tournament' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(p => ({ ...p, matches: opt.id }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    form.matches === opt.id
                      ? 'bg-brand-green text-white'
                      : 'glass-card text-gray-400 border border-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 rounded-xl text-gray-400 text-sm border border-gray-700 glass-card"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2 rounded-xl text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
              >
                Create Deal
              </button>
            </div>
          </div>
        )}

        {/* Deal list */}
        <div className="space-y-3">
          {deals.map(deal => (
            <div
              key={deal.id}
              className={`glass-card rounded-2xl p-4 border transition-all ${
                deal.active ? 'border-brand-green/30' : 'border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <p className="font-bold text-white">{deal.title}</p>
                  {deal.description && <p className="text-xs text-gray-400 mt-0.5">{deal.description}</p>}
                </div>
                <button
                  onClick={() => toggleDeal(deal.id)}
                  className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${
                    deal.active ? 'bg-brand-green' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${
                    deal.active ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {deal.discount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 font-semibold">
                    {deal.discount}% off
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-semibold">
                  {deal.multiplier}x GoalPoints
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-semibold">
                  {deal.matches}
                </span>
              </div>
            </div>
          ))}
        </div>

        {deals.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <div className="text-5xl mb-3">🔥</div>
            <p className="font-bold text-gray-500">No deals yet</p>
            <p className="text-sm">Create your first match day deal!</p>
          </div>
        )}
      </div>
    </div>
  );
}
