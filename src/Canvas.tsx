import { useCallback, useContext, useRef, useState } from 'react'
import { Layout } from 'antd'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, TrackballControls, View } from '@react-three/drei'

import Provider, { Context } from './context'
import ContextFiller from './context/ContextFiller'

import Navigation from './helpers/navigation'
import Grid from './helpers/grid'

import Header from './header'

import style from './Canvas.module.css'

/**
 * MyCanvas
 * @returns MyCanvas
 */
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

  // Context
  const { parts, grid } = useContext(Context)

  // State
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)

  /**
   * On main view controls
   */
  const onMainViewControls = useCallback(() => {
    setControlsUpdate(Math.random())
  }, [])

  /**
   * Render
   */
  return (
    <Layout className={style.layout}>
      <Header />
      <div ref={containerDiv} className={style.container}>
        <div ref={mainViewDiv} className={style.mainView} />
        <div ref={navigationViewDiv} className={style.navigationView} />
        <Canvas eventSource={containerDiv}>
          <View index={1} track={mainViewDiv}>
            <ContextFiller controls={mainViewControls.current} />
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Grid visible={grid.visible} update={controlsUpdate} />
            <TrackballControls
              ref={mainViewControls}
              onChange={onMainViewControls}
            />
            <ambientLight />
            <pointLight
              position={mainView.current?.camera.position}
              decay={0}
            />
            <mesh position={[13, 0, 0]}>
              <coneGeometry />
              <meshStandardMaterial
                color={'blue'}
                transparent
                opacity={parts.transparent ? 0.5 : 1}
              />
            </mesh>
            <mesh position={[-1, -5, 0]}>
              <torusKnotGeometry />
              <meshPhysicalMaterial
                color={'blue'}
                transparent
                opacity={parts.transparent ? 0.5 : 1}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          </View>
          <View index={2} track={navigationViewDiv}>
            <Navigation update={controlsUpdate} />
          </View>
        </Canvas>
      </div>
    </Layout>
  )
}

/**
 * MyCanvasWithContext
 * @returns MyCanvasWithContext
 */
const MyCanvasWithContext = () => {
  /**
   * Render
   */
  return (
    <Provider>
      <MyCanvas />
    </Provider>
  )
}

export default MyCanvasWithContext
