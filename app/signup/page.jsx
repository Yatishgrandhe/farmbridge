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
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    const fullName = String(form.get('fullName') ?? '')
    const county = String(form.get('county') ?? '')
    
    const supabase = createBrowserClient()
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }
    
    if (data.user) {
      await supabase.from('profiles').upsert({
        auth_user_id: data.user.id,
        full_name: fullName,
        county: county,
        account_type: 'volunteer'
      })
    }
    
    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className={styles.container}>
      {/* Left Panel: Cinematic Immersive Image */}
      <section className={styles.leftPanel}>
        <div className={styles.overlay} />
        <div className={styles.heroContent}>
          <div className={styles.logoMark}>
            <span className={styles.logoDot} />
            <span className={styles.logoText}>FARMBRIDGE</span>
          </div>
          <p className={styles.tagline}>
            Resilience for the farms that feed every community.
          </p>
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Secure</span>
            </div>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span>100+ Programs</span>
            </div>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>NC Farmers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Focused Form Area */}
      <section className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <header className={styles.formHeader}>
            <p className="label">FARMER REGISTRATION</p>
            <h1 className="display-md">Join the network.</h1>
          </header>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label className="label">Full Name</label>
                <input name="fullName" className={styles.input} placeholder="Jane Doe" required />
              </div>
              <div className={styles.inputGroup}>
                <label className="label">County</label>
                <input name="county" className={styles.input} placeholder="Ashe" required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className="label">Email Address</label>
              <input type="email" name="email" className={styles.input} placeholder="farmer@example.com" required />
            </div>

            <div className={styles.inputGroup}>
              <label className="label">Password</label>
              <input type="password" name="password" className={styles.input} placeholder="Min. 8 characters" minLength={8} required />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button disabled={loading} className={styles.submitButton}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            <div className={styles.divider}>
              <span>— or —</span>
            </div>

            <button type="button" className={styles.oauthButton}>
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign up with Google
            </button>
          </form>

          <footer className={styles.formFooter}>
            <p>Already have an account? <Link href="/login" className={styles.signupLink}>Log in →</Link></p>
          </footer>
        </div>
      </section>
    </main>
  )
}
