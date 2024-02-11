import { JSXElementConstructor } from 'react'
import { 
  NodeInputColorField, 
  NodeInputDateField, 
  NodeInputDateTimeLocalField, 
  NodeInputDecimalField, 
  NodeInputEmailField, 
  NodeInputMonthField, 
  NodeInputNumberField, 
  NodeInputPasswordField, 
  NodeInputRangeField, 
  NodeInputTelField, 
  NodeInputTextField, 
  NodeInputTimeField, 
  NodeInputUrlField, 
  NodeInputWeekField 
} from './NodeInputField.tsx'
import { NodeCheckboxField } from './NodeCheckboxField.tsx'
import { NodeSelectField } from './NodeSelectField.tsx'
import { NodeToggleField } from './NodeToggleField.tsx'

export function getBuiltinInputs(): Record<string, JSXElementConstructor<any>> {
  return {
    text: NodeInputTextField,
    number: NodeInputNumberField,
    decimal: NodeInputDecimalField,
    password: NodeInputPasswordField,
    email: NodeInputEmailField,
    color: NodeInputColorField,
    date: NodeInputDateField,
    datetimeLocal: NodeInputDateTimeLocalField,
    month: NodeInputMonthField,
    range: NodeInputRangeField,
    tel: NodeInputTelField,
    time: NodeInputTimeField,
    url: NodeInputUrlField,
    week: NodeInputWeekField,
    checkbox: NodeCheckboxField,
    options: NodeSelectField,
    buttonGroup: NodeToggleField,
  }
}

export type InputSlots = {
  Handle?: JSXElementConstructor<any>
}

export type BaseInputProps = {
  onFocus: () => void
  onBlur: () => void
  slots?: InputSlots
}
