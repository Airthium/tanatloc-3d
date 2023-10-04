import { Switch, Tooltip } from 'antd'
import { TableOutlined } from '@ant-design/icons'

/**
 * Results
 * @returns Results
 */
const Results = () => {
  /**
   * Render
   */
  return (
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
    </Tooltip>
  )
}

export default Results
