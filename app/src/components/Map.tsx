import { useMap } from '@/hooks/useMap'
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'
import React from 'react'
import 'ol/ol.css'
import { MapOverlay } from './MapOverlay'

export function Map() {
  const { mapElement, map } = useMap()

  React.useEffect(() => {
    // 1. Check if map exists
    if (!map) {
      return
    }

    // 2. Define the layer
    const source = new OSM()
    const layer = new TileLayer({ source })

    // 3. Add the layer
    map.addLayer(layer)

    // 4. Cleanup: Remove the layer if the component unmounts
    // This prevents duplicate layers if the component re-renders
    return () => {
      map.removeLayer(layer)
    }
  }, [map])

  return (
    <div className="relative w-full h-screen">
      <MapOverlay map={map} />
      <div ref={mapElement} className="w-full h-full" />
    </div>
  )
}
