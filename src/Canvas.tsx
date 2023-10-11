import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Layout } from 'antd'
import { Canvas } from '@react-three/fiber'
import { Hud, PerspectiveCamera, TrackballControls } from '@react-three/drei'

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

// TODO auto zoom to fit at first part loaded

/**
 * MyCanvas
 * @returns MyCanvas
 */
const MyCanvas = (): React.JSX.Element => {
  // Ref
  const containerDiv = useRef(null!)

  const mainView = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
  }>(null!)
  const mainViewControls = useRef(null!)

  // State
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)
  const [resize, setResize] = useState<number>(0)

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

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    setResize(Math.random())
  }, [])

  // At least one part
  const oneResult = useMemo(
    () => parts?.find((part) => part.summary.type === 'result'),
    [parts]
  )

  // Events
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  /**
   * Render
   */
  return (
    <Layout className={style.layout}>
      <Header />
      <div ref={containerDiv} className={style.container}>
        <Canvas
          eventSource={containerDiv}
          gl={{ preserveDrawingBuffer: true, localClippingEnabled: true }}
        >
          <Hud renderPriority={1}>
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
          </Hud>

          <Hud renderPriority={2}>
            <Navigation update={controlsUpdate} resize={resize} />
          </Hud>

          {oneResult ? (
            <Hud renderPriority={3}>
              <Colorbar resize={resize} />
            </Hud>
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
