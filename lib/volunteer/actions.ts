'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { approvalSchema } from '@/lib/validation/volunteer'

export async function approveVolunteerHours(formData: FormData) {
  const parsed = approvalSchema.safeParse({
    signupId: formData.get('signupId'),
    decision: formData.get('decision'),
    approvedHours: formData.get('approvedHours'),
    reviewNotes: formData.get('reviewNotes'),
  })

  if (!parsed.success) return

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: approverProfile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (!approverProfile || approverProfile.account_type !== 'organization') return

  const isApproved = parsed.data.decision === 'approved'

  await supabase
    .from('volunteer_signups')
    .update({
      status: isApproved ? 'approved' : 'rejected',
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.signupId)

  await supabase
    .from('volunteer_hours')
    .update({
      status: isApproved ? 'approved' : 'rejected',
      hours_approved: isApproved ? parsed.data.approvedHours ?? null : null,
      approved_by_profile_id: approverProfile.id,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('signup_id', parsed.data.signupId)

  revalidatePath('/dashboard/hours')
  revalidatePath('/dashboard/signups')
}
