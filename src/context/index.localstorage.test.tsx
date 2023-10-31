describe('context', () => {
  beforeAll(() => {
    localStorage.setItem(
      'tanatloc-3d-settings',
      JSON.stringify({ settings: true })
    )
  })

  afterAll(() => {
    localStorage.removeItem('tanatloc-3d-settings')
  })

  test('import', async () => {
    await import('.')
  })
})
