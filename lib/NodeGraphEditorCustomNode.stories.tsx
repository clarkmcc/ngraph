import { NodeGraphEditor } from './NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { GraphConfigProvider } from './context/GraphConfigContext'
import { GraphConfig } from './config'
import { useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  Position,
} from '@xyflow/react'
import { NodeContainer } from './components/NodeContainer'
import { useFocusBlur } from './hooks/focus'
import { Handle } from './components/Handle'

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    function CustomNode(node: Node) {
      const [isFocused, onFocus, onBlur] = useFocusBlur()
      return (
        <NodeContainer node={node} draggable={isFocused}>
          <div>
            <textarea
              defaultValue="This is a text area"
              style={{ backgroundColor: 'gray' }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <Handle
              id="value"
              position={Position.Right}
              handleType="source"
              shape="circle"
              color="#a1a1a1"
            />
          </div>
        </NodeContainer>
      )
    }

    const config = useMemo(() => {
      const config = new GraphConfig({
        valueTypes: {
          string: {
            name: 'String',
            color: '#f43f5e',
            shape: 'circle',
            inputType: 'value',
            defaultValue: '',
          },
        },
        nodeGroups: {
          custom: {
            name: 'Custom',
            color: '#f43f5e',
          },
        },
      })
      config.registerCustomNode(
        'My Custom Node',
        'my-custom-node',
        'custom',
        CustomNode,
        [],
        [{ name: 'Value', id: 'value', valueType: 'string' }],
      )
      return config.validate()
    }, [])
    return (
      <GraphConfigProvider defaultConfig={config}>
        <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges}>
          <Background color="#52525b" variant={BackgroundVariant.Dots} />
        </NodeGraphEditor>
      </GraphConfigProvider>
    )
  },
  decorators: (Story) => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Story />
    </div>
  ),
  tags: ['autodocs'],
} satisfies Meta<{ nodes: Node[]; edges: Edge[] }>

export default meta

type Story = StoryObj<typeof meta>

export const CustomNode: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'my-custom-node',
        position: { x: 100, y: 100 },
        data: {},
      },
    ],
    edges: [],
  },
}
