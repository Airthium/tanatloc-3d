import { create } from 'zustand'
import { TrackballControlsProps } from '@react-three/drei'

import { Tanatloc3DRendererProps } from '@index'

import {
  defaultDisplay,
  defaultExtra,
  defaultGeometry,
  defaultLut,
  defaultMainView,
  defaultProps,
  defaultResult,
  defaultSectionView,
  defaultSettings,
  defaultZoomToSelection
} from './defaults'

/**
 * Store
 */
export interface Store {
  extra: {
    notFound?: boolean
    background?: boolean
  }
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
  extra: defaultExtra,
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
  setExtra: (extra: Store['extra']) => set({ extra }),
  setProps: (props: Store['props']) => set({ props }),
  setMainView: (mainView: Store['mainView']) => set({ mainView })
}))

export default useStore
