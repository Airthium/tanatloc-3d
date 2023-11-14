import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from '@context'

import RendererWithContext, { Renderer } from '.'

jest.mock('@react-three/fiber', () => ({
  Canvas: (props: any) => <div>{props.children}</div>
}))

jest.mock('@react-three/drei', () => ({
  Hud: (props: any) => <div>{props.children}</div>,
  PerspectiveCamera: () => <div />,
  TrackballControls: (props: any) => (
    <div
      role="TrackballControls"
      onClick={props.onChange}
      onKeyUp={console.log}
    />
  )
}))

jest.mock('../context/mainContextFiller', () => () => <div />)
jest.mock('../context/propsContextFiller', () => () => <div />)

jest.mock('../helpers/frameRate', () => () => <div />)
jest.mock('../helpers/navigation', () => () => <div />)
jest.mock('../helpers/grid', () => () => <div />)
jest.mock('../helpers/zoomToSelection', () => () => <div />)
jest.mock('../helpers/sectionView', () => () => <div />)
jest.mock('../helpers/colorbar', () => () => <div />)
jest.mock('../helpers/light', () => () => <div />)

jest.mock('../header', () => () => <div />)
jest.mock('./parts', () => () => <div />)

describe('RendererWithContext', () => {
  test('render', () => {
    const { unmount } = render(<RendererWithContext />)

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
    const { unmount } = render(<Renderer />)

    unmount()
  })

  test('controls update', () => {
    const { unmount } = render(<Renderer />)

    const trackballControls = screen.getByRole('TrackballControls')
    fireEvent.click(trackballControls)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<Renderer />)

    fireEvent.resize(window)

    unmount()
  })

  test('oneResult', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <Renderer />
      </Context.Provider>
    )

    unmount()
  })
})
