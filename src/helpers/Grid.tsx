import { Line } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { computeSceneBoundingBox } from '../tools'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import StaticText from './StaticText'

export interface GridProps {
  visible?: boolean
}

const numberOfHeightDivisions = 4
const numberOfWidthDivisions = 5
const offsetPercent = 10 / 100

const toReadableString = (num: number): string => {
  if (num === 0) return '0'
  if (Math.abs(num) <= 0.001 || Math.abs(num) >= 999) return num.toExponential()
  else return num.toFixed(2)
}

const buildXGrid = (
  center: THREE.Vector3,
  size: THREE.Vector3,
  offset: number
): React.JSX.Element[] => {
  const lines = []

  const xMin = center.x - size.x
  const xMax = center.x + size.x
  const yMin = center.y - size.y
  const yMax = center.y + size.y
  const zMin = center.z - size.z

  for (let i = 0; i < numberOfWidthDivisions; ++i) {
    const x = xMin + (i * (xMax - xMin)) / (numberOfWidthDivisions - 1)
    lines.push(
      <Line
        key={'lineX_' + i}
        type='GridX'
        points={[
          [x, yMin, zMin - offset],
          [x, yMax, zMin - offset],
        ]}
        color={'gray'}
        transparent
        opacity={0.5}
      />
    )
    const textPosition = new Vector3(x, yMax + 2 * offset, zMin - offset)
    lines.push(
      <StaticText key={'textX_' + i} position={textPosition} fontSize={offset}>
        {toReadableString(x)}
      </StaticText>
    )
  }
  for (let i = 0; i < numberOfHeightDivisions; ++i) {
    const y = yMin + (i * (yMax - yMin)) / (numberOfHeightDivisions - 1)
    lines.push(
      <Line
        key={'lineX_' + (numberOfWidthDivisions + i)}
        type='GridX'
        points={[
          [xMin, y, zMin - offset],
          [xMax, y, zMin - offset],
        ]}
        color={'gray'}
        transparent
        opacity={0.5}
      />
    )
  }

  return lines
}

const buildYGrid = (
  center: THREE.Vector3,
  size: THREE.Vector3,
  offset: number
): React.JSX.Element[] => {
  const lines = []

  const xMin = center.x - size.x
  const yMin = center.y - size.y
  const yMax = center.y + size.y
  const zMin = center.z - size.z
  const zMax = center.z + size.z

  for (let i = 0; i < numberOfWidthDivisions; ++i) {
    const z = zMin + (i * (zMax - zMin)) / (numberOfWidthDivisions - 1)
    lines.push(
      <Line
        key={'lineY_' + i}
        type='GridY'
        points={[
          [xMin - offset, yMin, z],
          [xMin - offset, yMax, z],
        ]}
        color={'gray'}
        transparent
        opacity={0.5}
      />
    )
  }
  for (let i = 0; i < numberOfHeightDivisions; ++i) {
    const y = yMin + (i * (yMax - yMin)) / (numberOfHeightDivisions - 1)
    lines.push(
      <Line
        key={'lineY_' + (numberOfWidthDivisions + i)}
        type='GridY'
        points={[
          [xMin - offset, y, zMin],
          [xMin - offset, y, zMax],
        ]}
        color={'gray'}
        transparent
        opacity={0.5}
      />
    )
    const textPosition = new Vector3(xMin, y, zMax + 3 * offset)
    lines.push(
      <StaticText key={'textY' + i} position={textPosition} fontSize={offset}>
        {toReadableString(y)}
      </StaticText>
    )
  }

  return lines
}

const buildZGrid = (
  center: THREE.Vector3,
  size: THREE.Vector3,
  offset: number
): React.JSX.Element[] => {
  const lines = []

  const xMin = center.x - size.x
  const xMax = center.x + size.x
  const yMin = center.y - size.y
  const zMin = center.z - size.z
  const zMax = center.z + size.z

  for (let i = 0; i < numberOfWidthDivisions; ++i) {
    const x = xMin + (i * (xMax - xMin)) / (numberOfWidthDivisions - 1)
    lines.push(
      <Line
        key={'lineZ_' + i}
        type='GridZ'
        points={[
          [x, yMin - offset, zMin],
          [x, yMin - offset, zMax],
        ]}
        color={'gray'}
        transparent
        opacity={0.5}
      />
    )
  }
  for (let i = 0; i < numberOfWidthDivisions; ++i) {
    const z = zMin + (i * (zMax - zMin)) / (numberOfWidthDivisions - 1)
    lines.push(
      <Line
        key={'lineZ_' + (numberOfWidthDivisions + i)}
        type='GridZ'
        points={[
          [xMin, yMin - offset, z],
          [xMax, yMin - offset, z],
        ]}
        color={'gray'}
        transparent
        opacity={0.5}
      />
    )
    const textPosition = new Vector3(xMax + 3 * offset, yMin, z)
    lines.push(
      <StaticText key={'textZ_' + i} position={textPosition} fontSize={offset}>
        {toReadableString(z)}
      </StaticText>
    )
  }

  return lines
}

const Grid = ({ visible }: GridProps) => {
  // State
  const [lines, setLines] = useState<React.JSX.Element[]>()
  // Data
  const { scene } = useThree()

  // Scene update
  useEffect(() => {
    const boundingBox = computeSceneBoundingBox(scene)
    const center = new Vector3()
    const size = new Vector3()
    boundingBox.getCenter(center)
    boundingBox.getSize(size)

    const offset = Math.max(size.x, size.y, size.y) * offsetPercent

    const xGrid = buildXGrid(center, size, offset)
    const yGrid = buildYGrid(center, size, offset)
    const zGrid = buildZGrid(center, size, offset)

    setLines([...xGrid, ...yGrid, ...zGrid])
  }, [scene])

  /**
   * Render
   */
  return (
    <mesh visible={visible ?? true} type='Grid'>
      {lines}
    </mesh>
  )
}

export default Grid
