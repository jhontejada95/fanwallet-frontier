/* global React, Icons */
const { useState: useStateA } = React;

// ============================================================================
// Shared phone chrome — status bar + dynamic island
// ============================================================================
function StatusBar({ light = true }) {
  const color = light ? '#fff' : '#000';
  return (
    <div className="status" style={{ color }}>
      <div className="tnum" style={{ fontWeight: 700 }}>9:41</div>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={color}><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="5" y="5" width="3" height="7" rx="0.5"/><rect x="10" y="2" width="3" height="10" rx="0.5"/><rect x="15" y="0" width="3" height="12" rx="0.5" opacity="0.4"/></svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M2 5a10 10 0 0112 0M4.5 7.5a6 6 0 017 0M7 10h2"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke={color} opacity="0.5"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill={color}/><rect x="23.5" y="4" width="2" height="4" rx="1" fill={color} opacity="0.5"/></svg>
      </div>
    </div>
  );
}

function PhoneShell({ children, light = false }) {
  return (
    <div className="phone">
      <div className="notch" />
      <StatusBar light={!light} />
      <div style={{ position:'absolute', inset:'47px 0 0 0', overflow:'hidden' }}>
        {children}
      </div>
      <div className="home-bar" style={{ background: light ? '#000' : '#fff' }} />
    </div>
  );
}

// ============================================================================
// Bottom navigation
// ============================================================================
function BottomNav({ active = 'home' }) {
  const tabs = [
    { id:'home',   label:'Home',     Icon: Icons.Home },
    { id:'pay',    label:'Pay',      Icon: Icons.Qr },
    { id:'goals',  label:'Points',   Icon: Icons.Trophy },
    { id:'deals',  label:'Deals',    Icon: Icons.Ticket },
    { id:'me',     label:'Me',       Icon: Icons.User },
  ];
  return (
    <div style={{
      position:'absolute', left:0, right:0, bottom:0, paddingBottom: 26,
      background: 'linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(10,14,26,0.9) 30%, #0a0e1a 60%)',
      paddingTop: 14,
    }}>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(5,1fr)', alignItems:'center',
        padding:'10px 12px 6px', margin:'0 12px',
        background:'rgba(19,24,38,0.85)', border:'1px solid rgba(255,255,255,0.06)',
        borderRadius: 22, backdropFilter:'blur(20px)',
      }}>
        {tabs.map(t => {
          const on = t.id === active;
          // Pay tab is a center FAB-like
          if (t.id === 'pay') return (
            <div key={t.id} style={{ display:'grid', placeItems:'center' }}>
              <div className="tap" style={{
                width:50, height:50, borderRadius:16, background:'#00A651',
                display:'grid', placeItems:'center', color:'#001b0b',
                boxShadow:'0 8px 24px -4px rgba(0,166,81,0.7)',
                marginTop:-22,
              }}>
                <Icons.Qr size={24}/>
              </div>
              <div className="eyebrow" style={{ color:'#fff', fontSize:9, marginTop:4, letterSpacing:'0.16em' }}>PAY</div>
            </div>
          );
          return (
            <div key={t.id} className="tap" style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              color: on ? '#fff' : 'rgba(182,190,203,0.7)'
            }}>
              <t.Icon size={22} />
              <div className="eyebrow" style={{ fontSize: 9, letterSpacing:'0.16em' }}>{t.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN 1 — Role Picker
// ============================================================================
function ScreenRolePicker({ onSelect }) {
  return (
    <PhoneShell>
      <div className="pitch-lines" style={{ position:'absolute', inset:0 }}>
        {/* center circle */}
        <div style={{
          position:'absolute', left:'50%', top:'52%', transform:'translate(-50%,-50%)',
          width:'180%', aspectRatio:'1', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'50%',
        }}/>
        {/* center line */}
        <div style={{ position:'absolute', left:0, right:0, top:'52%', height:1, background:'rgba(255,255,255,0.06)' }}/>
      </div>
      {/* gradient glow */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(60% 40% at 50% 15%, rgba(0,166,81,0.18) 0%, transparent 70%), radial-gradient(50% 30% at 50% 95%, rgba(255,215,0,0.10) 0%, transparent 70%)'
      }}/>

      <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column', padding:'24px 22px 110px' }}>
        {/* Top: logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginTop:6 }}>
          <LogoMark size={56} />
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
            <div className="display" style={{ fontSize:30, letterSpacing:'-0.04em' }}>
              fanwallet<span style={{ color:'#00A651' }}>.</span>
            </div>
            <div className="eyebrow" style={{ fontSize:9, color:'#00A651', letterSpacing:'0.32em' }}>FRONTIER · WC26</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ textAlign:'center', marginTop:36, padding:'0 8px' }}>
          <div className="heavy" style={{ fontSize:30, lineHeight:1.05, letterSpacing:'-0.02em' }}>
            Pay like a local.<br/>Earn like a <span style={{ color:'#FFD700' }}>champion.</span>
          </div>
          <div style={{ color:'#B6BECB', marginTop:14, fontSize:14, lineHeight:1.4 }}>
            How are you joining the tournament?
          </div>
        </div>

        {/* Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:30 }}>
          <div className="tap" onClick={() => onSelect && onSelect('fan')} style={{
            background:'linear-gradient(135deg, #00A651 0%, #007a3c 100%)',
            borderRadius:22, padding:'22px 22px', position:'relative', overflow:'hidden',
            boxShadow:'0 18px 50px -16px rgba(0,166,81,0.7)',
          }}>
            <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
            <div style={{ position:'absolute', right:18, top:18, opacity:0.9 }}>
              <Icons.Ball size={56} />
            </div>
            <div className="eyebrow" style={{ fontSize:10, opacity:0.85, marginBottom:6 }}>FOR TRAVELERS</div>
            <div className="display" style={{ fontSize:34, lineHeight:0.95 }}>I'm a Fan</div>
            <div style={{ marginTop:8, fontSize:13, opacity:0.92, maxWidth:200 }}>
              Pay merchants, send to friends, earn GoalPoints at every match.
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:18, fontWeight:700, fontFamily:'Archivo' }}>
              Continue <Icons.Chevron size={16}/>
            </div>
          </div>

          <div className="tap" onClick={() => onSelect && onSelect('biz')} style={{
            background:'linear-gradient(135deg, #FFD700 0%, #c99800 100%)',
            color:'#1a1300',
            borderRadius:22, padding:'22px 22px', position:'relative', overflow:'hidden',
            boxShadow:'0 18px 50px -16px rgba(255,215,0,0.55)',
          }}>
            <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:'rgba(0,0,0,0.08)' }}/>
            <div style={{ position:'absolute', right:18, top:18, opacity:0.85 }}>
              <Icons.Wallet size={56} />
            </div>
            <div className="eyebrow" style={{ fontSize:10, opacity:0.7, marginBottom:6 }}>FOR MERCHANTS</div>
            <div className="display" style={{ fontSize:34, lineHeight:0.95 }}>I'm a Business</div>
            <div style={{ marginTop:8, fontSize:13, opacity:0.85, maxWidth:230 }}>
              Accept USDC, settle instantly, reach 5M+ visiting fans.
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:18, fontWeight:700, fontFamily:'Archivo' }}>
              Continue <Icons.Chevron size={16}/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'#6b7280', fontSize:11 }}>
          <span>Powered by</span>
          <span className="heavy" style={{ color:'#B6BECB', fontSize:12 }}>SOLANA</span>
          <span style={{ width:3, height:3, borderRadius:'50%', background:'#6b7280' }}/>
          <span>USDC</span>
          <span style={{ width:3, height:3, borderRadius:'50%', background:'#6b7280' }}/>
          <span>World ID</span>
        </div>
      </div>
    </PhoneShell>
  );
}

// ============================================================================
// SCREEN 2 — Fan Dashboard
// ============================================================================
function MatchCard({ teamA, teamB, codeA, codeB, time, city, live }) {
  return (
    <div style={{
      background:'#131826', border:'1px solid rgba(255,255,255,0.06)',
      borderRadius:18, padding:'14px 14px', minWidth: 232, flex:'0 0 auto'
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div className="eyebrow" style={{ fontSize:9, color:'#6b7280' }}>{city}</div>
        {live ? (
          <div style={{ display:'flex', alignItems:'center', gap:5, color:'#EF4444' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#EF4444' }}/>
            <span className="eyebrow" style={{ fontSize:9 }}>LIVE</span>
          </div>
        ) : (
          <div className="mono" style={{ fontSize:11, color:'#B6BECB' }}>{time}</div>
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <FlagCircle code={codeA} />
          <div className="heavy" style={{ fontSize:14 }}>{teamA}</div>
        </div>
        <div className="mono" style={{ color:'#6b7280', fontSize:11 }}>vs</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="heavy" style={{ fontSize:14 }}>{teamB}</div>
          <FlagCircle code={codeB} />
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12, paddingTop:10, borderTop:'1px dashed rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:11, color:'#B6BECB' }}>Win bet · <span style={{ color:'#FFD700' }} className="heavy">+50 pts</span></div>
        <div className="eyebrow" style={{ fontSize:9, color:'#00A651' }}>PREDICT →</div>
      </div>
    </div>
  );
}

function FlagCircle({ code, size = 24 }) {
  // simple two-tone flag swatch by ISO code (illustrative, not exact)
  const flags = {
    USA: ['#3C3B6E','#fff','#B22234'],
    MEX: ['#006847','#fff','#CE1126'],
    CAN: ['#D52B1E','#fff','#D52B1E'],
    BRA: ['#009C3B','#FEDF00','#002776'],
    ARG: ['#74ACDF','#fff','#74ACDF'],
    GER: ['#000','#DD0000','#FFCE00'],
    FRA: ['#0055A4','#fff','#EF4135'],
    JPN: ['#fff','#BC002D','#fff'],
    ESP: ['#AA151B','#F1BF00','#AA151B'],
    POR: ['#006600','#fff','#FF0000'],
  };
  const c = flags[code] || ['#374151','#6b7280','#374151'];
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden', flex:'0 0 auto', position:'relative', border:'1.5px solid rgba(255,255,255,0.18)' }}>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg, ${c[0]} 33%, ${c[1]} 33% 66%, ${c[2]} 66%)` }}/>
      <div className="mono" style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', fontSize: size*0.32, color:'#fff', fontWeight:800, textShadow:'0 1px 2px rgba(0,0,0,0.5)' }}>{code}</div>
    </div>
  );
}

function DealCard({ name, deal, distance, color }) {
  return (
    <div style={{
      background:'#131826', border:'1px solid rgba(255,255,255,0.06)',
      borderRadius:18, minWidth:170, flex:'0 0 auto', overflow:'hidden'
    }}>
      <div style={{ height:84, background:color, position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 6px, transparent 6px 14px)'}}/>
        <div style={{ position:'absolute', top:8, right:8, padding:'4px 8px', borderRadius:999, background:'#0a0e1a', color:'#FFD700', fontFamily:'Archivo', fontWeight:800, fontSize:11 }}>
          {deal}
        </div>
      </div>
      <div style={{ padding:'10px 12px 12px' }}>
        <div className="heavy" style={{ fontSize:13 }}>{name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:6, color:'#6b7280', fontSize:11, marginTop:3 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'#00A651' }}/>{distance}
        </div>
      </div>
    </div>
  );
}

function ScreenDashboard() {
  return (
    <PhoneShell>
      <div style={{ height:'100%', overflowY:'auto', paddingBottom:120 }} className="no-scrollbar">
        {/* Top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 22px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="heavy" style={{ fontSize:13, color:'#FFD700' }}>MR</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:'#6b7280' }}>Welcome back</div>
              <div className="heavy" style={{ fontSize:14 }}>Marco R. <span style={{ color:'#6b7280' }}>· 🇲🇽 → 🇺🇸</span></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <div className="tap" style={{ width:36, height:36, borderRadius:12, background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
              <Icons.Bell size={18}/>
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div style={{ margin:'4px 16px 0' }}>
          <div style={{
            position:'relative', background:'linear-gradient(135deg, #00C962 0%, #00A651 50%, #007a3c 100%)',
            borderRadius:24, padding:'20px 22px', overflow:'hidden',
            boxShadow:'0 20px 50px -18px rgba(0,166,81,0.6)'
          }}>
            <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
            <div style={{ position:'absolute', right:14, top:14, opacity:0.9 }}><LogoMark size={28} bg="rgba(0,0,0,0.18)" fg="#fff" dot="#FFD700" radius={0.28}/></div>
            <div className="eyebrow" style={{ fontSize:10, opacity:0.85 }}>USDC BALANCE</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:6 }}>
              <div className="display" style={{ fontSize:46, lineHeight:1 }}>
                $124<span style={{ opacity:0.7 }}>.50</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.22)', padding:'4px 10px', borderRadius:999, fontSize:11 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#FFD700' }}/>
                ≈ $124.50 USD
              </div>
              <div style={{ fontSize:11, opacity:0.8 }}>+$8.00 today</div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, padding:'18px 16px 0' }}>
          {[
            { id:'dep', label:'Deposit', Icon: Icons.Deposit },
            { id:'pay', label:'Pay', Icon: Icons.Qr },
            { id:'snd', label:'Send', Icon: Icons.Send },
            { id:'spl', label:'Split', Icon: Icons.Split },
          ].map(a => (
            <div key={a.id} className="tap" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <div style={{ width:54, height:54, borderRadius:18, background:'#131826', border:'1px solid rgba(255,255,255,0.06)', display:'grid', placeItems:'center', color:'#00A651' }}>
                <a.Icon size={22} />
              </div>
              <div className="heavy" style={{ fontSize:11 }}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* GoalPoints banner */}
        <div style={{ margin:'18px 16px 0' }}>
          <div className="tap" style={{
            position:'relative', background:'linear-gradient(95deg, #2a1f00 0%, #4a3500 100%)',
            border:'1px solid rgba(255,215,0,0.3)',
            borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, overflow:'hidden'
          }}>
            <div style={{ position:'absolute', right:-10, top:-30, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)'}}/>
            <div style={{ width:44, height:44, borderRadius:14, background:'#FFD700', display:'grid', placeItems:'center', color:'#1a1300' }}>
              <Icons.Trophy size={22} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <div className="display" style={{ fontSize:26, color:'#FFD700' }}>342</div>
                <div className="eyebrow" style={{ fontSize:10, color:'#FFD700' }}>GOALPOINTS</div>
              </div>
              <div style={{ fontSize:11, color:'#d1c280' }}>2x Multiplier active · World ID verified</div>
            </div>
            <Icons.Chevron size={16} />
          </div>
        </div>

        {/* Today's matches */}
        <div style={{ padding:'22px 0 0 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:16 }}>
            <div className="heavy" style={{ fontSize:16 }}>Today's matches</div>
            <div className="eyebrow" style={{ fontSize:10, color:'#00A651' }}>SEE ALL →</div>
          </div>
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingTop:12, paddingRight:16 }} className="no-scrollbar">
            <MatchCard teamA="MEX" teamB="ESP" codeA="MEX" codeB="ESP" city="Mexico City" live />
            <MatchCard teamA="USA" teamB="GER" codeA="USA" codeB="GER" city="Dallas" time="20:00" />
            <MatchCard teamA="BRA" teamB="FRA" codeA="BRA" codeB="FRA" city="Toronto" time="22:00" />
          </div>
        </div>

        {/* Deals near you */}
        <div style={{ padding:'22px 0 0 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingRight:16 }}>
            <div className="heavy" style={{ fontSize:16 }}>Deals near you</div>
            <div style={{ fontSize:11, color:'#6b7280' }}>Dallas, TX</div>
          </div>
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingTop:12, paddingRight:16 }} className="no-scrollbar">
            <DealCard name="El Centro Tacos" deal="−15%" distance="0.2 mi" color="#00A651"/>
            <DealCard name="Pitch Pub & Co." deal="2x pts" distance="0.4 mi" color="#FFD700"/>
            <DealCard name="Fan Zone Merch" deal="−10%" distance="0.6 mi" color="#EF4444"/>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </PhoneShell>
  );
}

window.ScreenRolePicker = ScreenRolePicker;
window.ScreenDashboard = ScreenDashboard;
window.FlagCircle = FlagCircle;
window.BottomNav = BottomNav;
window.PhoneShell = PhoneShell;
window.StatusBar = StatusBar;
