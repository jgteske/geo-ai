import { BBox } from '@/model/core'
import { Coordinate } from 'ol/coordinate'

export function transformNominatimCoordToCoord(
  lat: string,
  lon: string,
): Coordinate {
  return [parseFloat(lon), parseFloat(lat)]
}

/**
 * Map a Bounding Box to: [minLon, minLat, maxLon, maxLat]
 * @param bbox Bbox of strings
 * @returns {BBox}
 */
export function transformNominatimBBoxToBBox(
  bbox: [string, string, string, string],
): BBox {
  const correctBBox = [
    parseFloat(bbox[2]), // minLon
    parseFloat(bbox[0]), // minLat
    parseFloat(bbox[3]), // maxLon
    parseFloat(bbox[1]), // maxLat
  ] as BBox

  return correctBBox
}
