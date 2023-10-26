import React from 'react'
import { render } from '@testing-library/react'

import { Context, ContextState } from './context'

import Parts from './Parts'

jest.mock('./loader', () => () => <div />)

describe('Parts', () => {
  const parts = [
    {
      summary: { uuid: 'uuid1', type: 'geometry3D', dimension: 3 }
    },
    {
      summary: { uuid: 'uuid2', type: 'mesh', dimension: 3 }
    }
  ]
  const contextValue = {
    props: {
      parts
    }
  } as unknown as ContextState

  test('render', () => {
    const { unmount } = render(<Parts />)

    unmount()
  })

  test('with context', () => {
    const { unmount, rerender } = render(
      <Context.Provider value={contextValue}>
        <Parts />
      </Context.Provider>
    )

    rerender(
      <Context.Provider
        value={
          {
            props: {
              parts: [parts[0]]
            }
          } as unknown as ContextState
        }
      >
        <Parts />
      </Context.Provider>
    )

    unmount()
  })
})
