import * as THREE from 'three'

import useStore from '@store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import {
  Edges,
  OrthographicCamera,
  Text,
  TrackballControlsProps
} from '@react-three/drei'
import Arrow from '@helpers/arrow'
import {
  Corner,
  Face,
  Oblique,
  corners,
  cubeSize,
  faces,
  obliques
} from './def'

/**
 * Props
 */
export type Mesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>

export interface NavigationProps {
  resize?: number
}

export interface ViewCubeProps {
  visible?: boolean
  forceFront?: boolean
  camera?: THREE.PerspectiveCamera
  controls?: TrackballControlsProps
}

export interface FaceProps extends Face {}

export interface CornerProps extends Omit<Corner, 'name'> {}

export interface ObliqueProps extends Omit<Oblique, 'name'> {}

export interface AxisProps {
  direction: [number, number, number]
  origin: [number, number, number]
  color: any
  text: string
}

export interface AxesProps {
  dimension: number
}

// Text color
const textColor = 0x000000

// Font size
const fontSize = 10

// Axis delta
const delta = 10

// Zoom
const zoom = 0.4

/**
 * Set camera
 * @param camera Camera
 * @param controls Controls
 * @param lookAt Look at
 * @param up Up
 */
const setCamera = (
  camera: THREE.PerspectiveCamera,
  controls: TrackballControlsProps,
  lookAt: [number, number, number],
  up: [number, number, number]
) => {
  // Distance
  const target = controls.target as THREE.Vector3
  const distance = camera.position.distanceTo(target)

  // Position change
  const interval = new THREE.Vector3(...lookAt)
    .clone()
    .normalize()
    .multiplyScalar(distance)

  // New position
  const newPosition = target.clone().add(interval)

  // Update
  camera.position.copy(newPosition)
  camera.up.copy(new THREE.Vector3(...up))
}

/**
 * Face
 * @param props Props
 * @returns Face
 */
const DrawFace: React.FunctionComponent<FaceProps> = ({
  name,
  size,
  position,
  lookAt,
  up
}) => {
  // Ref
  const ref = useRef<THREE.Group>(null)

  // Store
  const {
    colors: { baseColor }
  } = useStore((s) => s.settings)

  // Look at
  useEffect(() => {
    ref.current?.lookAt(
      new THREE.Vector3(...lookAt.map((l) => 10 * cubeSize * l))
    )
  }, [lookAt])

  /**
   * Render
   */
  return (
    <group name="face" position={position} ref={ref}>
      <mesh userData={{ lookAt, up }}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      <Text position={[0, 0, 1]} color={textColor} fontSize={fontSize}>
        {name.toUpperCase()}
      </Text>
    </group>
  )
}

/**
 * Faces
 * @returns Faces
 */
const Faces = () => (
  <group>
    {faces.map((face) => (
      <DrawFace key={face.name} {...face} />
    ))}
  </group>
)

/**
 * Corner
 * @param props Props
 * @returns Corner
 */
const DrawCorner: React.FunctionComponent<CornerProps> = ({
  size,
  position,
  lookAt,
  up
}) => {
  // Store
  const {
    colors: { baseColor }
  } = useStore((s) => s.settings)

  /**
   * Render
   */
  return (
    <group name="corner" position={position}>
      <mesh userData={{ lookAt, up }}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color={baseColor} />
        <Edges lineWidth={1} color="gray" />
      </mesh>
    </group>
  )
}

/**
 * Corners
 * @returns Corners
 */
const Corners = () => (
  <group>
    {corners.map((corner) => (
      <DrawCorner key={corner.name} {...corner} />
    ))}
  </group>
)

/**
 * Oblique
 * @param props Props
 * @returns Oblique
 */
const DrawOblique: React.FunctionComponent<ObliqueProps> = ({
  size,
  position,
  lookAt,
  up
}) => {
  // Store
  const {
    colors: { baseColor }
  } = useStore((s) => s.settings)

  /**
   * Render
   */
  return (
    <group name="corner" position={position}>
      <mesh userData={{ lookAt, up }}>
        <boxGeometry args={[...size]} />
        <meshBasicMaterial color={baseColor} />
        <Edges lineWidth={1} color="gray" />
      </mesh>
    </group>
  )
}

/**
 * Obliques
 * @returns Obliques
 */
const Obliques = () => (
  <group>
    {obliques.map((oblique) => (
      <DrawOblique key={oblique.name} {...oblique} />
    ))}
  </group>
)

/**
 * View cube
 * @param props Props
 * @returns ViewCube
 */
const ViewCube: React.FunctionComponent<ViewCubeProps> = ({
  visible,
  forceFront,
  camera,
  controls
}) => {
  // Ref
  const distance = useRef<number>()
  const current = useRef<Mesh>()

  // Store
  const {
    colors: { baseColor, hoverColor }
  } = useStore((s) => s.settings)

  /**
   * On pointer enter
   * @param event Event
   */
  const onPointerEnter = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const mesh = event.object as Mesh
      const eventDistance = event.distance
      if (
        mesh.type === 'Mesh' &&
        (distance.current ? eventDistance < distance.current : true)
      ) {
        mesh.material.color = new THREE.Color(hoverColor)
        distance.current = eventDistance
        current.current = mesh
      }
    },
    [hoverColor]
  )

  /**
   * On pointer leave
   * @param event Event
   */
  const onPointerLeave = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const mesh = event.object as Mesh
      if (mesh.type === 'Mesh') {
        mesh.material.color = new THREE.Color(baseColor)
        distance.current = Infinity
        current.current = undefined
      }
    },
    [baseColor]
  )

  /**
   * On pointer down
   * @param event Event
   */
  const onPointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const lookAt = current.current?.userData.lookAt
      const up = current.current?.userData.up

      // Checks
      if (!camera || !controls || !lookAt || !up) return

      // Set camera
      setCamera(camera, controls, lookAt, up)

      // Leave
      onPointerLeave(event)
    },
    [baseColor, camera, controls, onPointerLeave]
  )

  // Force front
  useEffect(() => {
    if (forceFront)
      if (camera && controls) setCamera(camera, controls, [0, 0, 1], [0, 1, 0])
  }, [forceFront, camera, controls])

  /**
   * Render
   */
  return (
    <group
      visible={visible}
      onPointerEnter={onPointerEnter}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      <Faces />
      <Corners />
      <Obliques />
    </group>
  )
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
    () => new THREE.Vector3(direction[0], direction[1], direction[2]),
    [direction]
  )

  // Origin
  const origin3 = useMemo(
    () => new THREE.Vector3(origin[0], origin[1], origin[2]),
    [origin]
  )

  /**
   * Render
   */
  return (
    <Arrow
      direction={direction3}
      origin={origin3}
      length={1.1 * cubeSize}
      color={color}
      text={text}
    />
  )
}

/**
 * Axes
 * @param props Props
 * @returns Axes
 */
const Axes: React.FunctionComponent<AxesProps> = ({ dimension }) => {
  // Offset
  const offset = useMemo(() => (cubeSize + delta) / 2, [])

  // Origin
  const origin: [number, number, number] = useMemo(
    () => [-offset, -offset, -offset],
    []
  )

  // Directions
  const directions: {
    x: [number, number, number]
    y: [number, number, number]
    z: [number, number, number]
  } = useMemo(() => ({ x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }), [])

  /**
   * Render
   */
  return (
    <group>
      <Axis
        origin={origin}
        direction={directions.x}
        color={0xff0000}
        text="x"
      />
      <Axis
        origin={origin}
        direction={directions.y}
        color={0x00ff00}
        text="y"
      />
      {dimension === 3 ? (
        <Axis
          origin={origin}
          direction={directions.z}
          color={0x0000ff}
          text="z"
        />
      ) : null}
    </group>
  )
}

/**
 * Navigation
 * @param props props
 * @returns Navigation
 */
const Navigation: React.FunctionComponent<NavigationProps> = ({ resize }) => {
  // Ref
  const currentDimension = useRef<number>(3)

  // Store
  const { camera, controls, scene } = useStore((s) => s.mainView)
  const { dimension } = useStore((s) => s.geometry)

  // State
  const [cubeVisible, setCubeVisible] = useState<boolean>(true)
  const [forceFront, setForceFront] = useState<boolean>(false)
  const [aspectRatio, setAspectRatio] = useState<number>(1)

  // Camera position
  const cameraPosition: [number, number, number] = useMemo(
    () => [
      -4.9 * aspectRatio * cubeSize + cubeSize,
      4.9 * cubeSize - cubeSize,
      2 * cubeSize
    ],
    [aspectRatio]
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

  // Dimension
  useEffect(() => {
    if (dimension === currentDimension.current) return
    currentDimension.current = dimension
    if (dimension < 3) {
      setCubeVisible(false)
      setForceFront(true)
    } else {
      setCubeVisible(true)
      setForceFront(false)
    }
  }, [scene?.children, scene?.children.length, dimension])

  /**
   * Render
   */
  return (
    <group type="Navigation">
      <OrthographicCamera
        makeDefault
        left={-5 * aspectRatio * cubeSize}
        right={5 * aspectRatio * cubeSize}
        top={5 * cubeSize}
        bottom={-5 * cubeSize}
        near={(-5 / zoom) * cubeSize}
        far={(5 / zoom) * cubeSize}
        position={cameraPosition}
      />
      <ViewCube
        visible={cubeVisible}
        forceFront={forceFront}
        camera={camera}
        controls={controls}
      />
      <Axes dimension={dimension} />
    </group>
  )
}

export default Navigation
