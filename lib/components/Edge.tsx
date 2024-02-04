import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EdgeProps,
  getBezierPath,
  Node,
  OnSelectionChangeParams,
  useOnSelectionChange,
  useStoreApi,
  useViewport,
} from '@xyflow/react'
import { GraphConfig } from '../config.ts'
import { useGraphApi } from '../context/GraphContext.tsx'

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
  targetHandleId,
  style = {},
  markerEnd,
  selected,
  target,
  source,
}: EdgeProps) {
  const [selection, setSelection] = useState(SelectionState.Nothing)
  const graphApi = useGraphApi()
  const api = useStoreApi()
  const [edgePath] = getBezierPath({
    sourceX: sourceX - 20,
    sourceY: sourceY,
    sourcePosition,
    targetX: targetX + 20,
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
  useEffect(() => {
    onSelectionChange({
      nodes: api.getState().nodes.filter((n) => n.selected),
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

    const config = graphApi.getState().config

    // If nothing is selected, show the default color
    // If something is selected, show the default color if this edge is connected to the something
    // If something is selected, show the default color if this edge is not connected to the something
    switch (selection) {
      case SelectionState.Related:
        // todo:(performance) may need to revisit this if performance becomes a concern
        const valueType = getTargetHandleValueType(
          config,
          api.getState().nodes,
          target,
          targetHandleId,
        )
        if (valueType) {
          return config.valueType(valueType).color
        }
        return '#3c3c3c'
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

/**
 * Get the value type of the target handle. This function finds the node that the edge
 * is connected to (the target node), the target handle on that node (using the handle's
 * ID) and uses the config to resolve the value type of that handle.
 * @param config
 * @param nodes
 * @param targetNodeId
 * @param targetHandleId
 */
function getTargetHandleValueType(
  config: GraphConfig,
  nodes: Node[],
  targetNodeId: string,
  targetHandleId: string | null | undefined,
): string | null {
  const node = nodes.find((n) => n.id === targetNodeId)
  if (node) {
    return config
      .getNodeConfig(node.type!)
      .inputs?.find((input) => input.id === targetHandleId)?.valueType as
      | string
      | null
  }
  return null
}
