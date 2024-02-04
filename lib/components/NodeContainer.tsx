import { Node, Position } from '@xyflow/react'
import { CSSProperties, JSX, ReactElement, useMemo } from 'react'
import { NodeHeader } from './NodeHeader'
import {
  GraphConfig,
  NodeConfig,
  NodeThemeConfig,
  NodeInputConfig,
  NodeOutputConfig,
} from '../config'
import { Handle } from './Handle'
import { useGraphConfig } from '../context/GraphConfigContext'
import { useNodeCollapsed } from '../hooks/node'

type NodeContainerProps = {
  node: Node
  draggable?: boolean
  styles?: CSSProperties
  children?: ReactElement | ReactElement[]
}

export function NodeContainer({
  draggable,
  node,
  styles,
  children,
}: NodeContainerProps) {
  const [config] = useGraphConfig()
  const nodeConfig = config.getNodeConfig(node.type!)
  const nodeThemeConfig = config.getNodeThemeConfig(nodeConfig.theme)
  const [collapsed, toggleCollapsed] = useNodeCollapsed()

  if (collapsed) {
    return (
      <CollapsedNodeContainer
        node={node}
        nodeConfig={nodeConfig}
        nodeThemeConfig={nodeThemeConfig}
        toggleCollapsed={toggleCollapsed}
      />
    )
  } else {
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
        className={draggable ? undefined : 'nodrag'}
      >
        <NodeHeader
          defaultTitle={nodeConfig.name}
          color={nodeThemeConfig.color}
          collapsed={false}
          toggleCollapsed={toggleCollapsed}
        />
        {children}
      </div>
    )
  }
}

type CollapsedNodeContainerProps = {
  node: Node
  nodeConfig: NodeConfig
  nodeThemeConfig: NodeThemeConfig
  toggleCollapsed?: () => void
}

function CollapsedNodeContainer({
  node,
  nodeConfig,
  nodeThemeConfig,
  toggleCollapsed,
}: CollapsedNodeContainerProps) {
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
        color={nodeThemeConfig.color}
        collapsed={true}
        toggleCollapsed={toggleCollapsed}
      />
      {inputHandles}
      {outputHandles}
    </div>
  )
}

/**
 * Returns an invisible input <Handle/> element for the given input config. This
 * is used when the node is collapsed
 * @param graphConfig
 * @param input
 */
function getInputHandles(
  graphConfig: GraphConfig,
  input: NodeInputConfig,
): JSX.Element {
  const inputConfig = graphConfig.getInputConfig(input)
  return (
    <Handle
      key={inputConfig.id}
      style={{ display: 'none' }}
      position={Position.Left}
      handleType="target"
      {...inputConfig}
    />
  )
}

/**
 * Returns an invisible output <Handle/> element for the given output config. This
 * is used when the node is collapsed
 * @param graphConfig
 * @param output
 */
function getOutputHandles(
  graphConfig: GraphConfig,
  output: NodeOutputConfig,
): JSX.Element {
  const outputConfig = graphConfig.getOutputConfig(output)
  return (
    <Handle
      key={outputConfig.id}
      style={{ display: 'none' }}
      position={Position.Right}
      handleType="source"
      {...outputConfig}
    />
  )
}
