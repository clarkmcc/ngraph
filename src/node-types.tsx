import * as React from 'react'
import {
  FunctionComponent,
  memo,
  ReactElement,
  useCallback,
  useMemo,
} from 'react'
import { Edge, Node } from '@xyflow/react'
import { isEqual } from 'lodash'
import { useNodeCollapsed, useNodesEdges } from './hooks/node'
import { NodeDenseLinkedField } from './components/NodeDenseLinkedField'
import {
  GraphConfig,
  NodeConfig,
  NodeInputConfig,
  NodeOutputConfig,
  ValueTypeConfigOptions,
} from './config'
import { NodeLinkedField } from './components/NodeLinkedField'
import { NodeInputField } from './components/NodeInputField'
import { NodeSelectField } from './components/NodeSelectField'
import { NodeToggleField } from './components/NodeToggleField'
import { NodeCheckboxField } from './components/NodeCheckboxField'
import { useGraphConfig } from './context/GraphConfigContext'
import { NodeDenseOutputField } from './components/NodeDenseOutputField'
import { NodeOutputField } from './components/NodeOutputField'
import { NodeHeader } from './components/NodeHeader'

/**
 * Determines whether a node component should be re-rendered based
 * on whether the node's selection or data has changed.
 * @param a {Node}
 * @param b {Node}
 */
const isComponentChanged = (a: Node, b: Node) =>
  a.selected === b.selected && isEqual(a.data, b.data)

export function buildNode(nodeConfig: NodeConfig): FunctionComponent<Node> {
  function component(node: Node): ReactElement {
    const [config] = useGraphConfig()

    const [collapsed, setCollapsed] = useNodeCollapsed()
    const [isFocused, onFocus, onBlur] = useFocusBlur()
    const toggleCollapse = useCallback(
      () => setCollapsed((v) => !v),
      [setCollapsed],
    )

    // Construct memoized input components based on the node config
    const edges = useNodesEdges(node.id)
    const edgeIds = edges.map((e) => e.id).join()
    const inputs = useMemo(() => {
      const targetEdges = edges.filter((edge) => edge.target === node.id)
      return (nodeConfig.inputs ?? []).map((input) =>
        getInputElement(config, targetEdges, input, collapsed, onFocus, onBlur),
      )
    }, [config, collapsed, node, edgeIds])

    // Construct memoized output components based on the node config
    const outputs = useMemo(() => {
      return (nodeConfig.outputs ?? []).map((output) =>
        getOutputElements(config, output, collapsed),
      )
    }, [config, collapsed, node])

    return (
      <div
        style={{
          borderRadius: 6,
          fontFamily: 'sans-serif',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
          background: '#303030',
          border: `1px solid ${node.selected ? '#fff' : '#0f1010'}`,
          minWidth: nodeConfig.style?.minWidth,
        }}
        className={isFocused ? 'nodrag' : undefined}
      >
        <NodeHeader
          nodeConfig={nodeConfig}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <div
          style={{
            padding: '8px 0 12px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {outputs}
          {inputs}
        </div>
      </div>
    )
  }
  return memo(component, isComponentChanged)
}

function getInputElement(
  graphConfig: GraphConfig,
  edges: Edge[],
  input: NodeInputConfig,
  collapsed: boolean,
  onFocus: () => void,
  onBlur: () => void,
): JSX.Element {
  const inputConfig = graphConfig.getInputConfig(input)

  if (collapsed) {
    return (
      <NodeDenseLinkedField key={inputConfig.identifier} {...inputConfig} />
    )
  }

  if (edges.find((edge) => edge.targetHandle === input.identifier)) {
    return <NodeLinkedField key={inputConfig.identifier} {...inputConfig} />
  }

  switch (inputConfig.inputType) {
    case 'value':
      return (
        <NodeInputField
          key={input.identifier}
          onBlur={onBlur}
          onFocus={onFocus}
          {...inputConfig}
        />
      )
    case 'options':
      return (
        <NodeSelectField
          key={input.identifier}
          onFocus={onFocus}
          onBlur={onBlur}
          {...(inputConfig as ValueTypeConfigOptions & NodeInputConfig)}
        />
      )
    case 'buttonGroup':
      return (
        <NodeToggleField
          key={input.identifier}
          onFocus={onFocus}
          onBlur={onBlur}
          {...(inputConfig as ValueTypeConfigOptions & NodeInputConfig)}
        />
      )
    case 'checkbox':
      return <NodeCheckboxField key={input.identifier} {...inputConfig} />
    default:
      return <NodeLinkedField key={input.identifier} {...inputConfig} />
  }
}

function getOutputElements(
  graphConfig: GraphConfig,
  output: NodeOutputConfig,
  collapsed: boolean,
): JSX.Element {
  const outputConfig = graphConfig.getOutputConfig(output)
  if (collapsed) {
    return <NodeDenseOutputField key={output.identifier} {...outputConfig} />
  } else {
    return <NodeOutputField key={output.identifier} {...output} />
  }
}

function useFocusBlur(): [boolean, () => void, () => void] {
  const [isFocused, setIsFocused] = React.useState(false)
  const onFocus = useCallback(() => setIsFocused(true), [])
  const onBlur = useCallback(() => setIsFocused(false), [])
  return [isFocused, onFocus, onBlur]
}
