import { FunctionComponent, JSX, memo, ReactElement, useMemo } from 'react'
import { Edge, Node, Position } from 'reactflow'
import { useNodesEdges } from './hooks/node'
import {
  GraphConfig,
  NodeConfig,
  NodeInputConfig,
  NodeOutputConfig,
} from './config'
import { NodeLinkedField } from './components/NodeLinkedField'
import { useGraphConfig } from './context/GraphConfigContext'
import { NodeOutputField } from './components/NodeOutputField'
import { NodeContainer } from './components/NodeContainer'
import { useFocusBlur } from './hooks/focus'
import { isEqual } from 'lodash-es'
import { Handle } from './components/Handle.tsx'
import { InputGroup } from './components/InputGroup.tsx'

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

    function getInputElements(
      inputs: NodeInputConfig[],
      edges: Edge[],
    ): JSX.Element[] {
      const targetEdges = edges.filter((edge) => edge.target === node.id)
      return inputs.map((input) =>
        getInputElement(config, targetEdges, input, onFocus, onBlur),
      )
    }

    // Construct memoized input components based on the node config
    const edges = useNodesEdges(node.id)
    const edgeIds = edges.map((e) => e.id).join()
    const inputConfigs = nodeConfig.inputs ?? []

    const inputs = useMemo(() => {
      return getInputElements(
        inputConfigs.filter((input) => !input.group),
        edges,
      )
    }, [inputConfigs, config, node, edgeIds])

    const inputGroups = useMemo(() => {
      const grouped: Record<string, NodeInputConfig[]> = inputConfigs
        .filter((input) => input.group)
        .reduce((acc: Record<string, NodeInputConfig[]>, input) => {
          const group = input.group!
          if (!acc[group]) acc[group] = []
          acc[group].push(input)
          return acc
        }, {})
      return Object.keys(grouped).map((group) => ({
        group,
        elements: getInputElements(grouped[group], edges),
      }))
    }, [inputConfigs, config, node, edgeIds])

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
          {Object.values(inputGroups).map(({ group, elements }) => (
            <InputGroup label={group} key={group}>
              {elements}
            </InputGroup>
          ))}
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

  if (edges.find((edge) => edge.targetHandle === input.id)) {
    return <NodeLinkedField key={inputConfig.id} {...inputConfig} />
  }

  const Element = graphConfig.getInputComponent(input.valueType as string)
  if (Element) {
    return (
      <Element
        key={input.id}
        onFocus={onFocus}
        onBlur={onBlur}
        slots={{
          Handle: () => (
            <Handle
              handleType="target"
              position={Position.Left}
              {...inputConfig}
            />
          ),
        }}
        {...inputConfig}
      ></Element>
    )
  } else {
    return <NodeLinkedField key={input.id} {...inputConfig} />
  }
}

function getOutputElements(
  graphConfig: GraphConfig,
  output: NodeOutputConfig,
): JSX.Element {
  const outputConfig = graphConfig.getOutputConfig(output)
  return <NodeOutputField key={output.id} {...outputConfig} />
}
