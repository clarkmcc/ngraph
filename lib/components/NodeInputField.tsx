import { memo } from 'react'
import { InputHTMLTypes, NodeBaseInputField } from './NodeBaseInputField'
import { useNodeFieldValue } from '../hooks/node'
import { NodeInputConfig, ValueTypeConfig } from '../config'
import { BaseInputProps } from './inputs.ts'
import './NodeInputField.css'

type NodeInputFieldProps = BaseInputProps & Omit<NodeInputConfig, 'valueType'> & ValueTypeConfig & {
  valueType: InputHTMLTypes
}

export const NodeInputField = memo(
  ({ onFocus, onBlur, isConstant, slots, ...props }: NodeInputFieldProps) => {
    const Handle = slots?.Handle
    const [value, setValue] = useNodeFieldValue(props.id, props.defaultValue)

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
