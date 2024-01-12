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
  useReactFlow,
  useStoreApi,
} from 'reactflow'
import {
  GraphConfigProvider,
  useGraphConfig,
} from './context/GraphConfigContext'
import 'reactflow/dist/style.css'
import { useNodeTypes } from './hooks/config'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { defaultEdgeTypes } from './edge-types'
import { GraphConfig, IGraphConfig } from './config'
import { useSocketConnect } from './hooks/connect'
import { useHotkeys } from 'react-hotkeys-hook'
import { ClipboardItem } from './clipboard'
import { LayoutEngine, useLayoutEngine } from './layout/layout'

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
  config: _config,
}: ExampleNodeGraphEditorProps) {
  const config = useMemo(() => new GraphConfig(_config).validate(), [])
  return (
    <GraphConfigProvider defaultConfig={config}>
      <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges} />
    </GraphConfigProvider>
  )
}

type FlowProps = ReactFlowProps
// type FlowHandle = {
//   layout: () => void
// }

const Flow = forwardRef(
  ({ defaultNodes, defaultEdges, ...props }: FlowProps, ref) => {
    const nodeTypes = useNodeTypes()
    const edgeTypes = useMemo(() => defaultEdgeTypes, [])
    const onConnect = useSocketConnect()
    const [config] = useGraphConfig()
    const { getState } = useStoreApi()
    const { setNodes, setEdges } = useReactFlow()

    // Handle clipboard events
    useHotkeys(
      config.keybindings.copy,
      async () => await ClipboardItem.copyNodesAndEdges(getState()),
    )
    useHotkeys(
      config.keybindings.paste,
      async () => await ClipboardItem.tryReadClipboard(setNodes, setEdges),
    )

    // Provide methods to parent components
    const layout = useLayoutEngine(LayoutEngine.Dagre)
    useImperativeHandle(
      ref,
      () => ({
        layout,
      }),
      [],
    )

    return (
      <div
        style={{ backgroundColor: '#1d1d1d', width: '100%', height: '100%' }}
      >
        <ReactFlow
          {...props}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          deleteKeyCode={config.keybindings.delete}
        >
          {props.children}
          <Background color="#52525b" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    )
  },
)
