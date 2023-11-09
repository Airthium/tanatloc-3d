import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '../../context'

import Geometry3D from '.'

describe('loader/Geometry3D', () => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial()

  const face1 = new Mesh(geometry, material)
  face1.uuid = 'face1'
  face1.name = 'face1'
  face1.userData.uuid = 'face1_uuid'

  const face2 = new Mesh(geometry, material)
  face2.uuid = 'face2'
  face2.name = 'face2'
  face2.userData.uuid = 'face2_uuid'

  const solid = new Mesh(geometry, material)
  solid.uuid = 'solid'
  solid.name = 'solid'
  solid.userData.uuid = 'solid_uuid'
  solid.children = [face1, face2]

  const scene = {
    children: [solid]
  } as unknown as GLTF['scene']

  const onHighlight = jest.fn()
  const onSelect = jest.fn()
  const contextValue = {
    props: {
      selection: 'solid',
      onHighlight,
      onSelect
    },
    display: {
      transparent: true
    },
    sectionView: {
      enabled: true,
      clippingPlane: 'plane'
    },
    settings: {
      colors: {}
    }
  } as unknown as ContextState

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
    )

    await renderer.unmount()
  })

  test('with context - solid', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Geometry3D scene={scene} />
      </Context.Provider>
    )

    const mesh = renderer.scene.children[0]
    const solid = mesh.children[0]
    const face = solid.children[0]

    await renderer.fireEvent(face, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face, 'click')
    await renderer.fireEvent(face, 'pointerLeave')

    await renderer.fireEvent(solid, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(solid, 'pointerMove', { distance: 2 })
    await renderer.fireEvent(solid, 'click')
    await renderer.fireEvent(solid, 'pointerLeave')
    await renderer.fireEvent(solid, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(solid, 'click')

    await renderer.unmount()
  })

  test('with context - face', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          props: { ...contextValue.props, selection: 'face' }
        }}
      >
        <Geometry3D scene={scene} />
      </Context.Provider>
    )

    const mesh = renderer.scene.children[0]
    const solid = mesh.children[0]
    const face1 = solid.children[0]
    const face2 = solid.children[1]

    await renderer.fireEvent(solid, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(solid, 'click')
    await renderer.fireEvent(solid, 'pointerLeave', { distance: 1 })

    await renderer.fireEvent(face1, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face2, 'pointerLeave')
    await renderer.fireEvent(face1, 'click')
    await renderer.fireEvent(face1, 'pointerLeave')
    await renderer.fireEvent(face1, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })
})
