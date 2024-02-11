import { InputHTMLTypes, NodeBaseInputField } from './NodeBaseInputField'
import { useNodeFieldValue } from '../hooks/node'
import { NodeInputConfig, ValueTypeConfig } from '../config'
import { BaseInputProps } from './inputs.ts'
import './NodeInputField.css'

type NodeInputFieldProps = BaseInputProps & Omit<NodeInputConfig, 'valueType'> & ValueTypeConfig & {
  type: InputHTMLTypes
  placeholder?: string
  inputMode?: "email" | "tel" | "text" | "url" | "search" | "none" | "decimal" | "numeric" | undefined
  pattern?: string
  maxlength?: number
  minlength?: number
  max?: number | string
  min?: number | string
  step?: number
}

export const NodeInputField = ({ onFocus, onBlur, type, isConstant, slots, ...props }: NodeInputFieldProps) => {
  const Handle = slots?.Handle
  const [value, setValue] = useNodeFieldValue(props.id, props.defaultValue)

  return (
    <NodeBaseInputField
      value={value}
      type={type}
      onChange={setValue}
      onPointerDown={onFocus}
      onPointerLeave={onBlur}
      {...props}
    >
      {isConstant || !Handle ? null : <Handle />}
    </NodeBaseInputField>
  )
}

type NodeInputTypedFieldProps = BaseInputProps & Omit<NodeInputConfig, 'valueType'> & ValueTypeConfig & {
  placeholder?: string
}

export const NodeInputTextField = (props: NodeInputTypedFieldProps & {maxlength?: number; minlength?: number}) => {
  return <NodeInputField type="text" {...props} />
}

export const NodeInputDecimalField = (props: NodeInputTypedFieldProps & {maxlength?: number; minlength?: number}) => {
  return <NodeInputField type="number" inputMode="decimal" pattern="\d+\\.\d\d\d" step={0.001} {...props} />
}

export const NodeInputNumberField = (props: NodeInputTypedFieldProps & {max?: number; min?: number}) => {
  return <NodeInputField type="number" {...props} />
}

export const NodeInputPasswordField = (props: NodeInputTypedFieldProps & {maxlength?: number; minlength?: number}) => {
  return <NodeInputField type="password" {...props} />
}

export const NodeInputEmailField = (props: NodeInputTypedFieldProps & {pattern?: string}) => {
  return <NodeInputField type="email" {...props} />
}

export const NodeInputColorField = (props: NodeInputTypedFieldProps) => {
  return <NodeInputField type="color" {...props} />
}

export const NodeInputDateField = (props: NodeInputTypedFieldProps & {max?: string; min?:string}) => {
  return <NodeInputField type="date" {...props} />
}

export const NodeInputDateTimeLocalField = (props: NodeInputTypedFieldProps & {max?: string; min?:string}) => {
  return <NodeInputField type="datetime-local" {...props} />
}

export const NodeInputMonthField = (props: NodeInputTypedFieldProps & {max?: string; min?:string}) => {
  return <NodeInputField type="month" {...props} />
}

export const NodeInputRangeField = (props: NodeInputTypedFieldProps & {max?: number; min?: number; step?: number}) => {
  return <NodeInputField type="range" {...props} />
}

export const NodeInputTelField = (props: NodeInputTypedFieldProps & {pattern?: string}) => {
  return <NodeInputField type="tel" {...props} />
}

export const NodeInputTimeField = (props: NodeInputTypedFieldProps & {max?: string; min?:string}) => {
  return <NodeInputField type="time" {...props} />
}

export const NodeInputUrlField = (props: NodeInputTypedFieldProps & {pattern?: string}) => {
  return <NodeInputField type="url" {...props} />
}

export const NodeInputWeekField = (props: NodeInputTypedFieldProps & {max?: string; min?:string}) => {
  return <NodeInputField type="week" {...props} />
}
