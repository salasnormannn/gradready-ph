import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import useAuthStore from '../../store/authStore'

const MONO = 'Inter, sans-serif'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; }
  body { background:#070f24; font-family:'Inter',sans-serif; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(200,168,75,0.4); border-radius:2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .fade-up { animation: fadeUp .4s ease both; }
  .row-hover:hover { background:rgba(200,168,75,0.04) !important; }
  .tab-btn { transition: all .15s; }
`

const TYPE_META = {
  BUG:           { icon: '🐛', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  SUGGESTION:    { icon: '💡', color: '#C8A84B', bg: 'rgba(200,168,75,0.12)' },
  CONTENT_ERROR: { icon: '📝', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  OTHER:         { icon: '💬', color: 'rgba(250,247,242,0.5)', bg: 'rgba(250,247,242,0.06)' },
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="fade-up" style={{ background:'rgba(250,247,242,0.03)', border:'1px solid rgba(250,247,242,0.07)', borderRadius:12, padding:'20px 22px', flex:1, minWidth:140 }}>
      <div style={{ fontSize:11, color:'rgba(250,247,242,0.35)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>{label}</div>
      <div style={{ fontSize:32, fontWeight:700, color: accent || '#FAF7F2', letterSpacing:'-1px', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'rgba(250,247,242,0.3)', marginTop:6 }}>{sub}</div>}
    </div>
  )
}

function Spinner() {
  return <div style={{ width:20, height:20, border:'2px solid rgba(200,168,75,0.25)', borderTopColor:'#C8A84B', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'60px auto' }} />
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [stats, setStats]           = useState(null)
  const [feedback, setFeedback]     = useState([])
  const [recent, setRecent]         = useState([])
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [loading, setLoading]       = useState(true)
  const [fbLoading, setFbLoading]   = useState(false)
  const [resolving, setResolving]   = useState(null) // id of item being resolved

  useEffect(() => {
    Promise.all([
      adminApi.getStats(),
      adminApi.getFeedback(),
      adminApi.getRecentUsers(),
    ]).then(([s, f, r]) => {
      setStats(s.data)
      setFeedback(f.data)
      setRecent(r.data)
    }).finally(() => setLoading(false))
  }, [])

  async function handleResolve(id) {
    setResolving(id)
    try {
      const res = await adminApi.resolve(id)
      setFeedback(prev => prev.map(f => f.id === id ? res.data : f))
    } finally {
      setResolving(null)
    }
  }

  async function applyFilter(type) {
    setTypeFilter(type)
    setFbLoading(true)
    try {
      const res = await adminApi.getFeedback(type === 'ALL' ? null : type)
      setFeedback(res.data)
    } finally {
      setFbLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function fmt(dt) {
    if (!dt) return '—'
    const d = new Date(dt)
    return d.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' }) + ' ' +
           d.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' })
  }

  const TABS = ['ALL', 'BUG', 'SUGGESTION', 'CONTENT_ERROR', 'OTHER']

  return (
    <div style={{ minHeight:'100vh', background:'#070f24', fontFamily:MONO, color:'#FAF7F2' }}>
      <style>{CSS}</style>

      {/* Background grid */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(250,247,242,0.006) 1px,transparent 1px),linear-gradient(90deg,rgba(250,247,242,0.006) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', top:'-10%', right:'-5%', width:'40vw', height:'40vw', maxWidth:360, maxHeight:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(200,168,75,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      {/* HEADER */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(4,10,28,0.96)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(250,247,242,0.06)', padding:'0 28px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width:7, height:7, background: i<2 ? '#FAF7F2':'#C8A84B', borderRadius:1 }} />)}
          </div>
          <span style={{ fontSize:13, fontWeight:700, letterSpacing:2.5, color:'#FAF7F2' }}>GRADREADY</span>
          <div style={{ padding:'3px 8px', background:'rgba(200,168,75,0.15)', border:'1px solid rgba(200,168,75,0.3)', borderRadius:4, fontSize:9, fontWeight:600, color:'#C8A84B', letterSpacing:1.5 }}>ADMIN</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:12, color:'rgba(250,247,242,0.35)' }}>{user?.email}</span>
          <button onClick={handleLogout}
            style={{ padding:'6px 14px', background:'transparent', border:'1px solid rgba(250,247,242,0.12)', borderRadius:6, color:'rgba(250,247,242,0.45)', fontFamily:MONO, fontSize:11, cursor:'pointer', transition:'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,68,68,0.5)'; e.currentTarget.style.color='#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(250,247,242,0.12)'; e.currentTarget.style.color='rgba(250,247,242,0.45)' }}>
            Sign out
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px 60px', position:'relative', zIndex:1 }}>

          {/* Page title */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:22, fontWeight:700, color:'#FAF7F2', letterSpacing:'-0.5px' }}>Dashboard</div>
            <div style={{ fontSize:12, color:'rgba(250,247,242,0.3)', marginTop:4 }}>GradReady PH admin overview</div>
          </div>

          {/* ── STATS ROW ── */}
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:36 }}>
            <StatCard label="Total Users"    value={stats?.totalUsers ?? 0}     sub="registered accounts" />
            <StatCard label="New This Week"  value={stats?.newThisWeek ?? 0}    sub="last 7 days" accent="#C8A84B" />
            <StatCard label="New This Month" value={stats?.newThisMonth ?? 0}   sub="last 30 days" />
            <StatCard label="Total Feedback" value={stats?.feedbackTotal ?? 0}  sub={`🐛 ${stats?.feedbackByType?.BUG ?? 0} bugs · 💡 ${stats?.feedbackByType?.SUGGESTION ?? 0} suggestions`} />
            <StatCard label="Bugs Reported"  value={stats?.feedbackByType?.BUG ?? 0}  sub="needs attention" accent="#ef4444" />
          </div>

          {/* ── MAIN GRID ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>

            {/* ── LEFT: Feedback ── */}
            <div style={{ background:'rgba(250,247,242,0.02)', border:'1px solid rgba(250,247,242,0.06)', borderRadius:12, overflow:'hidden' }}>
              {/* Section header */}
              <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(250,247,242,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#FAF7F2' }}>User Feedback</div>
                <div style={{ fontSize:11, color:'rgba(250,247,242,0.3)' }}>{feedback.length} entries</div>
              </div>

              {/* Filter tabs */}
              <div style={{ padding:'12px 20px', borderBottom:'1px solid rgba(250,247,242,0.05)', display:'flex', gap:6, flexWrap:'wrap' }}>
                {TABS.map(t => {
                  const active = typeFilter === t
                  const meta = t !== 'ALL' ? TYPE_META[t] : null
                  return (
                    <button key={t} className="tab-btn" onClick={() => applyFilter(t)}
                      style={{ padding:'5px 12px', border:'1px solid', borderRadius:16, fontFamily:MONO, fontSize:11, cursor:'pointer',
                        background: active ? (meta?.bg || 'rgba(200,168,75,0.12)') : 'transparent',
                        borderColor: active ? (meta?.color || '#C8A84B') : 'rgba(250,247,242,0.1)',
                        color: active ? (meta?.color || '#C8A84B') : 'rgba(250,247,242,0.4)' }}>
                      {meta ? `${meta.icon} ` : ''}{t === 'CONTENT_ERROR' ? 'Content Error' : t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                  )
                })}
              </div>

              {/* Feedback list */}
              {fbLoading ? <Spinner /> : feedback.length === 0 ? (
                <div style={{ padding:'48px 20px', textAlign:'center', color:'rgba(250,247,242,0.2)', fontSize:12 }}>No feedback yet.</div>
              ) : (
                <div>
                  {feedback.map((item) => {
                    const meta = TYPE_META[item.type] || TYPE_META.OTHER
                    const canResolve = item.type === 'BUG' || item.type === 'CONTENT_ERROR'
                    const isResolving = resolving === item.id
                    return (
                      <div key={item.id} className="row-hover"
                        style={{ padding:'14px 20px', borderBottom:'1px solid rgba(250,247,242,0.04)', display:'flex', flexDirection:'column', gap:6, opacity: item.resolved ? 0.5 : 1, transition:'opacity .2s' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                          {/* Type badge */}
                          <span style={{ padding:'2px 8px', background:meta.bg, border:`1px solid ${meta.color}30`, borderRadius:10, fontSize:10, fontWeight:600, color:meta.color, whiteSpace:'nowrap' }}>
                            {meta.icon} {item.type === 'CONTENT_ERROR' ? 'Content Error' : item.type.charAt(0) + item.type.slice(1).toLowerCase()}
                          </span>
                          {/* Resolved badge */}
                          {item.resolved && (
                            <span style={{ padding:'2px 8px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:10, fontSize:10, fontWeight:600, color:'#22c55e', whiteSpace:'nowrap' }}>
                              ✓ Resolved
                            </span>
                          )}
                          {/* Page URL */}
                          {item.pageUrl && (
                            <span style={{ fontSize:10, color:'rgba(250,247,242,0.25)', background:'rgba(250,247,242,0.04)', padding:'2px 8px', borderRadius:10, border:'1px solid rgba(250,247,242,0.07)' }}>
                              {item.pageUrl}
                            </span>
                          )}
                          <span style={{ marginLeft:'auto', fontSize:10, color:'rgba(250,247,242,0.2)' }}>{fmt(item.createdAt)}</span>
                        </div>
                        {/* Message */}
                        <div style={{ fontSize:13, color:'rgba(250,247,242,0.8)', lineHeight:1.6, textDecoration: item.resolved ? 'line-through' : 'none' }}>{item.message}</div>
                        {/* Footer row: user + resolve button */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                          <div style={{ fontSize:10, color:'rgba(250,247,242,0.25)' }}>
                            {item.userFullName !== '—' ? `${item.userFullName} · ` : ''}{item.userEmail}
                            {item.resolved && item.resolvedAt && (
                              <span style={{ marginLeft:6, color:'rgba(34,197,94,0.5)' }}>· resolved {fmt(item.resolvedAt)}</span>
                            )}
                          </div>
                          {canResolve && !item.resolved && (
                            <button onClick={() => handleResolve(item.id)} disabled={isResolving}
                              style={{ padding:'4px 12px', background:'transparent', border:'1px solid rgba(34,197,94,0.3)', borderRadius:6, color:'rgba(34,197,94,0.7)', fontFamily:MONO, fontSize:10, cursor: isResolving ? 'not-allowed' : 'pointer', transition:'all .15s', whiteSpace:'nowrap', flexShrink:0 }}
                              onMouseEnter={e => { if (!isResolving) { e.currentTarget.style.background='rgba(34,197,94,0.1)'; e.currentTarget.style.borderColor='#22c55e'; e.currentTarget.style.color='#22c55e' }}}
                              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(34,197,94,0.3)'; e.currentTarget.style.color='rgba(34,197,94,0.7)' }}>
                              {isResolving ? '...' : '✓ Mark Resolved'}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT: Recent Users ── */}
            <div style={{ background:'rgba(250,247,242,0.02)', border:'1px solid rgba(250,247,242,0.06)', borderRadius:12, overflow:'hidden' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(250,247,242,0.06)' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#FAF7F2' }}>Recent Signups</div>
                <div style={{ fontSize:11, color:'rgba(250,247,242,0.3)', marginTop:2 }}>Last 10 registered users</div>
              </div>

              {recent.length === 0 ? (
                <div style={{ padding:'32px 20px', textAlign:'center', color:'rgba(250,247,242,0.2)', fontSize:12 }}>No users yet.</div>
              ) : (
                recent.map((u, i) => (
                  <div key={i} className="row-hover" style={{ padding:'12px 20px', borderBottom:'1px solid rgba(250,247,242,0.04)', display:'flex', flexDirection:'column', gap:3 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:26, height:26, background:'rgba(200,168,75,0.15)', border:'1px solid rgba(200,168,75,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'#C8A84B', flexShrink:0 }}>
                        {u.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:12, color:'#FAF7F2', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.fullName}</div>
                        <div style={{ fontSize:10, color:'rgba(250,247,242,0.3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', paddingLeft:34 }}>
                      {u.course && <span style={{ fontSize:9, color:'rgba(250,247,242,0.3)', background:'rgba(250,247,242,0.04)', padding:'2px 6px', borderRadius:8, border:'1px solid rgba(250,247,242,0.07)' }}>{u.course}</span>}
                      {u.region && <span style={{ fontSize:9, color:'rgba(250,247,242,0.3)', background:'rgba(250,247,242,0.04)', padding:'2px 6px', borderRadius:8, border:'1px solid rgba(250,247,242,0.07)' }}>{u.region}</span>}
                      <span style={{ fontSize:9, color:'rgba(250,247,242,0.2)', marginLeft:'auto' }}>{fmt(u.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}

              {/* Feedback type breakdown */}
              {stats && (
                <div style={{ margin:'0 20px 16px', marginTop:20, padding:'14px 16px', background:'rgba(250,247,242,0.02)', border:'1px solid rgba(250,247,242,0.05)', borderRadius:10 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'rgba(250,247,242,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Feedback Breakdown</div>
                  {Object.entries(stats.feedbackByType || {}).map(([type, count]) => {
                    const meta = TYPE_META[type] || TYPE_META.OTHER
                    const total = stats.feedbackTotal || 1
                    const pct = Math.round((count / total) * 100)
                    return (
                      <div key={type} style={{ marginBottom:8 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontSize:11, color: meta.color }}>{meta.icon} {type === 'CONTENT_ERROR' ? 'Content Error' : type.charAt(0) + type.slice(1).toLowerCase()}</span>
                          <span style={{ fontSize:11, color:'rgba(250,247,242,0.4)' }}>{count}</span>
                        </div>
                        <div style={{ height:3, background:'rgba(250,247,242,0.06)', borderRadius:2 }}>
                          <div style={{ height:'100%', width: pct + '%', background: meta.color, borderRadius:2, transition:'width .6s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
