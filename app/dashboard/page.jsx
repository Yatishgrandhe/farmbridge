import { OverviewPanel } from '@/components/dashboard/OverviewPanel'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'

export default function DashboardPage(){
  return (
    <main style={{minHeight:'100vh', background:'var(--color-soil)', paddingTop:'2rem'}}>
      <ScrollAnimator />
      <div className="animate-on-scroll">
        <OverviewPanel />
      </div>
    </main>
  )
}
