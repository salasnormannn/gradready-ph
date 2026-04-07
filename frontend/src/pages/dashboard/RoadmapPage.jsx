import { useState, useEffect } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useRoadmap, useRoadmapProgress, useToggleRoadmapItem } from '../../hooks/useRoadmap'

const MONO = 'Share Tech Mono, monospace'

const CSS = `
  .task-row { transition: all .18s; }
  .task-row:hover { background: rgba(240,237,232,0.06) !important; }
  .task-row:hover .task-title { color: #F0EDE8 !important; }
  .week-btn { transition: all .18s; }
  .week-btn:hover { background: rgba(240,237,232,0.06) !important; }

  @keyframes rm-drift-a { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(4deg)} }
  @keyframes rm-drift-b { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-5deg)} }
  @keyframes rm-pulse   { 0%,100%{opacity:0.10} 50%{opacity:0.20} }
  @keyframes rm-scan    { from{top:-2px} to{top:100%} }

  .rm-bg {
    position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden;
  }
  .rm-page-wrap { position:relative; z-index:1; }
`

// Category config — matches the original
var CAT = {
  government: { label: 'GOV',     color: '#34D399' },
  career:     { label: 'CAREER',  color: '#60A5FA' },
  finance:    { label: 'FINANCE', color: '#C8A84B' },
  board_exam: { label: 'BOARD',   color: '#F97316' },
}

function getCat(category) {
  return CAT[category] || CAT.government
}

// ─── Single task row ───────────────────────────────────────────────────────────
function TaskRow({ item, onToggle, isPending }) {
  var [open, setOpen] = useState(false)
  var cat = getCat(item.category)

  return (
      <div className="task-row" onClick={function() { setOpen(!open) }}
           style={{
             borderBottom: '1px solid rgba(240,237,232,0.05)',
             borderLeft: '2px solid ' + (item.completed ? cat.color : 'transparent'),
             background: 'transparent',
             cursor: 'pointer',
             transition: 'all .18s',
           }}>

        <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'13px 14px' }}>
          {/* Checkbox */}
          <button
              onClick={function(e) { e.stopPropagation(); onToggle(item.id) }}
              disabled={isPending}
              style={{
                width:20, height:20, flexShrink:0, marginTop:1,
                border:'1px solid', borderColor: item.completed ? cat.color : 'rgba(240,237,232,0.2)',
                background: item.completed ? cat.color : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor: isPending ? 'not-allowed' : 'pointer',
                transition:'all .2s', padding:0,
              }}>
            {item.completed && <span style={{ color:'#F0EDE8', fontSize:11, lineHeight:1 }}>✓</span>}
          </button>

          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
              <div className="task-title" style={{
                fontFamily:MONO, fontSize:13,
                color: item.completed ? 'rgba(240,237,232,0.32)' : 'rgba(240,237,232,0.82)',
                letterSpacing:.3, lineHeight:1.45,
                textDecoration: item.completed ? 'line-through' : 'none',
                transition:'color .18s',
              }}>
                {item.title}
              </div>
              {/* Category badge */}
              <span style={{
                fontFamily:MONO, fontSize:8, letterSpacing:1,
                padding:'2px 7px',
                border:'1px solid ' + cat.color + '55',
                color: cat.color,
                flexShrink:0,
              }}>
              {cat.label}
            </span>
            </div>

            {/* Expanded description */}
            {open && item.description && (
                <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(240,237,232,0.45)', lineHeight:1.7, marginTop:8 }}>
                  {item.description}
                </div>
            )}

            {/* Completed date */}
            {open && item.completedAt && (
                <div style={{ fontFamily:MONO, fontSize:9, color:'#34D399', letterSpacing:1, marginTop:6 }}>
                  ✓ COMPLETED {new Date(item.completedAt).toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }).toUpperCase()}
                </div>
            )}
          </div>

          <span style={{ fontFamily:MONO, fontSize:15, color:'rgba(240,237,232,0.28)', flexShrink:0, marginTop:1 }}>
          {open ? '∨' : '›'}
        </span>
        </div>
      </div>
  )
}

// ─── Week block ────────────────────────────────────────────────────────────────
function WeekBlock({ weekLabel, items, onToggle, isPending }) {
  var [open, setOpen] = useState(true)
  var done  = items.filter(function(i) { return i.completed }).length
  var total = items.length
  var pct   = total > 0 ? Math.round((done / total) * 100) : 0
  var allDone = done === total && total > 0

  return (
      <div style={{ marginBottom:1 }}>
        {/* Week header button */}
        <button className="week-btn" onClick={function() { setOpen(!open) }} style={{
          width:'100%', padding:'13px 14px',
          background:'rgba(240,237,232,0.05)',
          border:'1px solid rgba(240,237,232,0.07)',
          cursor:'pointer', display:'flex', alignItems:'center', gap:12, textAlign:'left',
        }}>
          {/* Week number badge */}
          <div style={{
            width:34, height:34, flexShrink:0,
            background: allDone ? '#BE473D' : 'rgba(190,71,61,0.12)',
            border:'1px solid', borderColor: allDone ? '#BE473D' : 'rgba(190,71,61,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:MONO, fontSize:9,
            color: allDone ? '#F0EDE8' : '#BE473D',
            transition:'all .2s',
          }}>
            {weekLabel.replace('Week ','W').padStart(3,'0')}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:MONO, fontSize:13, color: allDone ? '#BE473D' : 'rgba(240,237,232,0.72)', letterSpacing:.5, marginBottom:5 }}>
              {weekLabel.toUpperCase()}
            </div>
            {/* Progress bar */}
            <div style={{ height:1, background:'rgba(240,237,232,0.07)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, width:pct+'%', background:'#BE473D', transition:'width .6s cubic-bezier(.16,1,.3,1)' }} />
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontFamily:MONO, fontSize:11, color:'rgba(240,237,232,0.38)', letterSpacing:1 }}>{done}/{total}</span>
            <span style={{ fontFamily:MONO, fontSize:16, color:'rgba(240,237,232,0.28)' }}>{open?'∨':'›'}</span>
          </div>
        </button>

        {/* Task rows */}
        {open && (
            <div style={{ border:'1px solid rgba(240,237,232,0.07)', borderTop:'none' }}>
              {items.map(function(item) {
                return (
                    <TaskRow key={item.id} item={item} onToggle={onToggle} isPending={isPending} />
                )
              })}
            </div>
        )}
      </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  // ✅ Exact same hooks as the original file
  var { data: items, isLoading } = useRoadmap()
  var { data: progress } = useRoadmapProgress()
  var toggleResult = useToggleRoadmapItem()
  var toggle    = toggleResult.mutate
  var isPending = toggleResult.isPending

  useEffect(function(){ window.scrollTo(0, 0) }, [])

  var pct       = progress?.percentage ?? 0
  var completed = progress?.completed  ?? 0
  var total     = progress?.total      ?? 0

  // Group by weekNumber — same as original (item.weekNumber)
  var grouped = {}
  if (items && items.length > 0) {
    items.forEach(function(item) {
      var key = 'Week ' + item.weekNumber
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(item)
    })
  }

  // Sort week keys numerically
  var weekKeys = Object.keys(grouped).sort(function(a, b) {
    return parseInt(a.replace('Week ','')) - parseInt(b.replace('Week ',''))
  })

  return (
      <PageLayout title="MY ROADMAP" subtitle="// WEEK-BY-WEEK JOURNEY">
        <style>{CSS}</style>

        {/* ── Background layer ── */}
        <div className="rm-bg" aria-hidden="true">
          {/* Main center glow */}
          <div style={{position:'absolute',top:'15%',left:'50%',transform:'translateX(-50%)',width:'min(90vw,560px)',height:'min(90vw,560px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.13) 0%,rgba(190,71,61,0.04) 42%,transparent 70%)',animation:'rm-pulse 7s ease-in-out infinite'}}/>
          {/* Gold accent top-right */}
          <div style={{position:'absolute',top:'-8%',right:'-6%',width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(200,138,75,0.07) 0%,transparent 65%)',animation:'rm-pulse 10s ease-in-out infinite 1s'}}/>
          {/* Bottom accent */}
          <div style={{position:'absolute',bottom:'5%',left:'-6%',width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.06) 0%,transparent 65%)'}}/>
          {/* Floating squares */}
          <div style={{position:'absolute',top:'7%',right:'5%',width:38,height:38,border:'1px solid rgba(190,71,61,0.16)',transform:'rotate(45deg)',animation:'rm-drift-a 12s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'55%',right:'2%',width:22,height:22,border:'1px solid rgba(200,138,75,0.14)',transform:'rotate(30deg)',animation:'rm-drift-b 9s ease-in-out infinite 2s'}}/>
          <div style={{position:'absolute',bottom:'18%',left:'3%',width:30,height:30,border:'1px solid rgba(240,237,232,0.07)',transform:'rotate(15deg)',animation:'rm-drift-a 14s ease-in-out infinite 1s'}}/>
          {/* Corner brackets */}
          <div style={{position:'absolute',top:16,left:16,width:28,height:28,borderTop:'1px solid rgba(190,71,61,0.2)',borderLeft:'1px solid rgba(190,71,61,0.2)'}}/>
          <div style={{position:'absolute',bottom:16,right:16,width:28,height:28,borderBottom:'1px solid rgba(190,71,61,0.2)',borderRight:'1px solid rgba(190,71,61,0.2)'}}/>
          {/* Horizontal rule lines */}
          <div style={{position:'absolute',top:'28%',left:0,width:'30%',height:1,background:'linear-gradient(90deg,rgba(190,71,61,0.1),transparent)',transform:'rotate(-6deg)',transformOrigin:'left'}}/>
          <div style={{position:'absolute',bottom:'28%',right:0,width:'25%',height:1,background:'linear-gradient(270deg,rgba(190,71,61,0.08),transparent)',transform:'rotate(6deg)',transformOrigin:'right'}}/>
          {/* Vertical tick marks */}
          {[18,34,50,66,82].map(function(p,i){return <div key={i} style={{position:'absolute',left:'50%',top:p+'%',width:1,height:6,background:'rgba(190,71,61,0.12)',transform:'translateX(-50%)'}}/>})}
          {/* Ambient binary */}
          <div style={{position:'absolute',top:'10%',left:'2%',fontFamily:'monospace',fontSize:8,color:'rgba(240,237,232,0.05)',letterSpacing:2,lineHeight:2,userSelect:'none'}}>{'01110010\n00101101\n10011010'}</div>
          <div style={{position:'absolute',bottom:'12%',right:'2%',fontFamily:'monospace',fontSize:8,color:'rgba(240,237,232,0.04)',letterSpacing:2,lineHeight:2,userSelect:'none',textAlign:'right'}}>{'11001010\n00110101'}</div>
          {/* Scanline */}
          <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.08),transparent)',animation:'rm-scan 14s linear infinite'}}/>
        </div>

        <div className="rm-page-wrap">
          {/* Progress overview */}
          <div style={{ padding:'16px', border:'1px solid rgba(240,237,232,0.07)', background:'rgba(30,4,15,0.6)', marginBottom:20, position:'relative', overflow:'hidden', backdropFilter:'blur(2px)' }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1, background:'rgba(240,237,232,0.05)', marginBottom:14 }}>
              {[
                { l:'COMPLETED',  v: completed },
                { l:'REMAINING',  v: total - completed },
                { l:'PROGRESS',   v: pct + '%' },
              ].map(function(s) {
                return (
                    <div key={s.l} style={{ padding:'12px', background:'#3C091E' }}>
                      <div style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.32)', letterSpacing:2, marginBottom:4 }}>{s.l}</div>
                      <div style={{ fontFamily:MONO, fontSize:20, color:'#F0EDE8', letterSpacing:'-1px' }}>{s.v}</div>
                    </div>
                )
              })}
            </div>

            {/* Progress bar */}
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.3)', letterSpacing:2 }}>// OVERALL PROGRESS</span>
              <span style={{ fontFamily:MONO, fontSize:9, color:'#BE473D' }}>{pct}%</span>
            </div>
            <div style={{ height:2, background:'rgba(240,237,232,0.07)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, width:pct+'%', background:'linear-gradient(90deg,#BE473D,#C8A84B)', boxShadow:'0 0 10px rgba(190,71,61,0.7)', transition:'width .8s cubic-bezier(.16,1,.3,1)' }} />
            </div>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                {[1,2,3,4,5,6].map(function(i) {
                  return (
                      <div key={i} style={{ height:52, background:'rgba(240,237,232,0.05)', opacity:.6 - i * 0.05 }} />
                  )
                })}
              </div>
          )}

          {/* Empty state */}
          {!isLoading && weekKeys.length === 0 && (
              <div style={{ border:'1px solid rgba(240,237,232,0.07)', padding:32, textAlign:'center' }}>
                <div style={{ fontFamily:MONO, fontSize:10, color:'rgba(240,237,232,0.3)', letterSpacing:1, marginBottom:6 }}>NO ROADMAP YET</div>
                <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(240,237,232,0.18)', lineHeight:1.6 }}>
                  Complete your profile to generate a personalized roadmap.
                </div>
              </div>
          )}

          {/* Week blocks */}
          {!isLoading && weekKeys.length > 0 && (
              <div>
                {weekKeys.map(function(weekLabel) {
                  return (
                      <WeekBlock
                          key={weekLabel}
                          weekLabel={weekLabel}
                          items={grouped[weekLabel]}
                          onToggle={toggle}
                          isPending={isPending}
                      />
                  )
                })}
              </div>
          )}
        </div>
      </PageLayout>
  )
}