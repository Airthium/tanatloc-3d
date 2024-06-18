// Cube size
export const cubeSize = 60

// Corner size
export const cornerSize = 10

// Faces
export interface Face {
  name: string
  size: number
  position: [number, number, number]
  lookAt: [number, number, number]
  up: [number, number, number]
}

const faceOffset = cubeSize / 2
export const faces: Face[] = [
  {
    name: 'front',
    size: cubeSize,
    position: [0, 0, faceOffset],
    lookAt: [0, 0, 1],
    up: [0, 1, 0]
  },
  {
    name: 'right',
    size: cubeSize,
    position: [faceOffset, 0, 0],
    lookAt: [1, 0, 0],
    up: [0, 1, 0]
  },
  {
    name: 'back',
    size: cubeSize,
    position: [0, 0, -faceOffset],
    lookAt: [0, 0, -1],
    up: [0, 1, 0]
  },
  {
    name: 'left',
    size: cubeSize,
    position: [-faceOffset, 0, 0],
    lookAt: [-1, 0, 0],
    up: [0, 1, 0]
  },
  {
    name: 'top',
    size: cubeSize,
    position: [0, faceOffset, 0],
    lookAt: [0, 1, 0],
    up: [0, 0, -1]
  },
  {
    name: 'bottom',
    size: cubeSize,
    position: [0, -faceOffset, 0],
    lookAt: [0, -1, 0],
    up: [0, 0, 1]
  }
]

// Corners
export interface Corner {
  name: string
  size: number
  position: [number, number, number]
  lookAt: [number, number, number]
  up: [number, number, number]
}

const cornerOffset = cubeSize / 2 - (4 * cornerSize) / 10
export const corners: Corner[] = [
  {
    name: 'topFrontRight',
    size: cornerSize,
    position: [cornerOffset, cornerOffset, cornerOffset],
    lookAt: [1, 1, 1],
    up: [0, 1, 0]
  },
  {
    name: 'topBackRight',
    size: cornerSize,
    position: [cornerOffset, cornerOffset, -cornerOffset],
    lookAt: [1, 1, -1],
    up: [0, 1, 0]
  },
  {
    name: 'topBackLeft',
    size: cornerSize,
    position: [-cornerOffset, cornerOffset, -cornerOffset],
    lookAt: [-1, 1, -1],
    up: [0, 1, 0]
  },
  {
    name: 'topFrontLeft',
    size: cornerSize,
    position: [-cornerOffset, cornerOffset, cornerOffset],
    lookAt: [-1, 1, 1],
    up: [0, 1, 0]
  },
  {
    name: 'bottomFrontRight',
    size: cornerSize,
    position: [cornerOffset, -cornerOffset, cornerOffset],
    lookAt: [1, -1, 1],
    up: [0, -1, 0]
  },
  {
    name: 'bottomBackRight',
    size: cornerSize,
    position: [cornerOffset, -cornerOffset, -cornerOffset],
    lookAt: [1, -1, -1],
    up: [0, -1, 0]
  },
  {
    name: 'bottomBackLeft',
    size: cornerSize,
    position: [-cornerOffset, -cornerOffset, -cornerOffset],
    lookAt: [-1, -1, -1],
    up: [0, -1, 0]
  },
  {
    name: 'bottomFrontLeft',
    size: cornerSize,
    position: [-cornerOffset, -cornerOffset, cornerOffset],
    lookAt: [-1, -1, 1],
    up: [0, -1, 0]
  }
]

// Obliques
export interface Oblique {
  name: string
  size: [number, number, number]
  position: [number, number, number]
  lookAt: [number, number, number]
  up: [number, number, number]
}

const obliqueWidth = (cubeSize - cornerSize) / 2
const obliqueHeight = cornerSize
const obliqueOffset = cubeSize / 2 - (4 * cornerSize) / 10
export const obliques: Oblique[] = [
  {
    name: 'topFront',
    size: [obliqueWidth, obliqueHeight, obliqueHeight],
    position: [0, obliqueOffset, obliqueOffset],
    lookAt: [0, 1, 1],
    up: [0, 1, 0]
  },
  {
    name: 'topRight',
    size: [obliqueHeight, obliqueHeight, obliqueWidth],
    position: [obliqueOffset, obliqueOffset, 0],
    lookAt: [1, 1, 0],
    up: [0, 1, 0]
  },
  {
    name: 'topBack',
    size: [obliqueWidth, obliqueHeight, obliqueHeight],
    position: [0, obliqueOffset, -obliqueOffset],
    lookAt: [0, 1, -1],
    up: [0, 1, 0]
  },
  {
    name: 'topLeft',
    size: [obliqueHeight, obliqueHeight, obliqueWidth],
    position: [-obliqueOffset, obliqueOffset, 0],
    lookAt: [-1, 1, 0],
    up: [0, 1, 0]
  },
  {
    name: 'bottomFront',
    size: [obliqueWidth, obliqueHeight, obliqueHeight],
    position: [0, -obliqueOffset, obliqueOffset],
    lookAt: [0, -1, 1],
    up: [0, 1, 0]
  },
  {
    name: 'bottomRight',
    size: [obliqueHeight, obliqueHeight, obliqueWidth],
    position: [obliqueOffset, -obliqueOffset, 0],
    lookAt: [1, -1, 0],
    up: [0, 1, 0]
  },
  {
    name: 'bottomBack',
    size: [obliqueWidth, obliqueHeight, obliqueHeight],
    position: [0, -obliqueOffset, -obliqueOffset],
    lookAt: [0, -1, -1],
    up: [0, 1, 0]
  },
  {
    name: 'bottomLeft',
    size: [obliqueHeight, obliqueHeight, obliqueWidth],
    position: [-obliqueOffset, -obliqueOffset, 0],
    lookAt: [-1, -1, 0],
    up: [0, 1, 0]
  },
  {
    name: 'frontRight',
    size: [obliqueHeight, obliqueWidth, obliqueHeight],
    position: [obliqueOffset, 0, obliqueOffset],
    lookAt: [1, 0, 1],
    up: [0, 1, 0]
  },
  {
    name: 'rightBack',
    size: [obliqueHeight, obliqueWidth, obliqueHeight],
    position: [obliqueOffset, 0, -obliqueOffset],
    lookAt: [1, 0, -1],
    up: [0, 1, 0]
  },
  {
    name: 'backLeft',
    size: [obliqueHeight, obliqueWidth, obliqueHeight],
    position: [-obliqueOffset, 0, -obliqueOffset],
    lookAt: [-1, 0, -1],
    up: [0, 1, 0]
  },
  {
    name: 'leftFront',
    size: [obliqueHeight, obliqueWidth, obliqueHeight],
    position: [-obliqueOffset, 0, obliqueOffset],
    lookAt: [-1, 0, 1],
    up: [0, 1, 0]
  }
]
