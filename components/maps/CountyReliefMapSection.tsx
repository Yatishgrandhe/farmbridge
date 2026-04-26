'use client'

import dynamic from 'next/dynamic'
import styles from './CountyReliefMapSection.module.css'

type CountyRisk = {
  name: string
  fipsCode: string
  stateAbbr: string | null
  lat: number | null
  lng: number | null
  zipCodes: string[]
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
  countyFips: string | null
  countyLat: number | null
  countyLng: number | null
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
      <div className={styles.loadingState}>
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
