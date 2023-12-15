import { Typography } from 'antd'

/**
 * No manipulation browser
 * @returns NoManipBrowser
 */
const NoManipBrowser: React.FunctionComponent = () => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={5} mark={true}>
        No manipulation needed
      </Typography.Title>
      <Typography.Text>
        This browser has full support for WebGL on all platforms.
      </Typography.Text>
      <br />
      <Typography.Text>
        If you are having issues with WebGL, you may need to update to the
        latest version of your browser.
      </Typography.Text>
    </>
  )
}

export default NoManipBrowser
