import { Node } from 'reactflow'
import { NodeHeader } from './components/NodeHeader.tsx'
import { useGraphStore } from './store/store.ts'
import { useCallback } from 'react'

export const GROUP_NODE_TYPE = '__groupNode'
export const GROUP_INPUTS_NODE_TYPE = '__groupInputsNode'
export const GROUP_OUTPUTS_NODE_TYPE = '__groupOutputsNode'

export function BuiltinGroupNode(node: Node) {
  const { selectNodeGroup } = useGraphStore()

  const handleDoubleClick = useCallback(
    () => selectNodeGroup(node.id),
    [node.id],
  )

  return (
    <div
      style={{
        borderRadius: 6,
        fontFamily: 'sans-serif',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
        background: '#303030',
        border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <NodeHeader defaultTitle="Group" color="#1e1e1e" />
      Foobar
    </div>
  )
}

export function BuiltinGroupInputs(node: Node) {
  return (
    <div
      style={{
        borderRadius: 6,
        fontFamily: 'sans-serif',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
        background: '#303030',
        border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
      }}
    >
      <NodeHeader defaultTitle="Inputs" color="#1e1e1e" />
    </div>
  )
}

export function BuiltinGroupOutputs(node: Node) {
  return (
    <div
      style={{
        borderRadius: 6,
        fontFamily: 'sans-serif',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
        background: '#303030',
        border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
      }}
    >
      <NodeHeader defaultTitle="Outputs" color="#1e1e1e" />
    </div>
  )
}
