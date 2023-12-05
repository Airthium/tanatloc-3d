import { render, waitFor } from '@testing-library/react'

import { Tanatloc3DPart } from '@index'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

jest.mock('three/examples/jsm/loaders/GLTFLoader', () => {
  class GLTFLoader {
    load(
      _url: string,
      callback: Function,
      progress: Function,
      error: Function
    ) {
      callback({
        scene: { userData: { type: 'geometry3D' } }
      })
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
      return mainView
    })
  })

  test('Geometry2D', async () => {
    const PartLoader = (await import('.')).default
    const { container, unmount } = render(
      <PartLoader part={part} uuid="uuid" />
    )

    await waitFor(() => container.querySelector('mesh'))

    unmount()
  })
})
