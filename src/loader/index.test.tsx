import React from 'react'
import { render } from '@testing-library/react'

import { MyCanvasPart } from '../context'

import PartLoader from '.'

jest.mock('three/examples/jsm/loaders/GLTFLoader')

jest.mock('three/examples/jsm/math/Lut')

jest.mock('../tools/zoomToFit', () => () => undefined)

describe('loader', () => {
  const part = {} as MyCanvasPart

  test('render', () => {
    const { unmount } = render(<PartLoader part={part} uuid="uuid" />)

    unmount()
  })
})
