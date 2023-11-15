import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

import Snapshot from '.'

describe('header/snapshot', () => {
  const props = {}
  const mainView = {
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
  }

  beforeEach(() => {
    mockSetState.mockReset()

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Snapshot />)

    unmount()
  })

  test('export snapshot - no store', () => {
    const { unmount } = render(<Snapshot />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('export snapshot', () => {
    mockUseStore
      .mockImplementationOnce(() => props)
      .mockImplementationOnce(() => mainView)
    const { unmount } = render(<Snapshot />)

    const button = screen.getByRole('button', {
      name: 'fund-projection-screen'
    })
    fireEvent.click(button)

    unmount()
  })

  test('project snapshot - no mainView', async () => {
    mockUseStore
      .mockImplementationOnce(() => ({
        ...props,
        snapshot: {
          project: {
            apiRoute: async () => undefined
          }
        }
      }))
      .mockImplementationOnce(() => ({}))
    const { unmount } = render(<Snapshot />)

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
    mockUseStore
      .mockImplementationOnce(() => ({
        ...props,
        snapshot: {
          project: {
            apiRoute: async () => undefined
          }
        }
      }))
      .mockImplementationOnce(() => mainView)
    const { unmount } = render(<Snapshot />)

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
    mockUseStore
      .mockImplementationOnce(() => ({
        ...props,
        snapshot: {
          project: {
            size: {
              width: 100,
              height: 100
            },
            apiRoute: async () => undefined
          }
        }
      }))
      .mockImplementationOnce(() => mainView)
    const { unmount } = render(<Snapshot />)

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
