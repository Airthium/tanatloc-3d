import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Euler, Line3, PerspectiveCamera, Plane, Vector2, Vector3 } from 'three'

import { Context } from '../../context'
import { setSectionViewClippingPlane } from '../../context/actions'

import { computeSceneBoundingBox } from '../../tools'
import { ThreeEvent } from '@react-three/fiber'
import { TrackballControlsProps } from '@react-three/drei'

/**
 * Props
 */
export interface ControlPlaneProps {
  hover?: boolean
  position: THREE.Vector3
  scale: number
  onPointerMove: () => void
  onPointerOut: () => void
  updatePosition: (position: THREE.Vector3) => void
}

export interface ControlDomeProps {
  hover?: boolean
  position: THREE.Vector3
  scale: number
  onPointerMove: () => void
  onPointerOut: () => void
  updatePosition: (position: THREE.Vector3) => void
}

export type Type = 'Plane' | 'Dome' | undefined

// Color
const color = 0xfad114

// Hover color
const hoverColor = 0xe98a15

// Default plane normal
const defaultNormal = new Vector3(0, 0, -1)

// Plane
const clippingPlane = new Plane()

// Initial data
const initialData = {
  line: new Line3(),
  intersection: new Vector3(),
  offset: new Vector3(),
  rotation: new Euler(),
  pointer: new Vector2()
}

// Runtime data
const runtimeData = {
  controlPoint: new Vector3()
}

// Camera directions
const cameraDirections = {
  up: new Vector3(),
  forward: new Vector3(),
  right: new Vector3()
}

/**
 * On start
 * @param enabled Enabled
 * @param sceneChildren Scene children
 * @returns { success: boolean, position: THREE.Vector3, scale: number }
 */
const onStart = (
  enabled: boolean,
  sceneChildren?: THREE.Scene['children']
): { success: boolean; position?: THREE.Vector3; scale?: number } => {
  if (!enabled || !sceneChildren) return { success: false }

  // Bounding box
  const boundingBox = computeSceneBoundingBox(sceneChildren)

  // Center
  const center = new Vector3()
  boundingBox.getCenter(center)

  // Scale
  const size = new Vector3()
  boundingBox.getSize(size)
  const maxSize = Math.max(size.x, size.y, size.z)
  const scale = maxSize * 1.2

  // Update clipping plane
  clippingPlane.setFromNormalAndCoplanarPoint(defaultNormal, center)

  // Return
  return {
    success: true,
    position: center,
    scale: scale
  }
}

/**
 * On snap
 * @param snap Snap
 * @param sceneChildren Scene children
 * @param group Group
 * @returns { success: boolean, position: THREE.Vector3 }
 */
const onSnap = (
  snap?: THREE.Vector3,
  sceneChildren?: THREE.Scene['children'],
  group?: THREE.Group
): { success: boolean; position?: THREE.Vector3 } => {
  if (!snap || !sceneChildren || !group) return { success: false }

  // Bounding box
  const boundingBox = computeSceneBoundingBox(sceneChildren)

  // Center
  const center = new Vector3()
  boundingBox.getCenter(center)

  // Group update
  const lookAt = center.clone().add(snap)
  group.lookAt(lookAt)

  // Clipping plane
  clippingPlane.setFromNormalAndCoplanarPoint(
    snap.clone().multiplyScalar(-1),
    center
  )

  // Return
  return {
    success: true,
    position: center
  }
}

/**
 * On flip
 * @param flip Flip
 * @param group Group
 * @returns { success: boolean }
 */
const onFlip = (flip?: number, group?: THREE.Group): { success: boolean } => {
  if (!flip || !group) return { success: false }

  // Update group
  group.rotateX(Math.PI)

  // Update clipping plane
  const normal = clippingPlane.normal.clone().multiplyScalar(-1)
  clippingPlane.setFromNormalAndCoplanarPoint(normal, group.position)

  return {
    success: true
  }
}

/**
 * Set initial data
 * @param intersection Intersection
 * @param rotation Rotation
 * @param mouse Mouse
 */
const setInitialData = (
  group: THREE.Group,
  intersection: THREE.Vector3,
  pointer: THREE.Vector2
): void => {
  const initialPosition = group.position

  initialData.line.set(
    initialPosition,
    initialPosition.clone().add(clippingPlane.normal)
  )
  initialData.intersection.copy(intersection)
  initialData.offset.copy(intersection).sub(initialPosition)
  initialData.rotation.copy(group.rotation)
  initialData.pointer.copy(pointer)
}

/**
 * Set camera directions
 * @param camera Camera
 */
const setCameraDirections = (camera: PerspectiveCamera) => {
  camera.getWorldDirection(cameraDirections.forward)
  cameraDirections.forward.normalize()
  cameraDirections.up.copy(camera.up).normalize()
  cameraDirections.right
    .crossVectors(cameraDirections.up, cameraDirections.forward)
    .normalize()
}

/**
 * Update clipping plane
 * @param controller Controller
 */
const updateClippingPlane = (controller: THREE.Group) => {
  const normal = new Vector3(0, 0, 1)
    .applyQuaternion(controller.quaternion)
    .multiplyScalar(-1)
  clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
}

/**
 * On pointer down
 * @param hoverPlane Hover plane
 * @param hoverDome Hover dome
 * @param event Event
 * @param group Group
 * @param camera Camera
 * @param controls Controls
 * @returns { type: Type, enabled: boolean }
 */
const _onPointerDown = (
  hoverPlane: boolean,
  hoverDome: boolean,
  event: ThreeEvent<PointerEvent>,
  group: THREE.Group,
  camera?: PerspectiveCamera,
  controls?: TrackballControlsProps
): { type: Type; enabled: boolean } => {
  if (!hoverPlane && !hoverDome)
    return {
      type: undefined,
      enabled: false
    }
  if (!camera || !controls)
    return {
      type: undefined,
      enabled: false
    }

  // First intersection
  const intersection = event.intersections.find(
    (intersection) =>
      intersection.object.visible &&
      (intersection.object.type === 'Plane' ||
        intersection.object.type === 'Dome')
  )
  if (!intersection) {
    // setType(undefined)
    return { type: undefined, enabled: false }
  }

  // Enable
  controls.enabled = false

  // Type (dome / plane)
  const type = intersection?.object.type as Type

  // Initial data
  const pointer = event.pointer
  setInitialData(group, intersection.point, pointer)

  // Camera directions
  if (type === 'Dome') {
    setCameraDirections(camera)
  }

  // Return
  return {
    type: type,
    enabled: true
  }
}

/**
 * On pointer move
 * @param enabled Enabled
 * @param event Event
 * @param group Group
 * @param type Type
 */
const _onPointerMove = (
  enabled: boolean,
  event: ThreeEvent<PointerEvent>,
  group: THREE.Group,
  type: Type
) => {
  if (!enabled) return

  if (type === 'Dome') {
    const pointer = event.pointer

    // Rotation
    group.rotateOnWorldAxis(
      cameraDirections.up,
      -(initialData.pointer.x - pointer.x) * 0.1
    )
    group.rotateOnWorldAxis(
      cameraDirections.right,
      -(initialData.pointer.y - pointer.y) * 0.1
    )

    // Update clipping plane
    updateClippingPlane(group)
  } else if (type === 'Plane') {
    // TODO nothing happens
    const intersection = event.intersections.find(
      (intersection) => intersection.object.type === 'Plane'
    )
    if (!intersection) return

    // Translation
    const point = intersection.point.clone()
    point.sub(initialData.offset)

    initialData.line.closestPointToPoint(point, false, runtimeData.controlPoint)
    group.position.copy(runtimeData.controlPoint)

    // Update clipping plane
    updateClippingPlane(group)
  }
}

/**
 * On pointer up
 * @param controls Controls
 */
const _onPointerUp = (controls?: TrackballControlsProps) => {
  if (!controls) return
  controls.enabled = true
}

/**
 * SectionView
 * @returns SectionView
 */
const SectionView = (): React.JSX.Element | null => {
  // Ref
  const ref = useRef<THREE.Group>(null!)

  // State
  const [position, setPosition] = useState<THREE.Vector3>()
  const [scale, setScale] = useState<number>(null!)

  const [hoverPlane, setHoverPlane] = useState<boolean>(false)
  const [hoverDome, setHoverDome] = useState<boolean>(false)

  const [enabled, setEnabled] = useState<boolean>(false)
  const [type, setType] = useState<Type>()

  // Context
  const { mainView, sectionView, dispatch } = useContext(Context)

  /**
   * On pointer down
   * @param event Event
   */
  const onPointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const { type, enabled } = _onPointerDown(
        hoverPlane,
        hoverDome,
        event,
        ref.current,
        mainView.camera,
        mainView.controls
      )
      setType(type)
      setEnabled(enabled)
    },
    [hoverPlane, hoverDome, mainView.camera, mainView.controls]
  )

  /**
   * On pointer move
   * @param event Event
   */
  const onPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      _onPointerMove(enabled, event, ref.current, type)
    },
    [enabled, type]
  )

  /**
   * On pointer up
   */
  const onPointerUp = useCallback(() => {
    setEnabled(false)
    _onPointerUp(mainView.controls)
  }, [mainView.controls])

  /**
   * On pointer out
   */
  const onPointerOut = useCallback(() => {
    onPointerUp()
  }, [onPointerUp])

  /**
   * On pointer move (plane)
   */
  const onPointerMovePlane = useCallback(() => {
    if (!hoverDome) setHoverPlane(true)
  }, [hoverDome])

  /**
   * On pointer out (plane)
   */
  const onPointerOutPlane = useCallback(() => {
    setHoverPlane(false)
  }, [])

  /**
   * On pointer move (dome)
   */
  const onPointerMoveDome = useCallback(() => {
    setHoverDome(true)
    setHoverPlane(false)
  }, [])

  /**
   * On pointer out (dome)
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
    const { success, position, scale } = onStart(
      sectionView.enabled,
      mainView.scene?.children
    )
    if (!success) return

    setPosition(position)
    setScale(scale!)
  }, [mainView.scene?.children, sectionView.enabled, dispatch])

  // Snap
  useEffect(() => {
    const { success, position } = onSnap(
      sectionView.snap,
      mainView.scene?.children,
      ref.current
    )
    if (!success) return

    setPosition(position)
  }, [mainView.scene?.children, sectionView.snap])

  // Flip
  useEffect(() => {
    onFlip(sectionView.flip, ref.current)
  }, [sectionView.flip])

  /**
   * Render
   */
  return sectionView.enabled ? (
    <group
      ref={ref}
      type="SectionView"
      position={position}
      scale={scale}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerOut}
    >
      <mesh
        type="Plane"
        visible={!sectionView.hidePlane}
        onPointerMove={onPointerMovePlane}
        onPointerOut={onPointerOutPlane}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={hoverPlane ? hoverColor : color}
          side={2}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh
        type="Dome"
        visible={!sectionView.hidePlane}
        onPointerMove={onPointerMoveDome}
        onPointerOut={onPointerOutDome}
      >
        <sphereGeometry args={[0.2, 32, 32, Math.PI, -Math.PI]} />
        <meshBasicMaterial
          color={hoverDome ? hoverColor : color}
          side={2}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  ) : null
}

export default SectionView
