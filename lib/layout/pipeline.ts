import { Edge, Node, Position } from '@xyflow/react'
import { DirectedAcyclicGraph } from '@sroussey/typescript-graph'
import { LayoutEngine } from './layout'

type PositionXY = {
  x: number
  y: number
}

class GraphPipelineLayout<T extends Node> {
  protected dag: DirectedAcyclicGraph<T, boolean, string, string>
  protected positions: Map<string, PositionXY>
  public nodeWidthMin: number = 190
  public nodeHeightMin: number = 50
  public horizontalSpacing = 80 // Horizontal spacing between layers
  public verticalSpacing = 20 // Vertical spacing between nodes within a layer
  public startTop = 50 // Starting position of the top layer
  public startLeft = 50 // Starting position of the left layer
  protected layerHeight: number[]
  protected layers: Map<number, T[]>

  constructor(dag: DirectedAcyclicGraph<T, boolean, string, string>) {
    this.dag = dag
    this.positions = new Map()
    this.layers = new Map()
    this.layerHeight = []
  }

  public layoutGraph() {
    const sortedNodes = this.dag.topologicallySortedNodes()
    this.assignLayers(sortedNodes)
    this.positionNodes()
    // Optionally, you can include edge drawing logic here or handle it separately
  }

  private assignLayers(sortedNodes: T[]) {
    this.layers = new Map()
    const nodeToLayer = new Map<string, number>()

    // Initialize layer height for each layer
    this.layerHeight = []

    sortedNodes.forEach((node, _index) => {
      let maxLayer = -1

      // Get all incoming edges (dependencies) of the node
      const incomingEdges = this.dag.inEdges(node.id).map(([from]) => from)

      incomingEdges.forEach((from) => {
        // Find the layer of the dependency
        const layer = nodeToLayer.get(from)
        if (layer !== undefined) {
          maxLayer = Math.max(maxLayer, layer)
        }
      })

      // Assign the node to the next layer after the maximum layer of its dependencies
      const assignedLayer = maxLayer + 1
      nodeToLayer.set(node.id, assignedLayer)

      if (!this.layers.has(assignedLayer)) {
        this.layers.set(assignedLayer, [])
        this.layerHeight[assignedLayer] = 0 // Initialize layer height
      }

      this.layers.get(assignedLayer)?.push(node)
    })
  }

  protected positionNodes() {
    let currentX = this.startLeft
    let nodeWidth = this.nodeWidthMin
    this.layers.forEach((nodes, layer) => {
      let currentY = this.startTop
      nodes.forEach((node) => {
        this.positions.set(node.id, {
          x: currentX,
          y: currentY,
        })

        const nodeHeight = this.getNodeHeight(node)

        // Move Y to the next position for the following node
        currentY += nodeHeight + this.verticalSpacing

        nodeWidth = Math.max(this.getNodeWidth(node), nodeWidth)

        this.layerHeight[layer] = Math.max(this.layerHeight[layer], currentY)
      })

      // Move X to the next position for the next layer
      currentX += nodeWidth + this.horizontalSpacing
    })
  }

  protected getNodeHeight(node: T): number {
    // Implement logic to determine the height of the node
    // If node heights are fixed or uniform, you can return that constant value
    return node.computed?.height || this.nodeHeightMin // Example fixed height
  }

  protected getNodeWidth(node: T): number {
    // Implement logic to determine the height of the node
    // If node heights are fixed or uniform, you can return that constant value
    return node.computed?.width || this.nodeWidthMin // Example fixed height
  }

  public getNodePosition(nodeIdentity: string): PositionXY | undefined {
    return this.positions.get(nodeIdentity)
  }
}

class GraphPipelineCenteredLayout<
  T extends Node,
> extends GraphPipelineLayout<T> {
  protected positionNodes() {
    super.positionNodes()
    this.layers.forEach((nodes, layer) => {
      let currentY =
        (this.getMaxLayerHeight() - this.layerHeight[layer]) / 2 + this.startTop // Start Y for centering

      nodes.forEach((node) => {
        const nodeHeight = this.getNodeHeight(node)

        this.positions.set(node.id, {
          x: this.positions.get(node.id)!.x,
          y: currentY,
        })

        currentY += nodeHeight + this.verticalSpacing
      })
    })
  }

  private getMaxLayerHeight(): number {
    // Return the height of the tallest layer
    return Math.max(...this.layerHeight)
  }
}

function computeLayout(
  Graph: typeof GraphPipelineLayout,
  nodes: Node[],
  edges: Edge[],
): Node[] {
  const g = new DirectedAcyclicGraph<Node, boolean, string, string>(
    (node) => node.id,
  )

  nodes = nodes.filter((node) => !node.hidden)

  nodes.forEach((node) => {
    g.insert(node)
  })

  edges.forEach((edge) => {
    g.addEdge(edge.source, edge.target)
  })

  const gl = new Graph(g)
  gl.layoutGraph()

  return nodes.map((node) => {
    const nodeWithPosition = gl.getNodePosition(node.id)!
    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right
    node.position = { x: nodeWithPosition.x, y: nodeWithPosition.y }

    return node
  })
}

export class PipelineLayoutEngine extends LayoutEngine {
  name() {
    return 'pipeline'
  }

  apply(nodes: Node[], edges: Edge[]): Node[] {
    return computeLayout(GraphPipelineLayout, nodes, edges)
  }
}

export class PipelineCenteredLayoutEngine extends LayoutEngine {
  name() {
    return 'pipeline.centered'
  }

  apply(nodes: Node[], edges: Edge[]): Node[] {
    return computeLayout(GraphPipelineCenteredLayout, nodes, edges)
  }
}
