import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Context, ContextState } from '../../context'

import Snapshot from '.'

describe('header/snapshot', () => {
  const dispatch = jest.fn()
  const contextValue = {
    props: {},
    mainView: {
      gl: {
        domElement: {
          width: 100,
          height: 100,
          toDataURL: () => 'image'
        },
        clear: jest.fn,
        setViewport: jest.fn,
        render: jest.fn
      },
      scene: {},
      camera: {
        aspect: 1,
        updateProjectionMatrix: jest.fn
      }
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Snapshot />)

    unmount()
  })

  test('export snapshot - no context', () => {
    const { unmount } = render(<Snapshot />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('export snapshot', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Snapshot />
      </Context.Provider>
    )

    const button = screen.getByRole('button', {
      name: 'fund-projection-screen'
    })
    fireEvent.click(button)

    unmount()
  })

  test('project snapshot - no mainView', async () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          props: {
            ...contextValue.props,
            snapshot: {
              project: {
                size: {
                  width: 100,
                  height: 100
                },
                apiRoute: async () => undefined
              }
            }
          },
          mainView: {}
        }}
      >
        <Snapshot />
      </Context.Provider>
    )

    // Open dropdown
    const button = screen.getByRole('button', {
      name: 'fund-projection-screen'
    })
    fireEvent.mouseEnter(button)
    await waitFor(() =>
      screen.getByRole('menuitem', { name: 'Project snapshot' })
    )

    // Click
    const menuItem1 = screen.getByRole('menuitem', { name: 'Project snapshot' })
    fireEvent.click(menuItem1)

    unmount()
  })

  test('project snapshot - no size', async () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          props: {
            ...contextValue.props,
            snapshot: {
              project: {
                apiRoute: async () => undefined
              }
            }
          }
        }}
      >
        <Snapshot />
      </Context.Provider>
    )

    // Open dropdown
    const button = screen.getByRole('button', {
      name: 'fund-projection-screen'
    })
    fireEvent.mouseEnter(button)
    await waitFor(() =>
      screen.getByRole('menuitem', { name: 'Project snapshot' })
    )

    // Click
    const menuItem1 = screen.getByRole('menuitem', { name: 'Project snapshot' })
    fireEvent.click(menuItem1)

    unmount()
  })

  test('project snapshot', async () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          props: {
            ...contextValue.props,
            snapshot: {
              project: {
                size: {
                  width: 100,
                  height: 100
                },
                apiRoute: async () => undefined
              }
            }
          }
        }}
      >
        <Snapshot />
      </Context.Provider>
    )

    {
      // Open dropdown
      const button = screen.getByRole('button', {
        name: 'fund-projection-screen'
      })
      fireEvent.mouseEnter(button)
      await waitFor(() =>
        screen.getByRole('menuitem', { name: 'Project snapshot' })
      )

      // Click
      const menuItem1 = screen.getByRole('menuitem', {
        name: 'Project snapshot'
      })
      fireEvent.click(menuItem1)
    }

    {
      // Open dropdown
      const button = screen.getByRole('button', {
        name: 'fund-projection-screen'
      })
      fireEvent.mouseEnter(button)
      await waitFor(() =>
        screen.getByRole('menuitem', { name: 'Export image' })
      )

      // Click
      const menuItem1 = screen.getByRole('menuitem', {
        name: 'Export image'
      })
      fireEvent.click(menuItem1)
    }

    unmount()
  })
})
