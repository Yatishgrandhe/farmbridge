'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import styles from './auth.module.css'

export default function LoginPage(){
  const router=useRouter()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)

  const onSubmit=async (event)=>{
    event.preventDefault()
    setLoading(true);setError('')
    const supabase=createBrowserClient()
    const {error:signInError}=await supabase.auth.signInWithPassword({email,password})
    setLoading(false)
    if(signInError){setError(signInError.message);return}
    router.push('/dashboard');router.refresh()
  }

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <p className={styles.label}>Farmer Login</p>
        <h1 className={styles.title}>Welcome back.</h1>
        <p className={styles.subtitle}>Sign in to manage relief applications and county alerts.</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputGroup}><label className={styles.label}>Email</label><input type="email" className={styles.input} value={email} onChange={(e)=>setEmail(e.target.value)} required /></div>
          <div className={styles.inputGroup}><label className={styles.label}>Password</label><input type="password" className={styles.input} value={password} onChange={(e)=>setPassword(e.target.value)} required /></div>
          {error && <p className={styles.error}>{error}</p>}
          <button disabled={loading} className={styles.submitButton}>{loading?'Logging in...':'Log In'}</button>
        </form>
        <p className={styles.footerText}>Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link></p>
      </section>
    </main>
  )
}
