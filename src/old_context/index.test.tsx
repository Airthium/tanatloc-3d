import { render } from '@testing-library/react'

import Provider, { actionTypes, initialContextState, reducer } from '.'
import { Tanatloc3DPart } from '@index'

describe('context', () => {
  test('render', () => {
    const { unmount } = render(<Provider>children</Provider>)

    unmount()
  })

  test('initialState', () => {
    initialContextState.dispatch({ type: 'type', value: 'value' })
  })

  test('reducer', () => {
    const parts: Tanatloc3DPart[] = []
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSPARTS,
        value: parts
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, parts }
    })

    const selection = 'faces'
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSSELECTION,
        value: selection
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, selection }
    })

    const data = true
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSDATA,
        value: data
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, data }
    })

    const postProcessing = true
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSPOSTPROCESSING,
        value: postProcessing
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, postProcessing }
    })

    const project = {
      apiRoute: async () => undefined
    }
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSSNAPSHOTPROJECT,
        value: project
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, snapshot: { project } }
    })

    const onHighlight = jest.fn
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSONHIGHLIGHT,
        value: onHighlight
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, onHighlight }
    })

    const onSelect = jest.fn
    expect(
      reducer(initialContextState, {
        type: actionTypes.SETPROPSONSELECT,
        value: onSelect
      })
    ).toEqual({
      ...initialContextState,
      props: { ...initialContextState.props, onSelect }
    })
  })

  const onData = jest.fn
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETPROPSONDATA,
      value: onData
    })
  ).toEqual({
    ...initialContextState,
    props: { ...initialContextState.props, onData }
  })

  const onPostProcessing = jest.fn
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETPROPSONPOSTPROCESSING,
      value: onPostProcessing
    })
  ).toEqual({
    ...initialContextState,
    props: { ...initialContextState.props, onPostProcessing }
  })

  const gl = {}
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETMAINVIEWGL,
      value: gl
    })
  ).toEqual({
    ...initialContextState,
    mainView: { ...initialContextState.mainView, gl }
  })

  const scene = {}
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETMAINVIEWSCENE,
      value: scene
    })
  ).toEqual({
    ...initialContextState,
    mainView: { ...initialContextState.mainView, scene }
  })

  const camera = {}
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETMAINVIEWCAMERA,
      value: camera
    })
  ).toEqual({
    ...initialContextState,
    mainView: { ...initialContextState.mainView, camera }
  })

  const controls = {}
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETMAINVIEWCONTROLS,
      value: controls
    })
  ).toEqual({
    ...initialContextState,
    mainView: { ...initialContextState.mainView, controls }
  })

  const transparent = true
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETDISPLAYTRANSPARENT,
      value: transparent
    })
  ).toEqual({
    ...initialContextState,
    display: { ...initialContextState.display, transparent }
  })

  const grid = true
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETDISPLAYGRID,
      value: grid
    })
  ).toEqual({
    ...initialContextState,
    display: { ...initialContextState.display, grid }
  })

  const enabled = true
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETZOOMTOSELECTIONENABLED,
      value: enabled
    })
  ).toEqual({
    ...initialContextState,
    zoomToSelection: { ...initialContextState.zoomToSelection, enabled }
  })

  expect(
    reducer(initialContextState, {
      type: actionTypes.SETSECTIONVIEWENABLED,
      value: enabled
    })
  ).toEqual({
    ...initialContextState,
    sectionView: { ...initialContextState.sectionView, enabled }
  })

  const clippingPlane = 'plane'
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETSECTIONVIEWCLIPPINGPLANE,
      value: clippingPlane
    })
  ).toEqual({
    ...initialContextState,
    sectionView: { ...initialContextState.sectionView, clippingPlane }
  })

  const hidePlane = true
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETSECTIONVIEWHIDEPLANE,
      value: hidePlane
    })
  ).toEqual({
    ...initialContextState,
    sectionView: { ...initialContextState.sectionView, hidePlane }
  })

  const snap = 'snap'
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETSECTIONVIEWSNAP,
      value: snap
    })
  ).toEqual({
    ...initialContextState,
    sectionView: { ...initialContextState.sectionView, snap }
  })

  const flip = 1
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETSECTIONVIEWFLIP,
      value: flip
    })
  ).toEqual({
    ...initialContextState,
    sectionView: { ...initialContextState.sectionView, flip }
  })

  const dimension = 3
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETGEOMETRYDIMENSION,
      value: dimension
    })
  ).toEqual({
    ...initialContextState,
    geometry: { ...initialContextState.geometry, dimension }
  })

  const meshVisible = true
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETRESULTMESHVISIBLE,
      value: meshVisible
    })
  ).toEqual({
    ...initialContextState,
    result: { ...initialContextState.result, meshVisible }
  })

  const colormap = 'rainbow'
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETLUTCOLORMAP,
      value: colormap
    })
  ).toEqual({
    ...initialContextState,
    lut: { ...initialContextState.lut, colormap }
  })

  const min = 0
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETLUTMIN,
      value: min
    })
  ).toEqual({
    ...initialContextState,
    lut: { ...initialContextState.lut, min }
  })

  const max = 10
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETLUTMAX,
      value: max
    })
  ).toEqual({
    ...initialContextState,
    lut: { ...initialContextState.lut, max }
  })

  const customMin = 1
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETLUTCUSTOMMIN,
      value: customMin
    })
  ).toEqual({
    ...initialContextState,
    lut: { ...initialContextState.lut, customMin }
  })

  const customMax = 99
  expect(
    reducer(initialContextState, {
      type: actionTypes.SETLUTCUSTOMMAX,
      value: customMax
    })
  ).toEqual({
    ...initialContextState,
    lut: { ...initialContextState.lut, customMax }
  })

  expect(
    reducer(initialContextState, {
      type: actionTypes.SETSETTINGS,
      value: {}
    })
  ).toEqual({ ...initialContextState, settings: {} })

  expect(
    reducer(initialContextState, {
      type: 'unknown type',
      value: 0
    })
  ).toEqual(initialContextState)
})
