import { JSXElementConstructor } from 'react'
import { NodeInputField } from './NodeInputField.tsx'
import { NodeCheckboxField } from './NodeCheckboxField.tsx'
import { NodeSelectField } from './NodeSelectField.tsx'
import { NodeToggleField } from './NodeToggleField.tsx'

export function getBuiltinInputs(): Record<string, JSXElementConstructor<any>> {
  return {
    value: NodeInputField,
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
