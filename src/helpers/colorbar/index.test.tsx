import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '@context'

import Colorbar from '.'

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
    getColor(_value: number) {
      return { r: 1, g: 0.5, b: 0 }
    }
  }

  return { Lut }
})

jest.mock('../../tools/toReadable', () => () => 'value')

describe('helpers/colorbar', () => {
  const contextValue = {
    mainView: { camera: undefined },
    lut: { colormap: 'rainbow' },
    dispatch: jest.fn()
  } as unknown as ContextState
  const resize = false

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Colorbar />
      </Context.Provider>
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Colorbar')

    await renderer.unmount()
  })

  test('with mainView.camera', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          mainView: { camera: { aspect: 1 } as THREE.PerspectiveCamera }
        }}
      >
        <Colorbar />
      </Context.Provider>
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Colorbar')

    await renderer.unmount()
  })
})
