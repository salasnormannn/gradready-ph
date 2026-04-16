import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../../services/api'
import useAuthStore from '../../store/authStore'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
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
  .su-d1{animation-delay:.1s}.su-d2{animation-delay:.2s}.su-d3{animation-delay:.3s}
  a{color:#C8A84B;text-decoration:none}
  a:hover{color:#0F2044}
  .auth-grid{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
  .auth-left{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:48px;border-right:1px solid rgba(250,247,242,0.08)}
  .auth-right{background:#FAF7F2;display:flex;align-items:center;justify-content:center;padding:60px 48px}
  @media(max-width:700px){
    .auth-grid{display:flex;flex-direction:column}
    .auth-left{padding:28px 24px 32px;border-right:none;border-bottom:1px solid rgba(250,247,242,0.08);min-height:auto}
    .auth-left-footer{display:none}
    .auth-left-heading .hero-line{font-size:clamp(28px,9vw,44px)!important}
    .auth-right{padding:32px 24px 48px;align-items:flex-start}
  }
`

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    setLoading(true); setError('')
    try {
      const res = await authApi.login(data)
      queryClient.clear()
      setAuth(res.data, res.data.token)
      navigate(res.data.course || res.data.region ? '/dashboard' : '/onboarding')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.')
      } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error' || !err.response) {
        setError('Cannot reach the server. Please try again in a moment.')
      } else {
        setError('Something went wrong. Please try again.')
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
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: 3, color: 'rgba(250,247,242,0.4)', marginBottom: 20 }}>WELCOME BACK</div>
            <div>
              {['SIGN', 'IN TO YOUR', 'ACCOUNT.'].map((line, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    {i === 1 && <div style={{ position: 'absolute', bottom: -2, left: 0, width: 60, height: 2, background: '#C8A84B' }} />}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: '#FAF7F2', letterSpacing: '-1px', lineHeight: 0.95, display: 'block', whiteSpace: 'nowrap' }}>{line}</span>
                  </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(250,247,242,0.45)', lineHeight: 1.9, marginTop: 24, letterSpacing: 0.5, maxWidth: 320 }}>
              Your roadmap, gov registrations, and Kuya AI are waiting.
            </p>
          </div>

          <div className="auth-left-footer" style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(250,247,242,0.25)', letterSpacing: 1 }}>
            © 2025 GRADREADY PH 🇵🇭
          </div>
        </div>

        {/* Right — cream form panel */}
        <div className="auth-right">
          <div style={{ width: '100%', maxWidth: 400 }}>

            <div className="su" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: 2.5, color: 'rgba(15,32,68,0.4)', marginBottom: 40 }}>
              NO ACCOUNT? <Link to="/register" style={{ color: '#C8A84B' }}>CREATE ONE</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div className="su su-d1">
                <label style={label}>Email address</label>
                <input {...register('email')} type="email" className="field" placeholder="juan@email.com" />
                {errors.email && <p style={err}>{errors.email.message}</p>}
              </div>

              <div className="su su-d2">
                <label style={label}>Password</label>
                <input {...register('password')} type="password" className="field" placeholder="••••••••" />
                {errors.password && <p style={err}>{errors.password.message}</p>}
              </div>

              {error && (
                  <div className="su" style={{ border: '1px solid rgba(200,168,75,0.4)', background: 'rgba(200,168,75,0.08)', padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#C8A84B', letterSpacing: 0.5 }}>
                    {error}
                  </div>
              )}

              <button type="submit" className="btn-submit su su-d3" disabled={loading}>
                {loading ? 'SIGNING IN...' : 'SIGN IN →'}
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}
