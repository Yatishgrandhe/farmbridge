'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import styles from '../login/auth.module.css'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setLoading(true)
    setError('')
    const supabase = createBrowserClient()

    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    const fullName = String(form.get('fullName') ?? '')

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({ auth_user_id: data.user.id, full_name: fullName, account_type: 'volunteer' })
    }

    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className={styles.main}>
      <section className={`${styles.card} ${styles.wideCard}`}>
        <h1 className={styles.title}>Create your FarmBridge account</h1>
        <p className={styles.subtitle}>Set up access for dashboard alerts and volunteer hours tracking.</p>

        <form className={`${styles.form} ${styles.grid}`} onSubmit={onSubmit}>
          <div className={styles.inputGroup}><label className={styles.label}>Full name</label><input name="fullName" className={styles.input} required /></div>
          <div className={styles.inputGroup}><label className={styles.label}>Email</label><input name="email" type="email" className={styles.input} required /></div>
          <div className={styles.inputGroup}><label className={styles.label}>Password</label><input name="password" type="password" className={styles.input} required minLength={8} /></div>
          <div className={styles.inputGroup}><label className={styles.label}>County</label><input name="county" className={styles.input} /></div>
          {error && <p className={`${styles.error} ${styles.fullWidth}`}>{error}</p>}
          <button disabled={loading} className={`${styles.submitButton} ${styles.fullWidth}`}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>

        <p className={styles.footerText}>Already have an account? <Link href="/login" className={styles.link}>Log in</Link></p>
      </section>
    </main>
  )
}
