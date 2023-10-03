import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react'
import { TrackballControlsProps } from '@react-three/drei'

/**
 * Context state interface
 */
export interface ContextState {
  props: MyCanvasProps
  mainView: {
    gl?: THREE.WebGLRenderer
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    controls?: TrackballControlsProps
  }
  parts: {
    transparent: boolean
  }
  grid: {
    visible: boolean
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
 * MyCanvas props
 */
export interface MyCanvasProps {
  snapshot?: MyCanvasPropsSnapshot
}

export interface MyCanvasPropsSnapshot {
  project?: {
    apiRoute: (image: string) => Promise<void>
    size?: { width: number; height: number }
  }
}

/**
 * Initial context state
 */
export const initialContextState: ContextState = {
  props: {
    snapshot: undefined
  },
  mainView: {
    gl: undefined,
    scene: undefined,
    camera: undefined,
    controls: undefined
  },
  parts: {
    transparent: false
  },
  grid: {
    visible: true
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
  dispatch: () => undefined
}

/**
 * Action types
 */
export const actionTypes = {
  SETPROPSSNAPSHOTPROJECT: 'SETPROPSSNAPSHOTPROJECT',
  SETMAINVIEWGL: 'SETMAINVIEWGL',
  SETMAINVIEWSCENE: 'SETMAINVIEWSCENE',
  SETMAINVIEWCAMERA: 'SETMAINVIEWCAMERA',
  SETMAINVIEWCONTROLS: 'SETMAINVIEWCONTROLS',
  SETPARTSTRANSPARENT: 'SETPARTSTRANSPARENT',
  SETGRIDVISIBLE: 'SETGRIDVISIBLE',
  SETZOOMTOSELECTIONENABLED: 'SETZOOMTOSELECTIONENABLED',
  SETSECTIONVIEWENABLED: 'SETSECTIONVIEWENABLED',
  SETSECTIONVIEWCLIPPINGPLANE: 'SETSECTIONVIEWCLIPPINGPLANE',
  SETSECTIONVIEWHIDEPLANE: 'SETSECTIONVIEWHIDEPLANE',
  SETSECTIONVIEWSNAP: 'SETSECTIONVIEWSNAP',
  SETSECTIONVIEWFLIP: 'SETSECTIONVIEWFLIP'
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
    case actionTypes.SETPARTSTRANSPARENT:
      return {
        ...state,
        parts: {
          ...state.parts,
          transparent: action.value
        }
      }
    case actionTypes.SETGRIDVISIBLE:
      return {
        ...state,
        grid: {
          ...state.grid,
          visible: action.value
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
