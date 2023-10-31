import { useContext, useEffect } from 'react'
import { useThree } from '@react-three/fiber'

import { Context } from '../../context'

/**
 * Frame rate
 * @returns FrameRate
 */
const FrameRate = () => {
  // Context
  const {
    settings: {
      frameRate: { fps }
    }
  } = useContext(Context)

  // Data
  const { invalidate } = useThree()

  // Frame per second
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps)
    return () => {
      clearInterval(id)
    }
  }, [fps])

  return null
}

export default FrameRate
