/* global React, LogoMark, Wordmark */

// ============================================================================
// MARKETING BANNER — 1200x630 (Open Graph / social)
// ============================================================================
function MarketingBanner() {
  return (
    <div style={{
      width: 1200, height: 630, background:'#0a0e1a', position:'relative', overflow:'hidden',
      fontFamily:'Space Grotesk, system-ui, sans-serif', color:'#fff'
    }}>
      {/* Pitch lines */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 90px)' }}/>
      {/* center circle */}
      <div style={{ position:'absolute', left:'68%', top:'50%', transform:'translate(-50%,-50%)', width:720, height:720, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)' }}/>
      <div style={{ position:'absolute', left:'68%', top:'50%', transform:'translate(-50%,-50%)', width:320, height:320, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)' }}/>
      {/* glow */}
      <div style={{ position:'absolute', left:'-10%', top:'-20%', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,166,81,0.28) 0%, transparent 60%)' }}/>
      <div style={{ position:'absolute', right:'-10%', bottom:'-20%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 60%)' }}/>

      <div style={{ position:'relative', height:'100%', padding:'56px 72px', display:'flex', flexDirection:'column' }}>
        {/* Top row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <LogoMark size={56}/>
            <div className="display" style={{ fontSize:38, letterSpacing:'-0.03em' }}>
              fanwallet<span style={{ color:'#00A651' }}>.</span>
            </div>
          </div>
          <div className="eyebrow" style={{ fontSize:13, color:'#B6BECB', letterSpacing:'0.32em' }}>WORLD CUP '26 · EDITION</div>
        </div>

        {/* Hero text */}
        <div style={{ marginTop:60, maxWidth:760 }}>
          <div className="display" style={{ fontSize:104, letterSpacing:'-0.045em', lineHeight:0.92 }}>
            Pay like a local.<br/>
            Earn like a<br/>
            <span style={{ color:'#FFD700' }}>champion.</span>
          </div>
        </div>

        {/* Footer row */}
        <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          {/* host flags */}
          <div>
            <div className="eyebrow" style={{ fontSize:11, color:'#6b7280', marginBottom:10 }}>HOST CITIES</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:32 }}>
              <span>🇺🇸</span><span>🇲🇽</span><span>🇨🇦</span>
              <div className="heavy" style={{ fontSize:18, color:'#B6BECB', marginLeft:6 }}>48 nations · 16 cities · 1 wallet</div>
            </div>
          </div>

          {/* Solana lockup */}
          <div style={{ textAlign:'right' }}>
            <div className="eyebrow" style={{ fontSize:11, color:'#6b7280', marginBottom:10 }}>BUILT ON</div>
            <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'flex-end' }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg, #00FFA3, #DC1FFF)', display:'grid', placeItems:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" strokeWidth="2.5" strokeLinecap="round"><path d="M5 7l13-2-3 4-13 2zM5 13l13-2-3 4-13 2zM5 19l13-2-3 4-13 2z" fill="#0a0e1a"/></svg>
              </div>
              <div className="display" style={{ fontSize:26, letterSpacing:'-0.02em' }}>SOLANA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PITCH DECK HERO SLIDE — 1920x1080
// ============================================================================
function SponsorWordmark({ name, accent }) {
  return (
    <div style={{
      padding:'14px 22px', borderRadius:14, background:'rgba(255,255,255,0.04)',
      border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:12
    }}>
      <div style={{ width:28, height:28, borderRadius:7, background:accent, opacity:0.85 }}/>
      <div className="heavy" style={{ fontSize:18, color:'#fff', letterSpacing:'-0.01em' }}>{name}</div>
    </div>
  );
}

function PitchSlide() {
  return (
    <div style={{
      width: 1920, height: 1080, background:'#0a0e1a', position:'relative', overflow:'hidden',
      fontFamily:'Space Grotesk, system-ui, sans-serif', color:'#fff'
    }}>
      {/* Pitch lines */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 110px)' }}/>
      <div style={{ position:'absolute', left:'50%', top:'56%', transform:'translate(-50%,-50%)', width:1300, height:1300, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)' }}/>
      {/* glows */}
      <div style={{ position:'absolute', left:'-10%', top:'-15%', width:900, height:900, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,166,81,0.22) 0%, transparent 60%)' }}/>
      <div style={{ position:'absolute', right:'-8%', bottom:'-20%', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%)' }}/>

      <div style={{ position:'relative', height:'100%', padding:'80px 110px', display:'flex', flexDirection:'column' }}>
        {/* Top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:22 }}>
            <LogoMark size={72}/>
            <div>
              <div className="display" style={{ fontSize:48, letterSpacing:'-0.035em', lineHeight:1 }}>
                fanwallet<span style={{ color:'#00A651' }}>.</span>
              </div>
              <div className="eyebrow" style={{ fontSize:13, color:'#00A651', letterSpacing:'0.32em', marginTop:6 }}>FRONTIER · WC26</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div className="eyebrow" style={{ fontSize:13, color:'#B6BECB', letterSpacing:'0.32em' }}>SEED · 2026</div>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#6b7280' }}/>
            <div className="eyebrow" style={{ fontSize:13, color:'#B6BECB', letterSpacing:'0.32em' }}>COLOSSEUM HACKATHON</div>
          </div>
        </div>

        {/* Hero block */}
        <div style={{ marginTop:90 }}>
          <div className="eyebrow" style={{ fontSize:15, color:'#FFD700', letterSpacing:'0.4em' }}>
            🇺🇸 🇲🇽 🇨🇦 · FIFA WORLD CUP 2026
          </div>
          <div className="display" style={{ fontSize:170, lineHeight:0.88, letterSpacing:'-0.045em', marginTop:22 }}>
            Pay like a local.
          </div>
          <div className="display" style={{ fontSize:170, lineHeight:0.88, letterSpacing:'-0.045em', marginTop:4 }}>
            Earn like a <span style={{ color:'#FFD700' }}>champion.</span>
          </div>
          <div style={{ marginTop:34, color:'#B6BECB', fontSize:24, maxWidth:1100, lineHeight:1.4 }}>
            The crypto payments wallet built for 5M+ travelling football fans and the local merchants who'll feed them — sub-second USDC settlement, points for every match.
          </div>
        </div>

        {/* Stats row */}
        <div style={{ marginTop:'auto', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24 }}>
          {[
            { kicker:'TOURIST FANS', value:'5M+', sub:'across 16 host cities' },
            { kicker:'NATIONS', value:'48', sub:'competing · all wallets-ready' },
            { kicker:'SETTLEMENT', value:'<1s', sub:'sub-cent fees on Solana' },
          ].map((s,i)=>(
            <div key={i} style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:24, padding:'32px 36px',
              borderTop: i===1 ? '3px solid #FFD700' : i===0 ? '3px solid #00A651' : '3px solid rgba(255,255,255,0.2)'
            }}>
              <div className="eyebrow" style={{ fontSize:13, color: i===1 ? '#FFD700' : i===0 ? '#00A651' : '#B6BECB', letterSpacing:'0.28em' }}>{s.kicker}</div>
              <div className="display" style={{ fontSize:104, lineHeight:0.95, marginTop:10, letterSpacing:'-0.04em' }}>{s.value}</div>
              <div style={{ color:'#B6BECB', fontSize:18, marginTop:8 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div style={{ marginTop:44, display:'flex', alignItems:'center', gap:18 }}>
          <div className="eyebrow" style={{ fontSize:12, color:'#6b7280', letterSpacing:'0.32em' }}>POWERED WITH</div>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
          <SponsorWordmark name="MoonPay" accent="#7D00FF"/>
          <SponsorWordmark name="Coinbase" accent="#1652F0"/>
          <SponsorWordmark name="Vanish" accent="#00A651"/>
          <SponsorWordmark name="World ID" accent="#FFD700"/>
          <SponsorWordmark name="Solana" accent="#00FFA3"/>
        </div>
      </div>
    </div>
  );
}

window.MarketingBanner = MarketingBanner;
window.PitchSlide = PitchSlide;
