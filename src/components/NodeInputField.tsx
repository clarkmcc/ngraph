import { memo } from 'react'
import { Handle } from './Handle'
import { NodeBaseInputField } from './NodeBaseInputField'
import { Position } from '@xyflow/react'
import { useNodeFieldValue } from '../hooks/node'
import { NodeInputConfig, ValueTypeConfig } from '../config'

type NodeInputFieldProps = NodeInputConfig &
  ValueTypeConfig & {
    onFocus: () => void
    onBlur: () => void
  }

export const NodeInputField = memo(
  ({ onFocus, onBlur, isConstant, ...props }: NodeInputFieldProps) => {
    const [value, setValue] = useNodeFieldValue(
      props.identifier,
      props.defaultValue,
    )

    return (
      <NodeBaseInputField
        value={value}
        onChange={setValue}
        onPointerDown={onFocus}
        onPointerLeave={onBlur}
        {...props}
      >
        {isConstant ? null : (
          <Handle handleType="target" position={Position.Left} {...props} />
        )}
      </NodeBaseInputField>
    )
  },
)
