import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🗺️',
    title: 'Personalized roadmap',
    desc: 'Week-by-week checklist tailored to your course, region, and employment status.',
    tag: 'Core feature',
    tagColor: 'bg-red-50 text-[#C0392B]'
  },
  {
    icon: '🏛️',
    title: 'Gov registration guide',
    desc: 'Step-by-step for TIN, SSS, PhilHealth, Pag-IBIG, NBI clearance, and National ID.',
    tag: 'RAG-powered',
    tagColor: 'bg-green-50 text-green-800'
  },
  {
    icon: '💼',
    title: 'AI job search',
    desc: 'Aggregates jobs from Indeed, LinkedIn, JobStreet, and Kalibrr. AI scores each listing for your fit.',
    tag: 'Available now',
    tagColor: 'bg-blue-50 text-blue-800'
  },
  {
    icon: '📄',
    title: 'Smart resume builder',
    desc: 'AI generates an ATS-optimized resume. Philippine-context aware — TOR, board ratings included.',
    tag: 'Available now',
    tagColor: 'bg-blue-50 text-blue-800'
  },
  {
    icon: '💰',
    title: 'Financial literacy',
    desc: 'First salary guide, budgeting, GCash vs Maya, UITF investments, and ITR filing for Filipinos.',
    tag: 'Coming soon',
    tagColor: 'bg-amber-50 text-amber-800'
  },
  {
    icon: '🎓',
    title: 'Board exam tracker',
    desc: 'PRC schedules, review centers, AI study plans for nursing, engineering, CPA, architecture grads.',
    tag: 'Coming soon',
    tagColor: 'bg-amber-50 text-amber-800'
  },
]

const steps = [
  { n: '01', title: 'Create your free account', desc: 'Sign up in 30 seconds. No credit card, no nonsense.' },
  { n: '02', title: 'Tell us about yourself', desc: 'Your course, school, region, and what you\'re up to after graduation.' },
  { n: '03', title: 'Get your roadmap', desc: 'Kuya AI builds your personalized week-by-week post-grad plan instantly.' },
  { n: '04', title: 'Navigate with confidence', desc: 'Every gov reg, job application, and financial decision — guided.' },
]

const chats = [
  { from: 'kuya', msg: 'Uy! Kamusta? I\'m Kuya AI — your post-grad big brother. Anong kailangan mo ngayon? 😊' },
  { from: 'user', msg: 'Kuya, paano mag-register sa PhilHealth? First time ko.' },
  { from: 'kuya', msg: 'Sige! Kailangan mo ng: valid ID, PMRF form, at certificate of employment. Pwede online sa philhealth.gov.ph o pumunta sa pinakamalapit na office. 30 minutes lang!' },
  { from: 'user', msg: 'Salamat Kuya! Pwede mo rin tulungan ako sa resume?' },
  { from: 'kuya', msg: 'Syempre! Pumunta ka sa Resume Builder — gagawa ako ng ATS-optimized resume para sa iyo. Kaya natin \'to! 💪' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EE] font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#F7F3EE] border-b border-[#E5DDD3] flex items-center justify-between px-[5%] py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#C0392B] rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-[#F4C430] font-black text-lg leading-none">G</span>
          </div>
          <span className="font-black text-[#1C0A08] text-base tracking-tight">GradReady PH</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="#features" className="hidden md:block text-sm text-gray-500 px-3 py-2 hover:text-[#1C0A08] font-medium">Features</a>
          <a href="#how" className="hidden md:block text-sm text-gray-500 px-3 py-2 hover:text-[#1C0A08] font-medium">How it works</a>
          <a href="#kuya" className="hidden md:block text-sm text-gray-500 px-3 py-2 hover:text-[#1C0A08] font-medium">Kuya AI</a>
          <Link to="/login" className="text-sm font-semibold bg-[#1C0A08] text-white px-4 py-2 rounded-xl ml-2">Sign in</Link>
          <Link to="/register" className="text-sm font-bold bg-[#C0392B] text-white px-4 py-2 rounded-xl">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-[5%] py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5DDD3] rounded-full px-4 py-2 text-xs font-bold text-[#1C0A08] mb-7">
              🇵🇭 Built for Filipino fresh graduates
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#1C0A08] leading-[1.05] tracking-tight mb-5">
              Life after<br />graduation<br />just got{' '}
              <span className="text-[#C0392B]">easier.</span>
            </h1>
            <p className="text-base lg:text-lg text-gray-500 leading-relaxed mb-9 max-w-lg">
              Your all-in-one post-grad companion — from TIN registration to landing your dream job. Guided by Kuya AI, every step of the way.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/register" className="bg-[#C0392B] text-white font-bold px-7 py-4 rounded-xl text-sm hover:bg-[#A93226] transition-colors">
                Get started for free →
              </Link>
              <Link to="/login" className="bg-white text-[#1C0A08] font-semibold px-7 py-4 rounded-xl text-sm border border-[#E5DDD3] hover:border-gray-400 transition-colors">
                Sign in
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[['JD','#FADBD8','#C0392B'],['MA','#D5F5E3','#1E8449'],['RL','#D6EAF8','#1A5276'],['KS','#FEF9E7','#9A6005']].map(([init,bg,color],i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#F7F3EE] -ml-2 first:ml-0 flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: bg, color }}>
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="font-bold text-[#1C0A08]">2,400+ fresh grads</span> already on their journey
              </p>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            <div className="relative">
              {/* Floating cards — desktop only */}
              <div className="hidden lg:block absolute -top-5 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-[#E5DDD3] z-10 min-w-[140px]">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Profile complete</div>
                <div className="text-2xl font-black text-[#1C0A08]">38%</div>
                <div className="text-xs text-gray-400 mt-1"><span className="inline-block w-2 h-2 rounded-full bg-[#F4C430] mr-1"></span>Keep going!</div>
              </div>
              <div className="hidden lg:block absolute -bottom-4 -left-10 bg-white rounded-2xl p-4 shadow-xl border border-[#E5DDD3] z-10 min-w-[160px]">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Job matches today</div>
                <div className="text-2xl font-black text-[#1C0A08]">12 new</div>
                <div className="text-xs text-gray-400 mt-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>GCash · Shopee</div>
              </div>

              {/* Phone */}
              <div className="w-[260px] lg:w-[300px] bg-[#1C0A08] rounded-[40px] p-3 shadow-2xl">
                <div className="bg-[#F7F3EE] rounded-[32px] overflow-hidden p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#C0392B] rounded-lg flex items-center justify-center">
                        <span className="text-[#F4C430] font-black text-xs">G</span>
                      </div>
                      <span className="font-black text-[#1C0A08] text-xs">GradReady</span>
                    </div>
                    <span className="text-lg">🔔</span>
                  </div>
                  <div className="bg-[#1C0A08] rounded-2xl p-4 mb-3">
                    <div className="inline-block bg-[#C0392B] text-white text-[9px] font-bold px-2 py-1 rounded-full mb-2">WEEK 2 · NCR</div>
                    <div className="text-sm font-black text-white mb-1">Kamusta, <span className="text-[#F4C430]">Norman!</span></div>
                    <div className="text-[10px] text-white/50">Ahead of 68% of fresh grads</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[['🗺️','Roadmap','3 of 8 done'],['🏛️','Gov regs','2 of 6 done'],['💼','Jobs','12 matches'],['💰','Finance','Guide ready']].map(([ic,t,s]) => (
                      <div key={t} className="bg-white rounded-xl p-3 border border-[#E5DDD3]">
                        <div className="text-base mb-1">{ic}</div>
                        <div className="text-[11px] font-bold text-[#1C0A08]">{t}</div>
                        <div className="text-[10px] text-gray-400">{s}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#1C0A08] rounded-xl p-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F4C430] flex items-center justify-center text-sm flex-shrink-0">🤙</div>
                    <div>
                      <div className="text-[10px] font-bold text-[#F4C430]">Kuya AI</div>
                      <div className="text-[9px] text-white/50 mt-0.5">Anong kailangan mo ngayon?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-[5%] py-16 max-w-[1400px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-[#C0392B] mb-3">Everything you need</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <h2 className="text-4xl lg:text-5xl font-black text-[#1C0A08] tracking-tight leading-tight">
            One app.<br />Everything covered.
          </h2>
          <p className="text-base text-gray-400 max-w-sm leading-relaxed">
            From your first day after graduation to your first paycheck — and beyond.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-white border border-[#E5DDD3] rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="text-lg font-black text-[#1C0A08] mb-2 tracking-tight">{f.title}</div>
              <div className="text-sm text-gray-400 leading-relaxed mb-4">{f.desc}</div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${f.tagColor}`}>{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Kuya AI */}
      <section id="kuya" className="mx-[5%] mb-16">
        <div className="bg-[#1C0A08] rounded-3xl p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#F4C430] mb-3">Meet your AI companion</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5">
              Say hello to<br />Kuya AI. 🤙
            </h2>
            <p className="text-base text-white/50 leading-relaxed mb-8">
              Think of Kuya AI as your older brother who's already been through all the post-grad stuff. Ask him anything — in Filipino, English, or Taglish. He gets it.
            </p>
            <Link to="/register" className="inline-block bg-[#F4C430] text-[#1C0A08] font-bold px-6 py-3 rounded-xl text-sm">
              Chat with Kuya AI →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {chats.map((c, i) => (
              <div key={i} className={`flex gap-3 items-start ${c.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${c.from === 'kuya' ? 'bg-[#F4C430]' : 'bg-[#3D1A14] text-white text-xs font-bold'}`}>
                  {c.from === 'kuya' ? '🤙' : 'NL'}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[75%] ${
                  c.from === 'kuya'
                    ? 'bg-white/10 text-white/80 rounded-tl-sm'
                    : 'bg-[#C0392B] text-white rounded-tr-sm'
                }`}>
                  {c.msg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-[5%] py-16 max-w-[1400px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-[#C0392B] mb-3">How it works</div>
        <h2 className="text-4xl lg:text-5xl font-black text-[#1C0A08] tracking-tight leading-tight mb-12">
          Up and running<br />in 5 minutes.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(s => (
            <div key={s.n} className="bg-white border border-[#E5DDD3] rounded-2xl p-7">
              <div className="text-5xl font-black text-[#F0EBE4] leading-none mb-4">{s.n}</div>
              <div className="text-lg font-black text-[#1C0A08] tracking-tight mb-2">{s.title}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-[5%] mb-16">
        <div className="bg-[#C0392B] rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              Ready to start your<br />post-grad journey?
            </h2>
            <p className="text-base text-white/60">Join 2,400+ Filipino fresh grads. Free forever.</p>
          </div>
          <Link to="/register" className="bg-white text-[#C0392B] font-bold px-8 py-4 rounded-xl text-sm whitespace-nowrap flex-shrink-0">
            Get started for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5DDD3] px-[5%] py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C0392B] rounded-lg flex items-center justify-center">
            <span className="text-[#F4C430] font-black text-sm">G</span>
          </div>
          <span className="font-black text-[#1C0A08] text-sm">GradReady PH</span>
        </div>
        <p className="text-sm text-gray-400">Made with ❤️ for Filipino fresh graduates · Free forever</p>
        <p className="text-sm text-gray-300">© 2026 GradReady PH</p>
      </footer>

    </div>
  )
}