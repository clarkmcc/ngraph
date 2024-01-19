import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { GraphStore } from '../types/store.ts'
import { GraphConfig } from '../config.ts'
import { Graph } from '../types'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { devtools } from 'zustand/middleware'

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

      serialize: () => JSON.stringify(get()),
      deserialize: (serialized) => set(JSON.parse(serialized)),

      onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),
    })),
    shallow,
  )
}
