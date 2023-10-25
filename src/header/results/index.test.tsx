import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from '../../context'

import Results from '.'

describe('header/results', () => {
  const dispatch = jest.fn()
  const contextValue = {
    result: {
      meshVisible: true
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Results />)

    unmount()
  })

  test('set mesh visible', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Results />
      </Context.Provider>
    )

    const switchButton = screen.getByRole('switch')
    fireEvent.click(switchButton)

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()
  })
})
