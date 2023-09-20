import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, TrackballControls, View } from '@react-three/drei'

import NavigationHelper from './helpers/NavigationHelper'

import style from './Canvas.module.css'
import { useRef, useState } from 'react'

const MyCanvas = (): React.JSX.Element => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null!)
  const mainViewRef = useRef<HTMLDivElement>(null!)
  const mainViewCamera = useRef<THREE.PerspectiveCamera>(null!)
  const navigationViewRef = useRef<HTMLDivElement>(null!)

  // State
  const [navigationRotation, setNavigationRotation] = useState<THREE.Euler>()

  const onMainViewControls = () => {
    const rotation = mainViewCamera.current.rotation
    setNavigationRotation(rotation)
  }

  return (
    <div ref={containerRef} className={style.container}>
      <div ref={mainViewRef} className={style.mainView} />
      <div ref={navigationViewRef} className={style.navigationView} />
      <Canvas eventSource={containerRef}>
        <View index={1} track={mainViewRef}>
          <PerspectiveCamera
            ref={mainViewCamera}
            makeDefault
            position={[0, 0, 5]}
          />
          <TrackballControls onChange={onMainViewControls} />
          <ambientLight />
          <mesh>
            <coneGeometry />
            <meshStandardMaterial />
          </mesh>
        </View>
        <View index={2} track={navigationViewRef}>
          <NavigationHelper
            mainViewCamera={mainViewCamera.current}
            rotation={navigationRotation}
          />
        </View>
      </Canvas>
    </div>
  )
}

export default MyCanvas
