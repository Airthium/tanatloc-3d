import { CSSProperties, ReactNode } from 'react'
import { ThemeConfig } from 'antd'

/**
 * Tanatloc3D Canvas props
 */
export interface Tanatloc3DCanvasProps {
  toWebGL?: React.MouseEventHandler<HTMLElement>
}

/**
 * Tanatloc3D renderer props
 */
export interface Tanatloc3DRendererProps {
  style?: CSSProperties
  parts?: Tanatloc3DPart[]
  selection?: Tanatloc3DSelection
  data?: boolean
  postProcessing?: boolean
  snapshot?: Tanatloc3DRendererPropsSnapshot
  onData?: () => void
  onPostProcessing?: () => void
}

export interface Tanatloc3DRendererPropsSnapshot {
  project?: {
    apiRoute: (image: string) => Promise<void>
    size?: { width: number; height: number }
  }
}

/**
 * Selection
 */
export interface Tanatloc3DSelection {
  enabled?: boolean
  part?: string
  type?: 'solids' | 'faces' | 'edges' | 'point'
  highlighted?: Tanatloc3DSelectionValue
  selected?: Tanatloc3DSelectionValue[]
  point?: Tanatloc3DSelectionPoint
  onHighlight?: (highlighted?: Tanatloc3DSelectionValue) => void
  onSelect?: (selected: Tanatloc3DSelectionValue[]) => void
  onPoint?: (point: Tanatloc3DSelectionPoint) => void
}

export interface Tanatloc3DSelectionValue {
  uuid: string
  label: number
}

export interface Tanatloc3DSelectionPoint {
  x: number
  y: nubmer
  z: number
}

/**
 * Tanatloc3D part
 */
export interface Tanatloc3DPart {
  summary: Tanatloc3DPartSummary
  buffer: Buffer
  extra?: {
    name?: string
    id?: string
    glb?: string
    fields?: {
      name: string
      units?: Tanatloc3DPart[]
      unit?: Tanatloc3DPartUnit
    }[]
  }
}

export interface Tanatloc3DPartSummary {
  uuid: string
  type: 'geometry2D' | 'geometry3D' | 'mesh' | 'result'
  dimension: number
  solids?: Tanatloc3DPartSummaryElement[]
  faces?: Tanatloc3DPartSummaryElement[]
  edges?: Tanatloc3DPartSummaryElement[]
}

export interface Tanatloc3DPartSummaryElement {
  name: string
  uuid: string
  label: number
  color?: Tanatloc3DPartSummaryColor
}

export interface Tanatloc3DPartSummaryColor {
  r: number
  g: number
  b: number
}

export interface Tanatloc3DPartUnit {
  label: string
  multiplicator?: number
  adder?: number
}

export type {
  Tanatloc3DRendererProps,
  Tanatloc3DPart,
  Tanatloc3DSelection,
  Tanatloc3DSelectionValue,
  Tanatloc3DSelectionPoint
}

/**
 * Tanatloc3D WebGL props
 */
export interface Tanatloc3DWebGLProps {
  logo?: ReactNode
  back?: React.MouseEventHandler<HTMLElement>
}

// Components
const Canvas: React.FunctionComponent<Tanatloc3DCanvasProps>

const Renderer: React.FunctionComponent<
  Tanatloc3DRendererProps & { theme?: ThemeConfig }
>

const _404: React.FunctionComponent

const Background: React.FunctionComponent

const WebGL: React.FunctionComponent<Tanatloc3DWebGLProps>

const Tanatloc3D = { Canvas, Renderer, extra: { _404, Background, WebGL } }
export default Tanatloc3D
