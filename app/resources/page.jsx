import { createServerClient } from '@/lib/supabase/server'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './resources.module.css'

export default async function ResourcesPage(){
  const supabase=await createServerClient()
  const {count}=await supabase.from('resource_submissions').select('*',{count:'exact',head:true})

  return (
    <main className={styles.resourcesPage}>
      <ScrollAnimator />
      <section className={`${styles.masthead} animate-on-scroll`}>
        <p className="label">Resource Center</p>
        <h1 className="display-lg">Resources That Save Filing Time.</h1>
        <p className="body-sm">Database currently tracks {count ?? 0} local resource records.</p>
      </section>
      <section className={`${styles.officeCard} animate-on-scroll`}>
        <h2 className={styles.title}>Weekly Office Hours</h2>
        <p className={styles.copy}>Join guided sessions for federal and state filing prep.</p>
        <a href="/support" className={`${styles.link} ${styles.cta}`}>Join Session</a>
      </section>
      <section className={`${styles.guidance} animate-on-scroll`}>
        <article className={styles.guideCard}><h3 className={styles.title}>Run Eligibility</h3><p className={styles.copy}>Get a quick county-aware match flow.</p><a href="/eligibility" className={styles.link}>Start</a></article>
        <article className={styles.guideCard}><h3 className={styles.title}>Contact Support</h3><p className={styles.copy}>Get help with paperwork blockers and next actions.</p><a href="/support" className={styles.link}>Open Support</a></article>
      </section>
      <section className={`${styles.submitCard} animate-on-scroll`}>
        <h2 className={styles.title}>Submit a Resource</h2>
        <form className={styles.formGrid}>
          <input className={styles.input} placeholder="Program name" />
          <input className={styles.input} placeholder="Provider" />
          <input className={styles.input} placeholder="State" />
          <input className={styles.input} placeholder="ZIP" />
          <textarea className={styles.textarea} placeholder="Description" rows={5} />
          <button className={styles.button} type="button">Submit Resource</button>
        </form>
      </section>
    </main>
  )
}
