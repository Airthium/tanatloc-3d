import { fireEvent, render, screen } from '@testing-library/react'

import Display from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

describe('header/display', () => {
  const display = {
    grid: true,
    transparent: false
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Display />)

    unmount()
  })

  test('display grid', () => {
    mockUseStore.mockImplementation(() => display)
    const { unmount } = render(<Display />)

    const switchButton = screen.getByRole('switch', {
      name: 'radius-upright radius-upright'
    })
    fireEvent.click(switchButton)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('set transparent', () => {
    mockUseStore.mockImplementation(() => display)
    const { unmount } = render(<Display />)

    const switchButton = screen.getByRole('switch', {
      name: 'borderless-table borderless-table'
    })
    fireEvent.click(switchButton)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    unmount()
  })
})
