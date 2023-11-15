import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
  Euler,
  Line3,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Vector2,
  Vector3
} from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { TrackballControlsProps } from '@react-three/drei'

import useStore from '@store'

import computeSceneBoundingBox from '@tools/computeSceneBoundingBox'

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
  pointer: new Vector2(),
  controlPlane: new Plane()
}

// Runtime data
const runtimeData = {
  raycaster: new Raycaster(),
  position: new Vector3(),
  scale: 1,
  controlPoint: new Vector3(),
  intersection: new Vector3()
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
 * @returns { success: boolean }
 */
const onStart = (
  enabled: boolean,
  sceneChildren?: THREE.Scene['children']
): { success: boolean } => {
  if (!enabled || !sceneChildren) return { success: false }

  // Bounding box
  const boundingBox = computeSceneBoundingBox(sceneChildren)

  // Center
  boundingBox.getCenter(runtimeData.position)

  // Scale
  const size = new Vector3()
  boundingBox.getSize(size)
  const maxSize = Math.max(size.x, size.y, size.z)
  runtimeData.scale = maxSize * 1.2

  // Update clipping plane
  clippingPlane.setFromNormalAndCoplanarPoint(
    defaultNormal,
    runtimeData.position
  )

  // Return
  return {
    success: true
  }
}

/**
 * On snap
 * @param snap Snap
 * @param sceneChildren Scene children
 * @param group Group
 * @returns { success: boolean }
 */
const onSnap = (
  snap?: THREE.Vector3,
  sceneChildren?: THREE.Scene['children'],
  group?: THREE.Group
): { success: boolean } => {
  if (!snap || !sceneChildren || !group) return { success: false }

  // Bounding box
  const boundingBox = computeSceneBoundingBox(sceneChildren)

  // Center
  boundingBox.getCenter(runtimeData.position)

  // Group update
  const lookAt = runtimeData.position.clone().add(snap)
  group.position.copy(runtimeData.position)
  group.lookAt(lookAt)

  // Clipping plane
  clippingPlane.setFromNormalAndCoplanarPoint(
    snap.clone().multiplyScalar(-1),
    runtimeData.position
  )

  // Return
  return {
    success: true
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
  initialData.controlPlane.setFromNormalAndCoplanarPoint(
    cameraDirections.forward,
    intersection
  )
}

/**
 * Update clipping plane
 * @param controller Controller
 */
const updateClippingPlane = (controller: THREE.Group): void => {
  const normal = defaultNormal.clone().applyQuaternion(controller.quaternion)
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
  const type = intersection.object.type as Type

  // Camera directions
  setCameraDirections(camera)

  // Initial data
  const pointer = event.pointer
  setInitialData(group, intersection.point, pointer)

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
 * @param plane Plane
 * @param type Type
 * @param camera Camera
 */
const _onPointerMove = (
  enabled: boolean,
  event: ThreeEvent<PointerEvent>,
  group: THREE.Group,
  plane: THREE.Mesh,
  type: Type,
  camera?: PerspectiveCamera
): void => {
  if (!enabled || !camera) return

  /* istanbul ignore else */
  /* that is never something else than Plane but this is a security check */
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
    runtimeData.raycaster.setFromCamera(event.pointer, camera)
    runtimeData.raycaster.ray.intersectPlane(
      initialData.controlPlane,
      runtimeData.intersection
    )

    // Translation
    const point = runtimeData.intersection.clone()
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
const _onPointerUp = (controls?: TrackballControlsProps): void => {
  if (!controls) return
  controls.enabled = true
}

/**
 * SectionView
 * @returns SectionView
 */
const SectionView = (): ReactNode => {
  // Ref
  const ref = useRef<THREE.Group>(null!)
  const planeRef = useRef<THREE.Mesh>(null!)

  // State
  const [position, setPosition] = useState<THREE.Vector3>()
  const [scale, setScale] = useState<number>(null!)

  const [hoverPlane, setHoverPlane] = useState<boolean>(false)
  const [hoverDome, setHoverDome] = useState<boolean>(false)

  const [enabled, setEnabled] = useState<boolean>(false)
  const [type, setType] = useState<Type>()

  // Store
  const mainView = useStore((s) => s.mainView)
  const sectionView = useStore((s) => s.sectionView)
  const {
    colors: { hoverColor: baseColor, selectColor: hoverColor }
  } = useStore((s) => s.settings)

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
      _onPointerMove(
        enabled,
        event,
        ref.current,
        planeRef.current,
        type,
        mainView.camera
      )
    },
    [enabled, type, mainView.camera]
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
    if (sectionView.clippingPlane !== clippingPlane)
      useStore.setState({ sectionView: { ...sectionView, clippingPlane } })
  }, [sectionView])

  // Start
  useEffect(() => {
    const { success } = onStart(sectionView.enabled, mainView.scene?.children)
    if (!success) return

    setPosition(runtimeData.position)
    setScale(runtimeData.scale)
  }, [mainView.scene?.children, sectionView.enabled])

  // Snap
  useEffect(() => {
    const { success } = onSnap(
      sectionView.snap,
      mainView.scene?.children,
      ref.current
    )
    if (!success) return

    setPosition(runtimeData.position)
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
        ref={planeRef}
        type="Plane"
        visible={!sectionView.hidePlane}
        onPointerMove={onPointerMovePlane}
        onPointerOut={onPointerOutPlane}
      >
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          side={2}
          color={hoverPlane ? hoverColor : baseColor}
          metalness={0.5}
          roughness={0.5}
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
        <meshPhysicalMaterial
          side={2}
          color={hoverDome ? hoverColor : baseColor}
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  ) : null
}

export default SectionView
