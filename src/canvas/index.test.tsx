import { fireEvent, render, screen } from '@testing-library/react'

import Canvas from '.'

jest.mock('@react-three/fiber', () => ({
  Canvas: (props: any) => <div>{props.children}</div>
}))

const trackballControlsRole = 'TrackballControls'
jest.mock('@react-three/drei', () => ({
  Hud: (props: any) => <div>{props.children}</div>,
  PerspectiveCamera: () => <div />,
  TrackballControls: (props: any) => (
    <button
      role={trackballControlsRole}
      onClick={props.onChange}
      onKeyUp={console.debug}
    />
  )
}))

const mockIsWebGLAvailable = jest.fn()
jest.mock('three/examples/jsm/capabilities/WebGL', () => ({
  isWebGL2Available: () => mockIsWebGLAvailable()
}))

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

jest.mock('@store/mainStoreFiller', () => () => <div />)

jest.mock('@helpers/frameRate', () => () => <div />)
jest.mock('@helpers/navigation', () => () => <div />)
jest.mock('@helpers/grid', () => () => <div />)
jest.mock('@helpers/zoomToSelection', () => () => <div />)
jest.mock('@helpers/sectionView', () => () => <div />)
jest.mock('@helpers/computeLut', () => () => <div />)
jest.mock('@helpers/colorbar', () => () => <div />)
jest.mock('@helpers/light', () => () => <div />)
jest.mock('@helpers/point', () => () => <div />)

jest.mock('@extra/404', () => ({
  _404Render: () => <div />
}))

jest.mock('@extra/background', () => ({
  BackgroundRender: () => <div />
}))

jest.mock('./parts', () => () => <div />)

describe('Tanatloc3D', () => {
  const props = { parts: [{ summary: { type: 'result' } }] }
  const geometry = {
    dimension: 3
  }

  beforeEach(() => {
    mockIsWebGLAvailable.mockReset()
    mockIsWebGLAvailable.mockImplementation(() => true)

    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('render', () => {
    const { unmount } = render(<Canvas />)

    unmount()
  })

  test('controls update', () => {
    const { unmount } = render(<Canvas />)

    const trackballControls = screen.getByRole('TrackballControls')
    fireEvent.click(trackballControls)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<Canvas />)

    fireEvent.resize(window)

    unmount()
  })

  test('oneResult', () => {
    mockUseStore.mockImplementation(() => ({ ...props, ...geometry }))
    const { unmount } = render(<Canvas />)

    unmount()
  })

  test('404', () => {
    mockUseStore.mockImplementation(() => ({ notFound: true }))
    const { unmount } = render(<Canvas />)

    unmount()
  })

  test('Background', () => {
    mockUseStore.mockImplementation(() => ({ background: true }))
    const { unmount } = render(<Canvas />)

    unmount()
  })

  test('no WebGL', () => {
    mockIsWebGLAvailable.mockImplementation(() => false)
    const { unmount } = render(<Canvas />)

    unmount()
  })

  test('no WebGL, with props', () => {
    mockIsWebGLAvailable.mockImplementation(() => false)
    const { unmount } = render(<Canvas toWebGL={console.debug} />)

    unmount()
  })
})
