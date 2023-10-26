import React from 'react'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import ReactThreeTestRenderer from '@react-three/test-renderer'

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

jest.mock('./Geometry2D', () => () => <mesh />)
jest.mock('./Geometry3D', () => () => <mesh />)
jest.mock('./Mesh', () => () => <mesh />)
jest.mock('./Result', () => () => <mesh />)

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

  // test('geometry3D', async () => {
  //   mockGLTFLoad.mockImplementation(() => ({
  //     scene: {
  //       userData: { type: 'geometry3D' },
  //       children: [
  //         {
  //           name: 'Solid',
  //           userData: { uuid: 'solid' },
  //           children: [
  //             {
  //               name: 'Face',
  //               userData: { uuid: 'face' },
  //               geometry: {
  //                 computeVertexNormals: jest.fn()
  //               },
  //               material: {
  //                 color: 'color'
  //               }
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   }))
  //   const renderer = await ReactThreeTestRenderer.create(
  //     <Context.Provider value={contextValue}>
  //       <PartLoader part={part} uuid="uuid" />
  //     </Context.Provider>
  //   )

  //   const solid = renderer.scene.children[0].children[0]
  //   const face = solid.children[0]

  //   await renderer.fireEvent(face, 'pointerMove', { distance: 1 })
  //   await renderer.fireEvent(face, 'pointerMove', { distance: 2 })
  //   await renderer.fireEvent(face, 'pointerLeave')
  //   await renderer.fireEvent(face, 'pointerLeave')
  //   await renderer.fireEvent(face, 'click')

  //   await renderer.unmount()
  // })

  // test('geometry3D - face selection', async () => {
  //   mockGLTFLoad.mockImplementation(() => ({
  //     scene: {
  //       userData: { type: 'geometry3D' },
  //       children: [
  //         {
  //           name: 'Solid',
  //           userData: { uuid: 'solid' },
  //           children: [
  //             {
  //               name: 'Face',
  //               userData: { uuid: 'face' },
  //               geometry: {
  //                 computeVertexNormals: jest.fn()
  //               },
  //               material: {
  //                 color: 'color'
  //               }
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   }))
  //   const renderer = await ReactThreeTestRenderer.create(
  //     <Context.Provider
  //       value={
  //         {
  //           ...contextValue,
  //           props: {
  //             ...contextValue.props,
  //             selection: 'face'
  //           },
  //           geometry: {
  //             dimension: 3
  //           },
  //           display: {
  //             transparent: false
  //           },
  //           sectionView: {
  //             enabled: false
  //           }
  //         } as unknown as ContextState
  //       }
  //     >
  //       <PartLoader part={part} uuid="uuid" />
  //     </Context.Provider>
  //   )

  //   const solid = renderer.scene.children[0].children[0]
  //   const face = solid.children[0]

  //   await renderer.fireEvent(face, 'pointerMove', { distance: 1 })
  //   await renderer.fireEvent(face, 'click')
  //   await renderer.fireEvent(face, 'pointerLeave')

  //   await renderer.fireEvent(face, 'pointerMove', { distance: 1 })
  //   await renderer.fireEvent(face, 'click')
  //   await renderer.fireEvent(face, 'click')
  //   await renderer.fireEvent(face, 'pointerLeave')

  //   await renderer.unmount()
  // })

  // test('geometry3D - solid selection', async () => {
  //   mockGLTFLoad.mockImplementation(() => ({
  //     scene: {
  //       userData: { type: 'geometry3D' },
  //       children: [
  //         {
  //           name: 'Solid',
  //           userData: { uuid: 'solid' },
  //           children: [
  //             {
  //               name: 'Face',
  //               userData: { uuid: 'face' },
  //               geometry: {
  //                 computeVertexNormals: jest.fn()
  //               },
  //               material: {
  //                 color: 'color'
  //               }
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   }))
  //   const renderer = await ReactThreeTestRenderer.create(
  //     <Context.Provider
  //       value={{
  //         ...contextValue,
  //         props: {
  //           ...contextValue.props,
  //           selection: 'solid'
  //         }
  //       }}
  //     >
  //       <PartLoader part={part} uuid="uuid" />
  //     </Context.Provider>
  //   )

  //   const solid = renderer.scene.children[0].children[0]
  //   const face = solid.children[0]

  //   await renderer.fireEvent(face, 'pointerMove', { distance: 1 })
  //   await renderer.fireEvent(face, 'click')
  //   await renderer.fireEvent(face, 'pointerLeave')

  //   await renderer.unmount()
  // })

  // TODO
  // test geometry2D, mesh, result after
  // Not completed for now
})
