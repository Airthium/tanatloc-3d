import { ThemeConfig } from 'antd'

/**
 * Tanatloc3D props
 */
export interface Tanatloc3DProps {
  parts?: Tanatloc3DPart[]
  selection?: Selection
  data?: boolean
  postProcessing?: boolean
  snapshot?: Tanatloc3DPropsSnapshot
  onHighlight?: (uuid?: string) => void
  onSelect?: (uuids: string[]) => void
  onData?: () => void
  onPostProcessing?: () => void
}

export interface Tanatloc3DPropsSnapshot {
  project?: {
    apiRoute: (image: string) => Promise<void>
    size?: { width: number; height: number }
  }
}

/**
 * Selection
 */
export type Selection = 'solid' | 'face' | 'edge'

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

export type { Tanatloc3DProps, Tanatloc3DPart, Selection }

export default function Tanatloc3D(
  props: Tanatloc3DProps & { theme?: ThemeConfig }
): React.JSX.Element
