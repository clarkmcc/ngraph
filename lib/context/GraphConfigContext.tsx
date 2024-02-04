import { GraphConfig, IGraphConfig } from '../config'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

const defaultConfig: IGraphConfig = {
  valueTypes: {
    string: {
      name: 'String',
      color: '#a1a1a1',
      inputType: 'value',
      defaultValue: '',
    },
  },
  nodeThemes: {
    default: {
      name: 'Default',
      color: '#a1a1a1',
    },
  },
  nodes: {
    string: {
      group: 'default',
      name: 'String',
      inputs: [
        {
          name: 'Value',
          id: 'value',
          valueType: 'string',
        },
      ],
      outputs: [
        {
          name: 'Value',
          id: 'value',
          valueType: 'string',
        },
      ],
    },
  },
}

export const GraphConfigContext = createContext<{
  config: GraphConfig
  setConfig: Dispatch<SetStateAction<GraphConfig>>
}>({ config: new GraphConfig(defaultConfig), setConfig: (c) => c })

type GraphConfigProviderProps = {
  children: ReactNode
  defaultConfig?: GraphConfig
}

export function GraphConfigProvider({
  children,
  defaultConfig: _defaultConfig,
}: GraphConfigProviderProps) {
  const [config, setConfig] = useState<GraphConfig>(
    _defaultConfig ?? new GraphConfig(defaultConfig).validate(),
  )
  return (
    <GraphConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </GraphConfigContext.Provider>
  )
}

export function useGraphConfig(): [
  GraphConfig,
  Dispatch<SetStateAction<GraphConfig>>,
] {
  const { config, setConfig } = useContext(GraphConfigContext)
  return [config, setConfig]
}
