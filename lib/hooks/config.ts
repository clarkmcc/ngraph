import { JSXElementConstructor, useMemo } from 'react'
import { useGraphConfig } from '../context/GraphConfigContext'
import { GraphConfig, IGraphConfig } from '../config.ts'
import { buildNode } from '../node-types.tsx'
import {
  BuiltinGroupInputs,
  BuiltinGroupNode,
  BuiltinGroupOutputs,
  GROUP_INPUTS_NODE_TYPE,
  GROUP_NODE_TYPE,
  GROUP_OUTPUTS_NODE_TYPE,
} from '../GroupNode.tsx'

export function useNodeTypes(): Record<string, JSXElementConstructor<any>> {
  const [config] = useGraphConfig()
  return useMemo(() => {
    const configNodeTypes = config.getNodeComponents(buildNode)
    configNodeTypes[GROUP_NODE_TYPE] = BuiltinGroupNode
    configNodeTypes[GROUP_INPUTS_NODE_TYPE] = BuiltinGroupInputs
    configNodeTypes[GROUP_OUTPUTS_NODE_TYPE] = BuiltinGroupOutputs
    return configNodeTypes
  }, [config])
}

export function useBuildGraphConfig(
  config: IGraphConfig,
  extensions?: (config: GraphConfig) => void,
) {
  return useMemo(() => {
    const graphConfig = new GraphConfig(config)
    if (extensions) extensions(graphConfig)
    return graphConfig.validate()
  }, [])
}
