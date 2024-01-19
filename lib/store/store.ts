import {
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Viewport,
} from 'reactflow'
import { Map, Set } from 'immutable'
import { devtools } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import {
  GROUP_INPUTS_NODE_TYPE,
  GROUP_NODE_TYPE,
  GROUP_OUTPUTS_NODE_TYPE,
} from '../GroupNode.tsx'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

type StoreSetter<T> = (modifier: (oldValue: T) => T) => void

type Store = {
  selectedNodeGroupId: string | null

  // The nodes and edges that are visible in the viewport
  nodes: Node[]
  edges: Edge[]

  // All nodes and edges in the graph, regardless of visibility
  allNodes: Map<string, Node>
  allEdges: Map<string, Edge>

  // Group node ids mapped to child node ids
  groupNodeIds: Map<string, Set<string>>

  // Active viewport state
  viewport: Viewport

  setNodes: StoreSetter<Node[]>
  setEdges: StoreSetter<Edge[]>
}

type Actions = {
  selectedNodeGroupId: string | null

  // The nodes and edges that are visible in the viewport
  nodes: Node[]
  edges: Edge[]

  // All nodes and edges in the graph, regardless of visibility
  allNodes: Map<string, Node>
  allEdges: Map<string, Edge>

  // Group node ids mapped to child node ids
  groupNodeIds: Map<string, Set<string>>

  // Active viewport state
  viewport: Viewport

  setNodes: StoreSetter<Node[]>
  setEdges: StoreSetter<Edge[]>

  applyNodeChanges: (changes: NodeChange[]) => void
  applyEdgeChanges: (changes: EdgeChange[]) => void
  createNodeGroup: (nodeIds: string[]) => void
  selectNodeGroup: (nodeId: string | null) => void
  updateNodeData: <T extends object>(
    id: string,
    dataUpdate: T | ((node: Node) => T),
  ) => void
}

type SetNodesOptions = {
  computeVisible?: boolean
}

export const useGraphStore = createWithEqualityFn(
  devtools<Store & Actions>(
    (set) => ({
      selectedNodeGroupId: null,
      nodes: [],
      edges: [],
      allNodes: Map(),
      allEdges: Map(),
      groupNodeIds: Map(),
      viewport: { x: 0, y: 0, zoom: 1 },

      setNodes: (
        modifier: (oldNodes: Node[]) => Node[],
        options?: SetNodesOptions,
      ) => {
        set((state) => {
          const allNodes = Map(
            modifier([...state.allNodes.values()]).map((n) => [n.id, n]),
          )
          if (options?.computeVisible) {
            const [nodes, edges] = computeVisible(
              state.selectedNodeGroupId,
              state.groupNodeIds,
              allNodes,
              state.allEdges,
            )
            return { allNodes, nodes, edges }
          }
          return { allNodes }
        })
      },

      updateNodeData: <T extends object>(
        id: string,
        dataUpdate: T | ((node: Node) => T),
      ) => {
        set((store) => {
          const updater = (node: Node) => {
            const nextData =
              typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate
            return { ...node, data: { ...node.data, ...nextData } }
          }
          const allNodes = store.allNodes.update(id, (node) =>
            node ? updater(node) : undefined,
          )
          const nodes = store.nodes.map((node) =>
            node.id === id ? updater(node) : node,
          )
          return { allNodes, nodes }
        })
      },

      setEdges: (modifier: (oldEdges: Edge[]) => Edge[]) => {
        set((state) => {
          const allEdges = Map(
            modifier([...state.allEdges.values()]).map((e) => [e.id, e]),
          )
          const [nodes, edges] = computeVisible(
            state.selectedNodeGroupId,
            state.groupNodeIds,
            state.allNodes,
            allEdges,
          )
          return { allEdges, nodes, edges }
        })
      },

      // addNode: (node: Node) => {
      //   set((state) => ({ internal: state.internal.addNode(node) }))
      // },

      selectNodeGroup: (nodeId: string | null) =>
        set((state) => {
          console.log('select node group', state.allNodes)
          const [nodes, edges] = computeVisible(
            nodeId,
            state.groupNodeIds,
            state.allNodes,
            state.allEdges,
          )
          return { selectedNodeGroupId: nodeId, nodes, edges }
        }),

      createNodeGroup: (nodeIds: string[]) =>
        set((state) => {
          if (nodeIds.length === 0) return {}

          const [group, allNodes, groupNodeIds] = createGroup(state, nodeIds)
          const [nodes, edges] = computeVisible(
            group.id,
            groupNodeIds,
            allNodes,
            state.allEdges,
          )
          return {
            selectedNodeGroupId: group.id,
            groupNodeIds,
            allNodes,
            nodes,
            edges,
          }
        }),

      // deleteNodeGroup: (nodeId: string) => {},

      applyNodeChanges: (changes: NodeChange[]) =>
        set((state) => {
          console.log('apply node changes', changes, state.allNodes)
          let groupNodeIds = state.groupNodeIds
          for (const change of changes) {
            switch (change.type) {
              case 'add':
                if (state.selectedNodeGroupId) {
                  groupNodeIds = updateGroupNodeIds(
                    state.selectedNodeGroupId,
                    state,
                    (ids) => ids.add(change.item.id),
                  )
                }
                continue
              case 'remove':
                if (state.selectedNodeGroupId) {
                  groupNodeIds = updateGroupNodeIds(
                    state.selectedNodeGroupId,
                    state,
                    (ids) => ids.delete(change.id),
                  )
                }
            }
          }

          // We can safely apply all changes to both the visible and non-visible nodes
          // because we make the assumption that all changes are happening to the nodes
          // in the viewport. Even when we're adding a node, it's going to be added to
          // the currently selected node group, or to the graph as a whole, meaning it's
          // safe to apply the changes the visible node array as well.

          return {
            allNodes: mapApplyNodeChanges(state, changes),
            nodes: applyNodeChanges(changes, state.nodes),
            groupNodeIds: groupNodeIds,
          }
        }),

      applyEdgeChanges: (changes: EdgeChange[]) =>
        set((state) => {
          return {
            allEdges: mapApplyEdgeChanges(state, changes),
            edges: applyEdgeChanges(changes, state.edges),
            groupNodeIds: state.groupNodeIds,
          }
        }),
    }),
    shallow,
  ),
)

function mapApplyNodeChanges(
  store: Store,
  changes: NodeChange[],
): Map<string, Node> {
  return Map(
    applyNodeChanges(changes, [...store.allNodes.values()]).map((n) => [
      n.id,
      n,
    ]),
  )
}

function mapApplyEdgeChanges(
  store: Store,
  changes: EdgeChange[],
): Map<string, Edge> {
  return Map(
    applyEdgeChanges(changes, [...store.allEdges.values()]).map((e) => [
      e.id,
      e,
    ]),
  )
}

function updateGroupNodeIds(
  selectedNodeGroupId: string,
  store: Store,
  update: (ids: Set<string>) => Set<string>,
): Map<string, Set<string>> {
  return store.groupNodeIds.update(selectedNodeGroupId, Set(), update)
}

// function getNodeFromChange(change: NodeChange, allNodes: Node[]): Node | null {
//   if ('id' in change) {
//     return allNodes.find((node) => node.id === change.id) ?? null
//   } else if ('item' in change) {
//     return change.item
//   }
// }

function nodesByGroup(
  groupNodeId: string,
  groupNodeIds: Map<string, Set<string>>,
  allNodes: Map<string, Node>,
): Node[] {
  const nodeIds = groupNodeIds.get(groupNodeId)
  return nodeIds
    ? [...allNodes.filter((node) => nodeIds.has(node.id)).values()]
    : []
}

function edgesByGroup(
  groupNodeId: string,
  groupNodeIds: Map<string, Set<string>>,
  allEdges: Map<string, Edge>,
): Edge[] {
  const nodeIds = groupNodeIds.get(groupNodeId)
  return nodeIds
    ? [
        ...allEdges
          .filter(
            (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
          )
          .values(),
      ]
    : []
}

function nodeIdsInGroups(groupNodeIds: Map<string, Set<string>>): Set<string> {
  return [...groupNodeIds.values()].reduce(
    (acc: Set<string>, set) => acc.union(set),
    Set(),
  )
}

function edgeIdsInGroups(
  groupNodeIds: Map<string, Set<string>>,
  allEdges: Map<string, Edge>,
): Set<string> {
  const ids = nodeIdsInGroups(groupNodeIds)
  return Set(
    allEdges
      .filter((edge) => ids.includes(edge.source) && ids.includes(edge.target))
      .map((edge) => edge.id)
      .values(),
  )
}

function computeVisible(
  selectedNodeGroupId: string | null,
  groupNodeIds: Map<string, Set<string>>,
  allNodes: Map<string, Node>,
  allEdges: Map<string, Edge>,
): [Node[], Edge[]] {
  if (selectedNodeGroupId) {
    const nodes = nodesByGroup(selectedNodeGroupId, groupNodeIds, allNodes)
    const edges = edgesByGroup(selectedNodeGroupId, groupNodeIds, allEdges)
    return [nodes, edges]
  } else {
    const nodeIds = nodeIdsInGroups(groupNodeIds)
    const edgeIds = edgeIdsInGroups(groupNodeIds, allEdges)

    const nonGroupNodes = [
      ...allNodes.filter((node) => !nodeIds.includes(node.id)).values(),
    ]
    const nonGroupEdges = [
      ...allEdges.filter((edge) => !edgeIds.includes(edge.id)).values(),
    ]
    // console.log('group not selected', nodeIds, allNodes, nonGroupNodes)
    return [nonGroupNodes, nonGroupEdges]
  }
}

// function updateNode(node: Node, ...arrays: Node[][]) {
//   arrays.forEach((a) => {
//     const i = a.findIndex((n) => n.id === node.id)
//     if (~i) a[i] = node
//   })
// }

function createGroup(
  store: Store,
  nodeIds: string[],
): [Node, Map<string, Node>, Map<string, Set<string>>] {
  // Find our first and last nodes. We'll use these to position the group node as well
  // as the group's input and output nodes.
  const firstNode = store.allNodes.find((node) => node.id === nodeIds[0])!
  const lastNode = store.allNodes.find(
    (node) => node.id === nodeIds[nodeIds.length - 1],
  )!

  const group: Node = {
    id: nanoid(6),
    type: GROUP_NODE_TYPE,
    position: { x: firstNode.position.x, y: firstNode.position.y },
    data: {},
  }
  const inputNode: Node = {
    id: nanoid(6),
    type: GROUP_INPUTS_NODE_TYPE,
    position: {
      x: lastNode.position.x - 200,
      y: lastNode.position.y,
    },
    data: {},
  }
  const outputNode: Node = {
    id: nanoid(6),
    type: GROUP_OUTPUTS_NODE_TYPE,
    position: {
      x: lastNode.position.x + 200,
      y: lastNode.position.y,
    },
    data: {},
  }

  const groupNodeIds = store.groupNodeIds.set(
    group.id,
    Set([...nodeIds, inputNode.id, outputNode.id]),
  )

  const allNodes = store.allNodes.concat(
    Map([
      [group.id, group],
      [inputNode.id, inputNode],
      [outputNode.id, outputNode],
    ]),
  )

  return [group, allNodes, groupNodeIds]
}
