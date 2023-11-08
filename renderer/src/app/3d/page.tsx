'use client'

import Tanatloc3D from '../../../../dist/Canvas'
import { Tanatloc3DPart } from '../../../../index.d'

// import geometry2D from '../assets/geometry2D'
// import geometry3D from '../assets/geometry3D'
// import mesh from '../assets/mesh'
import result from '../../assets/result'

const ThreeD = () => {
  return (
    <Tanatloc3D
      parts={[result as Tanatloc3DPart]}
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
  )
}

export default ThreeD
