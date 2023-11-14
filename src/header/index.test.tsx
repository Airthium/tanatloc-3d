import { screen, render } from '@testing-library/react'

import { Context, ContextState } from '@context'

import Header from '.'

jest.mock('./snapshot', () => () => <div />)
jest.mock('./display', () => () => <div />)
jest.mock('./zoom', () => () => <div />)
jest.mock('./sectionView', () => () => <div />)
jest.mock('./colorbar', () => () => <div />)
jest.mock('./results', () => () => <div />)
jest.mock('./settings', () => () => <div />)

describe('header', () => {
  const contextValue = {
    props: {
      data: true,
      postProcessing: true
    },
    dispatch: jest.fn()
  } as unknown as ContextState
  const oneResult = false

  test('render', () => {
    const { unmount } = render(<Header oneResult={oneResult} />)

    unmount()
  })

  test('width data & postprocessing', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Header oneResult={oneResult} />
      </Context.Provider>
    )

    expect(screen.getByRole('button', { name: 'database' }))
    expect(screen.getByRole('button', { name: 'filter' }))

    unmount()
  })

  test('width data', () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          props: {
            ...contextValue.props,
            postProcessing: false
          }
        }}
      >
        <Header oneResult={oneResult} />
      </Context.Provider>
    )

    expect(screen.getByRole('button', { name: 'database' }))

    unmount()
  })

  test('width postprocessing', () => {
    const { unmount } = render(
      <Context.Provider
        value={{
          ...contextValue,
          props: {
            ...contextValue.props,
            data: false
          }
        }}
      >
        <Header oneResult={oneResult} />
      </Context.Provider>
    )

    expect(screen.getByRole('button', { name: 'filter' }))

    unmount()
  })

  test('with one result', () => {
    const { unmount } = render(<Header oneResult={true} />)

    unmount()
  })
})
