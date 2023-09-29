import { useContext, useEffect } from 'react'

import { Context, MyCanvasProps } from '.'
import { setPropsSnapshotProject } from './actions'

/**
 * Props context filler
 * @param props Props
 * @returns PropsContextFiller
 */
const PropsContextFiller = (props: MyCanvasProps): null => {
  // Context
  const { dispatch } = useContext(Context)

  // Set snapshot project
  useEffect(() => {
    dispatch(setPropsSnapshotProject(props.snapshot?.project))
  }, [props.snapshot?.project, dispatch])

  /**
   * Render
   */
  return null
}

export default PropsContextFiller
