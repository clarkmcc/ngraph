import { FunctionComponent, memo, ReactElement, useMemo } from 'react'
import { Edge, Node } from 'reactflow'
import { isEqual } from 'lodash'
import { useNodesEdges } from './hooks/node'
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
import { NodeOutputField } from './components/NodeOutputField'
import { NodeContainer } from './components/NodeContainer'
import { useFocusBlur } from './hooks/focus'

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
    const [isFocused, onFocus, onBlur] = useFocusBlur()

    // Construct memoized input components based on the node config
    const edges = useNodesEdges(node.id)
    const edgeIds = edges.map((e) => e.id).join()
    const inputs = useMemo(() => {
      const targetEdges = edges.filter((edge) => edge.target === node.id)
      return (nodeConfig.inputs ?? []).map((input) =>
        getInputElement(config, targetEdges, input, onFocus, onBlur),
      )
    }, [config, node, edgeIds])

    // Construct memoized output components based on the node config
    const outputs = useMemo(() => {
      return (nodeConfig.outputs ?? []).map((output) =>
        getOutputElements(config, output),
      )
    }, [config, node])

    return (
      <NodeContainer draggable={!isFocused} node={node}>
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
      </NodeContainer>
    )
  }
  return memo(component, isComponentChanged)
}

function getInputElement(
  graphConfig: GraphConfig,
  edges: Edge[],
  input: NodeInputConfig,
  onFocus: () => void,
  onBlur: () => void,
): JSX.Element {
  const inputConfig = graphConfig.getInputConfig(input)

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
): JSX.Element {
  const outputConfig = graphConfig.getOutputConfig(output)
  return <NodeOutputField key={output.identifier} {...outputConfig} />
}
