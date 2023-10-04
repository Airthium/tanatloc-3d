import { Suspense, useContext } from 'react'
import { Buffer } from 'buffer'

import { Context, MyCanvasPart } from '../context'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { useGLTF } from '@react-three/drei'

export interface PartLoaderProps {
  part: MyCanvasPart
}

const Part = ({ part }: PartLoaderProps): React.JSX.Element => {
  const blob = new Blob([Buffer.from(part.buffer)])
  const url = URL.createObjectURL(blob)
  console.log(url)
  //   const gltf = useLoader(GLTFLoader, url)
  console.log('ok')

  //   console.log(gltf.scene)

  //   return <primitive object={gltf.scene} />
  return <></>
}

/**
 * PartLoader
 * @param props Props
 * @returns PartLoader
 */
export const PartLoader = ({ part }: PartLoaderProps): React.JSX.Element => {
  const { display, sectionView } = useContext(Context)

  //   console.log(part.summary.type)
  //TODO GLTF loader
  //   useGLTF()

  /**
   * Render
   */
  return (
    <Suspense fallback={null}>
      <Part part={part} />
    </Suspense>
    // <mesh type="Part" uuid={part.summary.uuid} name={part.extra?.name}>
    //   <tetrahedronGeometry />
    //   <meshPhysicalMaterial
    //     metalness={0.5}
    //     roughness={0.5}
    //     transparent
    //     opacity={display.transparent ? 0.5 : 1}
    //     clippingPlanes={
    //       sectionView.enabled && sectionView.clippingPlane
    //         ? [sectionView.clippingPlane]
    //         : []
    //     }
    //   />
    // </mesh>
  )
}
