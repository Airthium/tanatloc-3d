import Tanatloc3D from '.'

jest.mock('./canvas', () => () => <div />)

jest.mock('./renderer', () => () => <div />)

describe('index', () => {
  test('defined', () => {
    expect(Tanatloc3D.Canvas).toBeDefined()
    expect(Tanatloc3D.Renderer).toBeDefined()
  })
})
