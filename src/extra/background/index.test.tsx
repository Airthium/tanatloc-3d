import ReactThreeTestRenderer from '@react-three/test-renderer'

import Background, { BackgroundRender } from '.'

const mockUseStore = jest.fn()
const mockSetState = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

Object.defineProperty(Math, 'random', { value: () => 0.9 })

describe('extra/background', () => {
  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
    mockSetState.mockReset()
  })

  test('background', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Background />)

    await renderer.unmount()
  })

  test('BackgroundRender', async () => {
    const renderer = await ReactThreeTestRenderer.create(<BackgroundRender />)

    await renderer.advanceFrames(100, 100)

    await renderer.unmount()
  })

  test('BackgroundRender, with store', async () => {
    mockUseStore.mockImplementation(() => ({
      camera: { position: { z: 1 }, fov: 0.1, aspect: 1 }
    }))
    const renderer = await ReactThreeTestRenderer.create(<BackgroundRender />)

    await renderer.unmount()
  })
})
