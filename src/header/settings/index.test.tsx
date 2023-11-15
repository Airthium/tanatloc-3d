import { Color } from 'antd/es/color-picker'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

const defaultSettings = {
  light: {
    color: '#ffffff',
    intensity: 1,
    decay: 0
  },
  colors: {
    baseColor: '#d3d3d3',
    hoverColor: '#fad114',
    selectColor: '#fa9814',
    hoverSelectColor: '#fa5f14'
  },
  frameRate: {
    fps: 30
  },
  localStorage: false
}
jest.mock('@store/defaults', () => ({
  defaultSettings: defaultSettings
}))

import Settings, { colorToHex } from '.'

describe('header/settings', () => {
  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return defaultSettings
    })
  })

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

  test('on apply', async () => {
    const { unmount } = render(<Settings />)

    // Open
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Apply
    const apply = screen.getByRole('button', { name: 'Apply' })
    fireEvent.click(apply)
    await waitFor(() => expect(mockSetState).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('local storage', async () => {
    mockUseStore.mockImplementation(() => ({
      ...defaultSettings,
      localStorage: true
    }))
    const { unmount } = render(<Settings />)

    unmount()
  })

  test('color to hex', () => {
    const color1 = colorToHex('#000000')
    expect(color1).toBe('#000000')

    const color2 = colorToHex({ toHexString: () => '#111111' } as Color)
    expect(color2).toBe('#111111')
  })
})
