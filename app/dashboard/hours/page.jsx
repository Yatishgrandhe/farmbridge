import { redirect } from 'next/navigation'

import { approveVolunteerHours } from '@/lib/volunteer/actions'
import { createServerClient } from '@/lib/supabase/server'

import listStyles from '@/components/dashboard/DashboardLists.module.css'
import styles from '../dashboard.module.css'

function relOne(value) {
  if (value == null) return undefined
  return Array.isArray(value) ? value[0] : value
}

function statusClass(status) {
  const s = String(status ?? '').toLowerCase()
  if (s === 'approved') return listStyles.badgeApproved
  if (s === 'rejected') return listStyles.badgeRejected
  if (s === 'pending') return listStyles.badgePending
  return ''
}

export default async function VolunteerHoursPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/dashboard/hours')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!profile) redirect('/login?redirectTo=/dashboard/hours')

  const query = supabase
    .from('volunteer_hours')
    .select('*, volunteer_signups(volunteer_name, volunteer_email), volunteer_listings(title)')
    .order('created_at', { ascending: false })

  const { data: hours } =
    profile.account_type === 'organization'
      ? await query.limit(100)
      : await query.eq('profile_id', profile.id).limit(100)

  const isOrg = profile.account_type === 'organization'
  const rows = hours ?? []

  return (
    <main className={styles.dashboardPage}>
      <section className={`${styles.topBanner} animate-on-scroll`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerText}>
            <p className={styles.bannerEyebrow}>VOLUNTEER HOURS</p>
            <h1 className={styles.bannerHeading}>Volunteer Hours</h1>
            <p className={styles.bannerSubtext}>
            {isOrg
              ? 'Review submitted hours from volunteers across your listings.'
              : 'Track submitted hours and approval status for your volunteer shifts.'}
            </p>
          </div>
        </div>
      </section>

      <div className={`animate-on-scroll ${listStyles.wrap}`} style={{ margin: '24px 40px 32px' }}>
        {rows.length === 0 ? (
          <p className={listStyles.empty}>No volunteer hour records yet.</p>
        ) : (
          <table className={listStyles.table}>
            <thead>
              <tr>
                <th>Listing</th>
                <th>Volunteer</th>
                <th>Submitted</th>
                <th>Approved</th>
                <th>Status</th>
                {isOrg ? <th>Review</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const signup = relOne(row.volunteer_signups)
                const listing = relOne(row.volunteer_listings)
                const pending = String(row.status ?? '').toLowerCase() === 'pending'
                const defaultApproved =
                  typeof row.hours_submitted === 'number' ? row.hours_submitted : 0

                return (
                  <tr key={row.id}>
                    <td>{listing?.title ?? 'N/A'}</td>
                    <td>
                      <div>{signup?.volunteer_name ?? 'N/A'}</div>
                      <div className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        {signup?.volunteer_email ?? ''}
                      </div>
                    </td>
                    <td className={listStyles.mono}>{row.hours_submitted ?? 'N/A'}</td>
                    <td className={listStyles.mono}>{row.hours_approved ?? 'N/A'}</td>
                    <td>
                      <span className={`${listStyles.badge} ${statusClass(row.status)}`}>
                        {row.status ?? 'N/A'}
                      </span>
                    </td>
                    {isOrg ? (
                      <td>
                        {pending ? (
                          <div className={listStyles.actions}>
                            <form action={approveVolunteerHours} className={listStyles.actionForm}>
                              <input type="hidden" name="signupId" value={row.signup_id} />
                              <input type="hidden" name="decision" value="approved" />
                              <label>
                                Hrs
                                <input
                                  type="number"
                                  name="approvedHours"
                                  min={0}
                                  max={24}
                                  step={0.25}
                                  defaultValue={defaultApproved}
                                  className={listStyles.numberInput}
                                />
                              </label>
                              <button type="submit" className={`${listStyles.btn} ${listStyles.btnPrimary}`}>
                                Approve
                              </button>
                            </form>
                            <form action={approveVolunteerHours}>
                              <input type="hidden" name="signupId" value={row.signup_id} />
                              <input type="hidden" name="decision" value="rejected" />
                              <button type="submit" className={`${listStyles.btn} ${listStyles.btnDanger}`}>
                                Reject
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="body-sm" style={{ color: 'var(--text-muted)' }}>
                            N/A
                          </span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
