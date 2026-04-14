import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

// ─── Fonts + global styles ─────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; overflow-x:hidden; width:100%; }
  body { background:#3C091E; overflow-x:hidden; width:100%; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:#BE473D; }
  ::selection { background:rgba(190,71,61,0.35); }

  /* Loading */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes loadBar { from{width:0} to{width:100%} }

  /* Marquee */
  @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* Float */
  @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(4deg)} }
  @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
  @keyframes floatC { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-22px) rotate(6deg)} }

  /* 3D block parallax */
  @keyframes spin3d { 0%{transform:perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(0deg)} 100%{transform:perspective(800px) rotateX(15deg) rotateY(340deg) rotateZ(0deg)} }

  /* Reveal on scroll */
  .rev { opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
  .rev.in { opacity:1; transform:translateY(0); }
  .rev.d1 { transition-delay:.1s; }
  .rev.d2 { transition-delay:.2s; }
  .rev.d3 { transition-delay:.3s; }

  /* Hero text animate in */
  @keyframes heroUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
  .h1 { animation:heroUp .9s cubic-bezier(.16,1,.3,1) .3s forwards; opacity:0; }
  .h2 { animation:heroUp .9s cubic-bezier(.16,1,.3,1) .55s forwards; opacity:0; }
  .h3 { animation:heroUp .9s cubic-bezier(.16,1,.3,1) .75s forwards; opacity:0; }
  .h4 { animation:heroUp .9s cubic-bezier(.16,1,.3,1) 1s forwards; opacity:0; }
  .h5 { animation:heroUp .9s cubic-bezier(.16,1,.3,1) 1.2s forwards; opacity:0; }

  /* ── MOBILE RESPONSIVE ── */
  .nav-links { display:flex; align-items:center; gap:32px; }
  .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(60,9,30,0.08); }
  .hero-split { display:grid; grid-template-columns:55% 45%; min-height:100vh; }
  .hero-left  { padding:100px 56px 80px 40px; }
  .hero-right { padding:120px 40px 80px 64px; }
  .split-2col { display:grid; grid-template-columns:55% 45%; }
  .kuya-split { display:grid; grid-template-columns:55% 45%; }
  .cta-split  { display:grid; grid-template-columns:1fr auto; align-items:center; gap:80px; }
  .cta-buttons { display:flex; flex-direction:column; gap:12px; }
  .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:56px; }
  .footer-bottom { display:flex; justify-content:space-between; }
  .stats-right { padding:120px 40px 80px 64px; }

  @media (max-width: 768px) {
    /* Nav */
    .nav-links { display:none; }
    nav { padding:0 20px !important; }

    /* Hero */
    .hero-split { display:flex !important; flex-direction:column; min-height:auto; }
    .hero-split { width:100% !important; max-width:100vw !important; margin:0 !important; }
    .hero-left  { padding:80px 24px 48px !important; width:100% !important; min-width:0 !important; box-sizing:border-box !important; flex:1 1 auto !important; }
    .hero-right { padding:40px 24px 56px !important; width:100% !important; min-width:0 !important; }
    .stats-right { padding:40px 24px 56px !important; width:100% !important; min-width:0 !important; }

    /* 2-col splits */
    .split-2col { display:flex !important; flex-direction:column; }
    .kuya-split { display:flex !important; flex-direction:column; }

    /* Feature grid */
    .feat-grid { grid-template-columns:1fr !important; }

    /* CTA */
    .cta-split { display:flex !important; flex-direction:column; gap:32px; align-items:center; text-align:center; }
    .cta-split .rev { text-align:center; width:100%; }
    .cta-split > div { text-align:center !important; }
    .cta-split > div span { text-align:center !important; display:block !important; }
    .cta-buttons { width:100%; }
    .cta-buttons button { width:100% !important; }

    /* Footer */
    .footer-grid { grid-template-columns:1fr 1fr !important; gap:32px !important; }
    .footer-bottom { flex-direction:column; gap:8px; }

    /* Floating decorations — hide on mobile */
    .cube-deco { display:none; }
    .diag-deco { display:none; }

    /* Section padding */
    section { padding-left:24px !important; padding-right:24px !important; }
  }
`

// ─── Section tag pill: [NUM] LABEL || ──────────────────────────────────────
function Tag({ num, label, dark = true }) {
  const fg = dark ? '#F0EDE8' : '#3C091E'
  const border = dark ? 'rgba(240,237,232,0.2)' : 'rgba(60,9,30,0.2)'
  return (
      <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px 5px 10px', border:'1px solid '+border }}>
          {num && <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, color:'#BE473D', marginRight:2 }}>{num}</span>}
          <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:12, letterSpacing:2, color:fg }}>{label}</span>
        </div>
        <div style={{ display:'flex', gap:3 }}>
          <div style={{ width:2, height:18, background:dark?'rgba(240,237,232,0.35)':'rgba(60,9,30,0.35)' }} />
          <div style={{ width:2, height:18, background:dark?'rgba(240,237,232,0.35)':'rgba(60,9,30,0.35)' }} />
        </div>
      </div>
  )
}

// ─── Giant monospace heading with underline on 2nd line ───────────────────
function Heading({ lines, dark=true, size='clamp(44px,7vw,88px)', center=false }) {
  const color = dark ? '#F0EDE8' : '#3C091E'
  return (
      <div style={{ textAlign:center?'center':'left' }}>
        {lines.map((line, i) => (
            <div key={i} style={{ position:'relative', display:'block' }}>
              {i===1 && <div style={{ position:'absolute', bottom:2, left:center?'50%':0, transform:center?'translateX(-50%)':'none', width:72, height:2, background:'#BE473D' }} />}
              <span style={{ fontFamily:'Share Tech Mono,monospace', fontWeight:900, fontSize:size, color:color, letterSpacing:'-1px', lineHeight:.92, display:'block', whiteSpace:'nowrap' }}>
            {line}
          </span>
            </div>
        ))}
      </div>
  )
}

// ─── Floating cube element (light sections) ───────────────────────────────
function Cube({ x, y, size=44, rot=0, anim='floatA', delay=0, label=null, className='' }) {
  return (
      <div className={className} style={{ position:'absolute', left:x+'%', top:y+'%', pointerEvents:'none', animation:anim+' '+(6+delay)+'s ease-in-out infinite', animationDelay:delay+'s' }}>
        <div style={{ width:size, height:size, background:'rgba(60,9,30,0.07)', borderRadius:8, transform:'rotate('+rot+'deg)', position:'relative' }}>
          {label && (
              <div style={{ position:'absolute', top:'115%', left:0, fontFamily:'monospace', fontSize:9, color:'rgba(60,9,30,0.22)', letterSpacing:1, whiteSpace:'nowrap', lineHeight:1.6 }}>
                <div>{label}</div>
                <div style={{ fontSize:8, color:'rgba(60,9,30,0.14)' }}>IS · 01 · 02 · 03</div>
              </div>
          )}
        </div>
      </div>
  )
}

// ─── Diagonal line decoration ─────────────────────────────────────────────
function DiagLine({ x, y, angle, length=200, dark=false }) {
  const color = dark ? 'rgba(240,237,232,0.06)' : 'rgba(60,9,30,0.06)'
  return (
      <div style={{ position:'absolute', left:x+'%', top:y+'%', width:length, height:1, background:color, transform:'rotate('+angle+'deg)', transformOrigin:'left center', pointerEvents:'none' }} />
  )
}

// ─── Loading screen ───────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

  const msgs = [
    ['A VISIBILITY', 'PLATFORM FOR FILIPINOS'],
    ['CAREER BEGINNINGS', 'NAVIGATED HERE'],
    ['KUYA AI', 'LOADING KNOWLEDGE'],
    ['GRADREADY PH', 'INITIALIZING'],
  ]

  useEffect(() => {
    let p = 0
    let msgIdx = 0
    let scrambleFrame = 0

    const interval = setInterval(() => {
      p += Math.random() * 6 + 3
      if (p > 100) p = 100
      setPct(Math.floor(p))

      msgIdx = Math.floor((p / 100) * (msgs.length - 1))
      const target1 = msgs[Math.min(msgIdx, msgs.length-1)][0]
      const target2 = msgs[Math.min(msgIdx, msgs.length-1)][1]
      scrambleFrame++

      const scramble = (target, frame) => target.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        if (i < frame * 0.3) return ch
        return chars[Math.floor(Math.random() * chars.length)]
      }).join('')

      setLine1(scramble(target1, scrambleFrame))
      setLine2(scramble(target2, scrambleFrame))

      if (p >= 100) {
        clearInterval(interval)
        setLine1(msgs[msgs.length-1][0])
        setLine2(msgs[msgs.length-1][1])
        setTimeout(onDone, 600)
      }
    }, 55)

    return () => clearInterval(interval)
  }, [])

  return (
      <div style={{ position:'fixed', inset:0, background:'#3C091E', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Share Tech Mono,monospace' }}>
        {/* Corner brackets */}
        {[{t:20,l:20,tr:'none',bt:'top',bl:'left'},{t:20,r:20,tr:'none',bt:'top',bl:'right'},{b:20,l:20,tr:'none',bt:'bottom',bl:'left'},{b:20,r:20,tr:'none',bt:'bottom',bl:'right'}].map((pos,i) => (
            <div key={i} style={{ position:'absolute', top:pos.t, bottom:pos.b, left:pos.l, right:pos.r, width:24, height:24, borderTop:pos.bt==='top'?'1px solid rgba(240,237,232,0.25)':'none', borderBottom:pos.bt==='bottom'?'1px solid rgba(240,237,232,0.25)':'none', borderLeft:pos.bl==='left'?'1px solid rgba(240,237,232,0.25)':'none', borderRight:pos.bl==='right'?'1px solid rgba(240,237,232,0.25)':'none' }} />
        ))}

        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ fontSize:'clamp(22px,4vw,36px)', color:'#F0EDE8', letterSpacing:4, marginBottom:8 }}>{line1}</div>
          <div style={{ fontSize:'clamp(14px,2.5vw,22px)', color:'rgba(240,237,232,0.4)', letterSpacing:3 }}>{line2}</div>
        </div>

        <div style={{ position:'absolute', bottom:48, left:'50%', transform:'translateX(-50%)', textAlign:'center', width:240 }}>
          <div style={{ fontSize:12, color:'rgba(240,237,232,0.3)', letterSpacing:3, marginBottom:12 }}>
            Loading.{pct.toString().padStart(2,'0')}
            <span style={{ animation:'blink 1s infinite', display:'inline-block', marginLeft:2 }}>_</span>
          </div>
          <div style={{ width:'100%', height:1, background:'rgba(240,237,232,0.1)' }}>
            <div style={{ height:'100%', background:'#BE473D', width:pct+'%', transition:'width .1s ease' }} />
          </div>
        </div>
      </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { token, isOnboarded } = useAuthStore()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mouseX, setMouseX] = useState(0.5)
  const [mouseY, setMouseY] = useState(0.5)
  const revRefs = useRef([])

  useEffect(() => {
    if (!loaded) return
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [loaded])

  useEffect(() => {
    const fn = e => { setMouseX(e.clientX/window.innerWidth); setMouseY(e.clientY/window.innerHeight) }
    window.addEventListener('mousemove', fn, { passive:true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') })
    }, { threshold:0.12 })
    document.querySelectorAll('.rev').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [loaded])

  function go() { token ? navigate(isOnboarded?'/dashboard':'/onboarding') : navigate('/register') }
  function signIn() { token ? navigate(isOnboarded?'/dashboard':'/onboarding') : navigate('/login') }

  if (!loaded) return <><style>{GLOBAL_CSS}</style><Loader onDone={() => setLoaded(true)} /></>

  const navScrolled = scrollY > 60

  return (
      <div style={{ fontFamily:'Share Tech Mono,monospace', background:'#3C091E', color:'#3C091E', overflowX:'hidden', width:'100%', maxWidth:'100vw' }}>
        <style>{GLOBAL_CSS}</style>

        {/* ── NAV ── */}
        <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:62, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', transition:'all .4s', background:'rgba(60,9,30,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(240,237,232,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
              {[0,1,2,3].map(i=><div key={i} style={{ width:7, height:7, background:i<2?'#BE473D':'#C8A84B', borderRadius:1 }} />)}
            </div>
            <span style={{ fontSize:15, color:'#F0EDE8', letterSpacing:3 }}>GRADREADY</span>
          </div>
          <div className="nav-links">
            {[['FEATURES','feat'],['HOW IT WORKS','how'],['KUYA AI','kuya']].map(([l,id])=>(
                <button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})} style={{ background:'none', border:'none', color:'rgba(240,237,232,0.65)', fontSize:11, letterSpacing:2.5, cursor:'pointer', transition:'color .2s', fontFamily:'Share Tech Mono,monospace' }} onMouseEnter={e=>e.currentTarget.style.color='#F0EDE8'} onMouseLeave={e=>e.currentTarget.style.color='rgba(240,237,232,0.65)'}>{l}</button>
            ))}
            <div style={{ width:1, height:14, background:'rgba(240,237,232,0.18)' }} />
            <button onClick={signIn} style={{ background:'none', border:'none', color:'rgba(240,237,232,0.65)', fontSize:11, letterSpacing:2.5, cursor:'pointer', fontFamily:'Share Tech Mono,monospace' }}>SIGN IN</button>
          </div>
          <button onClick={go} style={{ background:'#3C091E', color:'#F0EDE8', border:'none', padding:'9px 22px', fontSize:11, letterSpacing:2, cursor:'pointer', fontFamily:'Share Tech Mono,monospace', transition:'background .25s' }} onMouseEnter={e=>e.currentTarget.style.background='#BE473D'} onMouseLeave={e=>e.currentTarget.style.background='#3C091E'}>GET STARTED</button>
        </nav>

        {/* ══════════════════════════════════════════════════════════════════
          HERO — dark maroon left, warm white right, split layout
          The 3D object bleeds from center across the split
      ══════════════════════════════════════════════════════════════════ */}
        <section className="hero-split" style={{ position:'relative', overflow:'hidden', width:'100%', maxWidth:'100vw' }}>

          {/* Left — deep maroon */}
          <div className="hero-left" style={{ background:'#3C091E', display:'flex', flexDirection:'column', justifyContent:'flex-end', position:'relative', overflow:'hidden' }}>
            {/* Grid pattern */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.04) 1px,transparent 1px)', backgroundSize:'55px 55px', pointerEvents:'none' }} />
            {/* Radial glow from center */}
            <div style={{ position:'absolute', top:'40%', right:'-15%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.18) 0%,transparent 70%)', pointerEvents:'none', transform:`translate(${(mouseX-0.5)*20}px,${(mouseY-0.5)*20}px)`, transition:'transform .1s ease' }} />

            {/* Binary decorations */}
            {[['8%','18%','10100110_'],['62%','28%','01010011_'],['15%','55%','01010101'],['48%','72%','00010000_']].map(([x,y,v],i)=>(
                <div key={i} style={{ position:'absolute', left:x, top:y, fontFamily:'monospace', fontSize:10, color:'rgba(240,237,232,0.1)', letterSpacing:2, pointerEvents:'none', userSelect:'none' }}>{v}</div>
            ))}

            {/* Diagonal lines */}
            <DiagLine x={5} y={30} angle={-25} length={180} dark />
            <DiagLine x={40} y={15} angle={15} length={120} dark />

            {/* Plus markers */}
            {[[30,45],[70,20],[55,65]].map(([x,y],i)=>(
                <div key={i} style={{ position:'absolute', left:x+'%', top:y+'%', color:'rgba(240,237,232,0.12)', fontSize:14, pointerEvents:'none' }}>+</div>
            ))}

            {/* 3D object — CSS blocks */}
            <div className="h1" style={{ position:'absolute', top:'8%', right:'-12%', perspective:600, zIndex:2 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, transform:'rotateX(20deg) rotateY(-25deg)', transformStyle:'preserve-3d', animation:'floatA 8s ease-in-out infinite' }}>
                {Array(9).fill(0).map((_,i)=>(
                    <div key={i} style={{ width:56, height:34, background:`linear-gradient(135deg, #8B1A2A ${i%3*10}%, #3C091E)`, borderRadius:7, boxShadow:'0 4px 12px rgba(0,0,0,0.4)', opacity:0.65+((i%3)*0.12), transform:`translateZ(${i*5}px)` }} />
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="h2" style={{ marginBottom:24 }}>
              <Tag label="CAREER COMPANION FOR FILIPINOS" />
            </div>
            <div className="h3" style={{ marginBottom:40 }}>
              <Heading lines={['NAVIGATE', 'CAREER LIFE', 'IN THE PH.']} size="clamp(38px,5.5vw,76px)" />
            </div>
            <div className="h4" style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button onClick={go} style={{ background:'transparent', color:'#F0EDE8', border:'1px solid rgba(240,237,232,0.35)', padding:'14px 32px', fontFamily:'Share Tech Mono,monospace', fontSize:12, letterSpacing:2, cursor:'pointer', transition:'all .25s' }} onMouseEnter={e=>{e.currentTarget.style.background='#BE473D';e.currentTarget.style.borderColor='#BE473D'}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(240,237,232,0.35)'}}>
                START FREE
              </button>
              <button onClick={()=>document.getElementById('feat')?.scrollIntoView({behavior:'smooth'})} style={{ background:'none', border:'none', color:'rgba(240,237,232,0.4)', fontSize:11, letterSpacing:2, cursor:'pointer', fontFamily:'Share Tech Mono,monospace', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='rgba(240,237,232,0.8)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(240,237,232,0.4)'}>
                EXPLORE ↓
              </button>
            </div>
          </div>

          {/* Right — warm off-white */}
          <div className="stats-right" style={{ background:'#F0EDE8', display:'flex', flexDirection:'column', justifyContent:'flex-end', position:'relative' }}>

            {/* Diagonal line decoration */}
            <DiagLine x={0} y={35} angle={-15} length={150} />
            <DiagLine x={50} y={65} angle={20} length={100} />

            {/* Stats */}
            <div className="h5">
              {[['7','GOV REGISTRATIONS COVERED'],['GPT-4o','POWERED KUYA AI IN TAGLISH'],['50+','REAL PH SALARY DATA POINTS']].map(([v,l],i)=>(
                  <div key={i} style={{ display:'flex', gap:20, alignItems:'flex-start', padding:'18px 0', borderBottom:i<2?'1px solid rgba(60,9,30,0.07)':'none' }}>
                    <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:26, fontWeight:700, color:'#BE473D', lineHeight:1, minWidth:72, flexShrink:0 }}>{v}</span>
                    <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(60,9,30,0.4)', lineHeight:1.7, paddingTop:5, letterSpacing:1 }}>{l}</span>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{ background:'#BE473D', borderTop:'1px solid rgba(60,9,30,0.2)', borderBottom:'1px solid rgba(60,9,30,0.2)', padding:'13px 0', overflow:'hidden' }}>
          <div style={{ display:'flex', animation:'mq 28s linear infinite', whiteSpace:'nowrap' }}>
            {Array(4).fill(['TIN REGISTRATION','·','SSS','·','PHILHEALTH','·','PAG-IBIG','·','NBI CLEARANCE','·','PHILSYS ID','·','PRC BOARD EXAM','·','KUYA AI','·','JOB MATCHING','·','COVER LETTER','·','SALARY GUIDE','·']).flat().map((item,i)=>(
                <span key={i} style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, letterSpacing:2.5, color:item==='·'?'rgba(240,237,232,0.4)':'#F0EDE8', marginRight:item==='·'?18:26 }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
          WHAT IS GRADREADY — dark with 3D object, info panel right
      ══════════════════════════════════════════════════════════════════ */}
        <section className="split-2col" style={{ minHeight:'90vh', background:'#3C091E', position:'relative', overflow:'hidden' }}>
          {/* Grid + diagonals on left */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.03) 1px,transparent 1px)', backgroundSize:'55px 55px', pointerEvents:'none' }} />
          <DiagLine x={0} y={20} angle={-18} length={400} dark />
          <DiagLine x={20} y={60} angle={12} length={300} dark />

          {/* Plus markers scattered */}
          {[[15,30],[45,55],[70,25],[80,70]].map(([x,y],i)=>(
              <div key={i} style={{ position:'absolute', left:x+'%', top:y+'%', color:'rgba(240,237,232,0.08)', fontSize:16, pointerEvents:'none' }}>+</div>
          ))}

          {/* Large 3D object center — a rod/cylinder like the telescope */}
          <div style={{ position:'absolute', top:0, left:'25%', right:'25%', bottom:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:2 }}>
            <div style={{ width:90, height:'70vh', background:'linear-gradient(180deg,#8B1A2A 0%,#3C091E 40%,#8B1A2A 70%,#3C091E 100%)', borderRadius:12, boxShadow:'inset -8px 0 20px rgba(0,0,0,0.5), inset 4px 0 12px rgba(190,71,61,0.3), 0 0 60px rgba(60,9,30,0.8)', animation:'floatB 6s ease-in-out infinite', transform:'rotate(-5deg)' }}>
              {/* Diamond pip at top */}
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', width:14, height:14, background:'#F0EDE8', rotate:'45deg' }} />
            </div>
          </div>

          {/* Bottom-left text — pinned*/}
          <div style={{ padding:'80px 40px 60px', display:'flex', flexDirection:'column', justifyContent:'flex-end', zIndex:3 }}>
            <div className="rev">
              <Tag label="UNDERSTANDING" />
            </div>
            <div className="rev d1">
              <Heading lines={['WHAT IS', 'GRADREADY?']} size="clamp(36px,5vw,72px)" />
            </div>
          </div>

          {/* Right panel — info cards */}
          <div style={{ padding:'80px 40px 60px', display:'flex', flexDirection:'column', justifyContent:'center', gap:24, zIndex:3 }}>
            {[
              ['PERSONALIZED ROADMAP','AI generates a week-by-week checklist based on your course, region, and employment status. No generic advice.'],
              ['KUYA AI ASSISTANT','Your post-grad big brother. Answers in Taglish. Knows PH gov processes, salary norms, and job red flags.'],
              ['GOV REGISTRATION GUIDE','Step-by-step for TIN, SSS, PhilHealth, Pag-IBIG, NBI, PRC, and PhilSys — with exact fees and forms.'],
            ].map(([title, desc], i) => (
                <div key={i} className={'rev d'+(i+1)} style={{ padding:'20px 24px', border:'1px solid rgba(240,237,232,0.08)', background:'rgba(240,237,232,0.04)', transition:'border-color .3s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(190,71,61,0.4)'} onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(240,237,232,0.08)'}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:8, height:8, background:'#BE473D' }} />
                    <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, color:'#F0EDE8', letterSpacing:2 }}>{title}</span>
                  </div>
                  <p style={{ fontFamily:'monospace', fontSize:12, color:'rgba(240,237,232,0.4)', lineHeight:1.8, letterSpacing:.3 }}>{desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
          FEATURES — light section, floating cubes, centered text
          Mimics the "HOW IT WORKS" light section with floating objects
      ══════════════════════════════════════════════════════════════════ */}
        <section id="feat" style={{ background:'#F0EDE8', minHeight:'90vh', position:'relative', padding:'100px 40px', overflow:'hidden' }}>
          {/* Floating cubes all over */}
          <Cube className="cube-deco" x={5} y={8} size={58} rot={15} anim="floatA" delay={0} label="// TIN REGISTRATION" />
          <Cube className="cube-deco" x={82} y={5} size={42} rot={-8} anim="floatB" delay={1} />
          <Cube className="cube-deco" x={12} y={45} size={36} rot={22} anim="floatC" delay={2} />
          <Cube className="cube-deco" x={88} y={38} size={64} rot={-12} anim="floatA" delay={0.5} label="// AI JOB MATCH" />
          <Cube className="cube-deco" x={6} y={72} size={48} rot={10} anim="floatB" delay={1.5} />
          <Cube className="cube-deco" x={78} y={68} size={40} rot={-18} anim="floatC" delay={0.8} label="// KUYA AI" />
          <Cube className="cube-deco" x={45} y={5} size={32} rot={30} anim="floatA" delay={2.2} />
          <Cube className="cube-deco" x={55} y={80} size={52} rot={-5} anim="floatB" delay={1.2} />

          {/* Diagonal lines sweeping through */}
          <DiagLine x={0} y={35} angle={-20} length={300} />
          <DiagLine x={55} y={15} angle={15} length={250} />
          <DiagLine x={10} y={75} angle={-10} length={200} />
          <DiagLine x={70} y={60} angle={25} length={180} />

          {/* Data labels floating */}
          {([ ['3%','15%','// CAREER DATA'], ['72%','22%','// VECTOR SEARCH'], ['8%','82%','// LLM PIPELINE'], ['85%','75%','// GRAD ANALYTICS'] ]).map(([x,y,l],i)=>(
              <div key={i} style={{ position:'absolute', left:x, top:y, fontFamily:'monospace', fontSize:9, color:'rgba(60,9,30,0.2)', letterSpacing:1.5, lineHeight:1.6, pointerEvents:'none' }}>
                {l}<br/><span style={{ fontSize:8 }}>IS · 01 · 02 · 03</span>
              </div>
          ))}

          {/* Center content */}
          <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center', position:'relative', zIndex:2 }}>
            <div className="rev" style={{ display:'flex', justifyContent:'center' }}>
              <Tag num="02" label="FEATURES" dark={false} />
            </div>
            <div className="rev d1" style={{ marginBottom:64 }}>
              <Heading lines={['EVERYTHING YOU', 'NEED TO START.']} dark={false} size="clamp(36px,5vw,68px)" center />
            </div>
          </div>

          {/* Feature grid — cards in the light section */}
          <div className="feat-grid" style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:2 }}>
            {[
              {n:'01',tag:'ROADMAP',title:'PERSONALIZED\nPATH',desc:'Week-by-week checklist tailored to your exact course, region, and status. Not generic.'},
              {n:'02',tag:'GOV REGS',title:'OFFICIAL\nSTEPS',desc:'TIN, SSS, PhilHealth, Pag-IBIG, NBI — step-by-step with exact fees and required forms.'},
              {n:'03',tag:'KUYA AI',title:'YOUR\nBIG BROTHER',desc:'GPT-4o powered. Speaks Taglish. Knows PH gov processes, salary norms, red flags.'},
              {n:'04',tag:'JOB SEARCH',title:'AI-MATCHED\nROLES',desc:'Course-matched listings from Kalibrr, JobStreet, LinkedIn. AI scores each for your fit.'},
              {n:'05',tag:'FINANCE',title:'SALARY &\nINVESTING',desc:'Payslip decoder, 50/30/20 budgeting, MP2 vs UITF vs stocks — PH context only.'},
              {n:'06',tag:'BOARD EXAM',title:'PRC\nTRACKER',desc:'Schedules for all licensed professions. AI generates a study plan from your exam date.'},
            ].map((f,i)=>(
                <div key={i} className={'rev d'+(i%3+1)} style={{ background:'#F0EDE8', padding:'32px 28px', borderTop:'2px solid transparent', transition:'all .3s', cursor:'default' }} onMouseEnter={e=>{e.currentTarget.style.borderTopColor='#BE473D';e.currentTarget.style.background='rgba(255,255,255,0.6)'}} onMouseLeave={e=>{e.currentTarget.style.borderTopColor='transparent';e.currentTarget.style.background='#F0EDE8'}}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:28 }}>
                    <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, color:'#BE473D' }}>{f.n}</span>
                    <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(60,9,30,0.3)', padding:'3px 10px', border:'1px solid rgba(60,9,30,0.12)', letterSpacing:1 }}>{f.tag}</span>
                  </div>
                  <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:18, color:'#3C091E', lineHeight:1.15, marginBottom:14, whiteSpace:'pre-line', letterSpacing:.5 }}>{f.title}</div>
                  <p style={{ fontFamily:'monospace', fontSize:12, color:'rgba(60,9,30,0.45)', lineHeight:1.8, letterSpacing:.3 }}>{f.desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS — light section, floating cubes, stepped content
          Each step is "centered" like the Solais steps
      ══════════════════════════════════════════════════════════════════ */}
        <section id="how" style={{ background:'#F0EDE8', position:'relative', padding:'100px 40px', overflow:'hidden' }}>
          {/* More floating cubes */}
          <Cube className="cube-deco" x={3} y={10} size={50} rot={12} anim="floatC" delay={0.3} />
          <Cube className="cube-deco" x={90} y={15} size={38} rot={-20} anim="floatA" delay={1.4} />
          <Cube className="cube-deco" x={7} y={60} size={44} rot={8} anim="floatB" delay={0.7} label="// STEP PROCESS" />
          <Cube className="cube-deco" x={87} y={55} size={56} rot={-14} anim="floatC" delay={2} />
          <Cube className="cube-deco" x={45} y={5} size={30} rot={25} anim="floatA" delay={1.8} />

          <DiagLine x={0} y={45} angle={-15} length={280} />
          <DiagLine x={60} y={20} angle={18} length={220} />
          <DiagLine x={20} y={80} angle={-8} length={350} />

          {[['3%','18%','// AI-FIRST TOOL'],['75%','30%','// VECTOR SEARCH'],['12%','75%','// GRAD ANALYTICS']].map(([x,y,l],i)=>(
              <div key={i} style={{ position:'absolute', left:x, top:y, fontFamily:'monospace', fontSize:9, color:'rgba(60,9,30,0.18)', letterSpacing:1.5, lineHeight:1.6, pointerEvents:'none' }}>{l}<br/><span style={{ fontSize:8 }}>IS · 01 · 02 · 03</span></div>
          ))}

          <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center', position:'relative', zIndex:2, marginBottom:80 }}>
            <div className="rev" style={{ display:'flex', justifyContent:'center' }}>
              <Tag num="03" label="PROCESS" dark={false} />
            </div>
            <div className="rev d1">
              <Heading lines={['UP AND RUNNING', 'IN FOUR STEPS.']} dark={false} size="clamp(36px,5vw,68px)" center />
            </div>
          </div>

          {/* Steps — each one centered, like Solais "STRATEGISING / SET YOUR PROMPTS" */}
          <div style={{ maxWidth:900, margin:'0 auto', display:'flex', flexDirection:'column', gap:1, background:'rgba(60,9,30,0.07)', position:'relative', zIndex:2 }}>
            {[
              {n:'01',tag:'REGISTERING',title:'CREATE ACCOUNT',desc:'Sign up in 30 seconds. Free forever. No credit card required.'},
              {n:'02',tag:'PROFILING',title:'SET YOUR PROFILE',desc:'Tell us your course, school, region, and current employment status.'},
              {n:'03',tag:'GENERATING',title:'GET YOUR ROADMAP',desc:'AI builds a personalized week-by-week checklist instantly for you.'},
              {n:'04',tag:'ACTING',title:'TAKE ACTION',desc:'Register, apply, track your applications, and ask Kuya AI — all in one place.'},
            ].map((s,i)=>(
                <div key={i} className={'rev d'+(i%2+1)} style={{ background:'#F0EDE8', padding:'48px 40px', textAlign:'center', borderLeft:'2px solid transparent', transition:'all .3s' }} onMouseEnter={e=>{e.currentTarget.style.borderLeftColor='#BE473D'}} onMouseLeave={e=>{e.currentTarget.style.borderLeftColor='transparent'}}>
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:12, marginBottom:20 }}>
                    <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, color:'#BE473D', padding:'4px 10px', border:'1px solid rgba(190,71,61,0.3)' }}>{s.n}</span>
                    <Tag num={null} label={s.tag} dark={false} />
                  </div>
                  <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'clamp(24px,4vw,44px)', color:'#3C091E', lineHeight:.95, letterSpacing:'-0.5px', marginBottom:20, fontWeight:900 }}>{s.title}</div>
                  <p style={{ fontFamily:'monospace', fontSize:13, color:'rgba(60,9,30,0.45)', lineHeight:1.8, maxWidth:480, margin:'0 auto', letterSpacing:.3 }}>{s.desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
          KUYA AI — dark section, same split layout as hero
      ══════════════════════════════════════════════════════════════════ */}
        <section id="kuya" className="kuya-split" style={{ minHeight:'90vh', background:'#3C091E', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.03) 1px,transparent 1px)', backgroundSize:'55px 55px', pointerEvents:'none' }} />
          <DiagLine x={0} y={25} angle={-15} length={350} dark />
          <DiagLine x={30} y={70} angle={10} length={280} dark />
          {[[20,35],[65,20],[75,60],[10,75]].map(([x,y],i)=>(
              <div key={i} style={{ position:'absolute', left:x+'%', top:y+'%', color:'rgba(240,237,232,0.07)', fontSize:16, pointerEvents:'none' }}>+</div>
          ))}
          {[['8%','12%','10100110_'],['55%','35%','01010011'],['20%','65%','00010000_']].map(([x,y,v],i)=>(
              <div key={i} style={{ position:'absolute', left:x, top:y, fontFamily:'monospace', fontSize:9, color:'rgba(240,237,232,0.08)', letterSpacing:2, pointerEvents:'none', userSelect:'none' }}>{v}</div>
          ))}

          {/* Left — heading pinned bottom */}
          <div style={{ padding:'80px 40px 64px', display:'flex', flexDirection:'column', justifyContent:'flex-end', zIndex:2 }}>
            <div className="rev"><Tag num="04" label="KUYA AI" /></div>
            <div className="rev d1" style={{ marginBottom:32 }}>
              <Heading lines={['YOUR BIG', 'BROTHER WHO', 'MADE IT.']} size="clamp(34px,4.5vw,66px)" />
            </div>
            <p className="rev d2" style={{ fontFamily:'monospace', fontSize:12, color:'rgba(240,237,232,0.4)', lineHeight:1.9, letterSpacing:.3, maxWidth:380, marginBottom:36 }}>
              Speaks Taglish. Knows PRC schedules, explains payslip deductions, writes cover letters. Powered by GPT-4o with a RAG pipeline trained on official PH government documents.
            </p>
            {['PAANO MAG-REGISTER SA PHILHEALTH?','CHECK JOB POSTING FOR RED FLAGS','WRITE ME A COVER LETTER','EXPLAIN MY SSS DEDUCTIONS'].map((q,i)=>(
                <div key={i} className="rev" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', border:'1px solid rgba(240,237,232,0.07)', fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.35)', letterSpacing:.5, marginBottom:6, cursor:'default', transition:'all .25s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(190,71,61,0.4)';e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.paddingLeft='18px'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(240,237,232,0.07)';e.currentTarget.style.color='rgba(240,237,232,0.35)';e.currentTarget.style.paddingLeft='14px'}}>
                  <span>"{q}"</span><span style={{ color:'#BE473D' }}>→</span>
                </div>
            ))}
          </div>

          {/* Right — chat mockup */}
          <div style={{ padding:'80px 40px 64px 56px', display:'flex', alignItems:'center', zIndex:2 }}>
            <div className="rev d2" style={{ width:'100%', border:'1px solid rgba(240,237,232,0.1)', background:'rgba(240,237,232,0.03)' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(240,237,232,0.08)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, background:'#C8A84B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤙</div>
                <div>
                  <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:13, color:'#F0EDE8', letterSpacing:1 }}>KUYA AI</div>
                  <div style={{ fontFamily:'monospace', fontSize:9, color:'#1E8449', letterSpacing:1.5 }}>● ONLINE</div>
                </div>
              </div>
              <div style={{ padding:'18px', display:'flex', flexDirection:'column', gap:12 }}>
                {[{f:'k',t:"Uy! Kamusta? I'm Kuya AI — your career big brother. Anong kailangan mo ngayon?"},{f:'u',t:'How do I register for SSS?'},{f:'k',t:"Madali lang! Go to my.sss.gov.ph, click 'Not yet registered'. Fill out your details with valid ID. SS Number arrives via email in 1-3 days. Libre yan!"}].map((m,i)=>(
                    <div key={i} style={{ display:'flex', justifyContent:m.f==='u'?'flex-end':'flex-start', gap:8 }}>
                      {m.f==='k'&&<div style={{ width:22,height:22,background:'#C8A84B',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0,marginTop:2 }}>🤙</div>}
                      <div style={{ maxWidth:'82%', padding:'10px 14px', background:m.f==='u'?'#BE473D':'rgba(240,237,232,0.06)', border:m.f==='k'?'1px solid rgba(240,237,232,0.08)':'none', fontFamily:'monospace', fontSize:11, color:'#F0EDE8', lineHeight:1.7 }}>{m.t}</div>
                    </div>
                ))}
              </div>
              <div style={{ padding:'12px 18px', borderTop:'1px solid rgba(240,237,232,0.08)', display:'flex', gap:8 }}>
                <div style={{ flex:1, padding:'10px 14px', border:'1px solid rgba(240,237,232,0.1)', fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.2)', background:'transparent' }}>Magtanong kay Kuya AI...</div>
                <div style={{ width:34,height:34,background:'#BE473D',display:'flex',alignItems:'center',justifyContent:'center',color:'#F0EDE8',fontSize:14 }}>↑</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
          CTA — dark section
      ══════════════════════════════════════════════════════════════════ */}
        <section style={{ background:'#3C091E', padding:'100px 40px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.03) 1px,transparent 1px)', backgroundSize:'55px 55px', pointerEvents:'none' }} />
          <DiagLine x={0} y={30} angle={-12} length={500} dark />
          <DiagLine x={40} y={70} angle={8} length={400} dark />
          {[['5%','15%','10110011'],['80%','25%','01001010_'],['12%','80%','00010001']].map(([x,y,v],i)=>(
              <div key={i} style={{ position:'absolute', left:x, top:y, fontFamily:'monospace', fontSize:9, color:'rgba(240,237,232,0.08)', letterSpacing:2, pointerEvents:'none' }}>{v}</div>
          ))}

          <div className="cta-split" style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:2 }}>
            <div style={{ width:'100%' }}>
              <div className="rev"><Tag num="05" label="GET STARTED" /></div>
              <div className="rev d1">
                <Heading lines={['YOUR FIRST', 'STEP STARTS', 'HERE.']} size="clamp(38px,5.5vw,76px)" />
              </div>
              <p className="rev d2" style={{ fontFamily:'monospace', fontSize:12, color:'rgba(240,237,232,0.4)', lineHeight:1.9, maxWidth:440, marginTop:28, letterSpacing:.3 }}>
                Open to all Filipinos navigating career beginnings — fresh grads, career shifters, and new professionals alike. Free forever.
              </p>
            </div>
            <div className="rev d2 cta-buttons">
              <button onClick={go} style={{ background:'#F0EDE8', color:'#3C091E', border:'none', padding:'18px 40px', fontFamily:'Share Tech Mono,monospace', fontSize:12, letterSpacing:2, cursor:'pointer', transition:'all .25s', display:'block', whiteSpace:'nowrap' }} onMouseEnter={e=>e.currentTarget.style.background='#C8A84B'} onMouseLeave={e=>e.currentTarget.style.background='#F0EDE8'}>
                CREATE FREE ACCOUNT
              </button>
              <button onClick={signIn} style={{ background:'transparent', color:'rgba(240,237,232,0.5)', border:'1px solid rgba(240,237,232,0.18)', padding:'17px 40px', fontFamily:'Share Tech Mono,monospace', fontSize:12, letterSpacing:2, cursor:'pointer', transition:'all .25s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(240,237,232,0.5)';e.currentTarget.style.color='#F0EDE8'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(240,237,232,0.18)';e.currentTarget.style.color='rgba(240,237,232,0.5)'}}>
                SIGN IN
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background:'#2A0515', padding:'56px 40px 32px', borderTop:'1px solid rgba(240,237,232,0.05)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div className="footer-grid" style={{ marginBottom:56 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
                    {[0,1,2,3].map(i=><div key={i} style={{ width:6,height:6,background:i<2?'#BE473D':'#C8A84B',borderRadius:1 }} />)}
                  </div>
                  <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:14, color:'#F0EDE8', letterSpacing:3 }}>GRADREADY</span>
                </div>
                <p style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.28)', lineHeight:1.9, maxWidth:220, letterSpacing:.3 }}>The career companion for Filipinos navigating professional beginnings. Made in the Philippines.</p>
              </div>
              {[{t:'FEATURES',l:['ROADMAP','GOV REGS','KUYA AI','JOB SEARCH','FINANCE','BOARD EXAMS']},{t:'RESOURCES',l:['BIR PORTAL','SSS ONLINE','PHILHEALTH','PAG-IBIG','NBI CLEARANCE','PRC WEBSITE']},{t:'COMPANY',l:['ABOUT','PRIVACY','TERMS','CONTACT']}].map((col,i)=>(
                  <div key={i}>
                    <div style={{ fontFamily:'monospace', fontSize:9, fontWeight:700, letterSpacing:2.5, color:'rgba(240,237,232,0.2)', marginBottom:18 }}>{col.t}</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                      {col.l.map((l,j)=><span key={j} style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.32)', cursor:'pointer', letterSpacing:.5, transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='#F0EDE8'} onMouseLeave={e=>e.currentTarget.style.color='rgba(240,237,232,0.32)'}>{l}</span>)}
                    </div>
                  </div>
              ))}
            </div>
            <div style={{ height:1, background:'rgba(240,237,232,0.06)', marginBottom:24 }} />
            <div className="footer-bottom">
              <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(240,237,232,0.18)', letterSpacing:.5 }}>© 2025 GRADREADY PH · MADE IN THE PHILIPPINES 🇵🇭</span>
              <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(240,237,232,0.18)', display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ color:'#1E8449' }}>●</span> ALL SYSTEMS OPERATIONAL
            </span>
            </div>
          </div>
        </footer>
      </div>
  )
}