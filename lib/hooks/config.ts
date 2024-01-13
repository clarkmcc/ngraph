import { JSXElementConstructor, useMemo } from 'react'
import { useGraphConfig } from '../context/GraphConfigContext'
import { GraphConfig, IGraphConfig } from '../config.ts'

export function useNodeTypes(): Record<string, JSXElementConstructor<any>> {
  const [config] = useGraphConfig()
  return useMemo(() => config.getNodeComponents(), [config])
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
