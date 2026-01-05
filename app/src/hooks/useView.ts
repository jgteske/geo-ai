import { fromLonLat } from 'ol/proj'
import View, { ViewOptions } from 'ol/View.js'
import React from 'react'

export interface UseViewParams extends ViewOptions {}

export function useView(params: UseViewParams = {}) {
  const { center, zoom } = params

  const calcCenter = React.useMemo(
    () => (center ? fromLonLat(center) : undefined),
    [JSON.stringify(center)],
  )

  return React.useMemo(
    () =>
      new View({
        center: calcCenter,
        zoom: zoom,
      }),
    [calcCenter, zoom],
  )
}
