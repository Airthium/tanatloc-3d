describe('store', () => {
  const { window } = global

  beforeAll(() => {
    //@ts-ignore
    delete global.window
  })

  afterAll(() => {
    global.window = window
  })

  test('exists', async () => {
    await import('.')
  })
})
