import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../services/api'
import useAuthStore from '../../store/authStore'

const MONO = 'Share Tech Mono, monospace'

const COURSES = [
  'BS Computer Science', 'BS Information Technology', 'BS Computer Engineering',
  'BS Nursing', 'BS Accountancy', 'BS Business Administration',
  'BS Civil Engineering', 'BS Electrical Engineering', 'BS Mechanical Engineering',
  'BS Chemical Engineering', 'BS Electronics Engineering',
  'BS Architecture', 'AB Communication', 'BS Education',
  'BS Psychology', 'BS Medicine', 'BS Pharmacy',
  'BS Criminology', 'BS Physical Therapy', 'BS Medical Technology', 'Other',
]

const REGIONS = [
  'NCR (Metro Manila)', 'Region I (Ilocos)', 'Region II (Cagayan Valley)',
  'Region III (Central Luzon)', 'Region IV-A (CALABARZON)', 'Region IV-B (MIMAROPA)',
  'Region V (Bicol)', 'Region VI (Western Visayas)', 'Region VII (Central Visayas)',
  'Region VIII (Eastern Visayas)', 'Region IX (Zamboanga Peninsula)',
  'Region X (Northern Mindanao)', 'Region XI (Davao)', 'Region XII (SOCCSKSARGEN)',
  'Region XIII (Caraga)', 'BARMM', 'CAR',
]

const STATUSES = [
  { value: 'job_hunting',     label: 'JOB HUNTING',      desc: 'Looking for my first or next role',        icon: '◉', n: '01' },
  { value: 'employed',        label: 'EMPLOYED',          desc: 'I just started or am already working',     icon: '◈', n: '02' },
  { value: 'freelancing',     label: 'FREELANCING',       desc: 'Self-employed or doing gig work',          icon: '◎', n: '03' },
  { value: 'board_exam',      label: 'BOARD EXAM PREP',   desc: 'Preparing for my PRC licensure exam',      icon: '✚', n: '04' },
  { value: 'further_studies', label: 'FURTHER STUDIES',   desc: 'Taking up graduate school or review',      icon: '✦', n: '05' },
]

const STEPS = ['COURSE', 'SCHOOL', 'REGION', 'STATUS', 'REVIEW']

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { background:#3C091E; overflow-x:hidden; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#BE473D; }
  ::selection { background:rgba(190,71,61,0.35); }

  @keyframes scan   { from{top:-2px} to{top:100%} }
  @keyframes pulse  { 0%,100%{opacity:0.12} 50%{opacity:0.22} }
  @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(4deg)} }
  @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-3deg)} }
  @keyframes stepIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .step-wrap { animation: stepIn .45s cubic-bezier(.16,1,.3,1) both; }

  .opt-row {
    width:100%; text-align:left;
    background:rgba(240,237,232,0.02);
    border:1px solid rgba(240,237,232,0.07);
    border-left:2px solid transparent;
    color:rgba(240,237,232,0.55);
    padding:13px 16px;
    font-family:Share Tech Mono,monospace;
    font-size:11px;
    letter-spacing:.5px;
    cursor:pointer;
    transition:all .18s;
    display:flex; align-items:center; gap:12px;
  }
  .opt-row:hover {
    border-color:rgba(190,71,61,0.35);
    border-left-color:#BE473D;
    color:#F0EDE8;
    background:rgba(190,71,61,0.05);
  }
  .opt-row.sel {
    border-color:rgba(190,71,61,0.5);
    border-left-color:#BE473D;
    background:rgba(190,71,61,0.08);
    color:#F0EDE8;
  }

  .txt-input {
    width:100%;
    background:rgba(240,237,232,0.03);
    border:1px solid rgba(240,237,232,0.1);
    border-left:2px solid rgba(190,71,61,0.3);
    color:#F0EDE8;
    padding:13px 16px;
    font-family:Share Tech Mono,monospace;
    font-size:12px;
    letter-spacing:.5px;
    outline:none;
    transition:border-color .2s;
  }
  .txt-input::placeholder { color:rgba(240,237,232,0.2); }
  .txt-input:focus {
    border-color:rgba(190,71,61,0.6);
    border-left-color:#BE473D;
    background:rgba(190,71,61,0.04);
  }

  .nav-btn-back {
    background:transparent;
    border:1px solid rgba(240,237,232,0.1);
    color:rgba(240,237,232,0.35);
    padding:12px 24px;
    font-family:Share Tech Mono,monospace;
    font-size:10px;
    letter-spacing:2px;
    cursor:pointer;
    transition:all .2s;
  }
  .nav-btn-back:hover:not(:disabled) { border-color:rgba(240,237,232,0.3); color:rgba(240,237,232,0.7); }

  .nav-btn-next {
    background:#BE473D;
    border:none;
    color:#F0EDE8;
    padding:12px 32px;
    font-family:Share Tech Mono,monospace;
    font-size:10px;
    letter-spacing:2px;
    cursor:pointer;
    transition:all .2s;
  }
  .nav-btn-next:hover:not(:disabled) { background:#D4534A; }
  .nav-btn-next:disabled { background:rgba(190,71,61,0.25); color:rgba(240,237,232,0.3); cursor:not-allowed; }

  .review-row {
    display:flex;
    align-items:flex-start;
    padding:13px 16px;
    border-bottom:1px solid rgba(240,237,232,0.05);
    gap:16px;
  }
  .review-row:last-child { border-bottom:none; }

  .list-scroll {
    max-height:420px;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    gap:5px;
  }
`

function Bg() {
  return (
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.025) 1px,transparent 1px)', backgroundSize:'52px 52px' }} />
        <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:'min(90vw,560px)', height:'min(90vw,560px)', borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.13) 0%,rgba(190,71,61,0.03) 45%,transparent 70%)', animation:'pulse 7s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:'-5%', right:'-5%', width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(200,138,75,0.07) 0%,transparent 65%)', animation:'pulse 10s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:'10%', right:'7%', width:40, height:40, border:'1px solid rgba(190,71,61,0.2)', transform:'rotate(45deg)', animation:'floatA 11s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'22%', left:'4%', width:24, height:24, border:'1px solid rgba(240,237,232,0.07)', transform:'rotate(45deg)', animation:'floatB 8s ease-in-out infinite 1s' }} />
        <div style={{ position:'absolute', top:16, left:16, width:28, height:28, borderTop:'1px solid rgba(190,71,61,0.22)', borderLeft:'1px solid rgba(190,71,61,0.22)' }} />
        <div style={{ position:'absolute', top:16, right:16, width:28, height:28, borderTop:'1px solid rgba(190,71,61,0.22)', borderRight:'1px solid rgba(190,71,61,0.22)' }} />
        <div style={{ position:'absolute', bottom:16, left:16, width:28, height:28, borderBottom:'1px solid rgba(190,71,61,0.22)', borderLeft:'1px solid rgba(190,71,61,0.22)' }} />
        <div style={{ position:'absolute', bottom:16, right:16, width:28, height:28, borderBottom:'1px solid rgba(190,71,61,0.22)', borderRight:'1px solid rgba(190,71,61,0.22)' }} />
        <div style={{ position:'absolute', top:'28%', left:0, width:'30%', height:1, background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.07),transparent)', transform:'rotate(-8deg)', transformOrigin:'left' }} />
        <div style={{ position:'absolute', bottom:'28%', right:0, width:'25%', height:1, background:'linear-gradient(90deg,transparent,rgba(240,237,232,0.04),transparent)', transform:'rotate(7deg)', transformOrigin:'right' }} />
        <div style={{ position:'absolute', top:'12%', left:'2%', fontFamily:'monospace', fontSize:8, color:'rgba(240,237,232,0.05)', letterSpacing:2, lineHeight:2, userSelect:'none' }}>{'01001010\n10110100\n00101101'}</div>
        <div style={{ position:'absolute', bottom:'14%', right:'2%', fontFamily:'monospace', fontSize:8, color:'rgba(240,237,232,0.04)', letterSpacing:2, lineHeight:2, userSelect:'none', textAlign:'right' }}>{'10011010\n01100101'}</div>
        <div style={{ position:'absolute', left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.1),transparent)', animation:'scan 14s linear infinite' }} />
      </div>
  )
}

function SectionTag({ n, label }) {
  return (
      <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(240,237,232,0.12)' }}>
          <span style={{ fontFamily:MONO, fontSize:9, color:'#BE473D' }}>{n}</span>
          <span style={{ fontFamily:MONO, fontSize:9, letterSpacing:2.5, color:'rgba(240,237,232,0.45)' }}>{label}</span>
        </div>
        <div style={{ display:'flex', gap:3 }}>
          <div style={{ width:2, height:14, background:'rgba(240,237,232,0.2)' }} />
          <div style={{ width:2, height:14, background:'rgba(240,237,232,0.2)' }} />
        </div>
      </div>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ course:'', school:'', graduationYear:'', region:'', status:'' })
  const [loading, setLoading] = useState(false)
  const { setOnboarded, updateUser } = useAuthStore()
  const navigate = useNavigate()

  function update(key, val) { setData(prev => ({ ...prev, [key]: val })) }

  function canNext() {
    if (step === 1) return !!data.course
    if (step === 2) {
      if (!data.school) return false
      if (data.graduationYear) {
        const y = parseInt(data.graduationYear)
        if (isNaN(y) || y < 1990 || y > 2030) return false
      }
      return true
    }
    if (step === 3) return !!data.region
    if (step === 4) return !!data.status
    return true
  }

  async function handleFinish() {
    setLoading(true)
    try {
      await userApi.updateProfile(data)
      updateUser(data)
      setOnboarded()
      navigate('/dashboard')
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const pct = Math.round(((step - 1) / STEPS.length) * 100)

  return (
      <div style={{ minHeight:'100vh', background:'#3C091E', color:'#F0EDE8', display:'flex', flexDirection:'column', fontFamily:MONO }}>
        <style>{CSS}</style>
        <Bg />

        {/* Progress bar */}
        <div style={{ height:2, background:'rgba(240,237,232,0.06)', position:'fixed', top:0, left:0, right:0, zIndex:200 }}>
          <div style={{ height:'100%', width:pct+'%', background:'linear-gradient(90deg,#BE473D,#C8A84B)', boxShadow:'0 0 8px rgba(190,71,61,0.6)', transition:'width .5s ease' }} />
        </div>

        {/* Header */}
        <div style={{ position:'fixed', top:2, left:0, right:0, zIndex:100, padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(60,9,30,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(240,237,232,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width:5, height:5, background:i<2?'#BE473D':'#C8A84B', borderRadius:1 }} />)}
            </div>
            <span style={{ fontFamily:MONO, fontSize:12, color:'#F0EDE8', letterSpacing:3 }}>GRADREADY</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {STEPS.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <div style={{ width:6, height:6, border:'1px solid', borderColor: i < step-1 ? '#BE473D' : i === step-1 ? '#F0EDE8' : 'rgba(240,237,232,0.2)', background: i < step-1 ? '#BE473D' : 'transparent', transition:'all .3s' }} />
                    {i === step-1 && <div style={{ fontFamily:MONO, fontSize:7, color:'rgba(240,237,232,0.4)', letterSpacing:1 }}>{s}</div>}
                  </div>
                  {i < STEPS.length-1 && <div style={{ width:16, height:1, background: i < step-1 ? 'rgba(190,71,61,0.5)' : 'rgba(240,237,232,0.1)', marginBottom: i === step-1 || i === step-2 ? 10 : 0 }} />}
                </div>
            ))}
            <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.25)', letterSpacing:1, marginLeft:8 }}>{step}/{STEPS.length}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'100px 24px 120px', position:'relative', zIndex:1, overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:540 }} className="step-wrap" key={step}>

            {/* STEP 1 — Course */}
            {step === 1 && (
                <div>
                  <SectionTag n="01" label="COURSE" />
                  <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#F0EDE8', letterSpacing:'-1px', lineHeight:.95, marginBottom:6 }}>WHAT'S YOUR</div>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
                    <div style={{ position:'absolute', bottom:2, left:0, width:56, height:2, background:'#BE473D' }} />
                    <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#BE473D', letterSpacing:'-1px', lineHeight:.95 }}>FIELD OF STUDY?</div>
                  </div>
                  <p style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.38)', marginBottom:24, lineHeight:1.8, letterSpacing:.3 }}>
                    We'll tailor your roadmap and job matches to your specific course.
                  </p>
                  <div className="list-scroll">
                    {COURSES.map((c, i) => (
                        <button key={c} className={'opt-row' + (data.course === c ? ' sel' : '')} onClick={() => update('course', c)}>
                          <span style={{ fontFamily:MONO, fontSize:8, color: data.course === c ? '#BE473D' : 'rgba(240,237,232,0.2)', letterSpacing:1, flexShrink:0, width:22 }}>{String(i+1).padStart(2,'0')}</span>
                          <span style={{ flex:1 }}>{c}</span>
                          {data.course === c && <span style={{ color:'#BE473D', fontSize:10, flexShrink:0 }}>✓</span>}
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {/* STEP 2 — School + Year */}
            {step === 2 && (
                <div>
                  <SectionTag n="02" label="SCHOOL" />
                  <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#F0EDE8', letterSpacing:'-1px', lineHeight:.95, marginBottom:6 }}>WHERE DID YOU</div>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
                    <div style={{ position:'absolute', bottom:2, left:0, width:56, height:2, background:'#BE473D' }} />
                    <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#BE473D', letterSpacing:'-1px', lineHeight:.95 }}>GRADUATE?</div>
                  </div>
                  <p style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.38)', marginBottom:28, lineHeight:1.8, letterSpacing:.3 }}>
                    For location-based job matches and regional government office info.
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                    <div>
                      <div style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.3)', letterSpacing:2, marginBottom:8 }}>// SCHOOL / UNIVERSITY</div>
                      <input
                          type="text"
                          className="txt-input"
                          value={data.school}
                          onChange={e => update('school', e.target.value)}
                          placeholder="e.g. University of Santo Tomas"
                      />
                    </div>
                    <div>
                      <div style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.3)', letterSpacing:2, marginBottom:8 }}>
                        // GRADUATION YEAR <span style={{ color:'rgba(240,237,232,0.18)', letterSpacing:0, fontSize:8 }}>(optional)</span>
                      </div>
                      {/* BUG FIX: type="text" + inputMode="numeric" so user can freely type digits without onChange blocking mid-input */}
                      <input
                          type="text"
                          inputMode="numeric"
                          className="txt-input"
                          value={data.graduationYear}
                          onChange={e => {
                            const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                            update('graduationYear', raw)
                          }}
                          placeholder="e.g. 2024"
                          maxLength={4}
                      />
                      {data.graduationYear.length === 4 && (parseInt(data.graduationYear) < 1990 || parseInt(data.graduationYear) > 2030) && (
                          <div style={{ fontFamily:MONO, fontSize:9, color:'#E74C3C', marginTop:6, letterSpacing:.5 }}>
                            ⚠ Enter a year between 1990 and 2030
                          </div>
                      )}
                    </div>
                  </div>
                </div>
            )}

            {/* STEP 3 — Region */}
            {step === 3 && (
                <div>
                  <SectionTag n="03" label="REGION" />
                  <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#F0EDE8', letterSpacing:'-1px', lineHeight:.95, marginBottom:6 }}>WHERE ARE YOU</div>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
                    <div style={{ position:'absolute', bottom:2, left:0, width:56, height:2, background:'#BE473D' }} />
                    <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#BE473D', letterSpacing:'-1px', lineHeight:.95 }}>BASED?</div>
                  </div>
                  <p style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.38)', marginBottom:24, lineHeight:1.8, letterSpacing:.3 }}>
                    For regional job listings, gov office locations, and salary benchmarks.
                  </p>
                  <div className="list-scroll">
                    {REGIONS.map((r, i) => (
                        <button key={r} className={'opt-row' + (data.region === r ? ' sel' : '')} onClick={() => update('region', r)}>
                          <span style={{ fontFamily:MONO, fontSize:8, color: data.region === r ? '#BE473D' : 'rgba(240,237,232,0.2)', letterSpacing:1, flexShrink:0, width:22 }}>{String(i+1).padStart(2,'0')}</span>
                          <span style={{ flex:1 }}>{r}</span>
                          {data.region === r && <span style={{ color:'#BE473D', fontSize:10, flexShrink:0 }}>✓</span>}
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {/* STEP 4 — Status */}
            {step === 4 && (
                <div>
                  <SectionTag n="04" label="STATUS" />
                  <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#F0EDE8', letterSpacing:'-1px', lineHeight:.95, marginBottom:6 }}>WHAT'S YOUR</div>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
                    <div style={{ position:'absolute', bottom:2, left:0, width:56, height:2, background:'#BE473D' }} />
                    <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#BE473D', letterSpacing:'-1px', lineHeight:.95 }}>CURRENT STATUS?</div>
                  </div>
                  <p style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.38)', marginBottom:24, lineHeight:1.8, letterSpacing:.3 }}>
                    This determines the tasks in your personalized roadmap.
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {STATUSES.map(s => (
                        <button key={s.value} className={'opt-row' + (data.status === s.value ? ' sel' : '')}
                                onClick={() => update('status', s.value)}
                                style={{ padding:'16px', alignItems:'flex-start' }}>
                          <span style={{ fontFamily:MONO, fontSize:9, color: data.status === s.value ? '#BE473D' : 'rgba(240,237,232,0.2)', letterSpacing:1, flexShrink:0, width:22, paddingTop:2 }}>{s.n}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:MONO, fontSize:11, color: data.status === s.value ? '#F0EDE8' : 'rgba(240,237,232,0.65)', letterSpacing:.5, marginBottom:4 }}>{s.label}</div>
                            <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(240,237,232,0.28)', letterSpacing:.3 }}>{s.desc}</div>
                          </div>
                          {data.status === s.value && <span style={{ color:'#BE473D', fontSize:10, flexShrink:0, paddingTop:2 }}>✓</span>}
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {/* STEP 5 — Review */}
            {step === 5 && (
                <div>
                  <SectionTag n="05" label="REVIEW" />
                  <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#F0EDE8', letterSpacing:'-1px', lineHeight:.95, marginBottom:6 }}>LOOKING GOOD,</div>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
                    <div style={{ position:'absolute', bottom:2, left:0, width:56, height:2, background:'#BE473D' }} />
                    <div style={{ fontFamily:MONO, fontSize:'clamp(24px,5vw,38px)', color:'#BE473D', letterSpacing:'-1px', lineHeight:.95 }}>LET'S CONFIRM.</div>
                  </div>
                  <p style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.38)', marginBottom:24, lineHeight:1.8, letterSpacing:.3 }}>
                    Review your profile — you can always edit it later.
                  </p>

                  <div style={{ border:'1px solid rgba(240,237,232,0.08)', background:'rgba(240,237,232,0.02)', marginBottom:20, position:'relative', overflow:'hidden' }}>
                    {[{top:6,left:6},{top:6,right:6},{bottom:6,left:6},{bottom:6,right:6}].map((pos, i) => (
                        <div key={i} style={{ position:'absolute', ...pos, width:10, height:10,
                          borderTop:    pos.top    !== undefined ? '1px solid rgba(190,71,61,0.3)' : 'none',
                          borderBottom: pos.bottom !== undefined ? '1px solid rgba(190,71,61,0.3)' : 'none',
                          borderLeft:   pos.left   !== undefined ? '1px solid rgba(190,71,61,0.3)' : 'none',
                          borderRight:  pos.right  !== undefined ? '1px solid rgba(190,71,61,0.3)' : 'none',
                        }} />
                    ))}
                    {[
                      ['COURSE',    data.course],
                      ['SCHOOL',    data.school || '—'],
                      ['GRAD YEAR', data.graduationYear || '—'],
                      ['REGION',    data.region],
                      ['STATUS',    STATUSES.find(s => s.value === data.status)?.label || data.status],
                    ].map(([label, value], i) => (
                        <div key={i} className="review-row">
                          <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.28)', letterSpacing:2, width:90, flexShrink:0, paddingTop:1 }}>{label}</span>
                          <span style={{ fontFamily:MONO, fontSize:11, color:'#F0EDE8', letterSpacing:.3 }}>{value}</span>
                        </div>
                    ))}
                  </div>

                  <div style={{ padding:'13px 16px', border:'1px solid rgba(190,71,61,0.15)', background:'rgba(190,71,61,0.04)', borderLeft:'2px solid rgba(190,71,61,0.4)' }}>
                    <div style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.35)', letterSpacing:.5, lineHeight:1.9 }}>
                      Your personalized roadmap will be generated from these details. Kuya AI will be ready to help immediately after setup.
                    </div>
                  </div>
                </div>
            )}

          </div>
        </div>

        {/* Nav footer */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'rgba(42,5,21,0.97)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(240,237,232,0.07)', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button className="nav-btn-back" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}
                  style={{ opacity: step === 1 ? 0.3 : 1, cursor: step === 1 ? 'default' : 'pointer' }}>
            ← BACK
          </button>

          {/* Progress dots */}
          <div style={{ display:'flex', gap:5, alignItems:'center' }}>
            {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step-1 ? 20 : 6, height:4, background: i < step ? '#BE473D' : 'rgba(240,237,232,0.12)', transition:'all .3s' }} />
            ))}
          </div>

          {step < 5 ? (
              <button className="nav-btn-next" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}>
                CONTINUE →
              </button>
          ) : (
              <button className="nav-btn-next" onClick={handleFinish} disabled={loading}
                      style={{ background: loading ? 'rgba(190,71,61,0.4)' : '#BE473D' }}>
                {loading ? 'SETTING UP...' : 'LAUNCH →'}
              </button>
          )}
        </div>
      </div>
  )
}