import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrthographicCamera, Text } from '@react-three/drei'
import { Vector3, Shape } from 'three'

import Arrow from './Arrow'

import { numberArraytoVector3 } from '../tools'

/**
 * Props
 */
export interface NavigationProps {
  mainViewCamera?: THREE.PerspectiveCamera
  rotation?: THREE.Euler
}

export interface AxisProps {
  origin?: number[]
  direction?: number[]
  color?: string | number
  text?: string
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
  face: IFace
  mainViewCamera?: THREE.PerspectiveCamera
}

// Base color
const color = 0xd3d3d3

// Hover color
const hoverColor = 0xfad114

// Text color
const textColor = 0x000000

// Size
const size = 100

// Font size
const fontSize = 20

// Corner
const corner = 0.25

// Faces
const faces: IFace[] = [
  { text: 'FRONT', normal: new Vector3(0, 0, 1), up: new Vector3(0, 1, 0) },
  { text: 'BACK', normal: new Vector3(0, 0, -1), up: new Vector3(0, 1, 0) },
  { text: 'RIGHT', normal: new Vector3(1, 0, 0), up: new Vector3(0, 1, 0) },
  { text: 'LEFT', normal: new Vector3(-1, 0, 0), up: new Vector3(0, 1, 0) },
  { text: 'UP', normal: new Vector3(0, 1, 0), up: new Vector3(0, 0, -1) },
  { text: 'DOWN', normal: new Vector3(0, -1, 0), up: new Vector3(0, 0, 1) },
]

// Variables
const faceSize = size * (1 - corner)
const faceRadius = size * corner

/**
 * Axis
 * @param props Props
 * @returns Axis
 */
const Axis = ({
  origin,
  direction,
  color,
  text,
}: AxisProps): React.JSX.Element => {
  // Direction
  const direction3 = useMemo(
    () => numberArraytoVector3(direction ?? [0, 0, 1]),
    [direction]
  )

  // Origin
  const origin3 = useMemo(
    () => numberArraytoVector3(origin ?? [0, 0, 0]),
    [origin]
  )

  /**
   * Render
   */
  return (
    <Arrow
      direction={direction3}
      origin={origin3}
      length={100}
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
const ShapeGeometry = ({
  width,
  height,
  radius,
}: ShapeGeometryProps): React.JSX.Element => {
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
// Default props
ShapeGeometry.defaultProps = {
  width: 1,
  height: 1,
  radius: 0.2,
}

/**
 * Face
 * @param props Props
 * @returns Face
 */
const Face = ({ face, mainViewCamera }: FaceProps): React.JSX.Element => {
  // Ref
  const ref = useRef<THREE.Group>(null!)

  // State
  const [hover, setHover] = useState<boolean>(false)

  // Shape
  const shape = useMemo(
    () => (
      <ShapeGeometry width={faceSize} height={faceSize} radius={faceRadius} />
    ),
    []
  )

  // Initialize
  useLayoutEffect(() => {
    ref.current.lookAt(face.normal)
    ref.current.translateZ(size / 2)
    ref.current.up = face.up
  }, [face])

  /**
   * Set hover true
   * @returns
   */
  const setHoverTrue = useCallback(() => setHover(true), [])

  /**
   * Set hover false
   * @returns
   */
  const setHoverFalse = useCallback(() => setHover(false), [])

  /**
   * On click
   */
  const onClick = useCallback(() => {
    if (!mainViewCamera) return

    const center = new Vector3(0, 0, 0) //TODO

    const distance = mainViewCamera.position.distanceTo(center)

    const interval = face.normal.clone().multiplyScalar(distance)

    const newPosition = center.add(interval)

    mainViewCamera.position.copy(newPosition)
    mainViewCamera.up = face.up
  }, [face, mainViewCamera])

  /**
   * Render
   */
  return (
    <group
      ref={ref}
      onPointerEnter={setHoverTrue}
      onPointerLeave={setHoverFalse}
      onClick={onClick}
    >
      <mesh>
        {shape}
        <meshBasicMaterial
          color={hover ? hoverColor : color}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        {shape}
        <meshBasicMaterial
          color={hover ? hoverColor : color}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[faceSize / 2, 10, 10, 0, Math.PI, 0]} />
        <meshBasicMaterial
          color={hover ? hoverColor : color}
          transparent
          opacity={0.2}
        />
      </mesh>
      <Text position={[0, 0, 1]} color={textColor} fontSize={fontSize}>
        {face.text}
      </Text>
    </group>
  )
}

/**
 * Navigation
 * @returns Navigation
 */
const Navigation = ({
  mainViewCamera,
  rotation,
}: NavigationProps): React.JSX.Element => {
  // Origin
  const origin = useMemo(() => [-size / 2, -size / 2, -size / 2], [])

  // Directions
  const directions = useMemo(
    () => ({ x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }),
    []
  )

  // Frame
  useFrame(({ camera }) => {
    if (rotation) camera.rotation.copy(rotation)
  })

  /**
   * Render
   */
  return (
    <mesh type='Navigation'>
      {faces.map((face) => (
        <Face key={face.text} face={face} mainViewCamera={mainViewCamera} />
      ))}
      <OrthographicCamera
        makeDefault
        left={-size}
        right={size}
        top={size}
        bottom={-size}
        near={-size}
        far={size}
      />
      <Axis
        origin={origin}
        direction={directions.x}
        color={0xff0000}
        text='x'
      />
      <Axis
        origin={origin}
        direction={directions.y}
        color={0x00ff00}
        text='y'
      />
      <Axis
        origin={origin}
        direction={directions.z}
        color={0x0000ff}
        text='z'
      />
    </mesh>
  )
}

export default Navigation
