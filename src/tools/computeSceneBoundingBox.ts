import { Box3 } from 'three'

/**
 * Compute scene bounding box
 * @param scene Scene
 * @returns Bounding box
 */
const computeSceneBoundingBox = (
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

export default computeSceneBoundingBox
