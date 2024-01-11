import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { GraphConfigProvider } from './context/GraphConfigContext'
import 'reactflow/dist/style.css'
import { useNodeTypes } from './hooks/config'
import { useMemo } from 'react'
import { defaultEdgeTypes } from './edge-types'
import { IGraphConfig } from './config'
import { useSocketConnect } from './hooks/connect'

type NodeGraphEditorProps = Omit<ReactFlowProps, 'edges' | 'nodes'> & {
  onSave?: (data: any) => void
}

export function NodeGraphEditor({
  defaultNodes,
  defaultEdges,
  ...props
}: NodeGraphEditorProps) {
  const [nodes, , onNodesChange] = useNodesState(defaultNodes ?? [])
  const [edges, , onEdgesChange] = useEdgesState(defaultEdges ?? [])
  return (
    <ReactFlowProvider>
      <Flow
        {...props}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </ReactFlowProvider>
  )
}

type ExampleNodeGraphEditorProps = {
  nodes: Node[]
  edges: Edge[]
  config: IGraphConfig
}

export function ExampleNodeGraphEditor({
  nodes,
  edges,
  config,
}: ExampleNodeGraphEditorProps) {
  return (
    <GraphConfigProvider defaultConfig={config}>
      <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges} />
    </GraphConfigProvider>
  )
}

type FlowProps = ReactFlowProps

function Flow({ defaultNodes, defaultEdges, ...props }: FlowProps) {
  const nodeTypes = useNodeTypes()
  const edgeTypes = useMemo(() => defaultEdgeTypes, [])
  const onConnect = useSocketConnect()

  return (
    <div style={{ backgroundColor: '#1d1d1d', width: '100%', height: '100%' }}>
      <ReactFlow
        {...props}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode="dark"
      >
        {props.children}
        <Background color="#52525b" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  )
}
