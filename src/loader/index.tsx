import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Buffer } from 'buffer'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

const GLTFModule = import('three/examples/jsm/loaders/GLTFLoader.js')

import { Tanatloc3DPart } from '@index'

import { Context } from '@context'

import zoomToFit from '@tools/zoomToFit'

import Geometry2D from './geometry2D'
import Geometry3D from './geometry3D'
import Mesh from './mesh'
import Result from './result'

/**
 * Props
 */
export interface PartLoaderProps {
  part: Tanatloc3DPart
  uuid: string
}

export interface MeshesProps {
  scene: GLTF['scene']
}

/**
 * Meshes
 * @param props
 * @returns Meshes
 */
const Meshes = ({ scene }: MeshesProps): React.JSX.Element => {
  // Type
  const type = useMemo(
    () => scene.userData.type as string,
    [scene.userData.type]
  )

  /**
   * Render
   */
  switch (type) {
    case 'geometry2D':
      return <Geometry2D scene={scene} />
    case 'geometry3D':
      return <Geometry3D scene={scene} />
    case 'mesh':
      return <Mesh scene={scene} />
    case 'result':
      return <Result scene={scene} />
    default:
      return <></>
  }
}

/**
 * PartLoader
 * @param props Props
 * @returns PartLoader
 */
const PartLoader = ({ part }: PartLoaderProps): React.JSX.Element | null => {
  // Ref
  const currentGLTF = useRef<GLTF>()

  // State
  const [gltf, setGltf] = useState<GLTF>()

  // Context
  const { mainView } = useContext(Context)

  // GLTF load
  useEffect(() => {
    const load = async () => {
      const GLTFLoader = (await GLTFModule).GLTFLoader

      const blob = new Blob([Buffer.from(part.buffer)])
      const url = URL.createObjectURL(blob)
      const loader = new GLTFLoader()
      loader.load(
        url,
        setGltf,
        (progress) =>
          console.info(
            'Loading part ' + (progress.loaded / progress.total) * 100 + '%'
          ),
        console.error
      )
    }

    load().catch(console.error)
  }, [part])

  // Zoom to fit
  useEffect(() => {
    if (!mainView.scene || !mainView.camera || !mainView.controls) return
    if (currentGLTF.current === gltf) return
    currentGLTF.current = gltf

    zoomToFit(mainView.scene, mainView.camera, mainView.controls)
  }, [mainView.scene, mainView.camera, mainView.controls, gltf])

  /**
   * Render
   */
  return gltf?.scene ? (
    <mesh
      type="Part"
      uuid={part.summary.uuid}
      userData={gltf.scene.userData}
      name={part.extra?.name}
    >
      <Meshes scene={gltf.scene} />
    </mesh>
  ) : null
}

export default PartLoader
