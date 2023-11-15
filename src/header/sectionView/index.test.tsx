import { fireEvent, render, screen } from '@testing-library/react'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

import SectionView from '.'

describe('header/sectionView', () => {
  const sectionView = {
    enabled: true
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<SectionView />)

    unmount()
  })

  test('buttons', () => {
    mockUseStore.mockImplementation(() => sectionView)
    const { unmount } = render(<SectionView />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(mockSetState).toHaveBeenCalledTimes(6)

    unmount()
  })

  test('hidePlane', () => {
    mockUseStore.mockImplementation(() => ({ ...sectionView, hidePlane: true }))
    const { unmount } = render(<SectionView />)

    screen.getByRole('button', { name: 'eye' })

    unmount()
  })
})
