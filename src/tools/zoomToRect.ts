import { TrackballControlsProps } from '@react-three/drei'
import { Raycaster, Vector2 } from 'three'

// TODO bug with result

/**
 * Zoom to rect
 * @param rect Rect
 * @param gl Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 * @returns
 */
const zoomToRect = (
  rect: THREE.Box2,
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: TrackballControlsProps
) => {
  // Check size
  const size = {
    x: Math.abs(rect.max.x - rect.min.x),
    y: Math.abs(rect.max.y - rect.min.y)
  }
  if (size.x < 5 || size.y < 5) return

  // Center
  const center = {
    x: (rect.max.x + rect.min.x) / 2,
    y: (rect.max.y + rect.min.y) / 2
  }

  const parentRect = gl.domElement.getBoundingClientRect()
  const X = center.x - parentRect.left
  const Y = center.y - parentRect.top

  const raycasterCenter = new Vector2(
    (X / parentRect.width) * 2 - 1,
    -(Y / parentRect.height) * 2 + 1
  )

  // Intersection
  const objects = scene.children.filter((child) => child.type === 'Part')
  if (!objects.length) return

  const raycaster = new Raycaster()
  raycaster.setFromCamera(raycasterCenter, camera)
  const intersects = raycaster.intersectObjects(objects)

  // Intersection point
  if (!intersects.length) return
  const intersect = intersects[0].point

  // Set center
  const target = controls.target as THREE.Vector3
  target.copy(intersect)

  // Zoom
  const ratio = new Vector2(
    size.x / parentRect.width,
    size.y / parentRect.height
  )
  const maxRatio = Math.max(ratio.x, ratio.y)
  const zoomFactor = 1 - maxRatio

  const distance = camera.position.distanceTo(target)
  const zoomDistance = distance * zoomFactor
  const translation = target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(zoomDistance)

  camera.position.add(translation)
}

export default zoomToRect
