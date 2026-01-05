import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  transformNominatimBBoxToBBox,
  transformNominatimCoordToCoord,
} from '@/support/transform'
import { Spinner } from './ui/spinner'
import { Coordinate } from 'ol/coordinate'

interface OnLocationSelectProps {
  coords?: Coordinate
  extend?: [number, number, number, number]
}

interface SearchBarProps {
  onLocationSelect: (props: OnLocationSelectProps) => void
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState<boolean>(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const { lon, lat, boundingbox } = data[0]
      // Map it to: [minLon, minLat, maxLon, maxLat]
      const correctBbox = transformNominatimBBoxToBBox(boundingbox)
      onLocationSelect({
        coords: transformNominatimCoordToCoord(lat, lon),
        extend: correctBbox,
      })
    } else {
      alert('Location not found')
    }
    setSearching(false)
  }

  return (
    <form
      onSubmit={handleSearch}
      //style={{ position: 'absolute', zIndex: 10, top: 10, left: 50 }}
    >
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          value={query}
          disabled={searching}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <Button disabled={searching} type="submit" variant="outline">
          {searching ? <Spinner /> : 'Search'}
        </Button>
      </div>
    </form>
  )
}
