'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard/overview'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-ash flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-wheat/10 bg-soil/55 p-7">
        <h1 className="font-display text-4xl text-wheat font-bold mb-2">Log In</h1>
        <p className="text-wheat/65 text-sm mb-6">Volunteer and organization accounts sign in here.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            />
          </div>
          <div>
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            />
          </div>
          {error && <p className="text-crisis text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-growth py-2.5 text-parchment font-semibold disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-wheat/70 mt-4">
          Need an account?{' '}
          <Link href="/signup" className="text-ember hover:text-wheat">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
