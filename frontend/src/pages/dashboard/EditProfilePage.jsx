import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../services/api'
import useAuthStore from '../../store/authStore'
import { useProfile } from '../../hooks/useProfile'
import { useQueryClient } from '@tanstack/react-query'
import PageLayout from '../../components/ui/PageLayout'

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
  { value: 'job_hunting',     label: 'Job hunting',      icon: '◉' },
  { value: 'employed',        label: 'Employed',          icon: '◈' },
  { value: 'freelancing',     label: 'Freelancing',       icon: '◎' },
  { value: 'board_exam',      label: 'Board exam prep',   icon: '✚' },
  { value: 'further_studies', label: 'Further studies',   icon: '✦' },
]

function Section({ title, children }) {
  return (
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(242,237,232,0.25)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 3, height: 12, background: '#C0392B' }} />
          {title}
        </div>
        {children}
      </div>
  )
}

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useProfile()
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const PRESET_COURSES = COURSES.slice(0, -1) // all except 'Other'

  const [showOther, setShowOther] = useState(
      !!profile?.course && !PRESET_COURSES.includes(profile?.course)
  )

  const [form, setForm] = useState({
    course: profile?.course || '',
    school: profile?.school || '',
    graduationYear: profile?.graduationYear || '',
    region: profile?.region || '',
    status: profile?.status || '',
  })

  function update(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSave() {
    setLoading(true)
    try {
      await userApi.updateProfile(form)
      updateUser(form)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] })
      setSaved(true)
      setTimeout(() => navigate('/dashboard/profile'), 1500)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const optBtn = (selected) => ({
    width: '100%', textAlign: 'left', background: selected ? 'rgba(192,57,43,0.1)' : 'rgba(255,255,255,0.03)',
    border: '1px solid ' + (selected ? '#C0392B' : 'rgba(242,237,232,0.08)'),
    color: selected ? '#F2EDE8' : 'rgba(242,237,232,0.6)',
    padding: '13px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
  })

  if (isLoading) {
    return (
        <PageLayout title="Edit profile" backTo="/dashboard/profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 48, background: 'rgba(255,255,255,0.03)', animation: 'pulse 2s ease infinite' }} />)}
            <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:.3}}`}</style>
          </div>
        </PageLayout>
    )
  }

  return (
      <PageLayout title="Edit profile" backTo="/dashboard/profile" accentColor="#C0392B">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');`}</style>

        {saved && (
            <div style={{ border: '1px solid rgba(30,132,73,0.3)', background: 'rgba(30,132,73,0.08)', padding: '14px 20px', marginBottom: 32, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1E8449', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>✓</span> Profile saved — redirecting...
            </div>
        )}

        {/* Course */}
        <Section title="Course">
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {COURSES.map(c => {
              var isOther = c === 'Other'
              var selected = isOther ? showOther : (!showOther && form.course === c)
              return (
                  <button key={c} style={optBtn(selected)}
                          onClick={() => {
                            if (isOther) {
                              setShowOther(true)
                              update('course', '')
                            } else {
                              setShowOther(false)
                              update('course', c)
                            }
                          }}>
                    {selected && <span style={{ color: '#C0392B', fontSize: 14 }}>✓</span>}
                    {c}
                  </button>
              )
            })}
          </div>

          {showOther && (
              <div style={{ marginTop: 10 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(242,237,232,0.3)', display: 'block', marginBottom: 8 }}>
                  YOUR COURSE
                </label>
                <input
                    type="text"
                    autoFocus
                    value={form.course}
                    placeholder="e.g. BS Tourism Management"
                    onChange={e => update('course', e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #C0392B', color: '#F2EDE8', padding: '13px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}
                />
              </div>
          )}
        </Section>

        {/* School + Year */}
        <Section title="Education details">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(242,237,232,0.3)', display: 'block', marginBottom: 8 }}>School / University</label>
              <input type="text" value={form.school} onChange={e => update('school', e.target.value)} placeholder="e.g. University of Santo Tomas"
                     style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,237,232,0.12)', color: '#F2EDE8', padding: '13px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                     onFocus={e => { e.currentTarget.style.borderColor = '#C0392B' }}
                     onBlur={e => { e.currentTarget.style.borderColor = 'rgba(242,237,232,0.12)' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(242,237,232,0.3)', display: 'block', marginBottom: 8 }}>Graduation year</label>
              <input type="number" value={form.graduationYear} onChange={e => update('graduationYear', e.target.value)} placeholder="e.g. 2024" min="1990" max="2030"
                     style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,237,232,0.12)', color: '#F2EDE8', padding: '13px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                     onFocus={e => { e.currentTarget.style.borderColor = '#C0392B' }}
                     onBlur={e => { e.currentTarget.style.borderColor = 'rgba(242,237,232,0.12)' }}
              />
            </div>
          </div>
        </Section>

        {/* Region */}
        <Section title="Region">
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {REGIONS.map(r => (
                <button key={r} style={optBtn(form.region === r)} onClick={() => update('region', r)}>
                  {form.region === r && <span style={{ color: '#C0392B', fontSize: 14 }}>✓</span>}
                  {r}
                </button>
            ))}
          </div>
        </Section>

        {/* Status */}
        <Section title="Current status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STATUSES.map(s => (
                <button key={s.value} style={{ ...optBtn(form.status === s.value), padding: '16px 18px' }} onClick={() => update('status', s.value)}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: form.status === s.value ? '#C0392B' : 'rgba(242,237,232,0.25)', flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontWeight: 500 }}>{s.label}</span>
                </button>
            ))}
          </div>
        </Section>

        {/* Save */}
        <button onClick={handleSave} disabled={loading}
                style={{ width: '100%', background: loading ? 'rgba(192,57,43,0.5)' : '#C0392B', border: 'none', color: '#F2EDE8', padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E74C3C' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#C0392B' }}>
          {loading ? 'Saving changes...' : 'Save changes'}
        </button>
      </PageLayout>
  )
}