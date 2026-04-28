import * as THREE from 'three'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'

import { Tanatloc3DSelection, Tanatloc3DSelectionValue } from '@index'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import useStore from '@store'

/**
 * Props
 */
export interface Geometry3DProps {
  scene: GLTF['scene']
}

export interface Geometry3DSolidProps {
  child: Omit<
    THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
    'children'
  > & {
    children: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
  }
  hover: Selection
  selected: Selection[]
  onPointerMove: (data: Selection) => void
  onPointerLeave: (uuid: string) => void
  onClick: () => void
}

export interface Geometry3DFaceProps {
  solid: { hover?: boolean; selected?: boolean }
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
  hover: Selection
  selected: Selection[]
  onPointerMove: (data: Selection) => void
  onPointerLeave: (uuid: string) => void
  onClick: () => void
}

export interface Selection extends Tanatloc3DSelectionValue {
  distance: number
}

// Initial hover
const initHover: Selection = {
  uuid: '',
  label: 0,
  distance: Infinity
}

// Initial selected
const initSelected: Selection[] = []

/**
 * Selection props to hover
 * @param children Children
 * @param selection Selection
 * @param distance Distance
 * @returns Selection
 */
const propsToHover = (
  selection: Tanatloc3DSelection | undefined,
  distance: number
): Selection | undefined => {
  if (!selection?.highlighted) return

  // Hover
  return {
    ...selection.highlighted,
    distance
  }
}

/**
 * Selection props to selected
 * @param children Children
 * @param selection Selection
 * @param distance Distance
 * @returns Selected
 */
const propsToSelected = (
  selection: Tanatloc3DSelection | undefined,
  distance: number
): Selection[] | undefined => {
  if (!selection?.selected) return

  // Selected
  const selected: Selection[] = []
  selection.selected.forEach((s) => {
    selected.push({
      ...s,
      distance
    })
  })

  return selected
}

/**
 * Geometry 3D face
 * @param props Props
 * @returns Geometry3DFace
 */
const Geometry3DFace: React.FunctionComponent<Geometry3DFaceProps> = ({
  solid,
  child,
  hover,
  selected,
  onPointerMove,
  onPointerLeave,
  onClick
}) => {
  // Store
  const { selection } = useStore((s) => s.props)
  const display = useStore((s) => s.display)
  const sectionView = useStore((s) => s.sectionView)
  const {
    colors: { hoverColor, selectColor, hoverSelectColor }
  } = useStore((s) => s.settings)

  // Geometry
  const geometry = useMemo(() => {
    const geometry = child.geometry
    geometry.computeVertexNormals()
    return geometry
  }, [child.geometry])

  // Material
  const material = useMemo(() => child.material, [child.material])

  // UUID
  const uuid = useMemo(
    () => child.userData.uuid as string,
    [child.userData.uuid]
  )

  // Label
  const label = useMemo(
    () => child.userData.label as number,
    [child.userData.label]
  )

  /**
   * On pointer move
   * @param event Event
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>): void => {
      if (selection?.enabled) {
        if (selection.type === 'faces')
          onPointerMove({ uuid, label, distance: event.distance })
        else if (selection?.type === 'point') {
          const newPoint = event.intersections[0].point
          selection?.onPoint?.({ x: newPoint.x, y: newPoint.y, z: newPoint.z })
        }
      }
    },
    [
      selection?.enabled,
      selection?.type,
      selection?.onPoint,
      uuid,
      label,
      onPointerMove
    ]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection?.enabled && selection.type === 'faces') onPointerLeave(uuid)
  }, [selection?.enabled, selection?.type, uuid, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection?.enabled && selection.type === 'faces') onClick()
  }, [selection?.enabled, selection?.type, onClick])

  // Material color
  const materialColor = useMemo(() => {
    if (solid.selected) return solid.hover ? hoverSelectColor : selectColor
    else if (solid.hover) return hoverColor
    else if (selection?.enabled && selection.type !== 'faces')
      return material.color
    else if (selected.find((s) => s.uuid === uuid))
      return hover.uuid === uuid ? hoverSelectColor : selectColor
    else return hover.uuid === uuid ? hoverColor : material.color
  }, [
    selection,
    hoverColor,
    selectColor,
    hoverSelectColor,
    material,
    uuid,
    solid,
    hover,
    selected
  ])

  /**
   * Render
   */
  return (
    <mesh
      name={child.name}
      type="Geometry3D_face"
      uuid={child.userData.uuid}
      userData={child.userData}
      onPointerMove={onInternalPointerMove}
      onPointerLeave={onInternalPointerLeave}
      onClick={onInternalClick}
    >
      <primitive object={geometry} />
      <meshPhysicalMaterial
        side={2}
        color={materialColor}
        metalness={0.5}
        roughness={0.5}
        depthWrite={false}
        transparent
        opacity={display.transparent ? 0.5 : 1}
        clippingPlanes={
          sectionView.enabled && sectionView.clippingPlane
            ? [sectionView.clippingPlane]
            : []
        }
      />
    </mesh>
  )
}

/**
 * Geometry 3D solid
 * @param props Props
 * @returns Geometry3DSolid
 */
const Geometry3DSolid: React.FunctionComponent<Geometry3DSolidProps> = ({
  child,
  hover,
  selected,
  onPointerMove,
  onPointerLeave,
  onClick
}) => {
  // Store
  const { selection } = useStore((s) => s.props)

  // Children
  const children = useMemo(() => child.children, [child.children])

  // UUID
  const uuid = useMemo(
    () => child.userData.uuid as string,
    [child.userData.uuid]
  )

  // Label
  const label = useMemo(
    () => child.userData.label as number,
    [child.userData.label]
  )

  /**
   * On pointer move
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>): void => {
      if (selection?.enabled && selection.type === 'solids')
        onPointerMove({ uuid, label, distance: event.distance })
    },
    [selection?.enabled, selection?.type, uuid, label, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection?.enabled && selection.type === 'solids') onPointerLeave(uuid)
  }, [selection?.enabled, selection?.type, uuid, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection?.enabled && selection.type === 'solids') onClick()
  }, [selection?.enabled, selection?.type, onClick])

  // Hover
  const hoverSolid = useMemo(() => {
    return (
      selection?.enabled && selection.type === 'solids' && hover.uuid === uuid
    )
  }, [selection?.enabled, selection?.type, uuid, hover])

  // Selected
  const selectedSolid = useMemo(() => {
    return (
      selection?.enabled &&
      selection.type === 'solids' &&
      !!selected.find((s) => s.uuid === uuid)
    )
  }, [selection?.enabled, selection?.type, uuid, selected])

  /**
   * Render
   */
  return (
    <mesh
      key={child.uuid}
      name={child.name}
      type="Geometry3D_Solid"
      uuid={child.userData.uuid}
      userData={child.userData}
      onPointerMove={onInternalPointerMove}
      onPointerLeave={onInternalPointerLeave}
      onClick={onInternalClick}
    >
      {children.map((subChild) => (
        <Geometry3DFace
          key={subChild.uuid}
          solid={{ hover: hoverSolid, selected: selectedSolid }}
          child={subChild}
          hover={hover}
          selected={selected}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
        />
      ))}
    </mesh>
  )
}

/**
 * Geometry 3D
 * @param props Props
 * @returns Geometry3D
 */
const Geometry3D: React.FunctionComponent<Geometry3DProps> = ({ scene }) => {
  // Ref
  const lastDistance = useRef<number>(Infinity)

  // State
  const [hover, setHover] = useState<Selection>(initHover)
  const [selected, setSelected] = useState<Selection[]>(initSelected)

  // Store
  const { selection } = useStore((s) => s.props)

  // Children
  const children = useMemo(
    () =>
      scene.children as (Omit<
        THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
        'children'
      > & {
        children: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
      })[],
    [scene.children]
  )

  // Selectionable
  const selectionable = useMemo(() => {
    const uuid = scene.userData?.uuid
    return selection?.part && uuid === selection.part
  }, [scene.userData?.uuid, selection?.part])

  /**
   * On pointer move
   * @param data Selection
   */
  const onPointerMove = useCallback(
    (data: Selection) => {
      if (!selectionable) return

      if (data.distance < hover.distance) {
        lastDistance.current = data.distance
        const newHover = data
        setHover(newHover)
        selection?.onHighlight?.({ uuid: newHover.uuid, label: newHover.label })
      }
    },
    [selectionable, hover.distance, selection?.onHighlight]
  )

  /**
   * On pointer move
   */
  const onPointerLeave = useCallback(
    (uuid: string) => {
      if (!selectionable) return

      if (uuid === hover.uuid) {
        setHover(initHover)
        selection?.onHighlight?.()
      }
    },
    [selectionable, hover.uuid, selection?.onHighlight]
  )

  /**
   * On click
   */
  const onClick = useCallback(() => {
    if (!selectionable) return

    let newSelected = []
    const index = selected.findIndex((s) => s.uuid === hover.uuid)
    if (index === -1) newSelected = [...selected, hover]
    else
      newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)]

    setSelected(newSelected)
    selection?.onSelect?.(
      newSelected.map((s) => ({ uuid: s.uuid, label: s.label }))
    )
  }, [selectionable, hover, selected, selection?.onSelect])

  // On selection update
  useEffect(() => {
    const hover =
      (selectionable
        ? propsToHover(selection, lastDistance.current)
        : undefined) ?? initHover
    setHover(hover)

    const selected =
      (selectionable
        ? propsToSelected(selection, lastDistance.current)
        : undefined) ?? initSelected
    setSelected(selected)
  }, [selectionable, selection])

  // Disabled
  useEffect(() => {
    if (!selection?.enabled) {
      setHover(initHover)
      selection?.onHighlight?.()
      setSelected(initSelected)
      selection?.onSelect?.([])
    }
  }, [selection?.enabled, selection?.onHighlight, selection?.onSelect])

  /**
   * Render
   */
  return (
    <mesh type="Geometry3D">
      {children.map((child, index) => (
        <Geometry3DSolid
          key={child.uuid}
          child={child}
          hover={hover}
          selected={selected}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
        />
      ))}
    </mesh>
  )
}

export default Geometry3D
