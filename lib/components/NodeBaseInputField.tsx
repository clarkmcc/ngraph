import { CSSProperties, ReactNode, useRef, useState } from 'react'
import { NodeInputConfig } from '../config'

export type InputHTMLTypes =
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'range'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'

type NodeBaseInputFieldProps = Pick<NodeInputConfig, 'name'> & {
  type: InputHTMLTypes
  value: any
  setValue: (value: any) => void
  style?: CSSProperties
  inputStyle?: CSSProperties
  onChange?: (value: any) => void
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerLeave?: (e: React.PointerEvent) => void
  children?: ReactNode
  inputMode?:
    | 'email'
    | 'tel'
    | 'text'
    | 'url'
    | 'search'
    | 'none'
    | 'decimal'
    | 'numeric'
    | undefined
  pattern?: string
  maxlength?: number
  minlength?: number
  max?: number | string
  min?: number | string
  step?: number
  placeholder?: string
}

export const NodeBaseInputField = ({
  name,
  type,
  value,
  setValue,
  style,
  inputStyle,
  onChange,
  onPointerDown,
  onPointerLeave,
  inputMode,
  pattern,
  maxlength,
  minlength,
  max,
  min,
  step,
  placeholder,
  children,
}: NodeBaseInputFieldProps) => {
  const [labelVisible, setLabelVisible] = useState(true)
  const ref = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleBlur() {
    setLabelVisible(true)
    if (onChange) onChange(value)
  }

  return (
    <div
      style={{
        margin: '2px 0',
        padding: '0 12px',
        position: 'relative',
        display: 'flex',
        ...style,
      }}
    >
      {children}
      <input
        ref={ref}
        type={type}
        style={{
          background: '#545555',
          border: 'none',
          borderRadius: 3,
          padding: '3px 8px',
          color: '#fff',
          textShadow: '0 1px rgba(0,0,0,0.4)',
          fontSize: '12px',
          textAlign: labelVisible ? 'right' : 'left',
          flex: 1,
          width: '100%',
          ...inputStyle,
        }}
        onChange={handleChange}
        onFocus={() => setLabelVisible(false)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            ref.current!.blur()
          }
        }}
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerLeave}
        value={value}
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxlength}
        minLength={minlength}
        max={max}
        min={min}
        step={step}
        placeholder={placeholder}
      />
      {labelVisible ? (
        <div
          style={{
            position: 'absolute',
            color: '#fff',
            fontSize: '12px',
            zIndex: 1,
            top: 3,
            left: 20,
            textShadow: '0 1px rgba(0,0,0,0.4)',
            backgroundColor: '#545555',
            paddingRight: 8,
          }}
          onClick={() => {
            ref.current!.focus()
          }}
        >
          {name}
        </div>
      ) : null}
    </div>
  )
}
