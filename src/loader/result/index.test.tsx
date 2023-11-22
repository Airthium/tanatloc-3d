import {
  BoxGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial
} from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import Result from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

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
    getColor() {
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

  const display = {
    transparent: true
  }
  const sectionView = {
    enabled: true,
    clippingPlane: 'plane'
  }
  const result = {
    meshVisible: true
  }
  const lut = {}

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Result scene={scene} />
    )

    await renderer.unmount()
  })

  test('with store', async () => {
    mockUseStore.mockImplementation(() => ({
      ...display,
      ...sectionView,
      ...result,
      ...lut
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Result scene={scene} />
    )

    await renderer.unmount()
  })

  test('with store - no transparent - no sectionView', async () => {
    mockUseStore.mockImplementation(() => ({
      ...display,
      transparent: false,
      ...sectionView,
      enabled: false,
      ...result,
      ...lut
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Result scene={scene} />
    )

    await renderer.unmount()
  })
})

describe('loader/result - 0', () => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial()
  const mesh = new Mesh(geometry, material)
  mesh.uuid = 'uuid'
  mesh.name = 'name'
  mesh.userData.uuid = 'uuid1'
  mesh.geometry.setAttribute(
    'data',
    new Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3)
  )

  const scene = {
    children: [mesh]
  } as unknown as GLTF['scene']

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Result scene={scene} />
    )

    await renderer.unmount()
  })
})

describe('loader/result - 1', () => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial()
  const mesh = new Mesh(geometry, material)
  mesh.uuid = 'uuid'
  mesh.name = 'name'
  mesh.userData.uuid = 'uuid1'
  mesh.geometry.setAttribute(
    'data',
    new Float32BufferAttribute([1, 1, 1, 1, 1, 1], 3)
  )

  const scene = {
    children: [mesh]
  } as unknown as GLTF['scene']

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Result scene={scene} />
    )

    await renderer.unmount()
  })
})
