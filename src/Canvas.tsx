import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Layout } from 'antd'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, TrackballControls, View } from '@react-three/drei'

import Provider, { Context, MyCanvasProps } from './context'
import MainContextFiller from './context/MainContextFiller'
import PropsContextFiller from './context/PropsContextFiller'

import Navigation from './helpers/navigation'
import Grid from './helpers/grid'
import ZoomToSelection from './helpers/zoomToSelection'
import SectionView from './helpers/sectionView'
import Colorbar from './helpers/colorbar'

import Header from './header'
import Parts from './Parts'

import style from './Canvas.module.css'

// TODO view with transparent background ?
// TODO auto zoom to fit at first part loaded

/**
 * MyCanvas
 * @returns MyCanvas
 */
const MyCanvas = (): React.JSX.Element => {
  // Ref
  const containerDiv = useRef(null!)
  const mainViewDiv = useRef(null!)
  const navigationViewDiv = useRef(null!)
  const colorbarViewDiv = useRef(null!)

  const mainView = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
  }>(null!)
  const mainViewControls = useRef(null!)

  // State
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)

  // Context
  const {
    props: { parts }
  } = useContext(Context)

  /**
   * On main view controls
   */
  const onMainViewControls = useCallback(() => {
    setControlsUpdate(Math.random())
  }, [])

  // At least one part
  const oneResult = useMemo(
    () => parts?.find((part) => part.summary.type === 'result'),
    [parts]
  )

  /**
   * Render
   */
  return (
    <Layout className={style.layout}>
      <Header />
      <div ref={containerDiv} className={style.container}>
        <div ref={mainViewDiv} className={style.mainView} />
        <div ref={navigationViewDiv} className={style.navigationView} />
        <div ref={colorbarViewDiv} className={style.colorbarView} />
        <Canvas
          eventSource={containerDiv}
          gl={{ preserveDrawingBuffer: true, localClippingEnabled: true }}
        >
          <View index={1} track={mainViewDiv} frames={1}>
            <MainContextFiller controls={mainViewControls.current} />
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Grid update={controlsUpdate} />
            <ZoomToSelection />
            <SectionView />
            <TrackballControls
              ref={mainViewControls}
              onChange={onMainViewControls}
            />
            <ambientLight />
            <pointLight
              position={mainView.current?.camera.position}
              decay={0}
            />
            <Parts />
          </View>
          <View index={2} track={navigationViewDiv} frames={1}>
            <Navigation update={controlsUpdate} />
          </View>
          {oneResult ? (
            <View index={3} track={colorbarViewDiv} frames={1}>
              <Colorbar />
            </View>
          ) : null}
        </Canvas>
      </div>
    </Layout>
  )
}

/**
 * MyCanvasWithContext
 * @returns MyCanvasWithContext
 */
const MyCanvasWithContext = (props: MyCanvasProps) => {
  /**
   * Render
   */
  return (
    <Provider>
      <PropsContextFiller {...props} />
      <MyCanvas />
    </Provider>
  )
}

export default MyCanvasWithContext
