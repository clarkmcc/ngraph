import * as React from 'react'
import { memo, ReactElement, useCallback } from 'react'
import { Node } from '@xyflow/react'
import { isEqual } from 'lodash'
import { useNodeCollapsed } from './hooks/node'

/**
 * Determines whether a node component should be re-rendered based
 * on whether the node's selection or data has changed.
 * @param a {Node}
 * @param b {Node}
 */
const isComponentChanged = (a: Node, b: Node) =>
  a.selected === b.selected && isEqual(a.data, b.data)

function buildNode() {
  function component(node: Node): ReactElement {
    const [collapsed, setCollapsed] = useNodeCollapsed(node.id)
    const [isFocused, onFocus, onBlur] = useFocusBlur()

    return <></>
  }
  return memo(component, isComponentChanged)
}

function useFocusBlur(): [boolean, () => void, () => void] {
  const [isFocused, setIsFocused] = React.useState(false)
  const onFocus = useCallback(() => setIsFocused(true), [])
  const onBlur = useCallback(() => setIsFocused(false), [])
  return [isFocused, onFocus, onBlur]
}
