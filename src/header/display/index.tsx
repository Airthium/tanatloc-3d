import { useCallback, useContext } from 'react'
import { Switch, Tooltip } from 'antd'
import {
  BorderlessTableOutlined,
  RadiusUprightOutlined
} from '@ant-design/icons'
import { SwitchChangeEventHandler } from 'antd/es/switch'

import { Context } from '../../context'
import { setGridVisible, setPartsTransparent } from '../../context/actions'

/**
 * Display
 * @returns Display
 */
const Display = (): React.JSX.Element => {
  // Context
  const { parts, grid, dispatch } = useContext(Context)

  /**
   * Toggle grid visibility
   * @param e Event
   */
  const toggleGridVisible: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const visible = e.valueOf()
      dispatch(setGridVisible(visible))
    },
    [dispatch]
  )

  /**
   * Toggle transparency
   * @param e Event
   */
  const toggleTransparency: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const transparent = e.valueOf()
      dispatch(setPartsTransparent(transparent))
    },
    [dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Tooltip title="Display grid" placement="left">
        <Switch
          checked={grid.visible}
          checkedChildren={<BorderlessTableOutlined />}
          unCheckedChildren={<BorderlessTableOutlined />}
          onChange={toggleGridVisible}
        />
      </Tooltip>
      <Tooltip title="Transparency" placement="left">
        <Switch
          checked={parts.transparent}
          checkedChildren={<RadiusUprightOutlined />}
          unCheckedChildren={<RadiusUprightOutlined />}
          onChange={toggleTransparency}
        />
      </Tooltip>
    </>
  )
}

export default Display
