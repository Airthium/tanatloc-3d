import { useCallback } from 'react'
import { Button, Tooltip } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  RetweetOutlined,
  ScissorOutlined
} from '@ant-design/icons'
import { Vector3 } from 'three'

import useStore from '@store'

import style from '@style/Header'

// Directions
const X = new Vector3(1, 0, 0)
const Y = new Vector3(0, 1, 0)
const Z = new Vector3(0, 0, 1)

/**
 * SectionView
 * @returns SectionView
 */
const SectionView: React.FunctionComponent = () => {
  // Store
  const sectionView = useStore((s) => s.sectionView)

  /**
   * On section view
   */
  const onSectionView = useCallback(() => {
    useStore.setState({
      sectionView: { ...sectionView, enabled: !sectionView.enabled }
    })
  }, [sectionView])

  /**
   * On section view hide plane
   */
  const onSectionViewHidePlane = useCallback(() => {
    useStore.setState({
      sectionView: { ...sectionView, hidePlane: !sectionView.hidePlane }
    })
  }, [sectionView])

  /**
   * On section view snap X
   */
  const onSectionViewSnapX = useCallback(() => {
    useStore.setState({ sectionView: { ...sectionView, snap: X } })
  }, [sectionView])

  /**
   * On section view snap Y
   */
  const onSectionViewSnapY = useCallback(() => {
    useStore.setState({ sectionView: { ...sectionView, snap: Y } })
  }, [sectionView])

  /**
   * On section view snap Z
   */
  const onSectionViewSnapZ = useCallback(() => {
    useStore.setState({ sectionView: { ...sectionView, snap: Z } })
  }, [sectionView])

  /**
   * On section view flip
   */
  const onSectionViewFlip = useCallback(() => {
    useStore.setState({ sectionView: { ...sectionView, flip: Math.random() } })
  }, [sectionView])

  /**
   * Render
   */
  return (
    <>
      <Tooltip key="section-view" title="Section view" placement="left">
        <Button
          type={sectionView.enabled ? 'primary' : 'default'}
          icon={<ScissorOutlined />}
          onClick={onSectionView}
        />
      </Tooltip>
      {sectionView.enabled ? (
        <>
          <Tooltip
            title={sectionView.hidePlane ? 'Show plane' : 'Hide plane'}
            placement="left"
          >
            <Button
              icon={
                sectionView.hidePlane ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
              onClick={onSectionViewHidePlane}
            />
          </Tooltip>
          <Tooltip title="Snap plane to X" placement="left">
            <Button style={style.iconButton} onClick={onSectionViewSnapX}>
              X
            </Button>
          </Tooltip>
          <Tooltip title="Snap plane to Y" placement="left">
            <Button style={style.iconButton} onClick={onSectionViewSnapY}>
              Y
            </Button>
          </Tooltip>
          <Tooltip title="Snap plane to Z" placement="left">
            <Button style={style.iconButton} onClick={onSectionViewSnapZ}>
              Z
            </Button>
          </Tooltip>
          <Tooltip title="Flip plane" placement="left">
            <Button icon={<RetweetOutlined />} onClick={onSectionViewFlip} />
          </Tooltip>
        </>
      ) : null}
    </>
  )
}

export default SectionView
