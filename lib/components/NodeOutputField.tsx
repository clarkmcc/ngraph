import { memo } from 'react'
import { Handle } from './Handle'
import { Label } from './Label'
import { NodeOutputConfig } from '../config'
import { useGraphConfig } from '../context/GraphConfigContext'
import { Position } from 'reactflow'

type NodeOutputFieldProps = NodeOutputConfig

export const NodeOutputField = memo((props: NodeOutputFieldProps) => {
  const [config] = useGraphConfig()
  const valueTypeConfig = config.valueType(props.valueType)
  return (
    <div style={{ position: 'relative', margin: '2px 0', padding: '0 12px' }}>
      <div style={{ position: 'relative', display: 'flex' }}>
        <Label style={{ textAlign: 'right' }}>{props.name}</Label>
      </div>
      <Handle
        handleType="source"
        position={Position.Right}
        {...valueTypeConfig}
        {...props}
      />
    </div>
  )
})
