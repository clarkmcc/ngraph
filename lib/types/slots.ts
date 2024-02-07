import { ComponentType } from 'react'
import { NodeHeader, NodeHeaderProps } from '../components/NodeHeader.tsx'

export type GraphSlots = {
  header: ComponentType<NodeHeaderProps>
}

const defaultGraphSlots: GraphSlots = {
  header: NodeHeader,
}

export function getDefaultSlots(slots?: Partial<GraphSlots>): GraphSlots {
  return {
    ...defaultGraphSlots,
    ...slots,
  }
}
