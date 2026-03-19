import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { icon: '🏠', label: 'Home', to: '/dashboard' },
  { icon: '🗺️', label: 'Roadmap', to: '/dashboard/roadmap' },
  { icon: '🤙', label: 'Kuya AI', to: '/dashboard/chat' },
  { icon: '💼', label: 'Jobs', to: '/dashboard/jobs' },
  { icon: '👤', label: 'Profile', to: '/dashboard/profile' },
]

export default function PageLayout({ title, children, backTo = '/dashboard' }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#F7F3EE]">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#F7F3EE] border-b border-[#EAE4DC] px-5 py-3 flex items-center gap-3">
        <Link
          to={backTo}
          className="w-9 h-9 rounded-xl bg-white border border-[#EAE4DC] flex items-center justify-center text-[#1C0A08] font-bold flex-shrink-0"
        >
          ←
        </Link>
        <span className="font-black text-[#1C0A08] text-base">{title}</span>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6 pb-28">
        {children}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAE4DC] flex items-center z-50">
        {NAV.map(item => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors
                ${active ? 'text-[#C0392B]' : 'text-gray-400 hover:text-[#C0392B]'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-semibold ${active ? 'text-[#C0392B]' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}