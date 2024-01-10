import * as React from 'react'
import { memo, useMemo } from 'react'
import { Handle } from './Handle'
import { NodeBaseInputField } from './NodeBaseInputField'
import { Position } from '@xyflow/react'
import { useNodeFieldValue } from '../hooks/node'
import { NodeInputConfig, ValueTypeConfig } from '../config'

type NodeInputFieldProps = NodeInputConfig &
  ValueTypeConfig & {
    nodeId: string
    onFocus: () => void
    onBlur: () => void
  }

export const NodeInputField = memo(
  ({ nodeId, onFocus, onBlur, isConstant, ...props }: NodeInputFieldProps) => {
    const [value, setValue] = useNodeFieldValue(
      nodeId,
      props.identifier,
      props.defaultValue,
    )

    const handle = useMemo(
      () => (
        <Handle
          handleType="target"
          nodeId={nodeId}
          position={Position.Left}
          {...props}
        />
      ),
      [props, nodeId],
    )

    return (
      <NodeBaseInputField
        value={value}
        onChange={setValue}
        onPointerDown={onFocus}
        onPointerLeave={onBlur}
        {...props}
      >
        {isConstant ? null : handle}
      </NodeBaseInputField>
    )
  },
)
