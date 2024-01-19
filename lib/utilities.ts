import { Connection, Edge, ReactFlowState } from '@xyflow/react'
import { Graph } from './types'
import { GraphConfig } from './config.ts'
import { produce } from 'immer'

export function getConnectionEdge(
  state: ReactFlowState,
  conn: Connection,
): Edge | undefined {
  return state.edgeLookup.get(
    `xy-edge__${conn.source}${conn.sourceHandle}-${conn.target}${conn.targetHandle}`,
  )
}

export function addNodeInternals(
  config: GraphConfig,
  node: Graph.Node,
): Graph.Node {
  if (node.data.hasOwnProperty('internal')) {
    return node
  }

  return produce(node, (draft) => {
    draft.data.internal = {
      inputs: (config.getNodeConfig(node.type ?? '').inputs ?? []).map(
        (input) => ({
          id: input.id,
          name: input.name,
          valueType: input.valueType,
        }),
      ),
      outputs: (config.getNodeConfig(node.type ?? '').outputs ?? []).map(
        (output) => ({
          id: output.id,
          name: output.name,
          valueType: output.valueType,
        }),
      ),
    }
  })
}
