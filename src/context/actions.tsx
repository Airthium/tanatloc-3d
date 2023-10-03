import { TrackballControlsProps } from '@react-three/drei'
import { MyCanvasPropsSnapshot, actionTypes } from '.'

/**
 * Set props snapshot project
 * @param gl GL
 * @returns Action
 */
export const setPropsSnapshotProject = (
  project: MyCanvasPropsSnapshot['project']
) => ({
  type: actionTypes.SETPROPSSNAPSHOTPROJECT,
  value: project
})

/**
 * Set main view gl
 * @param gl GL
 * @returns Action
 */
export const setMainViewGl = (gl: THREE.WebGLRenderer) => ({
  type: actionTypes.SETMAINVIEWGL,
  value: gl
})

/**
 * Set main view scene
 * @param scene Scene
 * @returns Action
 */
export const setMainViewScene = (scene: THREE.Scene) => ({
  type: actionTypes.SETMAINVIEWSCENE,
  value: scene
})

/**
 * Set main view camera
 * @param camera Camera
 * @returns Action
 */
export const setMainViewCamera = (camera: THREE.PerspectiveCamera) => ({
  type: actionTypes.SETMAINVIEWCAMERA,
  value: camera
})

/**
 * Set main view controls
 * @param controls Controls
 * @returns Action
 */
export const setMainViewControls = (controls: TrackballControlsProps) => ({
  type: actionTypes.SETMAINVIEWCONTROLS,
  value: controls
})

/**
 * Set parts transparent
 * @param transparent Transparent
 * @returns Action
 */
export const setPartsTransparent = (transparent: boolean) => ({
  type: actionTypes.SETPARTSTRANSPARENT,
  value: transparent
})

/**
 * Set grid visible
 * @param visible Visible
 * @returns Action
 */
export const setGridVisible = (visible: boolean) => ({
  type: actionTypes.SETGRIDVISIBLE,
  value: visible
})

/**
 * Set zoom to selection enabled
 * @param enabled Enabled
 * @returns Action
 */
export const setZoomToSelectionEnabled = (enabled: boolean) => ({
  type: actionTypes.SETZOOMTOSELECTIONENABLED,
  value: enabled
})

/**
 * Set section view clipping enabled
 * @param enabled Enabled
 * @returns Action
 */
export const setSectionViewEnabled = (enabled: boolean) => ({
  type: actionTypes.SETSECTIONVIEWENABLED,
  value: enabled
})

/**
 * Set section view clipping plane
 * @param clippingPlane Clipping plane
 * @returns Action
 */
export const setSectionViewClippingPlane = (clippingPlane: THREE.Plane) => ({
  type: actionTypes.SETSECTIONVIEWCLIPPINGPLANE,
  value: clippingPlane
})

/**
 * Set section view hide plane
 * @param hidden Hidden
 * @returns Action
 */
export const setSectionViewHidePlane = (hidden: boolean) => ({
  type: actionTypes.SETSECTIONVIEWHIDEPLANE,
  value: hidden
})

/**
 * Set section view snap
 * @param hidden Hidden
 * @returns Action
 */
export const setSectionViewSnap = (axis: THREE.Vector3) => ({
  type: actionTypes.SETSECTIONVIEWSNAP,
  value: axis
})

/**
 * Set section viex flip
 * @param hidden Hidden
 * @returns Action
 */
export const setSectionViewFlip = (number: number) => ({
  type: actionTypes.SETSECTIONVIEWFLIP,
  value: number
})
