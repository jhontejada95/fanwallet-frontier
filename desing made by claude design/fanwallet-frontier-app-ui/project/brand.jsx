/* global React */
const { useState, useMemo } = React;

// ============================================================================
// LOGO MARK — geometric "F" with a gold pentagon dot
// ============================================================================
function LogoMark({ size = 96, bg = '#00A651', fg = '#0a0e1a', dot = '#FFD700', radius = 0.24 }) {
  const r = size * radius;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: 'block' }}>
      <rect x="0" y="0" width="96" height="96" rx={96 * radius} fill={bg} />
      {/* Bold geometric F — chunky, slightly angled forward */}
      <g fill={fg}>
        {/* vertical stem */}
        <rect x="24" y="20" width="16" height="56" />
        {/* top bar with angled tip (forward motion) */}
        <path d="M24 20 H72 L66 36 H24 Z" />
        {/* middle bar shorter, angled */}
        <path d="M24 42 H58 L53 56 H24 Z" />
      </g>
      {/* Gold pentagon — soccer-ball facet as "point" */}
      <g transform="translate(64 60)">
        <polygon points="10,0 20,7.5 16,19 4,19 0,7.5" fill={dot} />
      </g>
    </svg>
  );
}

// Wordmark — "fanwallet" lowercase Archivo Black + "FRONTIER" caps tag
function Wordmark({ color = '#fff', tagColor = '#00A651', size = 44 }) {
  return (
    <div style={{ display:'inline-flex', flexDirection:'column', gap: size*0.04, lineHeight:1 }}>
      <div className="display" style={{ fontSize: size, color, letterSpacing:'-0.04em' }}>
        fanwallet<span style={{ color: tagColor }}>.</span>
      </div>
      <div className="eyebrow" style={{ fontSize: size*0.22, color: tagColor, letterSpacing:'0.32em' }}>
        FRONTIER · WC26
      </div>
    </div>
  );
}

// Full logo lockup (horizontal)
function LogoHorizontal({ dark = true, scale = 1 }) {
  const bg = dark ? '#0a0e1a' : '#f6f4ef';
  const fg = dark ? '#fff' : '#0a0e1a';
  const tag = '#00A651';
  return (
    <div style={{
      background: bg, padding: 32 * scale, borderRadius: 16, display:'flex',
      alignItems:'center', gap: 20 * scale, width:'100%', height:'100%', boxSizing:'border-box',
      justifyContent:'center'
    }}>
      <LogoMark size={72 * scale} />
      <Wordmark color={fg} tagColor={tag} size={42 * scale} />
    </div>
  );
}

// App icon — bolder, more iconic, with a halo
function AppIcon({ size = 256 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size*0.225, position:'relative', overflow:'hidden',
      background: 'radial-gradient(120% 120% at 20% 0%, #00C962 0%, #00A651 55%, #00803d 100%)',
      boxShadow: '0 18px 50px -10px rgba(0,166,81,0.5), inset 0 1px 0 rgba(255,255,255,0.25)'
    }}>
      {/* subtle pitch lines */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px ' + (size*0.13) + 'px)',
      }} />
      {/* Big geometric F */}
      <svg width={size} height={size} viewBox="0 0 96 96" style={{ position:'absolute', inset:0 }}>
        <g fill="#0a0e1a">
          <rect x="22" y="18" width="18" height="62" />
          <path d="M22 18 H74 L67 36 H22 Z" />
          <path d="M22 42 H60 L54 58 H22 Z" />
        </g>
        <g transform="translate(64 62)">
          <polygon points="11,0 22,8 18,21 4,21 0,8" fill="#FFD700" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// LOGO ARTBOARDS
// ============================================================================

window.BrandArtboards = function BrandArtboards() {
  return (
    <DCSection id="brand" title="Brand Identity" subtitle="Logo system, mark, app icon">
      <DCArtboard id="logo-dark" label="Logo · horizontal · dark" width={520} height={200}>
        <LogoHorizontal dark scale={1} />
      </DCArtboard>
      <DCArtboard id="logo-light" label="Logo · horizontal · light" width={520} height={200}>
        <LogoHorizontal dark={false} scale={1} />
      </DCArtboard>
      <DCArtboard id="mark-dark" label="Mark · primary" width={220} height={220}>
        <div style={{ background:'#0a0e1a', width:'100%', height:'100%', display:'grid', placeItems:'center' }}>
          <LogoMark size={140} />
        </div>
      </DCArtboard>
      <DCArtboard id="mark-mono-dark" label="Mark · mono dark" width={220} height={220}>
        <div style={{ background:'#0a0e1a', width:'100%', height:'100%', display:'grid', placeItems:'center' }}>
          <LogoMark size={140} bg="#fff" fg="#0a0e1a" dot="#0a0e1a" />
        </div>
      </DCArtboard>
      <DCArtboard id="mark-mono-light" label="Mark · mono light" width={220} height={220}>
        <div style={{ background:'#f6f4ef', width:'100%', height:'100%', display:'grid', placeItems:'center' }}>
          <LogoMark size={140} bg="#0a0e1a" fg="#fff" dot="#FFD700" />
        </div>
      </DCArtboard>
      <DCArtboard id="app-icon" label="App icon · 256" width={300} height={300}>
        <div style={{ background:'#0a0e1a', width:'100%', height:'100%', display:'grid', placeItems:'center' }}>
          <AppIcon size={220} />
        </div>
      </DCArtboard>
      <DCArtboard id="app-icon-tiny" label="App icon · scales" width={420} height={300}>
        <div style={{ background:'#0a0e1a', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-around' }}>
          <AppIcon size={160} />
          <AppIcon size={96} />
          <AppIcon size={64} />
          <AppIcon size={40} />
        </div>
      </DCArtboard>
    </DCSection>
  );
};

window.LogoMark = LogoMark;
window.Wordmark = Wordmark;
window.AppIcon = AppIcon;
