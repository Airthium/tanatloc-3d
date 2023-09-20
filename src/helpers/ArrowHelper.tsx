import { useEffect, useMemo, useRef } from 'react'
import { Vector3 } from 'three'

import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

/**
 * Props
 */
export interface ArrowHelperProps {
  origin: THREE.Vector3
  direction: THREE.Vector3
  length: number
  color?: string | number
  text?: string
}

export interface StaticTextProps {
  position: THREE.Vector3
  fontSize?: number
  children: string
}

/**
 * Static text
 * @param props props
 * @returns StaticText
 */
const StaticText = ({
  position,
  fontSize,
  children,
}: StaticTextProps): React.JSX.Element => {
  // Ref
  const ref = useRef<THREE.Mesh>(null!)

  // Always front of camera
  useFrame(({ camera }) => {
    ref.current.quaternion.copy(camera.quaternion)
  })

  /**
   * Render
   */
  return (
    <Text ref={ref} position={position} fontSize={fontSize}>
      {children}
    </Text>
  )
}
StaticText.defaultProps = {
  position: new Vector3(0, 0, 0),
  children: '',
}

/**
 * Arrow helper
 * @param props Props
 * @returns ArrowHelper
 */
const ArrowHelper = ({
  origin,
  direction,
  length,
  color,
  text,
}: ArrowHelperProps): React.JSX.Element => {
  // Ref
  const ref = useRef<THREE.Mesh>(null!)

  // Material
  const material = useMemo(() => <meshBasicMaterial color={color} />, [color])

  // Text position
  const textPosition = useMemo(
    () => origin.clone().add(direction.multiplyScalar(length * 1.2)),
    [origin, direction, length]
  )

  // Direction
  useEffect(() => {
    if (direction.y > 0.99999) ref.current.quaternion.set(0, 0, 0, 1)
    else if (direction.y < -0.99999) ref.current.quaternion.set(1, 0, 0, 0)
    else {
      const axis = new Vector3(direction.z, 0, -direction.x).normalize()
      const angle = Math.acos(direction.y)
      ref.current.quaternion.setFromAxisAngle(axis, angle)
    }
  }, [direction])

  /**
   * Render
   */
  return (
    <>
      <mesh ref={ref} position={origin}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[length * 0.02, length * 0.02, length]} />
          {material}
        </mesh>
        <mesh position={[0, length, 0]}>
          <coneGeometry args={[0.2 * 0.2 * length, 0.2 * length]} />
          {material}
        </mesh>
      </mesh>
      {text ? (
        <StaticText position={textPosition} fontSize={0.2 * length}>
          {text}
        </StaticText>
      ) : null}
    </>
  )
}
ArrowHelper.defaultProps = {
  origin: new Vector3(0, 0, 0),
  direction: new Vector3(1, 0, 0),
  length: 1,
}

export default ArrowHelper
