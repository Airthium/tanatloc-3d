import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { TrackballControlsProps } from '@react-three/drei'

import useStore from '@store'

/**
 * Props
 */
export interface MainStoreFillerProps {
  controls?: TrackballControlsProps
}

/**
 * Main context filler
 * @returns MainStoreFiller
 */
const MainStoreFiller = ({ controls }: MainStoreFillerProps): null => {
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

export default MainStoreFiller
