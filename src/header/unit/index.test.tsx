import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Unit from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

describe('header/unit', () => {
  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Unit />)

    unmount()
  })

  test('on unit', async () => {
    const { unmount } = render(<Unit />)

    const button = screen.getByRole('button')
    fireEvent.mouseEnter(button)

    await waitFor(() => screen.getByRole('menuitem', { name: 'mm' }))

    const mm = screen.getByRole('menuitem', { name: 'mm' })
    fireEvent.click(mm)

    unmount()
  })
})
