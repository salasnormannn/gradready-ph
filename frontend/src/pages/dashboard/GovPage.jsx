import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/ui/PageLayout'

const GOV_ITEMS = [
  {
    id: 'tin',
    icon: '🪪',
    name: 'TIN / BIR',
    desc: 'Tax Identification Number',
    time: '1-2 hours',
    fee: 'Free',
    link: 'https://www.bir.gov.ph',
    kuyaPrompt: 'How do I register for TIN as a fresh graduate in the Philippines?',
  },
  {
    id: 'sss',
    icon: '🛡️',
    name: 'SSS',
    desc: 'Social Security System',
    time: '30 mins',
    fee: 'Free',
    link: 'https://www.sss.gov.ph',
    kuyaPrompt: 'How do I register for SSS online as a fresh graduate?',
  },
  {
    id: 'nbi',
    icon: '📋',
    name: 'NBI Clearance',
    desc: 'National Bureau of Investigation',
    time: '1-3 hours',
    fee: 'P155',
    link: 'https://clearance.nbi.gov.ph',
    kuyaPrompt: 'What documents do I need for NBI clearance? Paano mag-apply online?',
  },
  {
    id: 'philhealth',
    icon: '🏥',
    name: 'PhilHealth',
    desc: 'Philippine Health Insurance',
    time: '30 mins',
    fee: 'Free',
    link: 'https://www.philhealth.gov.ph',
    kuyaPrompt: 'How do I register for PhilHealth as a fresh graduate?',
  },
  {
    id: 'pagibig',
    icon: '🏠',
    name: 'Pag-IBIG / HDMF',
    desc: 'Housing Development Mutual Fund',
    time: '30 mins',
    fee: 'Free',
    link: 'https://www.pagibigfund.gov.ph',
    kuyaPrompt: 'How do I register for Pag-IBIG? What are the benefits for fresh grads?',
  },
  {
    id: 'philsys',
    icon: '🇵🇭',
    name: 'National ID (PhilSys)',
    desc: 'Philippine Identification System',
    time: '1-2 hours',
    fee: 'Free',
    link: 'https://www.philsys.gov.ph',
    kuyaPrompt: 'How do I get my Philippine National ID? What are the requirements?',
  },
]

const STATUS_CONFIG = {
  done: {
    label: 'Done',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  in_progress: {
    label: 'In progress',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  not_started: {
    label: 'Not started',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-300',
  },
}

function StatusBadge(props) {
  var cfg = props.cfg
  function handleClick(e) {
    e.stopPropagation()
    props.onClick()
  }
  return (
    <button
      onClick={handleClick}
      className={cfg.bg + ' ' + cfg.text + ' text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1'}
    >
      <span className={cfg.dot + ' w-1.5 h-1.5 rounded-full inline-block'} />
      {cfg.label}
    </button>
  )
}

function GovCard(props) {
  var item = props.item
  var status = props.status
  var cfg = STATUS_CONFIG[status]
  var navigate = props.navigate

  function handleKuya() {
    navigate('/dashboard/chat', {
      state: { initialMessage: item.kuyaPrompt },
    })
  }

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-xl flex-shrink-0">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[#1C0A08]">{item.name}</span>
            <StatusBadge cfg={cfg} onClick={props.onCycleStatus} />
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
          <div className="flex gap-3 mt-1">
            <span className="text-xs text-gray-400">Time: {item.time}</span>
            <span className="text-xs text-gray-400">Fee: {item.fee}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleKuya}
          className="flex-1 bg-[#1C0A08] text-[#F4C430] text-xs font-bold py-2.5 rounded-xl"
        >
          Ask Kuya AI
        </button>
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-[#F7F3EE] text-[#1C0A08] text-xs font-bold py-2.5 rounded-xl text-center border border-[#EAE4DC]"
        >
          Official site
        </a>
      </div>
    </div>
  )
}

export default function GovPage() {
  var navigate = useNavigate()
  var initialStatuses = {}
  GOV_ITEMS.forEach(function(item) {
    initialStatuses[item.id] = 'not_started'
  })
  var statusState = useState(initialStatuses)
  var statuses = statusState[0]
  var setStatuses = statusState[1]

  function cycleStatus(id) {
    var order = ['not_started', 'in_progress', 'done']
    setStatuses(function(prev) {
      var current = prev[id]
      var nextIndex = (order.indexOf(current) + 1) % order.length
      var next = order[nextIndex]
      var updated = Object.assign({}, prev)
      updated[id] = next
      return updated
    })
  }

  var doneCount = Object.values(statuses).filter(function(s) {
    return s === 'done'
  }).length

  var progressPct = Math.round((doneCount / GOV_ITEMS.length) * 100)

  return (
    <PageLayout title="Gov registrations">

      <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-[#1C0A08]">Registration progress</span>
          <span className="text-sm font-black text-[#C0392B]">{doneCount}/{GOV_ITEMS.length}</span>
        </div>
        <div className="h-2 bg-[#F0EBE4] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C0392B] rounded-full transition-all duration-500"
            style={{ width: progressPct + '%' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Tap status badge to update. Tap Ask Kuya AI for step-by-step guide.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {GOV_ITEMS.map(function(item) {
          return (
            <GovCard
              key={item.id}
              item={item}
              status={statuses[item.id]}
              navigate={navigate}
              onCycleStatus={function() { cycleStatus(item.id) }}
            />
          )
        })}
      </div>

    </PageLayout>
  )
}