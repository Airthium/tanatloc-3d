import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas as R3FCanvas } from '@react-three/fiber'
import { Hud, PerspectiveCamera, TrackballControls } from '@react-three/drei'
import { Button, notification } from 'antd'

import WebGL from 'three/examples/jsm/capabilities/WebGL'

import { Tanatloc3DCanvasProps } from '@index'

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

import { _404Render as NotFound } from '@extra/404'
import { BackgroundRender as Background } from '@extra/background'

import Parts from './parts'

import defaultStyle from '@style/Canvas'

/**
 * Canvas
 * @returns Canvas
 */
const Canvas: React.FunctionComponent<Tanatloc3DCanvasProps> = ({
  toWebGL
}) => {
  // Ref
  const mainViewControls = useRef(null!)

  // State
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(false)
  const [controlsUpdate, setControlsUpdate] = useState<number>(0)
  const [resize, setResize] = useState<number>(0)

  // Store
  const extra = useStore((s) => s.extra)
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

  // Check WebGL
  useEffect(() => {
    if (WebGL.isWebGL2Available()) setWebGLAvailable(true)
    else {
      setWebGLAvailable(false)
      notification.error({
        message: 'WebGL unavailable',
        description: (
          <>
            WebGL is not activated. Please have a look on{' '}
            {toWebGL ? (
              <Button onClick={toWebGL}>solutions</Button>
            ) : (
              'solutions'
            )}
          </>
        ),
        duration: 0
      })
    }
  }, [])

  // Events
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // Resize
  useEffect(() => {
    onResize()
  }, [style, onResize])

  /**
   * Render
   */
  if (!webGLAvailable) return null
  return (
    <R3FCanvas
      hidden={
        (!parts || parts.length === 0) && !extra.notFound && !extra.background
      }
      style={{ ...defaultStyle.canvas, ...style }}
      frameloop="demand"
      gl={{
        preserveDrawingBuffer: true,
        localClippingEnabled: true,
        logarithmicDepthBuffer: true
      }}
    >
      <FrameRate />
      <Hud renderPriority={1}>
        <MainStoreFiller controls={mainViewControls.current} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Grid update={controlsUpdate} />
        <ZoomToSelection />
        <SectionView />
        <TrackballControls
          ref={mainViewControls}
          onChange={onMainViewControls}
          noRotate={!extra.notFound && dimension !== 3}
        />
        <Light update={controlsUpdate} />
        <Point />
        {extra.notFound ? <NotFound /> : null}
        {extra.background ? <Background /> : null}
        {!extra.notFound && !extra.background ? <Parts /> : null}
      </Hud>
      <Hud renderPriority={2}>
        {extra.notFound || extra.background ? null : (
          <Navigation resize={resize} />
        )}
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
