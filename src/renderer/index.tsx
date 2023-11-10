import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ConfigProvider, Layout, ThemeConfig } from 'antd'
import { Hud, PerspectiveCamera, TrackballControls } from '@react-three/drei'

import { Tanatloc3DRendererProps } from '@index'

import { three } from '@tunnel'

import { Context as CanvasContext } from '@context/canvas'
import { setChildren } from '@context/canvas/action'

import Provider, { Context } from '@context/renderer'
import MainContextFiller from '@context/renderer/mainContextFiller'
import PropsContextFiller from '@context/renderer/propsContextFiller'

import FrameRate from '@helpers/frameRate'
import Navigation from '@helpers/navigation'
import Grid from '@helpers/grid'
import ZoomToSelection from '@helpers/zoomToSelection'
import SectionView from '@helpers/sectionView'
import Colorbar from '@helpers/colorbar'
import Light from '@helpers/light'

import Header from '@header'
import Parts from './parts'

import style from '@style/Renderer'

/**
 * Renderer
 * @returns Renderer
 */
export const Renderer = (): React.JSX.Element => {
  // Ref
  const mainViewControls = useRef(null!)

  // State
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)
  const [resize, setResize] = useState<number>(0)

  // Context
  const {
    props: { parts },
    geometry: { dimension }
  } = useContext(Context)
  const { dispatch } = useContext(CanvasContext)

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

  // Canvas fill
  useEffect(() => {
    dispatch(
      setChildren([
        <FrameRate key="framRate" />,
        <Hud renderPriority={1} key="mainView">
          <MainContextFiller controls={mainViewControls.current} />
          <PerspectiveCamera
            makeDefault
            position={dimension === 3 ? [1, 1, 5] : [0, 0, 5]}
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
        </Hud>,
        <Hud renderPriority={2} key="navigation">
          <Navigation update={controlsUpdate} resize={resize} />
        </Hud>,
        oneResult ? (
          <Hud renderPriority={3} key="colorbar">
            <Colorbar resize={resize} />
          </Hud>
        ) : null
      ])
    )
  })

  /**
   * Render
   */
  return (
    <Layout style={style.layout}>
      <Header oneResult={oneResult} />
      <three.In>
        <FrameRate />
        <Hud renderPriority={1}>
          <MainContextFiller controls={mainViewControls.current} />
          <PerspectiveCamera
            makeDefault
            position={dimension === 3 ? [1, 1, 5] : [0, 0, 5]}
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
      </three.In>
    </Layout>
  )
}

/**
 * Renderer with context
 * @returns RendererWithContext
 */
const RendererWithContext = (
  props: Tanatloc3DRendererProps & { theme?: ThemeConfig }
) => {
  /**
   * Render
   */
  return (
    <ConfigProvider theme={props.theme}>
      <Provider>
        <PropsContextFiller {...props} />
        <Renderer />
      </Provider>
    </ConfigProvider>
  )
}

export default RendererWithContext
