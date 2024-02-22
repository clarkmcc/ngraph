import { useCallback, useEffect, useState } from 'react'
import { NodeBaseInputField } from './NodeBaseInputField'
import { useNodeFieldValue } from '../hooks/node'
import { NodeInputConfig } from '../config'
import { BaseInputProps } from './inputs.ts'
import './NodeInputField.css'

type NodeInputFieldProps = BaseInputProps &
  Pick<NodeInputConfig, 'isConstant' | 'id' | 'defaultValue' | 'name'> &
  React.InputHTMLAttributes<any>

export const NodeInputField = ({
  onFocus,
  onBlur,
  type,
  isConstant,
  slots,
  id,
  defaultValue,
  ...props
}: NodeInputFieldProps) => {
  const Handle = slots?.Handle
  const [value, setValue] = useNodeFieldValue(id, defaultValue)

  return (
    <NodeBaseInputField
      value={value}
      setValue={setValue}
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

type NodeInputDecimalFieldProps = NodeInputFieldProps & {
  precision?: number
}
export const NodeInputDecimalField = ({
  precision = 3,
  onFocus,
  onBlur,
  type,
  isConstant,
  slots,
  ...props
}: NodeInputDecimalFieldProps) => {
  const Handle = slots?.Handle
  const [value, setValue] = useNodeFieldValue<number>(
    props.id,
    props.defaultValue,
  )
  const [displayValue, setDisplayValue] = useState<string>('')

  useEffect(() => {
    setDisplayValue(convertToDecimal(value))
  }, [value, precision])

  function convertToDecimal(val: string | number) {
    if (typeof val === 'string') {
      val = parseFloat(val)
    }
    if (isNaN(val)) return Number(0).toFixed(precision)
    return val.toFixed(precision)
  }

  const handleChange = useCallback(
    (val: any) => {
      // Allow only numeric input
      setValue(Number(convertToDecimal(val))) // Update global state
      setDisplayValue(convertToDecimal(val)) // Update local state
    },
    [value],
  )

  return (
    <NodeBaseInputField
      type="text"
      value={displayValue}
      setValue={setDisplayValue}
      inputMode="decimal"
      onChange={handleChange}
      pattern="\d+\\.\d\d\d"
      step={0.001}
      {...props}
    >
      {isConstant || !Handle ? null : <Handle />}
    </NodeBaseInputField>
  )
}

type NodeInputTypedFieldProps = Omit<NodeInputFieldProps, 'type'>

export const NodeInputTextField = (
  props: NodeInputTypedFieldProps & { maxLength?: number; minLength?: number },
) => {
  return <NodeInputField type="text" {...props} />
}

export const NodeInputNumberField = (
  props: NodeInputTypedFieldProps & { max?: number; min?: number },
) => {
  return <NodeInputField type="number" {...props} />
}

export const NodeInputPasswordField = (
  props: NodeInputTypedFieldProps & { maxLength?: number; minLength?: number },
) => {
  return <NodeInputField type="password" {...props} />
}

export const NodeInputEmailField = (
  props: NodeInputTypedFieldProps & { pattern?: string },
) => {
  return <NodeInputField type="email" {...props} />
}

export const NodeInputColorField = (props: NodeInputTypedFieldProps) => {
  return <NodeInputField type="color" {...props} />
}

export const NodeInputDateField = (
  props: NodeInputTypedFieldProps & { max?: string; min?: string },
) => {
  return <NodeInputField type="date" {...props} />
}

export const NodeInputDateTimeLocalField = (
  props: NodeInputTypedFieldProps & { max?: string; min?: string },
) => {
  return <NodeInputField type="datetime-local" {...props} />
}

export const NodeInputMonthField = (
  props: NodeInputTypedFieldProps & { max?: string; min?: string },
) => {
  return <NodeInputField type="month" {...props} />
}

export const NodeInputRangeField = (
  props: NodeInputTypedFieldProps & {
    max?: number
    min?: number
    step?: number
  },
) => {
  return <NodeInputField type="range" {...props} />
}

export const NodeInputTelField = (
  props: NodeInputTypedFieldProps & { pattern?: string },
) => {
  return <NodeInputField type="tel" {...props} />
}

export const NodeInputTimeField = (
  props: NodeInputTypedFieldProps & { max?: string; min?: string },
) => {
  return <NodeInputField type="time" {...props} />
}

export const NodeInputUrlField = (
  props: NodeInputTypedFieldProps & { pattern?: string },
) => {
  return <NodeInputField type="url" {...props} />
}

export const NodeInputWeekField = (
  props: NodeInputTypedFieldProps & { max?: string; min?: string },
) => {
  return <NodeInputField type="week" {...props} />
}
