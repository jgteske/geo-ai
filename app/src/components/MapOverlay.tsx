import { useZoomTo } from '@/hooks/useZoomTo'
import { SearchBar } from './SearchBar'
import { Map } from 'ol'

export interface MapOverlayProps {
  map: Map | null
}

export function MapOverlay(props: MapOverlayProps) {
  const { map } = props

  const { zoomToExtent } = useZoomTo(map)

  return (
    <div className="absolute top-4 right-4 z-10 flex p-4 max-w-sm gap-2 flex-col bg-white rounded-2xl">
      <SearchBar onLocationSelect={({ extend }) => zoomToExtent(extend)} />
    </div>
  )
}
