import React, { useState, useMemo } from 'react';
import { useApp } from '../../lib/appContext';

interface Person {
  id: number;
  name: string;
  paid: boolean;
}

export default function Split() {
  const { setFanScreen } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState<Person[]>([{ id: 0, name: 'You', paid: false }]);
  const [newName, setNewName] = useState('');
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});

  const totalAmount = parseFloat(total) || 0;
  const perPerson = people.length > 0 ? totalAmount / people.length : 0;

  const resolvedAmounts = useMemo<Record<number, number>>(() => {
    if (splitMode === 'equal') {
      return Object.fromEntries(people.map(p => [p.id, perPerson]));
    }
    return Object.fromEntries(people.map(p => [p.id, parseFloat(customAmounts[p.id] || '0')]));
  }, [people, splitMode, perPerson, customAmounts]);

  const addPerson = () => {
    const name = newName.trim() || `Person ${people.length + 1}`;
    setPeople(prev => [...prev, { id: Date.now(), name, paid: false }]);
    setNewName('');
  };

  const removePerson = (id: number) => {
    if (people.length <= 1) return;
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const markPaid = (id: number) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, paid: true } : p));
  };

  const allPaid = people.every(p => p.paid);

  return (
    <div className="min-h-screen field-bg flex flex-col">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => setFanScreen('dashboard')}
          className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center text-white"
        >
          ←
        </button>
        <div>
          <h1 className="font-black text-white text-xl">Split Bill</h1>
          <p className="text-xs text-gray-400">Share expenses with your crew</p>
        </div>
      </div>

      <div className="px-5 flex-1 pb-8">
        {/* Step 1: Total + People */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-card rounded-3xl p-6 border border-gray-700 text-center">
              <p className="text-xs text-gray-500 mb-2">Total Bill (USDC)</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={total}
                  onChange={e => setTotal(e.target.value)}
                  className="bg-transparent text-5xl font-black text-white outline-none text-center w-40 placeholder-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[20, 50, 100, 200].map(a => (
                <button
                  key={a}
                  onClick={() => setTotal(String(a))}
                  className="glass-card rounded-xl py-2 border border-gray-700 text-sm font-bold text-white active:scale-95"
                >
                  ${a}
                </button>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Who's splitting?</p>
                <span className="text-xs text-gray-500">{people.length} people</span>
              </div>

              {people.map(p => (
                <div key={p.id} className="glass-card rounded-xl p-3 border border-gray-800 mb-2 flex items-center gap-3">
                  <span className="text-lg">{p.name === 'You' ? '👤' : '👥'}</span>
                  <span className="flex-1 text-sm font-medium text-white">{p.name}</span>
                  {p.name !== 'You' && (
                    <button
                      onClick={() => removePerson(p.id)}
                      className="text-gray-600 hover:text-red-400 text-xs px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Add person..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPerson()}
                  className="flex-1 glass-card rounded-xl p-3 border border-gray-700 text-sm text-white bg-transparent outline-none placeholder-gray-600"
                />
                <button
                  onClick={addPerson}
                  className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!totalAmount || people.length < 2}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Calculate Split →
            </button>
          </div>
        )}

        {/* Step 2: Pay */}
        {step === 2 && (
          <div className="space-y-3 animate-slide-up">
            <div className="glass-card rounded-2xl p-4 border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total bill</p>
                <p className="text-xl font-black text-white">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Per person</p>
                <p className="text-xl font-black text-brand-green">${perPerson.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {(['equal', 'custom'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setSplitMode(m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    splitMode === m
                      ? 'bg-brand-green text-white'
                      : 'glass-card border border-gray-700 text-gray-400'
                  }`}
                >
                  {m === 'equal' ? '÷ Equal' : '✏ Custom'}
                </button>
              ))}
            </div>

            {people.map(p => (
              <div
                key={p.id}
                className={`glass-card rounded-2xl p-4 border transition-all ${
                  p.paid ? 'border-brand-green/40 opacity-60' : 'border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.name === 'You' ? '👤' : '👥'}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{p.name}</p>
                    {splitMode === 'custom' ? (
                      <input
                        type="number"
                        placeholder="0.00"
                        value={customAmounts[p.id] || ''}
                        onChange={e => setCustomAmounts(prev => ({ ...prev, [p.id]: e.target.value }))}
                        className="bg-transparent text-xs text-brand-green outline-none w-20 mt-0.5"
                      />
                    ) : (
                      <p className="text-xs text-gray-500">${resolvedAmounts[p.id]?.toFixed(2)} USDC</p>
                    )}
                  </div>
                  {p.paid ? (
                    <span className="text-xs text-brand-green font-bold">✓ Paid</span>
                  ) : (
                    <button
                      onClick={() => markPaid(p.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
                    >
                      {p.name === 'You' ? 'Pay' : 'Mark Paid'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {allPaid && (
              <div className="text-center pt-2">
                <p className="text-brand-green font-bold text-lg mb-3">🎉 All paid!</p>
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-4 rounded-2xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
                >
                  View Summary
                </button>
              </div>
            )}

            {!allPaid && (
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl text-gray-400 text-sm border border-gray-800"
              >
                Skip to Summary
              </button>
            )}
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="animate-bounce-in text-center py-8">
            <div className="w-24 h-24 rounded-full bg-brand-green flex items-center justify-center text-5xl mx-auto mb-6 glow-green">
              🎉
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Bill Settled!</h3>
            <p className="text-gray-400 text-sm mb-1">
              ${totalAmount.toFixed(2)} split between {people.length} people
            </p>
            <p className="text-brand-green font-bold mb-8">${perPerson.toFixed(2)} each</p>

            <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-6 text-left">
              {people.map(p => (
                <div
                  key={p.id}
                  className="flex justify-between text-sm py-1.5 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-300">{p.name}</span>
                  <span className={p.paid ? 'text-brand-green font-semibold' : 'text-gray-500'}>
                    {p.paid
                      ? `✓ $${resolvedAmounts[p.id]?.toFixed(2)}`
                      : `$${resolvedAmounts[p.id]?.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setFanScreen('dashboard')}
              className="w-full py-4 rounded-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
