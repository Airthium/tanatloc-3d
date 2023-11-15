import { render } from '@testing-library/react'

import Renderer from '.'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

jest.mock('@header', () => () => <div />)

describe('src/renderer', () => {
  const props = {
    parts: [{ summary: { type: 'result' } }]
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Renderer />)

    unmount()
  })

  test('with store', () => {
    mockUseStore.mockImplementation(() => props)
    const { unmount } = render(<Renderer />)

    unmount()
  })
})
