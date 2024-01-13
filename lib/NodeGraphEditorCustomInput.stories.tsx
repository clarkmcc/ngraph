import { NodeGraphEditor } from './NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { GraphConfigProvider } from './context/GraphConfigContext'
import { Edge, Node } from 'reactflow'
import { useBuildGraphConfig } from './hooks/config.ts'
import { NodeInputField } from './components/NodeInputField.tsx'
import { InputElementConfig } from './config.ts'

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    function CustomInput(config: InputElementConfig) {
      return (
        <>
          <NodeInputField {...config} name="X" identifier="x" />
          <NodeInputField {...config} name="Y" identifier="y" />
          <NodeInputField {...config} name="Z" identifier="z" />
        </>
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
                isConstant: true,
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
        <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges} />
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
