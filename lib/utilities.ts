import { Connection, Edge, ReactFlowState } from '@xyflow/react'
import { Graph } from './types'
import { GraphConfig } from './config.ts'
import { produce } from 'immer'
import { nanoid } from 'nanoid'

export function getConnectionEdge(
  state: ReactFlowState,
  conn: Connection,
): Edge | undefined {
  return state.edgeLookup.get(
    `xy-edge__${conn.source}${conn.sourceHandle}-${conn.target}${conn.targetHandle}`,
  )
}

export function createNode(
  config: GraphConfig,
  node: Pick<Graph.Node, 'selected' | 'type' | 'position'>,
): Graph.Node {
  return addNodeInternals(config, {
    id: nanoid(6),
    data: {},
    ...node,
  } as Graph.Node)
}

export function addNodeInternals(
  config: GraphConfig,
  node: Graph.Node,
): Graph.Node {
  if (node.data.hasOwnProperty('internal')) {
    return node
  }

  return produce(node, (draft) => {
    const nodeConfig = config.getNodeConfig(node.type ?? '')
    const inputs = nodeConfig
      ? (nodeConfig.inputs ?? []).map((input) => ({
          id: input.id,
          name: input.name,
          valueType: input.valueType,
        }))
      : []

    const outputs = nodeConfig
      ? (nodeConfig.outputs ?? []).map((output) => ({
          id: output.id,
          name: output.name,
          valueType: output.valueType,
        }))
      : []

    draft.data.internal = {
      inputs,
      outputs,
    }
  })
}
