import React from 'react'

// Enable act environment
global.IS_REACT_ACT_ENVIRONMENT = true

// Mock @react-three/drei Text
const MockText = React.forwardRef((props, ref) => {
  return <mesh ref={ref} name={props.children}></mesh>
})
jest.mock('@react-three/drei', () => ({
  ...jest.requireActual('@react-three/drei'),
  Text: MockText
}))

jest.mock('antd', () => {
  const Form = ({ children, onFinish }) => (
    <>
      {children}
      {(onFinishProps = onFinish)}
    </>
  )
  Form.useForm = () => [{ setFieldsValue: jest.fn }]
  Form.Item = () => <></>
  return {
    ...jest.requireActual('antd'),
    Tooltip: ({ children }) => <>{children}</>,
    Dropdown: ({ children, menu }) => (
      <>
        {children}
        {menu.items.map((item) => (
          <div
            key={item.key}
            role="menuitem"
            onClick={() => menu.onClick(item.key)}
          >
            {item.label}
          </div>
        ))}
      </>
    ),
    ColorPicker: () => (
      <div>
        <input value={'color'} />
      </div>
    ),
    Form
  }
})

// window.matchmedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn,
    removeListener: jest.fn,
    addEventListener: jest.fn,
    removeEventListener: jest.fn,
    dispatchEvent: jest.fn
  })
})

// Resize observer
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))
