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

// window.matchmedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  })
})

// Resize observer
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))
