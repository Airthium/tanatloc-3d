import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '@context/renderer'

import PropsContextFiller from '.'

describe('context/propsContextFiller', () => {
  const dispatch = jest.fn()
  const contextValue = { dispatch } as unknown as ContextState

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<PropsContextFiller />)
    expect(renderer.scene.children.length).toBe(0)

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <PropsContextFiller />
      </Context.Provider>
    )

    expect(dispatch).toHaveBeenCalledTimes(9)

    await renderer.unmount()
  })
})
