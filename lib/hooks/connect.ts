import { useGraphConfig } from '../context/GraphConfigContext'
import { addEdge, Connection, useNodes, useReactFlow } from 'reactflow'
import { useCallback } from 'react'

export function useSocketConnect() {
  const [config] = useGraphConfig()
  const { setEdges, getEdges } = useReactFlow()
  const nodes = useNodes()
  return useCallback(
    (params: Connection) => {
      if (
        nodes.length === 0 ||
        params.target === null ||
        params.source === null
      ) {
        return
      }

      const targetNode = nodes.find((node) => node.id === params.target)
      const targetNodeType = config.getNodeConfig(targetNode!.type!)
      const targetInput = targetNodeType.inputs!.find(
        (input) => input.identifier === params.targetHandle,
      )

      // We remove all edges that have the same target and targetHandle
      // if the target handle is not an array type
      const edgesToRemove =
        targetInput && !targetInput.isArray
          ? getEdges().filter(
              (e) =>
                e.target === params.target &&
                e.targetHandle === params.targetHandle,
            )
          : []

      setEdges((edges) =>
        addEdge(
          {
            target: params.target!,
            targetHandle: params.targetHandle,
            source: params.source!,
            sourceHandle: params.sourceHandle,
            type: 'default',
          },
          edges,
        ).filter((e) => !edgesToRemove.some((r) => r.id === e.id)),
      )
    },
    [nodes, getEdges, setEdges],
  )
}
