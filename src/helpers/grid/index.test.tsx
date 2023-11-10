import { Box3, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '@context/renderer'

import Grid from '.'

jest.mock('@react-three/drei', () => ({
  Line: () => <mesh />
}))

const mockBox = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1))
jest.mock('../../tools/computeSceneBoundingBox', () => () => mockBox)

jest.mock('../../tools/toReadable', () => () => 'value')

jest.mock('../../tools/sign', () => () => 1)

jest.mock('../staticText', () => () => <mesh />)

describe('helpers/grid', () => {
  const update = 1

  const contextValue = {
    mainView: {
      scene: {
        children: []
      },
      camera: {
        getWorldDirection: jest.fn()
      }
    },
    display: {
      grid: true
    },
    geometry: {
      dimension: 3
    }
  } as unknown as ContextState

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Grid update={update} />
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Grid')

    await renderer.unmount()
  })

  test('with context', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider value={contextValue}>
        <Grid update={update} />
      </Context.Provider>
    )
    const group = renderer.scene.children[0]
    expect(group.type).toBe('Grid')

    await renderer.unmount()
  })

  test('no display', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Context.Provider
        value={{ ...contextValue, display: { grid: false, transparent: true } }}
      >
        <Grid update={update} />
      </Context.Provider>
    )
    const children = renderer.scene.children
    expect(children).toEqual([])

    await renderer.unmount()
  })
})
