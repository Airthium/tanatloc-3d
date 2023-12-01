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
 * Main store filler
 * @returns MainStoreFiller
 */
const MainStoreFiller = ({ controls }: MainStoreFillerProps): null => {
  // Data
  const { gl, scene, camera } = useThree()

  // Update (has to be always up to date)
  useEffect(() => {
    useStore.setState({
      mainView: {
        gl,
        scene,
        camera: camera as THREE.PerspectiveCamera,
        controls
      }
    })
  })

  /**
   * Render
   */
  return null
}

export default MainStoreFiller
