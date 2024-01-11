import { FunctionComponent, useMemo } from 'react'
import { useGraphConfig } from '../context/GraphConfigContext'

export function useNodeTypes(): Record<string, FunctionComponent> {
  const [config] = useGraphConfig()
  return useMemo(() => config.getNodeComponents(), [config])
}
