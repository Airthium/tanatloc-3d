import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import Geometry2D from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

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

  const face1 = new Mesh(geometry, material)
  face1.uuid = 'face1'
  face1.name = 'face1'
  face1.userData.uuid = 'face1_uuid'
  face1.children = [edge1, edge2]

  const face2 = new Mesh(geometry, material)
  face2.uuid = 'face2'
  face2.name = 'face2'
  face2.userData.uuid = 'face2_uuid'
  face2.children = []

  const scene = {
    children: [face1, face2],
    userData: { uuid: 'uuid' }
  } as unknown as GLTF['scene']

  const onHighlight = jest.fn()
  const onSelect = jest.fn()
  const props = {
    selection: {
      enabled: true,
      part: 'uuid',
      type: 'faces',
      onHighlight,
      onSelect
    }
  }
  const display = {
    transparent: true
  }
  const sectionView = {
    enabled: true,
    clippingPlane: 'plane'
  }
  const settings = {
    colors: {}
  }

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return settings
    })
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    await renderer.unmount()
  })

  test('with store - face', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
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

  test('with store - edge', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: true, part: 'uuid', type: 'edges' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
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

  test('with store - point', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: true, part: 'uuid', type: 'point' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    const mesh = renderer.scene.children[0]
    const face = mesh.children[0]

    await renderer.fireEvent(face, 'pointerMove', {
      intersections: [{ point: { x: 1, y: 2, z: 3 } }]
    })

    await renderer.unmount()
  })

  test('with store - selection disabled', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: false, part: 'uuid', type: 'point' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    const mesh = renderer.scene.children[0]
    const face = mesh.children[0]

    await renderer.fireEvent(face, 'pointerMove')

    await renderer.unmount()
  })

  test('with store - no selectionable', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: true, type: 'faces' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    const mesh = renderer.scene.children[0]
    const face = mesh.children[0]

    await renderer.fireEvent(face, 'pointerMove')
    await renderer.fireEvent(face, 'click')
    await renderer.fireEvent(face, 'pointerLeave')

    await renderer.unmount()
  })

  test('with store - face highlighted/selected', async () => {
    mockUseStore.mockImplementationOnce(() => ({
      ...props,
      selection: {
        enabled: true,
        part: 'uuid',
        type: 'faces',
        highlighted: { uuid: 'face1_uuid' },
        selected: [{ uuid: 'face2_uuid' }]
      },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    await renderer.unmount()
  })

  test('with store - edge highlighted/selected', async () => {
    mockUseStore.mockImplementationOnce(() => ({
      ...props,
      selection: {
        enabled: true,
        part: 'uuid',
        type: 'edges',
        highlighted: { uuid: 'edge1_uuid' },
        selected: [{ uuid: 'edge1_uuid' }]
      },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    await renderer.unmount()
  })

  test('with store - solid highlighted/selected', async () => {
    mockUseStore.mockImplementationOnce(() => ({
      ...props,
      selection: {
        enabled: true,
        part: 'uuid',
        type: 'solids',
        highlighted: { uuid: 'solid1_uuid' },
        selected: [{ uuid: 'solid2_uuid' }]
      },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry2D scene={scene} />
    )

    await renderer.unmount()
  })
})
