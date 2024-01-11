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

type NodeGraphEditorProps = ReactFlowProps & {
  onSave?: (data: any) => void
}

export function NodeGraphEditor(props: NodeGraphEditorProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
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
      <NodeGraphEditor nodes={nodes} edges={edges} />
    </GraphConfigProvider>
  )
}

function Flow({ onSave, ...props }: NodeGraphEditorProps) {
  const [nodes, , onNodesChange] = useNodesState<NodeType>([])
  const [edges, , onEdgesChange] = useEdgesState<EdgeType>([])
  const nodeTypes = useNodeTypes()
  const edgeTypes = useMemo(() => defaultEdgeTypes, [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
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
