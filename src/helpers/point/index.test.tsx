import ReactThreeTestRenderer from '@react-three/test-renderer'
import { Box3, Vector3 } from 'three'

import Point from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

const mockBox = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1))
jest.mock('@tools/computeSceneBoundingBox', () => () => mockBox)

describe('helpers/point', () => {
  const props = {
    selection: { point: { x: 1, y: 2, z: 3 } }
  }
  const mainView = {
    scene: {}
  }

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Point />)

    const group = renderer.scene.children[0]
    expect(group.type).toBe('Point')

    await renderer.unmount()
  })

  test('with store', async () => {
    mockUseStore.mockImplementation(() => ({
      ...props,
      ...mainView
    }))
    const renderer = await ReactThreeTestRenderer.create(<Point />)

    const group = renderer.scene.children[0]
    expect(group.type).toBe('Point')

    await renderer.unmount()
  })
})
