import { render } from '@testing-library/react'

import Parts from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

jest.mock('@loader', () => () => <div />)

describe('Parts', () => {
  const parts = [
    {
      summary: { uuid: 'uuid1', type: 'geometry3D', dimension: 3 }
    },
    {
      summary: { uuid: 'uuid2', type: 'mesh' }
    }
  ]

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Parts />)

    unmount()
  })

  test('with parts', () => {
    mockUseStore.mockImplementation(() => ({ parts: parts }))
    const { unmount, rerender } = render(<Parts />)

    expect(mockSetState).toHaveBeenCalledTimes(2)

    mockUseStore.mockImplementation(() => ({ parts: [parts[0]] }))
    rerender(<Parts />)

    expect(mockSetState).toHaveBeenCalledTimes(4)

    unmount()
  })
})
