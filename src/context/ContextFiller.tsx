import { useThree } from '@react-three/fiber'
import { useContext, useEffect } from 'react'
import { TrackballControlsProps } from '@react-three/drei'

import { Context } from '.'
import {
  setMainViewCamera,
  setMainViewControls,
  setMainViewScene
} from './actions'

export interface ContextFillerProps {
  controls?: TrackballControlsProps
}

/**
 * Context filler
 * @returns ContextFiller
 */
const ContextFiller = ({ controls }: ContextFillerProps): null => {
  // Data
  const { scene, camera } = useThree()

  // Context
  const { dispatch } = useContext(Context)

  // Set context
  useEffect(() => {
    dispatch(setMainViewScene(scene))
  }, [scene, dispatch])

  // Set context
  useEffect(() => {
    dispatch(setMainViewCamera(camera as THREE.PerspectiveCamera))
  }, [camera, dispatch])

  // Set controls
  useEffect(() => {
    if (controls) dispatch(setMainViewControls(controls))
  }, [controls, dispatch])

  /**
   * Render
   */
  return null
}

export default ContextFiller
