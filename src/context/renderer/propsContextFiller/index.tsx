import { useContext, useEffect } from 'react'

import { Tanatloc3DRendererProps } from '@index'

import { Context } from '@context/renderer'
import {
  setPropsData,
  setPropsPostProcessing,
  setPropsOnData,
  setPropsOnHighlight,
  setPropsOnPostprocessing,
  setPropsOnSelect,
  setPropsParts,
  setPropsSelection,
  setPropsSnapshotProject
} from '@context/renderer/actions'

/**
 * Props context filler
 * @param props Props
 * @returns PropsContextFiller
 */
const PropsContextFiller = (props: Tanatloc3DRendererProps): null => {
  // Context
  const { dispatch } = useContext(Context)

  // Set parts
  useEffect(() => {
    dispatch(setPropsParts(props.parts))
  }, [props.parts, dispatch])

  // Selection
  useEffect(() => {
    dispatch(setPropsSelection(props.selection))
  }, [props.selection, dispatch])

  // Data
  useEffect(() => {
    dispatch(setPropsData(props.data))
  }, [props.data, dispatch])

  // Post-processing
  useEffect(() => {
    dispatch(setPropsPostProcessing(props.postProcessing))
  }, [props.postProcessing, dispatch])

  // Set snapshot project
  useEffect(() => {
    dispatch(setPropsSnapshotProject(props.snapshot?.project))
  }, [props.snapshot?.project, dispatch])

  // On highlight
  useEffect(() => {
    dispatch(setPropsOnHighlight(props.onHighlight))
  }, [props.onHighlight, dispatch])

  // On select
  useEffect(() => {
    dispatch(setPropsOnSelect(props.onSelect))
  }, [props.onSelect, dispatch])

  // On data
  useEffect(() => {
    dispatch(setPropsOnData(props.onData))
  }, [props.onData, dispatch])

  // On post-processing
  useEffect(() => {
    dispatch(setPropsOnPostprocessing(props.onPostProcessing))
  }, [props.onPostProcessing, dispatch])

  /**
   * Render
   */
  return null
}

export default PropsContextFiller