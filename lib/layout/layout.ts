import { useCallback } from 'react'
import { computeDagreLayout } from './dagre'
import { Instance, Node, useReactFlow } from '@xyflow/react'

export enum LayoutEngine {
  Dagre,
}

type LayoutFunc = () => void

export function useLayoutEngine(engine: LayoutEngine): LayoutFunc {
  const { getNodes, getEdges, setNodes } = useReactFlow()
  return useCallback(() => {
    const nodes = computeLayout(engine, getNodes, getEdges)
    setNodes(nodes)
  }, [engine])
}

function computeLayout(
  engine: LayoutEngine,
  getNodes: Instance.GetNodes<any>,
  getEdges: Instance.GetEdges<any>,
): Node[] {
  switch (engine) {
    case LayoutEngine.Dagre:
      return computeDagreLayout(getNodes(), getEdges())
    default:
      throw new Error(`Unknown layout engine ${engine}`)
  }
}
