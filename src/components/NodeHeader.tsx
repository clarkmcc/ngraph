import { memo, useState } from 'react'
import { isEqual } from 'lodash'
import { useNodeFieldValue } from '../hooks/node'

type NodeHeaderProps = {
  defaultTitle: string
  color: string
}

/**
 * Location in the node's `data` object where the header value is stored.
 */
const HEADER_FIELD_NAME = '__header'

export const NodeHeader = memo(({ defaultTitle, color }: NodeHeaderProps) => {
  const [_name, _setName] = useNodeFieldValue(HEADER_FIELD_NAME, defaultTitle)
  const [name, setName] = useState(_name)

  function handleBlur(): void {
    if (name) {
      _setName(name)
    }
  }

  function handleNameChange(event: any): void {
    setName(event.target.value)
  }

  return (
    <div
      style={{
        background: color,
        color: '#fff',
        padding: '4px 12px',
        fontSize: '12px',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        boxShadow: 'inset 0 -1px rgba(0,0,0,0.4)',
        textShadow: '0 1px rgba(0,0,0,0.4)',
        display: 'flex',
      }}
    >
      <div
        style={{
          background: 'black',
          opacity: 0.4,
          width: 10,
          height: 10,
          borderRadius: 100,
          marginTop: 'auto',
          marginBottom: 'auto',
          marginRight: 6,
        }}
      />
      <input
        value={name}
        style={{
          backgroundColor: 'transparent',
          color: '#fff',
          fontSize: '12px',
          textShadow: '0 1px rgba(0,0,0,0.4)',
          border: 0,
        }}
        onChange={handleNameChange}
        onBlur={handleBlur}
      ></input>
    </div>
  )
}, isEqual)
