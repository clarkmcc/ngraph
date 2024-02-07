import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { GraphStore } from '../types/store.ts'
import { GraphConfig } from '../config.ts'
import { Graph } from '../types'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { devtools } from 'zustand/middleware'
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

      addNode: (node) => set({ nodes: [...get().nodes, node] }),
    })),
    shallow,
  )
}
