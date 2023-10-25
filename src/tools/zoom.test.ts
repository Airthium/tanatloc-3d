import { TrackballControlsProps } from '@react-three/drei'
import zoom from './zoom'
import { Mesh, Vector3 } from 'three'

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
