import { ReactNode, useCallback } from 'react'
import { Button, Tooltip } from 'antd'
import {
  CompressOutlined,
  SelectOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'

import useStore from '@store'

import zoomToFit from '@tools/zoomToFit'
import zoom from '@tools/zoom'

// Zoom in progress
let zoomInProgress: number | undefined = undefined

/**
 * Zoom
 * @returns Zoom
 */
const Zoom = (): ReactNode => {
  // Store
  const mainView = useStore((s) => s.mainView)
  const zoomToSelection = useStore((s) => s.zoomToSelection)

  /**
   * Zoom in
   */
  const onZoomIn = useCallback(() => {
    zoom(mainView.camera, mainView.controls, 1)
    zoomInProgress = requestAnimationFrame(onZoomIn)
  }, [mainView.camera, mainView.controls])

  /**
   * Zoom to fit
   */
  const onZoomToFit = useCallback(
    () => zoomToFit(mainView.scene, mainView.camera, mainView.controls),
    [mainView.scene, mainView.camera, mainView.controls]
  )

  /**
   * Zoom out
   */
  const onZoomOut = useCallback(() => {
    zoom(mainView.camera, mainView.controls, -1)
    zoomInProgress = requestAnimationFrame(onZoomOut)
  }, [mainView.camera, mainView.controls])

  /**
   * Zoom stop
   */
  const onZoomStop = useCallback(() => {
    if (zoomInProgress) cancelAnimationFrame(zoomInProgress)
    zoomInProgress = undefined
  }, [])

  /**
   * On zoom to selection
   */
  const onZoomToSelection = useCallback(() => {
    useStore.setState({
      zoomToSelection: {
        ...zoomToSelection,
        enabled: !zoomToSelection.enabled
      }
    })
  }, [zoomToSelection])

  /**
   * Render
   */
  return (
    <>
      <Tooltip title="Zoom in" placement="left">
        <Button
          icon={<ZoomInOutlined />}
          onMouseDown={onZoomIn}
          onMouseUp={onZoomStop}
          onMouseOut={onZoomStop}
        />
      </Tooltip>
      <Tooltip title="Zoom to fit" placement="left">
        <Button icon={<CompressOutlined />} onClick={onZoomToFit} />
      </Tooltip>

      <Tooltip title="Zoom out" placement="left">
        <Button
          icon={<ZoomOutOutlined />}
          onMouseDown={onZoomOut}
          onMouseUp={onZoomStop}
          onMouseOut={onZoomStop}
        />
      </Tooltip>
      <Tooltip title="Zoom to selection" placement="left">
        <Button
          type={zoomToSelection.enabled ? 'primary' : 'default'}
          icon={<SelectOutlined />}
          onClick={onZoomToSelection}
        />
      </Tooltip>
    </>
  )
}

export default Zoom
