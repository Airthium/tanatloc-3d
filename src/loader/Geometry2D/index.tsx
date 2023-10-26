import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { Context } from '../../context'
import { setGeometryDimension } from '../../context/actions'

import { Hover, hoverColor } from '..'

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
  onPointerMove: (
    event: ThreeEvent<PointerEvent>,
    index: number,
    uuid: string
  ) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

export interface Geometry2DEdgeProps {
  child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
  index: number
  hover: Hover
  selected: { index: number; uuid: string }[]
  onPointerMove: (
    event: ThreeEvent<PointerEvent>,
    index: number,
    uuid: string
  ) => void
  onPointerLeave: (index: number) => void
  onClick: () => void
}

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
    sectionView
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
   * @param event Event
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>): void => {
      if (selection == 'edge') onPointerMove(event, index, uuid)
    },
    [index, uuid, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection === 'edge') onPointerLeave(index)
  }, [index])

  return (
    <mesh
      key={child.uuid}
      name={child.name}
      uuid={child.userData.uuid}
      userData={child.userData}
      onPointerMove={onInternalPointerMove}
      onPointerLeave={onInternalPointerLeave}
      onClick={onClick}
    >
      <primitive object={geometry} />
      <meshPhysicalMaterial
        side={2}
        color={hover.index === index ? hoverColor : material.color}
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
    sectionView
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
   * @param event Event
   */
  const onInternalPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>): void => {
      if (selection === 'face') onPointerMove(event, index, uuid)
    },
    [index, uuid, onPointerMove]
  )

  /**
   * On pointer leave
   */
  const onInternalPointerLeave = useCallback((): void => {
    if (selection === 'face') onPointerLeave(index)
  }, [index])

  /**
   * Render
   */
  return (
    <mesh
      key={child.uuid}
      name={child.name}
      uuid={child.userData.uuid}
      userData={child.userData}
      onPointerMove={onInternalPointerMove}
      onPointerLeave={onInternalPointerLeave}
      onClick={onClick}
    >
      <primitive object={geometry} />
      <meshPhysicalMaterial
        side={2}
        color={hover.index === index ? hoverColor : material.color}
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
  const [hover, setHover] = useState<Hover>({
    index: -1,
    distance: Infinity,
    uuid: ''
  })
  const [selected, setSelected] = useState<{ index: number; uuid: string }[]>(
    []
  )

  // Context
  const {
    geometry: { dimension },
    dispatch
  } = useContext(Context)

  // Dimension
  useEffect(() => {
    if (dimension !== Math.max(2, dimension))
      dispatch(setGeometryDimension(Math.max(2, dimension)))
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
   * @param index Index
   * @param uuid UUID
   */
  const onPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>, index: number, uuid: string) => {
      const distance = event.distance
      if (distance < hover.distance) setHover({ index, distance, uuid })
    },
    [hover]
  )

  /**
   * On pointer out
   * @param index Index
   */
  const onPointerLeave = useCallback(
    (index: number) => {
      if (index === hover.index)
        setHover({ index: -1, distance: Infinity, uuid: '', parentUuid: '' })
    },
    [hover]
  )

  const onClick = useCallback(() => {}, [])

  /**
   * Render
   */
  return (
    <>
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
    </>
  )
}

export default Geometry2D
