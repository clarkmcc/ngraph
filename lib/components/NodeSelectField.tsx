import { memo, useRef } from 'react'
import { NodeInputConfig, ValueTypeConfigOptions } from '../config'
import { useNodeFieldValue } from '../hooks/node'
import { BaseInputProps } from './inputs.ts'

type NodeSelectFieldProps = BaseInputProps &
  NodeInputConfig &
  ValueTypeConfigOptions

export const NodeSelectField = memo(
  ({ options, isConstant, slots, ...props }: NodeSelectFieldProps) => {
    const Handle = slots?.Handle
    const [value, setValue] = useNodeFieldValue(props.id, props.defaultValue)

    const ref = useRef<HTMLSelectElement>(null)

    return (
      <div
        style={{
          margin: '2px 0',
          padding: '0 12px',
          position: 'relative',
          display: 'flex',
        }}
      >
        {isConstant || !Handle ? null : <Handle />}
        <select
          style={{
            background: '#282828',
            border: '1px solid #3d3d3d',
            borderRadius: 3,
            padding: '4px 8px',
            color: '#fff',
            textShadow: '0 1px rgba(0,0,0,0.4)',
            fontSize: '12px',
            flex: 1,
            width: '100%',
            textAlign: 'right',
            minWidth: '150px',
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            color: '#fff',
            fontSize: '12px',
            zIndex: 1,
            top: 6,
            left: 24,
            textShadow: '0 1px rgba(0,0,0,0.4)',
            opacity: 0.5,
          }}
          onClick={() => {
            ref.current!.focus()
          }}
        >
          {props.name}
        </div>
      </div>
    )
  },
)
