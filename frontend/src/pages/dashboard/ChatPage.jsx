import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import useAuthStore from '../../store/authStore'

const MONO = 'Share Tech Mono, monospace'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { background:#3C091E; font-family:'Share Tech Mono',monospace; overflow:hidden; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#BE473D; }
  ::selection { background:rgba(190,71,61,0.35); }
  @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  .dot1{animation:bounce 1.2s ease-in-out infinite;}
  .dot2{animation:bounce 1.2s ease-in-out .2s infinite;}
  .dot3{animation:bounce 1.2s ease-in-out .4s infinite;}
  input{font-family:'Share Tech Mono',monospace !important;}
  input::placeholder{color:rgba(240,237,232,0.2);}
  input:focus{outline:none;}
  .quick-btn:hover{border-color:rgba(190,71,61,0.45) !important;color:#F0EDE8 !important;}
`

var QUICK_ASKS = [
  'PAANO MAG-REGISTER SA PHILHEALTH?',
  'WHAT DO I NEED FOR NBI CLEARANCE?',
  'HOW DO I NEGOTIATE MY FIRST SALARY?',
  'EXPLAIN MY PAYSLIP DEDUCTIONS',
  'HOW TO OPEN A SAVINGS ACCOUNT?',
  'WHAT IS PAG-IBIG MP2?',
]

function FormattedMessage(props) {
  var text = props.text
  var lines = text.split('\n')
  var elements = []
  var key = 0
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    if (line.trim() === '') { elements.push(<div key={key++} style={{ height:5 }} />); continue }
    var n = line.match(/^(\d+)[.)]\s+(.+)/)
    if (n) { elements.push(<div key={key++} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:3 }}><span style={{ fontFamily:MONO, fontSize:9, color:'#BE473D', flexShrink:0, marginTop:1 }}>{n[1]}.</span><span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.8)', lineHeight:1.65 }}>{n[2]}</span></div>); continue }
    var b = line.match(/^[-*•]\s+(.+)/)
    if (b) { elements.push(<div key={key++} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:3 }}><span style={{ fontFamily:MONO, fontSize:9, color:'#BE473D', flexShrink:0, marginTop:2 }}>›</span><span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.8)', lineHeight:1.65 }}>{b[1]}</span></div>); continue }
    var h = line.match(/^#{1,3}\s+(.+)/) || line.match(/^\*\*([^*]+)\*\*$/)
    if (h) { elements.push(<div key={key++} style={{ fontFamily:MONO, fontSize:10, color:'#F0EDE8', letterSpacing:1.5, marginTop:6, marginBottom:3 }}>{h[1].toUpperCase()}</div>); continue }
    elements.push(<p key={key++} style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.8)', lineHeight:1.7, marginBottom:2 }}>{line}</p>)
  }
  return <div>{elements}</div>
}

export default function ChatPage() {
  var location = useLocation()
  var authStore = useAuthStore()
  var user = authStore.user
  var chatHook = useChat()
  var sendMessage = chatHook.mutate
  var isPending = chatHook.isPending
  var firstName = user && user.fullName ? user.fullName.split(' ')[0].toUpperCase() : 'KA-GRAD'

  var messagesState = useState([
    { id:'init-1', from:'kuya', text:'UY! KAMUSTA ' + firstName + '? I AM KUYA AI — YOUR POST-GRAD BIG BROTHER. ANONG KAILANGAN MO NGAYON?' },
    { id:'init-2', from:'kuya', text:'I can help you with TIN, SSS, PhilHealth, Pag-IBIG, NBI clearance, job applications, salary negotiation — anything a fresh grad needs!' },
  ])
  var messages = messagesState[0]; var setMessages = messagesState[1]
  var inputState = useState(''); var input = inputState[0]; var setInput = inputState[1]
  var convState = useState(null); var conversationId = convState[0]; var setConversationId = convState[1]
  var pendingState = useState(null); var pendingInitialMessage = pendingState[0]; var setPendingInitialMessage = pendingState[1]
  var messagesEndRef = useRef(null)
  var isMounted = useRef(false)

  useEffect(function() {
    if (location.state && location.state.initialMessage) {
      window.history.replaceState({}, document.title)
      setPendingInitialMessage(location.state.initialMessage)
    }
  }, [])
  useEffect(function() { isMounted.current = true }, [])
  useEffect(function() {
    if (pendingInitialMessage && isMounted.current && !isPending) {
      setPendingInitialMessage(null); doSend(pendingInitialMessage)
    }
  }, [pendingInitialMessage])

  function doSend(message) {
    setMessages(function(prev) { return prev.concat([{ id:'user-'+Date.now(), from:'user', text:message }]) })
    sendMessage({ message, conversationId }, {
      onSuccess: function(data) {
        setConversationId(data.conversationId)
        setMessages(function(prev) { return prev.concat([{ id:'kuya-'+Date.now(), from:'kuya', text:data.message }]) })
      },
      onError: function() {
        setMessages(function(prev) { return prev.concat([{ id:'err-'+Date.now(), from:'kuya', text:'SORRY, MAY ERROR. SUBUKAN MO ULIT?' }]) })
      },
    })
  }

  function handleSend(text) {
    var msg = text && text.trim ? text.trim() : input.trim()
    if (!msg || isPending) return
    setInput(''); doSend(msg)
  }

  useEffect(function() {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  return (
    <div style={{ height:'100vh', background:'#3C091E', display:'flex', flexDirection:'column', fontFamily:MONO, overflow:'hidden', position:'relative' }}>
      <style>{CSS}</style>

      {/* Background grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.03) 1px,transparent 1px)', backgroundSize:'44px 44px', pointerEvents:'none' }} />
      {/* Radial glow */}
      <div style={{ position:'absolute', top:0, right:0, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
      {/* Floating cubes */}
      <div style={{ position:'absolute', right:'5%', top:'30%', width:40, height:40, background:'rgba(240,237,232,0.02)', border:'1px solid rgba(240,237,232,0.04)', borderRadius:5, transform:'rotate(18deg)', animation:'floatA 9s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', left:'3%', bottom:'25%', width:26, height:26, background:'rgba(240,237,232,0.02)', borderRadius:4, transform:'rotate(-12deg)', animation:'floatA 11s ease-in-out infinite 1s', pointerEvents:'none' }} />
      {/* Binary strip */}
      <div style={{ position:'absolute', right:14, top:'35%', fontFamily:'monospace', fontSize:8, color:'rgba(240,237,232,0.05)', letterSpacing:1, writingMode:'vertical-rl', pointerEvents:'none' }}>10100110_01001101</div>
      {/* Diagonal */}
      <div style={{ position:'absolute', left:'20%', top:0, width:1, height:'100%', background:'rgba(240,237,232,0.025)', transform:'rotate(6deg)', transformOrigin:'top center', pointerEvents:'none' }} />
      {/* Plus markers */}
      {[[7,22],[93,15],[5,75]].map(function(p,i) { return <div key={i} style={{ position:'absolute', left:p[0]+'%', top:p[1]+'%', color:'rgba(240,237,232,0.07)', fontSize:12, pointerEvents:'none' }}>+</div> })}

      {/* ── HEADER ── */}
      <div style={{ background:'rgba(42,5,21,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(240,237,232,0.06)', padding:'0 20px', height:56, display:'flex', alignItems:'center', gap:14, flexShrink:0, position:'relative', zIndex:10 }}>
        <Link to="/dashboard" style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, border:'1px solid rgba(240,237,232,0.1)', color:'rgba(240,237,232,0.45)', fontFamily:MONO, fontSize:13, transition:'all .2s', flexShrink:0 }}
          onMouseEnter={function(e) { e.currentTarget.style.borderColor='rgba(190,71,61,0.5)'; e.currentTarget.style.color='#BE473D' }}
          onMouseLeave={function(e) { e.currentTarget.style.borderColor='rgba(240,237,232,0.1)'; e.currentTarget.style.color='rgba(240,237,232,0.45)' }}>
          &lt;
        </Link>

        {/* Kuya AI avatar — gold like landing mockup */}
        <div style={{ width:32, height:32, background:'#C8A84B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🤙</div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:MONO, fontSize:12, color:'#F0EDE8', letterSpacing:2 }}>KUYA AI</div>
          <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:1.5 }}>
            {isPending
              ? <span style={{ color:'rgba(240,237,232,0.4)' }}>TYPING_</span>
              : <span><span style={{ color:'#1E8449' }}>●</span> <span style={{ color:'rgba(240,237,232,0.3)' }}>ONLINE · YOUR POST-GRAD BIG BROTHER</span></span>
            }
          </div>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:10, position:'relative', zIndex:1 }}>

        {/* Quick asks — like landing feature tags */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:6, paddingBottom:10, borderBottom:'1px solid rgba(240,237,232,0.06)' }}>
          {QUICK_ASKS.map(function(q, i) {
            return (
              <button key={i} className="quick-btn" onClick={function() { handleSend(q) }}
                style={{ padding:'4px 10px', border:'1px solid rgba(240,237,232,0.08)', background:'rgba(240,237,232,0.02)', color:'rgba(240,237,232,0.35)', fontFamily:MONO, fontSize:8, letterSpacing:.5, cursor:'pointer', transition:'all .2s' }}>
                {q}
              </button>
            )
          })}
        </div>

        {/* Messages — styled like landing chat mockup */}
        {messages.map(function(msg, i) {
          var isUser = msg.from === 'user'
          return (
            <div key={msg.id+'-'+i} style={{ display:'flex', gap:8, flexDirection: isUser ? 'row-reverse' : 'row', alignItems:'flex-end' }}>
              {!isUser && (
                <div style={{ width:26, height:26, background:'#C8A84B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🤙</div>
              )}
              <div style={{
                maxWidth:'80%', padding:'10px 14px',
                background: isUser ? '#BE473D' : 'rgba(240,237,232,0.05)',
                border: isUser ? 'none' : '1px solid rgba(240,237,232,0.08)',
              }}>
                {isUser
                  ? <span style={{ fontFamily:MONO, fontSize:11, color:'#F0EDE8', letterSpacing:.5, lineHeight:1.5 }}>{msg.text}</span>
                  : <FormattedMessage text={msg.text} />
                }
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isPending && (
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <div style={{ width:26, height:26, background:'#C8A84B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🤙</div>
            <div style={{ padding:'12px 16px', border:'1px solid rgba(240,237,232,0.08)', background:'rgba(240,237,232,0.04)' }}>
              <div style={{ display:'flex', gap:4, alignItems:'center', marginBottom:6 }}>
                <div className="dot1" style={{ width:4, height:4, borderRadius:'50%', background:'rgba(240,237,232,0.4)' }} />
                <div className="dot2" style={{ width:4, height:4, borderRadius:'50%', background:'rgba(240,237,232,0.4)' }} />
                <div className="dot3" style={{ width:4, height:4, borderRadius:'50%', background:'rgba(240,237,232,0.4)' }} />
              </div>
              <div style={{ fontFamily:MONO, fontSize:8, color:'rgba(240,237,232,0.2)', letterSpacing:1 }}>GENERATING... UP TO 30 SECONDS</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT — like landing chat mockup footer ── */}
      <div style={{ borderTop:'1px solid rgba(240,237,232,0.06)', padding:'12px 20px', background:'rgba(42,5,21,0.95)', backdropFilter:'blur(20px)', display:'flex', gap:10, alignItems:'center', flexShrink:0, position:'relative', zIndex:10 }}>
        <input
          type="text" value={input}
          onChange={function(e) { setInput(e.target.value) }}
          onKeyDown={function(e) { if (e.key === 'Enter') handleSend(null) }}
          placeholder="MAGTANONG KAY KUYA AI..."
          style={{ flex:1, padding:'11px 14px', background:'transparent', border:'1px solid rgba(240,237,232,0.1)', color:'#F0EDE8', fontFamily:MONO, fontSize:11, letterSpacing:.5, transition:'border-color .2s' }}
          onFocus={function(e) { e.target.style.borderColor='rgba(190,71,61,0.45)' }}
          onBlur={function(e) { e.target.style.borderColor='rgba(240,237,232,0.1)' }}
        />
        <button onClick={function() { handleSend(null) }}
          disabled={isPending || !input.trim()}
          style={{ width:38, height:38, background: isPending || !input.trim() ? 'rgba(190,71,61,0.3)' : '#BE473D', border:'none', cursor: isPending || !input.trim() ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#F0EDE8', fontSize:18, transition:'background .2s', flexShrink:0 }}
          onMouseEnter={function(e) { if (!isPending && input.trim()) e.currentTarget.style.background='#A33D34' }}
          onMouseLeave={function(e) { if (!isPending && input.trim()) e.currentTarget.style.background='#BE473D' }}>
          ↑
        </button>
      </div>
    </div>
  )
}