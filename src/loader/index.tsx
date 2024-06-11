import { useEffect, useMemo, useRef, useState } from 'react'
import { Buffer } from 'buffer'

import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Tanatloc3DPart } from '@index'

import useStore from '@store'

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
const Meshes: React.FunctionComponent<MeshesProps> = ({ scene }) => {
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
const PartLoader: React.FunctionComponent<PartLoaderProps> = ({ part }) => {
  // Ref
  const currentGLTF = useRef<GLTF>()

  // State
  const [gltf, setGltf] = useState<GLTF>()

  // Store
  const { camera, controls, scene } = useStore((s) => s.mainView)

  // GLTF load
  useEffect(() => {
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
  }, [part])

  // Zoom to fit
  useEffect(() => {
    if (!scene?.children.length || !camera || !controls) return
    if (currentGLTF.current === gltf) return
    currentGLTF.current = gltf

    zoomToFit(scene.children, camera, controls)
  }, [camera, controls, scene?.children, scene?.children.length, gltf])

  // UUID
  const uuid = useMemo(() => {
    return part.summary.uuid
  }, [part])

  // Extra
  const name = useMemo(() => {
    return part.extra?.name
  }, [part])

  /**
   * Render
   */
  if (!gltf?.scene) return null
  return (
    <mesh type="Part" uuid={uuid} userData={gltf.scene.userData} name={name}>
      <Meshes scene={gltf.scene} />
    </mesh>
  )
}

export default PartLoader
