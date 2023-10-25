import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from '../../context'

import SectionView from '.'

describe('header/sectionView', () => {
  const dispatch = jest.fn()
  const contextValue = {
    sectionView: {
      enabled: true
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<SectionView />)

    unmount()
  })

  test('buttons', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <SectionView />
      </Context.Provider>
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(dispatch).toHaveBeenCalledTimes(6)

    unmount()
  })

  test('hidePlane', () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          sectionView: {
            ...contextValue.sectionView,
            hidePlane: true
          }
        }}
      >
        <SectionView />
      </Context.Provider>
    )

    screen.getByRole('button', { name: 'eye' })

    unmount()
  })
})
