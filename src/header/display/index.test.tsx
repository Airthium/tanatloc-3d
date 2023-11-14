import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from '@context'

import Display from '.'

describe('header/display', () => {
  const dispatch = jest.fn()
  const contextValue = {
    display: {
      grid: true,
      transparent: false
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Display />)

    unmount()
  })

  test('display grid', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Display />
      </Context.Provider>
    )

    const switchButton = screen.getByRole('switch', {
      name: 'radius-upright radius-upright'
    })
    fireEvent.click(switchButton)

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('set transparent', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Display />
      </Context.Provider>
    )

    const switchButton = screen.getByRole('switch', {
      name: 'borderless-table borderless-table'
    })
    fireEvent.click(switchButton)

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()
  })
})
