import { Edge as _Edge, Node as _Node } from '@xyflow/react'

export namespace Graph {
  export type Node<Data = unknown> = Omit<_Node, 'data'> & {
    data: NodeData<Data>
  }

  export type NodeData<Data> = Data & {
    internal: NodeInternals
  }

  export type NodeInputOutput = {
    id: string
    name: string
    valueType: string
  }

  export type NodeInternals = {
    inputs: NodeInputOutput[]
    outputs: NodeInputOutput[]
  }

  export type Edge = Omit<_Edge, 'data'> & {
    data?: {
      targetHandle: {
        name: string
        valueType: string
      }
    }
  }
}
