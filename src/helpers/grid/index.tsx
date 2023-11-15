import { Line } from '@react-three/drei'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Euler, Vector3 } from 'three'

import useStore from '@store'

import computeSceneBoundingBox from '@tools/computeSceneBoundingBox'
import toReadable from '@tools/toReadable'
import sign from '@tools/sign'

import StaticText from '../staticText'

/**
 * Props
 */
export interface GridProps {
  update: number
}

export interface AxisGridProps {
  axis: 'xy' | 'xz' | 'yz'
  center: [number, number, number]
  size: [number, number, number]
  divisions: [number, number]
  offset: Offset
}

export interface AxisLabelsProps {
  axis: 'xy' | 'xz' | 'yz'
  center: [number, number, number]
  size: [number, number, number]
  range: [number, number]
  division: number
  offset: Offset
}

export interface AxisLineProps {
  start: [number, number, number]
  stop: [number, number, number]
}

export interface Offset {
  value: number
  direction: -1 | 1
  depth?: -1 | 1
}

/**
 * Base offset
 */
const baseOffset = 0.1

/**
 * Minimum divisions number
 */
const minDivisions = 2

/**
 * Maximum divisions number
 */
const maxDivisions = 5

/**
 * Line color
 */
const lineColor = 0x888888

/**
 * Get number of divisions
 * @param size Size
 * @returns Number of divisions
 */
const getNumberOfDivisions = (
  size: [number, number, number]
): [number, number, number] => {
  const maxSize = Math.max(...size)
  const xDivisions = Math.max(
    Math.ceil((size[0] / maxSize) * maxDivisions),
    minDivisions
  )
  const yDivisions = Math.max(
    Math.ceil((size[1] / maxSize) * maxDivisions),
    minDivisions
  )
  const zDivisions = Math.max(
    Math.ceil((size[2] / maxSize) * maxDivisions),
    minDivisions
  )
  return [xDivisions, yDivisions, zDivisions]
}

/**
 * AxisLine
 * @param props Props
 * @returns AxisLine
 */
const AxisLine = ({ start, stop }: AxisLineProps): ReactNode => (
  <Line points={[start, stop]} color={lineColor} />
)

/**
 * AxisGrid
 * @param props Props
 * @returns AxisGrid
 */
const AxisGrid = ({
  axis,
  center,
  size,
  divisions,
  offset
}: AxisGridProps): ReactNode => {
  // Width
  const width = useMemo(() => {
    switch (axis) {
      case 'xy':
        return size[0]
      case 'xz':
        return size[0]
      case 'yz':
        return size[1]
    }
  }, [axis, size])

  // Height
  const height = useMemo(() => {
    switch (axis) {
      case 'xy':
        return size[1]
      case 'xz':
        return size[2]
      case 'yz':
        return size[2]
    }
  }, [axis, size])

  // Depth
  const depth = useMemo(() => {
    switch (axis) {
      case 'xy':
        return size[2]
      case 'xz':
        return size[1]
      case 'yz':
        return size[0]
    }
  }, [axis, size])

  // Rotation
  const rotation = useMemo(
    () =>
      new Euler(
        axis === 'xy' ? Math.PI / 2 : 0,
        0,
        axis === 'yz' ? -Math.PI / 2 : 0
      ),
    [axis]
  )

  // Position
  const position = useMemo(() => {
    switch (axis) {
      case 'xy':
        return new Vector3(
          center[0],
          center[1],
          center[2] + offset.direction * (depth / 2 + offset.value)
        )
      case 'xz':
        return new Vector3(
          center[0],
          center[1] + offset.direction * (depth / 2 + offset.value),
          center[2]
        )
      case 'yz':
        return new Vector3(
          center[0] + offset.direction * (depth / 2 + offset.value),
          center[1],
          center[2]
        )
    }
  }, [depth, axis, center, offset])

  // Lines
  const lines = useMemo(() => {
    const lines = []

    const origin = [-width / 2, -height / 2]

    const step0 = width / (divisions[0] - 1)
    const step1 = height / (divisions[1] - 1)

    for (let i = 0; i < divisions[0]; ++i) {
      lines.push(
        <AxisLine
          key={'line_' + axis + '_' + i}
          start={[origin[0] + i * step0, 0, origin[1]]}
          stop={[origin[0] + i * step0, 0, origin[1] + height]}
        />
      )
    }

    for (let i = 0; i < divisions[1]; ++i) {
      lines.push(
        <AxisLine
          key={'line_' + axis + '_' + (i + divisions[0])}
          start={[origin[0], 0, origin[1] + i * step1]}
          stop={[origin[0] + width, 0, origin[1] + i * step1]}
        />
      )
    }

    return lines
  }, [width, height, axis, divisions])

  /**
   * Render
   */
  return (
    <group position={position} rotation={rotation}>
      {lines}
    </group>
  )
}

/**
 * AxisLabels
 * @param props Props
 * @returns AxisLabels
 */
const AxisLabels = ({
  axis,
  center,
  size,
  range,
  division,
  offset
}: AxisLabelsProps): ReactNode => {
  // Width
  const width = useMemo(() => {
    switch (axis) {
      case 'xy':
        return size[0]
      case 'xz':
        return size[0]
      case 'yz':
        return size[1]
    }
  }, [axis, size])

  // Height
  const height = useMemo(() => {
    switch (axis) {
      case 'xy':
        return size[1]
      case 'xz':
        return size[2]
      case 'yz':
        return size[2]
    }
  }, [axis, size])

  // Depth
  const depth = useMemo(() => {
    switch (axis) {
      case 'xy':
        return size[2]
      case 'xz':
        return size[1]
      case 'yz':
        return size[0]
    }
  }, [axis, size])

  // Position
  const position = useMemo(() => {
    switch (axis) {
      case 'xy':
        return new Vector3(
          center[0],
          center[1] - offset.depth! * (height / 2 + offset.value),
          center[2] + offset.direction * (depth / 2 + offset.value)
        )
      case 'xz':
        return new Vector3(
          center[0] - offset.depth! * (width / 2 + offset.value),
          center[1] + offset.direction * (depth / 2 + offset.value),
          center[2]
        )
      case 'yz':
        return new Vector3(
          center[0] + offset.direction * (depth / 2 + offset.value),
          center[1],
          center[2] - offset.depth! * (height / 2 + offset.value)
        )
    }
  }, [width, height, depth, axis, center, offset])

  // Labels
  const labels = useMemo(() => {
    const labels = []

    const length = Math.abs(range[1] - range[0])
    const step = length / (division - 1)

    for (let i = 0; i < division; ++i) {
      const value = range[0] + (i / (division - 1)) * range[1]
      let textPosition
      switch (axis) {
        case 'xy':
          textPosition = new Vector3(-length / 2 + i * step, 0, 0)
          break
        case 'xz':
          textPosition = new Vector3(0, 0, -length / 2 + i * step)
          break
        case 'yz':
          textPosition = new Vector3(0, -length / 2 + i * step, 0)
          break
      }

      labels.push(
        <StaticText
          key={'label_' + axis + '_' + i}
          position={textPosition}
          fontSize={offset.value / 3}
        >
          {toReadable(value)}
        </StaticText>
      )
    }

    return labels
  }, [axis, range, division, offset])

  return <group position={position}>{labels}</group>
}

/**
 * Grid
 * @param props Props
 * @returns Grid
 */
const Grid = ({ update }: GridProps): ReactNode => {
  // Store
  const mainView = useStore((s) => s.mainView)
  const display = useStore((s) => s.display)
  const { dimension } = useStore((s) => s.geometry)

  // State
  const [center, setCenter] = useState<[number, number, number]>([0, 0, 0])
  const [size, setSize] = useState<[number, number, number]>([0, 0, 0])
  const [range, setRange] = useState<{
    x: [number, number]
    y: [number, number]
    z: [number, number]
  }>({ x: [0, 0], y: [0, 0], z: [0, 0] })
  const [offset, setOffset] = useState<number>(0)
  const [numberOfDivisions, setNumberOfDivisions] = useState<
    [number, number, number]
  >([minDivisions, minDivisions, minDivisions])
  const [cameraDirection, setCameraDirection] = useState<
    [number, number, number]
  >([0, 0, 0])

  // Scene update
  useEffect(() => {
    if (!mainView.scene?.children) return

    const boundingBox = computeSceneBoundingBox(mainView.scene.children)
    const center = new Vector3()
    boundingBox.getCenter(center)
    const size = [
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    ] as [number, number, number]
    const range = {
      x: [boundingBox.min.x, boundingBox.max.x] as [number, number],
      y: [boundingBox.min.y, boundingBox.max.y] as [number, number],
      z: [boundingBox.min.z, boundingBox.max.z] as [number, number]
    }
    const offset = Math.max(...size) * baseOffset
    const numberOfDivisions = getNumberOfDivisions(size)

    setCenter([center.x, center.y, center.z])
    setSize(size)
    setRange(range)
    setOffset(offset)
    setNumberOfDivisions(numberOfDivisions)
  }, [mainView.scene?.children])

  // Camera udpate
  useEffect(() => {
    if (!mainView.camera) return

    const cameraDirection = new Vector3()
    mainView.camera.getWorldDirection(cameraDirection)
    setCameraDirection([
      cameraDirection.x,
      cameraDirection.y,
      cameraDirection.z
    ])
  }, [mainView.camera, update])

  /**
   * Render
   */
  return display.grid ? (
    <group type="Grid">
      <AxisGrid
        axis="xy"
        center={center}
        size={size}
        divisions={[numberOfDivisions[0], numberOfDivisions[1]]}
        offset={{ value: offset, direction: sign(cameraDirection[2]) }}
      />
      <AxisLabels
        axis="xy"
        center={center}
        size={size}
        range={range.x}
        division={numberOfDivisions[0]}
        offset={{
          value: offset,
          direction: sign(cameraDirection[2]),
          depth: sign(cameraDirection[1])
        }}
      />
      {dimension === 3 ? (
        <>
          <AxisGrid
            axis="xz"
            center={center}
            size={size}
            divisions={[numberOfDivisions[0], numberOfDivisions[2]]}
            offset={{ value: offset, direction: sign(cameraDirection[1]) }}
          />
          <AxisLabels
            axis="xz"
            center={center}
            size={size}
            range={range.z}
            division={numberOfDivisions[2]}
            offset={{
              value: offset,
              direction: sign(cameraDirection[1]),
              depth: sign(cameraDirection[0])
            }}
          />
        </>
      ) : null}
      <AxisGrid
        axis="yz"
        center={center}
        size={size}
        divisions={[numberOfDivisions[1], numberOfDivisions[2]]}
        offset={{ value: offset, direction: sign(cameraDirection[0]) }}
      />
      <AxisLabels
        axis="yz"
        center={center}
        size={size}
        range={range.y}
        division={numberOfDivisions[1]}
        offset={{
          value: offset,
          direction: sign(cameraDirection[0]),
          depth: sign(cameraDirection[2])
        }}
      />
    </group>
  ) : null
}

export default Grid
