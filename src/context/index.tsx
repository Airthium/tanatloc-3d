import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react'
import { TrackballControlsProps } from '@react-three/drei'

/**
 * Context state interface
 */
export interface ContextState {
  mainView: {
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
 * Initial context state
 */
export const initialContextState: ContextState = {
  mainView: {
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
  dispatch: () => undefined
}

/**
 * Action types
 */
export const actionTypes = {
  SETMAINVIEWSCENE: 'SETMAINVIEWSCENE',
  SETMAINVIEWCAMERA: 'SETMAINVIEWCAMERA',
  SETMAINVIEWCONTROLS: 'SETMAINVIEWCONTROLS',
  SETPARTSTRANSPARENT: 'SETPARTSTRANSPARENT',
  SETGRIDVISIBLE: 'SETGRIDVISIBLE'
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
