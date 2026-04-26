'use client'

import dynamic from 'next/dynamic'

type CountyRisk = {
  name: string
  fipsCode: string
  droughtLevel: string | null
  precipitationDeficitInches: number | null
  isPrimaryDisasterArea: boolean | null
  isContiguousDisasterArea: boolean | null
  disasterNumber: string | null
  disasterDeclarationDate: string | null
  topsoilMoisture: string | null
  updatedAt: string | null
}

type MapOverlay = {
  id: string
  locationType: 'listing' | 'resource_submission'
  title: string
  countyName: string
  zipCode: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  city: string | null
  state: string | null
  createdAt: string | null
}

const CountyReliefMap = dynamic(
  () => import('@/components/maps/CountyReliefMap').then((mod) => mod.CountyReliefMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-2xl bg-soil/60 border border-wheat/10 animate-pulse flex items-center justify-center text-wheat/50 text-sm">
        Loading map...
      </div>
    ),
  }
)

export function CountyReliefMapSection({
  counties,
  overlays,
}: {
  counties: CountyRisk[]
  overlays: MapOverlay[]
}) {
  return <CountyReliefMap counties={counties} overlays={overlays} />
}
