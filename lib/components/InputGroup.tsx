import { CSSProperties, ReactNode, useMemo } from 'react'
import { GoTriangleDown } from 'react-icons/go'
import { useNodeInputGroupState } from '../hooks/node.ts'

type InputGroupProps = {
  label: string
  children: ReactNode
  style?: CSSProperties
  labelStyle?: CSSProperties
  handles: ReactNode
}

export const InputGroup = ({
  label,
  children,
  labelStyle,
  handles,
}: InputGroupProps) => {
  const [isOpen, setIsOpen] = useNodeInputGroupState(label)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const defaultStyles: Record<string, CSSProperties> = useMemo(
    () => ({
      label: {
        fontSize: '12px',
        cursor: 'pointer',
        padding: '3px 8px',
        display: 'flex',
        color: 'white',
        textShadow: '0 1px rgba(0,0,0,0.4)',
        transition: 'transform 0.1s ease',
      },
      icon: {
        color: 'white',
        opacity: 0.4,
        fontSize: 18,
        cursor: 'pointer',
        transition: 'transform 0.1s ease',
        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
      },
      content: {
        background: isOpen ? '#1e1e1e' : undefined,
        padding: '8px 0 8px',
        display: 'flex',
        flexDirection: 'column',
      },
    }),
    [isOpen],
  )

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          margin: '2px 0',
          padding: '0 12px',
          opacity: 0 /* using display:none makes edges go crazy*/,
        }}
      >
        {!isOpen && handles}
      </div>
      <div style={{ position: 'relative' }}>
        <div
          onClick={toggleAccordion}
          style={{ ...defaultStyles.label, ...labelStyle }}
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            <GoTriangleDown style={defaultStyles.icon} />
            <span style={{ marginLeft: 2, paddingTop: 2 }}>{label}</span>
          </div>
        </div>
        {isOpen && <div style={defaultStyles.content}>{children}</div>}
      </div>
    </div>
  )
}
