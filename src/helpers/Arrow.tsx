import { useEffect, useMemo, useRef } from 'react'
import { Vector3 } from 'three'

import StaticText from './StaticText'

/**
 * Props
 */
export interface ArrowProps {
  origin: THREE.Vector3
  direction: THREE.Vector3
  length: number
  color?: string | number
  text?: string
}

/**
 * Arrow
 * @param props Props
 * @returns Arrow
 */
const Arrow = ({
  origin,
  direction,
  length,
  color,
  text,
}: ArrowProps): React.JSX.Element => {
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
Arrow.defaultProps = {
  origin: new Vector3(0, 0, 0),
  direction: new Vector3(1, 0, 0),
  length: 1,
}

export default Arrow
