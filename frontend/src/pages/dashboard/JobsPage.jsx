import {useEffect, useState} from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../../hooks/useJobs'

const MONO = 'Inter, sans-serif'

const CSS = `
  .job-row { transition: all .18s; border-left: 2px solid transparent; }
  .job-row:hover { background: rgba(250,247,242,0.06) !important; border-left-color: #C8A84B !important; }
  .job-row:hover .job-title { color: #FAF7F2 !important; }
  .site-card { transition: all .22s; border-top: 2px solid transparent; }
  .site-card:hover { background: rgba(250,247,242,0.06) !important; }
  .cta-gold:hover { background: rgba(200,168,75,0.14) !important; }
  .cta-ghost:hover { border-color: rgba(250,247,242,0.35) !important; color: #FAF7F2 !important; }
  input::placeholder, textarea::placeholder { color: rgba(250,247,242,0.2); }
  input:focus, textarea:focus { outline: none; border-color: rgba(200,168,75,0.5) !important; }
`

var JOB_SITES = [
    { name:'KALIBRR',    desc:'Best for fresh grads',   url:'https://kalibrr.com',          accent:'#8E44AD' },
    { name:'JOBSTREET',  desc:'Largest PH board',        url:'https://jobstreet.com.ph',     accent:'#60A5FA' },
    { name:'LINKEDIN',   desc:'Corporate network',       url:'https://linkedin.com/jobs',    accent:'#0e76a8' },
    { name:'INDEED PH',  desc:'High volume',             url:'https://ph.indeed.com',        accent:'#34D399' },
    { name:'ONLINEJOBS', desc:'Remote / freelance',      url:'https://onlinejobs.ph',        accent:'#C8A84B' },
    { name:'BOSSJOB',    desc:'BPO and entry-level',     url:'https://bossjob.ph',           accent:'#C8A84B' },
]

function matchColor(score) {
    if (!score) return 'rgba(250,247,242,0.2)'
    if (score >= 85) return '#34D399'
    if (score >= 70) return '#C8A84B'
    return 'rgba(250,247,242,0.3)'
}

// ─── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job, navigate }) {
    var initial = job.company ? job.company.charAt(0).toUpperCase() : 'J'
    var mc = matchColor(job.fitScore)

    return (
        <div className="job-row" style={{ background:'transparent', padding:'16px 14px 16px 16px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
                {/* Company initial */}
                <div style={{ width:34, height:34, flexShrink:0, background:'rgba(200,168,75,0.12)', border:'1px solid rgba(200,168,75,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:MONO, fontSize:14, color:'#C8A84B' }}>
                    {initial}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                            <div className="job-title" style={{ fontFamily:MONO, fontSize:14, color:'rgba(250,247,242,0.85)', letterSpacing:.4, marginBottom:3, transition:'color .18s' }}>
                                {job.title}
                            </div>
                            <div style={{ fontFamily:'monospace', fontSize:11, color:'rgba(250,247,242,0.42)' }}>
                                {job.company}{job.location ? ' · ' + job.location : ''}
                            </div>
                        </div>
                        {/* Fit score */}
                        {job.fitScore != null && (
                            <div style={{ textAlign:'right', flexShrink:0 }}>
                                <div style={{ fontFamily:MONO, fontSize:18, color:mc, letterSpacing:'-1px', lineHeight:1 }}>{job.fitScore}</div>
                                <div style={{ fontFamily:MONO, fontSize:8, color:'rgba(250,247,242,0.32)', letterSpacing:1 }}>MATCH%</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                {job.employmentType && (
                    <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(250,247,242,0.42)', padding:'3px 8px', border:'1px solid rgba(250,247,242,0.1)', letterSpacing:.5 }}>{job.employmentType}</span>
                )}
                {job.salaryMin && job.salaryMax && (
                    <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(250,247,242,0.42)', padding:'3px 8px', border:'1px solid rgba(250,247,242,0.1)', letterSpacing:.5 }}>
            ₱{Number(job.salaryMin).toLocaleString()} – ₱{Number(job.salaryMax).toLocaleString()}
          </span>
                )}
            </div>

            {/* Description snippet */}
            {job.description && (
                <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(250,247,242,0.42)', lineHeight:1.7, marginBottom:12 }}>
                    {job.description.substring(0, 110)}...
                </div>
            )}

            {/* Action buttons */}
            <div style={{ display:'flex', gap:8 }}>
                <button className="cta-gold"
                        onClick={function() { navigate('/dashboard/chat', { state: { initialMessage: 'Write a short cover letter (3 paragraphs, under 200 words) for ' + job.title + ' at ' + job.company + '.' } }) }}
                        style={{ flex:1, background:'rgba(200,168,75,0.07)', border:'1px solid rgba(200,168,75,0.28)', color:'#C8A84B', padding:'9px', fontFamily:MONO, fontSize:9, letterSpacing:1.5, cursor:'pointer', transition:'all .18s' }}>
                    COVER LETTER
                </button>
                {job.applyLink && (
                    <button className="cta-ghost"
                            onClick={function() { window.open(job.applyLink, '_blank', 'noopener,noreferrer') }}
                            style={{ flex:1, background:'transparent', border:'1px solid rgba(250,247,242,0.1)', color:'rgba(250,247,242,0.4)', padding:'9px', fontFamily:MONO, fontSize:9, letterSpacing:1.5, cursor:'pointer', transition:'all .18s' }}>
                        APPLY NOW
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <div style={{ padding:'16px 14px', display:'flex', gap:12, alignItems:'flex-start', borderBottom:'1px solid rgba(250,247,242,0.05)' }}>
            <div style={{ width:34, height:34, background:'rgba(250,247,242,0.04)', flexShrink:0 }} />
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
                <div style={{ height:11, background:'rgba(250,247,242,0.04)', width:'58%' }} />
                <div style={{ height:9,  background:'rgba(250,247,242,0.03)', width:'38%' }} />
                <div style={{ height:9,  background:'rgba(250,247,242,0.025)', width:'90%', marginTop:4 }} />
            </div>
        </div>
    )
}

// ─── Red flag checker ──────────────────────────────────────────────────────────
function RedFlagChecker({ navigate }) {
    var [mode, setMode]   = useState('text')
    var [value, setValue] = useState('')

    function handleCheck() {
        if (!value.trim()) return
        var isUrl = value.trim().startsWith('http')
        var msg = isUrl
            ? 'Can you check this job posting for red flags? Link: ' + value.trim() + '. List red flags and green flags, and give an overall verdict.'
            : 'Can you check this job posting for red flags?\n\n' + value.trim() + '\n\nList any red flags, green flags, and give an overall assessment.'
        navigate('/dashboard/chat', { state: { initialMessage: msg } })
    }

    return (
        <div style={{ border:'1px solid rgba(200,168,75,0.22)', background:'rgba(200,168,75,0.04)', padding:'20px' }}>

            {/* Header */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(200,168,75,0.3)', marginBottom:10 }}>
                <span style={{ fontSize:11, color:'#C8A84B' }}>⚠</span>
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:2, color:'rgba(250,247,242,0.62)' }}>RED FLAG CHECKER</span>
            </div>

            <p style={{ fontFamily:'monospace', fontSize:12, color:'rgba(250,247,242,0.48)', lineHeight:1.75, marginBottom:16 }}>
                Paste a job posting URL or the full job description — Kuya AI will identify red flags, suspicious requirements, and salary law violations.
            </p>

            {/* Mode toggle */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'rgba(250,247,242,0.05)', marginBottom:14 }}>
                {[['text','PASTE JOB TEXT'],['url','PASTE JOB URL']].map(function(m) {
                    var active = mode === m[0]
                    return (
                        <button key={m[0]} onClick={function() { setMode(m[0]); setValue('') }}
                                style={{ padding:'10px', background:active?'#C8A84B':'transparent', border:'none', color:active?'#FAF7F2':'rgba(250,247,242,0.45)', fontFamily:MONO, fontSize:10, letterSpacing:1.5, cursor:'pointer', transition:'all .18s' }}>
                            {m[1]}
                        </button>
                    )
                })}
            </div>

            {/* Input area */}
            {mode === 'text' ? (
                <textarea value={value} onChange={function(e) { setValue(e.target.value) }}
                          placeholder="Paste the full job posting here..."
                          rows={4}
                          style={{ width:'100%', background:'rgba(250,247,242,0.05)', border:'1px solid rgba(250,247,242,0.1)', color:'#FAF7F2', padding:'12px 14px', fontFamily:'monospace', fontSize:11, outline:'none', resize:'none', marginBottom:12, letterSpacing:.3, transition:'border-color .18s', boxSizing:'border-box' }}
                          onFocus={function(e) { e.currentTarget.style.borderColor='rgba(200,168,75,0.5)' }}
                          onBlur={function(e) { e.currentTarget.style.borderColor='rgba(250,247,242,0.1)' }} />
            ) : (
                <input type="url" value={value} onChange={function(e) { setValue(e.target.value) }}
                       placeholder="https://www.jobstreet.com.ph/job/..."
                       style={{ width:'100%', background:'rgba(250,247,242,0.05)', border:'1px solid rgba(250,247,242,0.1)', color:'#FAF7F2', padding:'12px 14px', fontFamily:MONO, fontSize:11, outline:'none', marginBottom:12, letterSpacing:.5, transition:'border-color .18s', boxSizing:'border-box' }}
                       onFocus={function(e) { e.currentTarget.style.borderColor='rgba(200,168,75,0.5)' }}
                       onBlur={function(e) { e.currentTarget.style.borderColor='rgba(250,247,242,0.1)' }} />
            )}

            {/* Check button */}
            <button onClick={handleCheck} disabled={!value.trim()}
                    style={{ width:'100%', padding:'14px', background:value.trim()?'#C8A84B':'rgba(200,168,75,0.3)', border:'none', color:'#FAF7F2', fontFamily:MONO, fontSize:10, letterSpacing:3, cursor:value.trim()?'pointer':'not-allowed', transition:'opacity .18s' }}
                    onMouseEnter={function(e) { if (value.trim()) e.currentTarget.style.opacity='.85' }}
                    onMouseLeave={function(e) { e.currentTarget.style.opacity='1' }}>
                CHECK FOR RED FLAGS WITH KUYA AI
            </button>
        </div>
    )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function JobsPage() {
    var navigate = useNavigate()
    var [searchInput, setSearchInput] = useState('')
    var [activeQuery, setActiveQuery] = useState('')
    var { data, isLoading, isError } = useJobs(activeQuery)
    var jobs = data?.jobs || []

    useEffect(function(){ window.scrollTo(0, 0) }, [])

    function handleSearch(e) {
        e.preventDefault()
        setActiveQuery(searchInput.trim())
    }

    return (
        <PageLayout title="JOB SEARCH" subtitle="// AI-MATCHED OPENINGS">
            <style>{CSS}</style>

            {/* ── TOP JOB SITES ── */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(250,247,242,0.1)', marginBottom:14 }}>
                <span style={{ fontSize:11, color:'#C8A84B' }}>01</span>
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:2.5, color:'rgba(250,247,242,0.5)' }}>TOP JOB SITES</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(250,247,242,0.05)', marginBottom:24 }}>
                {JOB_SITES.map(function(site) {
                    return (
                        <a key={site.name} href={site.url} target="_blank" rel="noreferrer" className="site-card"
                           style={{ display:'block', background:'#0F2044', padding:'14px 12px', textDecoration:'none',
                               borderTop:'2px solid transparent', transition:'all .22s' }}
                           onMouseEnter={function(e) { e.currentTarget.style.borderTopColor=site.accent; e.currentTarget.style.background='rgba(250,247,242,0.04)' }}
                           onMouseLeave={function(e) { e.currentTarget.style.borderTopColor='transparent'; e.currentTarget.style.background='#0F2044' }}>
                            <div style={{ fontFamily:MONO, fontSize:12, color:'#FAF7F2', letterSpacing:.5, marginBottom:5 }}>{site.name}</div>
                            <div style={{ fontFamily:'monospace', fontSize:11, color:'rgba(250,247,242,0.42)' }}>{site.desc}</div>
                        </a>
                    )
                })}
            </div>

            {/* ── SEARCH BAR ── */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(250,247,242,0.1)', marginBottom:12 }}>
                <span style={{ fontSize:11, color:'#C8A84B' }}>02</span>
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:2.5, color:'rgba(250,247,242,0.5)' }}>SEARCH JOBS</span>
            </div>

            <form onSubmit={handleSearch} style={{ display:'flex', gap:1, marginBottom:24 }}>
                <input type="text" value={searchInput}
                       onChange={function(e) { setSearchInput(e.target.value) }}
                       placeholder="e.g. nurse Metro Manila, software engineer Cebu..."
                       style={{ flex:1, background:'rgba(250,247,242,0.05)', border:'1px solid rgba(250,247,242,0.1)', color:'#FAF7F2', padding:'12px 14px', fontFamily:MONO, fontSize:11, letterSpacing:.5, transition:'border-color .18s' }}
                       onFocus={function(e) { e.currentTarget.style.borderColor='rgba(200,168,75,0.5)' }}
                       onBlur={function(e) { e.currentTarget.style.borderColor='rgba(250,247,242,0.1)' }} />
                <button type="submit"
                        style={{ background:'#C8A84B', border:'none', color:'#FAF7F2', padding:'0 20px', fontFamily:MONO, fontSize:10, letterSpacing:2, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap', transition:'opacity .18s' }}
                        onMouseEnter={function(e) { e.currentTarget.style.opacity='.85' }}
                        onMouseLeave={function(e) { e.currentTarget.style.opacity='1' }}>
                    SEARCH
                </button>
            </form>

            {/* ── RESULTS ── */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(250,247,242,0.1)', marginBottom:14 }}>
                <span style={{ fontSize:11, color:'#C8A84B' }}>03</span>
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:2.5, color:'rgba(250,247,242,0.5)' }}>
          {activeQuery ? 'RESULTS FOR "' + activeQuery.toUpperCase() + '"' : 'AI MATCHES FOR YOU'}
        </span>
            </div>

            {/* Loading */}
            {isLoading && (
                <div style={{ border:'1px solid rgba(250,247,242,0.07)', borderBottom:'none', marginBottom:24 }}>
                    {[1,2,3].map(function(i) { return <SkeletonRow key={i} /> })}
                </div>
            )}

            {/* Error */}
            {isError && (
                <div style={{ border:'1px solid rgba(200,168,75,0.22)', background:'rgba(200,168,75,0.05)', padding:'16px', marginBottom:24 }}>
                    <div style={{ fontFamily:MONO, fontSize:11, color:'#C8A84B', letterSpacing:1, marginBottom:4 }}>COULD NOT LOAD JOBS</div>
                    <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(250,247,242,0.45)' }}>Make sure the backend is running and try again.</div>
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && jobs.length === 0 && (
                <div style={{ border:'1px solid rgba(250,247,242,0.06)', padding:32, textAlign:'center', marginBottom:24 }}>
                    <div style={{ fontFamily:MONO, fontSize:11, color:'rgba(250,247,242,0.38)', letterSpacing:1, marginBottom:6 }}>NO JOBS FOUND</div>
                    <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(250,247,242,0.28)' }}>Try a different search or check back later.</div>
                </div>
            )}

            {/* Job list */}
            {!isLoading && !isError && jobs.length > 0 && (
                <div style={{ border:'1px solid rgba(250,247,242,0.07)', borderBottom:'none', marginBottom:24 }}>
                    {jobs.map(function(job) {
                        return <JobCard key={job.id} job={job} navigate={navigate} />
                    })}
                </div>
            )}

            {/* ── RED FLAG CHECKER ── */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(250,247,242,0.1)', marginBottom:14 }}>
                <span style={{ fontSize:11, color:'#C8A84B' }}>04</span>
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:2.5, color:'rgba(250,247,242,0.5)' }}>RED FLAG CHECKER</span>
            </div>

            <RedFlagChecker navigate={navigate} />

        </PageLayout>
    )
}