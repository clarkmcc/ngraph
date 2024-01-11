import { ExampleNodeGraphEditor } from './NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { IGraphConfig } from './config'

const simpleConfig: IGraphConfig = {
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
          identifier: 'value',
          valueType: 'string',
        },
      ],
      outputs: [
        {
          name: 'Value',
          identifier: 'value',
          valueType: 'string',
        },
      ],
    },
  },
}

const meta = {
  title: 'Node Graph Editor',
  component: ExampleNodeGraphEditor,
  decorators: (Story) => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Story />
    </div>
  ),
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleNodeGraphEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Simple: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'string',
        position: { x: 100, y: 100 },
        data: { label: 'Input Node' },
      },
      {
        id: '2',
        type: 'string',
        position: { x: 400, y: 200 },
        data: { label: 'Output Node' },
      },
    ],
    edges: [
      {
        id: 'e1',
        source: '1',
        sourceHandle: 'value',
        target: '2',
        targetHandle: 'value',
        data: {
          targetHandleType: 'string',
        },
      },
    ],
    config: simpleConfig,
  },
}

export const InputFields: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'inputFields',
        position: { x: 100, y: 100 },
        data: { label: 'Input Node' },
      },
    ],
    edges: [],
    config: {
      valueTypes: {
        string: {
          name: 'String',
          color: '#a1a1a1',
          inputType: 'value',
          defaultValue: '',
        },
        httpMethod: {
          name: 'HTTP Method',
          color: '#06b6d4',
          inputType: 'options',
          options: [
            { name: 'GET', value: 'GET' },
            { name: 'POST', value: 'POST' },
            { name: 'PUT', value: 'PUT' },
            { name: 'DELETE', value: 'DELETE' },
          ],
          defaultValue: 'GET',
        },

        httpProtocol: {
          name: 'HTTP Method',
          color: '#0284c7',
          inputType: 'buttonGroup',
          options: [
            { name: 'HTTP', value: 'HTTP' },
            { name: 'HTTPS', value: 'HTTPS' },
          ],
          defaultValue: 'HTTP',
        },
      },
      nodeGroups: {
        default: {
          name: 'Default',
          color: '#0284c7',
        },
      },
      nodes: {
        inputFields: {
          group: 'default',
          name: 'Input Fields',
          inputs: [
            {
              name: 'Value',
              identifier: 'value',
              valueType: 'string',
            },
            {
              name: 'Options',
              identifier: 'options',
              valueType: 'httpMethod',
            },
            {
              name: 'Button Group',
              identifier: 'buttonGroup',
              valueType: 'httpProtocol',
            },
          ],
          outputs: [
            {
              name: 'Value',
              identifier: 'value',
              valueType: 'string',
            },
          ],
        },
      },
    },
  },
}
