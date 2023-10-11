import { Button, Collapse, Divider, Layout, Tooltip } from 'antd'
import {
  DatabaseOutlined,
  DownOutlined,
  FilterOutlined,
  HighlightOutlined,
  ToolOutlined
} from '@ant-design/icons'

import Snapshot from './snapshot'
import Display from './display'
import Zoom from './zoom'
import SectionView from './sectionView'
import Colorbar from './colorbar'
import Results from './results'

import style from './index.module.css'

/**
 * PostprocessingCollapseIcon
 * @returns PostprocessingCollapseIcon
 */
const PostprocessingCollapseIcon = () => (
  <Tooltip title="Post-processing">
    <DownOutlined style={{ fontSize: 16 }} />
    <HighlightOutlined style={{ fontSize: 16 }} />
  </Tooltip>
)

/**
 * ToolsCollapseIcon
 * @returns ToolsCollapseIcon
 */
const ToolsCollapseIcon = () => (
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
      <div>
        <Collapse
          expandIcon={PostprocessingCollapseIcon}
          items={[
            {
              key: 'post-processing',
              children: [
                <Tooltip key="data" title="Data" placement="left">
                  <Button icon={<DatabaseOutlined />} />
                </Tooltip>,
                <Tooltip key="filters" title="Filters" placement="left">
                  <Button icon={<FilterOutlined />} />
                </Tooltip>
              ]
            }
          ]}
        />
      </div>
      <div>
        <Collapse
          expandIcon={ToolsCollapseIcon}
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
                <Results key="results" />,
                <Divider key="divider-5" />,
                <Colorbar key="colorbar" />
              ]
            }
          ]}
        />
      </div>
    </Layout.Header>
  )
}

export default Header
