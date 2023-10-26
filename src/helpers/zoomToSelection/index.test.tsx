import React from 'react'
import { fireEvent, render } from '@testing-library/react'

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

  test('empty render', () => {
    const { unmount } = render(<ZoomToSelection />)

    unmount()
  })

  test('with context', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <ZoomToSelection />
      </Context.Provider>
    )

    // Events
    fireEvent.pointerDown(document)
    fireEvent.pointerMove(document)
    fireEvent.pointerUp(document)

    unmount()
  })

  test('with context - disabled', () => {
    const { unmount } = render(
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

    unmount()
  })

  test('with context - no controls', () => {
    const { unmount } = render(
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

    unmount()
  })

  test('with context - no camera', () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          mainView: {
            ...contextValue.mainView,
            camera: undefined
          }
        }}
      >
        <ZoomToSelection />
      </Context.Provider>
    )

    // Events
    fireEvent.pointerUp(document)

    unmount()
  })
})
