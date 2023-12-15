import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

import useStore from '@store'

/**
 * Frame rate
 * @returns FrameRate
 */
const FrameRate: React.FunctionComponent = () => {
  // Store
  const {
    frameRate: { fps }
  } = useStore((s) => s.settings)

  // Data
  const { invalidate } = useThree()

  // Frame per second
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps)
    return () => {
      clearInterval(id)
    }
  }, [fps, invalidate])

  return null
}

export default FrameRate
