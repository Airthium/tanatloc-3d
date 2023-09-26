import { ReactNode, forwardRef, useImperativeHandle } from 'react'

import { View } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

/**
 * Props & ref
 */
export interface ViewWithRefProps {
  index: number
  track: React.MutableRefObject<HTMLElement>
  children: ReactNode
}

export interface ViewWithRefRef {
  scene: THREE.Scene
  camera: THREE.Camera
}

/**
 * Three forward ref
 */
const ThreeForwardRef = forwardRef(
  (_props, ref: React.ForwardedRef<ViewWithRefRef>) => {
    const { scene, camera } = useThree()
    useImperativeHandle(
      ref,
      () => ({
        scene,
        camera,
      }),
      [scene, camera]
    )
    return null
  }
)

/**
 * View with ref
 * @param props Props
 * @param ref Ref
 */
const ViewWithRef = forwardRef(
  (
    { index, track, children }: ViewWithRefProps,
    ref: React.ForwardedRef<ViewWithRefRef>
  ): React.JSX.Element => {
    return (
      <View index={index} track={track}>
        <ThreeForwardRef ref={ref} />
        {children}
      </View>
    )
  }
)

export default ViewWithRef
