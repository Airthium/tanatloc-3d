import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './Canvas'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App snapshot={{ project: { apiRoute: async () => undefined } }} />
  </React.StrictMode>
)
