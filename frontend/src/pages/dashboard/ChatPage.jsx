import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import useAuthStore from '../../store/authStore'

const QUICK_ASKS = [
  'Paano mag-register sa PhilHealth?',
  'What do I need for NBI clearance?',
  'How do I negotiate my first salary?',
  'Explain my payslip deductions',
  'How to open a savings account?',
  'What is Pag-IBIG MP2?',
]

export default function ChatPage() {
  var location = useLocation()
  var authStore = useAuthStore()
  var user = authStore.user
  var chatHook = useChat()
  var sendMessage = chatHook.mutate
  var isPending = chatHook.isPending

  var firstName = user && user.fullName ? user.fullName.split(' ')[0] : 'Ka-grad'

  var messagesState = useState([
    {
      id: 'init-1',
      from: 'kuya',
      text: 'Uy! Kamusta ' + firstName + '? I am Kuya AI — your post-grad big brother. Anong kailangan mo ngayon?',
    },
    {
      id: 'init-2',
      from: 'kuya',
      text: 'I can help you with TIN, SSS, PhilHealth, Pag-IBIG, NBI clearance, job applications, salary negotiation — anything a fresh grad needs!',
    },
  ])
  var messages = messagesState[0]
  var setMessages = messagesState[1]

  var inputState = useState('')
  var input = inputState[0]
  var setInput = inputState[1]

  var convState = useState(null)
  var conversationId = convState[0]
  var setConversationId = convState[1]

  // Store the initial message to send AFTER mount
  var pendingState = useState(null)
  var pendingInitialMessage = pendingState[0]
  var setPendingInitialMessage = pendingState[1]

  var messagesEndRef = useRef(null)
  var isMounted = useRef(false)

  // Step 1 — On mount, just grab the initial message from nav state
  // Do NOT call sendMessage here — mutation not ready yet
  useEffect(function() {
    if (location.state && location.state.initialMessage) {
      var message = location.state.initialMessage
      window.history.replaceState({}, document.title)
      setPendingInitialMessage(message)
    }
  }, [])

  // Step 2 — After first render, isMounted becomes true
  useEffect(function() {
    isMounted.current = true
  }, [])

  // Step 3 — Once pendingInitialMessage is set AND component is mounted,
  // fire the message for real
  useEffect(function() {
    if (pendingInitialMessage && isMounted.current && !isPending) {
      setPendingInitialMessage(null)
      doSend(pendingInitialMessage)
    }
  }, [pendingInitialMessage])

  function doSend(message) {
    // Add to UI
    setMessages(function(prev) {
      return prev.concat([{
        id: 'user-' + Date.now(),
        from: 'user',
        text: message,
      }])
    })

    // Call API
    sendMessage(
      { message: message, conversationId: conversationId },
      {
        onSuccess: function(data) {
          setConversationId(data.conversationId)
          setMessages(function(prev) {
            return prev.concat([{
              id: 'kuya-' + Date.now(),
              from: 'kuya',
              text: data.message,
            }])
          })
        },
        onError: function() {
          setMessages(function(prev) {
            return prev.concat([{
              id: 'err-' + Date.now(),
              from: 'kuya',
              text: 'Sorry, may error. Subukan mo ulit?',
            }])
          })
        },
      }
    )
  }

  function handleSend(text) {
    var msg = text && text.trim ? text.trim() : input.trim()
    if (!msg) return
    if (isPending) return
    setInput('')
    doSend(msg)
  }

  // Auto scroll
  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col">

      <div className="bg-[#1C0A08] px-5 py-4 flex items-center gap-3 sticky top-0 z-50">
        <Link
          to="/dashboard"
          className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold flex-shrink-0"
        >
          &lt;
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#F4C430] flex items-center justify-center text-xl flex-shrink-0">
          🤙
        </div>
        <div>
          <div className="text-sm font-black text-white">Kuya AI</div>
          <div className="text-xs text-white/40">
            {isPending ? 'Typing...' : 'Your post-grad big brother'}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 pb-36">

        <div className="flex flex-wrap gap-2 mb-2">
          {QUICK_ASKS.map(function(q, i) {
            return (
              <button
                key={'quick-' + i}
                onClick={function() { handleSend(q) }}
                className="bg-white border border-[#EAE4DC] rounded-full px-3 py-1.5 text-xs font-medium text-[#1C0A08] hover:border-[#C0392B] transition-colors"
              >
                {q}
              </button>
            )
          })}
        </div>

        {messages.map(function(msg, i) {
          var isUser = msg.from === 'user'
          return (
            <div
              key={msg.id + '-' + i}
              className={isUser ? 'flex items-start gap-2 flex-row-reverse' : 'flex items-start gap-2'}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#F4C430] flex items-center justify-center text-base flex-shrink-0 mt-1">
                  🤙
                </div>
              )}
              <div
                className={
                  isUser
                    ? 'max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed bg-[#C0392B] text-white'
                    : 'max-w-[78%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-[#EAE4DC] text-[#1C0A08]'
                }
              >
                {msg.text}
              </div>
            </div>
          )
        })}

        {isPending && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F4C430] flex items-center justify-center text-base flex-shrink-0">
              🤙
            </div>
            <div className="flex flex-col gap-1">
              <div className="bg-white border border-[#EAE4DC] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
              <p className="text-xs text-gray-400 px-1">
                Generating... may take up to 30 seconds
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAE4DC] px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={function(e) { setInput(e.target.value) }}
          onKeyDown={function(e) { if (e.key === 'Enter') handleSend(null) }}
          placeholder="Magtanong kay Kuya AI..."
          className="flex-1 bg-[#F7F3EE] border border-[#EAE4DC] rounded-full px-4 py-2.5 text-sm text-[#1C0A08] outline-none focus:border-[#C0392B] placeholder:text-gray-300"
        />
        <button
          onClick={function() { handleSend(null) }}
          disabled={isPending || !input.trim()}
          className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          ^
        </button>
      </div>

    </div>
  )
}