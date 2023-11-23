import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import Geometry3D from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

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

  const solid1 = new Mesh(geometry, material)
  solid1.uuid = 'solid1'
  solid1.name = 'solid1'
  solid1.userData.uuid = 'solid1_uuid'
  solid1.children = [face1, face2]

  const solid2 = new Mesh(geometry, material)
  solid2.uuid = 'solid2'
  solid2.name = 'solid2'
  solid2.userData.uuid = 'solid2_uuid'
  solid2.children = []

  const scene = {
    children: [solid1, solid2],
    userData: { uuid: 'uuid' }
  } as unknown as GLTF['scene']

  const onHighlight = jest.fn()
  const onSelect = jest.fn()
  const props = {
    selection: {
      enabled: true,
      part: 'uuid',
      type: 'solids',
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
      <Geometry3D scene={scene} />
    )

    await renderer.unmount()
  })

  test('with store - solid', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
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

  test('with store - face', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: true, part: 'uuid', type: 'faces' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
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

  test('with store - point', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: true, part: 'uuid', type: 'point' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
    )

    const mesh = renderer.scene.children[0]
    const solid = mesh.children[0]
    const face1 = solid.children[0]

    await renderer.fireEvent(face1, 'pointerMove', {
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
      <Geometry3D scene={scene} />
    )

    const mesh = renderer.scene.children[0]
    const solid = mesh.children[0]
    const face1 = solid.children[0]

    await renderer.fireEvent(face1, 'pointerMove')

    await renderer.unmount()
  })

  test('with store - not selectionable', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      selection: { enabled: true, type: 'solids' },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
    )

    const mesh = renderer.scene.children[0]
    const solid = mesh.children[0]

    await renderer.fireEvent(solid, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(solid, 'click')
    await renderer.fireEvent(solid, 'pointerLeave')

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
        selected: [{ uuid: 'solid1_uuid' }]
      },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
    )

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
      <Geometry3D scene={scene} />
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
        selected: [{ uuid: 'edge2_uuid' }]
      },
      ...display,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(
      <Geometry3D scene={scene} />
    )

    await renderer.unmount()
  })
})
