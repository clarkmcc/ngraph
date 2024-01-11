import { Handle } from './Handle.js'
import { Label } from './Label.js'
import { NodeInputConfig, ValueTypeConfig } from '../config'
import { memo } from 'react'
import { Position } from 'reactflow'

type NodeLinkedFieldProps = NodeInputConfig &
  Pick<ValueTypeConfig, 'shape' | 'color'>

export const NodeLinkedField = memo((props: NodeLinkedFieldProps) => {
  return (
    <div style={{ position: 'relative', margin: '2px 0', padding: '0 12px' }}>
      <Handle handleType="target" position={Position.Left} {...props} />
      <div style={{ position: 'relative', display: 'flex' }}>
        <Label>{props.name}</Label>
      </div>
    </div>
  )
})
