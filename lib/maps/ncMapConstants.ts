/**
 * North Carolina geographic bounding box — southwest then northeast corners
 * `[south, west]`, `[north, east]` in WGS84.
 *
 * Values match commonly published US Census / state-extent datasets (same figures as
 * Anthony L. D’Agostino “Bounding Boxes for All US States”, OpenDataDE NAD83 gist, etc.):
 * xmin -84.321869, ymin 33.842316, xmax -75.460621, ymax 36.588117 (STATEFP 37).
 */
export const NC_LAT_LNG_BOUNDS: [[number, number], [number, number]] = [
  [33.842316, -84.321869],
  [36.588117, -75.460621],
]

/** Tiny outward pad (degrees) so Leaflet maxBounds don’t clip tiles at the state line. */
export const NC_MAX_BOUNDS_PAD_DEG = 0.06

/** Padded clone for `L.map({ maxBounds })` — keeps panning inside NC [+ margin]. */
export const NC_LAT_LNG_MAX_BOUNDS_PADDED: [[number, number], [number, number]] = [
  [NC_LAT_LNG_BOUNDS[0][0] - NC_MAX_BOUNDS_PAD_DEG, NC_LAT_LNG_BOUNDS[0][1] - NC_MAX_BOUNDS_PAD_DEG],
  [NC_LAT_LNG_BOUNDS[1][0] + NC_MAX_BOUNDS_PAD_DEG, NC_LAT_LNG_BOUNDS[1][1] + NC_MAX_BOUNDS_PAD_DEG],
]
