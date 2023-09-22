import { useCallback, useRef, useState } from 'react'
import { Layout, Switch, Tooltip } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import {
  BorderlessTableOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, TrackballControls, View } from '@react-three/drei'

import Navigation from './helpers/NavigationHelper'
import Grid from './helpers/Grid'

import style from './Canvas.module.css'

const MyCanvas = (): React.JSX.Element => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null!)
  const mainViewRef = useRef<HTMLDivElement>(null!)
  const mainViewCamera = useRef<THREE.PerspectiveCamera>(null!)
  const navigationViewRef = useRef<HTMLDivElement>(null!)

  // State
  const [gridVisible, setGridVisible] = useState<boolean>(true)
  const [transparent, setTransparent] = useState<boolean>(false)
  const [navigationRotation, setNavigationRotation] = useState<THREE.Euler>()

  /**
   * On main view controls
   */
  const onMainViewControls = useCallback(() => {
    const rotation = mainViewCamera.current.rotation
    setNavigationRotation(rotation)
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

  /**
   * Render
   */
  return (
    <Layout className={style.layout}>
      <Layout.Header className={style.header}>
        <Tooltip title='Display grid'>
          <Switch
            checked={gridVisible}
            checkedChildren={<BorderlessTableOutlined />}
            unCheckedChildren={<BorderlessTableOutlined />}
            onChange={toggleGridVisible}
          />
        </Tooltip>
        <Tooltip title='Transparency'>
          <Switch
            checked={transparent}
            checkedChildren={<RadiusUprightOutlined />}
            unCheckedChildren={<RadiusUprightOutlined />}
            onChange={toggleTransparency}
          />
        </Tooltip>
      </Layout.Header>
      <div ref={containerRef} className={style.container}>
        <div ref={mainViewRef} className={style.mainView} />
        <div ref={navigationViewRef} className={style.navigationView} />
        <Canvas eventSource={containerRef}>
          <View index={1} track={mainViewRef}>
            <PerspectiveCamera
              ref={mainViewCamera}
              makeDefault
              position={[0, 0, 5]}
            />
            <Grid visible={gridVisible} />
            <TrackballControls onChange={onMainViewControls} />
            <ambientLight />
            <mesh>
              <coneGeometry />
              <meshStandardMaterial
                color={'blue'}
                transparent
                opacity={transparent ? 0.5 : 1}
              />
            </mesh>
          </View>
          <View index={2} track={navigationViewRef}>
            <Navigation
              mainViewCamera={mainViewCamera.current}
              rotation={navigationRotation}
            />
          </View>
        </Canvas>
      </div>
    </Layout>
  )
}

export default MyCanvas
