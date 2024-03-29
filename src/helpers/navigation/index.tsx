import * as THREE from 'three'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { OrthographicCamera, Text } from '@react-three/drei'
import { Vector3, Shape } from 'three'

import useStore from '@store'

import Arrow from '../arrow'

/**
 * Props
 */
export interface NavigationProps {
  resize?: number
}

export interface AxisProps {
  origin: number[]
  direction: number[]
  color: string | number
  text: string
}

export interface IFace {
  text: string
  normal: THREE.Vector3
  up: THREE.Vector3
}

export interface ShapeGeometryProps {
  width: number
  height: number
  radius: number
}

export interface FaceProps {
  index: number
  face: IFace
  hover?: boolean
  onPointerMove: (event: ThreeEvent<PointerEvent>, index: number) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

// Text color
const textColor = 0x000000

// Size
const size = 10

// Font size
const fontSize = 2

// Corner
const corner = 0.15

// Zoom
const zoom = 0.4

// Faces
const faces: IFace[] = [
  { text: 'FRONT', normal: new Vector3(0, 0, 1), up: new Vector3(0, 1, 0) },
  { text: 'BACK', normal: new Vector3(0, 0, -1), up: new Vector3(0, 1, 0) },
  { text: 'RIGHT', normal: new Vector3(1, 0, 0), up: new Vector3(0, 1, 0) },
  { text: 'LEFT', normal: new Vector3(-1, 0, 0), up: new Vector3(0, 1, 0) },
  { text: 'UP', normal: new Vector3(0, 1, 0), up: new Vector3(0, 0, -1) },
  { text: 'DOWN', normal: new Vector3(0, -1, 0), up: new Vector3(0, 0, 1) }
]

// Variables
const faceSize = size * (1 - corner)
const faceRadius = size * corner

// Initial hover
const initHover = {
  index: -1,
  distance: Infinity
}

/**
 * Axis
 * @param props Props
 * @returns Axis
 */
const Axis: React.FunctionComponent<AxisProps> = ({
  origin,
  direction,
  color,
  text
}) => {
  // Direction
  const direction3 = useMemo(
    () => new Vector3(direction[0], direction[1], direction[2]),
    [direction]
  )

  // Origin
  const origin3 = useMemo(
    () => new Vector3(origin[0], origin[1], origin[2]),
    [origin]
  )

  /**
   * Render
   */
  return (
    <Arrow
      direction={direction3}
      origin={origin3}
      length={size}
      color={color}
      text={text}
    />
  )
}

/**
 * Rounded shape
 * @param props Props
 * @returns ShapeGeometry
 */
const ShapeGeometry: React.FunctionComponent<ShapeGeometryProps> = ({
  width,
  height,
  radius
}) => {
  // X
  const x = useMemo(() => -width / 2, [width])
  // Y
  const y = useMemo(() => -height / 2, [height])

  // Shape
  const shape = useMemo(() => {
    const shape = new Shape()

    shape.moveTo(x, y + radius)
    shape.lineTo(x, y + height - radius)
    shape.quadraticCurveTo(x, y + height, x + radius, y + height)
    shape.lineTo(x + width - radius, y + height)
    shape.quadraticCurveTo(
      x + width,
      y + height,
      x + width,
      y + height - radius
    )
    shape.lineTo(x + width, y + radius)
    shape.quadraticCurveTo(x + width, y, x + width - radius, y)
    shape.lineTo(x + radius, y)
    shape.quadraticCurveTo(x, y, x, y + radius)

    return shape
  }, [x, y, height, width, radius])

  /**
   * Render
   */
  return <shapeGeometry args={[shape]} />
}

/**
 * Face
 * @param props Props
 * @returns Face
 */
const Face: React.FunctionComponent<FaceProps> = ({
  index,
  face,
  hover,
  onPointerMove,
  onPointerLeave,
  onClick
}) => {
  // Ref
  const ref = useRef<THREE.Group>(null!)

  // Store
  const { dimension } = useStore((s) => s.geometry)
  const {
    colors: { baseColor, hoverColor }
  } = useStore((s) => s.settings)

  // Shape
  const shape = useMemo(
    () => (
      <ShapeGeometry width={faceSize} height={faceSize} radius={faceRadius} />
    ),
    []
  )

  // Initialize
  useEffect(() => {
    ref.current.lookAt(face.normal)
    ref.current.translateZ(size / 2)
    ref.current.up.copy(face.up)
  }, [face])

  /**
   * On pointer move (internal)
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      onPointerMove(event, index)
    },
    [index, onPointerMove]
  )

  /**
   * On pointer leave (internal)
   */
  const onInternalPointerLeave = useCallback(() => {
    onPointerLeave(index)
  }, [index, onPointerLeave])

  /**
   * On click (internal)
   * @description Just ensure onClick has no arguments
   */
  const onInternalClick = useCallback(() => onClick(), [onClick])

  /**
   * Render
   */
  return (
    <group
      ref={ref}
      type={'Navigation_' + face.text}
      onPointerMove={onInternalPointerMove}
      onPointerLeave={onInternalPointerLeave}
      onClick={onInternalClick}
    >
      <mesh>
        {shape}
        <meshBasicMaterial
          color={hover ? hoverColor : baseColor}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        {shape}
        <meshBasicMaterial
          color={hover ? hoverColor : baseColor}
          transparent
          opacity={0.75}
        />
      </mesh>
      {dimension === 3 ? (
        <mesh>
          <sphereGeometry args={[faceSize / 2, 10, 10, 0, Math.PI, 0]} />
          <meshBasicMaterial
            color={hover ? hoverColor : baseColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      ) : null}
      <Text position={[0, 0, 1]} color={textColor} fontSize={fontSize}>
        {face.text}
      </Text>
    </group>
  )
}

/**
 * Navigation
 * @param props Props
 * @returns Navigation
 */
const Navigation: React.FunctionComponent<NavigationProps> = ({ resize }) => {
  // Ref
  const currentDimension = useRef<number>(3)

  // Store
  const { camera, controls, scene } = useStore((s) => s.mainView)
  const { dimension } = useStore((s) => s.geometry)

  // State
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const [hover, setHover] = useState<{ index: number; distance: number }>(
    initHover
  )

  // Camera position
  const cameraPosition: [number, number, number] = useMemo(
    () => [-4.9 * aspectRatio * size + size, 4.9 * size - size, 2 * size],
    [aspectRatio]
  )

  // Axis origin
  const axisOrigin = useMemo(() => [-size / 2, -size / 2, -size / 2], [])

  // Directions
  const directions = useMemo(
    () => ({ x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }),
    []
  )

  // Aspect ratio (main camera)
  useEffect(() => {
    if (!camera) return
    setAspectRatio(camera.aspect)
  }, [camera, resize])

  // Rotation
  useFrame(({ camera: frameCamera }) => {
    if (!camera) return

    frameCamera.position.set(0, 0, 0)
    frameCamera.rotation.copy(camera.rotation)
    frameCamera.translateX(cameraPosition[0])
    frameCamera.translateY(cameraPosition[1])
    frameCamera.translateZ(cameraPosition[2])
  })

  /**
   * On pointer move
   * @param event Event
   * @param index Index
   */
  const onPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>, index: number): void => {
      const distance = event.distance
      if (distance < hover.distance) setHover({ index, distance })
    },
    [hover.distance]
  )

  /**
   * On pointer leave
   * @param index Index
   */
  const onPointerLeave = useCallback(
    (index: number): void => {
      if (index === hover.index) setHover(initHover)
    },
    [hover.index]
  )

  /**
   * On click
   * @param force Force face index
   */
  const onClick = useCallback(
    (force?: number): void => {
      // Checks
      if (!camera || !controls) return

      const currentFace = faces[force ?? hover.index]
      if (!currentFace) return

      // Distance
      const target = controls.target as THREE.Vector3
      const distance = camera.position.distanceTo(target)

      // Position change
      const interval = currentFace.normal.clone().multiplyScalar(distance)

      // New position
      const newPosition = target.clone().add(interval)

      // Update
      camera.position.copy(newPosition)
      camera.up.copy(currentFace.up)
    },
    [camera, controls, hover.index]
  )

  // Dimension
  useEffect(() => {
    if (dimension === currentDimension.current) return
    currentDimension.current = dimension
    if (dimension < 3) onClick(0)
  }, [scene?.children, scene?.children.length, dimension, onClick])

  /**
   * Render
   */
  return (
    <group type="Navigation">
      <OrthographicCamera
        makeDefault
        left={-5 * aspectRatio * size}
        right={5 * aspectRatio * size}
        top={5 * size}
        bottom={-5 * size}
        near={(-5 / zoom) * size}
        far={(5 / zoom) * size}
        position={cameraPosition}
      />
      {faces.map((face, index) => (
        <Face
          key={face.text}
          index={index}
          face={face}
          hover={hover.index === index}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
        />
      ))}
      <Axis
        origin={axisOrigin}
        direction={directions.x}
        color={0xff0000}
        text="x"
      />
      <Axis
        origin={axisOrigin}
        direction={directions.y}
        color={0x00ff00}
        text="y"
      />
      {dimension === 3 ? (
        <Axis
          origin={axisOrigin}
          direction={directions.z}
          color={0x0000ff}
          text="z"
        />
      ) : null}
    </group>
  )
}

export default Navigation
