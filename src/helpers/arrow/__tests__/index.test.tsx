import { Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import Arrow from '..'

jest.mock('../../staticText', () => () => <mesh type="StaticText" />)

describe('helpers/arrow', () => {
  const origin = new Vector3(0, 0, 0)
  const direction = new Vector3(1, 0, 0)
  const lenght = 1
  const color = 'red'
  const text = 'text'

  const yPlus = new Vector3(0, 1, 0)
  const yMinux = new Vector3(0, -1, 0)

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Arrow />)
    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Arrow')
  })

  test('full render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Arrow
        origin={origin}
        direction={direction}
        length={lenght}
        color={color}
        text={text}
      />
    )
    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Arrow')
    const child = mesh.children[1]
    expect(child.type).toEqual('StaticText')
  })

  test('near y direction', async () => {
    const renderer1 = await ReactThreeTestRenderer.create(
      <Arrow direction={yPlus} />
    )
    const mesh1 = renderer1.scene.children[0]
    expect(mesh1.type).toBe('Arrow')

    const renderer2 = await ReactThreeTestRenderer.create(
      <Arrow direction={yMinux} />
    )
    const mesh2 = renderer2.scene.children[0]
    expect(mesh2.type).toBe('Arrow')
  })
})
