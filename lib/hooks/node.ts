import { useCallback, useMemo, useState } from 'react'
import { Edge, useNodeId } from 'reactflow'
import { useGraphStore } from '../store/store.ts'

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
  const { updateNodeData } = useGraphStore()
  const data = useNodesData<{ [INPUT_GROUPS_FIELD]: string[] }>(nodeId)
  const [isEnabled, setIsEnabled] = useState(
    (data[INPUT_GROUPS_FIELD] ?? []).includes(key),
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
  const { updateNodeData } = useGraphStore()
  const data = useNodesData<any>(nodeId!)
  const value = useMemo(
    () => (data ? data[field] : defaultValue) ?? defaultValue,
    [data, defaultValue],
  )
  const updateValue = useCallback(
    (value: T) => {
      updateNodeData<any>(nodeId!, { [field]: value })
    },
    [nodeId, field],
  )
  return [value, updateValue]
}

export function useNodesData<T>(nodeId: string): T {
  return useGraphStore((state) => {
    return state.allNodes.get(nodeId)?.data || null
  })
}

export function useNodesEdges(nodeId: string): Edge[] {
  return useGraphStore((state) => {
    return Array.from(
      state.allEdges
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .values(),
    )
  })
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
