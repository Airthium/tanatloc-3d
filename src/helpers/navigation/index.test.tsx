import React from 'react'
import { Euler, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '../../context'

import Navigation from '.'

jest.mock('../arrow', () => () => <mesh />)

describe('helpers/navigation', () => {
  const contextValue = {
    mainView: {
      camera: {
        aspect: 1,
        position: new Vector3(0, 0, 5),
        rotation: new Euler(0, 0, 0)
      },
      controls: {}
    },
    geometry: {
      dimension: 3
    }
  } as unknown as ContextState

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Navigation />)
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Navigation')

    await renderer.advanceFrames(1, 1)
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
    // TODO
  })
})
