import {
  FunctionComponent,
  JSX,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { Edge, Node, Position } from '@xyflow/react'
import { useNodesEdges } from './hooks/node'
import {
  GraphConfig,
  NodeConfig,
  NodeInputConfig,
  NodeOutputConfig,
} from './config'
import { NodeLinkedField } from './components/NodeLinkedField'
import { NodeOutputField } from './components/NodeOutputField'
import { NodeContainer } from './components/NodeContainer'
import { useFocusBlur } from './hooks/focus'
import { Handle } from './components/Handle.tsx'
import { InputGroup } from './components/InputGroup.tsx'

/**
 * Determines whether a node component should be re-rendered based
 * on whether the node's selection or data has changed.
 * @param a {Node}
 * @param b {Node}
 */
const isComponentChanged = (a: Node, b: Node) =>
  a.selected === b.selected && JSON.stringify(a.data) === JSON.stringify(b.data) // switched from lodash because bundle size was so large

export function buildNode(
  config: GraphConfig,
  nodeConfig: NodeConfig,
): FunctionComponent<Node> {
  function component(node: Node): ReactElement {
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

    const getHandlesForInputs = useCallback(
      (configs: NodeInputConfig[]): ReactNode => {
        return configs.map((inputConfig) => (
          <Handle
            key={inputConfig.id}
            handleType="target"
            position={Position.Left}
            {...config.getInputConfig(inputConfig)}
          />
        ))
      },
      [config],
    )

    // Construct memoized input components based on the node config
    const edges = useNodesEdges(node.id)
    const edgeIds = edges.map((e) => e.id).join()
    const inputConfigs = nodeConfig.inputs ?? []

    // Construct memoized input and output components based on the node config
    const inputs = useMemo(() => {
      return getInputElements(
        inputConfigs.filter((input) => !input.group),
        edges,
      )
    }, [inputConfigs, config, node, edgeIds])

    const outputs = useMemo(() => {
      return (nodeConfig.outputs ?? []).map((output) =>
        getOutputElements(config, output),
      )
    }, [config, node])

    // Input groups are those inputs that should be rendered under a collapsable accordion
    const inputGroups = useMemo(() => {
      const grouped: Record<string, NodeInputConfig[]> = inputConfigs
        .filter((input) => input.group)
        .reduce((acc: Record<string, NodeInputConfig[]>, input) => {
          const group = input.group!
          if (!acc[group]) acc[group] = []
          acc[group].push(input)
          return acc
        }, {})

      return Object.entries(grouped).map(([group, inputs]) => (
        <InputGroup
          label={group}
          key={group}
          handles={getHandlesForInputs(inputs)}
          onPointerDown={onFocus}
        >
          {getInputElements(inputs, edges)}
        </InputGroup>
      ))
    }, [edgeIds])

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
          {inputGroups}
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
          Handle: !inputConfig.isConstant
            ? () => (
                <Handle
                  handleType="target"
                  position={Position.Left}
                  {...inputConfig}
                />
              )
            : undefined,
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
