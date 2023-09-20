import { useCallback, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrthographicCamera, Text } from '@react-three/drei'
import { Vector3, Shape } from 'three'

import ArrowHelper from './ArrowHelper'

import { numberArraytoVector3 } from '../tools'

/**
 * Props
 */
export interface NavigationHelperProps {
  mainViewCamera?: THREE.PerspectiveCamera
  rotation?: THREE.Euler
}

export interface AxisProps {
  origin?: number[]
  direction?: number[]
  color?: string | number
  text?: string
}

export interface ShapeGeometryProps {
  width: number
  height: number
  radius: number
}

export interface FaceProps {
  mainViewCamera?: THREE.PerspectiveCamera
  origin?: number[]
  normal?: number[]
  up?: number[]
  color?: string | number
  text?: string
}

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
    <ArrowHelper
      direction={direction3}
      origin={origin3}
      length={2}
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
const Face = ({
  mainViewCamera,
  origin,
  normal,
  up,
  color,
  text,
}: FaceProps): React.JSX.Element => {
  // Ref
  const meshRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!)

  // State
  const [hover, setHover] = useState<boolean>(false)

  // Origin
  const origin3 = useMemo(
    () => numberArraytoVector3(origin ?? [0, 0, 0]),
    [origin]
  )

  // Normal
  const normal3 = useMemo(
    () => numberArraytoVector3(normal ?? [1, 0, 0]),
    [normal]
  )

  // Look at
  const lookAt = useMemo(() => {
    const lookAt = new Vector3()
    return lookAt.copy(normal3).multiplyScalar(100)
  }, [normal3])

  // Up
  const up3 = useMemo(() => numberArraytoVector3(up ?? [0, 0, 1]), [up])

  // Text position
  const textPosition = useMemo(() => {
    const textPosition = new Vector3()
    return textPosition
      .copy(origin3)
      .add(normal3.clone().normalize().multiplyScalar(0.01))
  }, [origin3, normal3])

  // Frame
  useFrame(() => {
    meshRef.current.lookAt(lookAt)
    meshRef.current.up = up3
    textRef.current.lookAt(lookAt)
    if (mainViewCamera) textRef.current.up = mainViewCamera.up
  })

  /**
   * Set hover true
   */
  const setHoverTrue = useCallback(() => setHover(true), [])

  /**
   * Set hover false
   */
  const setHoverFalse = useCallback(() => setHover(false), [])

  /**
   * On click
   * @param event Event
   */
  const onClick = useCallback(() => {
    if (!mainViewCamera) return

    // Update camera position
    const center = new Vector3(0, 0, 0) // TODO
    const distance = mainViewCamera.position.distanceTo(center)
    const interval = normal3.clone().normalize().multiplyScalar(distance)
    const newPosition = center.add(interval)

    mainViewCamera.position.copy(newPosition)
    mainViewCamera.up.copy(up3)
  }, [mainViewCamera, normal3, up3])

  /**
   * Render
   */
  return (
    <>
      <mesh
        ref={meshRef}
        position={origin3}
        onPointerOver={setHoverTrue}
        onPointerOut={setHoverFalse}
        onClick={onClick}
      >
        <ShapeGeometry />
        <meshBasicMaterial
          color={color}
          side={2}
          transparent={!hover}
          opacity={hover ? 1 : 0.75}
        />
      </mesh>
      <mesh ref={textRef} position={textPosition}>
        {text ? (
          <Text fontSize={0.3} color={'black'}>
            {text}
          </Text>
        ) : null}
      </mesh>
    </>
  )
}

/**
 * Navigation helper
 * @returns NavigationHelper
 */
const NavigationHelper = ({
  mainViewCamera,
  rotation,
}: NavigationHelperProps): React.JSX.Element => {
  // Origin
  const origin = useMemo(() => [-1, -1, -1], [])

  // Directions
  const directions = useMemo(
    () => ({
      x: [1, 0, 0],
      y: [0, 1, 0],
      z: [0, 0, 1],
    }),
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
    <>
      <OrthographicCamera
        makeDefault
        top={5}
        bottom={-5}
        left={-5}
        right={5}
        near={-5}
        far={5}
        zoom={60}
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

      <Face
        mainViewCamera={mainViewCamera}
        origin={[0.6, 0, 0]}
        normal={[1, 0, 0]}
        up={[0, 0, 1]}
        color={0xff0000}
        text='Front'
      />
      <Face
        mainViewCamera={mainViewCamera}
        origin={[-0.6, 0, 0]}
        normal={[-1, 0, 0]}
        up={[0, 0, 1]}
        color={0xff0000}
        text='Back'
      />

      <Face
        mainViewCamera={mainViewCamera}
        origin={[0, 0.6, 0]}
        normal={[0, 1, 0]}
        up={[0, 0, 1]}
        color={0x00ff00}
        text='Right'
      />
      <Face
        mainViewCamera={mainViewCamera}
        origin={[0, -0.6, 0]}
        normal={[0, -1, 0]}
        up={[0, 0, 1]}
        color={0x00ff00}
        text='Left'
      />

      <Face
        mainViewCamera={mainViewCamera}
        origin={[0, 0, 0.6]}
        normal={[0, 0, 1]}
        up={[0, 1, 0]}
        color={0x0000ff}
        text='Top'
      />
      <Face
        mainViewCamera={mainViewCamera}
        origin={[0, 0, -0.6]}
        normal={[0, 0, -1]}
        up={[0, -1, 0]}
        color={0x0000ff}
        text='Bottom'
      />
    </>
  )
}

export default NavigationHelper
