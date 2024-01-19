import { memo } from 'react'
import { Handle } from './Handle'
import { NodeOutputConfig, ValueTypeConfig } from '../config'
import { Position } from '@xyflow/react'

type NodeDenseOutputFieldProps = NodeOutputConfig &
  Pick<ValueTypeConfig, 'color'>

export const NodeDenseOutputField = memo((props: NodeDenseOutputFieldProps) => {
  return (
    <div style={{ position: 'relative', margin: '0px 0', padding: '0 12px' }}>
      <div style={{ position: 'relative', display: 'flex' }}>
        {/*<Label style={{ textAlign: "right" }}>{props.name}</Label>*/}
      </div>
      <Handle handleType="source" position={Position.Right} {...props} />
    </div>
  )
})
