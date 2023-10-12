import { useContext, useEffect } from 'react'

import { Context, MyCanvasProps } from '.'
import {
  setPropsData,
  setPropsFilters,
  setPropsParts,
  setPropsSnapshotProject
} from './actions'

/**
 * Props context filler
 * @param props Props
 * @returns PropsContextFiller
 */
const PropsContextFiller = (props: MyCanvasProps): null => {
  // Context
  const { dispatch } = useContext(Context)

  // Set parts
  useEffect(() => {
    dispatch(setPropsParts(props.parts))
  }, [props.parts, dispatch])

  // Data
  useEffect(() => {
    dispatch(setPropsData(props.data))
  }, [props.data, dispatch])

  // Filters
  useEffect(() => {
    dispatch(setPropsFilters(props.filters))
  }, [props.filters, dispatch])

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
