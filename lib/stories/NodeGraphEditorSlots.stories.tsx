import { NodeGraphEditor } from '../NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { Background, BackgroundVariant, Edge, Node } from '@xyflow/react'
import { useBuildGraphConfig } from '../hooks/config.ts'
import { NodeHeaderProps } from '../components/NodeHeader.tsx'

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    function CustomNodeHeader({ defaultTitle }: NodeHeaderProps) {
      return (
        <div className="bg-white text-black text-sm rounded-t text-center">
          {defaultTitle}
        </div>
      )
    }

    const config = useBuildGraphConfig({
      valueTypes: {
        string: {
          name: 'String',
          color: '#a1a1a1',
          inputEditor: 'value',
          defaultValue: '',
        },
      },
      nodeKinds: {
        default: {
          name: 'Default',
          color: '#a1a1a1',
        },
      },
      nodeTypes: {
        customHeaderNode: {
          kind: 'default',
          name: 'Custom Header Node',
          inputs: [
            {
              name: 'Value',
              id: 'value',
              valueType: 'string',
            },
          ],
          outputs: [
            {
              name: 'Value',
              id: 'value',
              valueType: 'string',
            },
          ],
        },
      },
    })
    return (
      <NodeGraphEditor
        config={config}
        slots={{
          header: CustomNodeHeader,
        }}
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

export const Slots: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'customHeaderNode',
        position: { x: 100, y: 100 },
        data: {},
      },
    ],
    edges: [],
  },
}
