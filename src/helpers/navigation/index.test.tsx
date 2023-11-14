import { Euler, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '@context'

import Navigation from '.'

jest.mock('../arrow', () => () => <mesh />)

describe('helpers/navigation', () => {
  const contextValue = {
    mainView: {
      camera: {
        aspect: 1,
        position: new Vector3(0, 0, 5),
        up: new Vector3(0, 0, 1),
        rotation: new Euler(0, 0, 0)
      },
      controls: {
        target: new Vector3(0, 0, 0)
      }
    },
    geometry: {
      dimension: 3
    },
    settings: {
      colors: {}
    }
  } as unknown as ContextState

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Navigation />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Navigation />
      </Context.Provider>
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    // Events
    const face1 = group.children[2]
    const face2 = group.children[3]

    await renderer.fireEvent(face1, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face2, 'pointerMove', { distance: 2 })
    await renderer.fireEvent(face1, 'click')
    await renderer.fireEvent(face2, 'pointerLeave')
    await renderer.fireEvent(face1, 'pointerLeave')
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })

  test('with context - 2D', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={{ ...contextValue, geometry: { dimension: 2 } }}>
        <Navigation />
      </Context.Provider>
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    // Events
    const face1 = group.children[2]
    const face2 = group.children[3]

    await renderer.fireEvent(face1, 'pointerMove', { distance: 1 })
    await renderer.fireEvent(face2, 'pointerMove', { distance: 2 })
    await renderer.fireEvent(face1, 'click')
    await renderer.fireEvent(face2, 'pointerLeave')
    await renderer.fireEvent(face1, 'pointerLeave')
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })

  test('with context - no camera', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{
          ...contextValue,
          mainView: {
            ...contextValue.mainView,
            camera: undefined
          }
        }}
      >
        <Navigation />
      </Context.Provider>
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)

    // Events
    const face1 = group.children[2]
    await renderer.fireEvent(face1, 'click')

    await renderer.unmount()
  })
})
