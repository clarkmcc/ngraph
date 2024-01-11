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
} from '@xyflow/react'
import { GraphConfigProvider } from './context/GraphConfigContext'
import '@xyflow/react/dist/style.css'
import { useNodeTypes } from './hooks/config'
import { useMemo } from 'react'
import { defaultEdgeTypes } from './edge-types'
import { IGraphConfig } from './config'

type NodeType = Node
type EdgeType = Edge

type NodeGraphEditorProps = Omit<ReactFlowProps, 'edges' | 'nodes'> & {
  onSave?: (data: any) => void
}

export function NodeGraphEditor({
  defaultNodes,
  defaultEdges,
  ...props
}: NodeGraphEditorProps) {
  const [nodes, , onNodesChange] = useNodesState<NodeType>(defaultNodes ?? [])
  const [edges, , onEdgesChange] = useEdgesState<EdgeType>(defaultEdges ?? [])
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
  nodes: NodeType[]
  edges: EdgeType[]
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

  return (
    <ReactFlow
      {...props}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      colorMode="dark"
    >
      {props.children}
      <Background color="#52525b" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  )
}
