import { Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import Light from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

describe('helpers/light', () => {
  const mainView = {
    camera: {
      position: new Vector3(0, 0, 5),
      up: new Vector3(0, 0, 1)
    },
    controls: {
      target: new Vector3(0, 0, 0)
    }
  }
  const settings = {
    light: {}
  }

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return settings
    })
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Light />)
    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Light')

    await renderer.unmount()
  })

  test('with mainView', async () => {
    mockUseStore.mockImplementation(() => ({ ...settings, ...mainView }))
    const renderer = await ReactThreeTestRenderer.create(<Light />)
    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Light')

    await renderer.unmount()
  })
})
