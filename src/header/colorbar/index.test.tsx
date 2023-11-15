import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

import Colorbar from '.'

jest.mock('@tools/toReadable', () => () => 'value')

describe('header/colorbar', () => {
  const lut = {
    colormap: 'rainbow',
    min: 0,
    max: 1
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Colorbar />)

    unmount()
  })

  test('onColormap', async () => {
    mockUseStore.mockImplementation(() => lut)
    const { unmount } = render(<Colorbar />)

    const button = screen.getByRole('button', { name: 'bg-colors' })
    fireEvent.mouseEnter(button)

    await waitFor(() => screen.getByRole('menuitem', { name: 'Rainbow' }))
    const menuItem = screen.getByRole('menuitem', { name: 'Rainbow' })
    fireEvent.click(menuItem)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onCustomRange', async () => {
    mockUseStore.mockImplementation(() => lut)
    const { unmount } = render(<Colorbar />)

    // Open
    const button = screen.getByRole('button', { name: 'column-width' })
    fireEvent.click(button)

    // Fill
    const min = screen.getByRole('spinbutton', { name: 'Minimum' })
    fireEvent.change(min, { target: { value: -1 } })
    const max = screen.getByRole('spinbutton', { name: 'Maximum' })
    fireEvent.change(max, { target: { value: 1 } })

    // Apply
    const form = screen.getByRole('button', { name: 'Apply' })
    fireEvent.click(form)

    await waitFor(() => expect(mockSetState).toHaveBeenCalledTimes(1))

    // Open
    fireEvent.click(button)

    // Close
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    unmount()
  })

  test('onAutomaticRange', () => {
    mockUseStore.mockImplementation(() => lut)
    const { unmount } = render(<Colorbar />)

    const button = screen.getByRole('button', { name: 'arrows-alt' })
    fireEvent.click(button)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    unmount()
  })
})
