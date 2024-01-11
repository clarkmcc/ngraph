import { memo, useRef, useState } from 'react'
import { NodeInputConfig } from '../config'

type NodeBaseInputFieldProps = Pick<NodeInputConfig, 'valueType' | 'name'> & {
  value: any
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  onChange?: (value: any) => void
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerLeave?: (e: React.PointerEvent) => void
  children?: React.ReactNode
}

export const NodeBaseInputField = memo(
  ({
    name,
    valueType,
    value,
    style,
    inputStyle,
    onChange,
    onPointerDown,
    onPointerLeave,
    children,
  }: NodeBaseInputFieldProps) => {
    const [_value, setValue] = useState(value)
    const [labelVisible, setLabelVisible] = useState(true)
    const ref = useRef<HTMLInputElement>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value.trim())
    }

    function handleBlur() {
      setLabelVisible(true)
      if (onChange) onChange(_value)
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
          type={valueType as string}
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
          value={_value}
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
  },
)
