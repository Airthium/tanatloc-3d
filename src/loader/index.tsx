import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Buffer } from 'buffer'
import { Wireframe } from '@react-three/drei'
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  Material,
  WireframeGeometry
} from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Lut } from 'three/examples/jsm/math/Lut'

import { Context, MyCanvasPart } from '../context'
import { setGeometryDimension, setLutMax, setLutMin } from '../context/actions'

/**
 * Props
 */
export interface PartLoaderProps {
  part: MyCanvasPart
  uuid: string
}

export interface MeshesProps {
  scene: GLTF['scene']
}

export interface Geometry2DProps {
  scene: GLTF['scene']
}

export interface Geometry3DProps {
  scene: GLTF['scene']
}

export interface MeshProps {
  scene: GLTF['scene']
}

export interface ResultProps {
  scene: GLTF['scene']
}

// Hover color
const hoverColor = 0xfad114

/**
 * Geometry 2D
 * @param props Props
 * @returns Geometry2D
 */
const Geometry2D = ({ scene }: Geometry2DProps): React.JSX.Element => {
  // State
  const [hoverFace, setHoverFace] = useState<number>(-1)
  const [hoverEdge, setHoverEdge] = useState<number>(-1)

  // Context
  const {
    display,
    sectionView,
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
   * On pointer over face
   */
  const onPointerOverFace = useCallback((index: number) => {
    setHoverFace(index)
  }, [])

  /**
   * On pointer out face
   */
  const onPointerOutFace = useCallback(() => {
    setHoverFace(-1)
  }, [])

  /**
   * On pointer over edge
   */
  const onPointerOverEdge = useCallback((index: number) => {
    setHoverEdge(index)
  }, [])

  /**
   * On poiner out edge
   */
  const onPointerOutEdge = useCallback(() => {
    setHoverEdge(-1)
  }, [])

  /**
   * Render
   */
  return (
    <>
      {children.map((child, index) => {
        const geometry = child.geometry
        const material = child.material
        const children = child.children

        return (
          <mesh
            key={child.uuid}
            name={child.name}
            uuid={child.userData.uuid}
            userData={child.userData}
            onPointerOver={() => onPointerOverFace(index)}
            onPointerOut={onPointerOutFace}
          >
            <primitive object={geometry} />
            <meshPhysicalMaterial
              side={2}
              color={hoverFace === index ? hoverColor : material.color}
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
            {children.map((subChild, subIndex) => {
              const geometry = subChild.geometry
              const material = subChild.material
              return (
                <mesh
                  key={subChild.uuid}
                  name={subChild.name}
                  uuid={subChild.userData.uuid}
                  userData={subChild.userData}
                  onPointerOver={() => onPointerOverEdge(subIndex)}
                  onPointerOut={onPointerOutEdge}
                >
                  <primitive object={geometry} />
                  <meshPhysicalMaterial
                    side={2}
                    color={hoverEdge === subIndex ? hoverColor : material.color}
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
            })}
          </mesh>
        )
      })}
    </>
  )
}

/**
 * Geometry3D
 * @param props Props
 * @returns Geometry3D
 */
const Geometry3D = ({ scene }: Geometry3DProps): React.JSX.Element => {
  // State
  const [hover, setHover] = useState<number>(-1)

  // Context
  const {
    display,
    sectionView,
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
   * On pointer over face
   * @param index
   */
  const onPointerOverFace = useCallback((index: number) => {
    setHover(index)
  }, [])

  /**
   * On pointer out face
   */
  const onPointerOutFace = useCallback(() => {
    setHover(-1)
  }, [])

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
          {child.children.map((subChild, subIndex) => {
            const geometry = subChild.geometry
            const material = subChild.material

            return (
              <mesh
                key={subChild.uuid}
                name={subChild.name}
                uuid={subChild.userData.uuid}
                userData={subChild.userData}
                onPointerOver={() => onPointerOverFace(subIndex)}
                onPointerOut={onPointerOutFace}
              >
                <primitive object={geometry} />
                <meshPhysicalMaterial
                  side={2}
                  color={hover === subIndex ? hoverColor : material.color}
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
          })}
        </mesh>
      ))}
    </>
  )
}

/**
 * Mesh
 * @param props props
 * @returns Mesh
 */
const Mesh = ({ scene }: MeshProps): React.JSX.Element => {
  // Ref
  const ref = useRef<THREE.Mesh<BufferGeometry, Material>>(null!)

  // Context
  const { display, sectionView } = useContext(Context)

  // Children
  const children = useMemo(
    () =>
      scene.children as THREE.Mesh<
        THREE.BufferGeometry,
        THREE.MeshStandardMaterial
      >[],
    [scene.children]
  )

  // Clipping plane
  useEffect(() => {
    ref.current.material.clippingPlanes = sectionView.clippingPlane
      ? [sectionView.clippingPlane]
      : []
    ref.current.material.needsUpdate = true
  }, [sectionView.clippingPlane])

  /**
   * Render
   */
  return (
    <>
      {children.map((child) => {
        const geometry = child.geometry
        const material = child.material
        return (
          <mesh
            ref={ref}
            key={child.uuid}
            name={child.name}
            uuid={child.userData.uuid}
            userData={child.userData}
          >
            <Wireframe
              geometry={geometry}
              fill={0xffffff}
              stroke={material.color}
              strokeOpacity={display.transparent ? 0.5 : 1}
            />
          </mesh>
        )
      })}
    </>
  )
}

/**
 * Result
 * @param props Props
 * @returns Result
 */
const Result = ({ scene }: ResultProps): React.JSX.Element => {
  // State
  const [resultMesh, setResultMesh] = useState<React.JSX.Element>()

  // Context
  const { display, sectionView, result, lut, dispatch } = useContext(Context)

  // Child
  const child = useMemo(
    () =>
      scene.children[0] as THREE.Mesh<
        THREE.BufferGeometry,
        THREE.MeshBasicMaterial
      >,
    [scene.children]
  )

  // Vertex color
  useEffect(() => {
    const data = child.geometry.getAttribute('data')
    const array = data.array as unknown as number[]
    const min = array.reduce((a, b) => Math.min(a, b), Infinity)
    const max = array.reduce((a, b) => Math.max(a, b), -Infinity)
    dispatch(setLutMin(min))
    dispatch(setLutMax(max))

    const lookUpTable = new Lut(lut.colormap)
    lookUpTable.setMin(lut.customMin ?? min)
    lookUpTable.setMax(lut.customMax ?? max)

    const vertexColors = new Float32Array(data.count * 3)
    for (let i = 0; i < data.count; ++i) {
      const vertexColor = lookUpTable.getColor(data.array[i])

      vertexColors[3 * i + 0] = vertexColor.r
      vertexColors[3 * i + 1] = vertexColor.g
      vertexColors[3 * i + 2] = vertexColor.b
    }
    child.geometry.setAttribute(
      'color',
      new Float32BufferAttribute(vertexColors, 3)
    )
  }, [child, lut.colormap, lut.customMin, lut.customMax, dispatch])

  // Result mesh
  useEffect(() => {
    if (result.meshVisible) {
      const geometry = new WireframeGeometry(child.geometry)
      const material = new LineBasicMaterial({
        linewidth: 2,
        transparent: true,
        color: 0x000000,
        opacity: display.transparent ? 0.5 : 1,
        clippingPlanes:
          sectionView.enabled && sectionView.clippingPlane
            ? [sectionView.clippingPlane]
            : []
      })
      const mesh = <lineSegments args={[geometry, material]} />
      setResultMesh(mesh)
    } else {
      setResultMesh(undefined)
    }
  }, [
    display.transparent,
    sectionView.enabled,
    sectionView.clippingPlane,
    result.meshVisible,
    child
  ])

  /**
   * Render
   */
  return (
    <mesh
      key={child.uuid}
      name={child.name}
      uuid={child.userData.uuid}
      userData={child.userData}
    >
      <primitive object={child.geometry} />
      <meshBasicMaterial
        vertexColors
        side={2}
        depthWrite={false}
        transparent
        opacity={display.transparent ? 0.5 : 1}
        clippingPlanes={
          sectionView.enabled && sectionView.clippingPlane
            ? [sectionView.clippingPlane]
            : []
        }
      />
      {resultMesh}
    </mesh>
  )
}

/**
 * Meshes
 * @param props
 * @returns Meshes
 */
const Meshes = ({ scene }: MeshesProps): React.JSX.Element => {
  // Type
  const type = useMemo(() => scene.userData.type, [scene.userData.type])

  /**
   * Render
   */
  switch (type) {
    case 'geometry2D':
      return <Geometry2D scene={scene} />
    case 'geometry3D':
      return <Geometry3D scene={scene} />
    case 'mesh':
      return <Mesh scene={scene} />
    case 'result':
      return <Result scene={scene} />
    default:
      return <></>
  }
}

/**
 * PartLoader
 * @param props Props
 * @returns PartLoader
 */
export const PartLoader = ({
  part
}: PartLoaderProps): React.JSX.Element | null => {
  // State
  const [gltf, setGltf] = useState<GLTF>()

  // GLTF load
  useEffect(() => {
    const blob = new Blob([Buffer.from(part.buffer)])
    const url = URL.createObjectURL(blob)
    const loader = new GLTFLoader()
    loader.load(
      url,
      setGltf,
      (progress) =>
        console.info(
          'Loading part ' + (progress.loaded / progress.total) * 100 + '%'
        ),
      console.error
    )
  }, [part])

  /**
   * Render
   */
  return gltf?.scene ? (
    <mesh
      type="Part"
      uuid={part.summary.uuid}
      userData={gltf.scene.userData}
      name={part.extra?.name}
    >
      <Meshes scene={gltf.scene} />
    </mesh>
  ) : null
}
