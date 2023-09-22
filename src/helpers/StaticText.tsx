import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

/**
 * Props
 */
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

export default StaticText
