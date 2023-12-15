import { fireEvent, render, screen } from '@testing-library/react'

import WebGL from '.'

jest.mock('./info/noManipBrowser', () => () => <div />)
jest.mock('./info/firefoxWindows', () => () => <div />)
jest.mock('./info/firefoxMac', () => () => <div />)
jest.mock('./info/safariMac', () => () => <div />)

describe('components/webgl', () => {
  test('render', () => {
    const { unmount } = render(<WebGL />)

    unmount()
  })

  test('back', () => {
    const { unmount } = render(<WebGL />)

    const button = screen.getByRole('button', {
      name: 'Return to the previous page'
    })
    fireEvent.click(button)

    unmount()
  })

  test('modals', () => {
    const { unmount } = render(<WebGL />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })
})
