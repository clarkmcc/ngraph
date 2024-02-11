import {
  Edge,
  Node,
  ReactFlow,
  ReactFlowProps,
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useNodeTypes } from './hooks/config'
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  JSX,
  CSSProperties,
  useEffect,
} from 'react'
import { defaultEdgeTypes } from './edge-types'
import { GraphConfig } from './config'
import { useSocketConnect } from './hooks/connect'
import { useHotkeys } from 'react-hotkeys-hook'
import { ClipboardItem } from './clipboard'
import { LayoutEngine, useLayoutEngine } from './layout/layout'
import { GraphProvider, useGraphStore } from './context/GraphContext.tsx'
import { DeserializeFunc, SerializeFunc } from './types/store.ts'
import './tailwind.css'

type NodeGraphEditorProps = Omit<FlowProps, 'edges' | 'nodes'> & {
  onSave?: (data: any) => void
  config: GraphConfig
}

export const NodeGraphEditor = forwardRef<
  NodeGraphHandle,
  NodeGraphEditorProps
>(
  (
    { defaultNodes, defaultEdges, ...props }: NodeGraphEditorProps,
    ref,
  ): JSX.Element => {
    return (
      <GraphProvider
        config={props.config}
        initialNodes={defaultNodes}
        initialEdges={defaultEdges}
      >
        <ReactFlowProvider>
          <Flow {...props} ref={ref} />
        </ReactFlowProvider>
      </GraphProvider>
    )
  },
)

type FlowProps = ReactFlowProps & {
  backgroundStyles?: CSSProperties,
  /**
   * The default layout engine to use when nodes are provided without positions.
   */
  layoutEngine?: LayoutEngine
}
export type NodeGraphHandle = {
  layout: (engine?: LayoutEngine) => void
  serialize: SerializeFunc
  deserialize: DeserializeFunc
  addNode: (node: Node) => void
  removeNode: (node: Node) => void
  updateNode: (node: Partial<Node> & {id: string}) => void
  updateNodeData: (nodeId: string, data: Record<string, any>) => void
  replaceNode: (node: Node) => void
  addEdge: (edge: Edge) => void
  removeEdge: (edge: Edge) => void
  updateEdge: (edge: Partial<Edge> & {id: string}) => void
  replaceEdge: (edge: Edge) => void
}

const Flow = forwardRef<NodeGraphHandle, FlowProps>(
  (
    { backgroundStyles, layoutEngine, ...props }: FlowProps,
    ref,
  ) => {
    const nodeTypes = useNodeTypes()
    const edgeTypes = useMemo(() => defaultEdgeTypes, [])
    const onConnect = useSocketConnect()
    const config = useGraphStore((store) => store.config)
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
    const layout = useLayoutEngine()
    const serialize = useGraphStore((store) => store.serialize)
    const deserialize = useGraphStore((store) => store.deserialize)
    const addNode = useGraphStore((store) =>store.addNode)
    const removeNode = useGraphStore((store) => store.removeNode)
    const addEdge = useGraphStore((store) => store.addEdge)
    const removeEdge = useGraphStore((store) => store.removeEdge)
    const updateNode = useGraphStore((store) => store.updateNode)
    const updateEdge = useGraphStore((store) => store.updateEdge)
    const replaceNode = useGraphStore((store) => store.replaceNode)
    const replaceEdge = useGraphStore((store) => store.replaceEdge)
    const updateNodeData = useGraphStore((store) => store.updateNodeData)

    useImperativeHandle(
      ref,
      () => ({
        layout,
        serialize,
        deserialize,
        addNode,
        removeNode,
        updateNode,
        updateNodeData,
        replaceNode,
        addEdge,
        removeEdge,
        updateEdge,
        replaceEdge,
      }),
      [serialize],
    )

    const { nodes, edges, onNodesChange, onEdgesChange } = useGraphStore(
      (store) => ({
        nodes: store.nodes,
        edges: store.edges,
        onNodesChange: store.onNodesChange,
        onEdgesChange: store.onEdgesChange,
      }),
    )

    const initialized = useNodesInitialized()
    useEffect(() => {
      const shouldLayout = !!getState().nodes.find(
        (node) => node.position == undefined,
      )
      if (initialized && shouldLayout && layoutEngine) {
        layout(layoutEngine)
      }
    }, [initialized, layoutEngine])

    return (
      <div
        className="bg-neutral-900"
        style={{
          width: '100%',
          height: '100%',
          ...backgroundStyles,
        }}
      >
        <ReactFlow
          {...props}
          colorMode={props.colorMode ?? 'dark'}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
