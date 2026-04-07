import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../services/api'
import useAuthStore from '../../store/authStore'

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
  { value: 'job_hunting',     label: 'Job hunting',       desc: 'Looking for my first or next role', icon: '◉' },
  { value: 'employed',        label: 'Employed',           desc: 'I just started or am already working', icon: '◈' },
  { value: 'freelancing',     label: 'Freelancing',        desc: 'Self-employed or doing gig work', icon: '◎' },
  { value: 'board_exam',      label: 'Board exam prep',    desc: 'Preparing for my PRC licensure exam', icon: '✚' },
  { value: 'further_studies', label: 'Further studies',    desc: 'Taking up graduate school or review', icon: '✦' },
]

const STEPS = ['Course', 'School', 'Region', 'Status', 'Review']

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:rgba(192,57,43,.4)}
  .opt-btn{width:100%;text-align:left;background:rgba(255,255,255,.03);border:1px solid rgba(242,237,232,.08);color:rgba(242,237,232,.7);padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:0}
  .opt-btn:hover{border-color:rgba(192,57,43,.4);color:#F2EDE8;background:rgba(192,57,43,.06)}
  .opt-btn.selected{border-color:#C0392B;background:rgba(192,57,43,.1);color:#F2EDE8}
  .field-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(242,237,232,.12);color:#F2EDE8;padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:border-color .2s}
  .field-input::placeholder{color:rgba(242,237,232,.25)}
  .field-input:focus{border-color:#C0392B}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .5s ease forwards}
`

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ course: '', school: '', graduationYear: '', region: '', status: '' })
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
    <div style={{ minHeight: '100vh', background: '#110705', color: '#F2EDE8', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{S}</style>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(242,237,232,0.06)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: '100%', width: pct + '%', background: '#C0392B', transition: 'width 0.5s ease' }} />
      </div>

      {/* Header */}
      <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#C0392B', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))' }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 14, color: '#F4C430' }}>G</span>
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: '#F2EDE8' }}>GradReady PH</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: i < step - 1 ? '#C0392B' : i === step - 1 ? '#F2EDE8' : 'rgba(242,237,232,0.2)', transition: 'background 0.3s' }} />
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step - 1 ? 'rgba(192,57,43,0.5)' : 'rgba(242,237,232,0.1)' }} />}
            </div>
          ))}
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(242,237,232,0.3)', marginLeft: 8 }}>{step}/{STEPS.length}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 32px 100px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 560 }} className="fade-up" key={step}>

          {/* Step 1 — Course */}
          {step === 1 && (
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(242,237,232,0.25)', marginBottom: 20 }}>Step 1 of 5</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
                What's your<br /><span style={{ color: '#C0392B', fontStyle: 'italic' }}>field of study?</span>
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'rgba(242,237,232,0.4)', marginBottom: 32, lineHeight: 1.65 }}>We'll tailor your roadmap and job matches to your specific course.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 420, overflowY: 'auto' }}>
                {COURSES.map(c => (
                  <button key={c} className={'opt-btn' + (data.course === c ? ' selected' : '')} onClick={() => update('course', c)}>
                    {data.course === c && <span style={{ color: '#C0392B', marginRight: 12, fontSize: 16 }}>✓</span>}
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — School + Year */}
          {step === 2 && (
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(242,237,232,0.25)', marginBottom: 20 }}>Step 2 of 5</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
                Where did you<br /><span style={{ color: '#C0392B', fontStyle: 'italic' }}>graduate?</span>
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'rgba(242,237,232,0.4)', marginBottom: 32, lineHeight: 1.65 }}>For location-based job matches and regional government office info.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(242,237,232,0.3)', display: 'block', marginBottom: 10 }}>School / University</label>
                  <input type="text" className="field-input" value={data.school} onChange={e => update('school', e.target.value)} placeholder="e.g. University of Santo Tomas" />
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(242,237,232,0.3)', display: 'block', marginBottom: 10 }}>
                    Graduation year <span style={{ color: 'rgba(242,237,232,0.2)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <input type="number" className="field-input" value={data.graduationYear} onChange={e => {
                    const v = parseInt(e.target.value)
                    if (!e.target.value || (v >= 1990 && v <= 2030)) update('graduationYear', e.target.value)
                  }} placeholder="e.g. 2024" min="1990" max="2030" />
                  {data.graduationYear && (parseInt(data.graduationYear) > 2030 || parseInt(data.graduationYear) < 1990) && (
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#E74C3C', marginTop: 6 }}>
                      Please enter a valid year between 1990 and 2030
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Region */}
          {step === 3 && (
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(242,237,232,0.25)', marginBottom: 20 }}>Step 3 of 5</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
                Where are you<br /><span style={{ color: '#C0392B', fontStyle: 'italic' }}>based?</span>
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'rgba(242,237,232,0.4)', marginBottom: 32, lineHeight: 1.65 }}>For regional job listings, gov office locations, and salary benchmarks.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 440, overflowY: 'auto' }}>
                {REGIONS.map(r => (
                  <button key={r} className={'opt-btn' + (data.region === r ? ' selected' : '')} onClick={() => update('region', r)}>
                    {data.region === r && <span style={{ color: '#C0392B', marginRight: 12, fontSize: 16 }}>✓</span>}
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Status */}
          {step === 4 && (
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(242,237,232,0.25)', marginBottom: 20 }}>Step 4 of 5</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
                What's your<br /><span style={{ color: '#C0392B', fontStyle: 'italic' }}>current status?</span>
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'rgba(242,237,232,0.4)', marginBottom: 32, lineHeight: 1.65 }}>This determines the tasks in your personalized roadmap.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STATUSES.map(s => (
                  <button key={s.value} className={'opt-btn' + (data.status === s.value ? ' selected' : '')} onClick={() => update('status', s.value)} style={{ padding: '18px 20px' }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginRight: 16, flexShrink: 0, color: data.status === s.value ? '#C0392B' : 'rgba(242,237,232,0.3)' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15, color: data.status === s.value ? '#F2EDE8' : 'rgba(242,237,232,0.7)' }}>{s.label}</div>
                      <div style={{ fontSize: 13, color: 'rgba(242,237,232,0.35)', marginTop: 3 }}>{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(242,237,232,0.25)', marginBottom: 20 }}>Step 5 of 5</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
                Looking good,<br /><span style={{ color: '#C0392B', fontStyle: 'italic' }}>let's confirm.</span>
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'rgba(242,237,232,0.4)', marginBottom: 32, lineHeight: 1.65 }}>Review your profile — you can always edit it later.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(242,237,232,0.04)', marginBottom: 32 }}>
                {[
                  ['Course', data.course],
                  ['School', data.school || 'Not specified'],
                  ['Graduation year', data.graduationYear || 'Not specified'],
                  ['Region', data.region],
                  ['Status', STATUSES.find(s => s.value === data.status)?.label || data.status],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: 'flex', background: '#110705', padding: '16px 20px', borderLeft: '2px solid rgba(192,57,43,0.3)' }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(242,237,232,0.3)', width: 140, flexShrink: 0, paddingTop: 1 }}>{label}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#F2EDE8' }}>{value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(242,237,232,0.3)', lineHeight: 1.65 }}>
                Your personalized roadmap will be generated based on these details. Kuya AI will be ready to help immediately.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(12,4,2,0.97)', borderTop: '1px solid rgba(242,237,232,0.07)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
        <button
          onClick={() => step > 1 ? setStep(step - 1) : null}
          style={{ background: 'transparent', border: '1px solid rgba(242,237,232,0.12)', color: step > 1 ? 'rgba(242,237,232,0.5)' : 'rgba(242,237,232,0.1)', padding: '12px 24px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, cursor: step > 1 ? 'pointer' : 'default', transition: 'all 0.2s' }}
          onMouseEnter={e => { if (step > 1) e.currentTarget.style.borderColor = 'rgba(242,237,232,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(242,237,232,0.12)' }}>
          ← Back
        </button>

        {step < 5 ? (
          <button
            onClick={() => canNext() && setStep(step + 1)}
            disabled={!canNext()}
            style={{ background: canNext() ? '#C0392B' : 'rgba(192,57,43,0.3)', border: 'none', color: '#F2EDE8', padding: '12px 32px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'background 0.2s', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
            onMouseEnter={e => { if (canNext()) e.currentTarget.style.background = '#E74C3C' }}
            onMouseLeave={e => { if (canNext()) e.currentTarget.style.background = '#C0392B' }}>
            Continue →
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={loading}
            style={{ background: '#C0392B', border: 'none', color: '#F2EDE8', padding: '12px 36px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E74C3C' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#C0392B' }}>
            {loading ? 'Setting up your profile...' : 'Launch GradReady →'}
          </button>
        )}
      </div>
    </div>
  )
}