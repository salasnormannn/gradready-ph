import { useState } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

// ALL courses that require PRC board exam in the Philippines
var BOARD_EXAM_KEYWORDS = [
  'nursing',
  'accountancy',
  'accounting',
  'civil engineering',
  'electrical engineering',
  'mechanical engineering',
  'chemical engineering',
  'electronics engineering',
  'computer engineering',
  'geodetic engineering',
  'sanitary engineering',
  'metallurgical engineering',
  'ceramics engineering',
  'architecture',
  'medicine',
  'pharmacy',
  'education',
  'dentistry',
  'criminology',
  'psychology',
  'physical therapy',
  'occupational therapy',
  'radiologic technology',
  'respiratory therapy',
  'medical technology',
  'nutrition',
  'dietetics',
  'social work',
  'real estate',
  'interior design',
  'landscape architecture',
  'naval architecture',
  'master plumber',
  'master electrician',
  'electronics technician',
]

function isBoardExamCourse(course) {
  if (!course) return false
  var lower = course.toLowerCase()
  // Check if any board exam keyword is in the course name
  return BOARD_EXAM_KEYWORDS.some(function(keyword) {
    return lower.includes(keyword)
  })
}

var WITTY_MESSAGES = [
  {
    emoji: '🎉',
    title: 'Lucky you — no boards!',
    message: "Congrats! Your course doesn't require a PRC licensure exam. While your batchmates are memorizing 10,000 practice questions and stress-eating review materials, you can focus 100% on landing your dream job. You are already ahead of the game!",
    tip: 'Pro tip: Get industry certifications instead — AWS, Google, PMP, or CFA can boost your salary just as much as a board rating.',
  },
  {
    emoji: '😌',
    title: 'Board exam? Not your problem.',
    message: "No PRC exam for you, friend! While nursing and engineering students are paying P15,000-P30,000 for review centers, you are out here living your best life. Channel that energy into polishing your resume and crushing job interviews instead.",
    tip: 'Use Kuya AI to prep for job interviews instead — same nervous energy, way less paperwork and review books.',
  },
  {
    emoji: '🏖️',
    title: 'Free from the board exam grind!',
    message: "Your diploma is your license. No oath-taking ceremony, no PRC ID renewal every 3 years, no review center fees. That is P15,000-P30,000 you get to keep. Maybe treat yourself — you deserve it for surviving college.",
    tip: 'Invest that review center money instead. P20,000 in Pag-IBIG MP2 for 5 years = roughly P28,000+ with dividends.',
  },
]

function useSchedules() {
  return useQuery({
    queryKey: ['board-exam-schedules'],
    queryFn: async function() {
      var res = await api.get('/api/board-exam/schedules')
      return res.data
    },
  })
}

function NotBoardExamUser(props) {
  var navigate = props.navigate
  var course = props.course

  // Pick a consistent witty message based on course string
  var msgIndex = course ? (course.length % WITTY_MESSAGES.length) : 0
  var msg = WITTY_MESSAGES[msgIndex]

  function handleJobSearch() {
    navigate('/dashboard/jobs')
  }

  function handleInterviewPrep() {
    navigate('/dashboard/chat', {
      state: {
        initialMessage: 'Give me job interview tips and common interview questions for a fresh ' + (course || 'graduate') + ' in the Philippines.',
      },
    })
  }

  function handleCertifications() {
    navigate('/dashboard/chat', {
      state: {
        initialMessage: 'What industry certifications should I get to boost my career as a ' + (course || 'fresh graduate') + ' in the Philippines? Rank them by ROI and cost.',
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#1C0A08] rounded-2xl p-5 text-center">
        <div className="text-4xl mb-3">{msg.emoji}</div>
        <div className="text-lg font-black text-[#F4C430] mb-2">{msg.title}</div>
        <div className="text-sm text-white/70 leading-relaxed mb-4">{msg.message}</div>
        <div className="bg-white/10 rounded-xl p-3 text-xs text-white/50 leading-relaxed italic">
          {msg.tip}
        </div>
      </div>

      <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4">
        <div className="text-sm font-black text-[#1C0A08] mb-1">
          Focus on these instead
        </div>
        <div className="text-xs text-gray-400 mb-3 leading-relaxed">
          No boards? No problem. Here is what matters most for your career right now.
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleJobSearch}
            className="w-full bg-[#C0392B] text-white text-xs font-bold py-3 rounded-xl"
          >
            Find jobs matched to my course
          </button>
          <button
            onClick={handleInterviewPrep}
            className="w-full bg-[#1C0A08] text-[#F4C430] text-xs font-bold py-3 rounded-xl"
          >
            Prepare for job interviews
          </button>
          <button
            onClick={handleCertifications}
            className="w-full bg-[#F7F3EE] text-[#1C0A08] text-xs font-bold py-3 rounded-xl border border-[#EAE4DC]"
          >
            What certifications should I get?
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <div className="text-sm font-bold text-amber-800 mb-1">
          Wait — are you sure?
        </div>
        <div className="text-xs text-amber-700 mb-3 leading-relaxed">
          Some courses have optional PRC exams or industry certifications.
          Ask Kuya AI if there is anything specific for your field.
        </div>
        <button
          onClick={function() {
            navigate('/dashboard/chat', {
              state: {
                initialMessage: 'Do I need any PRC licensure exam or government certification for a ' + (course || 'fresh graduate') + ' in the Philippines?',
              },
            })
          }}
          className="bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          Ask Kuya AI to double check
        </button>
      </div>
    </div>
  )
}

function ScheduleCard(props) {
  var s = props.schedule

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4">
      <div className="text-sm font-black text-[#1C0A08] mb-2">{s.exam}</div>
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex gap-2 text-xs">
          <span className="text-gray-400 w-20 flex-shrink-0">Schedule</span>
          <span className="text-[#1C0A08] font-medium">{s.schedule}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-gray-400 w-20 flex-shrink-0">Fee</span>
          <span className="text-[#1C0A08] font-medium">{s.fee}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-gray-400 w-20 flex-shrink-0">Subjects</span>
          <span className="text-[#1C0A08] font-medium">{s.subjects}</span>
        </div>
      </div>
      <button
        onClick={function() { window.open('https://www.prc.gov.ph', '_blank') }}
        className="w-full text-center bg-[#F7F3EE] text-[#1C0A08] text-xs font-bold py-2 rounded-xl border border-[#EAE4DC]"
      >
        Register at prc.gov.ph
      </button>
    </div>
  )
}

function StudyPlanGenerator() {
  var navigate = useNavigate()

  var examDateState = useState('')
  var examDate = examDateState[0]
  var setExamDate = examDateState[1]

  var weakState = useState('')
  var weakSubjects = weakState[0]
  var setWeakSubjects = weakState[1]

  var planState = useState('')
  var studyPlan = planState[0]
  var setStudyPlan = planState[1]

  var loadingState = useState(false)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  async function handleGenerate() {
    if (!examDate) return
    setLoading(true)
    try {
      var res = await api.post('/api/board-exam/study-plan', {
        examDate: examDate,
        weakSubjects: weakSubjects,
      })
      setStudyPlan(res.data.studyPlan)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4">
      <div className="text-sm font-black text-[#1C0A08] mb-3">Generate AI study plan</div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Exam date</label>
          <input
            type="date"
            value={examDate}
            onChange={function(e) { setExamDate(e.target.value) }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#EAE4DC] text-sm text-[#1C0A08] outline-none focus:border-[#C0392B]"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Weak subjects (optional)</label>
          <input
            type="text"
            value={weakSubjects}
            onChange={function(e) { setWeakSubjects(e.target.value) }}
            placeholder="e.g. Circuit Analysis, Power Systems"
            className="w-full px-3 py-2.5 rounded-xl border border-[#EAE4DC] text-sm text-[#1C0A08] outline-none focus:border-[#C0392B] placeholder:text-gray-300"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !examDate}
          className="w-full bg-[#C0392B] text-white text-xs font-bold py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? 'Generating your study plan...' : 'Generate AI study plan'}
        </button>
      </div>

      {studyPlan && (
        <div className="mt-4 p-3 bg-[#F7F3EE] rounded-xl">
          <div className="text-xs font-bold text-[#1C0A08] mb-2">Your personalized study plan</div>
          <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{studyPlan}</div>
        </div>
      )}
    </div>
  )
}

export default function BoardExamPage() {
  var navigate = useNavigate()
  var authStore = useAuthStore()
  var user = authStore.user
  var course = user && user.course ? user.course : ''

  var schedulesResult = useSchedules()
  var schedules = schedulesResult.data || []
  var isBoard = isBoardExamCourse(course)

  return (
    <PageLayout title="Board exam tracker">

      {!isBoard ? (
        <NotBoardExamUser navigate={navigate} course={course} />
      ) : (
        <div className="flex flex-col gap-4">

          <div className="bg-[#1C0A08] rounded-2xl p-4">
            <div className="text-xs font-bold text-[#F4C430] uppercase tracking-wide mb-1">
              Your course
            </div>
            <div className="text-lg font-black text-white">{course}</div>
            <div className="text-xs text-white/40 mt-1">
              Requires PRC licensure exam
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Exam schedules
          </p>

          {schedulesResult.isLoading && (
            <div className="flex flex-col gap-3">
              <div className="h-24 bg-white rounded-2xl animate-pulse border border-[#EAE4DC]" />
              <div className="h-24 bg-white rounded-2xl animate-pulse border border-[#EAE4DC]" />
            </div>
          )}

          {!schedulesResult.isLoading && schedules.map(function(s, i) {
            return <ScheduleCard key={i} schedule={s} />
          })}

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Study tools
          </p>

          <StudyPlanGenerator />

          <div className="bg-[#1C0A08] rounded-2xl p-4">
            <div className="text-sm font-black text-[#F4C430] mb-1">
              Ask Kuya AI for review tips
            </div>
            <div className="text-xs text-white/50 mb-3">
              Specific advice on review strategies, materials, and mindset tips
            </div>
            <button
              onClick={function() {
                navigate('/dashboard/chat', {
                  state: {
                    initialMessage: 'Give me board exam review tips and strategies for ' + course + '. What are the best review centers, study materials, and how many months should I prepare?',
                  },
                })
              }}
              className="w-full bg-[#F4C430] text-[#1C0A08] text-xs font-bold py-2.5 rounded-xl"
            >
              Ask Kuya AI for review tips
            </button>
          </div>

        </div>
      )}
    </PageLayout>
  )
}