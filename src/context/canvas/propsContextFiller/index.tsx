import { useContext, useEffect } from 'react'

import { Tanatloc3DCanvasProps } from '@index'

import { Context } from '@context/canvas'
import { setProps } from '@context/canvas/action'

/**
 * Props context filler
 * @param props Props
 * @returns PropsContextFiller
 */
const PropsContextFiller = (props: Tanatloc3DCanvasProps): null => {
  // Context
  const { dispatch } = useContext(Context)

  // Set props
  useEffect(() => {
    dispatch(setProps(props))
  }, [props, dispatch])

  /**
   * Render
   */
  return null
}

export default PropsContextFiller
