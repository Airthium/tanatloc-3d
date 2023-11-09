import {
  BoxGeometry,
  Float32BufferAttribute,
  Mesh as ThreeMesh,
  MeshBasicMaterial
} from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context, ContextState } from '../../context'

import Mesh from '.'

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
    const renderer = await ReactThreeTestRenderer.create(<Mesh scene={scene} />)

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Mesh scene={scene} />
      </Context.Provider>
    )

    await renderer.unmount()
  })
})
