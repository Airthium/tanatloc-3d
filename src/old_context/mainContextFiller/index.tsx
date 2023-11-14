import { useThree } from '@react-three/fiber'
import { TrackballControlsProps } from '@react-three/drei'

import useStore from '@store'
import { useEffect } from 'react'

export interface MainContextFillerProps {
  controls?: TrackballControlsProps
}

/**
 * Main context filler
 * @returns MainContextFiller
 */
const MainContextFiller = ({ controls }: MainContextFillerProps): null => {
  // Data
  const { gl, scene, camera } = useThree()

  // Update
  useEffect(() => {
    useStore.setState({
      mainView: {
        gl,
        scene,
        camera: camera as THREE.PerspectiveCamera,
        controls
      }
    })
  }, [gl, scene, camera, controls])

  /**
   * Render
   */
  return null
}

export default MainContextFiller
