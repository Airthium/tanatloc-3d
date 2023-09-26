import { useCallback, useRef, useState } from 'react'
import { Button, Layout, Switch, Tooltip } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, TrackballControls, View } from '@react-three/drei'

import ViewWithRef from './helpers/ViewWithRef'
import Navigation from './helpers/NavigationHelper'
import Grid from './helpers/Grid'

import _zoomToFit from './tools/zoomToFit'

import style from './Canvas.module.css'

const MyCanvas = (): React.JSX.Element => {
  // Ref
  const containerDiv = useRef(null!)
  const mainViewDiv = useRef(null!)
  const navigationViewDiv = useRef(null!)

  const mainView = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
  }>(null!)
  const mainViewControls = useRef(null!)

  // State
  const [gridVisible, setGridVisible] = useState<boolean>(true)
  const [transparent, setTransparent] = useState<boolean>(false)

  const [navigationUpdate, setNavigationUpdate] = useState<number>(0)

  /**
   * On main view controls
   */
  const onMainViewControls = useCallback(() => {
    setNavigationUpdate(Math.random())
  }, [])

  /**
   * Toggle grid visibility
   * @param e Event
   */
  const toggleGridVisible: SwitchChangeEventHandler = useCallback((e): void => {
    const visible = e.valueOf()
    setGridVisible(visible)
  }, [])

  /**
   * Toggle transparency
   * @param e Event
   */
  const toggleTransparency: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const transparent = e.valueOf()
      setTransparent(transparent)
    },
    []
  )

  const zoomToFit = () =>
    _zoomToFit(
      mainView.current.scene,
      mainView.current.camera,
      mainViewControls.current
    )

  /**
   * Render
   */
  return (
    <Layout className={style.layout}>
      <Layout.Header className={style.header}>
        <Tooltip title='Display grid' placement='left'>
          <Switch
            checked={gridVisible}
            checkedChildren={<BorderlessTableOutlined />}
            unCheckedChildren={<BorderlessTableOutlined />}
            onChange={toggleGridVisible}
          />
        </Tooltip>
        <Tooltip title='Transparency' placement='left'>
          <Switch
            checked={transparent}
            checkedChildren={<RadiusUprightOutlined />}
            unCheckedChildren={<RadiusUprightOutlined />}
            onChange={toggleTransparency}
          />
        </Tooltip>
        <Tooltip title='Zoom to fit' placement='left'>
          <Button icon={<CompressOutlined />} onClick={zoomToFit} />
        </Tooltip>
      </Layout.Header>
      <div ref={containerDiv} className={style.container}>
        <div ref={mainViewDiv} className={style.mainView} />
        <div ref={navigationViewDiv} className={style.navigationView} />
        <Canvas eventSource={containerDiv}>
          <ViewWithRef index={1} ref={mainView} track={mainViewDiv}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Grid visible={gridVisible} />
            <TrackballControls
              ref={mainViewControls}
              onChange={onMainViewControls}
            />
            <ambientLight />
            <pointLight
              position={mainView.current?.camera.position}
              decay={0}
            />
            {/* <mesh>
              <coneGeometry />
              <meshStandardMaterial
                color={'blue'}
                transparent
                opacity={transparent ? 0.5 : 1}
              />
            </mesh> */}
            <mesh>
              <torusKnotGeometry />
              <meshPhysicalMaterial
                color={'blue'}
                transparent
                opacity={transparent ? 0.5 : 1}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          </ViewWithRef>
          <View index={2} track={navigationViewDiv}>
            <Navigation
              mainView={mainView.current}
              mainViewControls={mainViewControls.current}
              update={navigationUpdate}
            />
          </View>
        </Canvas>
      </div>
    </Layout>
  )
}

export default MyCanvas
