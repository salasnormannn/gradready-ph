import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RedFlagChecker() {
  var navigate = useNavigate()

  var modeState = useState('text')
  var mode = modeState[0]
  var setMode = modeState[1]

  var inputState = useState('')
  var inputValue = inputState[0]
  var setInputValue = inputState[1]

  function handleCheck() {
    if (!inputValue.trim()) return

    var isUrl = inputValue.trim().startsWith('http://') || inputValue.trim().startsWith('https://')

    var message = isUrl
      ? 'Can you check this job posting for red flags? Here is the link: ' + inputValue.trim() + '. Please analyze the company, role description, and any suspicious requirements. List any red flags and green flags you find.'
      : 'Can you check this job posting for red flags?\n\n' + inputValue.trim() + '\n\nPlease list any red flags and green flags, and give an overall assessment of whether this is a legitimate job posting.'

    navigate('/dashboard/chat', {
      state: { initialMessage: message },
    })
  }

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">🚩</span>
        <div className="text-sm font-bold text-red-800">Red flag checker</div>
      </div>
      <div className="text-xs text-red-600 mb-3 leading-relaxed">
        Paste a job posting URL or the full job description text — Kuya AI will check for red flags, suspicious requirements, and salary violations.
      </div>

      <div className="flex gap-1 mb-3">
        <button
          onClick={function() { setMode('text'); setInputValue('') }}
          className={'flex-1 text-xs font-bold py-2 rounded-xl transition-colors ' + (mode === 'text' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-200')}
        >
          Paste job text
        </button>
        <button
          onClick={function() { setMode('url'); setInputValue('') }}
          className={'flex-1 text-xs font-bold py-2 rounded-xl transition-colors ' + (mode === 'url' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-200')}
        >
          Paste job URL
        </button>
      </div>

      {mode === 'text' ? (
        <textarea
          value={inputValue}
          onChange={function(e) { setInputValue(e.target.value) }}
          placeholder="Paste the full job posting here... e.g. Job Title, Company, Description, Requirements, Salary..."
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-sm text-[#1C0A08] outline-none focus:border-red-500 placeholder:text-gray-300 bg-white resize-none mb-3"
        />
      ) : (
        <input
          type="url"
          value={inputValue}
          onChange={function(e) { setInputValue(e.target.value) }}
          placeholder="https://www.jobstreet.com.ph/job/..."
          className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-sm text-[#1C0A08] outline-none focus:border-red-500 placeholder:text-gray-300 bg-white mb-3"
        />
      )}

      <button
        onClick={handleCheck}
        disabled={!inputValue.trim()}
        className="w-full bg-red-600 text-white text-xs font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check for red flags with Kuya AI
      </button>
    </div>
  )
}