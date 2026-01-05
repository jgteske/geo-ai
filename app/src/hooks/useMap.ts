import Map from 'ol/Map.js'
import React from 'react'
import { useView } from './useView'
import { ViewOptions } from 'ol/View'

export interface UseMapParams extends ViewOptions {}

export function useMap(params: UseMapParams = {}) {
  const { center = [0, 0], zoom = 2 } = params
  const view = useView({ center, zoom })

  const mapElement = React.useRef<HTMLDivElement | null>(null)
  const [map, setMap] = React.useState<Map | null>(null)

  React.useEffect(() => {
    if (!mapElement.current) {
      return
    }

    const initialMap = new Map({
      target: mapElement.current,
      view: view,
      layers: [],
    })

    setMap(initialMap)

    return () => {
      initialMap.setTarget(undefined)
      setMap(null)
    }
  }, [view])

  return { mapElement, map }
}
