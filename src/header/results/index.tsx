import { useCallback } from 'react'
import { Switch, Tooltip } from 'antd'
import { TableOutlined } from '@ant-design/icons'
import { SwitchChangeEventHandler } from 'antd/es/switch'

import useStore from '@store'

/**
 * Results
 * @returns Results
 */
const Results: React.FunctionComponent = () => {
  // Store
  const result = useStore((s) => s.result)

  /**
   * On mesh visible change
   * @param checked Checked
   */
  const onMeshVisibleChange: SwitchChangeEventHandler = useCallback(
    (checked) => {
      useStore.setState({ result: { ...result, meshVisible: checked } })
    },
    [result]
  )

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
        checked={result.meshVisible}
        checkedChildren={<TableOutlined />}
        unCheckedChildren={<TableOutlined />}
        onChange={onMeshVisibleChange}
      />
    </Tooltip>
  )
}

export default Results
