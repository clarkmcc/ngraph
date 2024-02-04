import { useCallback } from 'react'
import { Edge, Instance, Node, useReactFlow } from '@xyflow/react'

export type LayoutEngine = string

export type LayoutFunc = (nodes: Node[], edges: Edge[]) => Node[]

export function useLayoutEngine() {
  const { getNodes, getEdges, setNodes } = useReactFlow()
  return useCallback((engine?: LayoutEngine) => {
    if (!engine) return
    setNodes(computeLayout(engine, getNodes, getEdges))
  }, [])
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

const layoutEngines: Record<LayoutEngine, LayoutFunc> = {}

export function registerLayoutEngine(
  engine: LayoutEngine,
  layoutFn: LayoutFunc,
) {
  layoutEngines[engine] = layoutFn
}

export function getLayoutFunction(
  engine: LayoutEngine,
): ((nodes: Node[], edges: Edge[]) => Node[]) | undefined {
  const layoutFn = layoutEngines[engine]
  if (!layoutFn) throw new Error(`Unknown layout engine ${engine}`)
  return layoutFn
}
