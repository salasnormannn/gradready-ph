import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useChat } from '../../hooks/useChat'
import { useChatConversations, useDeleteConversation, fetchConversation } from '../../hooks/useChatConversations'
import useAuthStore from '../../store/authStore'

const MONO = 'Inter, sans-serif'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; }
  body { background:#0F2044; font-family:'Inter',sans-serif; overflow:hidden; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(200,168,75,0.4); border-radius:2px; }
  ::selection { background:rgba(200,168,75,0.35); }

  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }

  .dot1{animation:bounce 1.2s ease-in-out infinite;}
  .dot2{animation:bounce 1.2s ease-in-out .2s infinite;}
  .dot3{animation:bounce 1.2s ease-in-out .4s infinite;}

  /* Sidebar */
  .sidebar {
    width:260px; height:100vh; background:rgba(5,14,40,0.98);
    border-right:1px solid rgba(250,247,242,0.06);
    display:flex; flex-direction:column; flex-shrink:0; overflow:hidden;
    transition:transform .28s cubic-bezier(.4,0,.2,1);
  }
  .conv-item { transition:background .15s; cursor:pointer; position:relative; }
  .conv-item:hover { background:rgba(250,247,242,0.06) !important; }
  .conv-del { opacity:0; transition:opacity .15s; }
  .conv-item:hover .conv-del { opacity:1; }

  /* Input */
  textarea { font-family:'Inter',sans-serif !important; resize:none; }
  textarea::placeholder { color:rgba(250,247,242,0.25); }
  textarea:focus { outline:none; }

  /* Quick suggestions */
  .sugg-btn { transition:all .18s; }
  .sugg-btn:hover { background:rgba(200,168,75,0.1) !important; border-color:rgba(200,168,75,0.4) !important; color:#FAF7F2 !important; }

  /* Message fade-in */
  .msg-in { animation:fadeUp .35s ease both; }

  /* Sidebar overlay on mobile */
  .sidebar-overlay {
    display:none; position:fixed; inset:0;
    background:rgba(0,0,0,0.55); z-index:299;
  }

  @media (max-width: 767px) {
    .sidebar {
      position:fixed; top:0; left:0; bottom:0; z-index:300;
      transform:translateX(-100%);
    }
    .sidebar.open { transform:translateX(0); }
    .sidebar-overlay.visible { display:block; }
  }
`

var SUGGESTIONS = [
  { icon:'🪪', text:'How do I get my TIN as a fresh grad?' },
  { icon:'🛡️', text:'How to register for SSS online?' },
  { icon:'💼', text:'How to negotiate my first salary?' },
  { icon:'🏥', text:'How do I sign up for PhilHealth?' },
  { icon:'💰', text:'What is Pag-IBIG MP2 and should I invest?' },
  { icon:'📋', text:'What do I need for NBI clearance?' },
]

// ── Date grouping helpers ──────────────────────────────────────────────────────
function groupConversations(list) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7)

  const groups = []
  const buckets = { 'Today': [], 'Yesterday': [], 'Previous 7 days': [], 'Older': [] }

  list.forEach(c => {
    const d = new Date(c.updatedAt)
    if (d >= todayStart) buckets['Today'].push(c)
    else if (d >= yesterdayStart) buckets['Yesterday'].push(c)
    else if (d >= weekStart) buckets['Previous 7 days'].push(c)
    else buckets['Older'].push(c)
  })

  Object.entries(buckets).forEach(([label, items]) => {
    if (items.length > 0) groups.push({ label, items })
  })
  return groups
}

// ── Message renderer ──────────────────────────────────────────────────────────
function FormattedMessage({ text }) {
  const lines = text.split('\n')
  const elements = []
  let key = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) { elements.push(<div key={key++} style={{ height: 6 }} />); continue }
    const numMatch = line.match(/^(\d+)[.)]\s+(.+)/)
    if (numMatch) {
      elements.push(
        <div key={key++} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:4 }}>
          <span style={{ fontSize:11, color:'#C8A84B', flexShrink:0, marginTop:2, fontWeight:600 }}>{numMatch[1]}.</span>
          <span style={{ fontSize:14, color:'rgba(250,247,242,0.88)', lineHeight:1.7 }}>{numMatch[2]}</span>
        </div>
      ); continue
    }
    const bulletMatch = line.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      elements.push(
        <div key={key++} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:4 }}>
          <span style={{ fontSize:10, color:'#C8A84B', flexShrink:0, marginTop:4 }}>›</span>
          <span style={{ fontSize:14, color:'rgba(250,247,242,0.88)', lineHeight:1.7 }}>{bulletMatch[1]}</span>
        </div>
      ); continue
    }
    const headingMatch = line.match(/^#{1,3}\s+(.+)/) || line.match(/^\*\*([^*]+)\*\*$/)
    if (headingMatch) {
      elements.push(
        <div key={key++} style={{ fontSize:13, fontWeight:600, color:'#FAF7F2', letterSpacing:.5, marginTop:10, marginBottom:4 }}>
          {headingMatch[1]}
        </div>
      ); continue
    }
    elements.push(<p key={key++} style={{ fontSize:14, color:'rgba(250,247,242,0.88)', lineHeight:1.75, marginBottom:2 }}>{line}</p>)
  }
  return <div>{elements}</div>
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, isOpen, onClose }) {
  const groups = groupConversations(conversations || [])

  return (
    <>
      <div className={'sidebar' + (isOpen ? ' open' : '')} style={{ fontFamily: MONO }}>
        {/* Header */}
        <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid rgba(250,247,242,0.06)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:30, height:30, background:'#C8A84B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, borderRadius:4, flexShrink:0 }}>🤙</div>
            <span style={{ fontSize:13, fontWeight:600, color:'#FAF7F2', letterSpacing:.5 }}>Kuya AI</span>
          </div>
          <button onClick={onNew}
            style={{ width:'100%', padding:'9px 12px', background:'rgba(200,168,75,0.12)', border:'1px solid rgba(200,168,75,0.3)', color:'#C8A84B', fontFamily:MONO, fontSize:12, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all .18s', borderRadius:2 }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(200,168,75,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(200,168,75,0.12)' }}>
            <span style={{ fontSize:16, lineHeight:1 }}>+</span>
            New chat
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {groups.length === 0 && (
            <div style={{ padding:'32px 16px', textAlign:'center', color:'rgba(250,247,242,0.2)', fontSize:12 }}>
              No conversations yet.<br/>Start chatting!
            </div>
          )}
          {groups.map(({ label, items }) => (
            <div key={label}>
              <div style={{ padding:'8px 16px 4px', fontSize:10, fontWeight:600, color:'rgba(250,247,242,0.3)', letterSpacing:1.5, textTransform:'uppercase' }}>
                {label}
              </div>
              {items.map(conv => (
                <div key={conv.id} className="conv-item"
                  onClick={() => { onSelect(conv); onClose() }}
                  style={{ padding:'8px 12px 8px 16px', display:'flex', alignItems:'center', gap:8, background: activeId === conv.id ? 'rgba(200,168,75,0.1)' : 'transparent', borderLeft: activeId === conv.id ? '2px solid #C8A84B' : '2px solid transparent' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color: activeId === conv.id ? '#FAF7F2' : 'rgba(250,247,242,0.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontWeight: activeId === conv.id ? 500 : 400 }}>
                      {conv.title}
                    </div>
                  </div>
                  <button className="conv-del"
                    onClick={e => { e.stopPropagation(); onDelete(conv.id) }}
                    style={{ width:22, height:22, background:'transparent', border:'none', color:'rgba(250,247,242,0.3)', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, borderRadius:2, padding:0, transition:'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='rgba(239,68,68,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.color='rgba(250,247,242,0.3)'; e.currentTarget.style.background='transparent' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(250,247,242,0.06)', flexShrink:0 }}>
          <Link to="/dashboard" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', color:'rgba(250,247,242,0.35)', fontSize:12, transition:'color .15s' }}
            onMouseEnter={e => { e.currentTarget.style.color='rgba(250,247,242,0.7)' }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(250,247,242,0.35)' }}>
            ← Back to dashboard
          </Link>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={'sidebar-overlay' + (isOpen ? ' visible' : '')} onClick={onClose} />
    </>
  )
}

// ── Greeting screen ───────────────────────────────────────────────────────────
function GreetingView({ firstName, onSuggestion }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', overflowY:'auto' }}>
      {/* Avatar */}
      <div style={{ width:64, height:64, background:'linear-gradient(135deg,#C8A84B,#a8882b)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, marginBottom:20, boxShadow:'0 8px 32px rgba(200,168,75,0.25)' }}>
        🤙
      </div>

      <div style={{ textAlign:'center', marginBottom:40, maxWidth:480 }}>
        <h1 style={{ fontSize:'clamp(22px,4vw,30px)', fontWeight:700, color:'#FAF7F2', marginBottom:8, letterSpacing:'-0.5px' }}>
          Kamusta, {firstName}!
        </h1>
        <p style={{ fontSize:15, color:'rgba(250,247,242,0.5)', lineHeight:1.6 }}>
          I'm Kuya AI — your post-grad big brother. Magtanong ka sa akin tungkol sa government registration, job hunting, salary, o kahit anong kailangan mo.
        </p>
      </div>

      {/* Suggestions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10, width:'100%', maxWidth:600 }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="sugg-btn"
            onClick={() => onSuggestion(s.text)}
            style={{ padding:'14px 16px', background:'rgba(250,247,242,0.04)', border:'1px solid rgba(250,247,242,0.08)', color:'rgba(250,247,242,0.65)', fontFamily:MONO, fontSize:13, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:10, lineHeight:1.4, borderRadius:4 }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const chatHook = useChat()
  const { data: conversations, isLoading: convsLoading } = useChatConversations()
  const deleteConversation = useDeleteConversation()

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Ka-Grad'

  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loadingConv, setLoadingConv] = useState(false)
  const [isLongGen, setIsLongGen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  // Capture initialMessage into a ref immediately — cleared before the effect
  // runs a second time (React 18 StrictMode double-invoke), preventing double-send
  const pendingInitialMsg = useRef(location.state?.initialMessage || null)

  // Handle initialMessage passed from other pages (e.g. GovPage "Ask Kuya AI")
  useEffect(() => {
    const msg = pendingInitialMsg.current
    pendingInitialMsg.current = null   // clear before anything else runs
    if (msg) {
      navigate(location.pathname, { replace: true, state: null })
      handleSend(msg)
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, chatHook.isPending])

  // Auto-resize textarea
  function handleTextareaChange(e) {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(null)
    }
  }

  const LONG_GEN_KEYWORDS = ['cover letter', 'resume', 'write', 'generate', 'red flag']
  function checkLongGen(msg) {
    const lower = msg.toLowerCase()
    return LONG_GEN_KEYWORDS.some(k => lower.includes(k))
  }

  async function handleSend(text) {
    const msg = (text || input).trim()
    if (!msg || isSending) return
    setInput('')
    if (textareaRef.current) { textareaRef.current.style.height = 'auto' }
    setIsLongGen(checkLongGen(msg))
    setIsSending(true)

    const userMsgId = 'user-' + Date.now()
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: msg }])

    try {
      const data = await chatHook.mutateAsync({ message: msg, conversationId: activeConversationId })
      setActiveConversationId(data.conversationId)
      setMessages(prev => [...prev, { id: 'ai-' + Date.now(), role: 'assistant', content: data.message }])
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] })
    } catch {
      setMessages(prev => [...prev, { id: 'err-' + Date.now(), role: 'assistant', content: 'Sorry, may error. Subukan mo ulit? Pag cover letter o resume, medyo matagal — try again.' }])
    } finally {
      setIsSending(false)
      setIsLongGen(false)
    }
  }

  async function handleSelectConversation(conv) {
    if (conv.id === activeConversationId) return
    setLoadingConv(true)
    setMessages([])
    setActiveConversationId(conv.id)
    try {
      const data = await fetchConversation(conv.id)
      setMessages(data.messages.map((m, i) => ({
        id: m.role + '-' + i + '-' + (m.createdAt || Date.now()),
        role: m.role,
        content: m.content,
      })))
    } catch (e) {
      setMessages([{ id: 'err-load', role: 'assistant', content: 'Hindi ma-load ang conversation. Try again.' }])
    } finally {
      setLoadingConv(false)
    }
  }

  function handleNewChat() {
    setActiveConversationId(null)
    setMessages([])
    setSidebarOpen(false)
  }

  function handleDeleteConversation(id) {
    deleteConversation.mutate(id, {
      onSuccess: () => {
        if (id === activeConversationId) handleNewChat()
      }
    })
  }

  const isNewChat = !activeConversationId && messages.length === 0
  const isPending = isSending

  return (
    <div style={{ height: '100vh', display: 'flex', fontFamily: MONO, overflow: 'hidden', background: '#0F2044' }}>
      <style>{CSS}</style>

      {/* ── SIDEBAR ── */}
      <Sidebar
        conversations={conversations || []}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

        {/* Top bar */}
        <div style={{ height: 52, borderBottom: '1px solid rgba(250,247,242,0.06)', background: 'rgba(8,20,52,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0, zIndex: 10 }}>
          {/* Mobile sidebar toggle */}
          <button onClick={() => setSidebarOpen(true)}
            style={{ width: 34, height: 34, background: 'transparent', border: '1px solid rgba(250,247,242,0.1)', color: 'rgba(250,247,242,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, borderRadius: 2, transition: 'all .18s' }}
            className="md-hide"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)'; e.currentTarget.style.color = '#C8A84B' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.1)'; e.currentTarget.style.color = 'rgba(250,247,242,0.5)' }}>
            ☰
          </button>

          <div style={{ width: 28, height: 28, background: '#C8A84B', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤙</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FAF7F2' }}>Kuya AI</div>
            <div style={{ fontSize: 10, color: isPending ? 'rgba(250,247,242,0.4)' : 'rgba(250,247,242,0.3)', letterSpacing: .5 }}>
              {isPending
                ? 'Typing...'
                : <><span style={{ color: '#22c55e' }}>●</span> Online · Your post-grad big brother</>}
            </div>
          </div>

          <button onClick={handleNewChat}
            style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(250,247,242,0.1)', color: 'rgba(250,247,242,0.45)', fontFamily: MONO, fontSize: 11, cursor: 'pointer', borderRadius: 2, transition: 'all .18s', whiteSpace: 'nowrap', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)'; e.currentTarget.style.color = '#C8A84B' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.1)'; e.currentTarget.style.color = 'rgba(250,247,242,0.45)' }}>
            + New
          </button>
        </div>

        {/* Content area */}
        {isNewChat ? (
          <GreetingView firstName={firstName} onSuggestion={handleSend} />
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: 720, width: '100%', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Loading previous conversation */}
              {loadingConv && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                  <div style={{ width: 20, height: 20, border: '2px solid rgba(200,168,75,0.3)', borderTopColor: '#C8A84B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
              )}

              {/* Messages */}
              {!loadingConv && messages.map((msg, i) => {
                const isUser = msg.role === 'user'
                return (
                  <div key={msg.id + '-' + i} className="msg-in"
                    style={{ display: 'flex', gap: 14, flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    {!isUser && (
                      <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#C8A84B,#a8882b)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, marginTop: 2 }}>🤙</div>
                    )}
                    {isUser && (
                      <div style={{ width: 32, height: 32, background: 'rgba(250,247,242,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FAF7F2', flexShrink: 0, marginTop: 2 }}>
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Bubble */}
                    <div style={{ maxWidth: '78%', minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: isUser ? 'rgba(250,247,242,0.4)' : 'rgba(200,168,75,0.8)', marginBottom: 5, letterSpacing: .5 }}>
                        {isUser ? 'You' : 'Kuya AI'}
                      </div>
                      <div style={{
                        padding: isUser ? '11px 16px' : '14px 18px',
                        background: isUser ? 'rgba(200,168,75,0.15)' : 'rgba(250,247,242,0.04)',
                        border: isUser ? '1px solid rgba(200,168,75,0.25)' : '1px solid rgba(250,247,242,0.07)',
                        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      }}>
                        {isUser
                          ? <p style={{ fontSize: 14, color: '#FAF7F2', lineHeight: 1.6 }}>{msg.content}</p>
                          : <FormattedMessage text={msg.content} />}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {isPending && (
                <div className="msg-in" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#C8A84B,#a8882b)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🤙</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(200,168,75,0.8)', marginBottom: 5, letterSpacing: .5 }}>Kuya AI</div>
                    <div style={{ padding: '14px 18px', border: '1px solid rgba(250,247,242,0.07)', background: 'rgba(250,247,242,0.04)', borderRadius: '4px 16px 16px 16px' }}>
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 6 }}>
                        <div className="dot1" style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(250,247,242,0.45)' }} />
                        <div className="dot2" style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(250,247,242,0.45)' }} />
                        <div className="dot3" style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(250,247,242,0.45)' }} />
                      </div>
                      {isLongGen
                        ? <div style={{ fontSize: 11, color: 'rgba(200,168,75,0.55)', letterSpacing: .3 }}>Writing — this may take up to 60 seconds...</div>
                        : <div style={{ fontSize: 11, color: 'rgba(250,247,242,0.25)', letterSpacing: .5 }}>Generating response...</div>
                      }
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* ── INPUT BAR ── */}
        <div style={{ padding: '12px 20px 16px', background: 'rgba(5,14,40,0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(250,247,242,0.06)', flexShrink: 0 }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(250,247,242,0.04)', border: '1px solid rgba(250,247,242,0.1)', borderRadius: 12, padding: '10px 10px 10px 16px', transition: 'border-color .2s' }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)' }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.1)' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Magtanong kay Kuya AI... (Enter to send, Shift+Enter for new line)"
                rows={1}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#FAF7F2', fontFamily: MONO, fontSize: 14, lineHeight: 1.6, padding: 0, minHeight: 24, maxHeight: 160, overflow: 'auto' }}
              />
              <button onClick={() => handleSend(null)}
                disabled={isPending || !input.trim()}
                style={{ width: 36, height: 36, background: isPending || !input.trim() ? 'rgba(200,168,75,0.2)' : '#C8A84B', border: 'none', borderRadius: 8, cursor: isPending || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF7F2', fontSize: 16, transition: 'all .18s', flexShrink: 0 }}
                onMouseEnter={e => { if (!isPending && input.trim()) e.currentTarget.style.background = '#b8942b' }}
                onMouseLeave={e => { if (!isPending && input.trim()) e.currentTarget.style.background = '#C8A84B' }}>
                ↑
              </button>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(250,247,242,0.18)', marginTop: 6, textAlign: 'center' }}>
              Kuya AI can make mistakes. Verify important info at official government sites.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
