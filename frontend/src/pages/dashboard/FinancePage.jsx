import { useState } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

function useFinanceGuide() {
  return useQuery({
    queryKey: ['finance-guide'],
    queryFn: async () => {
      const res = await api.get('/api/finance/guide')
      return res.data
    },
  })
}

function SalaryCalculator() {
  var inputState = useState('25000')
  var salary = inputState[0]
  var setSalary = inputState[1]

  var resultState = useState(null)
  var result = resultState[0]
  var setResult = resultState[1]

  var loadingState = useState(false)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  async function handleCalculate() {
    if (!salary || isNaN(salary)) return
    setLoading(true)
    try {
      var res = await api.post('/api/finance/calculate', {
        grossSalary: parseFloat(salary)
      })
      setResult(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-[#EAE4DC] rounded-2xl p-4 mb-5">
      <div className="text-sm font-black text-[#1C0A08] mb-3">
        Salary calculator
      </div>
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-400 block mb-1">Monthly gross salary (PHP)</label>
          <input
            type="number"
            value={salary}
            onChange={function(e) { setSalary(e.target.value) }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#EAE4DC] text-sm text-[#1C0A08] outline-none focus:border-[#C0392B]"
            placeholder="e.g. 25000"
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="bg-[#C0392B] text-white text-xs font-bold px-4 rounded-xl self-end py-2.5 flex-shrink-0 disabled:opacity-50"
        >
          {loading ? '...' : 'Calculate'}
        </button>
      </div>

      {result && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between py-2 border-b border-[#F0EBE4]">
            <span className="text-sm text-gray-500">Gross salary</span>
            <span className="text-sm font-bold text-[#1C0A08]">P{result.grossSalary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-xs text-gray-400">SSS</span>
            <span className="text-xs text-red-500">- P{result.sss.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-xs text-gray-400">PhilHealth</span>
            <span className="text-xs text-red-500">- P{result.philhealth.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-xs text-gray-400">Pag-IBIG</span>
            <span className="text-xs text-red-500">- P{result.pagibig.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-xs text-gray-400">Withholding tax</span>
            <span className="text-xs text-red-500">- P{result.withholdingTax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-[#F0EBE4] mt-1">
            <span className="text-sm font-bold text-[#1C0A08]">Take-home pay</span>
            <span className="text-sm font-black text-green-600">P{result.takeHome.toLocaleString()}</span>
          </div>
          <div className="bg-[#F7F3EE] rounded-xl p-3 mt-1">
            <div className="text-xs font-bold text-[#1C0A08] mb-2">50/30/20 breakdown</div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Needs (50%)</span>
              <span className="font-semibold">P{result.needs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Wants (30%)</span>
              <span className="font-semibold">P{result.wants.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Savings (20%)</span>
              <span className="font-semibold text-green-600">P{result.savings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FinancePage() {
  var navigate = useNavigate()
  var guideResult = useFinanceGuide()
  var guide = guideResult.data
  var topics = guide && guide.topics ? guide.topics : []
  var salaryRange = guide && guide.salary ? guide.salary : 'P18,000-P35,000'

  function handleTopicAsk(topic) {
    navigate('/dashboard/chat', {
      state: {
        initialMessage: 'Explain ' + topic.title + ' for a Filipino fresh graduate. Be practical and specific.',
      },
    })
  }

  return (
    <PageLayout title="Financial guide">

      <div className="bg-[#1C0A08] rounded-2xl p-4 mb-5">
        <div className="text-xs font-bold text-[#F4C430] mb-1 uppercase tracking-wide">
          Your estimated salary range
        </div>
        <div className="text-2xl font-black text-white">{salaryRange}</div>
        <div className="text-xs text-white/40 mt-1">Based on your course — NCR entry level</div>
      </div>

      <SalaryCalculator />

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Financial topics
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {topics.map(function(topic) {
          return (
            <button
              key={topic.id}
              onClick={function() { handleTopicAsk(topic) }}
              className="bg-white border border-[#EAE4DC] rounded-2xl p-4 text-left hover:border-[#C0392B] transition-colors"
            >
              <div className="text-2xl mb-2">{topic.icon}</div>
              <div className="text-sm font-bold text-[#1C0A08] mb-1">{topic.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{topic.desc}</div>
            </button>
          )
        })}
      </div>

      <div className="bg-[#F7F3EE] border border-[#EAE4DC] rounded-2xl p-4">
        <div className="text-sm font-bold text-[#1C0A08] mb-1">Ask Kuya AI about finances</div>
        <div className="text-xs text-gray-400 mb-3">
          Get personalized financial advice based on your situation
        </div>
        <button
          onClick={function() {
            navigate('/dashboard/chat', {
              state: { initialMessage: 'Give me a financial plan as a fresh graduate in the Philippines.' },
            })
          }}
          className="w-full bg-[#1C0A08] text-[#F4C430] text-xs font-bold py-2.5 rounded-xl"
        >
          Ask Kuya AI for financial advice
        </button>
      </div>

    </PageLayout>
  )
}