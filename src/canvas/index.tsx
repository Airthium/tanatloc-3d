import { useRef } from 'react'
import { Canvas as R3FCanvas } from '@react-three/fiber'

import { three } from '@tunnel'

import style from '@style/Canvas'

// Missing events
// See https://github.com/pmndrs/react-three-next/blob/v1.6.0/src/helpers/store.js

/**
 * Canvas
 * @returns Canvas
 */
const Canvas = () => {
  const ref = useRef<HTMLDivElement>(null!)

  /**
   * Render
   */
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto'
      }}
    >
      <R3FCanvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none'
        }}
        frameloop="demand"
        gl={{
          preserveDrawingBuffer: true,
          localClippingEnabled: true
        }}
        eventSource={ref}
        eventPrefix="client"
      >
        <three.Out />
      </R3FCanvas>
    </div>
  )
}

export default Canvas
