import { CSSProperties, ReactNode, useMemo, useState } from 'react'
import { GoTriangleDown } from 'react-icons/go'

type InputGroupProps = {
  label: string
  children: ReactNode
  style?: CSSProperties
  labelStyle?: CSSProperties
}

export const InputGroup = ({
  label,
  children,
  style,
  labelStyle,
}: InputGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const defaultStyles: Record<string, CSSProperties> = useMemo(
    () => ({
      label: {
        fontSize: '12px',
        cursor: 'pointer',
        padding: '5px 8px',
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
    <div style={style}>
      <div
        onClick={toggleAccordion}
        style={{ ...defaultStyles.label, ...labelStyle }}
      >
        <GoTriangleDown style={defaultStyles.icon} />
        <span style={{ marginLeft: 2, paddingTop: 2 }}>{label}</span>
      </div>
      {isOpen && <div style={defaultStyles.content}>{children}</div>}
    </div>
  )
}
