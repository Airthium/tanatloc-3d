import { Euler, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import Navigation from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

jest.mock('../arrow', () => () => <mesh />)

describe('helpers/navigation', () => {
  const mainView = {
    camera: {
      aspect: 1,
      position: new Vector3(0, 0, 5),
      up: new Vector3(0, 0, 1),
      rotation: new Euler(0, 0, 0)
    },
    controls: {
      target: new Vector3(0, 0, 0)
    }
  }
  const geometry = {
    dimension: 3
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

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Navigation />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    await renderer.unmount()
  })

  test('with store', async () => {
    mockUseStore.mockImplementation(() => ({
      ...settings,
      ...geometry,
      ...mainView
    }))
    const renderer = await ReactThreeTestRenderer.create(<Navigation />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    // Events
    const face1 = group.children[2]
    const face2 = group.children[3]

    await renderer.fireEvent(face1, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face2, 'pointerMove', { distance: 2 })
    await renderer.fireEvent(face1, 'click')
    await renderer.fireEvent(face2, 'pointerLeave')
    await renderer.fireEvent(face1, 'pointerLeave')
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })

  test('with store - 2D', async () => {
    mockUseStore.mockImplementation(() => ({
      ...settings,
      ...geometry,
      dimension: 2,
      ...mainView
    }))
    const renderer = await ReactThreeTestRenderer.create(<Navigation />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    // Events
    const face1 = group.children[2]
    const face2 = group.children[3]

    await renderer.fireEvent(face1, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face2, 'pointerMove', { distance: 2 })
    await renderer.fireEvent(face1, 'click')
    await renderer.fireEvent(face2, 'pointerLeave')
    await renderer.fireEvent(face1, 'pointerLeave')
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })

  test('with store - no camera', async () => {
    mockUseStore.mockImplementation(() => ({
      ...settings,
      ...geometry,
      ...mainView,
      camera: undefined
    }))
    const renderer = await ReactThreeTestRenderer.create(<Navigation />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    // Events
    const face1 = group.children[2]
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })
})
