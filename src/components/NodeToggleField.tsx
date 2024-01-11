import { memo } from 'react'
import { NodeInputConfig, ValueTypeConfigOptions } from '../config'
import { useNodeFieldValue } from '../hooks/node'
import { Position } from '@xyflow/react'
import { Handle } from './Handle'

type NodeToggleFieldProps = NodeInputConfig &
  ValueTypeConfigOptions & {
    name: string
    onFocus: () => void
    onBlur: () => void
  }

export const NodeToggleField = memo(
  ({ options, isConstant, ...props }: NodeToggleFieldProps) => {
    const [value, setValue] = useNodeFieldValue(
      props.identifier,
      props.defaultValue,
    )

    return (
      <div style={{ position: 'relative' }}>
        {!isConstant && (
          <Handle handleType="target" position={Position.Left} {...props} />
        )}
        <div
          style={{
            margin: '2px 0',
            padding: '0 12px',
            display: 'flex',
          }}
        >
          {options.map((n, idx) => (
            <ToggleButton
              key={n.value}
              active={n.value === value}
              onClick={() => setValue(n.value)}
              style={
                {
                  0: {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    margin: '0 1px 0 0',
                  },
                  [options.length - 1]: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }[idx]
              }
            >
              {n.name}
            </ToggleButton>
          ))}
        </div>
      </div>
    )
  },
)

type ToggleButtonProps = {
  style?: React.CSSProperties
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToggleButton({ style, active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      style={{
        background: active ? '#3873b8' : '#545555',
        border: 'none',
        borderRadius: 4,
        padding: '3px 8px',
        color: '#fff',
        textShadow: '0 1px rgba(0,0,0,0.4)',
        fontSize: '12px',
        flex: 1,
        width: '100%',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
