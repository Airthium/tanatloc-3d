import { render, screen, waitFor } from '@testing-library/react'

import { Tanatloc3DPart } from '../..'

import { Context, ContextState } from '../context'

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

jest.mock('../tools/zoomToFit', () => () => undefined)

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

  const dispatch = jest.fn()
  const contextValue = {
    props: {
      selection: '',
      onHighlight: jest.fn,
      onSelect: jest.fn
    },
    mainView: {
      scene: {},
      camera: {},
      controls: {}
    },
    display: {
      transparent: true
    },
    geometry: {
      dimension: 0
    },
    sectionView: {
      enabled: true,
      clippingPlane: 'plane'
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('Geometry2D', async () => {
    const PartLoader = (await import('.')).default

    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <PartLoader part={part} uuid="uuid" />
      </Context.Provider>
    )

    await waitFor(() => screen.getByTestId('geometry3D'))

    unmount()
  })
})
