describe('store', () => {
  const { window } = global

  beforeAll(() => {
    //@ts-expect-error window is not optional
    delete global.window
  })

  afterAll(() => {
    global.window = window
  })

  test('exists', async () => {
    await import('.')
  })
})
