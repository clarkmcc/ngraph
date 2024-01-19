import { NodeGraphHandle } from '../NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { ExampleNodeGraphEditor } from './ExampleNodeGraphEditor.tsx'

const meta = {
  title: 'Node Graph Editor',
  component: ({ config, nodes, edges }) => {
    const ref = useRef<NodeGraphHandle>(null)
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <button
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
          onClick={() => ref.current!.layout()}
        >
          Save
        </button>
        <button
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
          onClick={() => ref.current!.layout()}
        >
          Load
        </button>
        <ExampleNodeGraphEditor
          ref={ref}
          config={config}
          nodes={nodes}
          edges={edges}
        />
      </div>
    )
  },
  decorators: (Story) => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Story />
    </div>
  ),
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleNodeGraphEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Persist: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [],
    edges: [],
    config: {
      valueTypes: {
        string: {
          name: 'String',
          color: '#a1a1a1',
          inputType: 'value',
          defaultValue: '',
        },
      },
      nodeGroups: {
        default: {
          name: 'Default',
          color: '#a1a1a1',
        },
      },
      nodes: {
        string: {
          group: 'default',
          name: 'String',
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
    },
  },
}
