import { useEffect, useMemo } from 'react'
import { ConfigProvider, Layout, ThemeConfig } from 'antd'

import { Tanatloc3DRendererProps } from '@index'

import useStore from '@store'

import Header from '@header'

import style from '@style/Renderer'

/**
 * Renderer
 * @returns Renderer
 */
const Renderer: React.FunctionComponent<
  Tanatloc3DRendererProps & { theme?: ThemeConfig }
> = (props) => {
  // Store
  const { parts } = useStore((s) => s.props)

  // Store update & clean
  useEffect(() => {
    useStore.setState({ props })

    return () => {
      useStore.setState({ props: {} })
    }
  }, [props])

  // At least one part
  const oneResult = useMemo(
    () => !!parts?.find((part) => part.summary.type === 'result'),
    [parts]
  )
  /**
   * Render
   */
  return (
    <ConfigProvider theme={props.theme}>
      <Layout style={style.layout}>
        <Header oneResult={oneResult} />
      </Layout>
    </ConfigProvider>
  )
}

export default Renderer
