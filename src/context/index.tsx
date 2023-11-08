import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react'
import { TrackballControlsProps } from '@react-three/drei'

import { Tanatloc3DProps } from '../..'

/**
 * Context state interface
 */
export interface ContextState {
  props: Tanatloc3DProps
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
  dispatch: Dispatch<ContextAction>
}

/**
 * Context action interface
 */
export interface ContextAction {
  type: string
  value: any
}

/**
 * Provider props
 */
export interface ProviderProps {
  children: ReactNode
}

/**
 * Default settings
 */
export const defaultSettings: ContextState['settings'] = {
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

/**
 * Local storage settings
 */
const localStorageSettings =
  typeof window === 'undefined'
    ? undefined
    : localStorage.getItem('tanatloc-3d-settings')

/**
 * Initial context state
 */
export const initialContextState: ContextState = {
  props: {
    parts: undefined,
    selection: undefined,
    data: undefined,
    postProcessing: undefined,
    snapshot: undefined,
    onHighlight: undefined,
    onSelect: undefined,
    onData: undefined,
    onPostProcessing: undefined
  },
  mainView: {
    gl: undefined,
    scene: undefined,
    camera: undefined,
    controls: undefined
  },
  display: {
    transparent: false,
    grid: true
  },
  zoomToSelection: {
    enabled: false
  },
  sectionView: {
    enabled: false,
    clippingPlane: undefined,
    hidePlane: false,
    snap: undefined,
    flip: undefined
  },
  geometry: {
    dimension: 0
  },
  result: {
    meshVisible: true
  },
  lut: {
    colormap: 'rainbow',
    min: -1,
    max: 1
  },
  settings: localStorageSettings
    ? JSON.parse(localStorageSettings)
    : defaultSettings,
  dispatch: () => undefined
}

/**
 * Action types
 */
export const actionTypes = {
  SETPROPSPARTS: 'SETPROPSPARTS',
  SETPROPSSELECTION: 'SETPROPSSELECTION',
  SETPROPSDATA: 'SETPROPSDATA',
  SETPROPSPOSTPROCESSING: 'SETPROPSPOSTPROCESSING',
  SETPROPSSNAPSHOTPROJECT: 'SETPROPSSNAPSHOTPROJECT',
  SETPROPSONHIGHLIGHT: 'SETPROPSONHIGHLIGHT',
  SETPROPSONSELECT: 'SETPROPSONSELECT',
  SETPROPSONDATA: 'SETPROPSONDATA',
  SETPROPSONPOSTPROCESSING: 'SETPROPSONPOSTPROCESSING',
  SETMAINVIEWGL: 'SETMAINVIEWGL',
  SETMAINVIEWSCENE: 'SETMAINVIEWSCENE',
  SETMAINVIEWCAMERA: 'SETMAINVIEWCAMERA',
  SETMAINVIEWCONTROLS: 'SETMAINVIEWCONTROLS',
  SETDISPLAYTRANSPARENT: 'SETDISPLAYTRANSPARENT',
  SETDISPLAYGRID: 'SETDISPLAYGRID',
  SETZOOMTOSELECTIONENABLED: 'SETZOOMTOSELECTIONENABLED',
  SETSECTIONVIEWENABLED: 'SETSECTIONVIEWENABLED',
  SETSECTIONVIEWCLIPPINGPLANE: 'SETSECTIONVIEWCLIPPINGPLANE',
  SETSECTIONVIEWHIDEPLANE: 'SETSECTIONVIEWHIDEPLANE',
  SETSECTIONVIEWSNAP: 'SETSECTIONVIEWSNAP',
  SETSECTIONVIEWFLIP: 'SETSECTIONVIEWFLIP',
  SETGEOMETRYDIMENSION: 'SETGEOMETRYDIMENSION',
  SETRESULTMESHVISIBLE: 'SETRESULTMESHVISIBLE',
  SETLUTCOLORMAP: 'SETLUTCOLORMAP',
  SETLUTMIN: 'SETLUTMIN',
  SETLUTMAX: 'SETLUTMAX',
  SETLUTCUSTOMMIN: 'SETLUTCUSTOMMIN',
  SETLUTCUSTOMMAX: 'SETLUTCUSTOMMAX',
  SETSETTINGS: 'SETSETTINGS'
}

/**
 * Context
 */
export const Context = createContext(initialContextState)

/**
 * Reducer
 * @param state State
 * @param action Action
 * @returns State
 */
export const reducer = (
  state: ContextState,
  action: ContextAction
): ContextState => {
  switch (action.type) {
    case actionTypes.SETPROPSPARTS:
      return {
        ...state,
        props: {
          ...state.props,
          parts: action.value
        }
      }
    case actionTypes.SETPROPSSELECTION:
      return {
        ...state,
        props: {
          ...state.props,
          selection: action.value
        }
      }
    case actionTypes.SETPROPSDATA:
      return {
        ...state,
        props: {
          ...state.props,
          data: action.value
        }
      }
    case actionTypes.SETPROPSPOSTPROCESSING:
      return {
        ...state,
        props: {
          ...state.props,
          postProcessing: action.value
        }
      }
    case actionTypes.SETPROPSSNAPSHOTPROJECT:
      return {
        ...state,
        props: {
          ...state.props,
          snapshot: {
            ...state.props.snapshot,
            project: action.value
          }
        }
      }
    case actionTypes.SETPROPSONHIGHLIGHT:
      return {
        ...state,
        props: {
          ...state.props,
          onHighlight: action.value
        }
      }
    case actionTypes.SETPROPSONSELECT:
      return {
        ...state,
        props: {
          ...state.props,
          onSelect: action.value
        }
      }
    case actionTypes.SETPROPSONDATA:
      return {
        ...state,
        props: {
          ...state.props,
          onData: action.value
        }
      }
    case actionTypes.SETPROPSONPOSTPROCESSING:
      return {
        ...state,
        props: {
          ...state.props,
          onPostProcessing: action.value
        }
      }
    case actionTypes.SETMAINVIEWGL:
      return {
        ...state,
        mainView: {
          ...state.mainView,
          gl: action.value
        }
      }
    case actionTypes.SETMAINVIEWSCENE:
      return {
        ...state,
        mainView: {
          ...state.mainView,
          scene: action.value
        }
      }
    case actionTypes.SETMAINVIEWCAMERA:
      return {
        ...state,
        mainView: {
          ...state.mainView,
          camera: action.value
        }
      }
    case actionTypes.SETMAINVIEWCONTROLS:
      return {
        ...state,
        mainView: {
          ...state.mainView,
          controls: action.value
        }
      }
    case actionTypes.SETDISPLAYTRANSPARENT:
      return {
        ...state,
        display: {
          ...state.display,
          transparent: action.value
        }
      }
    case actionTypes.SETDISPLAYGRID:
      return {
        ...state,
        display: {
          ...state.display,
          grid: action.value
        }
      }
    case actionTypes.SETZOOMTOSELECTIONENABLED:
      return {
        ...state,
        zoomToSelection: {
          ...state.zoomToSelection,
          enabled: action.value
        }
      }
    case actionTypes.SETSECTIONVIEWENABLED:
      return {
        ...state,
        sectionView: {
          ...state.sectionView,
          enabled: action.value
        }
      }
    case actionTypes.SETSECTIONVIEWCLIPPINGPLANE:
      return {
        ...state,
        sectionView: {
          ...state.sectionView,
          clippingPlane: action.value
        }
      }
    case actionTypes.SETSECTIONVIEWHIDEPLANE:
      return {
        ...state,
        sectionView: {
          ...state.sectionView,
          hidePlane: action.value
        }
      }
    case actionTypes.SETSECTIONVIEWSNAP:
      return {
        ...state,
        sectionView: {
          ...state.sectionView,
          snap: action.value
        }
      }
    case actionTypes.SETSECTIONVIEWFLIP:
      return {
        ...state,
        sectionView: {
          ...state.sectionView,
          flip: action.value
        }
      }
    case actionTypes.SETGEOMETRYDIMENSION:
      return {
        ...state,
        geometry: {
          ...state.geometry,
          dimension: action.value
        }
      }
    case actionTypes.SETRESULTMESHVISIBLE:
      return {
        ...state,
        result: {
          ...state.result,
          meshVisible: action.value
        }
      }
    case actionTypes.SETLUTCOLORMAP:
      return {
        ...state,
        lut: {
          ...state.lut,
          colormap: action.value
        }
      }
    case actionTypes.SETLUTMIN:
      return {
        ...state,
        lut: {
          ...state.lut,
          min: action.value
        }
      }
    case actionTypes.SETLUTMAX:
      return {
        ...state,
        lut: {
          ...state.lut,
          max: action.value
        }
      }
    case actionTypes.SETLUTCUSTOMMIN:
      return {
        ...state,
        lut: {
          ...state.lut,
          customMin: action.value
        }
      }
    case actionTypes.SETLUTCUSTOMMAX:
      return {
        ...state,
        lut: {
          ...state.lut,
          customMax: action.value
        }
      }
    case actionTypes.SETSETTINGS:
      return {
        ...state,
        settings: action.value
      }
    default:
      return state
  }
}

/**
 * Provider
 * @param props Props
 * @returns Provider
 */
const Provider = ({ children }: ProviderProps): React.JSX.Element => {
  // Reducer
  const [state, dispatch] = useReducer(reducer, initialContextState)

  // Context
  const contextValue = useMemo(
    () => ({
      ...state,
      dispatch
    }),
    [state]
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default Provider
