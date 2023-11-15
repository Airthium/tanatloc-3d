import {
  BoxGeometry,
  Float32BufferAttribute,
  Mesh as ThreeMesh,
  MeshBasicMaterial
} from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import Mesh from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

describe('loader/mesh', () => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial()
  const mesh = new ThreeMesh(geometry, material)
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

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Mesh scene={scene} />)

    await renderer.unmount()
  })

  test('with store', async () => {
    mockUseStore.mockImplementation(() => ({ ...display, ...sectionView }))
    const renderer = await ReactThreeTestRenderer.create(<Mesh scene={scene} />)

    await renderer.unmount()
  })
})
