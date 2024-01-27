import { useCallback } from 'react'
import { computeDagreLayout } from './dagre'
import { Edge, Instance, Node, useReactFlow } from '@xyflow/react'

export enum LayoutEngine {
  Dagre,
}

type LayoutFunc = () => void

export function useLayoutEngine(engine: LayoutEngine): LayoutFunc {
  const { getNodes, getEdges, setNodes } = useReactFlow()
  return useCallback(() => {
    setNodes(computeLayout(engine, getNodes, getEdges))
  }, [engine])
}

function computeLayout(
  engine: LayoutEngine,
  getNodes: Instance.GetNodes<any>,
  getEdges: Instance.GetEdges<any>,
): Node[] {
  const layoutFn = getLayoutFunction(engine)
  if (!layoutFn) throw new Error(`Unknown layout engine ${engine}`)
  return layoutFn(getNodes(), getEdges())
}

export function getLayoutFunction(
  engine: LayoutEngine | undefined,
): ((nodes: Node[], edges: Edge[]) => Node[]) | undefined {
  switch (engine) {
    case LayoutEngine.Dagre:
      return computeDagreLayout
  }
}
