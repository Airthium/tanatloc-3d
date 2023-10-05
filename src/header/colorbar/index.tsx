import { Button, Dropdown, Tooltip } from 'antd'
import {
  ArrowsAltOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined
} from '@ant-design/icons'
import { useCallback, useContext } from 'react'

import { Context } from '../../context'
import { setLutColormap } from '../../context/actions'

/**
 * Colorbar
 * @returns Colorbar
 */
const Colorbar = () => {
  // Context
  const { lut, dispatch } = useContext(Context)

  /**
   * On colormap
   * @param param { key }
   */
  const onColormap = useCallback(
    ({ key }: { key: string }) => {
      dispatch(setLutColormap(key))
    },
    [dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Tooltip key="result-colormap" title="Result colormap" placement="left">
        <Dropdown
          placement="bottom"
          menu={{
            onClick: onColormap,
            selectedKeys: [lut.colormap],
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
