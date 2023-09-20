import { Vector3 } from 'three'

/**
 * Number array to Vector3
 * @param array Number array
 * @returns Vector3
 */
export const numberArraytoVector3 = (array: number[]): THREE.Vector3 =>
  new Vector3(array[0], array[1], array[2])
