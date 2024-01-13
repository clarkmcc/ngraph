import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EdgeProps,
  getBezierPath,
  OnSelectionChangeParams,
  useOnSelectionChange,
  useStoreApi,
  useViewport,
} from 'reactflow'
import { useGraphConfig } from '../context/GraphConfigContext'

/**
 * Edges can be highlighted in the graph if they're connected to a node that is selected.
 * We do this by identifying the following selection states for each of the edges in the
 * graph.
 */
enum SelectionState {
  /**
   * Nothing is selected in the graph, including this edge
   */
  Nothing,
  /**
   * Something is selected in the graph, but this edge is not connected to it
   */
  Something,
  /**
   * Something is selected in the graph, and this edge is connected to it
   */
  Related,
}

export function Edge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
  target,
  source,
}: EdgeProps) {
  const [selection, setSelection] = useState(SelectionState.Nothing)
  const [config] = useGraphConfig()
  const [edgePath] = getBezierPath({
    sourceX: sourceX - 8,
    sourceY: sourceY,
    sourcePosition,
    targetX: targetX + 8,
    targetY: targetY,
    targetPosition,
  })

  // Determine what is selected. This fires on every selection across the graph,
  // but it's how we determine whether this edge is implicitly selected by virtue
  // of its source or target being selected.
  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      if (nodes.length === 0) {
        setSelection(SelectionState.Nothing)
      } else {
        if (nodes.some((n) => n.id === target || n.id === source)) {
          setSelection(SelectionState.Related)
        } else {
          setSelection(SelectionState.Something)
        }
      }
    },
    [target, source],
  )

  // Determine selection state once initially
  const api = useStoreApi()
  useEffect(() => {
    onSelectionChange({
      nodes: api
        .getState()
        .getNodes()
        .filter((n) => n.selected),
      edges: [],
    })
  }, [])

  // Determine selection state on every selection change
  useOnSelectionChange({
    onChange: onSelectionChange,
  })

  const stroke = useMemo(() => {
    if (selected) {
      return '#fff'
    }
    // If nothing is selected, show the default color
    // If something is selected, show the default color if this edge is connected to the something
    // If something is selected, show the default color if this edge is not connected to the something
    switch (selection) {
      case SelectionState.Related:
        return config.valueType(data.targetHandleType).color
      case SelectionState.Nothing:
      case SelectionState.Something:
        return '#3c3c3c'
    }
  }, [selected, selection])

  const { zoom } = useViewport()

  return (
    <>
      {/*  Transparent path that's thicker and easier to click on */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 30,
          stroke: 'rgba(0,0,0,0)',
        }}
      ></path>
      {/*  The actual path that is drawn */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 3 / zoom,
          stroke,
        }}
      ></path>
    </>
  )
}
