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

export async function manageSignupAction(formData: FormData) {
  const signupId = String(formData.get('signupId') ?? '')
  const action = String(formData.get('action') ?? '')
  if (!signupId || !['delete', 'delay', 'approve'].includes(action)) return

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (!profile) return

  const { data: signup } = await supabase
    .from('volunteer_signups')
    .select('id, profile_id')
    .eq('id', signupId)
    .maybeSingle()
  if (!signup) return

  const canManageAll = profile.account_type === 'organization'
  const canManageOwn = profile.account_type === 'volunteer' && signup.profile_id === profile.id
  if (!canManageAll && !canManageOwn) return

  if (action === 'delete') {
    await supabase.from('volunteer_hours').delete().eq('signup_id', signupId)
    await supabase.from('volunteer_signups').delete().eq('id', signupId)
  } else if (action === 'approve' && canManageAll) {
    await supabase.from('volunteer_signups').update({ status: 'approved' }).eq('id', signupId)
  } else if (action === 'delay' && canManageAll) {
    await supabase.from('volunteer_signups').update({ status: 'pending' }).eq('id', signupId)
  }

  revalidatePath('/dashboard/signups')
  revalidatePath('/dashboard/hours')
}

export async function updateProfileSettings(formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const zipCode = String(formData.get('zipCode') ?? '').trim()

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('profiles')
    .update({
      full_name: fullName || null,
      phone: phone || null,
      city: city || null,
      zip_code: zipCode || null,
      state: 'NC',
      updated_at: new Date().toISOString(),
    })
    .eq('auth_user_id', user.id)

  revalidatePath('/dashboard/settings')
}
