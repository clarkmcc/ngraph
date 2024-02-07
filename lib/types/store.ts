import { GraphConfig } from '../config.ts'
import type { Edge, EdgeChange, Node, NodeChange } from '@xyflow/react'
import { Graph } from './'
import { GraphSlots } from './slots.ts'

export type GraphStore = GraphStoreActions & {
  config: GraphConfig
  nodes: Graph.Node[]
  edges: Graph.Edge[]
  slots: GraphSlots
}

export type SerializeFunc = () => string
export type DeserializeFunc = (serialized: string) => void

export type GraphStoreActions = {
  onNodesChange: (changes: NodeChange<Graph.Node>[]) => void
  onEdgesChange: (changes: EdgeChange<Graph.Edge>[]) => void

  addNode: (node: Node | Graph.Node) => void
  removeNode: (node: string | Node | Graph.Node) => void
  addEdge: (edge: Edge | Graph.Edge) => void
  removeEdge: (edge: string | Edge | Graph.Edge) => void

  serialize: SerializeFunc
  deserialize: DeserializeFunc
}
