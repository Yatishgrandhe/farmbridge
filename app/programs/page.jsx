import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './programs.module.css'

const FILTERS=[
  {label:'All',value:'all'},
  {label:'🚨 Disaster Relief',value:'disaster_relief'},
  {label:'🌱 Conservation',value:'conservation'},
  {label:'💰 Loans',value:'loans'},
  {label:'🌽 Commodity Support',value:'commodity_support'},
  {label:'💙 Mental Health',value:'mental_health'},
  {label:'🌾 Young Farmers',value:'young_farmers'},
]

export default async function ProgramsPage({searchParams}) {
  const category=typeof searchParams?.category==='string'?searchParams.category:'all'
  const supabase=await createServerClient()
  let q=supabase.from('programs').select('*').eq('active',true)
  if(category!=='all') q=q.eq('category',category)
  const {data:rows}=await q.order('is_urgent',{ascending:false}).order('name',{ascending:true})
  const programs=rows??[]
  const urgent=programs.filter((p)=>p.is_urgent)
  const standard=programs.filter((p)=>!p.is_urgent)

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <section className={styles.container}>
        <header className={`${styles.header} animate-on-scroll`}>
          <span className={`${styles.headerSpan} label`}>Federal & State Programs</span>
          <h1 className={styles.headerTitle}>Relief Programs for NC Farmers.</h1>
          <p className={styles.headerText}>Many go unused because farmers do not know they exist.</p>
        </header>

        <div className={`${styles.filterList} animate-on-scroll`}>
          {FILTERS.map((tab)=>(
            <Link key={tab.value} href={tab.value==='all'?'/programs':`/programs?category=${tab.value}`} className={`${styles.filterItem} ${category===tab.value?styles.filterItemActive:styles.filterItemInactive}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        {!!urgent.length && (
          <section className={`${styles.urgentSection} animate-on-scroll`}>
            <h2 className={styles.urgentTitle}><span className={styles.urgentDotContainer}><span className={styles.urgentDotPulse} /><span className={styles.urgentDotMain} /></span>Time-Sensitive — Act Now</h2>
            <div className={styles.urgentGrid}>{urgent.map((p)=><ProgramCard key={p.id} program={p} urgent />)}</div>
          </section>
        )}

        <section className="animate-on-scroll">
          <h2 className={styles.urgentTitle} style={{color:'var(--color-mist)'}}>Open Programs</h2>
          {standard.length? <div className={styles.mainGrid}>{standard.map((p)=><ProgramCard key={p.id} program={p} />)}</div> : <div className={styles.emptyState}><p className={styles.emptyTitle}>No open programs found.</p><p className={styles.emptyText}>Try a different category.</p></div>}
        </section>
      </section>
    </main>
  )
}
