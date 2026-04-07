import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const MONO = 'Share Tech Mono, monospace'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { background:#3C091E; font-family:'Share Tech Mono',monospace; overflow-x:hidden; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#BE473D; }
  ::selection { background:rgba(190,71,61,0.4); }
  @keyframes floatA { 0%,100%{transform:translateY(0)rotate(0deg)} 50%{transform:translateY(-12px)rotate(3deg)} }
  @keyframes floatB { 0%,100%{transform:translateY(0)rotate(0deg)} 50%{transform:translateY(-7px)rotate(-2deg)} }
`

const NAV = [
  { icon:'⌂', label:'HOME',    to:'/dashboard' },
  { icon:'◈', label:'ROADMAP', to:'/dashboard/roadmap' },
  { icon:'⊕', label:'KUYA AI', to:'/dashboard/chat' },
  { icon:'◧', label:'TRACKER', to:'/dashboard/tracker' },
  { icon:'◌', label:'PROFILE', to:'/dashboard/profile' },
]

export default function PageLayout({ title, subtitle, children, backTo = '/dashboard' }) {
  const location = useLocation()
  const { user } = useAuthStore()
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'G'

  return (
    <div style={{ minHeight:'100vh', background:'#3C091E', fontFamily:MONO, color:'#F0EDE8', paddingBottom:80 }}>
      <style>{CSS}</style>

      {/* Fixed decorative background — grid + glows + cubes always visible */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:'linear-gradient(rgba(240,237,232,0.032) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.032) 1px,transparent 1px)',
        backgroundSize:'52px 52px' }} />
      <div style={{ position:'fixed', top:'-5%', right:'-5%', width:'55vw', height:'55vw', maxWidth:420, maxHeight:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'5%', left:'-5%', width:'40vw', height:'40vw', maxWidth:300, maxHeight:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(200,138,75,0.05) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      {/* Floating cubes */}
      <div style={{ position:'fixed', right:'5%', top:'30%', width:44, height:44, background:'rgba(240,237,232,0.025)', border:'1px solid rgba(240,237,232,0.04)', borderRadius:6, transform:'rotate(18deg)', animation:'floatA 9s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', left:'3%', bottom:'25%', width:28, height:28, background:'rgba(240,237,232,0.02)', border:'1px solid rgba(240,237,232,0.035)', borderRadius:5, transform:'rotate(-14deg)', animation:'floatB 11s ease-in-out infinite 1s', pointerEvents:'none', zIndex:0 }} />
      {/* Diagonal lines */}
      <div style={{ position:'fixed', left:'18%', top:0, width:1, height:'100vh', background:'rgba(240,237,232,0.03)', transform:'rotate(7deg)', transformOrigin:'top center', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', right:'22%', top:0, width:1, height:'100vh', background:'rgba(240,237,232,0.025)', transform:'rotate(-5deg)', transformOrigin:'top center', pointerEvents:'none', zIndex:0 }} />
      {/* Binary strip */}
      <div style={{ position:'fixed', right:14, top:'38%', fontFamily:'monospace', fontSize:8, color:'rgba(240,237,232,0.05)', letterSpacing:1, writingMode:'vertical-rl', pointerEvents:'none', zIndex:0 }}>10100110_01001101</div>
      {/* Plus markers */}
      {[[8,28],[92,18],[6,68],[94,62]].map(function(p,i){ return <div key={i} style={{ position:'fixed', left:p[0]+'%', top:p[1]+'%', color:'rgba(240,237,232,0.07)', fontSize:13, pointerEvents:'none', zIndex:0 }}>+</div> })}

      {/* TOP HEADER */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(42,5,21,0.95)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(240,237,232,0.055)', padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link to={backTo} style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, border:'1px solid rgba(240,237,232,0.1)', color:'rgba(240,237,232,0.45)', fontFamily:MONO, fontSize:13, transition:'all .18s', flexShrink:0 }}
            onMouseEnter={function(e){ e.currentTarget.style.borderColor='rgba(190,71,61,0.5)'; e.currentTarget.style.color='#BE473D' }}
            onMouseLeave={function(e){ e.currentTarget.style.borderColor='rgba(240,237,232,0.1)'; e.currentTarget.style.color='rgba(240,237,232,0.45)' }}>
            &lt;
          </Link>
          <div>
            <div style={{ fontFamily:MONO, fontSize:12, color:'#F0EDE8', letterSpacing:2 }}>{title}</div>
            {subtitle && <div style={{ fontFamily:MONO, fontSize:8, color:'rgba(240,237,232,0.3)', letterSpacing:1, marginTop:1 }}>{subtitle}</div>}
          </div>
        </div>
        <Link to="/dashboard/profile" style={{ textDecoration:'none', width:28, height:28, background:'#BE473D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:MONO, fontSize:12, color:'#F0EDE8', flexShrink:0 }}>
          {initial}
        </Link>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 20px 32px', position:'relative', zIndex:1 }}>
        {children}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'rgba(42,5,21,0.97)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(240,237,232,0.055)', display:'flex' }}>
        {NAV.map(function(item){
          var active = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
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