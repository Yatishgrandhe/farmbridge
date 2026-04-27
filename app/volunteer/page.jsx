import { createServerClient } from '@/lib/supabase/server'
import { VolunteerHub } from '@/components/volunteer/VolunteerHub'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './volunteer.module.css'

export default async function VolunteerPage(){
  const supabase=await createServerClient()
  const [
    {data:{user}},
    {data:profile},
    {data:counties},
    {data:listings},
  ]=await Promise.all([
    supabase.auth.getUser(),
    supabase.from('profiles').select('account_type').limit(1).maybeSingle(),
    supabase.from('counties').select('fips_code,name').order('name'),
    supabase.from('volunteer_listings').select('*').order('created_at',{ascending:false}).limit(100),
  ])

  const canCreateListing=Boolean(user) && profile?.account_type==='organization'

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <div className={styles.container}>
        <header
          className={`${styles.header} animate-on-scroll`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.72)), url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
          }}
        >
          <p className={`${styles.tagline} label`}>Volunteer + Manpower Hub</p>
          <h1 className={styles.title}>Coordinate farm and program manpower across the United States.</h1>
          <p className={styles.description}>Browse open opportunities now; sign in for tracked hours and approvals.</p>
          {!user && <p className={styles.loginNotice}>Login required to create listings and track approved hours.</p>}
        </header>
        <section className="animate-on-scroll">
          <VolunteerHub counties={counties??[]} initialListings={listings??[]} canCreateListing={canCreateListing} />
        </section>
      </div>
    </main>
  )
}
