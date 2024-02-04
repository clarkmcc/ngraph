import { ExampleNodeGraphEditor } from './ExampleNodeGraphEditor'
import { NodeGraphHandle } from '../NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { registerLayoutEngine } from '../layout/layout'
import { computeDagreLayout } from '../layout/dagre'

registerLayoutEngine('dagre', computeDagreLayout)

const meta = {
  title: 'Node Graph Editor',
  component: ({ config, nodes, edges }) => {
    const ref = useRef<NodeGraphHandle>(null)
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{position: 'absolute', top: 10, left: 10, zIndex: 1000}}>
          <button
            style={{  }}
            onClick={() => ref.current!.layout('dagre')}
          >
            Dagre Layout
          </button>
        </div>
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

export const DagreLayout: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'string',
        position: randomPosition(100, 700),
        data: {},
      },
      {
        id: '2',
        type: 'string',
        position: randomPosition(100, 700),
        data: {},
      },
      {
        id: '3',
        type: 'string',
        position: randomPosition(100, 700),
        data: {},
      },
      {
        id: '4',
        type: 'string',
        position: randomPosition(100, 700),
        data: {},
      },
      {
        id: '5',
        type: 'string',
        position: randomPosition(100, 700),
        data: {},
      },
      {
        id: '6',
        type: 'string',
        position: randomPosition(100, 700),
        data: {},
      },
    ],
    edges: [
      {
        id: '1',
        source: '1',
        target: '2',
        sourceHandle: 'value',
        targetHandle: 'value',
      },
      {
        id: '2',
        source: '1',
        target: '3',
        sourceHandle: 'value',
        targetHandle: 'value',
      },
      {
        id: '3',
        source: '2',
        target: '4',
        sourceHandle: 'value',
        targetHandle: 'value',
      },
      {
        id: '4',
        source: '3',
        target: '4',
        sourceHandle: 'value',
        targetHandle: 'value',
      },
      {
        id: '5',
        source: '4',
        target: '5',
        sourceHandle: 'value',
        targetHandle: 'value',
      },
      {
        id: '6',
        source: '4',
        target: '6',
        sourceHandle: 'value',
        targetHandle: 'value',
      },
    ],
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

function randomPosition(min: number, max: number) {
  const x = Math.random() * (max - min) + min
  const y = Math.random() * (max - min) + min
  return { x, y }
}
