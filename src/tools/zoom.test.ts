import * as THREE from 'three'
import { TrackballControlsProps } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'

import zoom from './zoom'

describe('tools/zoom', () => {
  const camera = {
    position: new Vector3(0, 0, 5)
  } as THREE.PerspectiveCamera
  const controls = {
    object: new Mesh(),
    target: new Vector3(0, 1, 0)
  } as unknown as TrackballControlsProps

  test('run', () => {
    zoom(camera, controls, 1)
  })

  test('undefined', () => {
    zoom(undefined, undefined, 1)
  })
})
