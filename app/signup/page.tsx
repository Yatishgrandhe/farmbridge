'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

type AccountType = 'volunteer' | 'organization'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    accountType: 'volunteer' as AccountType,
    organizationName: '',
  })

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          account_type: form.accountType,
          full_name: form.fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const authUserId = data.user?.id

    if (!authUserId) {
      setError('Account created but user session is not ready yet. Please try logging in.')
      setLoading(false)
      return
    }

    const { data: insertedProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        auth_user_id: authUserId,
        account_type: form.accountType,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        state: 'NC',
      })
      .select('id')
      .single()

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    if (form.accountType === 'organization' && form.organizationName.trim()) {
      await supabase.from('organizations').insert({
        name: form.organizationName.trim(),
        contact_name: form.fullName,
        contact_email: form.email,
        contact_phone: form.phone || null,
        state: 'NC',
        created_by_profile_id: insertedProfile?.id ?? null,
      })
    }

    setLoading(false)
    router.push('/dashboard/overview')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-ash flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl rounded-2xl border border-wheat/10 bg-soil/55 p-7">
        <h1 className="font-display text-4xl text-wheat font-bold mb-2">Create Account</h1>
        <p className="text-wheat/65 text-sm mb-6">
          No email verification step required. Choose volunteer or organization account type.
        </p>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Account Type</label>
            <select
              value={form.accountType}
              onChange={(e) => setField('accountType', e.target.value as AccountType)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            >
              <option value="volunteer">Volunteer</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          {form.accountType === 'organization' && (
            <div className="sm:col-span-2">
              <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Organization Name</label>
              <input
                required
                value={form.organizationName}
                onChange={(e) => setField('organizationName', e.target.value)}
                className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
              />
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Full Name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            />
          </div>
          <div>
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            />
          </div>
          <div>
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-wheat/65 uppercase tracking-widest font-mono">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              className="mt-1 w-full rounded-lg border border-wheat/20 bg-ash/70 px-3 py-2 text-wheat"
            />
          </div>
          {error && <p className="sm:col-span-2 text-crisis text-sm">{error}</p>}
          <button
            className="sm:col-span-2 w-full rounded-lg bg-growth py-2.5 text-parchment font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-wheat/70 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-ember hover:text-wheat">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
