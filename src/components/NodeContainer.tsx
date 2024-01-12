import { Node } from 'reactflow'
import { CSSProperties, ReactElement } from 'react'

type NodeContainerProps = {
  node: Node
  isFocused?: boolean
  styles?: CSSProperties
  children?: ReactElement | ReactElement[]
}

export function NodeContainer({
  isFocused,
  node,
  styles,
  children,
}: NodeContainerProps) {
  return (
    <div
      style={{
        borderRadius: 6,
        fontFamily: 'sans-serif',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
        background: '#303030',
        border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
        ...styles,
      }}
      className={isFocused ? 'nodrag' : undefined}
    >
      {children}
    </div>
  )
}
