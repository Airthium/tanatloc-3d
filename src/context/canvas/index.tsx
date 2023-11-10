import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react'

import { Tanatloc3DCanvasProps } from '@index'

/**
 * Context state interface
 */
export interface ContextState {
  props: Tanatloc3DCanvasProps
  children: ReactNode[]
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
  props: {},
  children: [],
  dispatch: () => undefined
}

/**
 * Action types
 */
export const actionTypes = {
  SETPROPS: 'SETPROPS',
  SETCHILDREN: 'SETCHILDREN'
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
    case actionTypes.SETPROPS:
      return {
        ...state,
        props: action.value
      }
    case actionTypes.SETCHILDREN:
      return {
        ...state,
        children: action.value
      }
    default:
      return state
  }
}

const Provider = ({ children }: ProviderProps): React.JSX.Element => {
  // Reducer
  const [state, dispatch] = useReducer(reducer, initialContextState)
  console.log(state)
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
