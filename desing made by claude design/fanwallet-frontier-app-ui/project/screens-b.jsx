/* global React, Icons, PhoneShell, BottomNav, LogoMark */

// ============================================================================
// SCREEN 3 — GoalPoints
// ============================================================================
function ScreenGoalPoints() {
  const [tab, setTab] = React.useState('earn');
  return (
    <PhoneShell>
      <div style={{ height:'100%', overflowY:'auto', paddingBottom:120 }} className="no-scrollbar">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px 8px' }}>
          <div className="tap" style={{ width:36, height:36, borderRadius:12, background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Icons.Back size={20}/>
          </div>
          <div className="heavy" style={{ fontSize:15 }}>GoalPoints</div>
          <div className="tap" style={{ width:36, height:36, borderRadius:12, background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Icons.Share size={18}/>
          </div>
        </div>

        {/* Big balance card */}
        <div style={{ margin:'8px 16px 0' }}>
          <div style={{
            position:'relative', background:'#131826', border:'1px solid rgba(255,215,0,0.25)',
            borderRadius:24, padding:'24px 22px 22px', overflow:'hidden',
            boxShadow:'0 20px 60px -20px rgba(255,215,0,0.4)'
          }}>
            <div style={{ position:'absolute', right:-50, top:-50, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,215,0,0.16) 0%, transparent 65%)' }}/>
            <div style={{ position:'absolute', right:18, top:18 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'rgba(255,215,0,0.12)', display:'grid', placeItems:'center', color:'#FFD700', border:'1px solid rgba(255,215,0,0.3)' }}>
                <Icons.Trophy size={22}/>
              </div>
            </div>
            <div className="eyebrow" style={{ fontSize:10, color:'#FFD700', opacity:0.85 }}>YOUR BALANCE</div>
            <div className="display" style={{ fontSize:84, color:'#FFD700', lineHeight:0.9, marginTop:6, letterSpacing:'-0.05em' }}>342</div>
            <div className="eyebrow" style={{ fontSize:11, color:'rgba(255,215,0,0.7)', marginTop:6 }}>POINTS · RANK #8,412</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14, padding:'8px 12px', background:'rgba(255,215,0,0.1)', border:'1px solid rgba(255,215,0,0.25)', borderRadius:12 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'#FFD700', color:'#1a1300', display:'grid', placeItems:'center' }}>
                <Icons.Lightning size={14}/>
              </div>
              <div style={{ flex:1 }}>
                <div className="heavy" style={{ fontSize:12, color:'#FFD700' }}>2× Multiplier Active</div>
                <div style={{ fontSize:10.5, color:'#d1c280' }}>World ID verified · expires in 6 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ margin:'18px 16px 0', display:'flex', gap:4, padding:4, background:'#131826', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 }}>
          {['earn','redeem','history'].map(t => (
            <div key={t} className="tap" onClick={()=>setTab(t)} style={{
              flex:1, padding:'9px 0', textAlign:'center', borderRadius:11,
              background: tab===t ? '#FFD700' : 'transparent',
              color: tab===t ? '#1a1300' : '#B6BECB',
              fontFamily:'Archivo', fontWeight:800, fontSize:12, textTransform:'capitalize'
            }}>{t}</div>
          ))}
        </div>

        {/* Earn list */}
        {tab === 'earn' && (
          <div style={{ padding:'14px 16px 0' }}>
            {[
              { Icon: Icons.Qr, title:'Pay at a partner merchant', sub:'342 deals across host cities', pts:'+10–50', clr:'#00A651' },
              { Icon: Icons.Ball, title:'Predict match outcomes', sub:'Daily streak up to 7×', pts:'+50', clr:'#FFD700' },
              { Icon: Icons.Ticket, title:'Check in at a stadium', sub:'Geofenced to host venues', pts:'+250', clr:'#EF4444' },
              { Icon: Icons.Send, title:'Refer a fellow fan', sub:'Both of you earn', pts:'+500', clr:'#00A651' },
              { Icon: Icons.Flame, title:'Watch parties · 90 min', sub:'Verify with World ID', pts:'+75', clr:'#FFD700' },
            ].map((it, i) => (
              <div key={i} className="tap" style={{
                display:'flex', alignItems:'center', gap:12, padding:'14px 14px',
                background:'#131826', borderRadius:16, border:'1px solid rgba(255,255,255,0.04)',
                marginBottom:8
              }}>
                <div style={{ width:42, height:42, borderRadius:13, background:'rgba(255,255,255,0.04)', display:'grid', placeItems:'center', color: it.clr }}>
                  <it.Icon size={20}/>
                </div>
                <div style={{ flex:1 }}>
                  <div className="heavy" style={{ fontSize:13 }}>{it.title}</div>
                  <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{it.sub}</div>
                </div>
                <div className="heavy" style={{ fontSize:13, color:'#FFD700' }}>{it.pts}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'redeem' && (
          <div style={{ padding:'14px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { title:'Match Ticket Upgrade', cost:5000, clr:'#EF4444' },
              { title:'Stadium F&B Voucher', cost:750, clr:'#00A651' },
              { title:'WC26 Limited Scarf', cost:1200, clr:'#FFD700' },
              { title:'$10 USDC Cashback', cost:1000, clr:'#00A651' },
            ].map((r,i)=>(
              <div key={i} style={{ background:'#131826', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:12 }}>
                <div style={{ height:60, borderRadius:10, background:r.clr, opacity:0.85, marginBottom:10, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 6px, transparent 6px 14px)'}}/>
                </div>
                <div className="heavy" style={{ fontSize:12 }}>{r.title}</div>
                <div className="mono" style={{ fontSize:11, color:'#FFD700', marginTop:4 }}>{r.cost.toLocaleString()} pts</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div style={{ padding:'14px 16px 0' }}>
            {[
              { what:'Paid · El Centro Tacos', when:'Today 1:42 PM', pts:'+12' },
              { what:'Predicted USA vs GER', when:'Today 11:00 AM', pts:'+50' },
              { what:'Check-in · AT&T Stadium', when:'Yesterday', pts:'+250' },
              { what:'Refer · Lukas P.', when:'Mar 11', pts:'+500' },
            ].map((h,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div className="heavy" style={{ fontSize:13 }}>{h.what}</div>
                  <div style={{ fontSize:11, color:'#6b7280' }}>{h.when}</div>
                </div>
                <div className="heavy" style={{ color:'#FFD700' }}>{h.pts}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="goals"/>
    </PhoneShell>
  );
}

// ============================================================================
// SCREEN 4 — Payment QR
// ============================================================================
function QRPattern({ size = 220 }) {
  // procedural QR-ish dot grid — uses deterministic noise
  const cells = 21;
  const c = size / cells;
  const bits = [];
  let seed = 1337;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let y=0; y<cells; y++) for (let x=0; x<cells; x++) bits.push(rand() > 0.5);
  const finderAt = (gx, gy) => bits.forEach((_,i)=>{ const x=i%cells, y=Math.floor(i/cells); if (x>=gx&&x<gx+7&&y>=gy&&y<gy+7) bits[i]=false; });
  finderAt(0,0); finderAt(cells-7,0); finderAt(0,cells-7);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {bits.map((b,i)=> b ? <rect key={i} x={(i%cells)*c} y={Math.floor(i/cells)*c} width={c*0.92} height={c*0.92} rx={c*0.18} fill="#0a0e1a"/> : null)}
      {/* finder squares */}
      {[[0,0],[cells-7,0],[0,cells-7]].map(([gx,gy],i)=> (
        <g key={i}>
          <rect x={gx*c} y={gy*c} width={7*c} height={7*c} rx={c*1.4} fill="#0a0e1a"/>
          <rect x={(gx+1)*c} y={(gy+1)*c} width={5*c} height={5*c} rx={c*1} fill="#fff"/>
          <rect x={(gx+2)*c} y={(gy+2)*c} width={3*c} height={3*c} rx={c*0.7} fill="#0a0e1a"/>
        </g>
      ))}
      {/* center logo cutout */}
      <rect x={size*0.40} y={size*0.40} width={size*0.20} height={size*0.20} rx={size*0.04} fill="#fff"/>
      <rect x={size*0.42} y={size*0.42} width={size*0.16} height={size*0.16} rx={size*0.04} fill="#00A651"/>
    </svg>
  );
}

function ScreenPayQR() {
  return (
    <PhoneShell>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', position:'relative' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px 8px' }}>
          <div className="tap" style={{ width:36, height:36, borderRadius:12, background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Icons.Close size={20}/>
          </div>
          <div className="heavy" style={{ fontSize:15 }}>Scan to pay</div>
          <div className="tap" style={{ width:36, height:36, borderRadius:12, background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Icons.Share size={18}/>
          </div>
        </div>

        {/* Glow halo */}
        <div style={{ position:'absolute', left:'50%', top:'46%', transform:'translate(-50%,-50%)', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,166,81,0.32) 0%, transparent 65%)', pointerEvents:'none' }}/>

        {/* QR card */}
        <div style={{ display:'flex', justifyContent:'center', marginTop:18 }}>
          <div style={{
            position:'relative', background:'#fff', borderRadius:26, padding:18,
            boxShadow:'0 0 0 1px rgba(0,166,81,0.5), 0 30px 80px -20px rgba(0,166,81,0.6)'
          }}>
            <QRPattern size={232}/>
            {/* corner brackets */}
            {[[8,8,'tl'],[8,8,'tr'],[8,8,'bl'],[8,8,'br']].map(([_,__,k],i)=>{
              const pos = { tl:{top:6,left:6}, tr:{top:6,right:6}, bl:{bottom:6,left:6}, br:{bottom:6,right:6} }[k];
              const border = {
                tl:{ borderTop:'2.5px solid #00A651', borderLeft:'2.5px solid #00A651', borderTopLeftRadius:8 },
                tr:{ borderTop:'2.5px solid #00A651', borderRight:'2.5px solid #00A651', borderTopRightRadius:8 },
                bl:{ borderBottom:'2.5px solid #00A651', borderLeft:'2.5px solid #00A651', borderBottomLeftRadius:8 },
                br:{ borderBottom:'2.5px solid #00A651', borderRight:'2.5px solid #00A651', borderBottomRightRadius:8 },
              }[k];
              return <div key={i} style={{ position:'absolute', width:22, height:22, ...pos, ...border }}/>;
            })}
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign:'center', marginTop:24, padding:'0 22px' }}>
          <div className="eyebrow" style={{ fontSize:10, color:'#6b7280' }}>REQUESTING</div>
          <div className="display" style={{ fontSize:54, marginTop:6, letterSpacing:'-0.04em' }}>
            $42<span style={{ color:'#B6BECB' }}>.50</span>
          </div>
          <div className="mono" style={{ fontSize:12, color:'#00A651', marginTop:4 }}>42.50 USDC · Solana</div>

          {/* Merchant */}
          <div style={{ marginTop:18, display:'inline-flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#131826', borderRadius:14, border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'#00A651', display:'grid', placeItems:'center' }}>
              <Icons.Wallet size={16}/>
            </div>
            <div style={{ textAlign:'left' }}>
              <div className="heavy" style={{ fontSize:12 }}>El Centro Tacos</div>
              <div className="mono" style={{ fontSize:10, color:'#6b7280' }}>9xFc…m2T8 · Dallas</div>
            </div>
          </div>

          <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:'#6b7280', fontSize:11 }}>
            <Icons.History size={14}/> QR expires in 4:52
          </div>
        </div>

        {/* CTA */}
        <div style={{ position:'absolute', left:0, right:0, bottom:24, padding:'0 22px' }}>
          <button className="btn-pill btn-green" style={{ width:'100%', fontSize:16, padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <Icons.Qr size={20}/> Open camera to scan
          </button>
          <div style={{ textAlign:'center', marginTop:12, color:'#6b7280', fontSize:11 }}>
            Or share this code · earns <span style={{ color:'#FFD700' }} className="heavy">+12 pts</span>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ============================================================================
// SCREEN 5 — Business POS
// ============================================================================
function ScreenBusinessPOS() {
  const [amount, setAmount] = React.useState('42.50');
  const press = (k) => {
    setAmount(prev => {
      if (k === '⌫') return prev.length<=1 ? '0' : prev.slice(0,-1);
      if (k === '.') return prev.includes('.') ? prev : prev + '.';
      if (prev === '0') return k;
      return prev + k;
    });
  };
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];

  return (
    <PhoneShell>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px 8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'#FFD700', display:'grid', placeItems:'center', color:'#1a1300' }}>
              <Icons.Wallet size={16}/>
            </div>
            <div>
              <div style={{ fontSize:10, color:'#6b7280' }}>MERCHANT</div>
              <div className="heavy" style={{ fontSize:13 }}>El Centro Tacos</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', background:'rgba(0,166,81,0.12)', border:'1px solid rgba(0,166,81,0.3)', borderRadius:999 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00A651' }}/>
            <span className="eyebrow" style={{ fontSize:10, color:'#00A651' }}>POS MODE</span>
          </div>
        </div>

        {/* Amount display */}
        <div style={{ padding:'18px 22px 12px', textAlign:'center' }}>
          <div className="eyebrow" style={{ fontSize:10, color:'#6b7280' }}>CHARGE AMOUNT</div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:8, marginTop:8 }}>
            <div className="display" style={{ fontSize:64, letterSpacing:'-0.04em', color:'#fff' }}>
              ${amount}
            </div>
          </div>
          <div className="mono" style={{ fontSize:11, color:'#00A651', marginTop:2 }}>USDC · Settles in {'< 1 sec'}</div>
        </div>

        {/* Keypad */}
        <div style={{ padding:'4px 22px 0', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {keys.map(k => (
            <div key={k} className="tap" onClick={()=>press(k)} style={{
              height:54, borderRadius:14, background:'#131826', border:'1px solid rgba(255,255,255,0.06)',
              display:'grid', placeItems:'center', fontFamily:'Archivo', fontWeight:800, fontSize:22,
              color: k==='⌫' ? '#B6BECB' : '#fff'
            }}>{k}</div>
          ))}
        </div>

        {/* Generate QR */}
        <div style={{ padding:'12px 22px 0' }}>
          <button className="btn-pill btn-gold" style={{ width:'100%', fontSize:15, padding:'16px 22px', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <Icons.Qr size={20}/> Generate payment QR
          </button>
        </div>

        {/* Recent transactions */}
        <div style={{ padding:'16px 22px 14px', flex:1, overflowY:'auto' }} className="no-scrollbar">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div className="heavy" style={{ fontSize:13 }}>Recent</div>
            <div className="eyebrow" style={{ fontSize:9, color:'#6b7280' }}>TODAY · 14 PMTS</div>
          </div>
          {[
            { amt:'$18.50', when:'2 min ago', from:'7xBe…fK4q', status:'paid' },
            { amt:'$24.00', when:'8 min ago', from:'1aFt…m99X', status:'paid' },
            { amt:'$11.25', when:'14 min ago', from:'9bC2…tH7w', status:'paid' },
            { amt:'$32.00', when:'22 min ago', from:'4dE9…pL3v', status:'paid' },
          ].map((t,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:9, background:'rgba(0,166,81,0.15)', display:'grid', placeItems:'center', color:'#00A651' }}>
                  <Icons.Check size={16}/>
                </div>
                <div>
                  <div className="heavy" style={{ fontSize:12.5 }}>{t.amt}</div>
                  <div className="mono" style={{ fontSize:10, color:'#6b7280' }}>{t.from} · {t.when}</div>
                </div>
              </div>
              <div className="eyebrow" style={{ fontSize:9, color:'#00A651' }}>PAID</div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ============================================================================
// SCREEN 6 — Success
// ============================================================================
function Confetti() {
  // simple confetti pieces
  const pieces = [];
  let s = 42;
  const r = () => { s = (s*9301+49297)%233280; return s/233280; };
  for (let i=0;i<28;i++) {
    pieces.push({
      x: r()*100, y: r()*60, rot: r()*360,
      color: ['#00A651','#FFD700','#fff','#EF4444'][Math.floor(r()*4)],
      w: 6 + r()*6, h: 2 + r()*4
    });
  }
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {pieces.map((p,i)=>(
        <div key={i} style={{
          position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
          width:p.w, height:p.h, background:p.color, transform:`rotate(${p.rot}deg)`,
          borderRadius:1
        }}/>
      ))}
    </div>
  );
}

function ScreenSuccess() {
  return (
    <PhoneShell>
      <div style={{ height:'100%', position:'relative', display:'flex', flexDirection:'column' }}>
        {/* Big glow */}
        <div style={{ position:'absolute', left:'50%', top:'34%', transform:'translate(-50%,-50%)', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,166,81,0.35) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <Confetti/>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'14px 22px' }}>
          <div className="tap" style={{ width:36, height:36, borderRadius:12, background:'#131826', display:'grid', placeItems:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Icons.Close size={20}/>
          </div>
        </div>

        {/* Check */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:42, position:'relative', zIndex:2 }}>
          <div style={{
            width:128, height:128, borderRadius:'50%', background:'#00A651',
            display:'grid', placeItems:'center', color:'#fff',
            boxShadow:'0 0 0 8px rgba(0,166,81,0.12), 0 0 0 24px rgba(0,166,81,0.06), 0 30px 80px -10px rgba(0,166,81,0.7)'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          </div>
          <div className="display" style={{ fontSize:34, marginTop:26, letterSpacing:'-0.03em' }}>Payment confirmed!</div>
          <div style={{ color:'#B6BECB', marginTop:6, fontSize:13 }}>Settled in 0.42s on Solana</div>
        </div>

        {/* Receipt card */}
        <div style={{ margin:'28px 22px 0', background:'#131826', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'18px 18px', position:'relative', zIndex:2 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <div className="eyebrow" style={{ fontSize:10, color:'#6b7280' }}>AMOUNT</div>
            <div className="eyebrow" style={{ fontSize:10, color:'#6b7280' }}>USDC</div>
          </div>
          <div className="display" style={{ fontSize:40, marginTop:4 }}>$42.50</div>
          <div style={{ borderTop:'1px dashed rgba(255,255,255,0.1)', margin:'14px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#B6BECB', marginBottom:8 }}>
            <span>To</span>
            <span className="heavy" style={{ color:'#fff' }}>El Centro Tacos</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#B6BECB', marginBottom:8 }}>
            <span>Network fee</span>
            <span className="mono" style={{ color:'#fff' }}>$0.0002</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:'#B6BECB' }}>
            <span>GoalPoints earned</span>
            <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', background:'rgba(255,215,0,0.12)', border:'1px solid rgba(255,215,0,0.3)', borderRadius:999 }}>
              <Icons.Trophy size={12}/>
              <span className="heavy" style={{ color:'#FFD700', fontSize:12 }}>+24 pts</span>
            </div>
          </div>
        </div>

        {/* Explorer link */}
        <div style={{ textAlign:'center', marginTop:18, position:'relative', zIndex:2 }}>
          <div className="tap" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#00A651', fontFamily:'Archivo', fontWeight:700, fontSize:12 }}>
            View on Solana Explorer <Icons.External size={14}/>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ position:'absolute', left:0, right:0, bottom:24, padding:'0 22px', display:'flex', gap:10, zIndex:2 }}>
          <button className="btn-pill btn-ghost" style={{ flex:1, fontSize:14 }}>Share receipt</button>
          <button className="btn-pill btn-green" style={{ flex:1.4, fontSize:14 }}>Done</button>
        </div>
      </div>
    </PhoneShell>
  );
}

window.ScreenGoalPoints = ScreenGoalPoints;
window.ScreenPayQR = ScreenPayQR;
window.ScreenBusinessPOS = ScreenBusinessPOS;
window.ScreenSuccess = ScreenSuccess;
