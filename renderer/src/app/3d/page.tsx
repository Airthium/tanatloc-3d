'use client'

import Link from 'next/link'

import Tanatloc3D, { Tanatloc3DPart } from 'tanatloc-3d'

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
    <>
      <div
        style={{
          width: '158px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '20px',
          borderRight: '2px solid #abcdef'
        }}
      >
        <Link href="/">Previous</Link>
        <Button onClick={changePart}>Change part</Button>
      </div>

      <Tanatloc3D.Renderer
        style={{ width: 'calc(100vw - 200px)' }}
        parts={[part]}
        selection={{
          enabled: true,
          // part: geometry3D.summary.uuid,
          part: geometry2D.summary.uuid,
          // type: 'faces',
          type: 'edges',
          highlighted: {
            // uuid: geometry3D.summary.faces![1].uuid,
            // label: geometry3D.summary.faces![1].label
            uuid: geometry2D.summary.edges![0].uuid,
            label: geometry2D.summary.edges![0].label
          },

          selected: [
            {
              // uuid: geometry3D.summary.faces![0].uuid,
              // label: geometry3D.summary.faces![0].label
              uuid: geometry2D.summary.edges![1].uuid,
              label: geometry2D.summary.edges![1].label
            }
          ]
        }}
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
    </>
  )
}

export default ThreeD
