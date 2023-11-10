import { ReactNode } from 'react'

import { Tanatloc3DCanvasProps } from '@index'

import { actionTypes } from '.'

/**
 * Set props
 * @param props Props
 * @returns Action
 */
export const setProps = (props?: Tanatloc3DCanvasProps) => ({
  type: actionTypes.SETPROPS,
  value: props
})

/**
 * Set children
 * @param props Children
 * @returns Action
 */
export const setChildren = (children?: ReactNode[]) => ({
  type: actionTypes.SETCHILDREN,
  value: children
})
