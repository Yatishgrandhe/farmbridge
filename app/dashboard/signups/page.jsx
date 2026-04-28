import { redirect } from 'next/navigation'

import { manageSignupAction } from '@/lib/volunteer/actions'
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

export default async function ApplicationTrackerPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/dashboard/signups')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!profile) redirect('/login?redirectTo=/dashboard/signups')

  const query = supabase
    .from('volunteer_signups')
    .select('*, volunteer_listings(title,city,state,zip_code)')
    .order('created_at', { ascending: false })

  const { data: signups } =
    profile.account_type === 'organization'
      ? await query.limit(80)
      : await query.eq('profile_id', profile.id).limit(80)

  const isOrg = profile.account_type === 'organization'
  const rows = signups ?? []

  return (
    <main className={styles.dashboardPage}>
      <section className={`${styles.dashboardHero} animate-on-scroll`}>
        <div className={styles.heroContent}>
          <p className="label">APPLICATIONS</p>
          <h1 className="display-lg">Application tracker</h1>
          <p className="body-md" style={{ maxWidth: '600px' }}>
            Volunteer signups linked to your account {isOrg ? 'and your organization listings' : ''}.
          </p>
        </div>
      </section>

      <div className={`animate-on-scroll ${listStyles.wrap}`}>
        {rows.length === 0 ? (
          <p className={listStyles.empty}>No applications yet.</p>
        ) : (
          <table className={listStyles.table}>
            <thead>
              <tr>
                <th>Listing</th>
                <th>Volunteer</th>
                <th>Date / hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const listing = relOne(row.volunteer_listings)
                const loc =
                  listing?.city || listing?.state
                    ? [listing?.city, listing?.state, listing?.zip_code].filter(Boolean).join(', ')
                    : ''
                const canDelete = isOrg || row.profile_id === profile.id
                const showOrgActions = isOrg

                return (
                  <tr key={row.id}>
                    <td>
                      <div>{listing?.title ?? 'N/A'}</div>
                      {loc ? (
                        <div className="body-sm" style={{ color: 'var(--text-muted)' }}>
                          {loc}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <div>{row.volunteer_name ?? 'N/A'}</div>
                      <div className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        {row.volunteer_email ?? ''}
                      </div>
                    </td>
                    <td className={listStyles.mono}>
                      <div>{row.volunteer_date ?? 'N/A'}</div>
                      <div className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        {row.declared_hours != null ? `${row.declared_hours} hrs` : ''}
                      </div>
                    </td>
                    <td>
                      <span className={`${listStyles.badge} ${statusClass(row.status)}`}>
                        {row.status ?? 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className={listStyles.actions}>
                        {showOrgActions ? (
                          <>
                            <form action={manageSignupAction}>
                              <input type="hidden" name="signupId" value={row.id} />
                              <input type="hidden" name="action" value="approve" />
                              <button type="submit" className={`${listStyles.btn} ${listStyles.btnPrimary}`}>
                                Approve
                              </button>
                            </form>
                            <form action={manageSignupAction}>
                              <input type="hidden" name="signupId" value={row.id} />
                              <input type="hidden" name="action" value="delay" />
                              <button type="submit" className={listStyles.btn}>
                                Mark pending
                              </button>
                            </form>
                          </>
                        ) : null}
                        {canDelete ? (
                          <form action={manageSignupAction}>
                            <input type="hidden" name="signupId" value={row.id} />
                            <input type="hidden" name="action" value="delete" />
                            <button type="submit" className={`${listStyles.btn} ${listStyles.btnDanger}`}>
                              Delete
                            </button>
                          </form>
                        ) : (
                          <span className="body-sm" style={{ color: 'var(--text-muted)' }}>
                            N/A
                          </span>
                        )}
                      </div>
                    </td>
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
