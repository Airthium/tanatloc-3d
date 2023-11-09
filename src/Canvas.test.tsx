import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from './context'

import Tanatloc3DWithContext, { Tanatloc3D } from './Canvas'

jest.mock('@react-three/fiber', () => ({
  Canvas: (props: any) => <div>{props.children}</div>
}))

jest.mock('@react-three/drei', () => ({
  Hud: (props: any) => <div>{props.children}</div>,
  PerspectiveCamera: () => <div />,
  TrackballControls: (props: any) => (
    <div role="TrackballControls" onClick={props.onChange} />
  )
}))

jest.mock('./context/mainContextFiller', () => () => <div />)
jest.mock('./context/propsContextFiller', () => () => <div />)

jest.mock('./helpers/frameRate', () => () => <div />)
jest.mock('./helpers/navigation', () => () => <div />)
jest.mock('./helpers/grid', () => () => <div />)
jest.mock('./helpers/zoomToSelection', () => () => <div />)
jest.mock('./helpers/sectionView', () => () => <div />)
jest.mock('./helpers/colorbar', () => () => <div />)
jest.mock('./helpers/light', () => () => <div />)

jest.mock('./header', () => () => <div />)
jest.mock('./Parts', () => () => <div />)

describe('Tanatloc3DWithContext', () => {
  test('render', () => {
    const { unmount } = render(<Tanatloc3DWithContext />)

    unmount()
  })
})

describe('Tanatloc3D', () => {
  const contextValue = {
    props: { parts: [{ summary: { type: 'result' } }] },
    geometry: {
      dimension: 3
    }
  } as unknown as ContextState

  test('render', () => {
    const { unmount } = render(<Tanatloc3D />)

    unmount()
  })

  test('controls update', () => {
    const { unmount } = render(<Tanatloc3D />)

    const trackballControls = screen.getByRole('TrackballControls')
    fireEvent.click(trackballControls)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<Tanatloc3D />)

    fireEvent.resize(window)

    unmount()
  })

  test('oneResult', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Tanatloc3D />
      </Context.Provider>
    )

    unmount()
  })
})
