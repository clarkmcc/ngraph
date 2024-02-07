import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { GraphStore } from '../types/store.ts'
import { GraphConfig } from '../config.ts'
import { Graph } from '../types'
import { Edge, Node, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { devtools } from 'zustand/middleware'
import { addNodeInternals } from '../utilities.ts'
import { getDefaultSlots, GraphSlots } from '../types/slots.ts'

type CreateGraphStoreProps = {
  config: GraphConfig
  nodes: Graph.Node[]
  edges: Graph.Edge[]
  slots?: Partial<GraphSlots>
}

export function createGraphStore({
  config,
  nodes,
  edges,
  slots,
}: CreateGraphStoreProps) {
  return createWithEqualityFn(
    devtools<GraphStore>((set, get) => ({
      config,
      nodes,
      edges,
      slots: getDefaultSlots(slots),

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
        set({ nodes: nodes.filter(item => item.id !== id) })
      },
      addEdge: (edge: Edge | Graph.Edge) => set({ edges: [...get().edges, edge] }),
      removeEdge: (edge: string | Edge | Graph.Edge) => {
        const id = typeof edge === 'string' ? edge : edge.id;
        set({ edges: edges.filter(item => item.id !== id) })
      },
      })),
    shallow,
  )
}
