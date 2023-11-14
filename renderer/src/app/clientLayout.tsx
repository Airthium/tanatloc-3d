'use client'

import * as Tanatloc3D from '../../../dist'

const ClientLayout = ({ children }) => {
  return (
    <>
      {children}
      <Tanatloc3D.default.Canvas />
    </>
  )
}

export default ClientLayout
