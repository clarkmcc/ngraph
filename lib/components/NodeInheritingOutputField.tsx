import { memo, useEffect, useMemo, useState } from 'react'
import { Handle } from './Handle'
import { Label } from './Label'
import { ANY, NodeOutputConfig } from '../config'
import { Position, useHandleConnections, useStoreApi } from '@xyflow/react'
import { getConnectionEdge } from '../utilities.ts'
import { useGraphApi } from '../context/GraphContext.tsx'

/**
 * This is similar to any other output field but the label is defined by the label
 * of the input(s) that it's connected to.
 */
export const NodeInheritingOutputField = memo((props: NodeOutputConfig) => {
  const api = useStoreApi()
  const [label, setLabel] = useState(props.name)
  const [valueType, setValueType] = useState(ANY)
  const graphApi = useGraphApi()
  const valueTypeConfig = useMemo(
    () => graphApi.getState().config.valueType(valueType),
    [valueType],
  )

  const connections = useHandleConnections({
    id: props.id,
    type: 'source',
  })

  useEffect(() => {
    const state = api.getState()
    if (connections.length > 0) {
      const label = connections
        .map((conn) => getConnectionEdge(state, conn))
        .map((edge) => {
          setValueType(edge?.data?.targetHandle?.valueType)
          return edge?.data?.targetHandle?.name
        })
        .filter((v) => v as string)
        .join(', ')
      setLabel(label)
    } else {
      setLabel(props.name)
      setValueType(ANY)
    }
  }, [connections])

  return (
    <div style={{ position: 'relative', margin: '2px 0', padding: '0 12px' }}>
      <div style={{ position: 'relative', display: 'flex' }}>
        <Label style={{ textAlign: 'right' }}>{label}</Label>
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
