import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/ui/PageLayout'
import useAuthStore from '../../store/authStore'

var GOV_ITEMS = [
  {
    id: 'tin',
    icon: '🪪',
    name: 'TIN / BIR',
    desc: 'Tax Identification Number',
    time: '30 mins (online) or 1-2 hrs (walk-in)',
    fee: 'Free',
    link: 'https://orus.bir.gov.ph',
    kuyaPrompt: 'How do I register for TIN as a fresh graduate in the Philippines? Give me step by step instructions.',
    steps: [
      'Go to orus.bir.gov.ph and create a BIR ORUS account using your email',
      'Click "New Application" and select taxpayer type — choose "Individual"',
      'If you are a new employee: select Form 1902 (Compensation Income Earner)',
      'If freelancing or self-employed: select Form 1901',
      'Fill out all required fields: full name, birthdate, address, contact info',
      'Upload a valid government ID (passport, driver\'s license, or any primary ID)',
      'Submit your application online — your TIN will be issued digitally',
      'Download your Digital TIN ID from the ORUS portal',
      'Note: TIN is FREE. Never pay anyone to get your TIN.',
    ],
    requirements: ['Valid government ID', 'Personal email address', 'Home address'],
  },
  {
    id: 'sss',
    icon: '🛡️',
    name: 'SSS',
    desc: 'Social Security System',
    time: '30 mins (online)',
    fee: 'Free',
    link: 'https://my.sss.gov.ph',
    kuyaPrompt: 'How do I register for SSS online as a fresh graduate? Give me step by step instructions.',
    steps: [
      'Go to my.sss.gov.ph and click "Not yet registered in My.SSS?"',
      'Select membership type: Employed, Self-Employed, or Voluntary',
      'Fill out your personal details: full name, birthdate, civil status',
      'Enter your contact information: email, mobile number, home address',
      'Upload a valid government ID with photo and signature',
      'Submit the form — your SS Number will be sent to your email within 1-3 business days',
      'Once you receive your SS Number, log in to My.SSS to complete your profile',
      'Your employer will automatically deduct your monthly contributions from your salary',
    ],
    requirements: ['Valid government ID', 'Personal email address', 'Mobile number'],
  },
  {
    id: 'nbi',
    icon: '📋',
    name: 'NBI Clearance',
    desc: 'National Bureau of Investigation',
    time: '1-3 hours (with appointment)',
    fee: 'P155 (P130 + P25 e-clearance fee)',
    link: 'https://clearance.nbi.gov.ph',
    kuyaPrompt: 'How do I get an NBI clearance? What documents do I need to bring on appointment day?',
    steps: [
      'Go to clearance.nbi.gov.ph and create an account with your email',
      'Log in and click "Apply for NBI Clearance"',
      'Fill in your personal information accurately (must match your valid ID)',
      'Choose your preferred NBI branch and available appointment date and time',
      'Select your payment method: online (GCash, Maya, credit card) or payment centers (7-Eleven, Bayad Center)',
      'Pay the fee of P155 and save your receipt',
      'Print your Application Form with QR code',
      'On appointment day: bring printed form, official receipt, and ONE valid government ID',
      'Present documents at the NBI office, biometrics will be taken',
      'If "No Hit": clearance released same day (30-60 minutes)',
      'If "Hit": come back after 7-10 business days with your birth certificate',
    ],
    requirements: ['Printed application form with QR code', 'Official receipt of payment', '1 valid government ID with photo and signature'],
  },
  {
    id: 'philhealth',
    icon: '🏥',
    name: 'PhilHealth',
    desc: 'Philippine Health Insurance',
    time: '30 mins (online or walk-in)',
    fee: 'Free to register',
    link: 'https://www.philhealth.gov.ph',
    kuyaPrompt: 'How do I register for PhilHealth as a fresh graduate? Give me step by step instructions.',
    steps: [
      'Option A (Online): Go to philhealth.gov.ph and click "Online Services" then "Member Registration"',
      'Fill out the online PMRF (PhilHealth Membership Registration Form)',
      'Enter your personal details, address, and beneficiary information',
      'Submit the form — your PhilHealth Identification Number (PIN) will be sent to your email',
      'Option B (Walk-in): Go to any PhilHealth Local Health Insurance Office (LHIO)',
      'Get a PMRF form and fill it out at the office',
      'Submit form with one valid government ID',
      'Receive your PIN on the same day',
      'If employed: inform your HR department of your PhilHealth PIN for automatic deduction',
      'If self-paying: pay monthly at PhilHealth offices, Bayad Center, GCash, or partner banks',
    ],
    requirements: ['Valid government ID', 'Personal email address', 'Beneficiary information (optional)'],
  },
  {
    id: 'pagibig',
    icon: '🏠',
    name: 'Pag-IBIG / HDMF',
    desc: 'Housing Development Mutual Fund',
    time: '30 mins (online)',
    fee: 'Free to register',
    link: 'https://www.pagibigfund.gov.ph',
    kuyaPrompt: 'How do I register for Pag-IBIG as a fresh graduate? What are the benefits?',
    steps: [
      'Go to pagibigfund.gov.ph and click "Member" then "Online Membership Registration"',
      'Fill out the Membership Registration Form (MRF-1) with your personal details',
      'Enter your employer information if already employed',
      'Submit the form — your Pag-IBIG MID Number will be generated immediately',
      'Save or screenshot your MID Number',
      'Option: Walk-in to any Pag-IBIG branch with valid ID to register in person',
      'Inform your HR department of your MID Number for automatic monthly deductions',
      'Contributions: P100/month employee share (up to P100 maximum)',
      'Bonus: Consider enrolling in MP2 (Modified Pag-IBIG 2) for 6-7% annual dividends',
    ],
    requirements: ['Valid government ID', 'Personal email address', 'Employer information (if employed)'],
  },
  {
    id: 'philsys',
    icon: '🇵🇭',
    name: 'National ID (PhilSys)',
    desc: 'Philippine Identification System',
    time: '1-2 hours (on-site registration)',
    fee: 'Free',
    link: 'https://philsys.gov.ph',
    kuyaPrompt: 'How do I get my Philippine National ID (PhilSys)? What are the requirements?',
    steps: [
      'Step 1 (Online Pre-registration): Go to philsys.gov.ph or download the PhilSys app',
      'Fill out your personal information: full name, birthdate, place of birth, address',
      'Choose your preferred PSA registration center and schedule',
      'Save your transaction reference number',
      'Step 2 (On-site Registration): Go to your scheduled registration center on your appointment date',
      'Bring your primary document (birth certificate + secondary ID, or passport, driver\'s license, UMID)',
      'Your photo, fingerprints, and iris scan will be captured',
      'Sign the registration form',
      'Receive your transaction slip with your PhilSys Number (PSN)',
      'Physical card delivery: 2-6 months via PhilPost to your registered address',
      'Use your transaction slip as temporary ID while waiting for the card',
    ],
    requirements: ['PSA Birth Certificate', 'Any secondary ID (school ID, barangay ID)', 'OR: Passport, Driver\'s License, UMID (any one)'],
  },
]

var STATUS_CONFIG = {
  done: { label: 'Done', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  in_progress: { label: 'In progress', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  not_started: { label: 'Not started', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-300' },
}

var STORAGE_KEY = 'gradready-gov-statuses'

function loadStatuses() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  var defaults = {}
  GOV_ITEMS.forEach(function(item) { defaults[item.id] = 'not_started' })
  return defaults
}

function saveStatuses(statuses) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses)) } catch (e) {}
}

function GovCard(props) {
  var item = props.item
  var status = props.status
  var cfg = STATUS_CONFIG[status]
  var navigate = props.navigate

  var expandedState = useState(false)
  var expanded = expandedState[0]
  var setExpanded = expandedState[1]

  var stepsExpandedState = useState(false)
  var stepsExpanded = stepsExpandedState[0]
  var setStepsExpanded = stepsExpandedState[1]

  function handleCycleStatus(e) {
    e.stopPropagation()
    props.onCycleStatus()
  }

  function handleKuya() {
    navigate('/dashboard/chat', { state: { initialMessage: item.kuyaPrompt } })
  }

  function handleOfficialSite() {
    window.open(item.link, '_blank')
  }

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl overflow-hidden">
      <div
        className="p-4 cursor-pointer"
        onClick={function() { setExpanded(!expanded) }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-xl flex-shrink-0">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-bold text-[#1C0A08]">{item.name}</span>
              <button
                onClick={handleCycleStatus}
                className={cfg.bg + ' ' + cfg.text + ' text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1'}
              >
                <span className={cfg.dot + ' w-1.5 h-1.5 rounded-full inline-block'} />
                {cfg.label}
              </button>
            </div>
            <div className="text-xs text-gray-400">{item.desc}</div>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-gray-400">Time: {item.time}</span>
              <span className="text-xs text-gray-400">Fee: {item.fee}</span>
            </div>
          </div>
          <div className="text-gray-300 text-sm flex-shrink-0">
            {expanded ? 'v' : '>'}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#F7F3EE]">

          <div className="mt-3 mb-3">
            <div className="text-xs font-bold text-[#888] uppercase tracking-wide mb-2">
              Requirements
            </div>
            <div className="flex flex-col gap-1">
              {item.requirements.map(function(req, i) {
                return (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#1C0A08]">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">ok</span>
                    <span>{req}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={function() { setStepsExpanded(!stepsExpanded) }}
            className="w-full text-left text-xs font-bold text-[#C0392B] mb-2 py-1"
          >
            {stepsExpanded ? 'Hide step-by-step guide' : 'Show step-by-step guide'}
          </button>

          {stepsExpanded && (
            <div className="flex flex-col gap-2 mb-3">
              {item.steps.map(function(step, i) {
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#C0392B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-xs text-[#1C0A08] leading-relaxed">{step}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleKuya}
              className="flex-1 bg-[#1C0A08] text-[#F4C430] text-xs font-bold py-2.5 rounded-xl"
            >
              Ask Kuya AI
            </button>
            <button
              onClick={handleOfficialSite}
              className="flex-1 bg-[#F7F3EE] text-[#1C0A08] text-xs font-bold py-2.5 rounded-xl border border-[#EAE4DC]"
            >
              Official site
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GovPage() {
  var navigate = useNavigate()

  var statusState = useState(loadStatuses)
  var statuses = statusState[0]
  var setStatuses = statusState[1]

  var authStore = useAuthStore()
  var user = authStore.user
  var userId = user && user.userId ? user.userId : 'guest'
  var STORAGE_KEY = 'gradready-gov-statuses-' + userId

  useEffect(function() {
    saveStatuses(statuses)
    // Dispatch event so dashboard can listen for updates
    window.dispatchEvent(new Event('gov-status-updated'))
  }, [statuses])

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

  var doneCount = Object.values(statuses).filter(function(s) { return s === 'done' }).length
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
          Tap any card to expand. Tap the status badge to update progress.
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