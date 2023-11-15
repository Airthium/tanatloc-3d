import { ReactNode, useMemo } from 'react'
import { LineBasicMaterial, WireframeGeometry } from 'three'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import useStore from '@store'

/**
 * Props
 */
export interface MeshProps {
  scene: GLTF['scene']
}

export interface MeshFaceProps {
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
}

/**
 * Mesh face
 * @param props Props
 * @returns MeshFace
 */
const MeshFace = ({ child }: MeshFaceProps) => {
  // Store
  const display = useStore((s) => s.display)
  const sectionView = useStore((s) => s.sectionView)

  // Geometry
  const mesh = useMemo(() => {
    const geometry = new WireframeGeometry(child.geometry)
    const material = new LineBasicMaterial({
      linewidth: 2,
      transparent: true,
      color: child.material.color,
      opacity: display.transparent ? 0.5 : 1,
      clippingPlanes:
        sectionView.enabled && sectionView.clippingPlane
          ? [sectionView.clippingPlane]
          : []
    })
    const mesh = <lineSegments args={[geometry, material]} />
    return mesh
  }, [child, display, sectionView])

  /**
   * Render
   */
  return (
    <mesh
      name={child.name}
      uuid={child.userData.uuid}
      userData={child.userData}
    >
      <primitive object={child.geometry} />
      <meshBasicMaterial
        transparent
        side={2}
        opacity={0}
        clippingPlanes={
          sectionView.enabled && sectionView.clippingPlane
            ? [sectionView.clippingPlane]
            : []
        }
      />
      {mesh}
    </mesh>
  )
}

/**
 * Mesh
 * @param props props
 * @returns Mesh
 */
const Mesh = ({ scene }: MeshProps): ReactNode => {
  // Children
  const children = useMemo(
    () =>
      scene.children as THREE.Mesh<
        THREE.BufferGeometry,
        THREE.MeshStandardMaterial
      >[],
    [scene.children]
  )

  /**
   * Render
   */
  return (
    <mesh type="Mesh">
      {children.map((child) => (
        <MeshFace key={child.uuid} child={child} />
      ))}
    </mesh>
  )
}

export default Mesh
