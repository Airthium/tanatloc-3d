import { useContext, useEffect, useState } from 'react'

import { Context } from './context'

import PartLoader from './loader'
import { setGeometryDimension } from './context/actions'

/**
 * Parts
 * @returns Parts
 */
const Parts = (): React.JSX.Element => {
  // State
  const [children, setChildren] = useState<React.JSX.Element[]>([])

  // Context
  const {
    props: { parts },
    dispatch
  } = useContext(Context)

  // Manage parts
  useEffect(() => {
    if (!parts?.length) return

    // Check dimension of all geometries
    let dimension = 3
    parts.forEach((part) => {
      const localDimension = part.summary.dimension ?? 3
      dimension = Math.min(dimension, localDimension)
    })
    dispatch(setGeometryDimension(dimension))

    // Check parts to add
    const toAdd = parts.filter(
      (part) =>
        !children.find((child) => child.props.uuid === part.summary.uuid)
    )

    // Check children to remove
    const toRemove = children.filter(
      (child) => !parts?.find((part) => part.summary.uuid === child.props.uuid)
    )

    // Check
    if (!toAdd.length && !toRemove.length) return

    // Remove
    let newChildren = [...children]
    if (toRemove.length) {
      toRemove.forEach((remove) => {
        const index = children.findIndex(
          (child) => child.props.uuid === remove.props.uuid
        )
        newChildren = [
          ...newChildren.slice(0, index),
          ...newChildren.slice(index + 1)
        ]
      })
    }

    // Add
    if (toAdd.length) {
      toAdd.forEach((add) => {
        newChildren.push(
          <PartLoader
            key={add.summary.uuid}
            part={add}
            uuid={add.summary.uuid}
          />
        )
      })
    }

    // Update children
    setChildren(newChildren)
  }, [parts, children])

  /**
   * Render
   */
  return <>{children}</>
}

export default Parts
