import { useCallback, useContext, useEffect, useState } from 'react'
import {
  Button,
  ColorPicker,
  Form,
  InputNumber,
  Modal,
  Switch,
  Tooltip,
  Typography
} from 'antd'
import { Color } from 'antd/es/color-picker'
import { SettingOutlined } from '@ant-design/icons'

import { Context, defaultSettings } from '@context/renderer'
import { setSettings } from '@context/renderer/actions'

export interface FormValues {
  lightColor: Color | string
  lightIntensity: number
  lightDecay: number
  baseColor: Color | string
  hoverColor: Color | string
  selectColor: Color | string
  hoverSelectColor: Color | string
  fps: number
  localStorage: boolean
}

/**
 * Color to hex
 * @param color Color
 * @returns Hex color
 */
export const colorToHex = (color: Color | string): string => {
  return typeof color === 'string' ? color : color.toHexString()
}

/**
 * Settings
 * @returns Settings
 */
const Settings = () => {
  // State
  const [open, setOpen] = useState<boolean>(false)

  // Context
  const { settings, dispatch } = useContext(Context)

  // Data
  const [form] = Form.useForm()

  /**
   * On open
   */
  const onOpen = useCallback(() => setOpen(true), [])

  /**
   * On close
   */
  const onClose = useCallback(() => setOpen(false), [])

  /**
   * On reset
   */
  const onReset = useCallback(() => {
    form.setFieldsValue({
      lightColor: defaultSettings.light.color,
      lightIntensity: defaultSettings.light.intensity,
      lightDecay: defaultSettings.light.decay,
      baseColor: defaultSettings.colors.baseColor,
      hoverColor: defaultSettings.colors.hoverColor,
      selectColor: defaultSettings.colors.selectColor,
      hoverSelectColor: defaultSettings.colors.hoverSelectColor,
      fps: defaultSettings.frameRate.fps,
      localStorage: defaultSettings.localStorage
    })
  }, [form])

  /**
   * On apply
   * @param values Values
   */
  const onApply = useCallback(
    (values: FormValues) => {
      dispatch(
        setSettings({
          light: {
            color: colorToHex(values.lightColor),
            intensity: values.lightIntensity,
            decay: values.lightDecay
          },
          colors: {
            baseColor: colorToHex(values.baseColor),
            hoverColor: colorToHex(values.hoverColor),
            selectColor: colorToHex(values.selectColor),
            hoverSelectColor: colorToHex(values.hoverSelectColor)
          },
          frameRate: {
            fps: values.fps
          },
          localStorage: values.localStorage
        })
      )

      onClose()
    },
    [onClose, dispatch]
  )

  // Local storage
  useEffect(() => {
    if (settings.localStorage)
      localStorage.setItem('tanatloc-3d-settings', JSON.stringify(settings))
    else localStorage.removeItem('tanatloc-3d-settings')
  }, [settings])

  /**
   * Render
   */
  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onReset}>Reset default</Button>
            <Button type="primary" onClick={form.submit}>
              Apply
            </Button>
          </>
        }
      >
        <Form
          form={form}
          initialValues={{
            lightColor: settings.light.color,
            lightIntensity: settings.light.intensity,
            lightDecay: settings.light.decay,
            baseColor: settings.colors.baseColor,
            hoverColor: settings.colors.hoverColor,
            selectColor: settings.colors.selectColor,
            hoverSelectColor: settings.colors.hoverSelectColor,
            fps: settings.frameRate.fps,
            localStorage: settings.localStorage
          }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onApply}
        >
          <Typography.Text strong>Light</Typography.Text>
          <Form.Item label="Color" name="lightColor" colon={false}>
            <ColorPicker showText format="hex" />
          </Form.Item>
          <Form.Item label="Intensity" name="lightIntensity">
            <InputNumber min={0} max={1} step={0.01} />
          </Form.Item>
          <Form.Item label="Decay" name="lightDecay">
            <InputNumber min={0} max={10} step={0.01} />
          </Form.Item>
          <Typography.Text strong>Colors</Typography.Text>
          <Form.Item label="Base color" name="baseColor">
            <ColorPicker showText format="hex" />
          </Form.Item>
          <Form.Item label="Hover color" name="hoverColor">
            <ColorPicker showText format="hex" />
          </Form.Item>
          <Form.Item label="Selection color" name="selectColor">
            <ColorPicker showText format="hex" />
          </Form.Item>
          <Form.Item label="Hover selection color" name="hoverSelectColor">
            <ColorPicker showText format="hex" />
          </Form.Item>
          <Typography.Text strong>Frame rate</Typography.Text>
          <Form.Item label="FPS" name="fps">
            <InputNumber min={5} max={120} />
          </Form.Item>
          <Typography.Text strong>Settings persistance</Typography.Text>{' '}
          <Typography.Text>
            If you want to keep the settings for your next navigation, you have
            to accept usage of local storage API
          </Typography.Text>
          <Form.Item label="Accept" name="localStorage" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <Tooltip title="Settings" placement="left">
        <Button icon={<SettingOutlined />} onClick={onOpen} />
      </Tooltip>
    </>
  )
}

export default Settings
