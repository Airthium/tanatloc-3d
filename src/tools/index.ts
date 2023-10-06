import { Box3, Euler, Vector3 } from 'three'

/**
 * Number array to Vector3
 * @param array Number array
 * @returns Vector3
 */
export const numberArraytoVector3 = (array: number[]): THREE.Vector3 =>
  new Vector3(array[0], array[1], array[2])

/**
 * Number array to Euler (XYZ)
 * @param array Number array
 * @returns Euler
 */
export const numberArraytoEuler = (array: number[]): THREE.Euler =>
  new Euler(array[0], array[1], array[2], 'XYZ')

/**
 * Compute scene bounding box
 * @param scene Scene
 * @returns Bounding box
 */
export const computeSceneBoundingBox = (
  children: THREE.Scene['children']
): THREE.Box3 => {
  const box = new Box3()

  children.forEach((child) => {
    if (child.type === 'Part') {
      const mesh = child as THREE.Mesh
      mesh.geometry.computeBoundingBox()
      box.expandByObject(mesh)
    }
  })

  return box
}
