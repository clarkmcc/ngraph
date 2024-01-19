import { useCallback, useMemo, useState } from 'react'
import {
  Edge,
  isNode,
  Node,
  useNodeId,
  useReactFlow,
  useStore,
} from '@xyflow/react'
import { shallow } from 'zustand/shallow'

const INPUT_GROUPS_FIELD = '__inputGroupsExpanded'

/**
 * A drop-in replacement for the useState hook that stores whether an input group is expanded
 * or not in the node's data object. It shares the same underlying array of expanded groups
 * with other hooks that use the same node ID.
 * @param group
 */
export function useNodeInputGroupState(
  group: string,
): [boolean, (newState: boolean) => void] {
  const nodeId = useNodeId()
  return useToggleNodeArrayProperty(nodeId!, INPUT_GROUPS_FIELD, group)
}

/**
 * Toggles a boolean property in the node's data object where the boolean is determined
 * by the presence of the key in property (an array of strings). It is an alternative to
 * just using a boolean property on the root and is useful because it reduces the possibility
 * of collisions with other user-defined properties.
 *
 * @example
 * {
 *     data: {
 *         __inputGroupsExpanded: ['group1', 'group2']
 *     }
 * }
 *
 * @param nodeId
 * @param property
 * @param key
 */
function useToggleNodeArrayProperty(
  nodeId: string,
  property: string,
  key: string,
): [boolean, (newState: boolean) => void] {
  const updateNodeData = useUpdateNodeData()
  const data = useNodesData<{ [INPUT_GROUPS_FIELD]: string[] }>(nodeId)
  const [isEnabled, setIsEnabled] = useState(
    data[INPUT_GROUPS_FIELD].includes(key),
  )
  const toggleProperty = useCallback(
    (newState) => {
      setIsEnabled(newState)

      updateNodeData(nodeId, (node) => {
        const currentArray: string[] = node.data[property] || []
        let updatedArray

        if (newState) {
          // Add the property to the array if not already present
          updatedArray = currentArray.includes(key)
            ? currentArray
            : [...currentArray, key]
        } else {
          // Remove the property from the array
          updatedArray = currentArray.filter((item) => item !== key)
        }

        return { ...node.data, [property]: updatedArray }
      })
    },
    [nodeId, property, updateNodeData],
  )

  return [isEnabled, toggleProperty]
}

export function useNodeFieldValue<T>(
  field: string,
  defaultValue?: T,
): [T, (value: T) => void] {
  const nodeId = useNodeId()
  const { setNodes } = useReactFlow()
  const data = useNodesData<any>(nodeId!)
  const value = useMemo(
    () => (data ? data[field] : defaultValue) ?? defaultValue,
    [data, defaultValue],
  )
  const updateValue = useCallback(
    (value: T) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, [field]: value } } : n,
        ),
      )
    },
    [nodeId, field],
  )
  return [value, updateValue]
}

export type UpdateNode = (
  id: string,
  dataUpdate: Partial<Node> | ((node: Node) => Partial<Node>),
  options?: { replace: boolean },
) => void

export type UpdateNodeData<T extends object> = (
  id: string,
  dataUpdate: T | ((node: Node) => T),
  options?: { replace: boolean },
) => void

export function useUpdateNode(): UpdateNode {
  const { setNodes } = useReactFlow()
  return useCallback(
    (id, nodeUpdate, options = { replace: true }) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            const nextNode =
              typeof nodeUpdate === 'function'
                ? nodeUpdate(node as Node)
                : nodeUpdate
            // @ts-ignore
            return options.replace && isNode(nextNode)
              ? nextNode
              : { ...node, ...nextNode }
          }

          return node
        }),
      )
    },
    [setNodes],
  )
}

export function useUpdateNodeData<T extends object>(): UpdateNodeData<T> {
  const updateNode = useUpdateNode()
  return useCallback(
    (id, dataUpdate, options = { replace: false }) => {
      updateNode(
        id,
        (node) => {
          const nextData =
            typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate
          return options.replace
            ? { ...node, data: nextData }
            : { ...node, data: { ...node.data, ...nextData } }
        },
        options,
      )
    },
    [updateNode],
  )
}

export function useNodesData<T>(nodeId: string): T {
  return useStore(
    useCallback(
      (s) => {
        return s.nodeLookup.get(nodeId)?.data || null
      },
      [nodeId],
    ),
    shallow,
  )
}

export function useNodesEdges(nodeId: string): Edge[] {
  return useStore(
    useCallback(
      (s) => {
        return s.edges.filter((e) => e.source === nodeId || e.target === nodeId)
      },
      [nodeId],
    ),
    shallow,
  )
}

const COLLAPSED_FIELD_NAME = '__collapsed'

export function useNodeCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useNodeFieldValue(
    COLLAPSED_FIELD_NAME,
    false,
  )
  const toggle = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  )
  return [collapsed, toggle]
}
