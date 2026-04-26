import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardResourcesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('auth_user_id', user?.id ?? '')
    .maybeSingle()

  if (!profile || profile.account_type !== 'organization') {
    redirect('/dashboard/overview')
  }

  const { data: submissions } = await supabase
    .from('resource_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(80)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-wheat font-bold">Resource Submissions</h1>
          <p className="text-wheat/60">Review newly submitted support resources and programs.</p>
        </div>
        <Link href="/resources#submit-resource" className="rounded-lg bg-growth px-4 py-2 text-parchment text-sm font-semibold">
          Submit Resource
        </Link>
      </div>
      <div className="grid gap-3">
        {(submissions ?? []).map((submission) => (
          <article key={submission.id} className="rounded-xl border border-wheat/10 bg-soil/50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-wheat font-semibold">{submission.program_name}</h2>
              <span className="text-xs font-mono uppercase text-wheat/55">{submission.status}</span>
            </div>
            <p className="text-sm text-wheat/70 mt-1">{submission.description}</p>
            <p className="text-xs text-wheat/55 mt-2">
              {submission.city}, {submission.state} {submission.zip_code} • {submission.contact_name} ({submission.contact_email})
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
