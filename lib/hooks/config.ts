import { JSXElementConstructor, useMemo } from 'react'
import { useGraphConfig } from '../context/GraphConfigContext'

export function useNodeTypes(): Record<string, JSXElementConstructor<any>> {
  const [config] = useGraphConfig()
  return useMemo(() => config.getNodeComponents(), [config])
}
