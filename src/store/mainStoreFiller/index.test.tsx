import ReactThreeTestRenderer from '@react-three/test-renderer'

const mockSetState = jest.fn()
const mockUseStore = jest.fn()
jest.mock('@store', () => {
  const useStore = (callback: Function) => mockUseStore(callback)
  useStore.setState = () => mockSetState()
  return useStore
})

import MainStoreFiller from '.'

describe('store/mainStoreFiller', () => {
  const controls = {}

  beforeEach(() => {
    mockSetState.mockReset()
  })

  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<MainStoreFiller />)
    expect(renderer.scene.children.length).toBe(0)

    await renderer.unmount()
  })

  test('with controls', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <MainStoreFiller controls={controls} />
    )
    expect(renderer.scene.children.length).toBe(0)

    expect(mockSetState).toHaveBeenCalledTimes(1)

    await renderer.unmount()
  })
})
