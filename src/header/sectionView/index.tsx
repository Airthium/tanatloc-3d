import { useCallback, useContext } from 'react'
import { Button, Tooltip } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  RetweetOutlined,
  ScissorOutlined
} from '@ant-design/icons'
import { Vector3 } from 'three'

import { Context } from '../../context'
import {
  setSectionViewEnabled,
  setSectionViewFlip,
  setSectionViewHidePlane,
  setSectionViewSnap
} from '../../context/actions'

// Directions
const X = new Vector3(1, 0, 0)
const Y = new Vector3(0, 1, 0)
const Z = new Vector3(0, 0, 1)

/**
 * SectionView
 * @returns SectionView
 */
const SectionView = (): React.JSX.Element => {
  // Context
  const { sectionView, dispatch } = useContext(Context)

  /**
   * On section view
   */
  const onSectionView = useCallback(() => {
    dispatch(setSectionViewEnabled(!sectionView.enabled))
  }, [sectionView.enabled, dispatch])

  /**
   * On section view hide plane
   */
  const onSectionViewHidePlane = useCallback(() => {
    dispatch(setSectionViewHidePlane(!sectionView.hidePlane))
  }, [sectionView.hidePlane, dispatch])

  /**
   * On section view snap X
   */
  const onSectionViewSnapX = useCallback(() => {
    dispatch(setSectionViewSnap(X))
  }, [dispatch])

  /**
   * On section view snap Y
   */
  const onSectionViewSnapY = useCallback(() => {
    dispatch(setSectionViewSnap(Y))
  }, [dispatch])

  /**
   * On section view snap Z
   */
  const onSectionViewSnapZ = useCallback(() => {
    dispatch(setSectionViewSnap(Z))
  }, [dispatch])

  /**
   * On section view flip
   */
  const onSectionViewFlip = useCallback(() => {
    dispatch(setSectionViewFlip(Math.random()))
  }, [dispatch])

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
            <Button className="tanatloc3d_header_iconButton" onClick={onSectionViewSnapX}>
              X
            </Button>
          </Tooltip>
          <Tooltip title="Snap plane to Y" placement="left">
            <Button className="tanatloc3d_header_iconButton" onClick={onSectionViewSnapY}>
              Y
            </Button>
          </Tooltip>
          <Tooltip title="Snap plane to Z" placement="left">
            <Button className="tanatloc3d_header_iconButton" onClick={onSectionViewSnapZ}>
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
