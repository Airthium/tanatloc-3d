import { Box3, Vector2, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import SectionView from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

jest.mock('three', () => {
  class Raycaster {
    ray: any
    constructor() {
      this.ray = {
        intersectPlane: jest.fn()
      }
    }
    setFromCamera() {
      // Empty
    }
  }

  return {
    ...jest.requireActual('three'),
    Raycaster
  }
})

const mockBox = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1))
jest.mock('@tools/computeSceneBoundingBox', () => () => mockBox)

describe('helpers/sectionView', () => {
  const intersectionPoint = new Vector3(0, 0, 0)
  const intersectionPointer = new Vector2(0, 0)
  const mainView = {
    scene: {
      children: []
    },
    camera: {
      getWorldDirection: jest.fn(),
      up: new Vector3(0, 0, 1)
    },
    controls: {}
  }
  const sectionView = {
    enabled: true,
    snap: new Vector3(0, 0, 1),
    flip: 1,
    hidePlane: false
  }
  const settings = {
    colors: {}
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return settings
    })
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<SectionView />)
    const children = renderer.scene.children
    expect(children).toEqual([])

    await renderer.unmount()
  })

  test('with store', async () => {
    mockUseStore.mockImplementation(() => ({
      ...mainView,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(<SectionView />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('SectionView')

    const plane = group.children[0]
    const dome = group.children[1]

    // Events
    await renderer.fireEvent(plane, 'pointerMove')
    await renderer.fireEvent(dome, 'pointerMove')
    await renderer.fireEvent(plane, 'pointerMove')
    await renderer.fireEvent(plane, 'pointerOut')
    await renderer.fireEvent(dome, 'pointerOut')

    await renderer.fireEvent(group, 'pointerDown')
    await renderer.fireEvent(plane, 'pointerMove')
    await renderer.fireEvent(group, 'pointerDown', { intersections: [] })
    await renderer.fireEvent(group, 'pointerDown', {
      intersections: [
        {
          object: { visible: true, type: 'Plane' },
          point: intersectionPoint
        }
      ],
      pointer: intersectionPointer
    })
    await renderer.fireEvent(group, 'pointerMove')
    await renderer.fireEvent(group, 'pointerUp')
    await renderer.fireEvent(group, 'pointerOut')

    await renderer.fireEvent(dome, 'pointerMove')
    await renderer.fireEvent(group, 'pointerDown', { intersections: [] })
    await renderer.fireEvent(group, 'pointerDown', {
      intersections: [
        {
          object: { visible: true, type: 'Dome' },
          point: intersectionPoint
        }
      ],
      pointer: intersectionPointer
    })
    await renderer.fireEvent(group, 'pointerMove', {
      pointer: intersectionPointer
    })
    await renderer.fireEvent(group, 'pointerUp')

    await renderer.unmount()
  })

  test('with store - no controls', async () => {
    mockUseStore.mockImplementation(() => ({
      ...mainView,
      controls: undefined,
      ...sectionView,
      ...settings
    }))
    const renderer = await ReactThreeTestRenderer.create(<SectionView />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('SectionView')

    const plane = group.children[0]

    // Events
    await renderer.fireEvent(plane, 'pointerMove')
    await renderer.fireEvent(group, 'pointerDown')
    await renderer.fireEvent(group, 'pointerMove')
    await renderer.fireEvent(group, 'pointerUp')
  })
})
