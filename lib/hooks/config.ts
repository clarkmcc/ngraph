import { JSXElementConstructor, useMemo } from 'react'
import { GraphConfig, IGraphConfig } from '../config.ts'
import { buildNode } from '../node-types.tsx'
import { useGraphStore } from '../context/GraphContext.tsx'

export function useNodeTypes(): Record<string, JSXElementConstructor<any>> {
  const config = useGraphStore((store) => store.config)
  return useMemo(() => {
    return config.getNodeComponents(buildNode)
  }, [config])
}

export function useBuildGraphConfig(
  config: IGraphConfig,
  extensions?: (config: GraphConfig) => void,
) {
  return useMemo(() => {
    const graphConfig = new GraphConfig(config)
    if (extensions) extensions(graphConfig)
    return graphConfig
  }, [])
}
