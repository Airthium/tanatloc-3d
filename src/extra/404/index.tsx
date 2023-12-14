import { useEffect, useMemo } from 'react'
import { Box, Cylinder } from '@react-three/drei'

import useStore from '@store'

/**
 * 404
 * @returns 404
 */
const _404 = () => {
  // Update store
  useEffect(() => {
    useStore.setState({ extra: { notFound: true } })

    return () => {
      useStore.setState({ extra: {} })
    }
  }, [])

  /**
   * Render
   */
  return null
}

/**
 * 404 render
 * @returns 404Render
 */
export const _404Render = () => {
  // Orange material
  const orange = useMemo(
    () => <meshPhysicalMaterial side={2} color="orange" />,
    []
  )

  // White material
  const white = useMemo(
    () => <meshPhysicalMaterial side={2} color="white" />,
    []
  )

  /**
   * Render
   */
  return (
    <mesh scale={0.1}>
      <Cylinder
        args={[0, 1, 3, 32, 1, true]}
        position={[0, 9 / 2 + 1.5 / 2 + 1.5 + 1.5 / 2 + 3, 0]}
      >
        {orange}
      </Cylinder>
      <Cylinder
        args={[1, 1.5, 1.5, 32, 1, true]}
        position={[0, 9 / 2 + 1.5 / 2 + 1.5 + 1.5, 0]}
      >
        {white}
      </Cylinder>
      <Cylinder
        args={[1.5, 2, 1.5, 32, 1, true]}
        position={[0, 9 / 2 + 1.5 / 2 + 1.5, 0]}
      >
        {orange}
      </Cylinder>
      <Cylinder
        args={[2, 2.5, 1.5, 32, 1, true]}
        position={[0, 9 / 2 + 1.5 / 2, 0]}
      >
        {white}
      </Cylinder>
      <Cylinder args={[2.5, 5.5, 9, 32, 1, true]} position={[0, 0, 0]}>
        {orange}
      </Cylinder>
      <Box args={[15, 0.25, 15, 32, 1]} position={[0, -9 / 2 - 0.25 / 2, 0]}>
        {orange}
      </Box>
    </mesh>
  )
}

export default _404
