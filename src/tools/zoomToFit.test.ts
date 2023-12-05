import { Box3, Vector3 } from 'three'
import { TrackballControlsProps } from '@react-three/drei'

import zoomToFit from './zoomToFit'

const mockBox = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1))
jest.mock('./computeSceneBoundingBox', () => () => mockBox)

describe('tools/zoomToFit', () => {
  const scene = { children: [] } as unknown as THREE.Scene
  const camera = {
    position: new Vector3(0, 0, 5),
    updateProjectionMatrix: jest.fn
  } as unknown as THREE.PerspectiveCamera
  const controls = {
    target: new Vector3(0, 0, 0)
  } as TrackballControlsProps
  test('undefined', () => {
    zoomToFit(undefined, undefined, undefined)
  })

  test('run', () => {
    zoomToFit(scene.children, camera, controls)
  })
})
