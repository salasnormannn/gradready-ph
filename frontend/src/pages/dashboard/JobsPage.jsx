import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'

const JOBS = [
  {
    id: 1,
    company: 'GCash',
    role: 'Junior developer',
    location: 'BGC, Taguig',
    setup: 'Hybrid',
    salary: 'P35-45k',
    match: 95,
    tags: ['React', 'Java'],
    logo: '💚',
    logoBg: 'bg-emerald-50',
    matchStyle: 'bg-green-50 text-green-700',
  },
  {
    id: 2,
    company: 'Shopee PH',
    role: 'Software engineer I',
    location: 'Makati',
    setup: 'Full WFH',
    salary: 'P40-55k',
    match: 88,
    tags: ['Python', 'Go'],
    logo: '🛒',
    logoBg: 'bg-amber-50',
    matchStyle: 'bg-green-50 text-green-700',
  },
  {
    id: 3,
    company: 'UnionBank',
    role: 'Associate developer',
    location: 'Ortigas',
    setup: 'Onsite',
    salary: 'P30-40k',
    match: 76,
    tags: ['Java', 'Spring'],
    logo: '🏦',
    logoBg: 'bg-blue-50',
    matchStyle: 'bg-amber-50 text-amber-700',
  },
  {
    id: 4,
    company: 'Kalibrr',
    role: 'Frontend engineer',
    location: 'Remote',
    setup: 'Full WFH',
    salary: 'P30-45k',
    match: 72,
    tags: ['React', 'TypeScript'],
    logo: '⚡',
    logoBg: 'bg-purple-50',
    matchStyle: 'bg-amber-50 text-amber-700',
  },
]

const JOB_SITES = [
  {
    name: 'Kalibrr',
    desc: 'Best for fresh grads',
    url: 'https://kalibrr.com',
    style: 'bg-purple-50 text-purple-800',
  },
  {
    name: 'JobStreet',
    desc: 'Largest PH job board',
    url: 'https://jobstreet.com.ph',
    style: 'bg-blue-50 text-blue-800',
  },
  {
    name: 'LinkedIn',
    desc: 'Corporate and networking',
    url: 'https://linkedin.com/jobs',
    style: 'bg-sky-50 text-sky-800',
  },
  {
    name: 'Indeed PH',
    desc: 'High volume listings',
    url: 'https://ph.indeed.com',
    style: 'bg-indigo-50 text-indigo-800',
  },
  {
    name: 'OnlineJobs',
    desc: 'Remote and freelance',
    url: 'https://onlinejobs.ph',
    style: 'bg-green-50 text-green-800',
  },
  {
    name: 'BossJob',
    desc: 'BPO and entry-level',
    url: 'https://bossjob.ph',
    style: 'bg-orange-50 text-orange-800',
  },
]

function SiteCard(props) {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noreferrer"
      className={props.style + ' rounded-xl p-3 text-center border border-[#EAE4DC] block hover:opacity-80 transition-opacity'}
    >
      <div className="text-xs font-black mb-1">{props.name}</div>
      <div className="text-xs opacity-70 leading-tight">{props.desc}</div>
    </a>
  )
}

function TagPill(props) {
  return (
    <span className="text-xs bg-[#F7F3EE] text-gray-500 font-semibold px-2 py-1 rounded-full">
      {props.label}
    </span>
  )
}

function JobCard(props) {
  const job = props.job
  const navigate = props.navigate

  function handleCoverLetter() {
    navigate('/dashboard/chat', {
      state: {
        initialMessage: 'Help me write a cover letter for ' + job.role + ' at ' + job.company,
      },
    })
  }

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className={job.logoBg + ' w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0'}>
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-[#1C0A08]">{job.role}</div>
              <div className="text-xs text-gray-400 mt-0.5">{job.company} · {job.location}</div>
            </div>
            <div className={job.matchStyle + ' text-xs font-black px-2 py-1 rounded-full flex-shrink-0'}>
              {job.match}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <TagPill label={job.setup} />
        <TagPill label={job.salary} />
        {job.tags.map(function(tag) {
          return <TagPill key={tag} label={tag} />
        })}
      </div>

      <button
        onClick={handleCoverLetter}
        className="w-full bg-[#1C0A08] text-[#F4C430] text-xs font-bold py-2.5 rounded-xl"
      >
        Generate cover letter with Kuya AI
      </button>
    </div>
  )
}

export default function JobsPage() {
  const navigate = useNavigate()

  function handleRedFlagCheck() {
    navigate('/dashboard/chat', {
      state: {
        initialMessage: 'Can you check this job posting for red flags?',
      },
    })
  }

  return (
    <PageLayout title="Job search">

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Top job sites
      </p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {JOB_SITES.map(function(site) {
          return <SiteCard key={site.name} url={site.url} style={site.style} name={site.name} desc={site.desc} />
        })}
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        AI matches for you
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {JOBS.map(function(job) {
          return <JobCard key={job.id} job={job} navigate={navigate} />
        })}
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
        <div className="text-sm font-bold text-red-800 mb-1">Red flag checker</div>
        <div className="text-xs text-red-600 mb-3 leading-relaxed">
          Paste a job posting and Kuya AI will check for red flags — no salary disclosure,
          vague roles, or suspicious requirements.
        </div>
        <button
          onClick={handleRedFlagCheck}
          className="bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          Check a job posting
        </button>
      </div>

    </PageLayout>
  )
}