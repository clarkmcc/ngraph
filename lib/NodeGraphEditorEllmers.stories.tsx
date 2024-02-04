import { NodeGraphEditor } from './NodeGraphEditor.tsx'
import { Meta, StoryObj } from '@storybook/react'
import { GraphConfigProvider } from './context/GraphConfigContext.tsx'
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
} from '@xyflow/react'
import { useBuildGraphConfig } from './hooks/config.ts'
import { InputProps } from './config.ts'
import { Wheel } from '@uiw/react-color'
import { useNodeFieldValue } from './hooks/node.ts'
import { LayoutEngine } from './layout/layout.ts'

const meta = {
  title: 'Node Graph Editor',
  component: ({ nodes, edges }) => {
    function ColorPicker({ slots, ...config }: InputProps) {
      const [hsva, setHsva] = useNodeFieldValue(config.id, '#f87171')
      const Handle = slots?.Handle
      return (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 12px',
          }}
        >
          {Handle && <Handle />}
          <Wheel
            width={140}
            height={140}
            color={hsva}
            onChange={(color) => setHsva(color.hex)}
            onFocus={config.onFocus}
            onBlur={config.onBlur}
          />
        </div>
      )
    }

    function SubTasks({config, ...props}: any) {
      console.log('subtasks called with ',{config, props})
      const fullconfig = useBuildGraphConfig(config)
      return (
        <GraphConfigProvider defaultConfig={fullconfig}>
          <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges}>
            <Background color="#000000" />
          </NodeGraphEditor>
        </GraphConfigProvider>
      )
    }

    const config = useBuildGraphConfig(
      {
        valueTypes: {
          string: {
            name: 'String',
            color: '#a1a1a1',
            inputType: 'value',
            defaultValue: '',
          },
          number: {
            name: 'Number',
            color: '#ff0000',
            inputType: 'value',
            defaultValue: '0.000',
          },
          boolean: {
            name: 'Boolean',
            color: '#a1a1a1',
            inputType: 'checkbox',
            defaultValue: true,
          },
          specularDistribution: {
            name: 'Specular Distribution',
            color: '#06b6d4',
            inputType: 'options',
            options: [
              { name: 'GGX', value: 'ggx' },
              { name: 'Beckmann', value: 'beckmann' },
              { name: 'Phong', value: 'phong' },
            ],
            defaultValue: 'phong',
          },
        },
        nodeThemes: {
          default: {
            name: 'Default',
            color: '#CE4040',
          },
          inputs: {
            name: 'Inputs',
            color: '#83324A',
          },
        },
        nodeTypes: {
          number: {
            group: 'default',
            name: 'Number',
            inputs: [
              {
                name: 'Value',
                id: 'value',
                valueType: 'number',
                isConstant: true,
              },
            ],
            outputs: [
              {
                name: 'Value',
                id: 'value',
                valueType: 'number',
              },
            ],
          },
          color: {
            group: 'inputs',
            name: 'Color',
            style: {
              width: '100px',
            },
            inputs: [
              {
                name: 'Color',
                id: 'color',
                valueType: 'color',
                isConstant: true,
              },
            ],
            outputs: [
              {
                name: 'Color',
                id: 'color',
                valueType: 'color',
              },
            ],
          },
          outer: {
            group: 'default',
            name: 'Need number',
            inputs: [
              {
                name: 'Something',
                id: 'something',
                valueType: 'number',
              }
            ]},
          bsdf: {
            group: 'default',
            name: 'Principled BSDF',
            inputs: [
              {
                name: 'Metallic',
                id: 'metallic',
                valueType: 'number',
              },
              {
                name: 'Roughness',
                id: 'roughness',
                valueType: 'number',
                defaultValue: '0.550',
              },
              {
                name: 'IOR',
                id: 'ior',
                valueType: 'number',
                defaultValue: '1.450',
              },
              {
                name: 'Alpha',
                id: 'alpha',
                valueType: 'number',
                defaultValue: '1.000',
              },
              {
                name: 'Distribution',
                id: 'distribution',
                group: 'Specular',
                valueType: 'specularDistribution',
              },
              {
                name: 'IOR Level',
                id: 'iorLevel',
                group: 'Specular',
                valueType: 'number',
              },
              {
                name: 'Tint',
                id: 'tint',
                group: 'Specular',
                valueType: 'color',
              },
              {
                name: 'Anisotropic',
                id: 'anisotropic',
                group: 'Specular',
                valueType: 'number',
              },
              {
                name: 'Anisotropic Rotation',
                id: 'anisotropicRotation',
                group: 'Specular',
                valueType: 'number',
              },
              {
                name: 'Strength',
                id: 'strength',
                group: 'Emission',
                valueType: 'number',
              },
            ],
          },
          strategy: {
            group: 'default',
            name: 'Strategy',
            inputs: [],
            outputs: [],
            style: {
              height: '200px',
            },
          },
          
        },
      },
      (config) => {
        config.registerInput('color', ColorPicker, {
          name: 'Color',
          color: '#C7C728',
        });
        config.registerInput('subtasks', SubTasks, {
          name: 'Task list',
          color: '#C7C728',
        })
      },
    )
    return (
      <GraphConfigProvider defaultConfig={config}>
        <NodeGraphEditor defaultNodes={nodes} defaultEdges={edges} layoutEngine={LayoutEngine.PipelineCentered}>
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

export const Ellmers: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '2',
        type: 'group',
        data: {},
        position: { x: 0, y: 200 },
      },
      {
        id: '2.1',
        type: 'number',
        data: {},
        parentNode: '2',
        position: { x: 0, y: 50 },
        connectable: false,
        deletable: false,
        // selectable: false,
        draggable: false,
        dragHandle: false,
        extent: 'parent'
      },
      {
        id: '2.2',
        type: 'outer',
        data: {},
        parentNode: '2',
        position: { x: 0, y: 160 },
        connectable: false,
        deletable: false,
        // selectable: false,
        draggable: false,
        dragHandle: false,
        extent: 'parent'
      },
    ] as Node[],
    edges: [
      {
        id: 'e1',
        source: '2.1',
        sourceHandle: 'number',
        target: '2.2',
        targetHandle: 'number',
        // type: 'smoothstep',
        deletable: false,
        selectable: false,
      }
    ] as Edge[],
  },
}
