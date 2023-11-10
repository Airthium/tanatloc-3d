import { TrackballControlsProps } from '@react-three/drei'
import { Vector3 } from 'three'

import zoomToRect from './zoomToRect'

const mockIntersectObjects = jest.fn()
jest.mock('three', () => {
  class Raycaster {
    setFromCamera() {
      // Empty
    }
    intersectObjects() {
      return mockIntersectObjects()
    }
  }

  return {
    ...jest.requireActual('three'),
    Raycaster
  }
})

describe('tools/zzomToRect', () => {
  const part = {
    type: 'Part'
  } as THREE.Mesh
  const rect = {
    min: { x: 0, y: 0 },
    max: { x: 10, y: 10 }
  } as THREE.Box2
  const gl = {
    domElement: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100
      })
    }
  } as THREE.WebGLRenderer
  const scene = {
    children: [part]
  } as unknown as THREE.Scene
  const camera = {
    position: new Vector3(0, 0, 5)
  } as THREE.PerspectiveCamera
  const controls = {
    target: new Vector3(0, 0, 0)
  } as TrackballControlsProps

  beforeEach(() => {
    mockIntersectObjects.mockReset()
    mockIntersectObjects.mockImplementation(() => [
      { point: new Vector3(0, 0, 0) }
    ])
  })

  test('run', () => {
    zoomToRect(rect, gl, scene, camera, controls)
  })

  test('too small', () => {
    zoomToRect(
      {
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 }
      } as THREE.Box2,
      gl,
      scene,
      camera,
      controls
    )
  })

  test('empty scene', () => {
    zoomToRect(
      rect,
      gl,
      {
        children: []
      } as unknown as THREE.Scene,
      camera,
      controls
    )
  })

  test('empty intersection', () => {
    mockIntersectObjects.mockImplementation(() => [])
    zoomToRect(rect, gl, scene, camera, controls)
  })
})
