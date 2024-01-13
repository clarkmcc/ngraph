import { Edge, Node, ReactFlowState } from 'reactflow'
import { Dispatch, SetStateAction } from 'react'
import { nanoid } from 'nanoid'

export enum ClipboardItem {
  NodesAndEdges = 1,
}

export namespace ClipboardItem {
  export async function copyNodesAndEdges(state: ReactFlowState) {
    const nodes = state.getNodes().filter((n) => n.selected)
    const nodeIds = nodes.map((n) => n.id)

    // Edges selected because both the source and target nodes are selected
    const edges = state.edges.filter(
      (e) => nodeIds.includes(e.target) && nodeIds.includes(e.source),
    )
    const text = JSON.stringify({
      type: ClipboardItem.NodesAndEdges,
      nodes,
      edges,
    })
    await window.navigator.clipboard.writeText(text)
  }

  export async function tryReadClipboard(
    setNodes: Dispatch<SetStateAction<Node[]>>,
    setEdges: Dispatch<SetStateAction<Edge[]>>,
  ) {
    try {
      const text = await window.navigator.clipboard.readText()
      const payload = JSON.parse(text)
      if ('type' in payload) {
        switch (payload.type) {
          case ClipboardItem.NodesAndEdges:
            const { nodes, edges }: { nodes: Node[]; edges: Edge[] } = payload

            // For each of the copied nodes, map the current node ID to a new node ID. // todo: collision detection?
            const nodeIdMap = new Map(nodes.map((n) => [n.id, nanoid(6)]))
            const edgeIdMap = new Map(edges.map((e) => [e.id, nanoid(6)]))

            // For each of the nodes, clone the object and set it's ID to the newly
            // generated ID.
            const newNodes = nodes.map(
              (node) =>
                ({
                  ...node,
                  id: nodeIdMap.get(node.id),
                  selected: true,
                  position: {
                    x: node.position.x + 100,
                    y: node.position.y + 100,
                  },
                }) as Node,
            )

            // Do the same for the edges
            const newEdges = edges.map(
              (edge) =>
                ({
                  ...edge,
                  id: edgeIdMap.get(edge.id),
                  source: nodeIdMap.get(edge.source),
                  target: nodeIdMap.get(edge.target),
                }) as Edge,
            )

            // Update the state by adding the copied nodes and edges, unselecting
            // everything that is currently selected, and selecting the newly
            // copied nodes and edges.
            setNodes((nodes) =>
              nodes
                .map((n) => ({ ...n, selected: false }) as Node)
                .concat(newNodes),
            )
            setEdges((edges) =>
              edges
                .map((e) => ({ ...e, selected: false }) as Edge)
                .concat(newEdges),
            )
            break
          default:
            console.log(`Unknown clipboard item type ${payload.type}`)
        }
      }
    } catch (e) {
      console.error('Reading clipboard', e)
    }
  }
}
