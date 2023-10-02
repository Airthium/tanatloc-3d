import { useCallback, useContext } from 'react'
import {
  Button,
  Collapse,
  Divider,
  Dropdown,
  Layout,
  Switch,
  Tooltip
} from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  DownOutlined,
  FundProjectionScreenOutlined,
  RadiusUprightOutlined,
  SelectOutlined,
  ToolOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'

import { Context, MyCanvasPropsSnapshot } from '../context'
import {
  setGridVisible,
  setPartsTransparent,
  setZoomToSelectionEnabled
} from '../context/actions'

import zoomToFit from '../tools/zoomToFit'
import zoom from '../tools/zoom'

import style from './index.module.css'

// Snapshot keys
const projectSnapshotKey = 'projectSnapshot'
const exportSnapshotKey = 'exportSnapshot'

// Zoom in progress
let zoomInProgress: number | undefined = undefined

/**
 * Project snapshot
 * @param gl Renderer
 * @param scene Scene
 * @param camera Camera
 */
const projectSnapshot = (
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  propsSnapshotProject: MyCanvasPropsSnapshot['project']
) => {
  // Initial data
  const width = gl.domElement.width
  const height = gl.domElement.height
  const aspect = camera.aspect

  // Render
  const snapshotWidth = propsSnapshotProject?.size?.width ?? 2 * 260
  const snapshotHeight = propsSnapshotProject?.size?.height ?? 2 * 156

  gl.domElement.width = snapshotWidth
  gl.domElement.height = snapshotHeight

  camera.aspect = snapshotWidth / snapshotHeight
  camera.updateProjectionMatrix()

  gl.clear()
  gl.setViewport(0, 0, width, height)
  gl.render(scene, camera)

  // Image
  const image = gl.domElement.toDataURL('image/png')

  // Undo modification
  gl.domElement.width = width
  gl.domElement.height = height

  camera.aspect = aspect
  camera.updateProjectionMatrix()

  //API route
  propsSnapshotProject?.apiRoute(image).catch(console.error)
}

/**
 * Export snapshot
 * @param gl Renderer
 * @param scene Scene
 * @param camera Camera
 */
const exportSnapshot = (
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  // Initial data
  const width = gl.domElement.width
  const height = gl.domElement.height

  // Render
  gl.clear()
  gl.setViewport(0, 0, width, height)
  gl.render(scene, camera)

  // Image
  const image = gl.domElement.toDataURL('image/png')

  // Download
  const link = document.createElement('a')
  link.setAttribute(
    'download',
    'snapshot_' + new Date().toLocaleDateString() + '.png'
  )
  link.setAttribute('href', image.replace('image/png', 'image/octet-stream'))
  link.click()
}

/**
 * CollapseIcon
 * @returns CollapseIcon
 */
const CollapseIcon = () => (
  <Tooltip title="Tools">
    <DownOutlined style={{ fontSize: 16 }} />
    <ToolOutlined style={{ fontSize: 16 }} />
  </Tooltip>
)

/**
 * Header
 * @param props Props
 * @returns Header
 */
const Header = () => {
  // Context
  const { props, mainView, parts, grid, zoomToSelection, dispatch } =
    useContext(Context)

  /**
   * On Snapshot
   * @param { key } Key
   */
  const onSnapshot = useCallback(
    ({ key }: { key: string }): void => {
      if (!mainView.gl || !mainView.scene || !mainView.camera) return

      if (key === projectSnapshotKey) {
        projectSnapshot(
          mainView.gl,
          mainView.scene,
          mainView.camera,
          props.snapshot?.project
        )
      } else {
        exportSnapshot(mainView.gl, mainView.scene, mainView.camera)
      }
    },
    [mainView.gl, mainView.scene, mainView.camera, props.snapshot?.project]
  )

  /**
   * On export snapshot
   */
  const onExportSnapshot = useCallback((): void => {
    if (!mainView.gl || !mainView.scene || !mainView.camera) return

    exportSnapshot(mainView.gl, mainView.scene, mainView.camera)
  }, [mainView.gl, mainView.scene, mainView.camera])

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
  const onZoomIn = useCallback(() => {
    zoom(mainView.camera, mainView.controls, 1)
    zoomInProgress = requestAnimationFrame(() => onZoomIn())
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
    zoomInProgress = requestAnimationFrame(() => onZoomOut())
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
    dispatch(setZoomToSelectionEnabled(!zoomToSelection.enabled))
  }, [zoomToSelection.enabled, dispatch])

  /**
   * Render
   */
  return (
    <Layout.Header className={style.header}>
      <Collapse
        expandIcon={CollapseIcon}
        items={[
          {
            key: 'tools',
            children: [
              <Tooltip key="snapshot" title="Take snapshot" placement="left">
                {props.snapshot?.project ? (
                  <Dropdown
                    placement="bottom"
                    menu={{
                      onClick: onSnapshot,
                      items: [
                        {
                          key: projectSnapshotKey,
                          title:
                            'This snapshot will appear on your project card',
                          label: 'Project snapshot'
                        },
                        {
                          key: exportSnapshotKey,
                          title: 'Take a snapshot and export it',
                          label: 'Export image'
                        }
                      ]
                    }}
                  >
                    <Button icon={<FundProjectionScreenOutlined />} />
                  </Dropdown>
                ) : (
                  <Button
                    icon={<FundProjectionScreenOutlined />}
                    onClick={onExportSnapshot}
                  />
                )}
              </Tooltip>,
              <Divider key="divider-1" />,
              <Tooltip key="grid" title="Display grid" placement="left">
                <Switch
                  checked={grid.visible}
                  checkedChildren={<BorderlessTableOutlined />}
                  unCheckedChildren={<BorderlessTableOutlined />}
                  onChange={toggleGridVisible}
                />
              </Tooltip>,
              <Tooltip key="transparency" title="Transparency" placement="left">
                <Switch
                  checked={parts.transparent}
                  checkedChildren={<RadiusUprightOutlined />}
                  unCheckedChildren={<RadiusUprightOutlined />}
                  onChange={toggleTransparency}
                />
              </Tooltip>,
              <Divider key="divider-2" />,
              <Tooltip key="zoom-in" title="Zoom in" placement="left">
                <Button
                  icon={<ZoomInOutlined />}
                  onMouseDown={onZoomIn}
                  onMouseUp={onZoomStop}
                  onMouseOut={onZoomStop}
                />
              </Tooltip>,
              <Tooltip key="zoom-to-fit" title="Zoom to fit" placement="left">
                <Button icon={<CompressOutlined />} onClick={onZoomToFit} />
              </Tooltip>,
              <Tooltip key="zoom-out" title="Zoom out" placement="left">
                <Button
                  icon={<ZoomOutOutlined />}
                  onMouseDown={onZoomOut}
                  onMouseUp={onZoomStop}
                  onMouseOut={onZoomStop}
                />
              </Tooltip>,
              <Tooltip
                key="zoom-to-selection"
                title="Zoom to selection"
                placement="left"
              >
                <Button
                  type={zoomToSelection.enabled ? 'primary' : 'default'}
                  icon={<SelectOutlined />}
                  onClick={onZoomToSelection}
                />
              </Tooltip>,
              <Divider key="divider-3" />
            ]
          }
        ]}
      ></Collapse>
    </Layout.Header>
  )
}

export default Header
