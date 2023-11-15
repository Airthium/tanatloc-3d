import { setProps, setMainView } from './set'

describe('store/set', () => {
  const set = jest.fn()

  beforeEach(() => {
    set.mockReset()
  })

  test('setProps', () => {
    setProps(set)({})
    expect(set).toHaveBeenCalledTimes(1)
  })

  test('setMainView', () => {
    setMainView(set)({})
    expect(set).toHaveBeenCalledTimes(1)
  })
})
