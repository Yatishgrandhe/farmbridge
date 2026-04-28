'use client'

import { updateProfileSettings } from '@/lib/volunteer/actions'
import styles from './SettingsForm.module.css'

interface SettingsFormProps {
  defaultValues: {
    fullName: string
    email: string
    phone: string
    city: string
    zipCode: string
    accountType: string
  }
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  return (
    <form action={updateProfileSettings} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="settings-full-name">Full Name</label>
          <input
            id="settings-full-name"
            name="fullName"
            defaultValue={defaultValues.fullName}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="settings-email">Email (read-only)</label>
          <input
            id="settings-email"
            value={defaultValues.email}
            readOnly
            className={styles.inputReadonly}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="settings-phone">Phone</label>
          <input
            id="settings-phone"
            name="phone"
            defaultValue={defaultValues.phone}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="settings-city">City</label>
          <input id="settings-city" name="city" defaultValue={defaultValues.city} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="settings-zip">ZIP Code</label>
          <input
            id="settings-zip"
            name="zipCode"
            defaultValue={defaultValues.zipCode}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="settings-account-type">Account Type</label>
          <input
            id="settings-account-type"
            value={defaultValues.accountType}
            readOnly
            className={styles.inputReadonly}
          />
        </div>
      </div>
      <button type="submit" className={styles.submit}>
        Save Settings
      </button>
    </form>
  )
}
