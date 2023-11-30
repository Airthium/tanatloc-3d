import { Store } from '@store'

/**
 * Default props
 */
export const defaultProps = {
  style: undefined,
  parts: undefined,
  selection: undefined,
  data: undefined,
  postProcessing: undefined,
  snapshot: undefined,
  onHighlight: undefined,
  onSelect: undefined,
  onData: undefined,
  onPostProcessing: undefined
}

/**
 * Default mainView
 */
export const defaultMainView = {
  gl: undefined,
  scene: undefined,
  camera: undefined,
  controls: undefined
}

/**
 * Default display
 */
export const defaultDisplay = {
  transparent: true,
  grid: true
}

/**
 * Default zoomToSelection
 */
export const defaultZoomToSelection = {
  enabled: false
}

/**
 * Default sectionView
 */
export const defaultSectionView = {
  enabled: false,
  clippingPlane: undefined,
  hidePlane: false,
  snap: undefined,
  flip: undefined
}

/**
 * Default geometry
 */
export const defaultGeometry = {
  dimension: 0
}

/**
 * Default result
 */
export const defaultResult = {
  meshVisible: true
}

/**
 * Default lut
 */
export const defaultLut = {
  colormap: 'rainbow',
  min: -1,
  max: 1
}

/**
 * Default settings
 */
export const defaultSettings: Store['settings'] = {
  light: {
    color: '#ffffff',
    intensity: 1,
    decay: 0
  },
  colors: {
    baseColor: '#d3d3d3',
    hoverColor: '#fad114',
    selectColor: '#fa9814',
    hoverSelectColor: '#fa5f14'
  },
  frameRate: {
    fps: 30
  },
  localStorage: false
}
