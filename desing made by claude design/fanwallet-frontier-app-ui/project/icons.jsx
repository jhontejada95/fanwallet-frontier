/* global React */
// Stroke icon set — 1.75px outline, currentColor
const stroke = { fill:'none', stroke:'currentColor', strokeWidth:1.75, strokeLinecap:'round', strokeLinejoin:'round' };

window.Icons = {
  Deposit: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M12 4v12m0 0l-5-5m5 5l5-5"/><path d="M4 19h16"/></svg>
  ),
  Pay: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>
  ),
  Send: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M21 3L11 13"/><path d="M21 3l-7 18-3-8-8-3 18-7z"/></svg>
  ),
  Split: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="17" r="3"/><path d="M9 9l2 5M15 9l-2 5"/></svg>
  ),
  Qr: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z"/></svg>
  ),
  Wallet: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v2H5a2 2 0 00-2 2V7z"/><path d="M3 9h17a1 1 0 011 1v9a1 1 0 01-1 1H5a2 2 0 01-2-2V9z"/><circle cx="17" cy="14.5" r="1.4"/></svg>
  ),
  Trophy: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M8 4h8v4a4 4 0 11-8 0V4z"/><path d="M16 6h3v2a3 3 0 01-3 3M8 6H5v2a3 3 0 003 3"/><path d="M9 13h6v2H9z"/><path d="M8 19h8M10 17v2M14 17v2"/></svg>
  ),
  Ticket: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z"/><path d="M14 6v12" strokeDasharray="1.5 2"/></svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 10-9 0v4L6 17z"/><path d="M10 20a2 2 0 004 0"/></svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} {...stroke}><path d="M9 6l6 6-6 6"/></svg>
  ),
  Back: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M15 6l-6 6 6 6"/></svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M6 6l12 12M18 6L6 18"/></svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M5 12l5 5L20 7"/></svg>
  ),
  Lightning: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M13 2L4 14h7l-2 8 10-13h-7l1-7z"/></svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M12 5v14M5 12h14"/></svg>
  ),
  Share: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/></svg>
  ),
  Ball: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
      <circle cx="12" cy="12" r="9"/>
      <polygon points="12,7 16,10 14.5,15 9.5,15 8,10"/>
      <path d="M12 3v4M3 12l5-2M21 12l-5-2M5.5 18.5l4-3.5M18.5 18.5l-4-3.5"/>
    </svg>
  ),
  Flame: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M12 3c1 4 5 5 5 10a5 5 0 11-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/></svg>
  ),
  History: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  Gift: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8s-3-5-6-3 1 3 6 3zM12 8s3-5 6-3-1 3-6 3z"/></svg>
  ),
  Backspace: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}><path d="M9 6h11a1 1 0 011 1v10a1 1 0 01-1 1H9l-6-6 6-6z"/><path d="M14 10l-4 4M10 10l4 4"/></svg>
  ),
  External: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} {...stroke}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M14 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V12a2 2 0 012-2h6"/></svg>
  ),
};
