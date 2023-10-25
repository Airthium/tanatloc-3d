import React from 'react'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '../../context'

import ZoomToSelection from '.'

jest.mock('../../tools/zoomToRect', () => () => undefined)

describe('helpers/zoomToSelection', () => {
  const dispatch = jest.fn()
  const parentElement = {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  }
  const contextValue = {
    mainView: {
      gl: { domElement: { parentElement } },
      scene: {},
      camera: {},
      controls: {}
    },
    zoomToSelection: {
      enabled: true
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<ZoomToSelection />)
    const children = renderer.scene.children
    expect(children).toEqual([])
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <ZoomToSelection />
      </Context.Provider>
    )
    const children = renderer.scene.children
    expect(children).toEqual([])
  })

  test('with context - disabled', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          zoomToSelection: {
            enabled: false
          }
        }}
      >
        <ZoomToSelection />
      </Context.Provider>
    )
    const children = renderer.scene.children
    expect(children).toEqual([])
  })

  test('with context - no controls', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          mainView: {
            ...contextValue.mainView,
            controls: undefined
          }
        }}
      >
        <ZoomToSelection />
      </Context.Provider>
    )
    const children = renderer.scene.children
    expect(children).toEqual([])
  })
})
