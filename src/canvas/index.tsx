import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Canvas as R3FCanvas } from '@react-three/fiber'
import { Hud, PerspectiveCamera, TrackballControls } from '@react-three/drei'

import useStore from '@store'
import MainStoreFiller from '@store/mainStoreFiller'

import FrameRate from '@helpers/frameRate'
import Navigation from '@helpers/navigation'
import Grid from '@helpers/grid'
import ZoomToSelection from '@helpers/zoomToSelection'
import SectionView from '@helpers/sectionView'
import ComputeLut from '@helpers/computeLut'
import Colorbar from '@helpers/colorbar'
import Light from '@helpers/light'
import Point from '@helpers/point'

import Parts from './parts'

import defaultStyle from '@style/Canvas'

/**
 * Canvas
 * @returns Canvas
 */
const Canvas = (): ReactNode => {
  // Ref
  const mainViewControls = useRef(null!)

  // State
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)
  const [resize, setResize] = useState<number>(0)

  // Store
  const { parts, style } = useStore((s) => s.props)
  const { dimension } = useStore((s) => s.geometry)

  /**
   * On main view controls
   */
  const onMainViewControls = useCallback(() => {
    setControlsUpdate(Math.random())
  }, [])

  // At least one part
  const oneResult = useMemo(
    () => !!parts?.find((part) => part.summary.type === 'result'),
    [parts]
  )

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    setResize(Math.random())
  }, [])

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
    <R3FCanvas
      hidden={!parts || parts.length === 0}
      style={{ ...defaultStyle.canvas, ...style }}
      frameloop="demand"
      gl={{
        preserveDrawingBuffer: true,
        localClippingEnabled: true
      }}
    >
      <FrameRate />
      <Hud renderPriority={1}>
        <MainStoreFiller controls={mainViewControls.current} />
        <PerspectiveCamera makeDefault position={[1, 1, 5]} />
        <Grid update={controlsUpdate} />
        <ZoomToSelection />
        <SectionView />
        <TrackballControls
          ref={mainViewControls}
          onChange={onMainViewControls}
          noRotate={dimension !== 3}
        />
        <Light update={controlsUpdate} />
        <Point />
        <Parts />
      </Hud>
      <Hud renderPriority={2}>
        <Navigation resize={resize} />
      </Hud>
      {oneResult ? (
        <Hud renderPriority={3}>
          <ComputeLut />
          <Colorbar resize={resize} />
        </Hud>
      ) : null}
    </R3FCanvas>
  )
}

export default Canvas
