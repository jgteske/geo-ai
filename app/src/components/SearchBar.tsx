import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import {
  transformNominatimBBoxToBBox,
  transformNominatimCoordToCoord,
} from '@/support/transform'
import { Coordinate } from 'ol/coordinate'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command'
import { useThrottledCallback } from '@tanstack/react-pacer/throttler'

interface OnLocationSelectProps {
  coords?: Coordinate
  extend?: [number, number, number, number]
}

interface SearchBarProps {
  onLocationSelect: (props: OnLocationSelectProps) => void
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState<boolean>(false)

  const handleSearch = async (signal: AbortSignal) => {
    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`,
        {
          signal,
        },
      )
      const data = await response.json()
      setResults(data)
      setOpen(data.length > 0)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted: newer search started')
      } else {
        console.error('Search failed', error)
      }
    } finally {
      setSearching(false)
    }
  }

  // debouncing the search to wait for 100ms before getting triggered when typing
  // this will prevent from triggering to many search requests for the api and reduce the load
  const debouncedSearch = useThrottledCallback(handleSearch, { wait: 100 })

  useEffect(() => {
    // 1. Minimum character check
    if (query.length < 3) {
      setResults([])
      setOpen(false)
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    debouncedSearch(signal)

    return () => {
      controller.abort()
    }
  }, [query, debouncedSearch])

  const handleSelect = (item: any) => {
    const { lon, lat, boundingbox } = item
    const correctBbox = transformNominatimBBoxToBBox(boundingbox)

    onLocationSelect({
      coords: transformNominatimCoordToCoord(lat, lon),
      extend: correctBbox,
    })

    setQuery(item.display_name)
    setOpen(false)
  }

  return (
    <div className="w-full max-w-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10" // Space for the spinner
              isLoading={searching} // Using the loading prop we added earlier!
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          align="start"
          // This prevents the popover from taking focus away from the input
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {results.map((item) => (
                  <CommandItem
                    key={item.place_id}
                    value={item.display_name}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{item.display_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
