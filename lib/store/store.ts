import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { GraphStore } from '../types/store.ts'
import { GraphConfig } from '../config.ts'
import { Graph } from '../types'
import { Edge, Node, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { devtools } from 'zustand/middleware'
import { addNodeInternals } from '../utilities.ts'

type CreateGraphStoreProps = {
  config: GraphConfig
  nodes: Graph.Node[]
  edges: Graph.Edge[]
}

export function createGraphStore({
  config,
  nodes,
  edges,
}: CreateGraphStoreProps) {
  return createWithEqualityFn(
    devtools<GraphStore>((set, get) => ({
      config,
      nodes,
      edges,

      serialize: () =>
        JSON.stringify({
          nodes: get().nodes,
          edges: get().edges,
        }),
      deserialize: (serialized) => set(JSON.parse(serialized)),

      onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),

      addNode: (node: Node | Graph.Node) => set({ nodes: [...get().nodes, addNodeInternals(config, node)] }),
      removeNode: (node: string | Node | Graph.Node) => {
        const id = typeof node === 'string' ? node : node.id;
        set({ nodes: get().nodes.filter(item => item.id !== id) })
      },
      replaceNode: (node: Node | Graph.Node) => {
        set({ nodes: get().nodes.map(item => item.id === node.id ? node : item) })
      },
      updateNode: (node: Partial<Node | Graph.Node> & {id: string}) => {
        set({ nodes: get().nodes.map(item => item.id === node.id ? {...item, ...node} : item) })
      },
      updateNodeData: (nodeId: string, data: Record<string, any>) => {
        set({ nodes: get().nodes.map(item => item.id === nodeId ? { ...item, data: { ...item.data, ...data } } : item) })
      },
      getNode:(nodeId: string) => get().nodes.find(item => item.id === nodeId),

      addEdge: (edge: Edge | Graph.Edge) => set({ edges: [...get().edges, edge] }),
      removeEdge: (edge: string | Edge | Graph.Edge) => {
        const id = typeof edge === 'string' ? edge : edge.id;
        set({ edges: get().edges.filter(item => item.id !== id) })
      },
      replaceEdge: (edge: Edge | Graph.Edge) => {
        set({ edges: get().edges.map(item => item.id === edge.id ? edge : item) })
      },
      updateEdge: (edge: Partial<Edge | Graph.Edge> & {id: string}) => {
        set({ edges: get().edges.map(item => item.id === edge.id ? {...item, ...edge} : item) })
      },
      getEdge: (edgeId: string) => get().edges.find(item => item.id === edgeId),
    })),
    shallow,
  )
}
