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
 * Main store filler
 * @returns MainStoreFiller
 */
const MainStoreFiller: React.FunctionComponent<MainStoreFillerProps> = ({
  controls
}) => {
  // Update (has to be always up to date)
  useFrame(({ camera, gl, scene }) => {
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
