import {
  BoxGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial
} from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context, ContextState } from '@context/renderer'

import Result from '.'

jest.mock('three/examples/jsm/math/Lut', () => {
  class Lut {
    colormap: string
    min: number
    max: number

    constructor(colormap: string) {
      this.colormap = colormap
      this.min = 0
      this.max = 0
    }
    setMin(min: number) {
      this.min = min
    }
    setMax(max: number) {
      this.max = max
    }
    getColor(_value: number) {
      return { r: 1, g: 0.5, b: 0 }
    }
  }

  return { Lut }
})

describe('loader/result', () => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial()
  const mesh = new Mesh(geometry, material)
  mesh.uuid = 'uuid'
  mesh.name = 'name'
  mesh.userData.uuid = 'uuid1'
  mesh.geometry.setAttribute(
    'data',
    new Float32BufferAttribute([0, 0, 0, 1, 1, 1], 3)
  )

  const scene = {
    children: [mesh]
  } as unknown as GLTF['scene']

  const dispatch = jest.fn
  const contextValue = {
    display: {
      transparent: true
    },
    sectionView: {
      enabled: true,
      clippingPlane: 'plane'
    },
    result: {
      meshVisible: true
    },
    lut: {},
    dispatch
  } as unknown as ContextState

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Result scene={scene} />
    )

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Result scene={scene} />
      </Context.Provider>
    )

    await renderer.unmount()
  })

  test('with context - no meshVisible', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          result: {
            meshVisible: false
          }
        }}
      >
        <Result scene={scene} />
      </Context.Provider>
    )

    await renderer.unmount()
  })
})
