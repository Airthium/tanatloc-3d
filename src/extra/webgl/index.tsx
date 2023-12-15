import { ReactNode, useCallback, useMemo } from 'react'
import { Button, Card, Modal, Layout, Typography, List } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

import { Tanatloc3DWebGLProps } from '@index'

import NoManipBrowser from './info/noManipBrowser'
import FirefoxWindows from './info/firefoxWindows'
import FirefoxMac from './info/firefoxMac'
import SafariMac from './info/safariMac'

import style from '@style/WebGL'

/**
 * WebGL error
 * @returns WebGLError
 */
const WebGLError: React.FunctionComponent<Tanatloc3DWebGLProps> = ({
  logo,
  back
}) => {
  /**
   * Chrome Windows
   */
  const chromeWindows = useCallback((): void => {
    Modal.info({
      title: 'Google Chrome (Windows)',
      content: <NoManipBrowser />
    })
  }, [])

  /**
   * Chrome Mac/Linux
   */
  const chromeMacLinux = useCallback((): void => {
    Modal.info({
      title: 'Google Chrome (MacOS / Linux)',
      content: <NoManipBrowser />
    })
  }, [])

  /**
   * Firefox Windows
   */
  const firefoxWindows = useCallback((): void => {
    Modal.info({
      title: 'Firefox (Windows)',
      content: <FirefoxWindows />
    })
  }, [])

  /**
   * Firefox Mac/Linux
   */
  const firefoxMacLinux = useCallback((): void => {
    Modal.info({
      title: 'Firefox (MacOS / Linux)',
      content: <FirefoxMac />
    })
  }, [])

  /**
   * Edge windows
   */
  const edgeWindows = useCallback((): void => {
    Modal.info({
      title: 'Microsoft Edge (Windows)',
      content: <NoManipBrowser />
    })
  }, [])

  /**
   * Safari Mac
   */
  const safariMac = useCallback((): void => {
    Modal.info({
      title: 'Safari (MacOS)',
      content: <SafariMac />
    })
  }, [])

  const windowsDataSource = useMemo(
    () => [
      <Button key="chrome" onClick={chromeWindows}>
        Google Chrome
      </Button>,
      <Button key="firefox" onClick={firefoxWindows}>
        Mozilla Firefox
      </Button>,
      <Button key="edge" onClick={edgeWindows}>
        Microsoft Edge
      </Button>
    ],
    [chromeWindows, firefoxWindows, edgeWindows]
  )

  const macLinuxDataSource = useMemo(
    () => [
      <Button key="chrome" onClick={chromeMacLinux}>
        Google Chrome
      </Button>,
      <Button key="firefox" onClick={firefoxMacLinux}>
        Mozilla Firefox
      </Button>,
      <Button key="safari" onClick={safariMac}>
        Safari
      </Button>
    ],
    [chromeMacLinux, firefoxMacLinux, safariMac]
  )

  /**
   * Render item
   * @param item Item
   */
  const renderItem = useCallback(
    (item: ReactNode) => <List.Item>{item}</List.Item>,
    []
  )

  /**
   * Render
   */
  return (
    <Layout style={style.layout}>
      <Layout.Header style={style.header}>{logo}</Layout.Header>
      <Layout.Content style={style.content}>
        <Card title="WebGL Error" style={style.card}>
          <Typography.Text>
            <AlertOutlined style={{ color: 'red' }} />{' '}
            {'WebGL is not enabled on your device. Please enable it.'}
          </Typography.Text>
          <Typography.Text>
            <Button onClick={back}>Return to the previous page</Button>
          </Typography.Text>
        </Card>
        <Card
          title="How to enable WebGL"
          style={style.largeCard}
          bodyStyle={style.largeCardBody}
        >
          <Card title="Windows" style={style.card}>
            <List dataSource={windowsDataSource} renderItem={renderItem} />
          </Card>
          <Card title="MacOS / Linux" style={style.card}>
            <List dataSource={macLinuxDataSource} renderItem={renderItem} />
          </Card>
        </Card>
        <Card title="WebGL Check" style={style.card}>
          <Typography.Text>
            Visit{' '}
            <a href="https://get.webgl.org" target="_blank" rel="noreferrer">
              {' '}
              this website
            </a>{' '}
            to check if WebGL is enabled on your device
          </Typography.Text>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default WebGLError
