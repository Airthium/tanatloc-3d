import sign from './sign'

describe('tools/sign', () => {
  test('1', () => {
    expect(sign(10)).toBe(1)
  })

  test('0', () => {
    expect(sign(0)).toBe(1)
  })

  test('-1', () => {
    expect(sign(-5)).toBe(-1)
  })
})
