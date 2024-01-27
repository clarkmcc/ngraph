import { memo, useMemo, useState } from 'react'
import { useNodeFieldValue } from '../hooks/node'
import './NodeHeader.css'
import { GoTriangleDown, GoTriangleRight } from 'react-icons/go'

type NodeHeaderProps = {
  defaultTitle: string
  color: string
  collapsed?: boolean
  toggleCollapsed?: () => void
}

/**
 * Location in the node's `data` object where the header value is stored.
 */
export const HEADER_FIELD_NAME = '__header'

export const NodeHeader = memo(
  ({ defaultTitle, color, collapsed, toggleCollapsed }: NodeHeaderProps) => {
    const [_name, _setName] = useNodeFieldValue(HEADER_FIELD_NAME, defaultTitle)
    const [name, setName] = useState(_name)
    const [isEditable, setIsEditable] = useState(false) // New state to manage edit mode

    const showCollapsedIndicator = toggleCollapsed != null

    function handleBlur(): void {
      if (name) {
        _setName(name)
      }
      setIsEditable(false) // Exit edit mode on blur
    }

    function handleNameChange(event: any): void {
      setName(event.target.value)
    }

    function handleDoubleClick(): void {
      setIsEditable(true) // Enter edit mode on double click
    }

    function handleInputKeyDown(
      event: React.KeyboardEvent<HTMLInputElement>,
    ): void {
      event.key === 'Enter' && handleBlur()
    }

    const collapsedElement = useMemo(() => {
      if (showCollapsedIndicator) {
        if (collapsed) {
          return (
            <GoTriangleRight
              onClick={toggleCollapsed}
              style={{
                color: 'black',
                opacity: 0.4,
                fontSize: 18,
                cursor: 'pointer',
              }}
            />
          )
        } else {
          return (
            <GoTriangleDown
              onClick={toggleCollapsed}
              style={{
                color: 'black',
                opacity: 0.4,
                fontSize: 18,
                cursor: 'pointer',
              }}
            />
          )
        }
      } else {
        return <></>
      }
    }, [showCollapsedIndicator, collapsed])

    return (
      <div
        style={{
          background: color,
          color: '#fff',
          padding: '4px 6px',
          fontSize: '12px',
          borderRadius: collapsed ? 5 : undefined,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          boxShadow: 'inset 0 -1px rgba(0,0,0,0.4)',
          textShadow: '0 1px rgba(0,0,0,0.4)',
          display: 'flex',
        }}
      >
        {collapsedElement}

        {isEditable ? (
          <input
            className="header-input"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div onDoubleClick={handleDoubleClick} className="header-input-div">
            {name}
          </div>
        )}
      </div>
    )
  },
  (a, b) => a.collapsed == b.collapsed,
)
