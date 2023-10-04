import { Button, Dropdown, Tooltip } from 'antd'
import {
  ArrowsAltOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined
} from '@ant-design/icons'

/**
 * Colorbar
 * @returns Colorbar
 */
const Colorbar = () => {
  /**
   * Render
   */
  return (
    <>
      <Tooltip key="result-colormap" title="Result colormap" placement="left">
        <Dropdown
          placement="bottom"
          menu={{
            onClick: console.log,
            items: [
              {
                key: 'rainbow',
                label: 'Rainbow'
              },
              {
                key: 'cooltowarm',
                label: 'Cool to warm'
              },
              {
                key: 'blackbody',
                label: 'Black body'
              },
              {
                key: 'grayscale',
                label: 'Gray scale'
              }
            ]
          }}
        >
          <Button icon={<BgColorsOutlined />} />
        </Dropdown>
      </Tooltip>
      <Tooltip
        key="result-custom-range"
        title="Result custom range"
        placement="left"
      >
        <Button icon={<ColumnWidthOutlined />} />
      </Tooltip>
      <Tooltip
        key="result-automaic-range"
        title="Results automatic range"
        placement="left"
      >
        <Button icon={<ArrowsAltOutlined />} />
      </Tooltip>
    </>
  )
}

export default Colorbar
