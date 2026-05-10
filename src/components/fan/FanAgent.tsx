import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../lib/appContext';
import { MERCHANTS, MATCHES } from '../../lib/mockData';

interface Message {
  role: 'agent' | 'user';
  text: string;
  action?: {
    label: string;
    screen?: string;
    merchantId?: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'agent',
    text: `👋 Hey! I'm your FanAgent. Brazil vs Argentina kicks off in **2h 40min** at MetLife Stadium.\n\nI found **3 merchants near you** with active deals. Want me to find you a good spot?`,
    action: { label: 'Show deals near me', screen: 'map' },
  },
];

const AGENT_RESPONSES: Record<string, Message> = {
  pay: {
    role: 'agent',
    text: `💳 I can handle that for you. **Tacos El Azteca** is 300m away — they have a 2x GoalPoints deal active right now. Want me to prepare the payment QR?\n\nEstimated total: ~$12.50 USDC`,
    action: { label: 'Open POS at Tacos El Azteca', screen: 'merchant', merchantId: 'biz1' },
  },
  deposit: {
    role: 'agent',
    text: `⚡ I'll bridge your crypto to USDC on Solana via LI.FI. Which chain are your funds on?\n\n• Ethereum (~15s)\n• Arbitrum (~8s)\n• Base (~6s)\n\nAll routes give you USDC in your FanWallet instantly.`,
    action: { label: 'Start bridge', screen: 'deposit' },
  },
  recommend: {
    role: 'agent',
    text: `🌮 Based on 247 verified reviews from fans like you, **Tacos El Azteca** is the top pick near Estadio Azteca:\n\n⭐ 4.8 · 0.3km away · 10% off today\n🇧🇷 Brazilian fans love it · 2x GoalPoints\n\nShall I take you there?`,
    action: { label: 'View Tacos El Azteca', screen: 'merchant', merchantId: 'biz1' },
  },
  points: {
    role: 'agent',
    text: `⚽ You have **342 GoalPoints** — that's $3.42 redeemable at any FanWallet merchant.\n\nYou're **158 pts away** from a free taco at Tacos El Azteca. Want me to help you earn them faster?`,
    action: { label: 'See how to earn more', screen: 'goalpoints' },
  },
  split: {
    role: 'agent',
    text: `✂️ Split bill time! How many people and what's the total? I'll send payment requests to everyone in your group instantly via Solana Pay.`,
    action: { label: 'Open split bill', screen: 'pay' },
  },
  default: {
    role: 'agent',
    text: `I can help you:\n• 💳 **Pay** at any merchant\n• 🔁 **Deposit** crypto from any chain\n• 🌮 **Recommend** top spots near you\n• ⚽ **Check** your GoalPoints\n• ✂️ **Split** the bill with friends\n\nWhat do you need?`,
  },
};

function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('pay') || t.includes('pag') || t.includes('compra')) return 'pay';
  if (t.includes('deposit') || t.includes('bridge') || t.includes('crypto') || t.includes('eth')) return 'deposit';
  if (t.includes('recommend') || t.includes('recomiend') || t.includes('best') || t.includes('where') || t.includes('donde')) return 'recommend';
  if (t.includes('point') || t.includes('punto') || t.includes('goal')) return 'points';
  if (t.includes('split') || t.includes('divide') || t.includes('group')) return 'split';
  return 'default';
}

export default function FanAgent({ onClose }: { onClose: () => void }) {
  const { setFanScreen, setSelectedMerchant } = useApp();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const intent = detectIntent(input);
      const response = AGENT_RESPONSES[intent];
      setMessages(prev => [...prev, response]);
      setTyping(false);
    }, 900);
  };

  const handleAction = (action: Message['action']) => {
    if (!action) return;
    if (action.merchantId) setSelectedMerchant(action.merchantId);
    if (action.screen) setFanScreen(action.screen as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="flex-1 flex flex-col max-w-[430px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                 style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
              🤖
            </div>
            <div>
              <p className="font-black text-white">FanAgent</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                <span className="text-xs text-brand-green font-medium">AI · Powered by Solana</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl glass-card border border-gray-700 flex items-center justify-center text-gray-400">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-3xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-brand-green text-white rounded-br-lg'
                      : 'glass-card border border-gray-700 text-gray-200 rounded-bl-lg'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
                {msg.action && (
                  <button
                    onClick={() => handleAction(msg.action)}
                    className="mt-2 w-full py-2 rounded-2xl text-xs font-bold text-white transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
                  >
                    {msg.action.label} →
                  </button>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass-card border border-gray-700 rounded-3xl rounded-bl-lg px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                       style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-5 mb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['💳 Pay somewhere', '🌮 Recommend a spot', '⚽ My points', '✂️ Split bill'].map(p => (
              <button
                key={p}
                onClick={() => { setInput(p); }}
                className="glass-card border border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-300 whitespace-nowrap hover:border-brand-green transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-5 pb-8 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask FanAgent anything..."
            className="flex-1 glass-card rounded-2xl px-4 py-3 text-white placeholder-gray-600 border border-gray-700 focus:border-brand-green outline-none text-sm"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl disabled:opacity-30 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
