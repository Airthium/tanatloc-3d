import { useCallback, useContext, useEffect, useMemo } from 'react'
import { Box2, Vector2 } from 'three'

import { Context } from '../../context'
import { setZoomToSelectionEnabled } from '../../context/actions'

import zoomToRect from '../../tools/zoomToRect'

// Selection box
let div: HTMLDivElement

// Start point
const startPoint = new Vector2()

// End point
const endPoint = new Vector2()

/**
 * ZoomToSelection
 * @returns ZoomToSelection
 */
const ZoomToSelection = (): null => {
  // Context
  const { mainView, zoomToSelection, dispatch } = useContext(Context)

  // Parent
  const parentElement = useMemo(() => {
    if (!mainView.gl) return

    return mainView.gl.domElement.parentElement!
  }, [mainView.gl])

  // Selection box
  useEffect(() => {
    if (!parentElement) return

    // Selection box
    div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.display = 'none'
    div.style.border = '1px solid #55aaff'
    div.style.backgroundColor = 'rgba(75, 160, 255, 0.3)'
    div.style.pointerEvents = 'none'
    div.style.left = '0'
    div.style.top = '0'
    div.style.width = '0'
    div.style.height = '0'
    div.style.zIndex = '100'
    parentElement.appendChild(div)

    // Cleanup
    return () => {
      parentElement.removeChild(div)
    }
  }, [parentElement])

  /**
   * Pointer down
   * @param event Event
   */
  const onPointerDown = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return

      // x, y
      const x = event.clientX
      const y = event.clientY

      // Rect
      const rect = parentElement.getBoundingClientRect()

      // Left, top
      const left = x - rect.left
      const top = y - rect.top

      // Selection box
      div.style.display = 'block'
      div.style.left = left + 'px'
      div.style.top = top + 'px'
      div.style.width = '0'
      div.style.height = '0'

      // Save start point
      startPoint.x = left
      startPoint.y = top
    },
    [parentElement]
  )

  /**
   * Pointer move
   * @param event Event
   */
  const onPointerMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return

      // x, y
      const x = event.clientX
      const y = event.clientY

      // Rect
      const rect = parentElement.getBoundingClientRect()

      // Left, top
      const left = x - rect.left
      const top = y - rect.top

      // Bottom point
      const bottomRightX = Math.max(startPoint.x, left)
      const bottomRightY = Math.max(startPoint.y, top)

      // Top left
      const topLeftX = Math.min(startPoint.x, left)
      const topLeftY = Math.min(startPoint.y, top)

      div.style.left = topLeftX + 'px'
      div.style.top = topLeftY + 'px'
      div.style.width = bottomRightX - topLeftX + 'px'
      div.style.height = bottomRightY - topLeftY + 'px'
    },
    [parentElement]
  )

  /**
   * Pointer up
   * @param event Event
   */
  const onPointerUp = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return
      if (
        !mainView.gl ||
        !mainView.scene ||
        !mainView.camera ||
        !mainView.controls
      )
        return

      // x, y
      const x = event.clientX
      const y = event.clientY

      // Rect
      const rect = parentElement.getBoundingClientRect()

      // Left, top
      const left = x - rect.left
      const top = y - rect.top

      // Selection box
      div.style.display = 'none'
      div.style.left = '0'
      div.style.top = '0'
      div.style.width = '0'
      div.style.height = '0'

      // Start, end point
      startPoint.x = startPoint.x + left
      startPoint.y = startPoint.y + top

      endPoint.x = x
      endPoint.y = y

      // Zoom to rect
      zoomToRect(
        new Box2(startPoint, endPoint),
        mainView.gl,
        mainView.scene,
        mainView.camera,
        mainView.controls
      )

      // Disabled zoom to selection
      dispatch(setZoomToSelectionEnabled(false))
    },
    [
      parentElement,
      mainView.gl,
      mainView.scene,
      mainView.camera,
      mainView.controls,
      dispatch
    ]
  )

  // Event initialization
  useEffect(() => {
    if (!parentElement) return
    if (!mainView.controls) return

    if (zoomToSelection.enabled) {
      // Disable controls
      mainView.controls.enabled = false

      document.addEventListener('pointerdown', onPointerDown)
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    } else {
      // Enable controls
      mainView.controls.enabled = true

      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    // Cleanup
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [
    parentElement,
    mainView.controls,
    zoomToSelection.enabled,
    onPointerDown,
    onPointerMove,
    onPointerUp
  ])

  /**
   * Render
   */
  return null
}

export default ZoomToSelection
