import {
  Button,
  Collapse,
  Divider,
  Dropdown,
  Layout,
  Switch,
  Tooltip
} from 'antd'
import {
  ArrowsAltOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined,
  DownOutlined,
  TableOutlined,
  ToolOutlined
} from '@ant-design/icons'

import Snapshot from './snapshot'
import Display from './display'
import Zoom from './zoom'
import SectionView from './sectionView'

import style from './index.module.css'

/**
 * CollapseIcon
 * @returns CollapseIcon
 */
const CollapseIcon = () => (
  <Tooltip title="Tools">
    <DownOutlined style={{ fontSize: 16 }} />
    <ToolOutlined style={{ fontSize: 16 }} />
  </Tooltip>
)

/**
 * Header
 * @param props Props
 * @returns Header
 */
const Header = () => {
  /**
   * Render
   */
  return (
    <Layout.Header className={style.header}>
      <Collapse
        expandIcon={CollapseIcon}
        items={[
          {
            key: 'tools',
            children: [
              <Snapshot key="snapshot" />,
              <Divider key="divider-1" />,
              <Display key="display" />,
              <Divider key="divider-2" />,
              <Zoom key="zoom" />,
              <Divider key="divider-3" />,
              <SectionView key="section-view" />,
              <Divider key="divider-4" />,
              <Tooltip
                key="display-result-mesh"
                title="Display result mesh"
                placement="left"
              >
                <Switch
                  checked={true}
                  checkedChildren={<TableOutlined />}
                  unCheckedChildren={<TableOutlined />}
                />
              </Tooltip>,
              <Divider key="divider-5" />,
              <Tooltip
                key="result-colormap"
                title="Result colormap"
                placement="left"
              >
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
              </Tooltip>,
              <Tooltip
                key="result-custom-range"
                title="Result custom range"
                placement="left"
              >
                <Button icon={<ColumnWidthOutlined />} />
              </Tooltip>,
              <Tooltip
                key="result-automaic-range"
                title="Results automatic range"
                placement="left"
              >
                <Button icon={<ArrowsAltOutlined />} />
              </Tooltip>
            ]
          }
        ]}
      />
    </Layout.Header>
  )
}

export default Header
