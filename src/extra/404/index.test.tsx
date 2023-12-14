import ReactThreeTestRenderer from '@react-three/test-renderer'

import _404, { _404Render } from '.'

describe('extra/404', () => {
  test('_404', async () => {
    const renderer = await ReactThreeTestRenderer.create(<_404 />)

    await renderer.unmount()
  })

  test('_404Render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<_404Render />)

    await renderer.unmount()
  })
})
