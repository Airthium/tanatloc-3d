import { create } from 'zustand'
import { TrackballControlsProps } from '@react-three/drei'

import { Tanatloc3DRendererProps } from '@index'

import {
  defaultDisplay,
  defaultGeometry,
  defaultLut,
  defaultMainView,
  defaultProps,
  defaultResult,
  defaultSectionView,
  defaultSettings,
  defaultZoomToSelection
} from './defaults'
import { setMainView, setProps } from './set'

/**
 * Store
 */
export interface Store {
  props: Tanatloc3DRendererProps
  mainView: {
    gl?: THREE.WebGLRenderer
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    controls?: TrackballControlsProps
  }
  display: {
    transparent: boolean
    grid: boolean
  }
  zoomToSelection: {
    enabled: boolean
  }
  sectionView: {
    enabled: boolean
    clippingPlane?: THREE.Plane
    hidePlane: boolean
    snap?: THREE.Vector3
    flip?: number
  }
  geometry: {
    dimension: number
  }
  result: {
    meshVisible: boolean
  }
  lut: {
    colormap: string
    min: number
    max: number
    customMin?: number
    customMax?: number
  }
  settings: {
    light: {
      color: string
      intensity: number
      decay: number
    }
    colors: {
      baseColor: string
      hoverColor: string
      selectColor: string
      hoverSelectColor: string
    }
    frameRate: {
      fps: number
    }
    localStorage: boolean
  }
}

/**
 * Local storage settings
 */
const localStorageSettings =
  typeof window === 'undefined'
    ? undefined
    : localStorage.getItem('tanatloc-3d-settings')

/**
 * Store
 */
const useStore = create<Store>((set) => ({
  props: defaultProps,
  mainView: defaultMainView,
  display: defaultDisplay,
  zoomToSelection: defaultZoomToSelection,
  sectionView: defaultSectionView,
  geometry: defaultGeometry,
  result: defaultResult,
  lut: defaultLut,
  settings: localStorageSettings
    ? JSON.parse(localStorageSettings)
    : defaultSettings,
  setProps: setProps(set),
  setMainView: setMainView(set)
}))

export default useStore
