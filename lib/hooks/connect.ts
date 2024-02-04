import { addEdge, Connection, useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import { Graph } from '../types'

export function useSocketConnect() {
  const { setEdges, getEdges, getNodes } = useReactFlow<
    Graph.Node,
    Graph.Edge
  >()
  return useCallback(
    (params: Connection) => {
      if (params.target === null || params.source === null) {
        return
      }

      const targetNode = getNodes().find((node) => node.id === params.target)!
      const targetInput = targetNode.data.internal.inputs.find(
        (input) => input.id === params.targetHandle,
      )

      // We remove all edges that have the same target and targetHandle
      // if the target handle is not an array type
      const edgesToRemove = targetInput
        ? getEdges().filter(
            (e) =>
              e.target === params.target &&
              e.targetHandle === params.targetHandle,
          )
        : []

      setEdges((edges) =>
        addEdge<Graph.Edge>(
          {
            target: params.target!,
            targetHandle: params.targetHandle,
            source: params.source!,
            sourceHandle: params.sourceHandle,
            type: 'default',
            data: {
              targetHandle: {
                name: targetInput!.name,
                valueType: targetInput!.valueType,
              },
            },
          },
          edges,
        ).filter((e) => !edgesToRemove.some((r) => r.id === e.id)),
      )
    },
    [getEdges, setEdges],
  )
}
