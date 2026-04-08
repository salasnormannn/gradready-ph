import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../../services/api'
import useAuthStore from '../../store/authStore'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#3C091E}
  .field{width:100%;background:rgba(240,237,232,0.05);border:1px solid rgba(240,237,232,0.12);color:#F0EDE8;padding:14px 16px;font-family:'Share Tech Mono',monospace;font-size:13px;letter-spacing:1px;outline:none;transition:border-color .2s}
  .field::placeholder{color:rgba(240,237,232,0.2)}
  .field:focus{border-color:#BE473D}
  .btn-submit{width:100%;background:#BE473D;color:#F0EDE8;border:none;padding:16px;font-family:'Share Tech Mono',monospace;font-size:13px;letter-spacing:2px;cursor:pointer;transition:background .25s}
  .btn-submit:hover{background:#d44f40}
  .btn-submit:disabled{opacity:.45;cursor:not-allowed}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .su{opacity:0;animation:slideUp .6s ease forwards}
  .su-d1{animation-delay:.1s}.su-d2{animation-delay:.2s}.su-d3{animation-delay:.3s}.su-d4{animation-delay:.4s}
`

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    setLoading(true); setError('')
    try {
      const res = await authApi.register({ fullName: data.fullName, email: data.email, password: data.password })
      queryClient.clear()
      setAuth(res.data, res.data.token)
      navigate('/onboarding')
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  const label = { fontFamily: 'monospace', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(240,237,232,0.3)', display: 'block', marginBottom: 8 }
  const err = { fontFamily: 'monospace', fontSize: 11, color: '#BE473D', marginTop: 6, letterSpacing: 0.5 }

  return (
    <div style={{ minHeight: '100vh', background: '#3C091E', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <style>{S}</style>

      {/* Left */}
      <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', borderRight: '1px solid rgba(240,237,232,0.08)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(240,237,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: 7, height: 7, background: i < 2 ? '#BE473D' : '#C8A84B', borderRadius: 1 }} />)}
          </div>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#F0EDE8', letterSpacing: 3 }}>GRADREADY</span>
        </Link>

        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 3, color: 'rgba(240,237,232,0.3)', marginBottom: 20 }}>OPEN TO ALL FILIPINOS</div>
          <div>
            {['START YOUR', 'CAREER', 'JOURNEY.']. map((line, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i === 1 && <div style={{ position: 'absolute', bottom: -2, left: 0, width: 60, height: 2, background: '#BE473D' }} />}
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: '#F0EDE8', letterSpacing: '-1px', lineHeight: 0.95, display: 'block', whiteSpace: 'nowrap' }}>{line}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(240,237,232,0.35)', lineHeight: 1.9, marginTop: 24, letterSpacing: 0.5, maxWidth: 320 }}>
            Fresh grads, career shifters, new professionals — GradReady PH is built for your journey. Free forever.
          </p>

          {/* Mini checklist */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['PERSONALIZED ROADMAP', 'KUYA AI IN TAGLISH', '7 GOV REGISTRATIONS', 'AI JOB MATCHING'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'monospace', fontSize: 11, color: 'rgba(240,237,232,0.45)', letterSpacing: 1 }}>
                <span style={{ color: '#BE473D', fontSize: 14 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(240,237,232,0.2)', letterSpacing: 1 }}>
          © 2025 GRADREADY PH 🇵🇭
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div className="su" style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 2.5, color: 'rgba(240,237,232,0.3)', marginBottom: 40 }}>
            ALREADY HAVE AN ACCOUNT? <Link to="/login" style={{ color: '#BE473D', textDecoration: 'none' }}>SIGN IN</Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div className="su su-d1">
              <label style={label}>Full name</label>
              <input {...register('fullName')} type="text" className="field" placeholder="Juan dela Cruz" />
              {errors.fullName && <p style={err}>{errors.fullName.message}</p>}
            </div>

            <div className="su su-d2">
              <label style={label}>Email address</label>
              <input {...register('email')} type="email" className="field" placeholder="juan@email.com" />
              {errors.email && <p style={err}>{errors.email.message}</p>}
            </div>

            <div className="su su-d3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={label}>Password</label>
                <input {...register('password')} type="password" className="field" placeholder="Min 8 chars" />
                {errors.password && <p style={err}>{errors.password.message}</p>}
              </div>
              <div>
                <label style={label}>Confirm</label>
                <input {...register('confirmPassword')} type="password" className="field" placeholder="Repeat" />
                {errors.confirmPassword && <p style={err}>{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {error && (
              <div className="su" style={{ border: '1px solid rgba(190,71,61,0.3)', background: 'rgba(190,71,61,0.08)', padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#BE473D', letterSpacing: 0.5 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-submit su su-d4" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE MY ACCOUNT →'}
            </button>

            <p className="su su-d4" style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(240,237,232,0.2)', textAlign: 'center', lineHeight: 1.8, letterSpacing: 0.5 }}>
              FREE FOREVER · NO CREDIT CARD REQUIRED
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}