import { CSSProperties, ReactNode, useRef, useState } from 'react'
import { NodeInputConfig } from '../config'

type NodeBaseInputFieldProps = Pick<NodeInputConfig, 'name'> &
  React.InputHTMLAttributes<any> & {
    setValue: (value: any) => void
    inputStyle?: CSSProperties
    onChange?: (value: any) => void
    children?: ReactNode
  }

export const NodeBaseInputField = ({
  name,
  value,
  setValue,
  style,
  inputStyle,
  onChange,
  onPointerDown,
  onPointerLeave,
  children,
  ...props
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
        {...props}
        ref={ref}
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
        value={value}
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
