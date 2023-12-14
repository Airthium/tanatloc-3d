import { ReactNode, useEffect, useMemo, useRef } from 'react'
import { Tetrahedron } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import useStore from '@store'

// Number of tetrahedra
const numberOfTetrahedra = 50

// Translation speed
const translationSpeed = 0.025

// Rotation speed
const rotationSpeed = 0.025

/**
 * Props
 */
export interface OneTetrahedronProps {
  width: number
  height: number
}

/**
 * Background
 * @returns Background
 */
const Background = () => {
  // Update store
  useEffect(() => {
    useStore.setState({ extra: { background: true } })

    return () => {
      useStore.setState({ extra: {} })
    }
  }, [])

  /**
   * Render
   */
  return null
}

/**
 * One tetrahedron
 * @param props Props
 * @returns OneTetrahedron
 */
const OneTetrahedron = ({ width, height }: OneTetrahedronProps): ReactNode => {
  // Ref
  const meshRef = useRef<THREE.Mesh>(null!)
  const xDir = useRef<-1 | 1>(1)
  const yDir = useRef<-1 | 1>(1)

  // Constants
  const {
    sizeFactor,
    positionFactor,
    rotationFactor,
    colorFactor,
    transparencyFactor,
    opacityFactor
  } = useMemo(() => {
    return {
      sizeFactor: Math.random(),
      positionFactor: { x: Math.random(), y: Math.random() },
      rotationFactor: { x: Math.random(), y: Math.random(), z: Math.random() },
      colorFactor: Math.random(),
      transparencyFactor: Math.random(),
      opacityFactor: Math.random()
    }
  }, [])

  // Translation
  const translation = useMemo(
    () => ({
      x: Math.random(),
      y: Math.random()
    }),
    []
  )

  // Rotation
  const rotation = useMemo(
    () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random()
    }),
    []
  )

  // Rotate
  useFrame(() => {
    const mesh = meshRef.current

    // Position
    if (mesh.position.x < -width / 2 || mesh.position.x > width / 2)
      xDir.current *= -1
    mesh.position.x += xDir.current * translationSpeed * (translation.x - 0.5)

    if (mesh.position.y < -height / 2 || mesh.position.y > height / 2)
      yDir.current *= -1
    mesh.position.y += yDir.current * translationSpeed * (translation.y - 0.5)

    // Rotation
    mesh.rotation.x += rotationSpeed * (rotation.x - 0.5)
    mesh.rotation.y += rotationSpeed * (rotation.y - 0.5)
    mesh.rotation.z += rotationSpeed * (rotation.z - 0.5)
  })

  return (
    <Tetrahedron
      ref={meshRef}
      args={[0.1 + 0.075 * (0.5 - sizeFactor)]}
      position={[
        (width / 3) * (1 - 2 * positionFactor.x),
        (height / 3) * (1 - 2 * positionFactor.y),
        0
      ]}
      rotation={[
        rotationFactor.x * Math.PI,
        rotationFactor.y * Math.PI,
        rotationFactor.y * Math.PI
      ]}
    >
      <meshPhysicalMaterial
        color={colorFactor * 0x0096c7 + (1 - colorFactor) * 0xbbbbbb}
        wireframe
        transparent={transparencyFactor > 0.5}
        opacity={opacityFactor}
      />
    </Tetrahedron>
  )
}

/**
 * Background render
 * @returns BackgroundRender
 */
export const BackgroundRender = () => {
  // Store
  const { camera } = useStore((s) => s.mainView)

  // With & height
  const { width, height } = useMemo(() => {
    if (!camera) return { width: 1, height: 1 }

    // Visible height & width
    const offset = camera.position.z
    const hFOV = (camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(hFOV / 2) * offset
    const width = height * camera.aspect

    return { width, height }
  }, [camera])

  // Tetrahedra
  const tetrahedra = useMemo(() => {
    const tetrahedra = []

    for (let i = 0; i < numberOfTetrahedra; ++i) {
      tetrahedra.push(
        <OneTetrahedron key={'tetra_' + i} width={width} height={height} />
      )
    }

    return tetrahedra
  }, [width, height])

  /**
   * Render
   */
  return <mesh>{tetrahedra}</mesh>
}

export default Background
