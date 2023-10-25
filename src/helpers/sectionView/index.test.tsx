import React from 'react'
import { Box3, Vector3 } from 'three'
import ReactThreeTestRenderer from '@react-three/test-renderer'

import { Context, ContextState } from '../../context'

import SectionView from '.'

const mockBox = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1))
jest.mock('../../tools/computeSceneBoundingBox', () => () => mockBox)

describe('helpers/sectionView', () => {
  const dispatch = jest.fn()
  const contextValue = {
    mainView: {
      scene: {},
      camera: {},
      controls: {}
    },
    sectionView: {
      enabled: true
    },
    dispatch
  } as unknown as ContextState

  beforeEach(() => {
    dispatch.mockReset()
  })

  test('empty render', async () => {
    const renderer = await ReactThreeTestRenderer.create(<SectionView />)
    const children = renderer.scene.children
    expect(children).toEqual([])
  })

  //   test('with context', async () => {
  //     const renderer = await ReactThreeTestRenderer.create(
  //       <Context.Provider value={contextValue}>
  //         <SectionView />
  //       </Context.Provider>
  //     )
  //     const children = renderer.scene.children
  //     expect(children).toEqual([])
  //   })
})
