import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'

import { Tanatloc3DSelectionValue } from '../../..'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context } from '../../context'

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
  // Context
  const {
    props: { selection },
    display,
    sectionView,
    settings: {
      colors: { hoverColor, selectColor, hoverSelectColor }
    }
  } = useContext(Context)

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
    [selection, uuid, index, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection?.enabled && selection.type === 'faces') onPointerLeave(index)
  }, [selection, index, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection?.enabled && selection.type === 'faces') onClick()
  }, [onClick])

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
}: Geometry3DSolidProps): React.JSX.Element => {
  // Context
  const {
    props: { selection }
  } = useContext(Context)

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
    [selection, uuid, index, onPointerMove]
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
const Geometry3D = ({ scene }: Geometry3DProps): React.JSX.Element => {
  // State
  const [hover, setHover] = useState<Selection>(initHover)
  const [selected, setSelected] = useState<Selection[]>(initSelected)

  // Context
  const {
    props: { selection, onHighlight, onSelect }
  } = useContext(Context)

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

  /**
   * On pointer move
   * @param data Selection
   */
  const onPointerMove = useCallback(
    (data: Selection) => {
      if (data.distance < hover.distance) setHover(data)
    },
    [hover]
  )

  /**
   * On pointer move
   */
  const onPointerLeave = useCallback(
    (index: number) => {
      if (index === hover.index) setHover(initHover)
    },
    [hover]
  )

  /**
   * On click
   */
  const onClick = useCallback(() => {
    const index = selected.findIndex((s) => s.index === hover.index)
    if (index === -1) setSelected([...selected, hover])
    else
      setSelected([...selected.slice(0, index), ...selected.slice(index + 1)])
  }, [hover, selected])

  // On selection update
  useEffect(() => {
    setHover(initHover)
    setSelected(initSelected)
  }, [selection])

  // On highlight
  useEffect(() => {
    onHighlight?.(hover)
  }, [hover, onHighlight])

  // On select
  useEffect(() => {
    onSelect?.(selected)
  }, [selected, onSelect])

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
