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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0F2044}
  .field{width:100%;background:rgba(15,32,68,0.04);border:1px solid rgba(15,32,68,0.15);color:#0F2044;padding:14px 16px;font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color .2s}
  .field::placeholder{color:rgba(15,32,68,0.3)}
  .field:focus{border-color:#C8A84B}
  .btn-submit{width:100%;background:#0F2044;color:#FAF7F2;border:none;padding:16px;font-family:'Inter',sans-serif;font-size:13px;letter-spacing:2px;cursor:pointer;transition:background .25s}
  .btn-submit:hover{background:#162B5C}
  .btn-submit:disabled{opacity:.45;cursor:not-allowed}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .su{opacity:0;animation:slideUp .6s ease forwards}
  .su-d1{animation-delay:.1s}.su-d2{animation-delay:.2s}.su-d3{animation-delay:.3s}.su-d4{animation-delay:.4s}
  .auth-grid{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
  .auth-left{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:48px;border-right:1px solid rgba(250,247,242,0.08)}
  .auth-right{background:#FAF7F2;display:flex;align-items:center;justify-content:center;padding:60px 48px}
  .pw-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:700px){
    .auth-grid{display:flex;flex-direction:column}
    .auth-left{padding:28px 24px 28px;border-right:none;border-bottom:1px solid rgba(250,247,242,0.08)}
    .auth-left-checklist{display:none}
    .auth-left-footer{display:none}
    .auth-left-heading .hero-line{font-size:clamp(26px,9vw,40px)!important}
    .auth-right{padding:32px 24px 48px;align-items:flex-start}
    .pw-grid{grid-template-columns:1fr}
  }
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
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('exist')) {
        setError('An account with this email already exists. Try logging in instead.')
      } else if (err.response?.status >= 400 && err.response?.status < 500) {
        setError(err.response?.data?.message || 'Registration failed. Please check your details.')
      } else if (!err.response) {
        setError('Cannot reach the server. Your account may have been created — try logging in, or wait a moment and try again.')
      } else {
        setError('Something went wrong on our end. Please try again.')
      }
    }
    finally { setLoading(false) }
  }

  const label = { fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(15,32,68,0.45)', display: 'block', marginBottom: 8 }
  const err = { fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#C8A84B', marginTop: 6, letterSpacing: 0.5 }

  return (
      <div className="auth-grid" style={{ background: '#0F2044' }}>
        <style>{S}</style>

        {/* Left — navy with dot grid */}
        <div className="auth-left">
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(250,247,242,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(250,247,242,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 7, height: 7, background: i < 2 ? '#FAF7F2' : '#C8A84B', borderRadius: 1 }} />)}
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#FAF7F2', letterSpacing: 3 }}>GRADREADY</span>
          </Link>

          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: 3, color: 'rgba(250,247,242,0.4)', marginBottom: 20 }}>OPEN TO ALL FILIPINOS</div>
            <div>
              {['START YOUR', 'CAREER', 'JOURNEY.'].map((line, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    {i === 1 && <div style={{ position: 'absolute', bottom: -2, left: 0, width: 60, height: 2, background: '#C8A84B' }} />}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: '#FAF7F2', letterSpacing: '-1px', lineHeight: 0.95, display: 'block', whiteSpace: 'nowrap' }}>{line}</span>
                  </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(250,247,242,0.45)', lineHeight: 1.9, marginTop: 24, letterSpacing: 0.5, maxWidth: 320 }}>
              Fresh grads, career shifters, new professionals — GradReady PH is built for your journey. Free forever.
            </p>

            {/* Mini checklist */}
            <div className="auth-left-checklist" style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['PERSONALIZED ROADMAP', 'KUYA AI IN TAGLISH', '7 GOV REGISTRATIONS', 'AI JOB MATCHING'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(250,247,242,0.55)', letterSpacing: 1 }}>
                    <span style={{ color: '#C8A84B', fontSize: 14 }}>✓</span>
                    {item}
                  </div>
              ))}
            </div>
          </div>

          <div className="auth-left-footer" style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(250,247,242,0.25)', letterSpacing: 1 }}>
            © 2025 GRADREADY PH 🇵🇭
          </div>
        </div>

        {/* Right — cream form panel */}
        <div className="auth-right">
          <div style={{ width: '100%', maxWidth: 420 }}>

            <div className="su" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: 2.5, color: 'rgba(15,32,68,0.4)', marginBottom: 40 }}>
              ALREADY HAVE AN ACCOUNT? <Link to="/login" style={{ color: '#C8A84B', textDecoration: 'none' }}>SIGN IN</Link>
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

              <div className="su su-d3 pw-grid">
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
                  <div className="su" style={{ border: '1px solid rgba(200,168,75,0.4)', background: 'rgba(200,168,75,0.08)', padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#C8A84B', letterSpacing: 0.5 }}>
                    {error}
                  </div>
              )}

              <button type="submit" className="btn-submit su su-d4" disabled={loading}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE MY ACCOUNT →'}
              </button>

              <p className="su su-d4" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(15,32,68,0.35)', textAlign: 'center', lineHeight: 1.8, letterSpacing: 0.5 }}>
                FREE FOREVER · NO CREDIT CARD REQUIRED
              </p>
            </form>
          </div>
        </div>
      </div>
  )
}
