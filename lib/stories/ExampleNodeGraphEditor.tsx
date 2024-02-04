import { Background, BackgroundVariant, Edge, Node } from '@xyflow/react'
import { forwardRef } from 'react'
import { NodeGraphEditor, NodeGraphHandle } from '../NodeGraphEditor'
import { useBuildGraphConfig } from '../hooks/config'
import { IGraphConfig } from '../config'

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
    <NodeGraphEditor
      config={config}
      ref={ref}
      defaultNodes={nodes}
      defaultEdges={edges}
    >
      <Background color="#52525b" variant={BackgroundVariant.Dots} />
    </NodeGraphEditor>
  )
})
