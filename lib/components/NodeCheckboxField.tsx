import { memo, useCallback } from 'react'
import { NodeInputConfig, ValueTypeConfig } from '../config'
import { useNodeFieldValue } from '../hooks/node'
import { BaseInputProps } from './inputs.ts'

type NodeCheckboxFieldProps = BaseInputProps & NodeInputConfig & ValueTypeConfig

export const NodeCheckboxField = memo(
  ({ isConstant, slots, ...props }: NodeCheckboxFieldProps) => {
    const Handle = slots?.Handle
    const [value, setValue] = useNodeFieldValue(props.id, props.defaultValue)

    const handleChange = useCallback(
      (e) => setValue(e.target.checked),
      [setValue],
    )

    return (
      <div
        style={{
          margin: '4px 0',
          padding: '0 12px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isConstant || !Handle ? null : <Handle />}
        <input
          style={{
            appearance: value ? undefined : 'none',
            background: '#545555',
            border: 'none',
            borderRadius: 3,
            width: 14,
            height: 14,
            margin: '0 4px 0 0',
          }}
          type="checkbox"
          onChange={handleChange}
          checked={value}
        />
        <label
          style={{
            color: '#fff',
            fontSize: '12px',
            textShadow: '0 1px rgba(0,0,0,0.4)',
          }}
        >
          {props.name}
        </label>
      </div>
    )
  },
)
