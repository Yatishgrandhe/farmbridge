import { createServerClient } from '@/lib/supabase/server'
import { EligibilityWizard } from '@/components/forms/EligibilityWizard'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './eligibility.module.css'

export default async function EligibilityPage(){
  const supabase=await createServerClient()
  const {data}=await supabase.from('counties').select('name').order('name',{ascending:true})
  const countyOptions=(data??[]).map((c)=>c.name)

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <section className={`${styles.container} animate-on-scroll`}>
        <header className={styles.header}>
          <p className={styles.label}>Personalized Matching</p>
          <h1 className={styles.title}>Find the support you need.</h1>
          <p className={styles.description}>Answer a few quick questions and get matched to programs by county and operation profile.</p>
        </header>
        <EligibilityWizard countyOptions={countyOptions} />
      </section>
    </main>
  )
}
