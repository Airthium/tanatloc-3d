import React from 'react'
import { Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '../../context'

import Light from '.'

describe('helpers/light', () => {
  const contextValue = {
    mainView: {
      camera: {
        position: new Vector3(0, 0, 5),
        up: new Vector3(0, 0, 1)
      },
      controls: {
        target: new Vector3(0, 0, 0)
      }
    },
    settings: {
      light: {}
    }
  } as unknown as ContextState

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Light />)
    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Light')

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Light />
      </Context.Provider>
    )
    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Light')

    await renderer.unmount()
  })
})
