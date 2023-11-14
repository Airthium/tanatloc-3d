import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Context, ContextState } from '@context'

import Colorbar from '.'

jest.mock('@tools/toReadable', () => () => 'value')

describe('header/colorbar', () => {
  const dispatch = jest.fn()
  const contextValue = {
    lut: {
      colormap: 'rainbow',
      min: 0,
      max: 1
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Colorbar />)

    unmount()
  })

  test('onColormap', async () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Colorbar />
      </Context.Provider>
    )

    const button = screen.getByRole('button', { name: 'bg-colors' })
    fireEvent.mouseEnter(button)

    await waitFor(() => screen.getByRole('menuitem', { name: 'Rainbow' }))
    const menuItem = screen.getByRole('menuitem', { name: 'Rainbow' })
    fireEvent.click(menuItem)

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onCustomRange', async () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Colorbar />
      </Context.Provider>
    )

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

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(2))

    // Open
    fireEvent.click(button)

    // Close
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    unmount()
  })

  test('onAutomaticRange', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Colorbar />
      </Context.Provider>
    )

    const button = screen.getByRole('button', { name: 'arrows-alt' })
    fireEvent.click(button)

    expect(dispatch).toHaveBeenCalledTimes(2)

    unmount()
  })
})
