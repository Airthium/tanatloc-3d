import { ReactNode, useMemo } from 'react'
import { LineBasicMaterial, WireframeGeometry } from 'three'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import useStore from '@store'

/**
 * Props
 */
export interface ResultProps {
  scene: GLTF['scene']
}

export interface ResultChildProps {
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
}

/**
 * Get min / max
 * @param results Results
 * @returns { min, max }
 */
const getMinMax = (
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
): { min: number; max: number } => {
  const colorAttribute = child.geometry.getAttribute('color')
  if (colorAttribute) return { min: Infinity, max: -Infinity }

  const data = child.geometry.getAttribute('data')
  if (!data) return { min: Infinity, max: -Infinity }
  const array = data.array as unknown as number[]
  let min = array.reduce((a, b) => Math.min(a, b), Infinity)
  let max = array.reduce((a, b) => Math.max(a, b), -Infinity)

  if (min === max) {
    if (min < 1e-12) {
      min = -1
      max = 1
    } else {
      min = min - 0.1 * max
      max = max - 0.1 * max
    }
  }

  return { min, max }
}

/**
 * Result child
 * @param props props
 * @returns ResultChild
 */
const ResultChild = ({ child }: ResultChildProps): ReactNode => {
  // Store
  const display = useStore((s) => s.display)
  const sectionView = useStore((s) => s.sectionView)
  const result = useStore((s) => s.result)

  // Min / max & data
  const { min, max } = useMemo(() => getMinMax(child), [child])
  const data = useMemo(() => {
    const data = child.geometry.getAttribute('data')
    if (!data) return {}
    return {
      count: data.count,
      array: data.array as unknown as number[]
    }
  }, [child])

  // Result mesh
  const resultMesh = useMemo(() => {
    if (!result.meshVisible || child.type !== 'Mesh') return undefined

    const geometry = new WireframeGeometry(child.geometry)
    const material = new LineBasicMaterial({
      linewidth: 2,
      transparent: true,
      color: 0x000000,
      opacity: display.transparent ? 0.5 : 1,
      clippingPlanes:
        sectionView.enabled && sectionView.clippingPlane
          ? [sectionView.clippingPlane]
          : []
    })
    const mesh = <lineSegments args={[geometry, material]} />
    return mesh
  }, [
    display.transparent,
    sectionView.enabled,
    sectionView.clippingPlane,
    result.meshVisible,
    child
  ])

  /**
   * Render
   */
  return (
    <mesh
      name={child.name}
      type="Result"
      uuid={child.userData.uuid}
      userData={{
        ...child.userData,
        lut: {
          min,
          max
        },
        data
      }}
    >
      <primitive object={child.geometry} />
      <meshBasicMaterial
        vertexColors
        side={2}
        transparent
        opacity={display.transparent ? 0.5 : 1}
        clippingPlanes={
          sectionView.enabled && sectionView.clippingPlane
            ? [sectionView.clippingPlane]
            : []
        }
      />
      {resultMesh}
    </mesh>
  )
}

/**
 * Result
 * @param props Props
 * @returns Result
 */
const Result = ({ scene }: ResultProps): ReactNode => {
  // Child
  const children = useMemo(
    () =>
      scene.children as THREE.Mesh<
        THREE.BufferGeometry,
        THREE.MeshBasicMaterial
      >[],
    [scene.children]
  )

  /**
   * Render
   */
  return children.map((child) => <ResultChild key={child.uuid} child={child} />)
}

export default Result
