import { BBox } from '@/model/core'
import { Map } from 'ol'
import { Coordinate } from 'ol/coordinate'
import { fromLonLat, transformExtent } from 'ol/proj'

export function useZoomTo(map: Map | null) {
  /**
   * @param coords - [Longitude, Latitude]
   * @param zoom - Target zoom level (optional)
   */
  const zoomTo = (coords: Coordinate, zoom?: number) => {
    if (!map) {
      return
    }

    const view = map.getView()

    view.animate({
      center: fromLonLat(coords),
      zoom: zoom ?? view.getZoom(), // Stay at current zoom if not specified
      duration: 1000, // 1 second transition
    })
  }

  /**
   * Zoom to a Bounding Box
   * @param bbox - [minLon, minLat, maxLon, maxLat]
   */
  const zoomToExtent = (bbox: BBox | undefined) => {
    if (!map || !bbox) {
      return
    }

    const view = map.getView()
    const mapProjection = view.getProjection()

    // 1. Convert the Lat/Lon extent to the Map's projection (EPSG:3857)
    const extent = transformExtent(bbox, 'EPSG:4326', mapProjection)

    // 2. Use the fit method
    view.fit(extent, {
      padding: [50, 50, 50, 50], // Add space around the edges
      duration: 1000, // Smooth animation
    })
  }

  return { zoomTo, zoomToExtent }
}
