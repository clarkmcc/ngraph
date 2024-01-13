import { useCallback } from 'react'
import { computeDagreLayout } from './dagre'
import { Edge, Instance, Node, useReactFlow } from 'reactflow'

export enum LayoutEngine {
  Dagre,
}

type LayoutFunc = () => void

export function useLayoutEngine(engine: LayoutEngine): LayoutFunc {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow()
  return useCallback(() => {
    const { nodes, edges } = computeLayout(engine, getNodes, getEdges)
    setNodes(nodes)
    setEdges(edges)
  }, [engine])
}

function computeLayout(
  engine: LayoutEngine,
  getNodes: Instance.GetNodes<any>,
  getEdges: Instance.GetEdges<any>,
): { nodes: Node[]; edges: Edge[] } {
  switch (engine) {
    case LayoutEngine.Dagre:
      return computeDagreLayout(getNodes(), getEdges())
    default:
      throw new Error(`Unknown layout engine ${engine}`)
  }
}
