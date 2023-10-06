import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Line3, Plane, Vector3 } from 'three'
import { ThreeEvent } from '@react-three/fiber'

import { Context } from '../../context'
import { setSectionViewClippingPlane } from '../../context/actions'

import { computeSceneBoundingBox } from '../../tools'
import { Line } from '@react-three/drei'

// TODO does not work

/**
 * Props
 */
export interface ControlPlaneProps {
  hover?: boolean
  position: THREE.Vector3
  scale: number
  onPointerOver: () => void
  onPointerOut: () => void
  updatePosition: (position: THREE.Vector3) => void
}

export interface ControlDomeProps {
  hover?: boolean
  position: THREE.Vector3
  scale: number
  onPointerOver: () => void
  onPointerOut: () => void
  updatePosition: (position: THREE.Vector3) => void
}

// Color
const color = 0xfad114

// Hover color
const hoverColor = 0xe98a15

// Default plane normal
const defaultNormal = new Vector3(0, 0, 1)

// Plane
const clippingPlane = new Plane()

// Start point
const startPoint = new Vector3()

// Start offset
const startOffset = new Vector3()

// Camera directions
const cameraDirections = {
  up: new Vector3(),
  forward: new Vector3(),
  right: new Vector3()
}

// // Control normal
// const controlNormal = new Vector3()

const controlPlane = new Plane()

// Control line
const controlLine = new Line3()

const updateClippingPlane = (controller: THREE.Mesh) => {
  const normal = new Vector3(0, 0, 1)
    .applyQuaternion(controller.quaternion)
    .multiplyScalar(-1)
  clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
}

/**
 * Control plane
 * @returns ControlPlane
 */
const ControlPlane = ({
  hover,
  position,
  scale,
  onPointerOver,
  onPointerOut,
  updatePosition
}: ControlPlaneProps) => {
  // Ref
  const ref = useRef<THREE.Mesh>(null!)

  // State
  const [enabled, setEnabled] = useState<boolean>(false)

  // Context
  const { mainView, sectionView } = useContext(Context)

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
   * On pointer down
   * @param event Event
   */
  const onPointerDown = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!mainView.camera || !mainView.controls) return

      // Disable controls
      mainView.controls.enabled = false

      // Enable move
      setEnabled(true) //TODO if hover

      // Initial data
      startPoint.copy(event.intersections[0].point)

      mainView.camera.getWorldDirection(cameraDirections.forward)
      cameraDirections.forward.normalize()

      controlPlane.setFromNormalAndCoplanarPoint(
        cameraDirections.forward,
        startPoint
      )

      startOffset.copy(startPoint).sub(position)

      controlLine.set(position, position.clone().add(clippingPlane.normal))
    },
    [mainView.camera, mainView.controls, position]
  )

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
      onPointerOver()

      if (!enabled) return

      // New position
      const intersection = event.intersections[0]
      const point = intersection.point
      const newPosition = new Vector3()
      controlLine.closestPointToPoint(point, false, newPosition)

      // Update position
      updatePosition(newPosition)

      // Update clipping plane
      clippingPlane.setFromNormalAndCoplanarPoint(
        clippingPlane.normal,
        newPosition
      )
    },
    [enabled, onPointerOver, updatePosition]
  )

  /**
   * Render
   */
  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
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
  position,
  scale,
  onPointerOver,
  onPointerOut
}: ControlDomeProps) => {
  // Ref
  const ref = useRef<THREE.Mesh>(null!)

  // Context
  const { sectionView } = useContext(Context)

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
  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      onPointerMove={onPointerOver}
      onPointerOut={onPointerOut}
    >
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
  // State
  const [center, setCenter] = useState<THREE.Vector3>(null!)
  const [scale, setScale] = useState<number>(null!)

  const [hoverPlane, setHoverPlane] = useState<boolean>(false)
  const [hoverDome, setHoverDome] = useState<boolean>(false)

  // Context
  const { mainView, sectionView, dispatch } = useContext(Context)

  /**
   * On pointer over plane
   */
  const onPointerOverPlane = useCallback(() => {
    if (!hoverDome) setHoverPlane(true)
  }, [hoverDome])

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
    if (!mainView.scene?.children) return

    const boundingBox = computeSceneBoundingBox(mainView.scene.children)

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
  }, [mainView.scene?.children, sectionView.enabled, dispatch])

  // Center at snap & flip
  useEffect(() => {
    if (!sectionView.enabled) return
    if (!mainView.scene?.children) return

    const boundingBox = computeSceneBoundingBox(mainView.scene.children)

    // Center
    const center = new Vector3()
    boundingBox.getCenter(center)
    setCenter(center)
  }, [
    mainView.scene?.children,
    sectionView.enabled,
    sectionView.snap,
    sectionView.flip
  ])

  /**
   * Render
   */
  return sectionView.enabled ? (
    <group type="SectionView" visible={!sectionView.hidePlane}>
      <ControlPlane
        hover={hoverPlane}
        position={center}
        scale={scale}
        onPointerOver={onPointerOverPlane}
        onPointerOut={onPointerOutPlane}
        updatePosition={setCenter}
      />
      <ControlDome
        hover={hoverDome}
        position={center}
        scale={scale}
        onPointerOver={onPointerOverDome}
        onPointerOut={onPointerOutDome}
        updatePosition={setCenter}
      />
    </group>
  ) : null
}

export default SectionView
