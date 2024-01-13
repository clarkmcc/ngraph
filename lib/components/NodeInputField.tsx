import { memo } from 'react'
import { NodeBaseInputField } from './NodeBaseInputField'
import { useNodeFieldValue } from '../hooks/node'
import { NodeInputConfig, ValueTypeConfig } from '../config'
import './NodeInputField.scss'
import { BaseInputProps } from './inputs.ts'

type NodeInputFieldProps = BaseInputProps & NodeInputConfig & ValueTypeConfig

export const NodeInputField = memo(
  ({ onFocus, onBlur, isConstant, slots, ...props }: NodeInputFieldProps) => {
    const Handle = slots?.Handle
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
        {isConstant || !Handle ? null : <Handle />}
      </NodeBaseInputField>
    )
  },
)
