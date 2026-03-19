import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../services/api'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      const res = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      setAuth(res.data, res.data.token)
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">

        <div className="mb-8">
          <div className="w-12 h-12 bg-[#C0392B] rounded-2xl flex items-center justify-center mb-6">
            <span className="text-[#F4C430] font-black text-xl">G</span>
          </div>
          <h1 className="text-3xl font-black text-[#1C0A08] leading-tight">
            Start your<br />
            <span className="text-[#C0392B]">post-grad journey.</span>
          </h1>
          <p className="text-sm text-[#888] mt-2">
            Join thousands of Filipino fresh grads navigating life after graduation.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Juan dela Cruz"
            register={register('fullName')}
            error={errors.fullName?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="juan@email.com"
            register={register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            register={register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Creating account...' : 'Create my account →'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#888] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#C0392B] font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}