type OpenFemaDisasterRow = {
  disasterNumber: number | null
  declarationDate: string | null
  fipsStateCode: string | null
  fipsCountyCode: string | null
}

export type LiveDisasterSignal = {
  isDisasterRelated: boolean
  disasterNumber: string | null
  disasterDeclarationDate: string | null
}

/**
 * Live county disaster declarations from OpenFEMA (NC only).
 * Source: https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries
 */
export async function fetchNcLiveDisasterSignals(): Promise<{
  byCountyFips: Map<string, LiveDisasterSignal>
  asOf: string | null
}> {
  const since = new Date()
  since.setDate(since.getDate() - 730)
  const sinceIsoDate = since.toISOString().slice(0, 10)

  const filter = [
    "state eq 'NC'",
    "(declarationType eq 'DR' or declarationType eq 'EM')",
    `declarationDate ge '${sinceIsoDate}'`,
  ].join(' and ')

  const select = [
    'disasterNumber',
    'declarationDate',
    'fipsStateCode',
    'fipsCountyCode',
  ].join(',')

  const endpoint =
    `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries` +
    `?$filter=${encodeURIComponent(filter)}` +
    `&$select=${encodeURIComponent(select)}` +
    `&$top=2000`

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 * 60 * 6 },
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      return { byCountyFips: new Map(), asOf: null }
    }

    const payload = (await response.json()) as {
      metadata?: { lastRefresh?: string }
      DisasterDeclarationsSummaries?: OpenFemaDisasterRow[]
    }

    const byCountyFips = new Map<string, LiveDisasterSignal>()
    for (const row of payload.DisasterDeclarationsSummaries ?? []) {
      if (row.fipsStateCode !== '37') continue
      const countyCode = String(row.fipsCountyCode ?? '').trim()
      if (!/^\d{3}$/.test(countyCode)) continue
      const fips = `37${countyCode}`

      const existing = byCountyFips.get(fips)
      const nextDate = row.declarationDate ?? null
      const hasNewerDate =
        nextDate &&
        (!existing?.disasterDeclarationDate ||
          new Date(nextDate).getTime() > new Date(existing.disasterDeclarationDate).getTime())

      if (!existing || hasNewerDate) {
        byCountyFips.set(fips, {
          isDisasterRelated: true,
          disasterNumber: row.disasterNumber != null ? String(row.disasterNumber) : null,
          disasterDeclarationDate: nextDate,
        })
      }
    }

    return {
      byCountyFips,
      asOf: payload.metadata?.lastRefresh ?? null,
    }
  } catch {
    return { byCountyFips: new Map(), asOf: null }
  }
}
