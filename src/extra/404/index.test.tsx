import ReactThreeTestRenderer from '@react-three/test-renderer'

import NotFound, { NotFoundRender } from '.'

describe('extra/404', () => {
  test('NotFound', async () => {
    const renderer = await ReactThreeTestRenderer.create(<NotFound />)

    await renderer.unmount()
  })

  test('NotFoundRender', async () => {
    const renderer = await ReactThreeTestRenderer.create(<NotFoundRender />)

    await renderer.unmount()
  })
})
