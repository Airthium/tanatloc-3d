import { useContext, useEffect, useMemo, useRef } from 'react'
import { Line, OrthographicCamera, Text } from '@react-three/drei'
import { Float32BufferAttribute } from 'three'
import { Lut } from 'three/examples/jsm/math/Lut'

import { Context } from '../../context'

import toReadable from '../../tools/toReadable'

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
const Label = ({ position, value }: LabelProps): React.JSX.Element => {
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
const Colorbar = (): React.JSX.Element => {
  // Ref
  const ref = useRef<THREE.Mesh>(null!)

  // Context
  const { lut } = useContext(Context)

  // Vertex colors
  useEffect(() => {
    const geometry = ref.current.geometry

    const lookUpTable = new Lut(lut.colormap)
    lookUpTable.setMin(-(size - 1) / 2)
    lookUpTable.setMax((size - 1) / 2)

    const position = geometry.getAttribute('position')

    const colors = new Float32Array(position.count * 3)
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

  // Min
  const min = useMemo(() => lut.customMin ?? lut.min, [lut.min, lut.customMin])

  // Max
  const max = useMemo(() => lut.customMax ?? lut.max, [lut.max, lut.customMax])

  /**
   * Render
   */
  return (
    <group type="Colorbar">
      <OrthographicCamera
        makeDefault
        left={-size}
        right={size}
        top={size}
        bottom={-size}
        near={-size}
        far={size}
        zoom={50}
      />
      <mesh ref={ref}>
        <boxGeometry args={[size - 1, 1 / 2, 1, 10]} />
        <meshBasicMaterial vertexColors />
      </mesh>
      <Label position={[-(size - 1) / 2, 0.4, 1]} value={min} />
      <Label position={[-(size - 1) / 4, 0.4, 1]} value={(max - min) / 4} />
      <Label position={[0, 0.4, 1]} value={(max - min) / 2} />
      <Label
        position={[(size - 1) / 4, 0.4, 1]}
        value={(3 * (max - min)) / 4}
      />
      <Label position={[(size - 1) / 2, 0.4, 1]} value={max} />
    </group>
  )
}

export default Colorbar
