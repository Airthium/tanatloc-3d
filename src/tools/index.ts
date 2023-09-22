import { Box3, Vector3 } from 'three'

/**
 * Number array to Vector3
 * @param array Number array
 * @returns Vector3
 */
export const numberArraytoVector3 = (array: number[]): THREE.Vector3 =>
  new Vector3(array[0], array[1], array[2])

/**
 * Compute scene bounding box
 * @param scene Scene
 * @returns Bounding box
 */
export const computeSceneBoundingBox = (scene: THREE.Scene): THREE.Box3 => {
  const box = new Box3()

  scene.children.forEach((child) => {
    if (child.type === 'Mesh') {
      const mesh = child as THREE.Mesh
      mesh.geometry.computeBoundingBox()
      box.expandByObject(mesh)
    }
  })

  return box
}
