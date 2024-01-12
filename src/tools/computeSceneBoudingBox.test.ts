import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three'
import computeSceneBoundingBox from './computeSceneBoundingBox'

describe('tools/computeSceneBoundingBox', () => {
  const geometry = new BoxGeometry(2, 2, 2)
  const material = new MeshBasicMaterial()
  const mesh1 = new Mesh(geometry, material)
  //@ts-expect-error type is read only
  mesh1.type = 'Part'

  const mesh2 = new Mesh()

  // Scene
  const children = [mesh1, mesh2]

  test('run', () => {
    const box = computeSceneBoundingBox(children)
    expect(box.min).toEqual(new Vector3(-1, -1, -1))
    expect(box.max).toEqual(new Vector3(1, 1, 1))
  })

  test('empty', () => {
    const box = computeSceneBoundingBox([])
    expect(box.min).toEqual(new Vector3(0, 0, 0))
    expect(box.max).toEqual(new Vector3(0, 0, 0))
  })
})
