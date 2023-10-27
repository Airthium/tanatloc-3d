import React from 'react'
import { render } from '@testing-library/react'

import { Context, ContextState, MyCanvasPart } from '../context'

import PartLoader from '.'

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
  } as unknown as MyCanvasPart

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

    mockGLTFLoad.mockReset()
    mockGLTFLoad.mockImplementation(() => ({ scene: { userData: {} } }))
  })

  test('render', () => {
    const { unmount } = render(<PartLoader part={part} uuid="uuid" />)

    unmount()
  })

  test('with context', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <PartLoader part={part} uuid="uuid" />
      </Context.Provider>
    )

    unmount()
  })

  test('Geometry2D', () => {
    mockGLTFLoad.mockImplementation(() => ({
      scene: { userData: { type: 'geometry2D' } }
    }))
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <PartLoader part={part} uuid="uuid" />
      </Context.Provider>
    )

    unmount()
  })

  test('Geometry3D', () => {
    mockGLTFLoad.mockImplementation(() => ({
      scene: { userData: { type: 'geometry3D' } }
    }))
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <PartLoader part={part} uuid="uuid" />
      </Context.Provider>
    )

    unmount()
  })

  test('Mesh', () => {
    mockGLTFLoad.mockImplementation(() => ({
      scene: { userData: { type: 'mesh' } }
    }))
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <PartLoader part={part} uuid="uuid" />
      </Context.Provider>
    )

    unmount()
  })

  test('Result', () => {
    mockGLTFLoad.mockImplementation(() => ({
      scene: { userData: { type: 'result' } }
    }))
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <PartLoader part={part} uuid="uuid" />
      </Context.Provider>
    )

    unmount()
  })
})
