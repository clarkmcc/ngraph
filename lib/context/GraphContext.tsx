import { createContext, ReactNode, useContext, useRef } from 'react'
import { createGraphStore } from '../store/store.ts'
import { Graph } from '../types'
import { GraphConfig } from '../config.ts'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { GraphStore } from '../types/store.ts'
import { addNodeInternals } from '../utilities.ts'
import { GraphSlots } from '../types/slots.ts'

type ContextType = ReturnType<typeof createGraphStore> | null

export const GraphContext = createContext<ContextType>(null)

type ExtractState = GraphStore

export function useGraphStore<StateSlice = ExtractState>(
  selector: (state: GraphStore) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const store = useContext(GraphContext)
  if (!store) {
    throw new Error('useGraphStore must be used within a GraphContext')
  }
  return useStoreWithEqualityFn(store, selector, equalityFn)
}

export function useGraphApi(): NonNullable<ContextType> {
  const store = useContext(GraphContext)
  if (!store) {
    throw new Error('useGraphApi must be used within a GraphContext')
  }
  return store
}

type GraphProviderProps = {
  children: ReactNode
  config: GraphConfig
  initialNodes?: Graph.Node[]
  initialEdges?: Graph.Edge[]
  slots?: Partial<GraphSlots>
}

export function GraphProvider({
  children,
  config,
  initialNodes,
  initialEdges,
  slots,
}: GraphProviderProps) {
  const storeRef = useRef<ContextType | null>(null)
  if (!storeRef.current) {
    const nodes = initialNodes
      ? initialNodes.map((n) => addNodeInternals(config, n))
      : []

    storeRef.current = createGraphStore({
      config,
      slots,
      nodes,
      edges: initialEdges ?? [],
    })
  }
  return (
    <GraphContext.Provider value={storeRef.current}>
      {children}
    </GraphContext.Provider>
  )
}
