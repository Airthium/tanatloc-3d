import { useCallback, useContext, useState } from 'react'
import { Button, Dropdown, Form, InputNumber, Modal, Tooltip } from 'antd'
import {
  ArrowsAltOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined
} from '@ant-design/icons'

import { Context } from '../../context'
import {
  setLutColormap,
  setLutCustomMax,
  setLutCustomMin
} from '../../context/actions'

import toReadable from '../../tools/toReadable'

/**
 * Colorbar
 * @returns Colorbar
 */
const Colorbar = () => {
  // State
  const [customRangeOpen, setCustomRangeOpen] = useState<boolean>(false)

  // Context
  const { lut, dispatch } = useContext(Context)

  // Data
  const [form] = Form.useForm()

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
   * On custom range open
   */
  const onCustomRangeOpen = useCallback(
    (): void => setCustomRangeOpen(true),
    []
  )

  /**
   * On custom range close
   */
  const onCustomRangeClose = useCallback(
    (): void => setCustomRangeOpen(false),
    []
  )

  /**
   * On custom range
   * @param values Values
   */
  const onCustomRange = useCallback(
    (values: { min: number; max: number }): void => {
      // Update custom min/max
      dispatch(setLutCustomMin(values.min))
      dispatch(setLutCustomMax(values.max))

      // Close
      setCustomRangeOpen(false)
    },
    [dispatch]
  )

  /**
   * On automatic range
   */
  const onAutomaticRange = useCallback((): void => {
    // Remove custom min/max
    dispatch(setLutCustomMin())
    dispatch(setLutCustomMax())
  }, [dispatch])

  /**
   * Render
   */
  return (
    <>
      <Modal
        open={customRangeOpen}
        closable={false}
        onCancel={onCustomRangeClose}
        okText="Apply"
        onOk={form.submit}
      >
        <Form
          form={form}
          initialValues={{ min: toReadable(lut.min), max: toReadable(lut.max) }}
          onFinish={onCustomRange}
        >
          <Form.Item name="min" label="Minimum">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="max" label="Maximum">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Tooltip key="result-colormap" title="Result colormap" placement="left">
        <Dropdown
          placement="bottomRight"
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
        <Button icon={<ColumnWidthOutlined />} onClick={onCustomRangeOpen} />
      </Tooltip>
      <Tooltip
        key="result-automaic-range"
        title="Results automatic range"
        placement="left"
      >
        <Button icon={<ArrowsAltOutlined />} onClick={onAutomaticRange} />
      </Tooltip>
    </>
  )
}

export default Colorbar
