const mockSet = jest.fn()
jest.mock('zustand', () => ({
  create: (callback: Function) => {
    const res = callback(mockSet)
    res.setProps({})
    res.setMainView({})
  }
}))

describe('store', () => {
  test('set', async () => {
    await import('.')
    expect(mockSet).toHaveBeenCalledTimes(2)
  })
})
