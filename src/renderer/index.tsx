// import { useEffect } from 'react'
import { ConfigProvider, Layout, ThemeConfig } from 'antd'

import { Tanatloc3DRendererProps } from '@index'

import useStore from '@store'

import Header from '@header'

import style from '@style/Renderer'
import { useEffect } from 'react'

/**
 * Renderer
 * @returns Renderer
 */
const Renderer = (props: Tanatloc3DRendererProps & { theme?: ThemeConfig }) => {
  console.log('render renderer')
  useEffect(() => {
    useStore.setState({ props })
  }, [props])

  // TODO
  // // Clean
  // useEffect(() => {
  //   return () => {
  //     useStore.setState({ props: {} })
  //   }
  // }, [])

  /**
   * Render
   */
  return (
    <ConfigProvider theme={props.theme}>
      <Layout style={style.layout}>
        <Header />
      </Layout>
    </ConfigProvider>
  )
}

export default Renderer
