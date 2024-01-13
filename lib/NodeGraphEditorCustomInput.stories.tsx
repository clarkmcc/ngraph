import { NodeGraphEditor } from './NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { GraphConfigProvider } from './context/GraphConfigContext'
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlowProvider,
} from 'reactflow'
import { useBuildGraphConfig } from './hooks/config.ts'
import { NodeInputField } from './components/NodeInputField.tsx'
import { InputProps } from './config.ts'

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    function CustomInput({ slots, ...config }: InputProps) {
      const Handle = slots?.Handle
      return (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {Handle && <Handle />}
          <NodeInputField {...config} name="X" identifier="x" />
          <NodeInputField {...config} name="Y" identifier="y" />
          <NodeInputField {...config} name="Z" identifier="z" />
        </div>
      )
    }

    const config = useBuildGraphConfig(
      {
        valueTypes: {},
        nodeGroups: {
          default: {
            name: 'Default',
            color: '#a1a1a1',
          },
        },
        nodes: {
          vector: {
            group: 'default',
            name: 'Vector',
            inputs: [
              {
                name: 'Value',
                identifier: 'value',
                valueType: 'vector',
              },
            ],
            outputs: [
              {
                name: 'Value',
                identifier: 'value',
                valueType: 'vector',
              },
            ],
          },
        },
      },
      (config) => {
        config.registerInput('vector', CustomInput, {
          name: 'Vector',
          color: '#f43f5e',
          shape: 'diamondDot',
        })
      },
    )
    return (
      <GraphConfigProvider defaultConfig={config}>
        <ReactFlowProvider>
          <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges}>
            <Background color="#52525b" variant={BackgroundVariant.Dots} />
          </NodeGraphEditor>
        </ReactFlowProvider>
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

export const CustomInput: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'vector',
        position: { x: 100, y: 100 },
        data: {},
      },
    ],
    edges: [],
  },
}
