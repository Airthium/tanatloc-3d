import * as THREE from 'three'

import useStore from '@store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import {
  OrthographicCamera,
  Text,
  TrackballControlsProps
} from '@react-three/drei'
import Arrow from '@helpers/arrow'

/**
 * Props
 */
export type Mesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>

export interface NavigationProps {
  resize?: number
}

export interface ViewCubeProps {
  camera?: THREE.PerspectiveCamera
  controls?: TrackballControlsProps
}

export interface FaceProps {
  name: string
  size: number
  position: [number, number, number]
  lookAt: [number, number, number]
}

export interface CornerProps {
  size: number
  position: [number, number, number]
  lookAt: [number, number, number]
}

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
const fontSize = 12

// Cube size
const cubeSize = 60

// Corner size
const cornerSize = 10

// Axis delta
const delta = 10

// Zoom
const zoom = 0.4

// Faces
export interface Face {
  name: string
  size: number
  position: [number, number, number]
  lookAt: [number, number, number]
}

const faceOffset = cubeSize / 2
const faces: Face[] = [
  {
    name: 'front',
    size: cubeSize,
    position: [0, 0, faceOffset],
    lookAt: [0, 0, 1]
  },
  {
    name: 'right',
    size: cubeSize,
    position: [faceOffset, 0, 0],
    lookAt: [1, 0, 0]
  },
  {
    name: 'back',
    size: cubeSize,
    position: [0, 0, -faceOffset],
    lookAt: [0, 0, -1]
  },
  {
    name: 'left',
    size: cubeSize,
    position: [-faceOffset, 0, 0],
    lookAt: [-1, 0, 0]
  },
  {
    name: 'top',
    size: cubeSize,
    position: [0, faceOffset, 0],
    lookAt: [0, 1, 0]
  },
  {
    name: 'bottom',
    size: cubeSize,
    position: [0, -faceOffset, 0],
    lookAt: [0, -1, 0]
  }
]

// Corners
export interface Corner {
  name: string
  size: number
  position: [number, number, number]
  lookAt: [number, number, number]
}

const cornerOffset = cubeSize / 2 - (4 * cornerSize) / 10
const corners: Corner[] = [
  {
    name: 'topFrontRight',
    size: cornerSize,
    position: [cornerOffset, cornerOffset, cornerOffset],
    lookAt: [1, 1, 1]
  },
  {
    name: 'topBackRight',
    size: cornerSize,
    position: [cornerOffset, cornerOffset, -cornerOffset],
    lookAt: [1, 1, -1]
  },
  {
    name: 'topBackLeft',
    size: cornerSize,
    position: [-cornerOffset, cornerOffset, -cornerOffset],
    lookAt: [-1, 1, -1]
  },
  {
    name: 'topFrontLeft',
    size: cornerSize,
    position: [-cornerOffset, cornerOffset, cornerOffset],
    lookAt: [-1, 1, 1]
  },
  {
    name: 'bottomFrontRight',
    size: cornerSize,
    position: [cornerOffset, -cornerOffset, cornerOffset],
    lookAt: [1, -1, 1]
  },
  {
    name: 'bottomBackRight',
    size: cornerSize,
    position: [cornerOffset, -cornerOffset, -cornerOffset],
    lookAt: [1, -1, -1]
  },
  {
    name: 'bottomBackLeft',
    size: cornerSize,
    position: [-cornerOffset, -cornerOffset, -cornerOffset],
    lookAt: [-1, -1, -1]
  },
  {
    name: 'bottomFrontLeft',
    size: cornerSize,
    position: [-cornerOffset, -cornerOffset, cornerOffset],
    lookAt: [-1, -1, 1]
  }
]

/**
 * Face
 * @param props Props
 * @returns Face
 */
const Face: React.FunctionComponent<FaceProps> = ({
  name,
  size,
  position,
  lookAt
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
      <mesh userData={{ lookAt: lookAt }}>
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
const Faces = () => {
  /**
   * Render
   */
  return (
    <group>
      {faces.map((face) => (
        <Face key={face.name} {...face} />
      ))}
    </group>
  )
}

/**
 * Corner
 * @param props Props
 * @returns Corner
 */
const Corner: React.FunctionComponent<CornerProps> = ({
  size,
  position,
  lookAt
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
      <mesh userData={{ lookAt: lookAt }}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
    </group>
  )
}

/**
 * Corners
 * @returns Corners
 */
const Corners = () => {
  /**
   * Render
   */
  return (
    <group>
      {corners.map((corner) => (
        <Corner key={corner.name} {...corner} />
      ))}
    </group>
  )
}

/**
 * View cube
 * @returns ViewCube
 */
const ViewCube: React.FunctionComponent<ViewCubeProps> = ({
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
   * On pointer down
   */
  const onPointerDown = useCallback(() => {
    const lookAt = current.current?.userData.lookAt

    // Checks
    if (!camera || !controls || !lookAt) return

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
  }, [baseColor, camera, controls])

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
   * Render
   */
  return (
    <group
      onPointerEnter={onPointerEnter}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      <Faces />
      <Corners />
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
      length={cubeSize}
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
    // if (dimension < 3) onClick(0)
    //TODO
  }, [scene?.children, scene?.children.length, dimension])

  /**
   * Render
   */
  return (
    <group type="Navigaton">
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
      <ViewCube camera={camera} controls={controls} />
      <Axes dimension={dimension} />
    </group>
  )
}

export default Navigation
