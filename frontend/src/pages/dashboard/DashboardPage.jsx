import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { useRoadmapProgress } from '../../hooks/useRoadmap'
import { useProfile } from '../../hooks/useProfile'

const MONO = 'Share Tech Mono, monospace'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { background:#3C091E; font-family:'Share Tech Mono',monospace; overflow-x:hidden; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#BE473D; }
  ::selection { background:rgba(190,71,61,0.4); }

  @keyframes floatA { 0%,100%{transform:translateY(0)rotate(0deg)} 50%{transform:translateY(-16px)rotate(4deg)} }
  @keyframes floatB { 0%,100%{transform:translateY(0)rotate(0deg)} 50%{transform:translateY(-10px)rotate(-3deg)} }
  @keyframes floatC { 0%,100%{transform:translateY(0)rotate(0deg)} 50%{transform:translateY(-22px)rotate(6deg)} }
  @keyframes mq     { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes glow   { 0%,100%{opacity:0.18} 50%{opacity:0.28} }
  @keyframes scan   { from{top:-2px} to{top:100%} }
  @keyframes upIn   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .u1{animation:upIn .8s cubic-bezier(.16,1,.3,1) .08s both}
  .u2{animation:upIn .8s cubic-bezier(.16,1,.3,1) .18s both}
  .u3{animation:upIn .8s cubic-bezier(.16,1,.3,1) .28s both}
  .u4{animation:upIn .8s cubic-bezier(.16,1,.3,1) .38s both}
  .u5{animation:upIn .8s cubic-bezier(.16,1,.3,1) .48s both}
  .u6{animation:upIn .8s cubic-bezier(.16,1,.3,1) .58s both}
  .u7{animation:fadeIn .8s ease .7s both}

  /* ─── Hero layout: mobile = single col centered, desktop = 3-col ─── */
  .hero-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 20px;
    gap: 0;
  }
  .hero-left  { display: none; }
  .hero-right { display: none; }
  .hero-center { width: 100%; }

  /* mobile: name font size scales with vw */
  .hero-name {
    font-size: clamp(56px, 18vw, 120px);
    letter-spacing: -3px;
    line-height: 0.88;
  }
  .hero-mood {
    font-size: clamp(56px, 18vw, 120px);
    letter-spacing: -3px;
    line-height: 0.88;
  }

  /* mobile stats row — inline below progress */
  .stats-mobile {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 12px;
  }
  .stats-desktop { display: none; }

  /* mobile CTAs — stack nicely */
  .cta-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 24px;
  }

  /* ─── DESKTOP (≥ 700px) ─── */
  @media (min-width: 700px) {
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr minmax(0, 580px) 1fr;
      text-align: center;
      padding: 0;
      gap: 0;
    }
    .hero-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 0 0 40px;
    }
    .hero-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      padding: 0 40px 0 0;
    }
    .hero-name { font-size: clamp(80px, 14vw, 148px); letter-spacing: -4px; }
    .hero-mood { font-size: clamp(80px, 14vw, 148px); letter-spacing: -4px; }
    .stats-mobile  { display: none; }
    .stats-desktop { display: flex; flex-direction: column; align-items: flex-end; gap: 0; }
    .cta-row { margin-top: 28px; }
  }

  /* feature rows */
  .feat-row { transition: all .18s ease; border-left: 2px solid transparent; }
  .feat-row:hover { background:rgba(240,237,232,0.04) !important; border-left-color:#BE473D !important; }
  .feat-row:hover .fnum { color:#BE473D !important; }
  .feat-row:hover .flbl { color:#F0EDE8 !important; }
  .feat-row:hover .farr { opacity:1 !important; transform:translateX(4px) !important; }

  /* quick ask */
  .qrow { transition: all .18s; border-left: 2px solid transparent; }
  .qrow:hover { background:rgba(190,71,61,0.06) !important; border-left-color:#BE473D !important; }
  .qrow:hover .qarr { opacity:1 !important; }

  /* CTA buttons */
  .cta-a { transition: all .2s; }
  .cta-a:hover { background:#BE473D !important; border-color:#BE473D !important; color:#F0EDE8 !important; }
  .cta-b { transition: all .2s; }
  .cta-b:hover { color:#F0EDE8 !important; border-color:rgba(240,237,232,0.4) !important; }
  .kuya-link { transition: all .2s; }
  .kuya-link:hover { background:rgba(60,9,30,0.08) !important; border-color:rgba(60,9,30,0.25) !important; }
`

function govDoneCount(email) {
  try {
    var s = localStorage.getItem('gradready-gov-statuses-' + (email || 'guest'))
    return s ? Object.values(JSON.parse(s)).filter(function(v) { return v === 'done' }).length : 0
  } catch(e) { return 0 }
}

var FEATURES = [
  { n:'01', label:'MY ROADMAP',   sub:'Week-by-week checklist for your journey',      to:'/dashboard/roadmap' },
  { n:'02', label:'GOV REGS',     sub:'TIN · SSS · PhilHealth · Pag-IBIG · NBI',     to:'/dashboard/gov'     },
  { n:'03', label:'KUYA AI',      sub:'Your post-grad big brother — always online',   to:'/dashboard/chat',  hot:true },
  { n:'04', label:'JOB SEARCH',   sub:'AI-matched openings from PH job boards',       to:'/dashboard/jobs'    },
  { n:'05', label:'FINANCE',      sub:'Salary calculator · 50/30/20 · Investing PH',  to:'/dashboard/finance' },
  { n:'06', label:'BOARD EXAMS',  sub:'PRC schedules + AI-generated study plans',     to:'/dashboard/board'   },
  { n:'07', label:'JOB TRACKER',  sub:'Track every application in one place',         to:'/dashboard/tracker' },
  { n:'08', label:'SALARY BOARD', sub:'Real anonymous salaries from PH companies',    to:'/dashboard/salary'  },
]

var QUICK = [
  'Paano mag-register sa PhilHealth?',
  'What do I need for NBI clearance?',
  'How to negotiate my first salary?',
  'What is Pag-IBIG MP2?',
]

function Cube({ x, y, s, r, a, d, light }) {
  return (
      <div style={{ position:'absolute', left:x+'%', top:y+'%', pointerEvents:'none',
        animation:a+' '+(7+d)+'s ease-in-out infinite', animationDelay:d+'s' }}>
        <div style={{ width:s, height:s,
          background: light ? 'rgba(60,9,30,0.055)' : 'rgba(240,237,232,0.035)',
          border:'1px solid '+(light ? 'rgba(60,9,30,0.075)' : 'rgba(240,237,232,0.055)'),
          borderRadius:7, transform:'rotate('+r+'deg)' }} />
      </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate  = useNavigate()
  const { data: progress } = useRoadmapProgress()
  const { data: profile }  = useProfile()

  var email = user ? (user.email || user.username || '') : ''
  var [gov, setGov] = useState(function(){ return govDoneCount(email) })
  useEffect(function() {
    function upd() { setGov(govDoneCount(email)) }
    window.addEventListener('gov-status-updated', upd)
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') upd()
    })
    return function() { window.removeEventListener('gov-status-updated', upd) }
  }, [email])

  var name  = (profile?.fullName || user?.fullName || 'KA-GRAD').split(' ')[0].toUpperCase()
  var pct   = progress?.percentage ?? 0
  var done  = progress?.completed  ?? 0
  var total = progress?.total      ?? 0
  var init  = name.charAt(0)
  var region = (profile?.region || 'PHILIPPINES').split('(')[0].trim()

  var hi = (function(){
    var h = new Date().getHours()
    return h < 12 ? 'MAGANDANG UMAGA' : h < 18 ? 'MAGANDANG HAPON' : 'MAGANDANG GABI'
  })()
  var mood = pct===0?"LET'S BEGIN.":pct<30?'KEEP GOING.':pct<60?'HALFWAY THERE.':pct<90?'ALMOST DONE.':'COMPLETED.'

  return (
      <div style={{ minHeight:'100vh', background:'#3C091E', fontFamily:MONO, color:'#F0EDE8', paddingBottom:72 }}>
        <style>{CSS}</style>

        {/* NAV */}
        <nav style={{
          position:'fixed', top:0, left:0, right:0, zIndex:200,
          height:52, padding:'0 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'rgba(42,5,21,0.92)', backdropFilter:'blur(28px)',
          borderBottom:'1px solid rgba(240,237,232,0.055)',
        }}>
          <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2.5 }}>
              {[0,1,2,3].map(function(i){ return <div key={i} style={{ width:7, height:7, borderRadius:1, background:i<2?'#BE473D':'#C8A84B' }} /> })}
            </div>
            <span style={{ fontSize:11, letterSpacing:4, color:'rgba(240,237,232,0.85)' }}>GRADREADY</span>
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:8, letterSpacing:2, color:'rgba(240,237,232,0.22)' }}>
            <span style={{ color:'#1E8449' }}>●</span> ONLINE
          </span>
            <Link to="/dashboard/profile" style={{
              textDecoration:'none', width:28, height:28,
              background:'#BE473D', display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:MONO, fontSize:12, color:'#F0EDE8',
            }}>{init}</Link>
          </div>
        </nav>

        {/* ══ HERO — 100vh, responsive ══ */}
        <section style={{
          height:'100vh', position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          paddingTop:52,
        }}>
          {/* Grid */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            backgroundImage:'linear-gradient(rgba(240,237,232,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.012) 1px,transparent 1px)',
            backgroundSize:'52px 52px' }} />
          {/* Scanline */}
          <div style={{ position:'absolute', left:0, right:0, height:2, zIndex:1, pointerEvents:'none',
            background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.16),transparent)',
            animation:'scan 9s linear infinite' }} />
          {/* Central glow */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:'min(88vw,700px)', height:'min(88vw,700px)', borderRadius:'50%', pointerEvents:'none',
            background:'radial-gradient(circle,rgba(190,71,61,0.22) 0%,rgba(190,71,61,0.07) 38%,transparent 68%)',
            animation:'glow 5s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:'min(44vw,340px)', height:'min(44vw,340px)', borderRadius:'50%', pointerEvents:'none',
            background:'radial-gradient(circle,rgba(200,138,75,0.09) 0%,transparent 70%)' }} />

          {/* 3D blocks — only visible on wider screens */}
          <div style={{ position:'absolute', top:64, right:-16, perspective:700, zIndex:3, pointerEvents:'none' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8,
              transform:'rotateX(20deg) rotateY(-26deg)', transformStyle:'preserve-3d',
              animation:'floatA 10s ease-in-out infinite' }}>
              {Array(9).fill(0).map(function(_,i){
                return <div key={i} style={{ width:44, height:28,
                  background:'linear-gradient(135deg,rgba(139,26,42,'+(0.38+(i%3)*0.14)+') 0%,rgba(60,9,30,0.9) 100%)',
                  borderRadius:5, boxShadow:'0 4px 12px rgba(0,0,0,0.5)', transform:'translateZ('+(i*3.5)+'px)' }} />
              })}
            </div>
          </div>

          {/* Cubes */}
          <Cube x={2}  y={12} s={52} r={15}  a="floatA" d={0}   />
          <Cube x={88} y={16} s={34} r={-20} a="floatB" d={1.8} />
          <Cube x={5}  y={72} s={28} r={20}  a="floatC" d={2.4} />
          <Cube x={91} y={66} s={56} r={-8}  a="floatA" d={0.9} />
          <Cube x={44} y={5}  s={18} r={35}  a="floatB" d={3.1} />
          <Cube x={1}  y={44} s={14} r={-16} a="floatB" d={3.6} />

          {/* Diagonals */}
          {[{l:'6%',t:'22%',a:-26,w:220},{l:'54%',t:'8%',a:14,w:170},{l:'0',t:'74%',a:-10,w:300},{l:'66%',t:'72%',a:20,w:160}].map(function(d,i){
            return <div key={i} style={{ position:'absolute', left:d.l, top:d.t, width:d.w, height:1,
              background:'rgba(240,237,232,0.05)', transform:'rotate('+d.a+'deg)', transformOrigin:'left center', pointerEvents:'none' }} />
          })}

          {/* Binary */}
          {[['6%','15%','10100110_'],['70%','28%','01001101_'],['12%','80%','00110101_'],['80%','50%','01010011_']].map(function(d,i){
            return <div key={i} style={{ position:'absolute', left:d[0], top:d[1], pointerEvents:'none',
              fontFamily:'monospace', fontSize:9, color:'rgba(240,237,232,0.09)', letterSpacing:2, userSelect:'none' }}>{d[2]}</div>
          })}

          {/* Plus markers */}
          {[[28,40],[72,16],[56,62],[18,88],[84,76]].map(function(p,i){
            return <div key={i} style={{ position:'absolute', left:p[0]+'%', top:p[1]+'%',
              color:'rgba(240,237,232,0.1)', fontSize:14, pointerEvents:'none', userSelect:'none' }}>+</div>
          })}

          {/* Targeting reticles */}
          {[280,180,100].map(function(sz,i){
            return <div key={i} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              width:sz, height:sz, borderRadius:'50%', border:'1px solid rgba(190,71,61,'+(0.07-i*0.018)+')', pointerEvents:'none' }} />
          })}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:320, height:1, background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.07),transparent)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:1, height:320, background:'linear-gradient(to bottom,transparent,rgba(190,71,61,0.07),transparent)', pointerEvents:'none' }} />

          {/* Ambient data labels — only show on desktop via media query trick: use tiny text */}
          <div style={{ position:'absolute', left:'3%', top:'18%', fontFamily:'monospace', fontSize:8, color:'rgba(240,237,232,0.08)', letterSpacing:1.5, lineHeight:1.8, pointerEvents:'none' }}>// TIN REGISTRATION<br/><span style={{ fontSize:7 }}>IS · 01 · 02 · 03</span></div>
          <div style={{ position:'absolute', right:'3%', bottom:'14%', fontFamily:'monospace', fontSize:8, color:'rgba(240,237,232,0.07)', letterSpacing:1.5, lineHeight:1.8, textAlign:'right', pointerEvents:'none' }}>// BOARD EXAM PREP<br/><span style={{ fontSize:7 }}>IS · 01 · 02 · 03</span></div>

          {/* ══ HERO CONTENT GRID ══ */}
          <div className="hero-grid" style={{ position:'relative', zIndex:10, width:'100%', height:'100%' }}>

            {/* LEFT — region tag + vertical text (desktop only) */}
            <div className="hero-left">
              <div className="u1" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px 5px 10px', border:'1px solid rgba(190,71,61,0.38)', marginBottom:24 }}>
                <span style={{ fontSize:9, color:'#BE473D' }}>00</span>
                <span style={{ fontSize:9, letterSpacing:2, color:'rgba(240,237,232,0.55)' }}>{region}</span>
              </div>
              <div style={{ width:1, height:56, background:'linear-gradient(to bottom,rgba(240,237,232,0.18),transparent)', marginBottom:20 }} />
              <div style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.25)', letterSpacing:3, writingMode:'vertical-rl', transform:'rotate(180deg)' }}>{hi}</div>
            </div>

            {/* CENTER — name + status + progress + CTAs */}
            <div className="hero-center" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>

              {/* Mobile-only region tag */}
              <div className="u1" style={{ marginBottom:16 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(190,71,61,0.35)' }}>
                  <span style={{ fontSize:9, color:'#BE473D' }}>00</span>
                  <span style={{ fontSize:9, letterSpacing:2, color:'rgba(240,237,232,0.5)' }}>{region}</span>
                </div>
              </div>

              {/* Greeting */}
              <div className="u2" style={{ fontFamily:MONO, fontSize:11, color:'rgba(240,237,232,0.3)', letterSpacing:3, marginBottom:6 }}>
                {hi},<span style={{ animation:'blink 1.2s infinite', marginLeft:3 }}>_</span>
              </div>

              {/* NAME */}
              <div className="u3 hero-name" style={{ fontFamily:MONO, color:'#F0EDE8', fontWeight:'normal' }}>
                {name}
              </div>

              {/* STATUS WORD — red + glowing underline */}
              <div className="u4" style={{ marginBottom:32 }}>
                <div style={{ position:'relative', display:'inline-block' }}>
                  <div style={{ position:'absolute', bottom:4, left:0, right:0, height:3, background:'#BE473D', boxShadow:'0 0 18px rgba(190,71,61,0.85), 0 0 36px rgba(190,71,61,0.35)' }} />
                  <div className="hero-mood" style={{ fontFamily:MONO, color:'#BE473D', fontWeight:'normal' }}>{mood}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="u5" style={{ width:'min(360px,84vw)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.28)', letterSpacing:2 }}>// JOURNEY PROGRESS</span>
                  <span style={{ fontFamily:MONO, fontSize:9, color:'#BE473D' }}>{pct}%</span>
                </div>
                <div style={{ height:2, background:'rgba(240,237,232,0.07)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, width:pct+'%', background:'linear-gradient(90deg,#BE473D,#C8A84B)', boxShadow:'0 0 12px rgba(190,71,61,0.8)', transition:'width 1.4s cubic-bezier(.16,1,.3,1)' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                  <span style={{ fontFamily:MONO, fontSize:8, color:'rgba(240,237,232,0.18)' }}>{done}/{total} TASKS</span>
                  <span style={{ fontFamily:MONO, fontSize:8, color:'rgba(240,237,232,0.18)' }}>GOV {gov}/6 DONE</span>
                </div>
              </div>

              {/* Mobile stats */}
              <div className="u5 stats-mobile">
                {[{l:'TASKS',v:done+'/'+total},{l:'GOV REGS',v:gov+'/6'},{l:'PROGRESS',v:pct+'%'}].map(function(s){
                  return (
                      <div key={s.l} style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:MONO, fontSize:7, color:'rgba(240,237,232,0.22)', letterSpacing:1.5, marginBottom:2 }}>{s.l}</div>
                        <div style={{ fontFamily:MONO, fontSize:18, color:'#F0EDE8', letterSpacing:'-1px' }}>{s.v}</div>
                      </div>
                  )
                })}
              </div>

              {/* CTA buttons */}
              <div className="u6 cta-row">
                <Link to="/dashboard/roadmap" className="cta-a" style={{ textDecoration:'none', padding:'12px 26px', border:'1px solid rgba(240,237,232,0.28)', background:'transparent', fontFamily:MONO, fontSize:10, color:'rgba(240,237,232,0.8)', letterSpacing:2.5 }}>
                  VIEW ROADMAP
                </Link>
                <Link to="/dashboard/chat" className="cta-b" style={{ textDecoration:'none', padding:'12px 26px', border:'1px solid rgba(240,237,232,0.1)', background:'rgba(240,237,232,0.03)', fontFamily:MONO, fontSize:10, color:'rgba(240,237,232,0.4)', letterSpacing:2.5 }}>
                  ASK KUYA AI
                </Link>
              </div>
            </div>

            {/* RIGHT — desktop stats column */}
            <div className="hero-right stats-desktop">
              <div style={{ width:1, height:56, background:'linear-gradient(to bottom,rgba(240,237,232,0.18),transparent)', marginBottom:24 }} />
              {[{l:'TASKS DONE',v:done+'/'+total},{l:'GOV REGS',v:gov+'/6'},{l:'PROGRESS',v:pct+'%'}].map(function(s,i){
                return (
                    <div key={s.l} className="u1" style={{ textAlign:'right', marginBottom:i<2?22:0, borderRight:'2px solid rgba(190,71,61,'+(i===0?0.55:0.18)+')', paddingRight:14 }}>
                      <div style={{ fontFamily:MONO, fontSize:8, color:'rgba(240,237,232,0.25)', letterSpacing:2, marginBottom:4 }}>{s.l}</div>
                      <div style={{ fontFamily:MONO, fontSize:26, color:'#F0EDE8', letterSpacing:'-1px', lineHeight:1 }}>{s.v}</div>
                    </div>
                )
              })}
              <div style={{ width:1, height:56, background:'linear-gradient(to top,rgba(240,237,232,0.18),transparent)', marginTop:24 }} />
            </div>
          </div>


        </section>

        {/* MARQUEE */}
        <div style={{ background:'#BE473D', borderTop:'1px solid rgba(60,9,30,0.3)', borderBottom:'1px solid rgba(60,9,30,0.3)', padding:'11px 0', overflow:'hidden' }}>
          <div style={{ display:'flex', animation:'mq 30s linear infinite', whiteSpace:'nowrap' }}>
            {Array(4).fill(['TIN REGISTRATION','·','SSS','·','PHILHEALTH','·','PAG-IBIG','·','NBI CLEARANCE','·','PHILSYS ID','·','PRC BOARD EXAM','·','KUYA AI','·','JOB TRACKER','·','SALARY BOARD','·']).flat().map(function(item,i){
              return <span key={i} style={{ fontFamily:MONO, fontSize:10, letterSpacing:3, color:item==='·'?'rgba(240,237,232,0.45)':'#F0EDE8', marginRight:item==='·'?16:24 }}>{item}</span>
            })}
          </div>
        </div>

        {/* BODY */}
        <div id="db-body">

          {/* FEATURES */}
          <section style={{ background:'#3C091E', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.008) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.008) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:0, right:0, width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
            {[['4%','8%','10100110_'],['78%','30%','01001101_']].map(function(d,i){ return <div key={i} style={{ position:'absolute', left:d[0], top:d[1], fontFamily:'monospace', fontSize:8.5, color:'rgba(240,237,232,0.07)', letterSpacing:2, pointerEvents:'none' }}>{d[2]}</div> })}

            <div style={{ maxWidth:600, margin:'0 auto', padding:'32px 20px 0', position:'relative', zIndex:2 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:22 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px 5px 10px', border:'1px solid rgba(240,237,232,0.1)' }}>
                  <span style={{ fontSize:9, color:'#BE473D' }}>02</span>
                  <span style={{ fontSize:9, letterSpacing:2.5, color:'rgba(240,237,232,0.38)' }}>FEATURES</span>
                </div>
                <div style={{ display:'flex', gap:3 }}>
                  <div style={{ width:2, height:16, background:'rgba(240,237,232,0.14)' }} />
                  <div style={{ width:2, height:16, background:'rgba(240,237,232,0.14)' }} />
                </div>
              </div>

              <div style={{ borderTop:'1px solid rgba(240,237,232,0.07)' }}>
                {FEATURES.map(function(f){
                  return (
                      <Link key={f.to} to={f.to} className="feat-row" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:16, padding:'16px 12px 16px 14px', borderBottom:'1px solid rgba(240,237,232,0.06)', background:'transparent' }}>
                        <span className="fnum" style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.18)', letterSpacing:1, flexShrink:0, width:22, transition:'color .18s' }}>{f.n}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                            <span className="flbl" style={{ fontFamily:MONO, fontSize:12, color:'rgba(240,237,232,0.65)', letterSpacing:.5, transition:'color .18s' }}>{f.label}</span>
                            {f.hot && <span style={{ fontFamily:'monospace', fontSize:7, color:'#BE473D', padding:'2px 6px', border:'1px solid rgba(190,71,61,0.4)', letterSpacing:1, flexShrink:0 }}>AI</span>}
                          </div>
                          <div style={{ fontFamily:'monospace', fontSize:9.5, color:'rgba(240,237,232,0.22)', letterSpacing:.3 }}>{f.sub}</div>
                        </div>
                        <span className="farr" style={{ fontFamily:MONO, fontSize:18, color:'rgba(240,237,232,0.18)', flexShrink:0, opacity:0.3, transition:'all .18s' }}>›</span>
                      </Link>
                  )
                })}
              </div>
            </div>
            <div style={{ height:32 }} />
          </section>

          {/* QUICK ASK + KUYA — light section */}
          <section style={{ background:'#F0EDE8', position:'relative', overflow:'hidden', padding:'32px 20px' }}>
            <Cube x={2} y={8} s={48} r={14} a="floatA" d={0} light />
            <Cube x={90} y={6} s={34} r={-20} a="floatB" d={1.5} light />
            <Cube x={4} y={74} s={40} r={20} a="floatC" d={0.8} light />
            <Cube x={88} y={70} s={50} r={-12} a="floatA" d={2.1} light />
            <div style={{ position:'absolute', left:0, top:'42%', width:'55%', height:1, background:'rgba(60,9,30,0.05)', transform:'rotate(-9deg)', transformOrigin:'left', pointerEvents:'none' }} />
            <div style={{ position:'absolute', right:0, top:'68%', width:'42%', height:1, background:'rgba(60,9,30,0.04)', transform:'rotate(14deg)', transformOrigin:'right', pointerEvents:'none' }} />
            <div style={{ position:'absolute', left:'3%', bottom:'5%', fontFamily:'monospace', fontSize:8, color:'rgba(60,9,30,0.13)', letterSpacing:1.5, lineHeight:1.8, pointerEvents:'none' }}>// CAREER DATA<br/><span style={{ fontSize:7 }}>IS · 01 · 02 · 03</span></div>

            <div style={{ maxWidth:560, margin:'0 auto', position:'relative', zIndex:2 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px 5px 10px', border:'1px solid rgba(60,9,30,0.14)' }}>
                  <span style={{ fontSize:9, color:'#BE473D' }}>03</span>
                  <span style={{ fontSize:9, letterSpacing:2.5, color:'rgba(60,9,30,0.42)' }}>ASK KUYA AI</span>
                </div>
                <div style={{ display:'flex', gap:3 }}>
                  <div style={{ width:2, height:16, background:'rgba(60,9,30,0.18)' }} />
                  <div style={{ width:2, height:16, background:'rgba(60,9,30,0.18)' }} />
                </div>
              </div>

              <div style={{ borderTop:'1px solid rgba(60,9,30,0.08)', marginBottom:16 }}>
                {QUICK.map(function(q){
                  return (
                      <button key={q} className="qrow" onClick={function(){ navigate('/dashboard/chat', { state:{ initialMessage:q } }) }}
                              style={{ width:'100%', padding:'14px 16px', border:'none', borderBottom:'1px solid rgba(60,9,30,0.07)', background:'transparent', cursor:'pointer', fontFamily:MONO, fontSize:10, color:'rgba(60,9,30,0.5)', letterSpacing:.5, textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        {q}
                        <span className="qarr" style={{ fontFamily:MONO, fontSize:16, color:'#BE473D', opacity:0, transition:'opacity .18s', flexShrink:0 }}>›</span>
                      </button>
                  )
                })}
              </div>

              <Link to="/dashboard/chat" className="kuya-link" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:16, padding:'16px 18px', border:'1px solid rgba(60,9,30,0.1)', background:'rgba(60,9,30,0.035)' }}>
                <div style={{ width:40, height:40, background:'#BE473D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🤙</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:MONO, fontSize:11, color:'#3C091E', letterSpacing:1.5, marginBottom:2 }}>KUYA AI IS READY</div>
                  <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(60,9,30,0.38)', lineHeight:1.6 }}>
                    <span style={{ color:'#1E8449' }}>●</span> ONLINE · UY {name}! ANONG TANONG MO?
                  </div>
                </div>
                <div style={{ fontFamily:MONO, fontSize:20, color:'rgba(60,9,30,0.18)', flexShrink:0 }}>›</div>
              </Link>
            </div>
          </section>
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:'rgba(42,5,21,0.97)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(240,237,232,0.055)', display:'flex' }}>
          {[{icon:'⌂',label:'HOME',to:'/dashboard'},{icon:'◈',label:'ROADMAP',to:'/dashboard/roadmap'},{icon:'⊕',label:'KUYA AI',to:'/dashboard/chat'},{icon:'◧',label:'TRACKER',to:'/dashboard/tracker'},{icon:'◌',label:'PROFILE',to:'/dashboard/profile'}].map(function(item){
            var active = typeof window !== 'undefined' && window.location.pathname === item.to
            return (
                <Link key={item.to} to={item.to} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'10px 0 8px', textDecoration:'none', color:active?'#BE473D':'rgba(240,237,232,0.28)', borderTop:active?'1px solid #BE473D':'1px solid transparent', marginTop:-1, transition:'color .15s' }}>
                  <span style={{ fontSize:14 }}>{item.icon}</span>
                  <span style={{ fontFamily:MONO, fontSize:8, letterSpacing:1.5 }}>{item.label}</span>
                </Link>
            )
          })}
        </div>
      </div>
  )
}