import { GraphConfig } from '../config.ts'
import { EdgeChange, NodeChange } from '@xyflow/react'
import { Graph } from './'

export type GraphStore = GraphStoreActions & {
  config: GraphConfig
  nodes: Graph.Node[]
  edges: Graph.Edge[]
}

export type SerializeFunc = () => string
export type DeserializeFunc = (serialized: string) => void

export type GraphStoreActions = {
  onNodesChange: (changes: NodeChange<Graph.Node>[]) => void
  onEdgesChange: (changes: EdgeChange<Graph.Edge>[]) => void

  serialize: SerializeFunc
  deserialize: DeserializeFunc
}
