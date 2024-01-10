import { useCallback } from 'react'
import { Button, Dropdown, Tooltip } from 'antd'
import { BuildOutlined } from '@ant-design/icons'

import useStore from '@store'

/**
 * Unit
 * @returns Unit
 */
const Unit: React.FunctionComponent = () => {
  // Store
  const { unit } = useStore((s) => s.unit)

  /**
   * On unit
   */
  const onUnit = useCallback(({ key }: { key: string }): void => {
    useStore.setState({ unit: { unit: key as 'm' | 'mm' } })
  }, [])

  /**
   * Render
   */
  return (
    <Tooltip title="Unit" placement="left">
      <Dropdown
        placement="bottom"
        menu={{
          onClick: onUnit,
          selectedKeys: [unit],
          items: [
            {
              key: 'm',
              title: 'Meters',
              label: 'm'
            },
            {
              key: 'mm',
              title: 'Millimeters',
              label: 'mm'
            }
          ]
        }}
      >
        <Button icon={<BuildOutlined />} />
      </Dropdown>
    </Tooltip>
  )
}

export default Unit
