'use client'

import { ReactNode } from 'react'

import Tanatloc3D from 'tanatloc-3d'

const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Tanatloc3D.Canvas />
    </>
  )
}

export default ClientLayout
