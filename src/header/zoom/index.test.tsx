import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from '@context/renderer'

import Zoom from '.'

const mockZoomToFit = jest.fn()
jest.mock('../../tools/zoomToFit', () => () => mockZoomToFit())

const mockZoom = jest.fn()
jest.mock('../../tools/zoom', () => () => mockZoom())

describe('header/zoom', () => {
  const dispatch = jest.fn()
  const contextValue = {
    mainView: {},
    zoomToSelection: {
      enabled: true
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()

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
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Zoom />
      </Context.Provider>
    )

    const button = screen.getByRole('button', { name: 'select' })
    fireEvent.click(button)

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()
  })
})
