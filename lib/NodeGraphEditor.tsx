import {
  applyEdgeChanges,
  Background,
  BackgroundVariant,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from 'reactflow'
import {
  GraphConfigProvider,
  useGraphConfig,
} from './context/GraphConfigContext'
import 'reactflow/dist/style.css'
import { useBuildGraphConfig, useNodeTypes } from './hooks/config'
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  JSX,
  CSSProperties,
  useEffect,
} from 'react'
import { defaultEdgeTypes } from './edge-types'
import { IGraphConfig } from './config'
import { useSocketConnect } from './hooks/connect'
import { useHotkeys } from 'react-hotkeys-hook'
import { ClipboardItem } from './clipboard'
import { LayoutEngine, useLayoutEngine } from './layout/layout'
import { useGraphStore } from './store/store.ts'

type NodeGraphEditorProps = Omit<FlowProps, 'edges' | 'nodes'> & {
  onSave?: (data: any) => void
}

export const NodeGraphEditor = forwardRef<
  NodeGraphHandle,
  NodeGraphEditorProps
>(
  (
    { defaultNodes, defaultEdges, ...props }: NodeGraphEditorProps,
    ref,
  ): JSX.Element => {
    const [config] = useGraphConfig()
    const {
      setNodes,
      setEdges,
      applyNodeChanges,
      createNodeGroup,
      selectNodeGroup,
    } = useGraphStore()
    const nodes = useGraphStore((state) => state.nodes)
    const edges = useGraphStore((state) => state.edges)
    // const [nodes, , onNodesChange] = useNodesState(defaultNodes ?? [])
    // const [edges, , onEdgesChange] = useEdgesState(defaultEdges ?? [])

    useEffect(() => {
      // console.log(nodes)
    }, [nodes])

    useEffect(() => {
      setNodes(() => defaultNodes ?? [])
      setEdges(() => defaultEdges ?? [])
    }, [])

    const onNodesChange = (changes: NodeChange[]) => {
      // console.log(changes)
      applyNodeChanges(changes)
    }
    const onEdgesChange = (changes: EdgeChange[]) => {
      setEdges((edges) => applyEdgeChanges(changes, edges))
    }

    useHotkeys(
      config.keybindings.group,
      () => {
        createNodeGroup(
          useGraphStore
            .getState()
            .nodes.filter((n) => n.selected)
            .map((n) => n.id),
        )
      },
      {},
      [createNodeGroup],
    )

    useHotkeys('esc', () => selectNodeGroup(null))

    return (
      <ReactFlowProvider>
        <Flow
          {...props}
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </ReactFlowProvider>
    )
  },
)

type ExampleNodeGraphEditorProps = {
  nodes: Node[]
  edges: Edge[]
  config: IGraphConfig
}

export const ExampleNodeGraphEditor = forwardRef<
  NodeGraphHandle,
  ExampleNodeGraphEditorProps
>(({ nodes, edges, config: _config }: ExampleNodeGraphEditorProps, ref) => {
  const config = useBuildGraphConfig(_config)
  return (
    <GraphConfigProvider defaultConfig={config}>
      <ReactFlowProvider>
        <NodeGraphEditor ref={ref} defaultNodes={nodes} defaultEdges={edges}>
          <Background color="#52525b" variant={BackgroundVariant.Dots} />
        </NodeGraphEditor>
      </ReactFlowProvider>
    </GraphConfigProvider>
  )
})

type FlowProps = ReactFlowProps & {
  backgroundStyles?: CSSProperties
}
export type NodeGraphHandle = {
  layout: () => void
}

const Flow = forwardRef<NodeGraphHandle, FlowProps>(
  (
    { defaultNodes, defaultEdges, backgroundStyles, ...props }: FlowProps,
    ref,
  ) => {
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
        style={{
          backgroundColor: '#1d1d1d',
          width: '100%',
          height: '100%',
          ...backgroundStyles,
        }}
      >
        <ReactFlow
          {...props}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          deleteKeyCode={config.keybindings.delete}
        >
          {props.children}
        </ReactFlow>
      </div>
    )
  },
)
