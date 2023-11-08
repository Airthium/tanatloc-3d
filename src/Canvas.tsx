import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ConfigProvider, Layout, ThemeConfig } from 'antd'
import { Canvas } from '@react-three/fiber'
import { Hud, PerspectiveCamera, TrackballControls } from '@react-three/drei'

import { Tanatloc3DProps } from '..'

import Provider, { Context } from './context'
import MainContextFiller from './context/mainContextFiller'
import PropsContextFiller from './context/propsContextFiller'

import FrameRate from './helpers/frameRate'
import Navigation from './helpers/navigation'
import Grid from './helpers/grid'
import ZoomToSelection from './helpers/zoomToSelection'
import SectionView from './helpers/sectionView'
import Colorbar from './helpers/colorbar'
import Light from './helpers/light'

import Header from './header'
import Parts from './Parts'

import style from './style/Canvas'

/**
 * Tanatloc3D
 * @returns Tanatloc3D
 */
export const Tanatloc3D = (): React.JSX.Element => {
  // Ref
  const containerDiv = useRef(null!)
  const mainViewControls = useRef(null!)

  // State
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)
  const [resize, setResize] = useState<number>(0)

  // Context
  const {
    props: { parts },
    geometry: { dimension }
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
    () => !!parts?.find((part) => part.summary.type === 'result'),
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
    <Layout style={style.layout}>
      <Header oneResult={oneResult} />
      <div ref={containerDiv} style={style.container}>
        <Canvas
          frameloop="demand"
          // eventSource={containerDiv} // needed for section view ? // Bug on hot reload
          gl={{
            preserveDrawingBuffer: true,
            localClippingEnabled: true
          }}
        >
          <FrameRate />
          <Hud renderPriority={1}>
            <MainContextFiller controls={mainViewControls.current} />
            <PerspectiveCamera
              makeDefault
              position={dimension === 3 ? [-1, -1, -5] : [0, 0, -5]}
            />
            <Grid update={controlsUpdate} />
            <ZoomToSelection />
            <SectionView />
            <TrackballControls
              ref={mainViewControls}
              onChange={onMainViewControls}
              noRotate={dimension !== 3}
            />
            <Light update={controlsUpdate} />
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
 * Tanatloc3DWithContext
 * @returns Tanatloc3DWithContext
 */
const Tanatloc3DWithContext = (
  props: Tanatloc3DProps & { theme?: ThemeConfig }
) => {
  /**
   * Render
   */
  return (
    <ConfigProvider theme={props.theme}>
      <Provider>
        <PropsContextFiller {...props} />
        <Tanatloc3D />
      </Provider>
    </ConfigProvider>
  )
}

export default Tanatloc3DWithContext
