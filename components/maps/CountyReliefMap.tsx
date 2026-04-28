'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import styles from './CountyReliefMap.module.css'

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

function readCssVar(name: string): string {
  if (typeof document === 'undefined') return ''
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || ''
}

function droughtFill(level: string | null, palette: { urgent: string; accent: string; safe: string; muted: string }) {
  if (level === 'exceptional' || level === 'extreme') return palette.urgent
  if (level === 'severe') return palette.accent
  if (level === 'moderate' || level === 'none') return palette.muted
  return palette.safe
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
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

  const hasMapData = markers.length > 0 || visibleOverlays.length > 0

  useEffect(() => {
    if (!mapRef.current || !hasMapData) return

    const urgent = readCssVar('--urgent')
    const accent = readCssVar('--accent')
    const safe = readCssVar('--safe')
    const muted = readCssVar('--text-muted')
    const text = readCssVar('--text-primary')
    const bg = readCssVar('--bg-elevated')
    const btnBg = readCssVar('--safe')
    const btnFg = readCssVar('--text-on-dark')
    const warn = readCssVar('--warning')

    const palette = {
      urgent: urgent || '#c0392b',
      accent: accent || '#c4622d',
      safe: safe || '#2d6a4f',
      muted: muted || '#7a7568',
    }

    const map = L.map(mapRef.current, {
      center: [35.5, -79.5],
      zoom: 7,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    const bounds = L.latLngBounds([])

    markers.forEach((county) => {
      const fill = droughtFill(county.droughtLevel, palette)
      const isPrimary = Boolean(county.isPrimaryDisasterArea)
      const circle = L.circleMarker([county.lat, county.lng], {
        color: fill,
        fillColor: fill,
        fillOpacity: 0.72,
        weight: isPrimary ? 2 : 1,
        radius: isPrimary ? 10 : 7,
      }).addTo(map)

      bounds.extend([county.lat, county.lng])

      const status = isPrimary
        ? 'Primary disaster area'
        : county.isContiguousDisasterArea
          ? 'Contiguous disaster area'
          : 'Monitoring'
      const deficit = county.precipitationDeficitInches?.toFixed(1) ?? 'N/A'
      const zipPreview = county.zipCodes.slice(0, 2).join(', ') || 'N/A'
      const btnStyle = `margin-top:8px;padding:8px 12px;border:0;border-radius:8px;background:${btnBg};color:${btnFg};cursor:pointer;font-size:12px;font-weight:600;`
      const popStyle = `font-family: system-ui,sans-serif;color:${text};background:${bg};`
      circle.bindPopup(
        `<div style="${popStyle}min-width:200px;">
          <p style="margin:0 0 6px;font-weight:700;">${escHtml(county.name)} County</p>
          <p style="margin:4px 0;font-size:13px;">State: ${escHtml(county.stateAbbr ?? 'N/A')}</p>
          <p style="margin:4px 0;font-size:13px;">Drought: ${escHtml(county.droughtLevel ?? 'Unknown')}</p>
          <p style="margin:4px 0;font-size:13px;">Deficit: ${deficit} in</p>
          <p style="margin:4px 0;font-size:13px;">Status: ${status}</p>
          <p style="margin:4px 0;font-size:13px;">ZIPs: ${escHtml(zipPreview)}</p>
          <button type="button" data-county="${encodeURIComponent(county.name)}" class="map-detail-btn" style="${btnStyle}">
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
      const listingFill = readCssVar('--safe') || palette.safe
      const resourceFill = warn || palette.accent
      const olColor = overlay.locationType === 'listing' ? listingFill : resourceFill

      const lat = overlay.countyLat + (index % 5) * 0.018
      const lng = overlay.countyLng - (index % 4) * 0.014
      bounds.extend([lat, lng])

      const marker = L.circleMarker([lat, lng], {
        color: olColor,
        fillColor: olColor,
        fillOpacity: 0.88,
        weight: 2,
        radius: 6,
      }).addTo(map)

      const btnStyle = `margin-top:8px;padding:8px 12px;border:0;border-radius:8px;background:${btnBg};color:${btnFg};cursor:pointer;font-size:12px;font-weight:600;`
      const popStyle = `font-family: system-ui,sans-serif;color:${text};background:${bg};`
      marker.bindPopup(
        `<div style="${popStyle}min-width:200px;">
          <p style="margin:0 0 6px;font-weight:700;">${escHtml(overlay.title)}</p>
          <p style="margin:4px 0;font-size:13px;">Type: ${overlay.locationType === 'listing' ? 'Volunteer listing' : 'Resource submission'}</p>
          <p style="margin:4px 0;font-size:13px;">ZIP: ${escHtml(overlay.zipCode ?? 'N/A')}</p>
          <button type="button" data-overlay-id="${escHtml(overlay.id)}" class="map-overlay-detail-btn" style="${btnStyle}">
            View Details
          </button>
        </div>`
      )

      marker.on('click', () => {
        setSelectedOverlayId(overlay.id)
        setSelectedCountyName(null)
      })
    })

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 })
    }

    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('.map-detail-btn') as HTMLElement | null
      if (button) {
        const raw = button.getAttribute('data-county')
        if (raw) {
          try {
            setSelectedCountyName(decodeURIComponent(raw))
          } catch {
            setSelectedCountyName(raw)
          }
        }
      }

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
  }, [markers, visibleOverlays, hasMapData])

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label htmlFor="zip-filter" className={styles.filterLabel}>
            Filter by ZIP code
          </label>
          <input
            id="zip-filter"
            aria-describedby="zip-filter-hint"
            value={zipFilter}
            onChange={(e) => setZipFilter(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="e.g. 28202"
            className={styles.filterInput}
          />
          <p id="zip-filter-hint" className="sr-only">
            Enter a 5-digit ZIP code to filter counties and overlay points.
          </p>
        </div>
        <button type="button" onClick={() => setZipFilter('')} className={styles.clearButton}>
          Clear
        </button>
        <p className={styles.statsText}>
          Showing {markers.length + visibleOverlays.length} mapped locations
        </p>
      </div>

      <div className={styles.mapWrapper}>
        {!hasMapData ? (
          <div className={styles.mapFallback}>
            <p className={styles.fallbackText}>
              No county or volunteer data matched this filter. Try clearing the ZIP code or check back after data loads.
            </p>
          </div>
        ) : (
          <div ref={mapRef} className={styles.mapContainer} />
        )}
      </div>

      {selectedCounty && (
        <div className={styles.detailPanel}>
          <h3 className={styles.panelTitle}>{selectedCounty.name} County Details</h3>
          <div className={styles.panelGrid}>
            <p className={styles.panelLabel}>
              FIPS: <span className={styles.panelValue}>{selectedCounty.fipsCode}</span>
            </p>
            <p className={styles.panelLabel}>
              State: <span className={styles.panelValue}>{selectedCounty.stateAbbr ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Drought Level: <span className={styles.panelValue}>{selectedCounty.droughtLevel ?? 'Unknown'}</span>
            </p>
            <p className={styles.panelLabel}>
              Precipitation Deficit:{' '}
              <span className={styles.panelValue}>{selectedCounty.precipitationDeficitInches?.toFixed(1) ?? 'N/A'} in</span>
            </p>
            <p className={styles.panelLabel}>
              Topsoil Moisture: <span className={styles.panelValue}>{selectedCounty.topsoilMoisture ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Disaster Number: <span className={styles.panelValue}>{selectedCounty.disasterNumber ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Declaration Date: <span className={styles.panelValue}>{selectedCounty.disasterDeclarationDate ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Primary Disaster Area:{' '}
              <span className={styles.panelValue}>{selectedCounty.isPrimaryDisasterArea ? 'Yes' : 'No'}</span>
            </p>
            <p className={styles.panelLabel}>
              Contiguous Area:{' '}
              <span className={styles.panelValue}>{selectedCounty.isContiguousDisasterArea ? 'Yes' : 'No'}</span>
            </p>
            <p className={`${styles.panelLabel} ${styles.spanTwo}`}>
              Representative ZIP codes:{' '}
              <span className={styles.panelValue}>{(selectedCounty.zipCodes ?? []).join(', ') || 'N/A'}</span>
            </p>
            <p className={`${styles.updatedAt} ${styles.spanTwo}`}>Last updated: {selectedCounty.updatedAt ?? 'N/A'}</p>
          </div>
        </div>
      )}

      {selectedOverlay && (
        <div className={styles.overlayPanel}>
          <h3 className={styles.panelTitle}>{selectedOverlay.title}</h3>
          <div className={styles.panelGrid}>
            <p className={styles.panelLabel}>
              Type:{' '}
              <span className={styles.panelValue}>
                {selectedOverlay.locationType === 'listing' ? 'Volunteer Listing' : 'Resource Submission'}
              </span>
            </p>
            <p className={styles.panelLabel}>
              County: <span className={styles.panelValue}>{selectedOverlay.countyName}</span>
            </p>
            <p className={styles.panelLabel}>
              Address: <span className={styles.panelValue}>{selectedOverlay.address ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              City/State:{' '}
              <span className={styles.panelValue}>
                {selectedOverlay.city ?? 'N/A'}, {selectedOverlay.state ?? 'NC'}
              </span>
            </p>
            <p className={styles.panelLabel}>
              ZIP: <span className={styles.panelValue}>{selectedOverlay.zipCode ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Contact: <span className={styles.panelValue}>{selectedOverlay.contactName ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Email: <span className={styles.panelValue}>{selectedOverlay.contactEmail ?? 'N/A'}</span>
            </p>
            <p className={styles.panelLabel}>
              Phone: <span className={styles.panelValue}>{selectedOverlay.contactPhone ?? 'N/A'}</span>
            </p>
            <p className={`${styles.updatedAt} ${styles.spanTwo}`}>Created at: {selectedOverlay.createdAt ?? 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
