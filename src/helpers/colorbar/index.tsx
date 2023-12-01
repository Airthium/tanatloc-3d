import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Line, OrthographicCamera, Text } from '@react-three/drei'
import { Float32BufferAttribute } from 'three'

import { Lut } from 'three/examples/jsm/math/Lut.js'

import useStore from '@store'

import toReadable from '@tools/toReadable'

/**
 * Props
 */
export interface ColorbarProps {
  resize?: number
}

export interface LabelProps {
  position: [number, number, number]
  value: number
}

// Size
const size = 10

/**
 * Label
 * @param props props
 * @returns Label
 */
const Label = ({ position, value }: LabelProps): ReactNode => {
  /**
   * Render
   */
  return (
    <>
      <Text
        position={position}
        color={'gray'}
        fontSize={0.4}
        anchorX={'center'}
      >
        {toReadable(value)}
      </Text>
      <Line
        points={[
          [position[0], -0.2, 1],
          [position[0], 0.2, 1]
        ]}
        color={'gray'}
      />
    </>
  )
}

/**
 * Colorbar
 * @returns Colorbar
 */
const Colorbar = ({ resize }: ColorbarProps): ReactNode => {
  // Ref
  const ref = useRef<THREE.Mesh>(null!)

  // State
  const [aspectRatio, setAspectRatio] = useState<number>(1)

  // Store
  const mainView = useStore((s) => s.mainView)
  const lut = useStore((s) => s.lut)

  // Vertex colors
  useEffect(() => {
    const geometry = ref.current.geometry

    const lookUpTable = new Lut(lut.colormap)
    lookUpTable.setMin(-(size - 1) / 2)
    lookUpTable.setMax((size - 1) / 2)

    const position = geometry.getAttribute('position')

    const colors = new Float32Array(position.count * position.itemSize)
    for (let i = 0; i < position.count; ++i) {
      const color = lookUpTable.getColor(position.array[3 * i + 0])

      colors[3 * i + 0] = color.r
      colors[3 * i + 1] = color.g
      colors[3 * i + 2] = color.b
    }
    ref.current.geometry.setAttribute(
      'color',
      new Float32BufferAttribute(colors, 3)
    )
  }, [lut.colormap])

  // Aspect ratio (main camera)
  useEffect(() => {
    if (!mainView.camera) return
    setAspectRatio(mainView.camera.aspect)
  }, [mainView.camera, resize])

  // Camera position
  const cameraPosition: [number, number, number] = useMemo(
    () => [0, -(size - 0.75), 0],
    []
  )

  // Min
  const min = useMemo(() => {
    const min = lut.customMin ?? lut.min
    return min === Infinity ? -1 : min
  }, [lut.min, lut.customMin])

  // Max
  const max = useMemo(() => {
    const max = lut.customMax ?? lut.max
    return max === -Infinity ? 1 : max
  }, [lut.max, lut.customMax])

  // Range
  const range = useMemo(() => max - min, [min, max])

  /**
   * Render
   */
  return (
    <group type="Colorbar">
      <OrthographicCamera
        makeDefault
        left={-aspectRatio * size}
        right={aspectRatio * size}
        top={size}
        bottom={-size}
        near={-size}
        far={size}
        position={cameraPosition}
      />
      <mesh ref={ref}>
        <boxGeometry args={[size - 1, 1 / 2, 1, 10]} />
        <meshBasicMaterial vertexColors />
      </mesh>
      <Label position={[-(size - 1) / 2, 0.4, 1]} value={min} />
      <Label position={[-(size - 1) / 4, 0.4, 1]} value={min + range / 4} />
      <Label position={[0, 0.4, 1]} value={min + range / 2} />
      <Label
        position={[(size - 1) / 4, 0.4, 1]}
        value={min + (3 * range) / 4}
      />
      <Label position={[(size - 1) / 2, 0.4, 1]} value={max} />
    </group>
  )
}

export default Colorbar
