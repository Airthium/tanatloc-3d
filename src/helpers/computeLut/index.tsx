import { useEffect } from 'react'
import { Float32BufferAttribute } from 'three'

import { Lut } from 'three/examples/jsm/math/Lut.js'

import useStore, { Store } from '@store'

/**
 * Get min / max
 * @param results Results
 * @returns { min, max }
 */
const getMinMax = (
  results: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
): { min: number; max: number } => {
  let min = Infinity
  let max = -Infinity
  for (const result of results) {
    for (const child of result.children) {
      const localMin = child.userData.lut?.min
      const localMax = child.userData.lut?.max

      if (localMin === undefined || localMax === undefined) continue

      min = Math.min(min, localMin)
      max = Math.max(max, localMax)
    }
  }

  return { min, max }
}

/**
 * Set vertex color
 * @param child Child
 * @param lut LUT
 * @param min Min
 * @param max Max
 */
const setVertexColor = (
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
  lut: Store['lut'],
  min: number,
  max: number
): void => {
  const data = child.userData.data as
    | {
        count: number
        array: number[]
      }
    | undefined
  if (!data) return

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
  child.material.needsUpdate = true
}

/**
 * Compute lut
 * @returns ComputeLut
 */
const ComputeLut: React.FunctionComponent = () => {
  // Store
  const { scene } = useStore((s) => s.mainView)
  const lut = useStore((s) => s.lut)

  // Colors
  useEffect(() => {
    if (!scene?.children.length) return

    const parts = scene.children.filter((child) => child.type === 'Part')
    const results = parts.filter(
      (part) => part.userData.type === 'result'
    ) as (Omit<
      THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
      'children'
    > & {
      children: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
    })[]

    // Get min / max
    const { min, max } = getMinMax(results)

    // Avoid infinite loop
    if (lut.min !== min || lut.max !== max) {
      // Update lut
      useStore.setState({
        lut: {
          ...lut,
          min,
          max
        }
      })
    }

    // Set vertex color
    for (const result of results) {
      for (const child of result.children) setVertexColor(child, lut, min, max)
    }
  }, [scene?.children, scene?.children.length, JSON.stringify(lut)])

  return null
}

export default ComputeLut
