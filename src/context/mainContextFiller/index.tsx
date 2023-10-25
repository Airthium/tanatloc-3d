import { useThree } from '@react-three/fiber'
import { useContext, useEffect } from 'react'
import { TrackballControlsProps } from '@react-three/drei'

import { Context } from '..'
import {
  setMainViewCamera,
  setMainViewControls,
  setMainViewGl,
  setMainViewScene
} from '../actions'

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

  // Context
  const { dispatch } = useContext(Context)

  // Set renderer
  useEffect(() => {
    dispatch(setMainViewGl(gl))
  }, [gl, dispatch])

  // Set scene
  useEffect(() => {
    dispatch(setMainViewScene(scene))
  }, [scene, dispatch])

  // Set camera
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

export default MainContextFiller
