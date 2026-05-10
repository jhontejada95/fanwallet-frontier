import React, { useState } from 'react';
import { ANALYTICS_DATA } from '../../lib/mockData';

type Range = 'today' | 'week' | 'tournament';

export default function Analytics() {
  const [range, setRange] = useState<Range>('today');
  const data = ANALYTICS_DATA[range];
  const maxRev = Math.max(...ANALYTICS_DATA.hourly.map(h => h.rev));

  return (
    <div className="min-h-screen field-bg overflow-y-auto">
      <div className="px-5 pt-12 pb-5">
        <h1 className="text-xl font-black text-white mb-4">Analytics</h1>

        {/* Time range */}
        <div className="flex glass-card rounded-2xl p-1 border border-gray-700 mb-5">
          {(['today', 'week', 'tournament'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                range === r ? 'bg-brand-green text-white' : 'text-gray-400'
              }`}
            >
              {r === 'tournament' ? 'All Time' : r === 'week' ? 'This Week' : 'Today'}
            </button>
          ))}
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Revenue', value: `$${data.revenue.toFixed(2)}`, icon: '💰', color: 'text-brand-green' },
            { label: 'Transactions', value: data.transactions, icon: '⚡', color: 'text-blue-400' },
            { label: 'Avg. Ticket', value: `$${data.avgTx.toFixed(2)}`, icon: '🎯', color: 'text-yellow-400' },
            { label: 'Unique Fans', value: data.newFans + data.returningFans, icon: '👥', color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 border border-gray-700">
              <span className="text-xl">{stat.icon}</span>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-5">
          <p className="font-bold text-white mb-4">Revenue by Hour (Today)</p>
          <div className="flex items-end gap-1" style={{ height: 100 }}>
            {ANALYTICS_DATA.hourly.map(h => {
              const pct = (h.rev / maxRev) * 100;
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm transition-all"
                       style={{
                         height: `${pct}%`,
                         minHeight: 4,
                         background: 'linear-gradient(to top, #007A3D, #00C661)',
                       }} />
                  <p className="text-[8px] text-gray-600">{h.hour}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Countries */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-5">
          <p className="font-bold text-white mb-4">Customers by Nation</p>
          <div className="space-y-3">
            {ANALYTICS_DATA.countries.map(c => {
              const max = ANALYTICS_DATA.countries[0].count;
              const pct = (c.count / max) * 100;
              return (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-xl w-8">{c.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300 font-medium">{c.country}</span>
                      <span className="text-gray-500">{c.count} fans · ${c.revenue}</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all"
                           style={{
                             width: `${pct}%`,
                             background: 'linear-gradient(90deg, #00A651, #00C661)',
                           }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fan type breakdown */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-6">
          <p className="font-bold text-white mb-4">Fan Type</p>
          <div className="flex gap-4">
            <div className="flex-1 text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1F2937" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00A651" strokeWidth="3"
                          strokeDasharray={`${(data.newFans / (data.newFans + data.returningFans)) * 100} 100`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white">{data.newFans}</span>
                </div>
              </div>
              <p className="text-brand-green font-bold text-sm">New Fans</p>
            </div>
            <div className="flex-1 text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1F2937" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFD700" strokeWidth="3"
                          strokeDasharray={`${(data.returningFans / (data.newFans + data.returningFans)) * 100} 100`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white">{data.returningFans}</span>
                </div>
              </div>
              <p className="text-yellow-400 font-bold text-sm">Returning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
