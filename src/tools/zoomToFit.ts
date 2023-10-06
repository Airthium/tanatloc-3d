import { TrackballControlsProps } from '@react-three/drei'
import { computeSceneBoundingBox } from '.'
import { Sphere, Vector3 } from 'three'

/**
 * Zoom to fit
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 */
const zoomToFit = (
  scene: THREE.Scene | undefined,
  camera: THREE.PerspectiveCamera | undefined,
  controls: TrackballControlsProps | undefined
): void => {
  if (!scene || !camera || !controls) return

  // Center
  const boundingBox = computeSceneBoundingBox(scene.children)
  const center = new Vector3()
  boundingBox.getCenter(center)

  // Direction
  const sphere = new Sphere()
  boundingBox.getBoundingSphere(sphere)
  const maxSize = 2 * sphere.radius
  const fitHeight = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidth = fitHeight / camera.aspect
  const distance = 1.1 * Math.max(fitHeight, fitWidth)
  const target = controls.target as THREE.Vector3
  const direction = target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance)

  // Controls
  target.copy(center)
  controls.minDistance = distance / 10
  controls.maxDistance = distance * 10

  // Camera
  camera.position.copy(center).sub(direction)
  camera.near = distance / 100
  camera.far = distance * 100
  camera.updateProjectionMatrix()
}

export default zoomToFit
