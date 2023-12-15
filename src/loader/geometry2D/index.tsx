import { useCallback, useEffect, useMemo, useState } from 'react'

import { Tanatloc3DSelection, Tanatloc3DSelectionValue } from '@index'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import useStore from '@store'
import { ThreeEvent } from '@react-three/fiber'

/**
 * Props
 */
export interface Geometry2DProps {
  scene: GLTF['scene']
}

export interface Geometry2DFaceProps {
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

export interface Geometry2DEdgeProps {
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
}

// Initial hover
const initHover: Selection = {
  index: -1,
  uuid: '',
  label: 0
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
    if (type === 'faces') {
      if (solid.userData.uuid === uuid) searchIndex = index
    } else if (type === 'edges') {
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
    index
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
        index
      })
  })

  return selected
}

/**
 * Geometry 2D edge
 * @param props Props
 * @returns Geometry2DEdge
 */
const Geometry2DEdge: React.FunctionComponent<Geometry2DEdgeProps> = ({
  child,
  index,
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
   */
  const onInternalPointerMove = useCallback((): void => {
    if (selection?.enabled && selection.type == 'edges')
      onPointerMove({ index, uuid, label })
  }, [selection?.enabled, selection?.type, uuid, label, index, onPointerMove])

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection?.enabled && selection.type === 'edges') onPointerLeave(index)
  }, [selection?.enabled, selection?.type, index, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection?.enabled && selection.type === 'edges') onClick()
  }, [selection?.enabled, selection?.type, onClick])

  // Material color
  const materialColor = useMemo(() => {
    if (selection?.enabled && selection.type !== 'edges') return material.color
    else if (selected.find((s) => s.index === index))
      return hover.index === index ? hoverSelectColor : selectColor
    else return hover.index === index ? hoverColor : material.color
  }, [
    selection,
    hoverColor,
    selectColor,
    hoverSelectColor,
    material,
    index,
    hover,
    selected
  ])

  return (
    <mesh
      name={child.name}
      type="Geometry2D_edge"
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
 * Geometry 2D face
 * @param props Props
 * @returns Geometry2DFace
 */
const Geometry2DFace: React.FunctionComponent<Geometry2DFaceProps> = ({
  child,
  index,
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
   * @param event Event
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>): void => {
      if (selection?.enabled) {
        if (selection.type === 'faces') onPointerMove({ index, uuid, label })
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
      index,
      onPointerMove
    ]
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
    if (selection?.enabled && selection.type !== 'faces') return material.color
    else if (selected.find((s) => s.index === index))
      return hover.index === index ? hoverSelectColor : selectColor
    else return hover.index === index ? hoverColor : material.color
  }, [
    selection,
    hoverColor,
    selectColor,
    hoverSelectColor,
    material,
    index,
    hover,
    selected
  ])

  /**
   * Render
   */
  return (
    <mesh
      key={child.uuid}
      name={child.name}
      type="Geometry2D_face"
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
      {children.map((subChild, subIndex) => (
        <Geometry2DEdge
          key={subChild.uuid}
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
 * Geometry 2D
 * @param props Props
 * @returns Geometry2D
 */
const Geometry2D: React.FunctionComponent<Geometry2DProps> = ({ scene }) => {
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

      const newHover = data
      setHover(newHover)
      selection?.onHighlight?.({ uuid: newHover.uuid, label: newHover.label })
    },
    [selectionable, selection?.onHighlight]
  )

  /**
   * On pointer out
   * @param index Index
   */
  const onPointerLeave = useCallback(
    (index: number) => {
      if (!selectionable) return

      if (index === hover.index) {
        setHover(initHover)
        selection?.onHighlight?.()
      }
    },
    [selectionable, hover.index, selection?.onHighlight]
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
    selection?.onSelect?.(
      newSelected.map((s) => ({ uuid: s.uuid, label: s.label }))
    )
  }, [selectionable, hover, selected, selection?.onSelect])

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
    <mesh type="Geometry2D">
      {children.map((child, index) => (
        <Geometry2DFace
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

export default Geometry2D
