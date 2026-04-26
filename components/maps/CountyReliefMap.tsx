'use client'

import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import L from 'leaflet'
import { COUNTY_COORDINATES } from '@/lib/data/countyCoordinates'
import { COUNTY_ZIP_CODES } from '@/lib/data/countyZipCodes'
import { useState } from 'react'

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

interface CountyReliefMapProps {
  counties: CountyRisk[]
}

function colorForLevel(level: string | null) {
  if (level === 'extreme') return 'var(--color-crisis)'
  if (level === 'severe') return 'var(--color-ember)'
  return 'var(--color-growth)'
}

export function CountyReliefMap({ counties }: CountyReliefMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [zipFilter, setZipFilter] = useState('')
  const [selectedCountyName, setSelectedCountyName] = useState<string | null>(null)

  const markers = useMemo(() => {
    const normalizedZip = zipFilter.trim()
    return counties
      .map((county) => ({
        ...county,
        coords: COUNTY_COORDINATES[county.name],
        zipCodes: COUNTY_ZIP_CODES[county.name] ?? [],
      }))
      .filter((county) => county.coords)
      .filter((county) => {
        if (!normalizedZip) return true
        return county.zipCodes.some((zip) => zip.startsWith(normalizedZip))
      })
  }, [counties, zipFilter])

  const selectedCounty = useMemo(
    () =>
      markers.find((county) => county.name === selectedCountyName) ??
      (markers.length > 0 ? markers[0] : null),
    [markers, selectedCountyName]
  )

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [35.5, -79.0],
      zoom: 7,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    markers.forEach((county) => {
      const isPrimary = Boolean(county.isPrimaryDisasterArea)
      const circle = L.circleMarker([county.coords.lat, county.coords.lng], {
        color: colorForLevel(county.droughtLevel),
        fillColor: colorForLevel(county.droughtLevel),
        fillOpacity: 0.7,
        weight: isPrimary ? 2 : 1,
        radius: isPrimary ? 10 : 7,
      }).addTo(map)

      const status = isPrimary
        ? 'Primary disaster area'
        : county.isContiguousDisasterArea
          ? 'Contiguous disaster area'
          : 'Monitoring'
      const deficit = county.precipitationDeficitInches?.toFixed(1) ?? 'N/A'
      const zipPreview = county.zipCodes.slice(0, 2).join(', ') || 'N/A'
      circle.bindPopup(
        `<div>
          <p><strong>${county.name} County</strong></p>
          <p>Drought: ${county.droughtLevel ?? 'Unknown'}</p>
          <p>Deficit: ${deficit} in</p>
          <p>Status: ${status}</p>
          <p>ZIPs: ${zipPreview}</p>
          <button data-county="${county.name}" class="map-detail-btn" style="margin-top:8px;padding:6px 10px;border:0;border-radius:8px;background:#0f5b4f;color:#f6f8f4;cursor:pointer;font-size:12px;">
            View Details
          </button>
        </div>`
      )

      circle.on('click', () => {
        setSelectedCountyName(county.name)
      })
    })

    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('.map-detail-btn') as HTMLElement | null
      if (!button) return
      const countyName = button.getAttribute('data-county')
      if (countyName) setSelectedCountyName(countyName)
    }
    map.getContainer().addEventListener('click', clickHandler)

    return () => {
      map.getContainer().removeEventListener('click', clickHandler)
      map.remove()
    }
  }, [markers])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-wheat/60 uppercase tracking-widest font-mono mb-1">
            Filter by ZIP code
          </label>
          <input
            value={zipFilter}
            onChange={(e) => setZipFilter(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="e.g. 28202"
            className="w-44 bg-soil/70 border border-wheat/20 rounded-lg px-3 py-2 text-sm text-wheat"
          />
        </div>
        <button
          onClick={() => setZipFilter('')}
          className="px-3 py-2 rounded-lg border border-wheat/20 text-sm text-wheat/70 hover:text-wheat"
        >
          Clear
        </button>
        <p className="text-xs text-wheat/55 font-mono">
          Showing {markers.length} mapped locations
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-wheat/10 overflow-hidden shadow-card"
      >
        <div ref={mapRef} className="h-[420px] w-full" />
      </motion.div>

      {selectedCounty && (
        <div className="rounded-2xl border border-growth/30 bg-growth/10 p-5">
          <h4 className="font-display text-2xl text-wheat mb-2">{selectedCounty.name} County Details</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <p className="text-wheat/80">FIPS: <span className="text-wheat">{selectedCounty.fipsCode}</span></p>
            <p className="text-wheat/80">Drought Level: <span className="text-wheat">{selectedCounty.droughtLevel ?? 'Unknown'}</span></p>
            <p className="text-wheat/80">Precipitation Deficit: <span className="text-wheat">{selectedCounty.precipitationDeficitInches?.toFixed(1) ?? 'N/A'} in</span></p>
            <p className="text-wheat/80">Topsoil Moisture: <span className="text-wheat">{selectedCounty.topsoilMoisture ?? 'N/A'}</span></p>
            <p className="text-wheat/80">Disaster Number: <span className="text-wheat">{selectedCounty.disasterNumber ?? 'N/A'}</span></p>
            <p className="text-wheat/80">Declaration Date: <span className="text-wheat">{selectedCounty.disasterDeclarationDate ?? 'N/A'}</span></p>
            <p className="text-wheat/80">Primary Disaster Area: <span className="text-wheat">{selectedCounty.isPrimaryDisasterArea ? 'Yes' : 'No'}</span></p>
            <p className="text-wheat/80">Contiguous Area: <span className="text-wheat">{selectedCounty.isContiguousDisasterArea ? 'Yes' : 'No'}</span></p>
            <p className="text-wheat/80 md:col-span-2">Representative ZIP codes: <span className="text-wheat">{(selectedCounty.zipCodes ?? []).join(', ') || 'N/A'}</span></p>
            <p className="text-wheat/55 md:col-span-2 text-xs">Last updated: {selectedCounty.updatedAt ?? 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
