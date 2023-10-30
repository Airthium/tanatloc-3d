import React from 'react'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import FrameRate from '.'

describe('helpers/frameRate', () => {
  test('render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<FrameRate />)

    await renderer.unmount()
  })
})
