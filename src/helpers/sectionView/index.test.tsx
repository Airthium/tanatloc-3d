import { Box3, Vector2, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '@context'

import SectionView from '.'

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
jest.mock('../../tools/computeSceneBoundingBox', () => () => mockBox)

describe('helpers/sectionView', () => {
  const intersectionPoint = new Vector3(0, 0, 0)
  const intersectionPointer = new Vector2(0, 0)
  const dispatch = jest.fn()
  const contextValue = {
    mainView: {
      scene: {
        children: []
      },
      camera: {
        getWorldDirection: jest.fn(),
        up: new Vector3(0, 0, 1)
      },
      controls: {}
    },
    sectionView: {
      enabled: true,
      snap: new Vector3(0, 0, 1),
      flip: 1,
      hidePlane: false
    },
    settings: {
      colors: {}
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<SectionView />)
    const children = renderer.scene.children
    expect(children).toEqual([])

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <SectionView />
      </Context.Provider>
    )
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

  test('with context - no controls', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          mainView: { ...contextValue.mainView, controls: undefined }
        }}
      >
        <SectionView />
      </Context.Provider>
    )
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
