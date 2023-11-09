import ReactThreeTestRenderer from '@react-three/test-renderer'
import { Vector3 } from 'three'

import StaticText from '.'

describe('helpers/staticText', () => {
  const position = new Vector3(0, 0, 0)
  const fontSize = 16
  const children = 'text'

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<StaticText />)
    const scene = renderer.scene
    expect(scene).toBeDefined()

    await renderer.advanceFrames(1, 1)

    await renderer.unmount()
  })

  test('full render', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <StaticText position={position} fontSize={fontSize}>
        {children}
      </StaticText>
    )
    const scene = renderer.scene
    expect(scene).toBeDefined()

    await renderer.advanceFrames(1, 1)

    await renderer.unmount()
  })
})
