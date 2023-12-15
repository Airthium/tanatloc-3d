import { useCallback, useEffect, useMemo } from 'react'
import { Box2, Vector2 } from 'three'

import useStore from '@store'

import zoomToRect from '@tools/zoomToRect'

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
const ZoomToSelection: React.FunctionComponent = () => {
  // Store
  const { camera, controls, gl, scene } = useStore((s) => s.mainView)
  const zoomToSelection = useStore((s) => s.zoomToSelection)

  // Parent
  const parentElement = useMemo(() => {
    if (!gl) return

    return gl.domElement.parentElement!
  }, [gl])

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
      // x, y
      const x = event.clientX
      const y = event.clientY

      // Rect
      const rect = parentElement!.getBoundingClientRect()

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
      // x, y
      const x = event.clientX
      const y = event.clientY

      // Rect
      const rect = parentElement!.getBoundingClientRect()

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
      if (!gl || !scene?.children.length || !camera || !controls) return

      // x, y
      const x = event.clientX
      const y = event.clientY

      // Rect
      const rect = parentElement!.getBoundingClientRect()

      // Left, top
      const left = x + rect.left
      const top = y + rect.top

      // Selection box
      div.style.display = 'none'
      div.style.left = '0'
      div.style.top = '0'
      div.style.width = '0'
      div.style.height = '0'

      // End point
      endPoint.x = left
      endPoint.y = top

      // Zoom to rect
      zoomToRect(
        new Box2(startPoint, endPoint),
        gl,
        scene.children,
        camera,
        controls
      )

      // Disabled zoom to selection
      useStore.setState({
        zoomToSelection: { ...zoomToSelection, enabled: false }
      })
    },
    [
      parentElement,
      camera,
      controls,
      gl,
      scene?.children,
      scene?.children.length,
      zoomToSelection
    ]
  )

  // Event initialization
  useEffect(() => {
    if (!parentElement) return
    if (!controls) return

    if (zoomToSelection.enabled) {
      // Disable controls
      controls.enabled = false

      document.addEventListener('pointerdown', onPointerDown)
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    } else {
      // Enable controls
      controls.enabled = true

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
    controls,
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
