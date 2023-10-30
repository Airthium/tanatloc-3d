import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// FPS
const fps = 30

/**
 * Frame rate
 * @returns FrameRate
 */
const FrameRate = () => {
  // Data
  const { invalidate } = useThree()

  // Frame per second
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps)
    return () => {
      clearInterval(id)
    }
  }, [])

  return null
}

export default FrameRate