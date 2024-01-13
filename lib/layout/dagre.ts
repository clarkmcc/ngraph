import { Edge, Node, Position } from 'reactflow'
import { layout, graphlib } from 'dagre'

type LayoutResult = { nodes: Node[]; edges: Edge[] }

export function computeDagreLayout(nodes: Node[], edges: Edge[]): LayoutResult {
  const g = new graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR' })

  nodes.forEach((node) => {
    g.setNode(node.id, { width: node.width, height: node.height })
  })

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  layout(g)

  nodes.forEach((node) => {
    const nodeWithPosition = g.node(node.id)
    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    if (node.width && node.height) {
      node.position = {
        x: nodeWithPosition.x - node.width / 2 + 70,
        y: nodeWithPosition.y - node.height / 2 + 50,
      }
    }
    return node
  })

  return { nodes, edges }
}
