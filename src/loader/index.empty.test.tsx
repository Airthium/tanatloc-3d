import { render } from '@testing-library/react'

import { Tanatloc3DPart } from '@index'

import PartLoader from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

const mockGLTFLoad = jest.fn()
jest.mock('three/examples/jsm/loaders/GLTFLoader', () => {
  class GLTFLoader {
    load(
      _url: string,
      callback: Function,
      progress: Function,
      error: Function
    ) {
      callback(mockGLTFLoad())
      progress({ loaded: 10, total: 100 })
      error('error')
    }
  }
  return { GLTFLoader }
})

jest.mock('@tools/zoomToFit', () => () => undefined)

jest.mock('./geometry2D', () => () => <mesh />)
jest.mock('./geometry3D', () => () => <mesh />)
jest.mock('./mesh', () => () => <mesh />)
jest.mock('./result', () => () => <mesh />)

global.URL.createObjectURL = jest.fn()

describe('loader', () => {
  const part = {
    summary: { uuid: 'uuid' },
    buffer: 'buffer'
  } as unknown as Tanatloc3DPart

  const mainView = {
    scene: { children: [{}] },
    camera: {},
    controls: {}
  }

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })

    mockGLTFLoad.mockReset()
    mockGLTFLoad.mockImplementation(() => ({ scene: { userData: {} } }))
  })

  test('render', () => {
    const { unmount } = render(<PartLoader part={part} uuid="uuid" />)

    unmount()
  })

  test('with store', () => {
    mockUseStore.mockImplementation(() => mainView)
    const { unmount } = render(<PartLoader part={part} uuid="uuid" />)

    unmount()
  })
})
