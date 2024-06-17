import * as THREE from 'three'

import useStore from '@store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { OrthographicCamera, RoundedBox, Text } from '@react-three/drei'
import Arrow from '@helpers/arrow'

export type Mesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>

export interface NavigationProps {
  resize?: number
}

export interface FaceProps {
  size: number
  position: [number, number, number]
  axis: [number, number, number]
  angle: number
  name: string
}

export interface CornerProps {
  radius: number
  position: [number, number, number]
}

export interface ObliqueProps {
  width: number
  height: number
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

// Cube radius
const cubeRadius = 10

// Delta
const delta = 20

// Zoom
const zoom = 0.4

export interface Face {
  name: string
  size: number
  position: [number, number, number]
  axis: [number, number, number]
  angle: number
}

const faceOffset = (cubeSize + delta) / 2
const faces: Face[] = [
  {
    name: 'front',
    size: cubeSize,
    position: [0, 0, faceOffset],
    axis: [0, 1, 0],
    angle: 0
  },
  {
    name: 'right',
    size: cubeSize,
    position: [faceOffset, 0, 0],
    axis: [0, 1, 0],
    angle: 90
  },
  {
    name: 'back',
    size: cubeSize,
    position: [0, 0, -faceOffset],
    axis: [0, 1, 0],
    angle: 180
  },
  {
    name: 'left',
    size: cubeSize,
    position: [-faceOffset, 0, 0],
    axis: [0, 1, 0],
    angle: 270
  },
  {
    name: 'top',
    size: cubeSize,
    position: [0, faceOffset, 0],
    axis: [1, 0, 0],
    angle: -90
  },
  {
    name: 'bottom',
    size: cubeSize,
    position: [0, -faceOffset, 0],
    axis: [1, 0, 0],
    angle: 90
  }
]

export interface Corner {
  name: string
  radius: number
  position: [number, number, number]
}

const cornerOffset = cubeSize / 2
const cornerRadius = delta / 2
const corners: Corner[] = [
  {
    name: 'topFrontRight',
    radius: cornerRadius,
    position: [cornerOffset, cornerOffset, cornerOffset]
  },
  {
    name: 'topBackRight',
    radius: cornerRadius,
    position: [cornerOffset, cornerOffset, -cornerOffset]
  },
  {
    name: 'topBackLeft',
    radius: cornerRadius,
    position: [-cornerOffset, cornerOffset, -cornerOffset]
  },
  {
    name: 'topFrontLeft',
    radius: cornerRadius,
    position: [-cornerOffset, cornerOffset, cornerOffset]
  },
  {
    name: 'bottomFrontRight',
    radius: cornerRadius,
    position: [cornerOffset, -cornerOffset, cornerOffset]
  },
  {
    name: 'bottomBackRight',
    radius: cornerRadius,
    position: [cornerOffset, -cornerOffset, -cornerOffset]
  },
  {
    name: 'bottomBackLeft',
    radius: cornerRadius,
    position: [-cornerOffset, -cornerOffset, -cornerOffset]
  },
  {
    name: 'bottomFrontLeft',
    radius: cornerRadius,
    position: [-cornerOffset, -cornerOffset, cornerOffset]
  }
]

export interface Oblique {
  name: string
  width: number
  height: number
  position: [number, number, number]
  lookAt: [number, number, number]
}
const obliqueOffset = cubeSize / 2
const obliqueWidth = cubeSize
const obliqueHeight = Math.sqrt(2) * delta
const obliques: Oblique[] = [
  {
    name: 'topFront',
    width: obliqueWidth,
    height: obliqueHeight,
    position: [0, obliqueOffset, obliqueOffset],
    lookAt: [0, 1, 1]
  },
  {
    name: 'topRight',
    width: obliqueWidth,
    height: obliqueHeight,
    position: [obliqueOffset, obliqueOffset, 0],
    lookAt: [1, 1, 0]
  },
  {
    name: 'topBack',
    width: obliqueWidth,
    height: obliqueHeight,
    position: [0, obliqueOffset, 0],
    lookAt: [0, 1, -1]
  },
  {
    name: 'topLeft',
    width: obliqueWidth,
    height: obliqueHeight,
    position: [0, obliqueOffset, 0],
    lookAt: [-1, 1, 0]
  }
  //   { name: 'backFront', width: cubeSize, height: cubeSize, axis: [0, -1, 1] },
  //   { name: 'backRight', width: cubeSize, height: cubeSize, axis: [1, -1, 0] },
  //   { name: 'backBottom', width: cubeSize, height: cubeSize, axis: [0, -1, -1] },
  //   { name: 'backLeft', width: cubeSize, height: cubeSize, axis: [-1, -1, 0] }
]

/**
 * To Radian
 * @param angle Angle (degree)
 * @returns Angle (radian)
 */
const toRadian = (angle: number): number => (angle * Math.PI) / 180

/**
 * Face
 * @param props Props
 * @returns Face
 */
const Face: React.FunctionComponent<FaceProps> = ({
  size,
  position,
  axis,
  angle,
  name
}) => {
  // Store
  const {
    colors: { baseColor }
  } = useStore((s) => s.settings)

  // Rotation
  const rotation = useMemo(() => {
    const quaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(...axis),
      toRadian(angle)
    )
    return new THREE.Euler().setFromQuaternion(quaternion)
  }, [axis, angle])

  /**
   * Render
   */
  return (
    <group name="face" position={position} rotation={rotation}>
      <mesh>
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
const Corner: React.FunctionComponent<CornerProps> = ({ radius, position }) => {
  // Store
  const {
    colors: { baseColor }
  } = useStore((s) => s.settings)

  /**
   * Render
   */
  return (
    <group name="corner" position={position}>
      <mesh>
        <sphereGeometry args={[radius]} />
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
  return (
    <group>
      {corners.map((corner) => (
        <Corner key={corner.name} {...corner} />
      ))}
    </group>
  )
}

const Oblique: React.FunctionComponent<ObliqueProps> = ({
  width,
  height,
  position,
  lookAt
}) => {
  const ref = useRef<THREE.Group>(null)

  // Store
  const {
    colors: { baseColor }
  } = useStore((s) => s.settings)

  // Look at
  useEffect(() => {
    console.log(lookAt)
    ref.current?.lookAt(
      new THREE.Vector3(...lookAt.map((l) => cubeSize * 2 * l))
    )
  }, [lookAt])

  /**
   * Render
   */
  return (
    <group name="oblique" position={position} ref={ref}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
    </group>
  )
}

const Obliques = () => {
  return (
    <group>
      {obliques.map((oblique) => (
        <Oblique key={oblique.name} {...oblique} />
      ))}
    </group>
  )
}

/**
 * View cube
 * @returns ViewCube
 */
const ViewCube = () => {
  const distance = useRef<number>()

  // Store
  const {
    colors: { baseColor, hoverColor }
  } = useStore((s) => s.settings)

  const onPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const mesh = event.object as Mesh
      const eventDistance = event.distance
      if (
        mesh.type === 'Mesh' &&
        (distance.current ? eventDistance < distance.current : true)
      ) {
        console.log(mesh)
        mesh.material.color = new THREE.Color(hoverColor)
        distance.current = eventDistance
      }
    },
    [hoverColor]
  )

  const onPointerLeave = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const mesh = event.object as Mesh
      if (mesh.type === 'Mesh') {
        mesh.material.color = new THREE.Color(baseColor)
        distance.current = Infinity
      }
    },
    [baseColor]
  )

  /**
   * Render
   */
  return (
    <group onPointerEnter={onPointerMove} onPointerLeave={onPointerLeave}>
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
      length={cubeSize}
      color={color}
      text={text}
    />
  )
}

const Axes: React.FunctionComponent<AxesProps> = ({ dimension }) => {
  const offset = useMemo(() => cubeSize / 2 + (2 * delta) / 3, [])
  const origin: [number, number, number] = useMemo(
    () => [-offset, -offset, -offset],
    []
  )
  const directions: {
    x: [number, number, number]
    y: [number, number, number]
    z: [number, number, number]
  } = useMemo(() => ({ x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }), [])
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

  /**
   * On click
   * @param force Force face index
   */
  const onClick = useCallback(
    (force?: number): void => {
      // Checks
      if (!camera || !controls) return

      //   const currentFace = faces[force ?? 0 /*hover.index*/]
      //   if (!currentFace) return

      // Distance
      const target = controls.target as THREE.Vector3
      const distance = camera.position.distanceTo(target)

      //   // Position change
      //   const interval = currentFace.normal.clone().multiplyScalar(distance)

      //   // New position
      //   const newPosition = target.clone().add(interval)

      //   // Update
      //   camera.position.copy(newPosition)
      //   camera.up.copy(currentFace.up)
    },
    [camera, controls /*, hover.index*/]
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
      <ViewCube />
      <Axes dimension={dimension} />
    </group>
  )
}

export default Navigation
