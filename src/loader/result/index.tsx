import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  Float32BufferAttribute,
  LineBasicMaterial,
  WireframeGeometry
} from 'three'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Lut } from 'three/examples/jsm/math/Lut.js'

import useStore from '@store'

/**
 * Props
 */
export interface ResultProps {
  scene: GLTF['scene']
}

/**
 * Result
 * @param props Props
 * @returns Result
 */
const Result = ({ scene }: ResultProps): ReactNode => {
  // State
  const [resultMesh, setResultMesh] = useState<ReactNode>()

  // Store
  const display = useStore((s) => s.display)
  const sectionView = useStore((s) => s.sectionView)
  const result = useStore((s) => s.result)
  const lut = useStore((s) => s.lut)

  // Child
  const child = useMemo(
    () =>
      scene.children[0] as THREE.Mesh<
        THREE.BufferGeometry,
        THREE.MeshBasicMaterial
      >,
    [scene.children]
  )

  // Vertex color
  useEffect(() => {
    const colorAttribute = child.geometry.getAttribute('color')
    if (colorAttribute) return

    const data = child.geometry.getAttribute('data')
    const array = data.array as unknown as number[]
    let min = array.reduce((a, b) => Math.min(a, b), Infinity)
    let max = array.reduce((a, b) => Math.max(a, b), -Infinity)

    if (min === max) {
      if (min < 1e-12) {
        min = min - 1
        max = max + 1
      } else {
        min = min - 0.1 * max
        max = max + 0.1 * max
      }
    }

    useStore.setState({
      lut: {
        ...lut,
        min,
        max
      }
    })

    const lookUpTable = new Lut(lut.colormap)
    lookUpTable.setMin(lut.customMin ?? min)
    lookUpTable.setMax(lut.customMax ?? max)

    const vertexColors = new Float32Array(data.count * 3)
    for (let i = 0; i < data.count; ++i) {
      const vertexColor = lookUpTable.getColor(data.array[i])

      vertexColors[3 * i + 0] = vertexColor.r
      vertexColors[3 * i + 1] = vertexColor.g
      vertexColors[3 * i + 2] = vertexColor.b
    }
    child.geometry.setAttribute(
      'color',
      new Float32BufferAttribute(vertexColors, 3)
    )
  }, [child, lut])

  // Result mesh
  useEffect(() => {
    if (result.meshVisible) {
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
      setResultMesh(mesh)
    } else {
      setResultMesh(undefined)
    }
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
      userData={child.userData}
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

export default Result
