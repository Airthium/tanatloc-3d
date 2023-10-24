import { useContext } from 'react'
import { Button, Collapse, Divider, Layout, Tooltip } from 'antd'
import {
  DatabaseOutlined,
  FilterOutlined,
  HighlightOutlined,
  ToolOutlined
} from '@ant-design/icons'

import { Context } from '../context'

import Snapshot from './snapshot'
import Display from './display'
import Zoom from './zoom'
import SectionView from './sectionView'
import Colorbar from './colorbar'
import Results from './results'

import style from '../style/Header'

/**
 * Props
 */
export interface HeaderProps {
  oneResult: boolean
}

/**
 * Header
 * @param props Props
 * @returns Header
 */
const Header = ({ oneResult }: HeaderProps) => {
  // Context
  const {
    props: { data, postProcessing, onData, onPostProcessing }
  } = useContext(Context)

  /**
   * Render
   */
  return (
    <Layout.Header style={style.header}>
      {data || postProcessing ? (
        <div>
          <Collapse
            defaultActiveKey={'post-processing'}
            items={[
              {
                key: 'post-processing',
                label: (
                  <HighlightOutlined
                    style={{ fontSize: 16, paddingRight: '6px' }}
                  />
                ),
                children: [
                  <div key="container" style={style.collapseBody}>
                    {data ? (
                      <Tooltip key="data" title="Data" placement="left">
                        <Button icon={<DatabaseOutlined />} onClick={onData} />
                      </Tooltip>
                    ) : null}
                    {postProcessing ? (
                      <Tooltip
                        key="postProcessing"
                        title="Post-processing"
                        placement="left"
                      >
                        <Button
                          icon={<FilterOutlined />}
                          onClick={onPostProcessing}
                        />
                      </Tooltip>
                    ) : null}
                  </div>
                ]
              }
            ]}
            style={style.collapse}
          />
        </div>
      ) : null}
      <div>
        <Collapse
          defaultActiveKey={'tools'}
          items={[
            {
              key: 'tools',
              label: (
                <ToolOutlined style={{ fontSize: 16, paddingRight: '6px' }} />
              ),
              children: [
                <div key="container" style={style.collapseBody}>
                  <Snapshot key="snapshot" />
                  <Divider key="divider-1" style={style.divider} />
                  <Display key="display" />
                  <Divider key="divider-2" style={style.divider} />
                  <Zoom key="zoom" />
                  <Divider key="divider-3" style={style.divider} />
                  <SectionView key="section-view" />
                  {oneResult ? (
                    <>
                      <Divider key="divider-4" style={style.divider} />
                      <Results key="results" />
                      <Divider key="divider-5" style={style.divider} />
                      <Colorbar key="colorbar" />
                    </>
                  ) : null}
                </div>
              ]
            }
          ]}
          style={style.collapse}
        />
      </div>
    </Layout.Header>
  )
}

export default Header
