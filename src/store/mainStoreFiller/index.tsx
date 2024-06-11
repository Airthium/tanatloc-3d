import { useMemo } from 'react'
import * as THREE from 'three'
import { TrackballControlsProps } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import useStore from '@store'

/**
 * Props
 */
export interface MainStoreFillerProps {
  controls?: TrackballControlsProps
}

/**
 * Debounce function
 * @param func Function
 * @param timeout Timeout
 * @returns Function
 */
const debounceLeading = (func: Function, timeout: number) => {
  let timer: NodeJS.Timeout | undefined
  return (...args: any[]) => {
    if (timer) return

    // Execute function
    func(...args)

    // Set timer
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = undefined
    }, timeout)
  }
}

/**
 * Main store filler
 * @returns MainStoreFiller
 */
const MainStoreFiller: React.FunctionComponent<MainStoreFillerProps> = ({
  controls
}) => {
  // Update function
  const update = useMemo(
    () =>
      debounceLeading(
        (
          camera: THREE.Camera,
          gl: THREE.WebGLRenderer,
          scene: THREE.Scene,
          controls: TrackballControlsProps
        ) =>
          useStore.setState({
            mainView: {
              gl,
              scene,
              camera: camera as THREE.PerspectiveCamera,
              controls
            }
          }),
        500
      ),
    []
  )

  // Update (has to be always up to date)
  useFrame(({ camera, gl, scene }) => {
    update(camera, gl, scene, controls)
  })

  /**
   * Render
   */
  return null
}

export default MainStoreFiller
