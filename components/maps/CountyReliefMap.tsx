'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import L from 'leaflet'

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

interface CountyReliefMapProps {
  counties: CountyRisk[]
  overlays: MapOverlay[]
}

function colorForLevel(level: string | null) {
  if (level === 'extreme') return 'var(--color-crisis)'
  if (level === 'severe') return 'var(--color-ember)'
  if (level === 'none') return 'var(--color-sky)'
  return 'var(--color-growth)'
}

export function CountyReliefMap({ counties, overlays }: CountyReliefMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [zipFilter, setZipFilter] = useState('')
  const [selectedCountyName, setSelectedCountyName] = useState<string | null>(null)
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null)

  const markers = useMemo(() => {
    const normalizedZip = zipFilter.trim()
    return counties
      .map((county) => ({ ...county, zipCodes: county.zipCodes ?? [] }))
      .filter((county): county is typeof county & { lat: number; lng: number } => county.lat !== null && county.lng !== null)
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

  const visibleOverlays = useMemo(() => {
    const normalizedZip = zipFilter.trim()
    return overlays
      .filter((overlay): overlay is typeof overlay & { countyLat: number; countyLng: number } => overlay.countyLat !== null && overlay.countyLng !== null)
      .filter((overlay) => (normalizedZip ? (overlay.zipCode ?? '').startsWith(normalizedZip) : true))
  }, [overlays, zipFilter])

  const selectedOverlay = useMemo(
    () => visibleOverlays.find((overlay) => overlay.id === selectedOverlayId) ?? null,
    [visibleOverlays, selectedOverlayId]
  )

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [39.5, -98.35],
      zoom: 4,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    markers.forEach((county) => {
      const isPrimary = Boolean(county.isPrimaryDisasterArea)
      const circle = L.circleMarker([county.lat, county.lng], {
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
          <p>State: ${county.stateAbbr ?? 'N/A'}</p>
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
        setSelectedOverlayId(null)
      })
    })

    visibleOverlays.forEach((overlay, index) => {
      const marker = L.circleMarker(
        [overlay.countyLat + (index % 5) * 0.018, overlay.countyLng - (index % 4) * 0.014],
        {
          color: overlay.locationType === 'listing' ? '#0f5b4f' : '#f4c542',
          fillColor: overlay.locationType === 'listing' ? '#0f5b4f' : '#f4c542',
          fillOpacity: 0.9,
          weight: 2,
          radius: 6,
        }
      ).addTo(map)

      marker.bindPopup(
        `<div>
          <p><strong>${overlay.title}</strong></p>
          <p>Type: ${overlay.locationType === 'listing' ? 'Volunteer Listing' : 'Resource Submission'}</p>
          <p>ZIP: ${overlay.zipCode ?? 'N/A'}</p>
          <button data-overlay-id="${overlay.id}" class="map-overlay-detail-btn" style="margin-top:8px;padding:6px 10px;border:0;border-radius:8px;background:#0f5b4f;color:#f6f8f4;cursor:pointer;font-size:12px;">
            View Details
          </button>
        </div>`
      )

      marker.on('click', () => {
        setSelectedOverlayId(overlay.id)
        setSelectedCountyName(null)
      })
    })

    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('.map-detail-btn') as HTMLElement | null
      if (!button) return
      const countyName = button.getAttribute('data-county')
      if (countyName) setSelectedCountyName(countyName)

      const overlayButton = target?.closest('.map-overlay-detail-btn') as HTMLElement | null
      if (overlayButton) {
        const overlayId = overlayButton.getAttribute('data-overlay-id')
        if (overlayId) setSelectedOverlayId(overlayId)
      }
    }
    map.getContainer().addEventListener('click', clickHandler)

    return () => {
      map.getContainer().removeEventListener('click', clickHandler)
      map.remove()
    }
  }, [markers, visibleOverlays])

  return (
    <div className="space-y-4 relative z-0">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="zip-filter" className="block text-xs text-wheat/60 uppercase tracking-widest font-mono mb-1">
            Filter by ZIP code
          </label>
          <input
            id="zip-filter"
            aria-describedby="zip-filter-hint"
            value={zipFilter}
            onChange={(e) => setZipFilter(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="e.g. 28202"
            className="w-44 bg-soil/70 border border-wheat/20 rounded-lg px-3 py-2 text-sm text-wheat"
          />
          <p id="zip-filter-hint" className="sr-only">
            Enter a 5-digit ZIP code to filter counties and overlay points.
          </p>
        </div>
        <button
          onClick={() => setZipFilter('')}
          className="px-3 py-2 rounded-lg border border-wheat/20 text-sm text-wheat/70 hover:text-wheat"
        >
          Clear
        </button>
        <p className="text-xs text-wheat/55 font-mono">
          Showing {markers.length + visibleOverlays.length} mapped locations
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-wheat/10 overflow-hidden shadow-card"
      >
        {markers.length === 0 ? (
          <div className="h-[420px] w-full relative z-0 bg-soil/40 flex items-center justify-center px-4 text-center">
            <p className="text-wheat/70 text-sm">No counties found for this ZIP filter. Try clearing or changing the ZIP code.</p>
          </div>
        ) : (
          <div ref={mapRef} className="h-[420px] w-full relative z-0" />
        )}
      </motion.div>

      {selectedCounty && (
        <div className="rounded-2xl border border-growth/30 bg-growth/10 p-5">
          <h3 className="font-display text-2xl text-wheat mb-2">{selectedCounty.name} County Details</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <p className="text-wheat/80">FIPS: <span className="text-wheat">{selectedCounty.fipsCode}</span></p>
            <p className="text-wheat/80">State: <span className="text-wheat">{selectedCounty.stateAbbr ?? 'N/A'}</span></p>
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

      {selectedOverlay && (
        <div className="rounded-2xl border border-ember/35 bg-ember/10 p-5">
          <h3 className="font-display text-2xl text-wheat mb-2">{selectedOverlay.title}</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <p className="text-wheat/80">
              Type:{' '}
              <span className="text-wheat">
                {selectedOverlay.locationType === 'listing' ? 'Volunteer Listing' : 'Resource Submission'}
              </span>
            </p>
            <p className="text-wheat/80">County: <span className="text-wheat">{selectedOverlay.countyName}</span></p>
            <p className="text-wheat/80">Address: <span className="text-wheat">{selectedOverlay.address ?? 'N/A'}</span></p>
            <p className="text-wheat/80">City/State: <span className="text-wheat">{selectedOverlay.city ?? 'N/A'}, {selectedOverlay.state ?? 'NC'}</span></p>
            <p className="text-wheat/80">ZIP: <span className="text-wheat">{selectedOverlay.zipCode ?? 'N/A'}</span></p>
            <p className="text-wheat/80">Contact: <span className="text-wheat">{selectedOverlay.contactName ?? 'N/A'}</span></p>
            <p className="text-wheat/80">Email: <span className="text-wheat">{selectedOverlay.contactEmail ?? 'N/A'}</span></p>
            <p className="text-wheat/80">Phone: <span className="text-wheat">{selectedOverlay.contactPhone ?? 'N/A'}</span></p>
            <p className="text-wheat/55 md:col-span-2 text-xs">Created at: {selectedOverlay.createdAt ?? 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
