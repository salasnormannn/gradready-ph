import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/ui/PageLayout'
import { useProfile } from '../../hooks/useProfile'
import useAuthStore from '../../store/authStore'
import { useQueryClient } from '@tanstack/react-query'

const STATUS_LABELS = {
  job_hunting: { label: 'Job hunting', emoji: '🔍' },
  employed: { label: 'Employed', emoji: '💼' },
  freelancing: { label: 'Freelancing', emoji: '💻' },
  board_exam: { label: 'Board exam prep', emoji: '📚' },
  further_studies: { label: 'Further studies', emoji: '🎓' },
}

function Field({ label, value, placeholder = 'Not set' }) {
  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl px-4 py-3">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </div>
      <div className={`text-sm font-semibold ${value ? 'text-[#1C0A08]' : 'text-gray-300'}`}>
        {value || placeholder}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { logout } = useAuthStore()
  const { data: profile, isLoading } = useProfile()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const firstName = profile?.fullName?.split(' ')[0] ?? '?'
  const initials = profile?.fullName
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

  const status = STATUS_LABELS[profile?.status]

  const handleLogout = () => {
    queryClient.clear()
    logout()
    navigate('/')
  }

  return (
    <PageLayout title="My profile">
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse
              border border-[#EAE4DC]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">

          {/* Avatar hero */}
          <div className="bg-[#1C0A08] rounded-2xl p-6 flex flex-col
            items-center text-center mb-2">
            <div className="w-20 h-20 rounded-full bg-[#F4C430] flex items-center
              justify-center text-2xl font-black text-[#1C0A08] mb-4">
              {initials}
            </div>
            <div className="text-xl font-black text-white">{profile?.fullName}</div>
            <div className="text-sm text-white/50 mt-1">{profile?.email}</div>
            {status && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10
                px-3 py-1.5 rounded-full">
                <span>{status.emoji}</span>
                <span className="text-xs font-semibold text-white/70">{status.label}</span>
              </div>
            )}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Education
          </p>
          <Field label="Course" value={profile?.course} />
          <Field label="School" value={profile?.school} />
          <Field label="Graduation year" value={profile?.graduationYear} />

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
            Location
          </p>
          <Field label="Region" value={profile?.region} />

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
            Account
          </p>
          <Field label="Email" value={profile?.email} />
          <Field label="Member since" value={
            profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString('en-PH',
                  { year: 'numeric', month: 'long', day: 'numeric' })
              : null
          } />

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => navigate('/dashboard/profile/edit')}
              className="w-full bg-[#1C0A08] text-white font-bold py-3 rounded-2xl text-sm"
            >
              Edit profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-white text-[#C0392B] font-bold py-3
                rounded-2xl text-sm border border-[#C0392B]/20"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  )
}