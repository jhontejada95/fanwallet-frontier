import React, { useState } from 'react';
import { REVIEWS } from '../../lib/mockData';

export default function BizReviews() {
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'high' | 'low'>('all');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [replies, setReplies] = useState<Record<string, string>>({
    r1: 'Thank you! Viva Brasil! 🎉 We loved having you!',
  });

  const filtered = REVIEWS.filter(r => {
    if (filter === 'unanswered') return !replies[r.id] && !r.businessResponse;
    if (filter === 'high') return r.rating >= 4;
    if (filter === 'low') return r.rating <= 2;
    return true;
  });

  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map(n => ({
    stars: n,
    count: REVIEWS.filter(r => r.rating === n).length,
  }));

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    setReplies(prev => ({ ...prev, [id]: replyText }));
    setReplyTo(null);
    setReplyText('');
  };

  return (
    <div className="min-h-screen field-bg overflow-y-auto">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-black text-white mb-5">Reviews</h1>

        {/* Summary */}
        <div className="glass-card rounded-2xl p-4 border border-gray-700 mb-5">
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-4xl font-black text-white">{avgRating}</p>
              <div className="text-yellow-400 text-sm my-1">{'★'.repeat(Math.round(parseFloat(avgRating)))}</div>
              <p className="text-xs text-gray-400">{REVIEWS.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {dist.map(d => {
                const pct = (d.count / REVIEWS.length) * 100;
                return (
                  <div key={d.stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{d.stars}★</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-4">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {[
            { id: 'all', label: 'All' },
            { id: 'unanswered', label: '💬 Unanswered' },
            { id: 'high', label: '⭐ 4-5★' },
            { id: 'low', label: '⚠️ 1-2★' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-brand-green text-white'
                  : 'glass-card text-gray-400 border border-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          {filtered.map(review => {
            const response = replies[review.id] || review.businessResponse;
            return (
              <div key={review.id} className="glass-card rounded-2xl p-4 border border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{review.fanFlag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                        {review.verified && (
                          <span className="text-xs text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-bold">
                            ✓ On-chain
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{review.text}</p>
                  </div>
                </div>

                {/* Business response */}
                {response && (
                  <div className="ml-9 bg-gray-800/60 rounded-xl p-3 border-l-2 border-brand-green mb-2">
                    <p className="text-xs text-gray-500 mb-0.5">Your response</p>
                    <p className="text-xs text-gray-300">{response}</p>
                  </div>
                )}

                {/* Reply form */}
                {replyTo === review.id ? (
                  <div className="ml-9 mt-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Write your response..."
                      rows={2}
                      className="w-full glass-card rounded-xl px-3 py-2 text-white placeholder-gray-600 border border-gray-700 focus:border-brand-green outline-none text-xs resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReplyTo(null)}
                        className="flex-1 py-1.5 rounded-xl text-gray-400 text-xs border border-gray-700"
                      >Cancel</button>
                      <button
                        onClick={() => handleReply(review.id)}
                        className="flex-1 py-1.5 rounded-xl text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
                      >Reply</button>
                    </div>
                  </div>
                ) : !response && (
                  <div className="flex gap-2 ml-9">
                    <button
                      onClick={() => setReplyTo(review.id)}
                      className="text-xs text-brand-green font-semibold"
                    >
                      💬 Reply
                    </button>
                    <button
                      onClick={() => setFlagged(prev => { const s = new Set(prev); s.add(review.id); return s; })}
                      className={`text-xs font-semibold transition-all ${flagged.has(review.id) ? 'text-red-400' : 'text-gray-600'}`}
                    >
                      {flagged.has(review.id) ? '🚩 Flagged' : '🚩 Flag'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            <div className="text-4xl mb-2">⭐</div>
            <p>No reviews match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
