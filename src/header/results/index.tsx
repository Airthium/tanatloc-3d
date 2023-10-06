import { useCallback, useContext } from 'react'
import { Switch, Tooltip } from 'antd'
import { TableOutlined } from '@ant-design/icons'
import { SwitchChangeEventHandler } from 'antd/es/switch'

import { Context } from '../../context'
import { setResultMeshVisible } from '../../context/actions'

/**
 * Results
 * @returns Results
 */
const Results = () => {
  // Context
  const { result, dispatch } = useContext(Context)

  /**
   * On mesh visible change
   * @param checked Checked
   */
  const onMeshVisibleChange: SwitchChangeEventHandler = useCallback(
    (checked) => {
      dispatch(setResultMeshVisible(checked))
    },
    [dispatch]
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
