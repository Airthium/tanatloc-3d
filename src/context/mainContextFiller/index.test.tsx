import React from 'react'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '..'

import MainContextFiller from '.'

describe('context/mainContextFiller', () => {
  const controls = {}
  const dispatch = jest.fn()
  const contextValue = { dispatch } as unknown as ContextState

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<MainContextFiller />)
    expect(renderer.scene.children.length).toBe(0)

    await renderer.unmount()
  })

  test('with controls', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <MainContextFiller controls={controls} />
    )
    expect(renderer.scene.children.length).toBe(0)

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <MainContextFiller controls={controls} />
      </Context.Provider>
    )

    expect(dispatch).toHaveBeenCalledTimes(4)

    await renderer.unmount()
  })
})
