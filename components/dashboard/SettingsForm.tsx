'use client'

import { updateProfileSettings } from '@/lib/volunteer/actions'

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
    <form action={updateProfileSettings} className="rounded-xl border border-wheat/10 bg-soil/50 p-5 space-y-4 text-sm">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-wheat/55 text-xs">Full Name</label>
          <input
            name="fullName"
            defaultValue={defaultValues.fullName}
            className="mt-1 w-full rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-wheat"
          />
        </div>
        <div>
          <label className="text-wheat/55 text-xs">Email (read-only)</label>
          <input
            value={defaultValues.email}
            readOnly
            className="mt-1 w-full rounded-lg bg-ash/50 border border-wheat/10 px-3 py-2 text-wheat/65"
          />
        </div>
        <div>
          <label className="text-wheat/55 text-xs">Phone</label>
          <input
            name="phone"
            defaultValue={defaultValues.phone}
            className="mt-1 w-full rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-wheat"
          />
        </div>
        <div>
          <label className="text-wheat/55 text-xs">City</label>
          <input
            name="city"
            defaultValue={defaultValues.city}
            className="mt-1 w-full rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-wheat"
          />
        </div>
        <div>
          <label className="text-wheat/55 text-xs">ZIP Code (NC)</label>
          <input
            name="zipCode"
            defaultValue={defaultValues.zipCode}
            className="mt-1 w-full rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-wheat"
          />
        </div>
        <div>
          <label className="text-wheat/55 text-xs">Account Type</label>
          <input
            value={defaultValues.accountType}
            readOnly
            className="mt-1 w-full rounded-lg bg-ash/50 border border-wheat/10 px-3 py-2 text-wheat/65 capitalize"
          />
        </div>
      </div>
      <button className="rounded-lg bg-growth px-4 py-2 text-parchment font-semibold text-sm">
        Save Settings
      </button>
    </form>
  )
}
