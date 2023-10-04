import { useCallback, useContext } from 'react'
import { Switch, Tooltip } from 'antd'
import {
  BorderlessTableOutlined,
  RadiusUprightOutlined
} from '@ant-design/icons'
import { SwitchChangeEventHandler } from 'antd/es/switch'

import { Context } from '../../context'
import { setDisplayGrid, setDisplayTransparent } from '../../context/actions'

/**
 * Display
 * @returns Display
 */
const Display = (): React.JSX.Element => {
  // Context
  const { display, dispatch } = useContext(Context)

  /**
   * Toggle grid visibility
   * @param e Event
   */
  const toggleGridVisible: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const visible = e.valueOf()
      dispatch(setDisplayGrid(visible))
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
      dispatch(setDisplayTransparent(transparent))
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
          checked={display.grid}
          checkedChildren={<BorderlessTableOutlined />}
          unCheckedChildren={<BorderlessTableOutlined />}
          onChange={toggleGridVisible}
        />
      </Tooltip>
      <Tooltip title="Transparency" placement="left">
        <Switch
          checked={display.transparent}
          checkedChildren={<RadiusUprightOutlined />}
          unCheckedChildren={<RadiusUprightOutlined />}
          onChange={toggleTransparency}
        />
      </Tooltip>
    </>
  )
}

export default Display
