import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react'
import {
  GraphConfigProvider,
  useGraphConfig,
} from './context/GraphConfigContext'
import '@xyflow/react/dist/style.css'
import { useBuildGraphConfig, useNodeTypes } from './hooks/config'
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  JSX,
  CSSProperties,
  useState,
  useEffect,
} from 'react'
import { defaultEdgeTypes } from './edge-types'
import { IGraphConfig } from './config'
import { useSocketConnect } from './hooks/connect'
import { useHotkeys } from 'react-hotkeys-hook'
import { ClipboardItem } from './clipboard'
import { LayoutEngine, getLayoutFunction, useLayoutEngine } from './layout/layout'

const options = {
  includeHiddenNodes: false,
};
 
export default function useDefaultLayout(layoutFn:((nodes: Node[], edges:Edge[]) => Node[])| undefined) {
  const { getNodes, getEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized(options);
  const [layoutedNodes, setLayoutedNodes] = useState(getNodes());
  
  useEffect(() => {
    if (nodesInitialized && typeof layoutFn == "function") {
      const found = !!getNodes().find((node) => node.position == undefined);
      if (found) {
        setLayoutedNodes(layoutFn(getNodes(), getEdges()));
      } else {
        setLayoutedNodes(getNodes());
      }
    }
  }, [nodesInitialized]);
 
  return layoutedNodes;
}

type NodeGraphEditorProps = Omit<FlowProps, 'edges' | 'nodes'> & {
  onSave?: (data: any) => void,
  defaultLayout?: LayoutEngine,
}

export const NodeGraphEditor = forwardRef<
  NodeGraphHandle,
  NodeGraphEditorProps
>(
  (
    { defaultNodes, defaultEdges, defaultLayout, ...props }: NodeGraphEditorProps,
    ref,
  ): JSX.Element => {
    const [nodes, , onNodesChange] = useNodesState(defaultNodes ?? [])
    const [edges, , onEdgesChange] = useEdgesState(defaultEdges ?? [])
    return (
      <ReactFlowProvider>
        <Flow
          {...props}
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          defaultLayout={defaultLayout}
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
      <NodeGraphEditor ref={ref} defaultNodes={nodes} defaultEdges={edges}>
        <Background color="#52525b" variant={BackgroundVariant.Dots} />
      </NodeGraphEditor>
    </GraphConfigProvider>
  )
})

type FlowProps = ReactFlowProps & {
  backgroundStyles?: CSSProperties,
  defaultLayout?: LayoutEngine
}
export type NodeGraphHandle = {
  layout: () => void
}

const Flow = forwardRef<NodeGraphHandle, FlowProps>(
  (
    { backgroundStyles, defaultLayout, ...props }: FlowProps,
    ref,
  ) => {
    const nodeTypes = useNodeTypes()
    const edgeTypes = useMemo(() => defaultEdgeTypes, [])
    const onConnect = useSocketConnect()
    const [config] = useGraphConfig()
    const { getState } = useStoreApi()
    const { setNodes, setEdges } = useReactFlow()
    const layoutedNodes = useDefaultLayout(getLayoutFunction(defaultLayout))
    useEffect(() => {
      if (layoutedNodes && defaultLayout !== undefined) {
        setNodes(layoutedNodes)
      }
    }, [layoutedNodes])

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
