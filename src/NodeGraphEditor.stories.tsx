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
        boolean: {
          name: 'Boolean',
          color: '#a1a1a1',
          inputType: 'checkbox',
          defaultValue: true,
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
              name: 'Constant',
              identifier: 'constant',
              valueType: 'string',
              isConstant: true,
            },
            {
              name: 'Array',
              identifier: 'array',
              valueType: 'string',
              array: true,
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
            {
              name: 'Checkbox',
              identifier: 'checkbox',
              valueType: 'boolean',
            },
          ],
        },
      },
    },
  },
}

export const SelectedEdgeHighlighting: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'combineXYZ',
        position: { x: 100, y: 100 },
        data: { label: 'Combine XYZ' },
        selected: true,
      },
      {
        id: '2',
        type: 'points',
        position: { x: 400, y: 200 },
        data: { label: 'Points' },
      },
      {
        id: '3',
        type: 'viewer',
        position: { x: 700, y: 100 },
        data: { label: 'Viewer 1' },
      },
      {
        id: '4',
        type: 'viewer',
        position: { x: 700, y: 300 },
        data: { label: 'Viewer 2' },
      },
    ],
    edges: [
      {
        id: 'e1',
        source: '1',
        sourceHandle: 'vector',
        target: '2',
        targetHandle: 'position',
        data: {
          targetHandleType: 'vector',
        },
      },
      {
        id: 'e2',
        source: '2',
        sourceHandle: 'geometry',
        target: '3',
        targetHandle: 'geometry',
        data: {
          targetHandleType: 'geometry',
        },
      },
      {
        id: 'e3',
        source: '2',
        sourceHandle: 'geometry',
        target: '4',
        targetHandle: 'geometry',
        data: {
          targetHandleType: 'geometry',
        },
      },
    ],
    config: {
      valueTypes: {
        number: {
          name: 'Number',
          color: '#a1a1a1',
          inputType: 'value',
          defaultValue: '0',
        },
        vector: {
          name: 'Vector',
          color: '#8b5cf6',
          inputType: null,
        },
        geometry: {
          name: 'Geometry',
          color: '#059669',
          inputType: null,
        },
      },
      nodeGroups: {
        geometry: {
          name: 'Geometry',
          color: '#059669',
        },
      },
      nodes: {
        combineXYZ: {
          group: 'geometry',
          name: 'Combine XYZ',
          inputs: [
            {
              name: 'X',
              identifier: 'x',
              valueType: 'number',
            },
            {
              name: 'Y',
              identifier: 'y',
              valueType: 'number',
            },
            {
              name: 'Z',
              identifier: 'z',
              valueType: 'number',
            },
          ],
          outputs: [
            {
              name: 'Vector',
              identifier: 'vector',
              valueType: 'vector',
            },
          ],
        },
        points: {
          group: 'geometry',
          name: 'Points',
          inputs: [
            {
              name: 'Count',
              identifier: 'count',
              valueType: 'number',
            },
            {
              name: 'Radius',
              identifier: 'radius',
              valueType: 'number',
            },
            {
              name: 'Position',
              identifier: 'position',
              valueType: 'vector',
            },
          ],
          outputs: [
            {
              name: 'Geometry',
              identifier: 'geometry',
              valueType: 'geometry',
            },
          ],
        },
        viewer: {
          group: 'geometry',
          name: 'Viewer',
          inputs: [
            {
              name: 'Geometry',
              identifier: 'geometry',
              valueType: 'geometry',
            },
          ],
        },
      },
    },
  },
}

export const ArrayInputs: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodes: [
      {
        id: '1',
        type: 'combineXYZ',
        position: { x: 100, y: 100 },
        data: { label: 'Combine XYZ' },
      },
      {
        id: '2',
        type: 'combineXYZ',
        position: { x: 100, y: 300 },
        data: { label: 'Combine XYZ' },
      },
      {
        id: '3',
        type: 'viewer',
        position: { x: 400, y: 100 },
        data: { label: 'Viewer' },
      },
    ],
    edges: [
      {
        id: 'e1',
        source: '1',
        sourceHandle: 'vector',
        target: '3',
        targetHandle: 'vectors',
        data: {
          targetHandleType: 'vector',
        },
      },
      {
        id: 'e2',
        source: '2',
        sourceHandle: 'vector',
        target: '3',
        targetHandle: 'vectors',
        data: {
          targetHandleType: 'vector',
        },
      },
    ],
    config: {
      valueTypes: {
        number: {
          name: 'Number',
          color: '#a1a1a1',
          inputType: 'value',
          defaultValue: '0',
        },
        vector: {
          name: 'Vector',
          color: '#8b5cf6',
          inputType: null,
        },
        geometry: {
          name: 'Geometry',
          color: '#059669',
          inputType: null,
        },
      },
      nodeGroups: {
        geometry: {
          name: 'Geometry',
          color: '#059669',
        },
      },
      nodes: {
        combineXYZ: {
          group: 'geometry',
          name: 'Combine XYZ',
          inputs: [
            {
              name: 'X',
              identifier: 'x',
              valueType: 'number',
            },
            {
              name: 'Y',
              identifier: 'y',
              valueType: 'number',
            },
            {
              name: 'Z',
              identifier: 'z',
              valueType: 'number',
            },
          ],
          outputs: [
            {
              name: 'Vector',
              identifier: 'vector',
              valueType: 'vector',
            },
          ],
        },
        viewer: {
          group: 'geometry',
          name: 'Viewer',
          inputs: [
            {
              name: 'Vectors',
              identifier: 'vectors',
              valueType: 'vector',
              array: true,
            },
          ],
        },
      },
    },
  },
}
