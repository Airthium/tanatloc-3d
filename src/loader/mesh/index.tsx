import { useContext, useMemo } from 'react'
import { LineBasicMaterial, WireframeGeometry } from 'three'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context } from '@context'

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
  // Context
  const { display, sectionView } = useContext(Context)

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
const Mesh = ({ scene }: MeshProps): React.JSX.Element => {
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
