import React from 'react';
import { useApp, FanScreen } from '../../lib/appContext';
import { LogoMark } from '../LogoMark';
import { useIsDesktop } from '../../hooks/useIsDesktop';

/* ── Icons ───────────────────────────────────────────────────────────────── */
const IHome = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z"/></svg>;
const IQr = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>;
const ITrophy = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v4a4 4 0 11-8 0V4z"/><path d="M16 6h3v2a3 3 0 01-3 3M8 6H5v2a3 3 0 003 3"/><path d="M9 13h6v2H9z"/><path d="M8 19h8M10 17v2M14 17v2"/></svg>;
const IMap = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IUser = () => <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>;

type NavItem = { id: string; label: string; screen: FanScreen; Icon: () => JSX.Element; isCenter?: boolean };

const TABS: NavItem[] = [
  { id: 'home',   label: 'HOME',   screen: 'dashboard',  Icon: IHome },
  { id: 'deals',  label: 'DEALS',  screen: 'map',        Icon: IMap },
  { id: 'pay',    label: 'PAY',    screen: 'pay',        Icon: IQr, isCenter: true },
  { id: 'points', label: 'POINTS', screen: 'goalpoints', Icon: ITrophy },
  { id: 'me',     label: 'ME',     screen: 'profile',    Icon: IUser },
];

const DESKTOP_LINKS: NavItem[] = TABS.filter(t => !t.isCenter);

export default function BottomNav() {
  const { fanScreen, setFanScreen } = useApp();
  const isDesktop = useIsDesktop();

  /* ── Desktop top nav ──────────────────────────────────────────────────── */
  if (isDesktop) {
    return (
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 200,
        background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', padding: '0 40px',
      }}>
        {/* Logo */}
        <button onClick={() => setFanScreen('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 48, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <LogoMark size={32} />
          <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 16, color: '#fff', letterSpacing: '-0.03em' }}>fanwallet.</span>
        </button>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {DESKTOP_LINKS.map(({ id, label, screen, Icon }) => {
            const active = fanScreen === screen;
            return (
              <button key={id} onClick={() => setFanScreen(screen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', background: active ? 'rgba(0,166,81,0.12)' : 'transparent',
                  color: active ? '#00A651' : '#B6BECB',
                  fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 14, transition: 'all 0.15s',
                }}>
                <Icon />{label.charAt(0) + label.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Pay CTA */}
        <button onClick={() => setFanScreen('pay')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px',
            borderRadius: 999, background: '#00A651', color: '#001b0b',
            fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14,
            border: 'none', cursor: 'pointer', boxShadow: '0 0 0 1px rgba(0,166,81,0.4), 0 8px 24px rgba(0,166,81,0.3)',
          }}>
          <IQr />
          Pay / Receive
        </button>
      </nav>
    );
  }

  /* ── Mobile bottom nav ────────────────────────────────────────────────── */
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50 bottom-nav"
         style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(10,14,26,0.9) 30%, #0a0e1a 60%)', paddingTop: 14, paddingBottom: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', alignItems: 'center', padding: '10px 12px 6px', margin: '0 12px', background: 'rgba(19,24,38,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 22, backdropFilter: 'blur(20px)' }}>
        {TABS.map(({ id, label, screen, Icon, isCenter }) => {
          const active = fanScreen === screen;
          if (isCenter) {
            return (
              <div key={id} style={{ display: 'grid', placeItems: 'center' }}>
                <button onClick={() => setFanScreen(screen)}
                  style={{ width: 50, height: 50, borderRadius: 16, background: '#00A651', display: 'grid', placeItems: 'center', color: '#001b0b', boxShadow: '0 8px 24px -4px rgba(0,166,81,0.7)', marginTop: -22, border: 'none', cursor: 'pointer' }}>
                  <Icon />
                </button>
                <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', color: '#fff', marginTop: 4 }}>{label}</div>
              </div>
            );
          }
          return (
            <button key={id} onClick={() => setFanScreen(screen)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active ? '#00A651' : 'rgba(182,190,203,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              <Icon />
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
