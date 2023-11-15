import { fireEvent, render, screen } from '@testing-library/react'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

import Zoom from '.'

const mockZoomToFit = jest.fn()
jest.mock('@tools/zoomToFit', () => () => mockZoomToFit())

const mockZoom = jest.fn()
jest.mock('@tools/zoom', () => () => mockZoom())

describe('header/zoom', () => {
  const mainView = {}
  const zoomToSelection = {
    enabled: true
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })

    mockZoomToFit.mockReset()
    mockZoom.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Zoom />)

    unmount()
  })

  test('zoomIn', async () => {
    global.requestAnimationFrame = () => 0
    const { unmount } = render(<Zoom />)

    const button = screen.getByRole('button', { name: 'zoom-in' })
    fireEvent.mouseDown(button)
    fireEvent.mouseUp(button)

    expect(mockZoom).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('zoomOut', () => {
    global.requestAnimationFrame = () => 1
    const { unmount } = render(<Zoom />)

    const button = screen.getByRole('button', { name: 'zoom-out' })
    fireEvent.mouseDown(button)
    fireEvent.mouseUp(button)

    expect(mockZoom).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('zoomToFit', () => {
    const { unmount } = render(<Zoom />)

    const button = screen.getByRole('button', { name: 'compress' })
    fireEvent.click(button)

    expect(mockZoomToFit).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('zoomToSelection', () => {
    mockUseStore
      .mockImplementationOnce(() => mainView)
      .mockImplementationOnce(() => zoomToSelection)
    const { unmount } = render(<Zoom />)

    const button = screen.getByRole('button', { name: 'select' })
    fireEvent.click(button)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    unmount()
  })
})
