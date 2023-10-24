'use client'

import Tanatloc3D from '../../../dist/Canvas'
import { MyCanvasPart } from '../../../index.d'

import geometry3D from '../assets/geometry3D'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Tanatloc3D
        parts={[geometry3D as MyCanvasPart]}
        // selection="face"
        data={true}
        postProcessing={true}
        snapshot={{
          project: {
            apiRoute: async (image) => console.log(image),
            size: { width: 255, height: 255 }
          }
        }}
        onHighlight={console.log}
        onSelect={console.log}
        onData={() => console.log('data')}
        onPostProcessing={() => console.log('post-processing')}
      />
    </main>
  )
}
