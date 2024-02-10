import { ComponentType, ReactElement } from 'react'
import { NodeHeader, NodeHeaderProps } from '../components/NodeHeader.tsx'
import { NodeBody, NodeBodyProps, NodeWrapper } from '../node-builder.tsx'

export type GraphSlots = {
  header: ComponentType<NodeHeaderProps>,
  body: ComponentType<NodeBodyProps>,
  wrapper: ComponentType<{ children: ReactElement | ReactElement[] }>,
  bodyTop?: ComponentType,
  bodyBottom?: ComponentType,
}

const defaultGraphSlots: GraphSlots = {
  header: NodeHeader,
  body: NodeBody,
  wrapper: NodeWrapper,
}

export function getDefaultSlots(slots?: Partial<GraphSlots>): GraphSlots {
  return {
    ...defaultGraphSlots,
    ...slots,
  }
}
