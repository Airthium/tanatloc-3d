import React from 'react'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '..'

import PropsContextFiller from '.'

describe('context/propsContextFiller', () => {
  const controls = {}
  const dispatch = jest.fn()
  const contextValue = { dispatch } as unknown as ContextState

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<PropsContextFiller />)
    expect(renderer.scene.children.length).toBe(0)
  })

  test('with context', async () => {
    await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <PropsContextFiller />
      </Context.Provider>
    )

    expect(dispatch).toHaveBeenCalledTimes(9)
  })
})