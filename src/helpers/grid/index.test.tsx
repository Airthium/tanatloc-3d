import { Box3, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import Grid from '.'

const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  return useStore
})

jest.mock('@react-three/drei', () => ({
  Line: () => <mesh />
}))

const mockBox = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1))
jest.mock('@tools/computeSceneBoundingBox', () => () => mockBox)

jest.mock('@tools/toReadable', () => () => 'value')

jest.mock('@tools/sign', () => () => 1)

jest.mock('../staticText', () => () => <mesh />)

describe('helpers/grid', () => {
  const update = 1

  const mainView = {
    scene: {
      children: []
    },
    camera: {
      getWorldDirection: jest.fn()
    }
  }
  const display = {
    grid: true
  }
  const geometry = {
    dimension: 3
  }

  beforeEach(() => {
    mockUseStore.mockImplementation((callback) => {
      callback({})
      return {}
    })
  })

  test('empty render', async () => {
    mockUseStore
      .mockImplementationOnce(() => mainView)
      .mockImplementationOnce(() => display)
      .mockImplementationOnce(() => geometry)
    const renderer = await ReactThreeTestRenderer.create(
      <Grid update={update} />
    )

    await renderer.unmount()
  })

  test('dimension 2', async () => {
    mockUseStore
      .mockImplementationOnce(() => mainView)
      .mockImplementationOnce(() => display)
      .mockImplementationOnce(() => ({ dimension: 2 }))
    const renderer = await ReactThreeTestRenderer.create(
      <Grid update={update} />
    )

    await renderer.unmount()
  })

  test('no display', async () => {
    mockUseStore
      .mockImplementationOnce(() => mainView)
      .mockImplementationOnce(() => ({ grid: false }))
      .mockImplementationOnce(() => geometry)
    const renderer = await ReactThreeTestRenderer.create(
      <Grid update={update} />
    )
    const children = renderer.scene.children
    expect(children).toEqual([])

    await renderer.unmount()
  })
})
