import React from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '../../context'

import Geometry2D from '.'

describe('loader/Geometry2D', () => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial()

  const edge1 = new Mesh(geometry, material)
  edge1.uuid = 'edge1'
  edge1.name = 'edge1'
  edge1.userData.uuid = 'edge1_uuid'

  const edge2 = new Mesh(geometry, material)
  edge2.uuid = 'edge2'
  edge2.name = 'edge2'
  edge2.userData.uuid = 'edge2_uuid'

  const face = new Mesh(geometry, material)
  face.uuid = 'face'
  face.name = 'face'
  face.userData.uuid = 'face_uuid'
  face.children = [edge1, edge2]

  const scene = {
    children: [face]
  } as unknown as GLTF['scene']

  const onHighlight = jest.fn()
  const onSelect = jest.fn()
  const contextValue = {
    props: {
      selection: 'face',
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
      <Geometry2D scene={scene} />
    )

    await renderer.unmount()
  })

  test('with context - face', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Geometry2D scene={scene} />
      </Context.Provider>
    )

    const mesh = renderer.scene.children[0]
    const face = mesh.children[0]
    const edge = face.children[0]

    await renderer.fireEvent(edge, 'pointerMove')
    await renderer.fireEvent(edge, 'click')
    await renderer.fireEvent(edge, 'pointerLeave')

    await renderer.fireEvent(face, 'pointerMove')
    await renderer.fireEvent(face, 'click')
    await renderer.fireEvent(face, 'pointerLeave')
    await renderer.fireEvent(face, 'pointerMove')
    await renderer.fireEvent(face, 'click')

    await renderer.unmount()
  })

  test('with context - face', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          props: { ...contextValue.props, selection: 'edge' }
        }}
      >
        <Geometry2D scene={scene} />
      </Context.Provider>
    )

    const mesh = renderer.scene.children[0]
    const face = mesh.children[0]
    const edge1 = face.children[0]
    const edge2 = face.children[1]

    await renderer.fireEvent(face, 'pointerMove')
    await renderer.fireEvent(face, 'click')
    await renderer.fireEvent(face, 'pointerLeave')

    await renderer.fireEvent(edge1, 'pointerMove')
    await renderer.fireEvent(edge2, 'pointerLeave')
    await renderer.fireEvent(edge1, 'click')
    await renderer.fireEvent(edge1, 'pointerLeave')
    await renderer.fireEvent(edge1, 'pointerMove')
    await renderer.fireEvent(edge1, 'click')

    await renderer.unmount()
  })
})
