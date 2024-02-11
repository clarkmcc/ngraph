import { NodeGraphEditor } from '../NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { GraphConfig } from '../config'
import { useMemo } from 'react'
import { Background, BackgroundVariant, Edge, Node } from '@xyflow/react'
import { NodeContainer } from '../components/NodeContainer'
import { NodeInheritingOutputField } from '../components/NodeInheritingOutputField.tsx'

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    function CustomNode(node: Node) {
      return (
        <NodeContainer node={node} draggable>
          <div
            style={{
              padding: '8px 0 12px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NodeInheritingOutputField
              id="value"
              name="Value"
              valueType="any"
            />
          </div>
        </NodeContainer>
      )
    }

    const config = useMemo(() => {
      const config = new GraphConfig({
        valueTypes: {
          text: {
            name: 'String',
            color: '#1895d5',
            inputEditor: 'text',
            defaultValue: '',
          },
          number: {
            name: 'Number',
            color: '#f4bb3f',
            inputEditor: 'number',
            defaultValue: 0,
          },
        },
        nodeKinds: {
          custom: {
            name: 'Custom',
            color: '#f43f5e',
          },
          default: {
            name: 'Default',
            color: '#a1a1a1',
          },
        },
        nodeTypes: {
          example: {
            name: 'Input',
            kind: 'default',
            inputs: [
              {
                name: 'String',
                id: 'string',
                valueType: 'text',
              },
              {
                name: 'Number',
                id: 'number',
                valueType: 'number',
              },
            ],
            outputs: [],
          },
        },
      })
      config.registerCustomNode(
        'My Custom Node',
        'my-custom-node',
        'custom',
        CustomNode,
        [],
        [{ name: 'Value', id: 'value', valueType: 'text' }],
      )
      return config.validate()
    }, [])
    return (
      <NodeGraphEditor
        config={config}
        defaultNodes={nodes}
        defaultEdges={edges}
      >
        <Background color="#52525b" variant={BackgroundVariant.Dots} />
      </NodeGraphEditor>
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

export const InheritingOutputField: Story = {
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
      {
        id: '2',
        type: 'example',
        position: { x: 400, y: 100 },
        data: {},
      },
    ],
    edges: [],
  },
}
