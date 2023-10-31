describe('context', () => {
  const { window } = global

  beforeAll(() => {
    //@ts-ignore
    delete global.window
  })

  afterAll(() => {
    global.window = window
  })

  test('import', async () => {
    await import('.')
  })
})
