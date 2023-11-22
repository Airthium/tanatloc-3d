import ReactThreeTestRenderer from '@react-three/test-renderer'

import Colorbar from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

jest.mock('three/examples/jsm/math/Lut', () => {
  class Lut {
    colormap: string
    min: number
    max: number

    constructor(colormap: string) {
      this.colormap = colormap
      this.min = 0
      this.max = 0
    }
    setMin(min: number) {
      this.min = min
    }
    setMax(max: number) {
      this.max = max
    }
    getColor() {
      return { r: 1, g: 0.5, b: 0 }
    }
  }

  return { Lut }
})

jest.mock('@tools/toReadable', () => () => 'value')

describe('helpers/colorbar', () => {
  const mainView = { camera: { aspect: 1 } }

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Colorbar />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Colorbar')

    await renderer.unmount()
  })

  test('with mainView.camera', async () => {
    mockUseStore.mockImplementation(() => mainView)
    const renderer = await ReactThreeTestRenderer.create(<Colorbar />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Colorbar')

    await renderer.unmount()
  })
})
