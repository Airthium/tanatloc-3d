import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Sphere as ThreeSphere } from 'three'
import { Line, Sphere } from '@react-three/drei'

import useStore from '@store'

import computeSceneBoundingBox from '@tools/computeSceneBoundingBox'

/**
 * Build lines
 * @param boundingBox Bounding box
 * @returns Lines
 */
const buildLines = (boundingBox: THREE.Box3): ReactNode[] => {
  const xLength = boundingBox.max.x - boundingBox.min.x
  const yLength = boundingBox.max.y - boundingBox.min.y
  const zLength = boundingBox.max.z - boundingBox.min.z

  return [
    <Line
      key="x"
      points={[
        [-xLength / 2, 0, 0],
        [xLength / 2, 0, 0]
      ]}
      color={0xff0000}
    />,
    <Line
      key="y"
      points={[
        [0, -yLength / 2, 0],
        [0, yLength / 2, 0]
      ]}
      color={0xff0000}
    />,
    <Line
      key="z"
      points={[
        [0, 0, -zLength / 2],
        [0, 0, zLength / 2]
      ]}
      color={0xff0000}
    />
  ]
}

/**
 * Build sphere
 * @param boundingBox Bounding box
 * @returns Sphere
 */
const buildSphere = (boundingBox: THREE.Box3): ReactNode => {
  const boundingSphere = new ThreeSphere()
  boundingBox.getBoundingSphere(boundingSphere)
  const radius = boundingSphere.radius / 100

  return (
    <Sphere args={[radius]}>
      <meshStandardMaterial color={0xff0000} />
    </Sphere>
  )
}

/**
 * Point
 * @returns Point
 */
const Point = (): ReactNode => {
  // State
  const [lines, setLines] = useState<ReactNode[]>([])
  const [sphere, setSphere] = useState<ReactNode>(null)

  // Store
  const { selection } = useStore((s) => s.props)
  const mainView = useStore((s) => s.mainView)

  // Position
  const position: [number, number, number] = useMemo(() => {
    const point = selection?.point
    return point ? [point.x, point.y, point.z] : [0, 0, 0]
  }, [selection?.point])

  // Lines
  useEffect(() => {
    if (!mainView.scene) return

    const boundingBox = computeSceneBoundingBox(mainView.scene.children)
    const lines = buildLines(boundingBox)
    setLines(lines)

    const sphere = buildSphere(boundingBox)
    setSphere(sphere)
  }, [mainView.scene, mainView.scene?.children])

  /**
   * Render
   */
  return (
    <group type="Point" visible={!!selection?.point} position={position}>
      {lines}
      {sphere}
    </group>
  )
}

export default Point
