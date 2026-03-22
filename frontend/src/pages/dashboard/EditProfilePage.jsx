import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../services/api'
import useAuthStore from '../../store/authStore'
import { useProfile } from '../../hooks/useProfile'
import { useQueryClient } from '@tanstack/react-query'
import PageLayout from '../../components/ui/PageLayout'
import Button from '../../components/ui/Button'

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
  { value: 'job_hunting', label: 'Job hunting', emoji: '🔍' },
  { value: 'employed', label: 'Employed', emoji: '💼' },
  { value: 'freelancing', label: 'Freelancing', emoji: '💻' },
  { value: 'board_exam', label: 'Board exam prep', emoji: '📚' },
  { value: 'further_studies', label: 'Further studies', emoji: '🎓' },
]

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useProfile()
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    course: profile?.course || '',
    school: profile?.school || '',
    graduationYear: profile?.graduationYear || '',
    region: profile?.region || '',
    status: profile?.status || '',
  })

  function update(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

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
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <PageLayout title="Edit profile" backTo="/dashboard/profile">
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-[#EAE4DC]" />
          ))}
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Edit profile" backTo="/dashboard/profile">
      <div className="flex flex-col gap-4">

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-green-700 font-semibold">
              Profile saved successfully!
            </p>
          </div>
        )}

        {/* Course */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-[#888] block mb-2">
            Course
          </label>
          <div className="flex flex-col gap-2">
            {COURSES.map(c => (
              <button
                key={c}
                onClick={() => update('course', c)}
                className={
                  'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ' +
                  (form.course === c
                    ? 'bg-[#C0392B] text-white border-[#C0392B]'
                    : 'bg-white text-[#1C0A08] border-[#EAE4DC] hover:border-[#C0392B]')
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* School */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-[#888] block mb-2">
            School / University
          </label>
          <input
            type="text"
            value={form.school}
            onChange={e => update('school', e.target.value)}
            placeholder="e.g. University of Santo Tomas"
            className="w-full px-4 py-3 rounded-xl border border-[#EAE4DC] bg-white
              text-sm text-[#1C0A08] outline-none focus:border-[#C0392B] placeholder:text-gray-300"
          />
        </div>

        {/* Graduation year */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-[#888] block mb-2">
            Graduation year
          </label>
          <input
            type="number"
            value={form.graduationYear}
            onChange={e => update('graduationYear', e.target.value)}
            placeholder="e.g. 2024"
            min="2000"
            max="2030"
            className="w-full px-4 py-3 rounded-xl border border-[#EAE4DC] bg-white
              text-sm text-[#1C0A08] outline-none focus:border-[#C0392B] placeholder:text-gray-300"
          />
        </div>

        {/* Region */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-[#888] block mb-2">
            Region
          </label>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => update('region', r)}
                className={
                  'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ' +
                  (form.region === r
                    ? 'bg-[#C0392B] text-white border-[#C0392B]'
                    : 'bg-white text-[#1C0A08] border-[#EAE4DC] hover:border-[#C0392B]')
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-[#888] block mb-2">
            Current status
          </label>
          <div className="flex flex-col gap-2">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => update('status', s.value)}
                className={
                  'w-full text-left px-4 py-4 rounded-xl border transition-all ' +
                  (form.status === s.value
                    ? 'bg-[#1C0A08] border-[#1C0A08]'
                    : 'bg-white border-[#EAE4DC] hover:border-[#C0392B]')
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.emoji}</span>
                  <span className={
                    'text-sm font-bold ' +
                    (form.status === s.value ? 'text-[#F4C430]' : 'text-[#1C0A08]')
                  }>
                    {s.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="mt-4"
        >
          {loading ? 'Saving...' : 'Save changes'}
        </Button>

      </div>
    </PageLayout>
  )
}