import ReactThreeTestRenderer from '@react-three/test-renderer'

import ComputeLut from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
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

describe('helpers/computeLut', () => {
  const mainView = {
    scene: {
      children: [
        {
          type: 'Part',
          userData: { type: 'result' },
          children: [
            {
              userData: {
                lut: { min: -1, max: 1 },
                data: { count: 1, array: [1, 1, 1], itemSize: 3 }
              },
              geometry: {
                setAttribute: jest.fn
              },
              material: {
                needUpdate: true
              }
            }
          ]
        },
        {
          type: 'Part',
          userData: { type: 'result' },
          children: [{ userData: {} }]
        }
      ]
    }
  }
  const lut = {
    main: Infinity,
    max: -Infinity
  }

  beforeEach(() => {
    mockSetState.mockReset()
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<ComputeLut />)
    const group = renderer.scene.children[0]
    expect(group).toBe(undefined)

    await renderer.unmount()
  })

  test('with scene', async () => {
    mockUseStore.mockImplementation(() => ({ ...mainView, ...lut }))
    const renderer = await ReactThreeTestRenderer.create(<ComputeLut />)
    const group = renderer.scene.children[0]
    expect(group).toBe(undefined)

    await renderer.unmount()
  })

  test('with same lut', async () => {
    mockUseStore.mockImplementation(() => ({
      ...mainView,
      ...{ ...lut, min: -1, max: 1 }
    }))
    const renderer = await ReactThreeTestRenderer.create(<ComputeLut />)
    const group = renderer.scene.children[0]
    expect(group).toBe(undefined)

    await renderer.unmount()
  })
})
