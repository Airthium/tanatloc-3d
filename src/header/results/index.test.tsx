import { fireEvent, render, screen } from '@testing-library/react'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

import Results from '.'

describe('header/results', () => {
  const result = {
    meshVisible: true
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Results />)

    unmount()
  })

  test('set mesh visible', () => {
    mockUseStore.mockImplementation(() => result)
    const { unmount } = render(<Results />)

    const switchButton = screen.getByRole('switch')
    fireEvent.click(switchButton)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    unmount()
  })
})
