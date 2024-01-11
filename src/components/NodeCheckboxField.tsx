import { memo, useCallback, useMemo } from 'react'
import { Handle } from './Handle'
import { NodeInputConfig, ValueTypeConfig } from '../config'
import { useNodeFieldValue } from '../hooks/node'
import { Position } from '@xyflow/react'

type NodeCheckboxFieldProps = NodeInputConfig &
  ValueTypeConfig & {
    nodeId: string
  }

export const NodeCheckboxField = memo(
  ({ nodeId, isConstant, ...props }: NodeCheckboxFieldProps) => {
    const [value, setValue] = useNodeFieldValue(
      nodeId,
      props.identifier,
      props.defaultValue,
    )

    const id = useMemo(() => `${name}/${Math.random()}`, [])

    const handle = useMemo(
      () => (
        <Handle
          handleType="target"
          nodeId={nodeId}
          position={Position.Left}
          {...props}
        />
      ),
      [nodeId],
    )

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
        {!isConstant && handle}
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
          id={id}
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
          htmlFor={id}
        >
          {props.name}
        </label>
      </div>
    )
  },
)
