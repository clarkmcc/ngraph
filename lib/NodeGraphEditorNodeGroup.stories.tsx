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

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    const config = useBuildGraphConfig({
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
      nodes: {
        string: {
          name: 'String',
          group: 'custom',
          inputs: [
            {
              id: 'input',
              name: 'Input',
              valueType: 'string',
              group: 'Group',
            },
          ],
          outputs: [],
        },
      },
    })
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

export const NodeGroup: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'string',
        position: { x: 100, y: 100 },
        data: {},
      },
      {
        id: '2',
        type: 'string',
        position: { x: 200, y: 200 },
        data: {},
      },
      {
        id: '3',
        type: 'string',
        position: { x: 300, y: 300 },
        data: {},
      },
    ],
    edges: [],
  },
}
