import { memo } from 'react'
import { Handle } from './Handle.js'
import { Position } from 'reactflow'
import { NodeInputConfig, ValueTypeConfig } from '../config'

type NodeDenseLinkedFieldProps = NodeInputConfig &
  Pick<ValueTypeConfig, 'shape' | 'color'>

export const NodeDenseLinkedField = memo((props: NodeDenseLinkedFieldProps) => {
  return (
    <div style={{ position: 'relative', margin: '0px 0', padding: '0 12px' }}>
      <Handle handleType="target" position={Position.Left} {...props} />
      {/*<div style={{ position: "relative", display: "flex" }}>fo</div>*/}
    </div>
  )
})
