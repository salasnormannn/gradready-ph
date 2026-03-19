import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../services/api'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

const COURSES = [
  'BS Computer Science', 'BS Information Technology',
  'BS Nursing', 'BS Accountancy', 'BS Business Administration',
  'BS Engineering (Civil)', 'BS Engineering (Electrical)',
  'BS Engineering (Mechanical)', 'BS Architecture',
  'AB Communication', 'BS Education', 'BS Psychology',
  'BS Medicine', 'BS Pharmacy', 'Other',
]

const REGIONS = [
  'NCR (Metro Manila)', 'Region I (Ilocos)', 'Region II (Cagayan Valley)',
  'Region III (Central Luzon)', 'Region IV-A (CALABARZON)',
  'Region IV-B (MIMAROPA)', 'Region V (Bicol)',
  'Region VI (Western Visayas)', 'Region VII (Central Visayas)',
  'Region VIII (Eastern Visayas)', 'Region IX (Zamboanga)',
  'Region X (Northern Mindanao)', 'Region XI (Davao)',
  'Region XII (SOCCSKSARGEN)', 'Region XIII (Caraga)',
  'BARMM', 'CAR',
]

const STATUSES = [
  { value: 'job_hunting', label: 'Job hunting', emoji: '🔍', desc: 'Looking for my first job' },
  { value: 'employed', label: 'Employed', emoji: '💼', desc: 'Just got hired!' },
  { value: 'freelancing', label: 'Freelancing', emoji: '💻', desc: 'Going independent' },
  { value: 'board_exam', label: 'Board exam prep', emoji: '📚', desc: 'Studying for licensure' },
  { value: 'further_studies', label: 'Further studies', emoji: '🎓', desc: 'Pursuing grad school' },
]

const YEARS = ['2025', '2024', '2023', '2022']

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    course: '', school: '', graduationYear: '',
    region: '', status: '',
  })
  const { setOnboarded, updateUser, user } = useAuthStore()
  const navigate = useNavigate()

  const update = (key, val) => setData(d => ({ ...d, [key]: val }))

  const canNext = () => {
    if (step === 1) return data.course !== ''
    if (step === 2) return data.school !== '' && data.graduationYear !== ''
    if (step === 3) return data.region !== ''
    if (step === 4) return data.status !== ''
    return true
  }

  const next = () => {
    if (step < 5) setStep(s => s + 1)
  }

  const back = () => {
    if (step > 1) setStep(s => s - 1)
  }

  const finish = async () => {
    setLoading(true)
    try {
      await userApi.updateProfile(data)
      updateUser(data)
      setOnboarded()
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col">
      <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-screen">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#C0392B] rounded-xl flex items-center justify-center">
              <span className="text-[#F4C430] font-black text-lg">G</span>
            </div>
            <span className="text-sm font-semibold text-[#888]">
              Let's set up your profile
            </span>
          </div>
          <ProgressBar current={step} total={5} />
        </div>

        <div className="flex-1">

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-[#1C0A08] mb-1">
                What did you graduate with?
              </h2>
              <p className="text-sm text-[#888] mb-6">
                This helps us personalize your roadmap and job matches.
              </p>
              <div className="flex flex-col gap-2">
                {COURSES.map(c => (
                  <button
                    key={c}
                    onClick={() => update('course', c)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
                      ${data.course === c
                        ? 'bg-[#C0392B] text-white border-[#C0392B]'
                        : 'bg-white text-[#1C0A08] border-[#EAE4DC] hover:border-[#C0392B]'
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-[#1C0A08] mb-1">
                Where did you graduate?
              </h2>
              <p className="text-sm text-[#888] mb-6">
                We'll use this for location-based job matches and regional gov offices.
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#888] block mb-1">
                    School / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. University of Santo Tomas"
                    value={data.school}
                    onChange={e => update('school', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE4DC] bg-white
                      text-sm text-[#1C0A08] outline-none focus:border-[#C0392B]
                      focus:ring-2 focus:ring-[#C0392B]/10 placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#888] block mb-1">
                    Graduation year
                  </label>
                  <div className="flex gap-2">
                    {YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => update('graduationYear', y)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all
                          ${data.graduationYear === y
                            ? 'bg-[#C0392B] text-white border-[#C0392B]'
                            : 'bg-white text-[#1C0A08] border-[#EAE4DC] hover:border-[#C0392B]'
                          }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-[#1C0A08] mb-1">
                Where are you based?
              </h2>
              <p className="text-sm text-[#888] mb-6">
                For local job matches and nearest government offices.
              </p>
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => update('region', r)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
                      ${data.region === r
                        ? 'bg-[#C0392B] text-white border-[#C0392B]'
                        : 'bg-white text-[#1C0A08] border-[#EAE4DC] hover:border-[#C0392B]'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-black text-[#1C0A08] mb-1">
                What's your current situation?
              </h2>
              <p className="text-sm text-[#888] mb-6">
                Your roadmap will be customized based on this.
              </p>
              <div className="flex flex-col gap-3">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => update('status', s.value)}
                    className={`w-full text-left px-4 py-4 rounded-xl border transition-all
                      ${data.status === s.value
                        ? 'bg-[#1C0A08] border-[#1C0A08]'
                        : 'bg-white border-[#EAE4DC] hover:border-[#C0392B]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.emoji}</span>
                      <div>
                        <div className={`text-sm font-bold ${data.status === s.value ? 'text-[#F4C430]' : 'text-[#1C0A08]'}`}>
                          {s.label}
                        </div>
                        <div className={`text-xs mt-0.5 ${data.status === s.value ? 'text-white/60' : 'text-[#888]'}`}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-20 h-20 bg-[#1C0A08] rounded-full flex items-center justify-center text-4xl mb-6">
                🤙
              </div>
              <h2 className="text-2xl font-black text-[#1C0A08] mb-2">
                You're all set,<br />
                <span className="text-[#C0392B]">{user?.fullName?.split(' ')[0]}!</span>
              </h2>
              <p className="text-sm text-[#888] leading-relaxed mb-8">
                Kuya AI has prepared your personalized post-grad roadmap based on your profile.
                Let's get you started!
              </p>

              <div className="w-full bg-white border border-[#EAE4DC] rounded-2xl p-4 text-left mb-6">
                <div className="text-xs font-bold uppercase tracking-wide text-[#888] mb-3">Your profile summary</div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Course', val: data.course },
                    { label: 'School', val: data.school },
                    { label: 'Year', val: data.graduationYear },
                    { label: 'Region', val: data.region },
                    { label: 'Status', val: STATUSES.find(s => s.value === data.status)?.label },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-[#888]">{item.label}</span>
                      <span className="font-semibold text-[#1C0A08] text-right max-w-48 truncate">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button variant="secondary" onClick={back} className="w-auto px-6">
              ←
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={next} disabled={!canNext()}>
              Continue →
            </Button>
          ) : (
            <Button variant="gold" onClick={finish} disabled={loading}>
              {loading ? 'Setting up your roadmap...' : 'Take me to my dashboard! 🎓'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}