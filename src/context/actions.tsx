import { TrackballControlsProps } from '@react-three/drei'
import { actionTypes } from '.'

/**
 * Set main view scene
 * @param scene Scene
 * @returns Action
 */
export const setMainViewScene = (scene: THREE.Scene) => ({
  type: actionTypes.SETMAINVIEWSCENE,
  value: scene,
})

/**
 * Set main view camera
 * @param camera Camera
 * @returns Action
 */
export const setMainViewCamera = (camera: THREE.PerspectiveCamera) => ({
  type: actionTypes.SETMAINVIEWCAMERA,
  value: camera,
})

/**
 * Set main view controls
 * @param controls Controls
 * @returns Action
 */
export const setMainViewControls = (controls: TrackballControlsProps) => ({
  type: actionTypes.SETMAINVIEWCONTROLS,
  value: controls,
})

/**
 * Set parts transparent
 * @param transparent Transparent
 * @returns Action
 */
export const setPartsTransparent = (transparent: boolean) => ({
  type: actionTypes.SETPARTSTRANSPARENT,
  value: transparent,
})

/**
 * Set grid visible
 * @param visible Visible
 * @returns Action
 */
export const setGridVisible = (visible: boolean) => ({
  type: actionTypes.SETGRIDVISIBLE,
  value: visible,
})
