import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context } from '../../context'
import { setGeometryDimension } from '../../context/actions'

import { Hover, hoverColor, hoverSelectColor, selectColor } from '..'

/**
 * Props
 */
export interface Geometry3DProps {
  scene: GLTF['scene']
}

export interface Geometry3DFaceProps {
  parent: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
  index: number
  hover: Hover
  selected: { index: number; uuid: string }[]
  onPointerMove: (
    event: ThreeEvent<PointerEvent>,
    index: number,
    uuid: string,
    parentUuid: string
  ) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

/**
 * Geometry 3D face
 * @param props Props
 * @returns Geometry3DFace
 */
const Geometry3DFace = ({
  parent,
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
    sectionView
  } = useContext(Context)

  // Geometry
  const geometry = useMemo(() => {
    child.geometry.computeVertexNormals()
    return child.geometry
  }, [child])

  // Material
  const material = useMemo(() => child.material, [child])

  // User data
  const userData = useMemo(() => child.userData, [child.userData])

  // Parent uuid
  const parentUuid = useMemo(
    () => parent.userData.uuid as string,
    [parent.userData.uuid]
  )

  /**
   * On pointer move
   * @param event Event
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>): void => {
      onPointerMove(event, index, userData.uuid, parentUuid)
    },
    [index, userData.uuid, parentUuid, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    onPointerLeave(index)
  }, [index, onPointerLeave])

  /**
   * On click
   */
  const onInternalClick = useCallback((): void => {
    onClick()
  }, [onClick])

  // TODO not the good way to do that
  // Color
  const color = useMemo(() => {
    if (selection === 'face') {
      if (selected.find((s) => s.index === index))
        return hover.index === index ? hoverSelectColor : selectColor
      return hover.index === index ? hoverColor : material.color
    } else if (selection === 'solid') {
      if (selected.length)
        return hover.index === -1 ? selectColor : hoverSelectColor
      return hover.index === -1 ? material.color : hoverColor
    } else return material.color
  }, [index, hover, selected, selection, material])

  /**
   * Render
   */
  return (
    <mesh
      name={child.name}
      uuid={userData.uuid}
      userData={userData}
      onPointerMove={onInternalPointerMove}
      onPointerLeave={onInternalPointerLeave}
      onClick={onInternalClick}
    >
      <primitive object={geometry} />
      <meshPhysicalMaterial
        side={2}
        color={color}
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
 * Geometry3D
 * @param props Props
 * @returns Geometry3D
 */
const Geometry3D = ({ scene }: Geometry3DProps): React.JSX.Element => {
  // State
  const [hover, setHover] = useState<Hover>({
    index: -1,
    uuid: '',
    parentUuid: '',
    distance: Infinity
  })
  const [selected, setSelected] = useState<{ index: number; uuid: string }[]>(
    []
  )

  // Context
  const {
    props: { selection, onHighlight, onSelect },
    geometry: { dimension },
    dispatch
  } = useContext(Context)

  // Dimension
  useEffect(() => {
    if (dimension !== 3) dispatch(setGeometryDimension(3))
  }, [dimension, dispatch])

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
   * @param event Event
   * @param index
   * @param uuid UUID
   * @param parentUuid Pärent UUID
   */
  const onPointerMove = useCallback(
    (
      event: ThreeEvent<PointerEvent>,
      index: number,
      uuid: string,
      parentUuid: string
    ) => {
      const distance = event.distance
      if (distance < hover.distance)
        setHover({ index, distance, uuid, parentUuid })
    },
    [hover]
  )

  /**
   * On pointer move
   */
  const onPointerLeave = useCallback(
    (index: number) => {
      if (index === hover.index)
        setHover({ index: -1, distance: Infinity, uuid: '', parentUuid: '' })
    },
    [hover]
  )

  /**
   * On click
   */
  const onClick = useCallback(() => {
    const index = hover.index
    const uuid = hover.uuid
    const parentUuid = hover.parentUuid

    const pos = selected.findIndex((s) => s.index === index)
    if (pos === -1) {
      if (selection === 'face') setSelected([...selected, { index, uuid }])
      else if (selection === 'solid')
        setSelected([...selected, { index, uuid: parentUuid! }])
    } else
      setSelected((prev) => [...prev.slice(0, pos), ...prev.slice(pos + 1)])
  }, [hover, selected, selection])

  // Selection changes
  useEffect(() => {
    setSelected([])
  }, [selection])

  // On highlight
  useEffect(() => {
    if (selection === 'face') {
      if (hover.index === -1) onHighlight?.()
      else onHighlight?.(hover.uuid)
    } else if (selection === 'solid') {
      onHighlight?.(hover.parentUuid)
    }
  }, [hover, selection, onHighlight])

  // On select
  useEffect(() => {
    onSelect?.(selected.map((s) => s.uuid))
  }, [selected, onSelect])

  /**
   * Render
   */
  return (
    <>
      {children.map((child) => (
        <mesh
          key={child.uuid}
          name={child.name}
          uuid={child.userData.uuid}
          userData={child.userData}
        >
          {child.children.map((subChild, subIndex) => (
            <Geometry3DFace
              key={subChild.uuid}
              parent={child}
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
      ))}
    </>
  )
}

export default Geometry3D
