import { useCallback, useContext } from 'react'
import { Button, Layout, Switch, Tooltip } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  RadiusUprightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'

import { Context } from '../context'
import { setGridVisible, setPartsTransparent } from '../context/actions'

import _zoomToFit from '../tools/zoomToFit'
import zoom from '../tools/zoom'

import style from './index.module.css'

let zoomInProgress: number | undefined = undefined

/**
 * Header
 * @param props Props
 * @returns Header
 */
const Header = () => {
  // Context
  const { mainView, parts, grid, dispatch } = useContext(Context)

  /**
   * Toggle grid visibility
   * @param e Event
   */
  const toggleGridVisible: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const visible = e.valueOf()
      dispatch(setGridVisible(visible))
    },
    [dispatch]
  )

  /**
   * Toggle transparency
   * @param e Event
   */
  const toggleTransparency: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const transparent = e.valueOf()
      dispatch(setPartsTransparent(transparent))
    },
    [dispatch]
  )

  /**
   * Zoom in
   */
  const zoomIn = useCallback(() => {
    zoom(mainView.camera, mainView.controls, 1)
    zoomInProgress = requestAnimationFrame(() => zoomIn())
  }, [mainView.camera, mainView.controls])

  /**
   * Zoom to fit
   */
  const zoomToFit = useCallback(
    () => _zoomToFit(mainView.scene, mainView.camera, mainView.controls),
    [mainView.scene, mainView.camera, mainView.controls]
  )

  /**
   * Zoom out
   */
  const zoomOut = useCallback(() => {
    zoom(mainView.camera, mainView.controls, -1)
    zoomInProgress = requestAnimationFrame(() => zoomOut())
  }, [mainView.camera, mainView.controls])

  const zoomStop = useCallback(() => {
    if (zoomInProgress) cancelAnimationFrame(zoomInProgress)
    zoomInProgress = undefined
  }, [])

  /**
   * Render
   */
  return (
    <Layout.Header className={style.header}>
      <Tooltip title="Display grid" placement="left">
        <Switch
          checked={grid.visible}
          checkedChildren={<BorderlessTableOutlined />}
          unCheckedChildren={<BorderlessTableOutlined />}
          onChange={toggleGridVisible}
        />
      </Tooltip>
      <Tooltip title="Transparency" placement="left">
        <Switch
          checked={parts.transparent}
          checkedChildren={<RadiusUprightOutlined />}
          unCheckedChildren={<RadiusUprightOutlined />}
          onChange={toggleTransparency}
        />
      </Tooltip>
      <Tooltip title="Zoom in" placement="left">
        <Button
          icon={<ZoomInOutlined />}
          onMouseDown={zoomIn}
          onMouseUp={zoomStop}
          onMouseOut={zoomStop}
        />
      </Tooltip>
      <Tooltip title="Zoom to fit" placement="left">
        <Button icon={<CompressOutlined />} onClick={zoomToFit} />
      </Tooltip>
      <Tooltip title="Zoom out" placement="left">
        <Button
          icon={<ZoomOutOutlined />}
          onMouseDown={zoomOut}
          onMouseUp={zoomStop}
          onMouseOut={zoomStop}
        />
      </Tooltip>
    </Layout.Header>
  )
}

export default Header
