import { useState } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../../hooks/useJobs'
import RedFlagChecker from '../../components/ui/RedFlagChecker'

var JOB_SITES = [
  {
    name: 'Kalibrr',
    desc: 'Best for fresh grads',
    url: 'https://kalibrr.com',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
  },
  {
    name: 'JobStreet',
    desc: 'Largest PH job board',
    url: 'https://jobstreet.com.ph',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
  },
  {
    name: 'LinkedIn',
    desc: 'Corporate and networking',
    url: 'https://linkedin.com/jobs',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
  },
  {
    name: 'Indeed PH',
    desc: 'High volume listings',
    url: 'https://ph.indeed.com',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
  },
  {
    name: 'OnlineJobs',
    desc: 'Remote and freelance',
    url: 'https://onlinejobs.ph',
    bg: 'bg-green-50',
    text: 'text-green-800',
  },
  {
    name: 'BossJob',
    desc: 'BPO and entry-level',
    url: 'https://bossjob.ph',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
  },
]

function getMatchStyle(match) {
  if (!match) return 'bg-gray-100 text-gray-500'
  if (match >= 85) return 'bg-green-50 text-green-700'
  if (match >= 70) return 'bg-amber-50 text-amber-700'
  return 'bg-gray-100 text-gray-500'
}

function SiteCard(props) {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noreferrer"
      className={props.bg + ' ' + props.text + ' rounded-xl p-3 text-center border border-[#EAE4DC] block hover:opacity-80 transition-opacity'}
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
  var job = props.job
  var navigate = props.navigate
  var initial = job.company ? job.company.charAt(0).toUpperCase() : 'J'

  function handleCoverLetter() {
    navigate('/dashboard/chat', {
      state: {
        initialMessage: 'Write a short cover letter (3 paragraphs, under 200 words) for '
          + job.title + ' at ' + job.company + '. Make it professional, warm, and tailored for a Filipino fresh graduate.',
      },
    })
  }

  function handleApply() {
    if (job.applyLink) {
      window.open(job.applyLink, '_blank')
    }
  }

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-base font-black text-[#C0392B] flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[#1C0A08] leading-tight">{job.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {job.company}
                {job.location ? ' · ' + job.location : ''}
              </div>
            </div>
            {job.fitScore != null && (
              <div className={'text-xs font-black px-2 py-1 rounded-full flex-shrink-0 ' + getMatchStyle(job.fitScore)}>
                {job.fitScore}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.employmentType && (
          <TagPill label={job.employmentType} />
        )}
        {job.salaryMin && job.salaryMax && (
          <TagPill label={'P' + Number(job.salaryMin).toLocaleString() + ' - P' + Number(job.salaryMax).toLocaleString()} />
        )}
        {job.salaryMin && !job.salaryMax && (
          <TagPill label={'From P' + Number(job.salaryMin).toLocaleString()} />
        )}
      </div>

      {job.description && (
        <p className="text-xs text-gray-400 mb-3 leading-relaxed line-clamp-2">
          {job.description.substring(0, 120)}...
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCoverLetter}
          className="flex-1 bg-[#1C0A08] text-[#F4C430] text-xs font-bold py-2.5 rounded-xl"
        >
          Generate cover letter
        </button>
        {job.applyLink && (
          <button
            onClick={handleApply}
            className="flex-1 bg-[#F7F3EE] text-[#1C0A08] text-xs font-bold py-2.5 rounded-xl border border-[#EAE4DC]"
          >
            Apply now
          </button>
        )}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-gray-100 rounded-full w-16" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
      </div>
      <div className="h-9 bg-gray-100 rounded-xl" />
    </div>
  )
}

export default function JobsPage() {
  var navigate = useNavigate()

  var searchInputState = useState('')
  var searchInput = searchInputState[0]
  var setSearchInput = searchInputState[1]

  var activeQueryState = useState('')
  var activeQuery = activeQueryState[0]
  var setActiveQuery = activeQueryState[1]

  var jobsResult = useJobs(activeQuery)
  var jobs = jobsResult.data && jobsResult.data.jobs ? jobsResult.data.jobs : []
  var isLoading = jobsResult.isLoading
  var isError = jobsResult.isError

  function handleSearch(e) {
    e.preventDefault()
    setActiveQuery(searchInput.trim())
  }

  return (
    <PageLayout title="Job search">

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Top job sites
      </p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {JOB_SITES.map(function(site) {
          return (
            <SiteCard
              key={site.name}
              url={site.url}
              bg={site.bg}
              text={site.text}
              name={site.name}
              desc={site.desc}
            />
          )
        })}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          type="text"
          value={searchInput}
          onChange={function(e) { setSearchInput(e.target.value) }}
          placeholder="Search e.g. nurse Metro Manila, software engineer..."
          className="flex-1 bg-white border border-[#EAE4DC] rounded-xl px-4 py-2.5 text-sm text-[#1C0A08] outline-none focus:border-[#C0392B] placeholder:text-gray-300"
        />
        <button
          type="submit"
          className="bg-[#C0392B] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex-shrink-0"
        >
          Search
        </button>
      </form>

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        {activeQuery ? 'Results for "' + activeQuery + '"' : 'AI matches for you'}
      </p>

      {isLoading && (
        <div className="flex flex-col gap-3 mb-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <div className="text-sm font-bold text-red-800 mb-1">Could not load jobs</div>
          <div className="text-xs text-red-600">
            Make sure the backend is running and try again.
          </div>
        </div>
      )}

      {!isLoading && !isError && jobs.length === 0 && (
        <div className="bg-[#F7F3EE] border border-[#EAE4DC] rounded-2xl p-6 text-center mb-6">
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-sm font-bold text-[#1C0A08] mb-1">No jobs found</div>
          <div className="text-xs text-gray-400">
            Try a different search term or check back later.
          </div>
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {jobs.map(function(job) {
            return (
              <JobCard
                key={job.id}
                job={job}
                navigate={navigate}
              />
            )
          })}
        </div>
      )}

      {/* Red Flag Checker — now with URL and text input */}
      <RedFlagChecker />

    </PageLayout>
  )
}