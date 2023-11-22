import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
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
  index: number
  hover: Selection
  selected: Selection[]
  onPointerMove: (data: Selection) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

export interface Geometry3DFaceProps {
  solid: { hover?: boolean; selected?: boolean }
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
  index: number
  hover: Selection
  selected: Selection[]
  onPointerMove: (data: Selection) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

export interface Selection extends Tanatloc3DSelectionValue {
  index: number
  distance: number
}

// Initial hover
const initHover: Selection = {
  index: -1,
  uuid: '',
  label: 0,
  distance: Infinity
}

// Initial selected
const initSelected: Selection[] = []

/**
 * Find index
 * @param children Children
 * @param type Type
 * @param uuid UUID
 * @returns Index
 */
const findIndex = (
  children: (Omit<
    THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
    'children'
  > & {
    children: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
  })[],
  type: Tanatloc3DSelection['type'],
  uuid: string
): number => {
  let searchIndex = -1
  children.forEach((solid, index) => {
    if (type === 'solids') {
      if (solid.userData.uuid === uuid) searchIndex = index
    } else if (type === 'faces') {
      solid.children.forEach((face, index) => {
        if (face.userData.uuid === uuid) searchIndex = index
      })
    }
  })
  return searchIndex
}

/**
 * Selection props to hover
 * @param children Children
 * @param selection Selection
 * @returns Selection
 */
const propsToHover = (
  children: (Omit<
    THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
    'children'
  > & {
    children: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
  })[],
  selection?: Tanatloc3DSelection
): Selection | undefined => {
  if (!selection?.highlighted) return

  // UUID
  const uuid = selection.highlighted.uuid

  // Find index
  const index = findIndex(children, selection.type, uuid)

  // Check
  if (index === -1) return

  // Hover
  return {
    ...selection.highlighted,
    index,
    distance: Infinity
  }
}

/**
 * Selection props to selected
 * @param children Children
 * @param selection Selection
 * @returns Selected
 */
const propsToSelected = (
  children: (Omit<
    THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
    'children'
  > & {
    children: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]
  })[],
  selection?: Tanatloc3DSelection
): Selection[] | undefined => {
  if (!selection?.selected) return

  // Selected
  const selected: Selection[] = []
  selection.selected.forEach((s) => {
    // UUID
    const uuid = s.uuid

    // Find index
    const index = findIndex(children, selection.type, uuid)

    // Check
    if (index !== -1)
      selected.push({
        ...s,
        index,
        distance: Infinity
      })
  })

  return selected
}

/**
 * Geometry 3D face
 * @param props Props
 * @returns Geometry3DFace
 */
const Geometry3DFace = ({
  solid,
  child,
  index,
  hover,
  selected,
  onPointerMove,
  onPointerLeave,
  onClick
}: Geometry3DFaceProps) => {
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
      if (selection?.enabled && selection.type === 'faces')
        onPointerMove({ index, uuid, label, distance: event.distance })
    },
    [selection?.enabled, selection?.type, uuid, label, index, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection?.enabled && selection.type === 'faces') onPointerLeave(index)
  }, [selection?.enabled, selection?.type, index, onPointerLeave])

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
    else if (selected.find((s) => s.index === index))
      return hover.index === index ? hoverSelectColor : selectColor
    else return hover.index === index ? hoverColor : material.color
  }, [
    selection,
    hoverColor,
    selectColor,
    hoverSelectColor,
    material,
    solid,
    index,
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
const Geometry3DSolid = ({
  child,
  index,
  hover,
  selected,
  onPointerMove,
  onPointerLeave,
  onClick
}: Geometry3DSolidProps): ReactNode => {
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
        onPointerMove({ index, uuid, label, distance: event.distance })
    },
    [selection, uuid, label, index, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection?.enabled && selection.type === 'solids') onPointerLeave(index)
  }, [selection, index, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection?.enabled && selection.type === 'solids') onClick()
  }, [selection, onClick])

  // Hover
  const hoverSolid = useMemo(() => {
    return (
      selection?.enabled && selection.type === 'solids' && hover.index === index
    )
  }, [selection, hover, index])

  // Selected
  const selectedSolid = useMemo(() => {
    return (
      selection?.enabled &&
      selection.type === 'solids' &&
      !!selected.find((s) => s.index === index)
    )
  }, [selection, selected, index])

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
      {children.map((subChild, subIndex) => (
        <Geometry3DFace
          key={subChild.uuid}
          solid={{ hover: hoverSolid, selected: selectedSolid }}
          child={subChild}
          index={subIndex}
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
const Geometry3D = ({ scene }: Geometry3DProps): ReactNode => {
  // State
  const [hover, setHover] = useState<Selection>(initHover)
  const [selected, setSelected] = useState<Selection[]>(initSelected)

  // Store
  const { selection, onHighlight, onSelect } = useStore((s) => s.props)

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
        const newHover = data
        setHover(newHover)
        onHighlight?.({ uuid: newHover.uuid, label: newHover.label })
      }
    },
    [selectionable, hover, onHighlight]
  )

  /**
   * On pointer move
   */
  const onPointerLeave = useCallback(
    (index: number) => {
      if (!selectionable) return

      if (index === hover.index) {
        setHover(initHover)
        onHighlight?.()
      }
    },
    [selectionable, hover, onHighlight]
  )

  /**
   * On click
   */
  const onClick = useCallback(() => {
    if (!selectionable) return

    let newSelected = []
    const index = selected.findIndex((s) => s.index === hover.index)
    if (index === -1) newSelected = [...selected, hover]
    else
      newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)]

    setSelected(newSelected)
    onSelect?.(newSelected.map((s) => ({ uuid: s.uuid, label: s.label })))
  }, [selectionable, hover, selected, onSelect])

  // On selection update
  useEffect(() => {
    const hover =
      (selectionable ? propsToHover(children, selection) : undefined) ??
      initHover
    setHover(hover)

    const selected =
      (selectionable ? propsToSelected(children, selection) : undefined) ??
      initSelected
    setSelected(selected)
  }, [selectionable, children, selection])

  /**
   * Render
   */
  return (
    <mesh type="Geometry3D">
      {children.map((child, index) => (
        <Geometry3DSolid
          key={child.uuid}
          child={child}
          index={index}
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
