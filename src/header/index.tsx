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
import { useContext } from 'react'
import { Context } from '../context'

/**
 * Props
 */
export interface HeaderProps {
  oneResult: boolean
}

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
const Header = ({ oneResult }: HeaderProps) => {
  // Context
  const {
    props: { data, filters }
  } = useContext(Context)

  /**
   * Render
   */
  return (
    <Layout.Header className={style.header}>
      {data || filters ? (
        <div>
          <Collapse
            expandIcon={PostprocessingCollapseIcon}
            defaultActiveKey={'post-processing'}
            items={[
              {
                key: 'post-processing',
                children: [
                  data && (
                    <Tooltip key="data" title="Data" placement="left">
                      <Button icon={<DatabaseOutlined />} />
                    </Tooltip>
                  ),
                  filters && (
                    <Tooltip key="filters" title="Filters" placement="left">
                      <Button icon={<FilterOutlined />} />
                    </Tooltip>
                  )
                ]
              }
            ]}
          />
        </div>
      ) : null}
      <div>
        <Collapse
          expandIcon={ToolsCollapseIcon}
          defaultActiveKey={'tools'}
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
                oneResult && [
                  <Divider key="divider-4" />,
                  <Results key="results" />,
                  <Divider key="divider-5" />,
                  <Colorbar key="colorbar" />
                ]
              ]
            }
          ]}
        />
      </div>
    </Layout.Header>
  )
}

export default Header
