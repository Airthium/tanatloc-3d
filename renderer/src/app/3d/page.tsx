'use client'

import Link from 'next/link'
//@ts-ignore
import Tanatloc3D from '../../../../dist/Canvas'
import { Tanatloc3DPart } from '../../../../index.d'

import geometry2D from '../../assets/geometry2D'
import geometry3D from '../../assets/geometry3D'
import mesh from '../../assets/mesh'
import result from '../../assets/result'
import { Button } from 'antd'
import { useCallback, useState } from 'react'

const parts = [geometry2D, geometry3D, mesh, result] as Tanatloc3DPart[]
let i = 0

const ThreeD = () => {
  const [part, setPart] = useState<Tanatloc3DPart>(parts[i % parts.length])

  const changePart = useCallback(() => {
    i++
    setPart(parts[i % parts.length])
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%'
      }}
    >
      <div>
        <Link href="/">Previous</Link>
        <Button onClick={changePart}>Change part</Button>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Tanatloc3D
          parts={[part]}
          // selection="face"
          data={true}
          postProcessing={true}
          snapshot={{
            project: {
              apiRoute: async (image: string) => console.log(image),
              size: { width: 255, height: 255 }
            }
          }}
          onHighlight={console.log}
          onSelect={console.log}
          onData={() => console.log('data')}
          onPostProcessing={() => console.log('post-processing')}
        />
      </div>
    </div>
  )
}

export default ThreeD
