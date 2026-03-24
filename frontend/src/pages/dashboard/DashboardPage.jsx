import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { useRoadmapProgress } from '../../hooks/useRoadmap'
import { useProfile } from '../../hooks/useProfile'

var NAV_ITEMS = [
  { icon: '🗺️', label: 'My roadmap', to: '/dashboard/roadmap', desc: 'Week-by-week checklist', color: 'bg-red-50' },
  { icon: '🏛️', label: 'Gov regs', to: '/dashboard/gov', desc: 'TIN, SSS, PhilHealth and more', color: 'bg-green-50' },
  { icon: '🤙', label: 'Kuya AI', to: '/dashboard/chat', desc: 'Ask anything, anytime', color: 'bg-[#1C0A08]', dark: true },
  { icon: '💼', label: 'Job search', to: '/dashboard/jobs', desc: 'AI-matched jobs for you', color: 'bg-blue-50' },
  { icon: '💰', label: 'Finance guide', to: '/dashboard/finance', desc: 'Budgeting and investing PH', color: 'bg-amber-50' },
  { icon: '🎓', label: 'Board exams', to: '/dashboard/board', desc: 'PRC schedules and study plans', color: 'bg-purple-50' },
]

var QUICK_ASKS = [
  'Paano mag-register sa PhilHealth?',
  'What do I need for NBI clearance?',
  'How do I negotiate my first salary?',
  'How to open a savings account in PH?',
]

var GOV_TOTAL = 6
var GOV_STORAGE_KEY = 'gradready-gov-statuses'

function getGovDoneCount() {
  try {
    var saved = localStorage.getItem(GOV_STORAGE_KEY)
    if (!saved) return 0
    var statuses = JSON.parse(saved)
    return Object.values(statuses).filter(function(s) { return s === 'done' }).length
  } catch (e) {
    return 0
  }
}

function StatCard(props) {
  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-500"
        style={{ width: props.pct + '%', background: props.accent }}
      />
      <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{props.label}</div>
      <div className="text-2xl font-black text-[#1C0A08]">{props.value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{props.sub}</div>
    </div>
  )
}

export default function DashboardPage() {
  var authStore = useAuthStore()
  var user = authStore.user
  var navigate = useNavigate()

  var progressResult = useRoadmapProgress()
  var progress = progressResult.data
  var progressLoading = progressResult.isLoading

  var profileResult = useProfile()
  var profile = profileResult.data

  var govCountState = useState(getGovDoneCount())
  var govDoneCount = govCountState[0]
  var setGovDoneCount = govCountState[1]

  var userId = user && user.userId ? user.userId : 'guest'
  var GOV_STORAGE_KEY = 'gradready-gov-statuses-' + userId

  // Listen for gov status updates from GovPage
  useEffect(function() {
    function handleGovUpdate() {
      setGovDoneCount(getGovDoneCount())
    }
    window.addEventListener('gov-status-updated', handleGovUpdate)
    // Also refresh when page becomes visible (user navigates back from GovPage)
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        setGovDoneCount(getGovDoneCount())
      }
    })
    return function() {
      window.removeEventListener('gov-status-updated', handleGovUpdate)
    }
  }, [])

  var firstName = (profile && profile.fullName ? profile.fullName : (user && user.fullName ? user.fullName : 'Ka-grad')).split(' ')[0]
  var pct = progress && progress.percentage ? progress.percentage : 0
  var completed = progress && progress.completed ? progress.completed : 0
  var total = progress && progress.total ? progress.total : 0

  function getGreeting() {
    var h = new Date().getHours()
    if (h < 12) return 'Magandang umaga'
    if (h < 18) return 'Magandang hapon'
    return 'Magandang gabi'
  }

  function getWeekMessage() {
    if (pct === 0) return "Let's start your journey!"
    if (pct < 25) return "You're just getting started — keep going!"
    if (pct < 50) return 'Ahead of ' + Math.round(pct * 1.5) + '% of fresh grads!'
    if (pct < 75) return "You're doing great, keep it up!"
    return 'Almost done — you are crushing it!'
  }

  var initials = firstName ? firstName[0].toUpperCase() : 'G'

  return (
    <div className="min-h-screen bg-[#F7F3EE]">

      <nav className="sticky top-0 z-50 bg-[#F7F3EE] border-b border-[#EAE4DC] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C0392B] rounded-xl flex items-center justify-center">
            <span className="text-[#F4C430] font-black text-sm">G</span>
          </div>
          <span className="font-black text-[#1C0A08] text-sm">GradReady PH</span>
        </div>
        <Link
          to="/dashboard/profile"
          className="w-8 h-8 rounded-full bg-[#F4C430] flex items-center justify-center text-xs font-black text-[#1C0A08]"
        >
          {initials}
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-6 pb-24">

        <div className="bg-[#1C0A08] rounded-2xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] w-28 h-28 rounded-full bg-[#C0392B] opacity-30" />
          <div className="absolute right-8 bottom-[-20px] w-16 h-16 rounded-full bg-[#F4C430] opacity-15" />
          <div className="inline-block bg-[#C0392B] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            {(profile && profile.region) || 'Philippines'}
          </div>
          <h1 className="text-xl font-black text-white leading-tight mb-1">
            {getGreeting()},
            <span className="text-[#F4C430]"> {firstName}!</span>
          </h1>
          <p className="text-xs text-white/50 mb-4">{getWeekMessage()}</p>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F4C430] rounded-full transition-all duration-700"
              style={{ width: pct + '%' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-white/40">Journey progress</span>
            <span className="text-xs font-bold text-[#F4C430]">{pct}% complete</span>
          </div>
        </div>

        {!progressLoading && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatCard
              label="Roadmap"
              value={completed + '/' + total}
              sub="tasks done"
              accent="#C0392B"
              pct={pct}
            />
            <StatCard
              label="Gov regs"
              value={govDoneCount + '/' + GOV_TOTAL}
              sub="registered"
              accent="#1E8449"
              pct={Math.round((govDoneCount / GOV_TOTAL) * 100)}
            />
            <StatCard
              label="Profile"
              value={pct + '%'}
              sub="complete"
              accent="#F4C430"
              pct={pct}
            />
          </div>
        )}

        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          What do you want to do?
        </p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {NAV_ITEMS.map(function(item) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className={item.color + ' rounded-2xl p-4 border border-[#EAE4DC] hover:scale-[1.02] active:scale-[0.98] transition-transform'}
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className={'text-sm font-bold mb-1 ' + (item.dark ? 'text-[#F4C430]' : 'text-[#1C0A08]')}>
                  {item.label}
                </div>
                <div className={'text-xs leading-relaxed ' + (item.dark ? 'text-white/50' : 'text-gray-400')}>
                  {item.desc}
                </div>
              </Link>
            )
          })}
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Ask Kuya AI
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {QUICK_ASKS.map(function(q) {
            return (
              <button
                key={q}
                onClick={function() {
                  navigate('/dashboard/chat', { state: { initialMessage: q } })
                }}
                className="bg-white border border-[#EAE4DC] rounded-full px-4 py-2 text-xs font-medium text-[#1C0A08] whitespace-nowrap hover:border-[#C0392B] transition-colors flex-shrink-0"
              >
                {q}
              </button>
            )
          })}
        </div>

        <Link
          to="/dashboard/chat"
          className="bg-[#1C0A08] rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-[#F4C430] flex items-center justify-center text-2xl flex-shrink-0">
            🤙
          </div>
          <div>
            <div className="text-sm font-bold text-[#F4C430]">Kuya AI is ready</div>
            <div className="text-xs text-white/50 mt-0.5 leading-relaxed">
              Uy {firstName}! May tanong ka ba? Nandito ako para tulungan ka!
            </div>
          </div>
          <div className="ml-auto text-white/30 text-xl flex-shrink-0">›</div>
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAE4DC] flex items-center z-50">
        {[
          { icon: '🏠', label: 'Home', to: '/dashboard' },
          { icon: '🗺️', label: 'Roadmap', to: '/dashboard/roadmap' },
          { icon: '🤙', label: 'Kuya AI', to: '/dashboard/chat' },
          { icon: '💼', label: 'Jobs', to: '/dashboard/jobs' },
          { icon: '👤', label: 'Profile', to: '/dashboard/profile' },
        ].map(function(item) {
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-400 hover:text-[#C0392B] transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}