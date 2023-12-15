import { useEffect, useState } from 'react'

import useStore from '@store'

/**
 * Props
 */
export interface LightProps {
  update?: number
}

/**
 * Light
 * @param props Props
 * @returns Light
 */
const Light: React.FunctionComponent<LightProps> = ({ update }) => {
  // State
  const [positionRight, setPositionRight] = useState<THREE.Vector3>(null!)
  const [positionLeft, setPositionLeft] = useState<THREE.Vector3>(null!)

  // Store
  const { camera, controls } = useStore((s) => s.mainView)
  const settings = useStore((s) => s.settings)

  // Set position
  useEffect(() => {
    if (!camera || !controls) return

    // Camera
    const cameraPosition = camera.position.clone()
    const cameraUp = camera.up.clone().normalize()

    // Target
    const target = controls.target as THREE.Vector3

    // Direction
    const direction = target.clone().sub(cameraPosition).normalize()

    // Right
    const right = cameraPosition
      .clone()
      .add(direction.clone().cross(cameraUp))
      .multiplyScalar(0.9)

    // Left
    const left = cameraPosition
      .clone()
      .sub(direction.clone().cross(cameraUp))
      .multiplyScalar(0.9)

    // Update
    setPositionRight(right)
    setPositionLeft(left)
  }, [camera, controls, update])

  /**
   * Render
   */
  return (
    <group type="Light">
      <ambientLight />
      <pointLight
        position={positionRight}
        color={settings.light.color}
        intensity={settings.light.intensity}
        decay={settings.light.decay}
      />
      <pointLight
        position={positionLeft}
        color={settings.light.color}
        intensity={settings.light.intensity}
        decay={settings.light.decay}
      />
    </group>
  )
}

export default Light
