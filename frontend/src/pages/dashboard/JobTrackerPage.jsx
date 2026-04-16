import { useState, useEffect } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'

const MONO = 'Inter, sans-serif'
const CSS = `
  .job-card{transition:all .18s;border-left:3px solid transparent;}
  .job-card:hover{background:rgba(250,247,242,0.07)!important;border-left-color:#C8A84B!important;}
  input::placeholder{color:rgba(250,247,242,0.2);}
  input:focus,textarea:focus{outline:none;border-color:rgba(200,168,75,0.5)!important;}
  .modal-sheet::-webkit-scrollbar{width:2px;}
  .modal-sheet::-webkit-scrollbar-thumb{background:#C8A84B;}
  .filter-btn{flex-shrink:0;padding:7px 14px;border:1px solid;background:transparent;font-family:'Inter',sans-serif;font-size:11px;letter-spacing:1px;cursor:pointer;white-space:nowrap;transition:all .15s;}
  .action-btn{flex:1;padding:11px;background:transparent;font-family:'Inter',sans-serif;font-size:11px;cursor:pointer;letter-spacing:1px;transition:all .18s;}
  .status-option:hover{background:rgba(250,247,242,0.08)!important;}
`

var STATUSES = [
  { key: 'WISHLIST',  label: 'Wishlist',  color: 'rgba(250,247,242,0.55)' },
  { key: 'APPLIED',   label: 'Applied',   color: '#60A5FA' },
  { key: 'INTERVIEW', label: 'Interview', color: '#FBBF24' },
  { key: 'OFFER',     label: 'Offer',     color: '#34D399' },
  { key: 'ACCEPTED',  label: 'Accepted',  color: '#C8A84B' },
  { key: 'REJECTED',  label: 'Rejected',  color: 'rgba(250,247,242,0.35)' },
  { key: 'GHOSTED',   label: 'Ghosted',   color: '#C4B5FD' },
]
function gs(key) { return STATUSES.find(s => s.key === key) || STATUSES[1] }

/* ── Custom status dropdown (replaces native <select>) ── */
function StatusDropdown({ appId, current, onChange }) {
  var [open, setOpen] = useState(false)
  var s = gs(current)

  return (
      <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        {/* Trigger button */}
        <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'rgba(250,247,242,0.05)',
              border: '1px solid',
              borderColor: s.color + '66',
              color: s.color,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 1,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all .15s',
            }}>
          {s.label.toUpperCase()}
          <span style={{ fontSize: 8, opacity: .6 }}>{open ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown panel */}
        {open && (
            <>
              {/* Invisible backdrop — closes dropdown on outside click */}
              <div
                  style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                  onClick={() => setOpen(false)}
              />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                background: '#1C0512',
                border: '1px solid rgba(250,247,242,0.1)',
                zIndex: 101,
                minWidth: 140,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                {STATUSES.map(st => (
                    <button
                        key={st.key}
                        className="status-option"
                        onClick={() => { onChange(appId, st.key); setOpen(false) }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '9px 14px',
                          background: current === st.key ? 'rgba(250,247,242,0.07)' : 'transparent',
                          border: 'none',
                          borderLeft: current === st.key ? '2px solid ' + st.color : '2px solid transparent',
                          color: st.color,
                          fontFamily: MONO,
                          fontSize: 11,
                          letterSpacing: 1,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all .12s',
                        }}>
                      {st.label.toUpperCase()}
                    </button>
                ))}
              </div>
            </>
        )}
      </div>
  )
}

function Inp({ value, onChange, placeholder, type = 'text' }) {
  return (
      <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ width: '100%', padding: '13px 16px', background: 'rgba(250,247,242,0.05)', border: '1px solid rgba(250,247,242,0.1)', color: '#FAF7F2', fontFamily: MONO, fontSize: 13, letterSpacing: .5, transition: 'border-color .18s' }}
          onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(250,247,242,0.1)'}
      />
  )
}

/* ── Shared modal shell ── */
function ModalShell({ tag, title, onClose, children }) {
  return (
      <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,5,18,0.88)', zIndex: 600, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="modal-sheet" style={{
          background: '#2A0515', border: '1px solid rgba(250,247,242,0.07)', borderBottom: 'none',
          width: '100%', maxWidth: 580, maxHeight: '88vh', overflowY: 'auto',
          padding: 28, paddingBottom: 'calc(72px + 36px)',
        }}>
          <style>{CSS}</style>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 10px', border: '1px solid rgba(250,247,242,0.07)' }}>
              <span style={{ fontSize: 12, color: '#C8A84B' }}>{tag}</span>
              <span style={{ fontSize: 12, letterSpacing: 2, color: 'rgba(250,247,242,0.55)' }}>{title}</span>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(250,247,242,0.07)', color: 'rgba(250,247,242,0.4)', width: 36, height: 36, cursor: 'pointer', fontFamily: MONO, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          {children}
        </div>
      </div>
  )
}

/* ── Shared form body ── */
function AppForm({ f, u }) {
  return (
      <>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(250,247,242,0.42)', letterSpacing: 2, marginBottom: 10 }}>// STATUS</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {STATUSES.map(s => {
              var a = f.status === s.key
              return (
                  <button key={s.key} onClick={() => u('status', s.key)}
                          style={{ padding: '6px 13px', border: '1px solid', borderColor: a ? s.color : 'rgba(250,247,242,0.1)', background: a ? 'rgba(250,247,242,0.04)' : 'transparent', color: a ? s.color : 'rgba(250,247,242,0.25)', fontFamily: MONO, fontSize: 10, letterSpacing: 1, cursor: 'pointer', transition: 'all .15s' }}>
                    {s.label.toUpperCase()}
                  </button>
              )
            })}
          </div>
        </div>

        {[
          { k: 'company',   l: 'COMPANY *',  p: 'e.g. GCash' },
          { k: 'role',      l: 'ROLE *',     p: 'e.g. Junior Software Engineer' },
          { k: 'location',  l: 'LOCATION',   p: 'e.g. BGC, Taguig' },
          { k: 'workSetup', l: 'WORK SETUP', p: 'Hybrid / WFH / Onsite' },
          { k: 'jobUrl',    l: 'JOB URL',    p: 'https://...' },
        ].map(fi => (
            <div key={fi.k} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(250,247,242,0.42)', letterSpacing: 2, marginBottom: 7 }}>// {fi.l}</div>
              <Inp value={f[fi.k]} onChange={e => u(fi.k, e.target.value)} placeholder={fi.p} />
            </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(250,247,242,0.42)', letterSpacing: 2, marginBottom: 7 }}>// MIN SALARY (PHP)</div>
            <Inp type="number" value={f.salaryMin} onChange={e => u('salaryMin', e.target.value)} placeholder="35000" />
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(250,247,242,0.42)', letterSpacing: 2, marginBottom: 7 }}>// MAX SALARY (PHP)</div>
            <Inp type="number" value={f.salaryMax} onChange={e => u('salaryMax', e.target.value)} placeholder="50000" />
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(250,247,242,0.42)', letterSpacing: 2, marginBottom: 7 }}>// NOTES</div>
          <textarea value={f.notes} onChange={e => u('notes', e.target.value)} placeholder="Notes, next steps..."
                    rows={3} style={{ width: '100%', padding: '13px 16px', background: 'rgba(250,247,242,0.05)', border: '1px solid rgba(250,247,242,0.1)', color: '#FAF7F2', fontFamily: MONO, fontSize: 12, resize: 'none', letterSpacing: .3, transition: 'border-color .18s' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(250,247,242,0.1)'} />
        </div>
      </>
  )
}

/* ── Add Modal ── */
function AddModal({ onClose, onSave }) {
  var [f, setF] = useState({ company: '', role: '', location: '', workSetup: '', salaryMin: '', salaryMax: '', jobUrl: '', notes: '', status: 'APPLIED' })
  var [loading, setLoading] = useState(false)
  function u(k, v) { setF(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!f.company || !f.role) return
    setLoading(true)
    try {
      await api.post('/api/tracker', {
        company: f.company, role: f.role, location: f.location || null,
        workSetup: f.workSetup || null,
        salaryMin: f.salaryMin ? parseInt(f.salaryMin) : null,
        salaryMax: f.salaryMax ? parseInt(f.salaryMax) : null,
        jobUrl: f.jobUrl || null, notes: f.notes || null, status: f.status
      })
      onSave(); onClose()
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  return (
      <ModalShell tag="NEW" title="APPLICATION" onClose={onClose}>
        <AppForm f={f} u={u} />
        <button onClick={save} disabled={loading || !f.company || !f.role}
                style={{ width: '100%', padding: '18px', background: loading || !f.company || !f.role ? 'rgba(200,168,75,0.3)' : '#C8A84B', border: 'none', cursor: loading || !f.company || !f.role ? 'not-allowed' : 'pointer', fontFamily: MONO, fontSize: 12, color: '#FAF7F2', letterSpacing: 3, transition: 'opacity .18s' }}
                onMouseEnter={e => { if (!loading && f.company && f.role) e.currentTarget.style.opacity = '.85' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          {loading ? 'SAVING...' : 'SAVE APPLICATION'}
        </button>
      </ModalShell>
  )
}

/* ── Edit Modal ── */
function EditModal({ app, onClose, onSave }) {
  var [f, setF] = useState({
    company:   app.company   || '',
    role:      app.role      || '',
    location:  app.location  || '',
    workSetup: app.workSetup || '',
    salaryMin: app.salaryMin != null ? String(app.salaryMin) : '',
    salaryMax: app.salaryMax != null ? String(app.salaryMax) : '',
    jobUrl:    app.jobUrl    || '',
    notes:     app.notes     || '',
    status:    app.status    || 'APPLIED',
  })
  var [loading, setLoading] = useState(false)
  function u(k, v) { setF(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!f.company || !f.role) return
    setLoading(true)
    try {
      await api.patch('/api/tracker/' + app.id, {
        company:   f.company,
        role:      f.role,
        location:  f.location  || null,
        workSetup: f.workSetup || null,
        salaryMin: f.salaryMin ? parseInt(f.salaryMin) : null,
        salaryMax: f.salaryMax ? parseInt(f.salaryMax) : null,
        jobUrl:    f.jobUrl    || null,
        notes:     f.notes     || null,
        status:    f.status,
      })
      onSave(); onClose()
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  return (
      <ModalShell tag="EDIT" title="APPLICATION" onClose={onClose}>
        <AppForm f={f} u={u} />
        <button onClick={save} disabled={loading || !f.company || !f.role}
                style={{ width: '100%', padding: '18px', background: loading || !f.company || !f.role ? 'rgba(200,168,75,0.3)' : '#C8A84B', border: 'none', cursor: loading || !f.company || !f.role ? 'not-allowed' : 'pointer', fontFamily: MONO, fontSize: 12, color: '#FAF7F2', letterSpacing: 3, transition: 'opacity .18s' }}
                onMouseEnter={e => { if (!loading && f.company && f.role) e.currentTarget.style.opacity = '.85' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </ModalShell>
  )
}

/* ── App Card ── */
function AppCard({ app, onStatusChange, onDelete, onEdit }) {
  var [open, setOpen] = useState(false)

  function openJob(e) {
    e.stopPropagation()
    var url = app.jobUrl; if (!url) return
    if (!url.startsWith('http')) url = 'https://' + url
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
      <div className="job-card"
           style={{ background: 'rgba(250,247,242,0.03)', border: '1px solid rgba(250,247,242,0.08)', borderLeft: '3px solid transparent', marginBottom: 6, transition: 'all .18s' }}
           onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#C8A84B'; e.currentTarget.style.background = 'rgba(250,247,242,0.06)' }}
           onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'rgba(250,247,242,0.03)' }}
      >
        {/* Always-visible top */}
        <div onClick={() => setOpen(!open)} style={{ padding: '18px 20px', cursor: 'pointer' }}>

          {/* Role + status dropdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 17, color: '#FAF7F2', letterSpacing: .5, lineHeight: 1.3 }}>{app.role}</div>
            <StatusDropdown appId={app.id} current={app.status} onChange={onStatusChange} />
          </div>

          {/* Company + location */}
          <div style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(250,247,242,0.38)', marginBottom: 10 }}>
            {app.company}{app.location ? ' · ' + app.location : ''}
          </div>

          {/* Setup + salary always visible */}
          {(app.workSetup || (app.salaryMin && app.salaryMax)) && (
              <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
                {app.workSetup && (
                    <div style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(250,247,242,0.45)' }}>
                      <span style={{ color: 'rgba(250,247,242,0.25)' }}>Setup: </span>{app.workSetup}
                    </div>
                )}
                {app.salaryMin && app.salaryMax && (
                    <div style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(250,247,242,0.45)' }}>
                      <span style={{ color: 'rgba(250,247,242,0.25)' }}>Salary: </span>
                      ₱{Number(app.salaryMin).toLocaleString()}–{Number(app.salaryMax).toLocaleString()}
                    </div>
                )}
              </div>
          )}

          <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(250,247,242,0.22)', letterSpacing: 1 }}>
            {open ? '▲ LESS' : '▼ MORE'}
          </div>
        </div>

        {/* Expanded section */}
        {open && (
            <div style={{ borderTop: '1px solid rgba(250,247,242,0.06)', padding: '16px 20px' }}>
              {app.notes && (
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(250,247,242,0.48)', lineHeight: 1.7, marginBottom: 14, padding: '10px 14px', background: 'rgba(250,247,242,0.03)', border: '1px solid rgba(250,247,242,0.05)' }}>
                    {app.notes}
                  </div>
              )}

              {/* Action buttons: EDIT | VIEW POST | REMOVE */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={e => { e.stopPropagation(); onEdit(app) }}
                        className="action-btn"
                        style={{ border: '1px solid rgba(200,168,75,0.25)', color: 'rgba(200,168,75,0.7)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#C8A84B'; e.currentTarget.style.borderColor = 'rgba(200,168,75,0.55)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,168,75,0.7)'; e.currentTarget.style.borderColor = 'rgba(200,168,75,0.25)' }}>
                  EDIT
                </button>

                {app.jobUrl && (
                    <button onClick={openJob}
                            className="action-btn"
                            style={{ border: '1px solid rgba(250,247,242,0.08)', color: 'rgba(250,247,242,0.5)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#FAF7F2'; e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,247,242,0.5)'; e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)' }}>
                      VIEW POST
                    </button>
                )}

                <button onClick={() => { if (window.confirm('Remove this application?')) onDelete(app.id) }}
                        className="action-btn"
                        style={{ border: '1px solid rgba(200,168,75,0.2)', color: 'rgba(200,168,75,0.6)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#C8A84B'; e.currentTarget.style.borderColor = 'rgba(200,168,75,0.5)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,168,75,0.6)'; e.currentTarget.style.borderColor = 'rgba(200,168,75,0.2)' }}>
                  REMOVE
                </button>
              </div>
            </div>
        )}
      </div>
  )
}

/* ── Page ── */
export default function JobTrackerPage() {
  var qc = useQueryClient()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  var { data: apps = [], isLoading } = useQuery({
    queryKey: ['tracker'],
    queryFn: async () => { var r = await api.get('/api/tracker'); return r.data }
  })
  var { data: stats = {} } = useQuery({
    queryKey: ['tracker-stats'],
    queryFn: async () => { var r = await api.get('/api/tracker/stats'); return r.data }
  })

  var [showAdd, setShowAdd] = useState(false)
  var [editApp, setEditApp] = useState(null)
  var [filter, setFilter]   = useState('ALL')

  var upd = useMutation({
    mutationFn: async p => api.patch('/api/tracker/' + p.id, { status: p.status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tracker'] }); qc.invalidateQueries({ queryKey: ['tracker-stats'] }) }
  })
  var del = useMutation({
    mutationFn: async id => api.delete('/api/tracker/' + id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tracker'] }); qc.invalidateQueries({ queryKey: ['tracker-stats'] }) }
  })

  function onSaved() {
    qc.invalidateQueries({ queryKey: ['tracker'] })
    qc.invalidateQueries({ queryKey: ['tracker-stats'] })
  }

  var filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  return (
      <PageLayout title="JOB TRACKER" subtitle="// TRACK EVERY APPLICATION">
        <style>{CSS}</style>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(250,247,242,0.05)', marginBottom: 22 }}>
          {[
            { l: 'TOTAL',     v: stats.total     || 0 },
            { l: 'APPLIED',   v: stats.applied   || 0 },
            { l: 'INTERVIEW', v: stats.interview  || 0 },
            { l: 'OFFERS',    v: stats.offer      || 0 },
            { l: 'ACCEPTED',  v: stats.accepted   || 0 },
            { l: 'REJECTED',  v: stats.rejected   || 0 },
          ].map(c => (
              <div key={c.l} style={{ padding: '16px 14px', background: '#0F2044' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(250,247,242,0.32)', letterSpacing: 2, marginBottom: 6 }}>{c.l}</div>
                <div style={{ fontFamily: MONO, fontSize: 26, color: '#FAF7F2', letterSpacing: '-1px' }}>{c.v}</div>
              </div>
          ))}
        </div>

        {/* Add button */}
        <button onClick={() => setShowAdd(true)}
                style={{ width: '100%', padding: '15px', background: '#C8A84B', border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: 12, color: '#FAF7F2', letterSpacing: 3, marginBottom: 16, transition: 'opacity .18s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          + ADD APPLICATION
        </button>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
          {['ALL', ...STATUSES.map(s => s.key)].map(key => {
            var active = filter === key
            var count = key === 'ALL' ? apps.length : apps.filter(a => a.status === key).length
            return (
                <button key={key} className="filter-btn"
                        style={{ borderColor: active ? '#C8A84B' : 'rgba(250,247,242,0.1)', color: active ? '#C8A84B' : 'rgba(250,247,242,0.3)' }}
                        onClick={() => setFilter(key)}>
                  {key === 'ALL' ? 'ALL' : gs(key).label.toUpperCase()}{count > 0 ? ` (${count})` : ''}
                </button>
            )
          })}
        </div>

        {/* List */}
        {isLoading && (
            <div style={{ border: '1px solid rgba(250,247,242,0.05)', padding: 32, textAlign: 'center', fontFamily: MONO, fontSize: 13, color: 'rgba(250,247,242,0.28)', letterSpacing: 2 }}>
              LOADING...
            </div>
        )}

        {!isLoading && filtered.length === 0 && (
            <div style={{ border: '1px solid rgba(250,247,242,0.05)', padding: 40, textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 14, color: 'rgba(250,247,242,0.42)', letterSpacing: 1, marginBottom: 8 }}>
                {filter === 'ALL' ? 'NO APPLICATIONS YET' : 'NO ' + gs(filter).label.toUpperCase() + ' APPLICATIONS'}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(250,247,242,0.28)' }}>
                {filter === 'ALL' ? 'Tap "+ Add Application" to start tracking.' : 'Try a different filter above.'}
              </div>
            </div>
        )}

        {!isLoading && filtered.length > 0 && (
            <div>
              {filtered.map(app => (
                  <AppCard key={app.id} app={app}
                           onStatusChange={(id, status) => upd.mutate({ id, status })}
                           onDelete={id => del.mutate(id)}
                           onEdit={app => setEditApp(app)} />
              ))}
            </div>
        )}

        {/* Modals */}
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={onSaved} />}
        {editApp  && <EditModal app={editApp} onClose={() => setEditApp(null)} onSave={onSaved} />}
      </PageLayout>
  )
}