import { Box3, Vector3 } from 'three'

/**
 * Check bounding box
 * @param box Boundng box
 * @returns True
 * @returns False
 */
const checkBoundingBox = (box: THREE.Box3): boolean => {
  const min = box.min
  const max = box.max
  if (
    !isFinite(min.x) ||
    !isFinite(min.y) ||
    !isFinite(min.z) ||
    !isFinite(max.x) ||
    !isFinite(max.y) ||
    !isFinite(max.z)
  )
    return false

  return true
}

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

  if (checkBoundingBox(box)) return box
  else return new Box3(new Vector3(0, 0, 0), new Vector3(0, 0, 0))
}

export default computeSceneBoundingBox
