import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { Edge, useNodeId, useReactFlow, useStore } from 'reactflow'
import { shallow } from 'zustand/shallow'

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

export function useNodesData<T>(nodeId: string): T {
  return useStore(
    useCallback(
      (s) => {
        return s.nodeInternals.get(nodeId)?.data || null
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

export function useNodeCollapsed(): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  return useNodeFieldValue(COLLAPSED_FIELD_NAME, false)
}
