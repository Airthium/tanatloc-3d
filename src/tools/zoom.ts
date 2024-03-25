import * as THREE from 'three'
import { TrackballControlsProps } from '@react-three/drei'

/**
 * Zoom factor
 */
const zoomFactor = 0.01

/**
 * Zoom
 * @param camera Camera
 * @param controls Controls
 * @param direction Direction
 */
const zoom = (
  camera: THREE.PerspectiveCamera | undefined,
  controls: TrackballControlsProps | undefined,
  direction: 1 | -1
): void => {
  if (!camera || !controls) return
  const object = controls.object as THREE.PerspectiveCamera
  const target = controls.target as THREE.Vector3
  const targetDistance = object.position.distanceTo(target)
  const zoomDistance = targetDistance * direction * zoomFactor
  const translation = target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(zoomDistance)

  camera.position.add(translation)
}

export default zoom
