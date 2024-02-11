import { GraphConfig } from '../config.ts'
import type { Edge, EdgeChange, Node, NodeChange } from '@xyflow/react'
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

  addNode: (node: Node | Graph.Node) => void
  removeNode: (node: string | Node | Graph.Node) => void
  updateNode: (node: Partial<Node | Graph.Node> & {id: string}) => void
  updateNodeData: (nodeId: string, data: Record<string, any>) => void
  getNode: (nodeId: string) => Graph.Node | undefined

  addEdge: (edge: Edge | Graph.Edge) => void
  removeEdge: (edge: string | Edge | Graph.Edge) => void
  updateEdge: (edge: Partial<Edge | Graph.Edge> & {id:string}) => void
  // updateEdgeData: (data: Record<string, any>) => void
  getEdge: (edgeId: string) => Graph.Edge | undefined

  serialize: SerializeFunc
  deserialize: DeserializeFunc
}
