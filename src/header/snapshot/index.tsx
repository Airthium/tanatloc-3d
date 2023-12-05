import { ReactNode, useCallback } from 'react'
import { Button, Dropdown, Tooltip } from 'antd'
import { FundProjectionScreenOutlined } from '@ant-design/icons'

import { Tanatloc3DRendererPropsSnapshot } from '@index'

import useStore from '@store'

// Snapshot keys
const projectSnapshotKey = 'projectSnapshot'
const exportSnapshotKey = 'exportSnapshot'

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
  propsSnapshotProject: Tanatloc3DRendererPropsSnapshot['project']
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
  gl.setViewport(0, 0, snapshotWidth, snapshotHeight)
  gl.render(scene, camera)

  // Image
  const image = gl.domElement.toDataURL('image/png')

  // Undo modification
  gl.domElement.width = width
  gl.domElement.height = height

  camera.aspect = aspect
  camera.updateProjectionMatrix()

  gl.clear()
  gl.setViewport(0, 0, width, height)
  gl.render(scene, camera)

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
 * Snapshot
 * @returns Snapshot
 */
const Snapshot = (): ReactNode => {
  // Store
  const props = useStore((s) => s.props)
  const { camera, gl, scene } = useStore((s) => s.mainView)

  /**
   * On Snapshot
   * @param { key } Key
   */
  const onSnapshot = useCallback(
    ({ key }: { key: string }): void => {
      if (!gl || !scene || !camera) return

      if (key === projectSnapshotKey) {
        projectSnapshot(gl, scene, camera, props.snapshot?.project)
      } else {
        exportSnapshot(gl, scene, camera)
      }
    },
    [gl, scene, camera, props.snapshot?.project]
  )

  /**
   * On export snapshot
   */
  const onExportSnapshot = useCallback((): void => {
    if (!gl || !scene || !camera) return

    exportSnapshot(gl, scene, camera)
  }, [gl, scene, camera])

  /**
   * Render
   */
  return (
    <Tooltip title="Take snapshot" placement="left">
      {props.snapshot?.project ? (
        <Dropdown
          placement="bottom"
          menu={{
            onClick: onSnapshot,
            items: [
              {
                key: projectSnapshotKey,
                title: 'This snapshot will appear on your project card',
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
    </Tooltip>
  )
}

export default Snapshot
