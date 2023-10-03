import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Plane, Vector3 } from 'three'

import { Context } from '../../context'
import { setSectionViewClippingPlane } from '../../context/actions'

import { computeSceneBoundingBox } from '../../tools'
import { ThreeEvent } from '@react-three/fiber'

/**
 * Props
 */
export interface ControlPlaneProps {
  hover?: boolean
  onPointerOver: () => void
  onPointerOut: () => void
}

export interface ControlDomeProps {
  hover?: boolean
  onPointerOver: () => void
  onPointerOut: () => void
}

// Color
const color = 0xfad114

// Hover color
const hoverColor = 0xe98a15

// Default plane normal
const defaultNormal = new Vector3(0, 0, 1)

// Plane
const clippingPlane = new Plane()

/**
 * Control plane
 * @returns ControlPlane
 */
const ControlPlane = ({
  hover,
  onPointerOver,
  onPointerOut
}: ControlPlaneProps) => {
  // State
  const [enabled, setEnabled] = useState<boolean>(false)

  // Context
  const { mainView } = useContext(Context)

  /**
   * On pointer down
   */
  const onPointerDown = useCallback(() => {
    if (!mainView.controls) return

    // Disable controls
    mainView.controls.enabled = false

    // Enable move
    setEnabled(true)
  }, [mainView.controls])

  /**
   * On pointer up
   */
  const onPointerUp = useCallback(() => {
    if (!mainView.controls) return

    // Enable controls
    mainView.controls.enabled = true

    // Disable move
    setEnabled(false)
  }, [mainView.controls])

  /**
   * On pointer out (internal)
   */
  const internalOnPointerOut = useCallback(() => {
    onPointerOut()
    onPointerUp()
  }, [onPointerUp, onPointerOut])

  const onPointerMove = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!enabled) return

      const intersection = event.intersections[0]
      if (!intersection) return

      const point = intersection.point
      const normal = intersection.normal!
      // TODO
    },
    [enabled]
  )

  /**
   * Render
   */
  return (
    <mesh
      onPointerOver={onPointerOver}
      onPointerOut={internalOnPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={hover ? hoverColor : color}
        side={2}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

/**
 * Control dome
 * @returns ControlDome
 */
const ControlDome = ({
  hover,
  onPointerOver,
  onPointerOut
}: ControlDomeProps) => {
  /**
   * Render
   */
  return (
    <mesh onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <sphereGeometry args={[0.2, 32, 32, Math.PI, -Math.PI]} />
      <meshBasicMaterial
        color={hover ? hoverColor : color}
        side={2}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

/**
 * SectionView
 * @returns SectionView
 */
const SectionView = (): React.JSX.Element | null => {
  // Ref
  const ref = useRef<THREE.Group>(null!)

  // State
  const [center, setCenter] = useState<THREE.Vector3>()
  const [scale, setScale] = useState<number>()

  const [hoverPlane, setHoverPlane] = useState<boolean>(false)
  const [hoverDome, setHoverDome] = useState<boolean>(false)

  // Context
  const { mainView, sectionView, dispatch } = useContext(Context)

  /**
   * On pointer over plane
   */
  const onPointerOverPlane = useCallback(() => {
    setHoverPlane(true)
  }, [])

  /**
   * On pointer out plane
   */
  const onPointerOutPlane = useCallback(() => {
    setHoverPlane(false)
  }, [])

  /**
   * On pointer over dome
   */
  const onPointerOverDome = useCallback(() => {
    setHoverDome(true)
    setHoverPlane(false)
  }, [])

  /**
   * On pointer out dome
   */
  const onPointerOutDome = useCallback(() => {
    setHoverDome(false)
  }, [])

  // Intialization
  useEffect(() => {
    dispatch(setSectionViewClippingPlane(clippingPlane))
  }, [dispatch])

  // Start
  useEffect(() => {
    if (!sectionView.enabled) return
    if (!mainView.scene) return

    const boundingBox = computeSceneBoundingBox(mainView.scene)

    // Center
    const center = new Vector3()
    boundingBox.getCenter(center)
    setCenter(center)

    // Scale
    const size = new Vector3()
    boundingBox.getSize(size)
    const maxSize = Math.max(size.x, size.y, size.z)
    setScale(maxSize * 1.2)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(defaultNormal, center)
  }, [mainView.scene, sectionView.enabled, dispatch])

  // Snap
  useEffect(() => {
    if (!sectionView.snap) return

    // Control
    const group = ref.current
    const position = group.position
    const lookAt = position.clone().add(sectionView.snap)
    group.lookAt(lookAt)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(sectionView.snap, position)
  }, [sectionView.snap])

  // Flip
  useEffect(() => {
    if (!sectionView.flip) return

    // Control
    const group = ref.current
    group.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, group.position)
  }, [sectionView.flip])

  /**
   * Render
   */
  return sectionView.enabled ? (
    <group
      ref={ref}
      type="SectionView"
      position={center}
      scale={scale}
      visible={!sectionView.hidePlane}
    >
      <ControlPlane
        hover={hoverPlane}
        onPointerOver={onPointerOverPlane}
        onPointerOut={onPointerOutPlane}
      />
      <ControlDome
        hover={hoverDome}
        onPointerOver={onPointerOverDome}
        onPointerOut={onPointerOutDome}
      />
    </group>
  ) : null
}

export default SectionView
