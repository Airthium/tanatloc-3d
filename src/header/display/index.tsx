import { ReactNode, useCallback } from 'react'
import { Switch, Tooltip } from 'antd'
import {
  BorderlessTableOutlined,
  RadiusUprightOutlined
} from '@ant-design/icons'
import { SwitchChangeEventHandler } from 'antd/es/switch'

import useStore from '@store'

/**
 * Display
 * @returns Display
 */
const Display = (): ReactNode => {
  // Store
  const display = useStore((s) => s.display)

  /**
   * Toggle grid visibility
   * @param e Event
   */
  const toggleGridVisible: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const visible = e.valueOf()
      useStore.setState({ display: { ...display, grid: visible } })
    },
    [display]
  )

  /**
   * Toggle transparency
   * @param e Event
   */
  const toggleTransparency: SwitchChangeEventHandler = useCallback(
    (e): void => {
      const transparent = e.valueOf()
      useStore.setState({ display: { ...display, transparent } })
    },
    [display]
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
