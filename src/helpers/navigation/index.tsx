import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { OrthographicCamera, Text } from '@react-three/drei'
import { Vector3, Shape } from 'three'

import { Context } from '../../context'

import { numberArraytoVector3 } from '../../tools'

import Arrow from '../arrow'

/**
 * Props
 */
export interface NavigationProps {
  update?: number
  resize?: number
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
  index: number
  face: IFace
  hover?: boolean
  onPointerOver: (index: number, event: ThreeEvent<PointerEvent>) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

// Base color
const color = 0xd3d3d3

// Hover color
const hoverColor = 0xfad114

// Text color
const textColor = 0x000000

// Size
const size = 10

// Font size
const fontSize = 2

// Corner
const corner = 0.25

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

/**
 * Axis
 * @param props Props
 * @returns Axis
 */
const Axis = ({
  origin,
  direction,
  color,
  text
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
const ShapeGeometry = ({
  width,
  height,
  radius
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
  width: size,
  height: size,
  radius: size * corner
}

/**
 * Face
 * @param props Props
 * @returns Face
 */
const Face = ({
  index,
  face,
  hover,
  onPointerOver,
  onPointerLeave,
  onClick
}: FaceProps): React.JSX.Element => {
  // Ref
  const ref = useRef<THREE.Group>(null!)

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
   * On pointer enter (internal)
   */
  const onInternalPointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      console.log('over')
      onPointerOver(index, event)
    },
    [index, onPointerOver]
  )

  /**
   * On pointer leave (internal)
   */
  const onInternalPointerLeave = useCallback(
    (_event: any) => {
      console.log('leave')
      onPointerLeave(index)
    },
    [index, onPointerLeave]
  )

  /**
   * Render
   */
  return (
    <group
      ref={ref}
      onPointerMove={onInternalPointerOver}
      onPointerLeave={onInternalPointerLeave}
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
 * @param props Props
 * @returns Navigation
 */
const Navigation = ({ resize }: NavigationProps): React.JSX.Element => {
  // Context
  const { mainView } = useContext(Context)

  // State
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const [hover, setHover] = useState<{ index: number; distance: number }>({
    index: -1,
    distance: Number.MAX_VALUE
  })

  // Camera position
  const cameraPosition: [number, number, number] = useMemo(
    () => [-5 * aspectRatio * size + size, 5 * size - size, 2 * size],
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
    if (!mainView.camera) return
    setAspectRatio(mainView.camera.aspect)
  }, [mainView.camera, resize])

  // Rotation
  useFrame(({ camera }) => {
    if (!mainView?.camera) return

    camera.position.set(0, 0, 0)
    camera.rotation.copy(mainView.camera.rotation)
    camera.translateX(cameraPosition[0])
    camera.translateY(cameraPosition[1])
    camera.translateZ(cameraPosition[2])
  })

  /**
   * On pointer over
   * @param index Index
   */
  const onPointerOver = useCallback(
    (index: number, event: ThreeEvent<PointerEvent>): void => {
      const distance = event.distance
      if (distance < hover.distance) setHover({ index, distance })
    },
    [hover]
  )

  /**
   * On pointer leave
   * @param index Index
   */
  const onPointerLeave = useCallback(
    (index: number): void => {
      if (index === hover.index)
        setHover({ index: -1, distance: Number.MAX_VALUE })
    },
    [hover]
  )

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    // Checks
    if (!mainView?.camera) return
    if (!mainView.controls) return

    const currentFace = faces[hover.index]
    if (!currentFace) return

    // Distance
    const target = mainView.controls.target as THREE.Vector3
    const distance = mainView.camera.position.distanceTo(target)

    // Position change
    const interval = currentFace.normal.clone().multiplyScalar(distance)

    // New position
    const newPosition = target.clone().add(interval)

    // Update
    mainView.camera.position.copy(newPosition)
    mainView.camera.up.copy(currentFace.up)
  }, [mainView?.camera, mainView.controls, hover])

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
        // zoom={zoom}
      />
      {faces.map((face, index) => (
        <Face
          key={face.text}
          index={index}
          face={face}
          hover={hover.index === index}
          onPointerOver={onPointerOver}
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
      <Axis
        origin={axisOrigin}
        direction={directions.z}
        color={0x0000ff}
        text="z"
      />
    </group>
  )
}

export default Navigation
