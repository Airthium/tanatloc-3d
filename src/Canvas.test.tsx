import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Context, ContextState } from './context'

import Canvas, { MyCanvas } from './Canvas'

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

describe('Canvas', () => {
  const contextValue = {
    props: { parts: [{ summary: { type: 'result' } }] },
    geometry: {
      dimension: 3
    }
  } as unknown as ContextState

  test('render Canvas', () => {
    const { unmount } = render(<Canvas />)

    unmount()
  })

  test('render', () => {
    const { unmount } = render(<MyCanvas />)

    unmount()
  })

  test('controls update', () => {
    const { unmount } = render(<MyCanvas />)

    const trackballControls = screen.getByRole('TrackballControls')
    fireEvent.click(trackballControls)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<MyCanvas />)

    fireEvent.resize(window)

    unmount()
  })

  test('oneResult', () => {
    const { unmount } = render(
      <Context.Provider value={contextValue}>
        <MyCanvas />
      </Context.Provider>
    )

    unmount()
  })
})
