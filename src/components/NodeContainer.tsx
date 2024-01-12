import { Node, Position } from 'reactflow'
import { CSSProperties, JSX, ReactElement, useMemo } from 'react'
import { NodeHeader } from './NodeHeader'
import {
  GraphConfig,
  NodeConfig,
  NodeGroupConfig,
  NodeInputConfig,
  NodeOutputConfig,
} from '../config'
import { Handle } from './Handle'
import { useGraphConfig } from '../context/GraphConfigContext'

type NodeContainerProps = {
  node: Node
  isFocused?: boolean
  styles?: CSSProperties
  children?: ReactElement | ReactElement[]
}

export function NodeContainer({
  isFocused,
  node,
  styles,
  children,
}: NodeContainerProps) {
  return (
    <div
      style={{
        borderRadius: 6,
        fontFamily: 'sans-serif',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
        background: '#303030',
        border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
        ...styles,
      }}
      className={isFocused ? 'nodrag' : undefined}
    >
      {children}
    </div>
  )
}

type NodeCollapsedContainerProps = {
  node: Node
  nodeConfig: NodeConfig
  nodeGroupConfig: NodeGroupConfig
  toggleCollapsed?: () => void
}

export function NodeCollapsedContainer({
  node,
  nodeConfig,
  nodeGroupConfig,
  toggleCollapsed,
}: NodeCollapsedContainerProps) {
  const [config] = useGraphConfig()
  const inputHandles = useMemo(
    () =>
      (nodeConfig.inputs ?? []).map((input) => getInputHandles(config, input)),
    [config],
  )
  const outputHandles = useMemo(
    () =>
      (nodeConfig.outputs ?? []).map((output) =>
        getOutputHandles(config, output),
      ),
    [config],
  )

  return (
    <div
      style={{
        borderRadius: 6,
        border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
      }}
    >
      <NodeHeader
        defaultTitle={nodeConfig.name}
        color={nodeGroupConfig.color}
        collapsed={true}
        toggleCollapsed={toggleCollapsed}
      />
      {inputHandles}
      {outputHandles}
    </div>
  )
}

function getInputHandles(
  graphConfig: GraphConfig,
  input: NodeInputConfig,
): JSX.Element {
  const inputConfig = graphConfig.getInputConfig(input)
  return (
    <Handle
      key={inputConfig.identifier}
      style={{ display: 'none' }}
      position={Position.Left}
      handleType="target"
      {...inputConfig}
    />
  )
}

function getOutputHandles(
  graphConfig: GraphConfig,
  output: NodeOutputConfig,
): JSX.Element {
  const outputConfig = graphConfig.getOutputConfig(output)
  return (
    <Handle
      key={outputConfig.identifier}
      style={{ display: 'none' }}
      position={Position.Right}
      handleType="source"
      {...outputConfig}
    />
  )
}
