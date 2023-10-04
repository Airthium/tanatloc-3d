import { Collapse, Divider, Layout, Tooltip } from 'antd'
import { DownOutlined, ToolOutlined } from '@ant-design/icons'

import Snapshot from './snapshot'
import Display from './display'
import Zoom from './zoom'
import SectionView from './sectionView'

import style from './index.module.css'
import Colorbar from './colorbar'
import Results from './results'

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
              <Results key="results" />,
              <Divider key="divider-5" />,
              <Colorbar key="colorbar" />
            ]
          }
        ]}
      />
    </Layout.Header>
  )
}

export default Header
