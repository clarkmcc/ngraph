import { NodeGraphEditor } from '../NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
} from '@xyflow/react'
import { useBuildGraphConfig } from '../hooks/config.ts'
import { InputProps } from '../config.ts'
import { Wheel } from '@uiw/react-color'
import { useNodeFieldValue } from '../hooks/node.ts'
import { DagreLayoutEngine } from '../layout/dagre.ts'

const darge = new DagreLayoutEngine()

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
            color: '#a1a1a1',
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
            defaultValue: 'GET',
          },
        },
        nodeGroups: {
          default: {
            name: 'Default',
            color: '#CE4040',
          },
          inputs: {
            name: 'Inputs',
            color: '#83324A',
          },
        },
        nodes: {
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
        },
      },
      (config) => {
        config.registerInput('color', ColorPicker, {
          name: 'Color',
          color: '#C7C728',
        })
      },
    )
    return (
      <NodeGraphEditor
        config={config}
        defaultNodes={nodes}
        defaultEdges={edges}
        layoutEngine={darge}
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

export const InputGroups: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'bsdf',
        // position: { x: 350, y: 100 },
        data: {
          __inputGroupsExpanded: ['Specular'],
        },
      },
      {
        id: '2',
        type: 'number',
        position: { x: 100, y: 100 },
        data: {},
      },
      {
        id: '3',
        type: 'number',
        position: { x: 100, y: 200 },
        data: {},
      },
      {
        id: '4',
        type: 'color',
        position: { x: 100, y: 300 },
        data: {},
      },
    ] as Node[],
    edges: [
      {
        id: 'e1',
        source: '3',
        sourceHandle: 'value',
        target: '1',
        targetHandle: 'strength',
      },
      {
        id: 'e2',
        source: '2',
        sourceHandle: 'value',
        target: '1',
        targetHandle: 'anisotropicRotation',
      },
      {
        id: 'e3',
        source: '3',
        sourceHandle: 'value',
        target: '1',
        targetHandle: 'anisotropic',
      },
      {
        id: 'e4',
        source: '4',
        sourceHandle: 'color',
        target: '1',
        targetHandle: 'tint',
      },
    ],
  },
}
