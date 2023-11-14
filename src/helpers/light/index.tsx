import { useContext, useEffect, useState } from 'react'

import { Context } from '@context'

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
const Light = ({ update }: LightProps) => {
  // State
  const [positionRight, setPositionRight] = useState<THREE.Vector3>(null!)
  const [positionLeft, setPositionLeft] = useState<THREE.Vector3>(null!)

  // Context
  const { mainView, settings } = useContext(Context)

  // Set position
  useEffect(() => {
    if (!mainView.camera || !mainView.controls) return

    // Camera
    const camera = mainView.camera
    const cameraPosition = camera.position.clone()
    const cameraUp = camera.up.clone().normalize()

    // Target
    const target = mainView.controls.target as THREE.Vector3

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
  }, [mainView.camera, mainView.controls, update])

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
