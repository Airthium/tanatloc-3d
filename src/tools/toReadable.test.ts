import toReadable from './toReadable'

describe('tools/toReadable', () => {
  test('run', () => {
    let value = toReadable(1e-13)
    expect(value).toBe('0')

    value = toReadable(1e-4)
    expect(value).toBe('1.00e-4')

    value = toReadable(1e4)
    expect(value).toBe('1.00e+4')

    value = toReadable(1e-2)
    expect(value).toBe('0.01')
  })
})
