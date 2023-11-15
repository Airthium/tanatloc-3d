import { fireEvent, render } from '@testing-library/react'

import ZoomToSelection from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

jest.mock('@tools/zoomToRect', () => () => undefined)

describe('helpers/zoomToSelection', () => {
  const parentElement = {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    getBoundingClientRect: () => ({
      left: 0,
      top: 0
    })
  }
  const mainView = {
    gl: { domElement: { parentElement } },
    scene: {},
    camera: {},
    controls: {}
  }
  const zoomToSelection = {
    enabled: true
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('empty render', () => {
    const { unmount } = render(<ZoomToSelection />)

    unmount()
  })

  test('with store', () => {
    mockUseStore
      .mockImplementationOnce(() => mainView)
      .mockImplementationOnce(() => zoomToSelection)
    const { unmount } = render(<ZoomToSelection />)

    // Events
    fireEvent.pointerDown(document)
    fireEvent.pointerMove(document)
    fireEvent.pointerUp(document)

    unmount()
  })

  test('with store - disabled', () => {
    mockUseStore
      .mockImplementationOnce(() => mainView)
      .mockImplementationOnce(() => ({ ...zoomToSelection, enabled: false }))
    const { unmount } = render(<ZoomToSelection />)

    unmount()
  })

  test('with store - no controls', () => {
    mockUseStore
      .mockImplementationOnce(() => ({ ...mainView, controls: undefined }))
      .mockImplementationOnce(() => zoomToSelection)
    const { unmount } = render(<ZoomToSelection />)

    unmount()
  })

  test('with store - no camera', () => {
    mockUseStore
      .mockImplementationOnce(() => ({ ...mainView, camera: undefined }))
      .mockImplementationOnce(() => zoomToSelection)
    const { unmount } = render(<ZoomToSelection />)

    // Events
    fireEvent.pointerUp(document)

    unmount()
  })
})
