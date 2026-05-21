'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { cn } from '@/lib/utils'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await authService.signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

router.refresh()
window.location.href = '/admin'
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-medium tracking-widest text-slate-400 uppercase"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@company.com"
          className={cn(
            'w-full bg-transparent border-b border-slate-200 py-2.5 text-sm text-slate-800',
            'placeholder:text-slate-300 outline-none',
            'transition-colors duration-200',
            'focus:border-slate-800',
            error && 'border-red-400'
          )}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-medium tracking-widest text-slate-400 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={cn(
            'w-full bg-transparent border-b border-slate-200 py-2.5 text-sm text-slate-800',
            'placeholder:text-slate-300 outline-none',
            'transition-colors duration-200',
            'focus:border-slate-800',
            error && 'border-red-400'
          )}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 pt-1">{error}</p>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'w-full py-3 text-xs font-semibold tracking-widest uppercase',
            'bg-slate-900 text-white',
            'transition-all duration-200',
            'hover:bg-slate-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  )
}
