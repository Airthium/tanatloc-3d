import { Color } from 'antd/es/color-picker'
import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from '@context'

import Settings, { colorToHex } from '.'

describe('header/settings', () => {
  test('render', () => {
    const { unmount } = render(<Settings />)

    unmount()
  })

  test('open/close', () => {
    const { unmount } = render(<Settings />)

    // Open
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Close
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    unmount()
  })

  test('on reset', () => {
    const { unmount } = render(<Settings />)

    // Open
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Reset
    const reset = screen.getByRole('button', { name: 'Reset default' })
    fireEvent.click(reset)

    unmount()
  })

  test('on apply', () => {
    const { unmount } = render(<Settings />)

    // Open
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Apply
    const apply = screen.getByRole('button', { name: 'Apply' })
    fireEvent.click(apply)

    unmount()
  })

  test('local storage', async () => {
    const { unmount } = render(
      <Context.Provider
        value={
          {
            settings: {
              light: { color: '#ffffff', intensity: 1, decay: 0 },
              colors: {
                baseColor: '#ffffff',
                hoverColor: '#ffffff',
                selectColor: '#ffffff',
                hoverSelectColor: '#ffffff'
              },
              frameRate: {
                fps: 30
              },
              localStorage: true
            },
            dispatch: jest.fn
          } as unknown as ContextState
        }
      >
        <Settings />
      </Context.Provider>
    )

    unmount()
  })

  test('color to hex', () => {
    const color1 = colorToHex('#000000')
    expect(color1).toBe('#000000')

    const color2 = colorToHex({ toHexString: () => '#111111' } as Color)
    expect(color2).toBe('#111111')
  })
})
