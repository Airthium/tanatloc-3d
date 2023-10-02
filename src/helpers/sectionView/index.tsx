const color = 0xfad114

const hoverColor = 0xe98a15

/**
 * Control plane
 * @returns ControlPlane
 */
const ControlPlane = () => {
  return (
    <mesh>
      <planeGeometry />
      <meshBasicMaterial color={color} side={2} transparent opacity={0.5} />
    </mesh>
  )
}

/**
 * Control dome
 * @returns ControlDome
 */
const ControlDome = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 32, 32, Math.PI, -Math.PI]} />
      <meshBasicMaterial color={color} side={2} transparent opacity={0.5} />
    </mesh>
  )
}

/**
 * SectionView
 * @returns SectionView
 */
const SectionView = (): React.JSX.Element => {
  return (
    <group type="SectionView">
      <ControlPlane />
      <ControlDome />
    </group>
  )
}

export default SectionView
