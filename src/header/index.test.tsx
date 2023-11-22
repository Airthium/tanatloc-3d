import { screen, render } from '@testing-library/react'

import Header from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

const colorbarRole = 'Colorbar'
jest.mock('./snapshot', () => () => <div />)
jest.mock('./display', () => () => <div />)
jest.mock('./zoom', () => () => <div />)
jest.mock('./sectionView', () => () => <div />)
jest.mock('./colorbar', () => () => <div role={colorbarRole} />)
jest.mock('./results', () => () => <div />)
jest.mock('./settings', () => () => <div />)

describe('header', () => {
  const oneResult = false

  test('render', () => {
    const { unmount } = render(<Header oneResult={oneResult} />)

    unmount()
  })

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('width data & postprocessing', () => {
    mockUseStore.mockImplementation(() => ({
      data: true,
      postProcessing: true
    }))
    const { unmount } = render(<Header oneResult={oneResult} />)

    expect(screen.getByRole('button', { name: 'database' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'filter' })).toBeDefined()

    unmount()
  })

  test('width data', () => {
    mockUseStore.mockImplementation(() => ({
      data: true
    }))
    const { unmount } = render(<Header oneResult={oneResult} />)

    expect(screen.getByRole('button', { name: 'database' })).toBeDefined()

    unmount()
  })

  test('width postprocessing', () => {
    mockUseStore.mockImplementation(() => ({
      postProcessing: true
    }))
    const { unmount } = render(<Header oneResult={oneResult} />)

    expect(screen.getByRole('button', { name: 'filter' })).toBeDefined()

    unmount()
  })

  test('with one result', () => {
    const { unmount } = render(<Header oneResult={true} />)

    expect(screen.getByRole(colorbarRole)).toBeDefined()

    unmount()
  })
})
