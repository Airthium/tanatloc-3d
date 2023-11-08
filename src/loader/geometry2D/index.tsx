import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context } from '../../context'

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
  hover: Hover
  selected: { index: number; uuid: string }[]
  onPointerMove: (index: number, uuid: string) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

export interface Geometry2DEdgeProps {
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
  index: number
  hover: Hover
  selected: { index: number; uuid: string }[]
  onPointerMove: (index: number, uuid: string) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

export interface Hover {
  index: number
  uuid: string
}

export interface Select {
  index: number
  uuid: string
}

// Initial hover
const initHover: Hover = {
  index: -1,
  uuid: ''
}

// Initial selected
const initSelected: Select[] = []

/**
 * Geometry 2D edge
 * @param props Props
 * @returns Geometry2DEdge
 */
const Geometry2DEdge = ({
  child,
  index,
  hover,
  selected,
  onPointerMove,
  onPointerLeave,
  onClick
}: Geometry2DEdgeProps) => {
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

  /**
   * On pointer move
   */
  const onInternalPointerMove = useCallback((): void => {
    if (selection == 'edge') onPointerMove(index, uuid)
  }, [selection, uuid, index, onPointerMove])

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection === 'edge') onPointerLeave(index)
  }, [selection, index, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection === 'edge') onClick()
  }, [selection, onClick])

  // Material color
  const materialColor = useMemo(() => {
    if (selection !== 'edge') return material.color
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
const Geometry2DFace = ({
  child,
  index,
  hover,
  selected,
  onPointerMove,
  onPointerLeave,
  onClick
}: Geometry2DFaceProps) => {
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

  // Children
  const children = useMemo(() => child.children, [child.children])

  // UUID
  const uuid = useMemo(
    () => child.userData.uuid as string,
    [child.userData.uuid]
  )

  /**
   * On pointer move
   */
  const onInternalPointerMove = useCallback((): void => {
    if (selection === 'face') onPointerMove(index, uuid)
  }, [selection, uuid, index, onPointerMove])

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection === 'face') onPointerLeave(index)
  }, [selection, index, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    if (selection === 'face') onClick()
  }, [selection, onClick])

  // Material color
  const materialColor = useMemo(() => {
    if (selection !== 'face') return material.color
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
const Geometry2D = ({ scene }: Geometry2DProps): React.JSX.Element => {
  // State
  const [hover, setHover] = useState<Hover>(initHover)
  const [selected, setSelected] = useState<Select[]>(initSelected)

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
   * @param index Index
   * @param uuid UUID
   */
  const onPointerMove = useCallback(
    (index: number, uuid: string) => {
      setHover({ index, uuid })
    },
    [hover]
  )

  /**
   * On pointer out
   * @param index Index
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
    if (index === -1)
      setSelected([...selected, { index: hover.index, uuid: hover.uuid }])
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
    onHighlight?.(hover.uuid)
  }, [hover, onHighlight])

  // On select
  useEffect(() => {
    onSelect?.(selected.map((s) => s.uuid))
  }, [selected, onSelect])

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
