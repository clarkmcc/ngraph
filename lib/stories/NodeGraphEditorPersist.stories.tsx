import { NodeGraphHandle } from '../NodeGraphEditor'
import { Meta, StoryObj } from '@storybook/react'
import { useRef, useCallback, useEffect } from 'react'
import { ExampleNodeGraphEditor } from './ExampleNodeGraphEditor.tsx'

const meta = {
  title: 'Node Graph Editor',
  component: ({ config, nodes, edges }) => {
    const ref = useRef<NodeGraphHandle>(null)

    const handleSave = useCallback(() => {
      localStorage.setItem('graph', ref.current!.serialize())
    }, [ref])

    const handleLoad = useCallback(() => {
      const item = localStorage.getItem('graph')
      if (item) {
        ref.current!.deserialize(item)
      }
    }, [ref])

    useEffect(() => {
      handleLoad()
    }, [])

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className="absolute top-3 left-3 z-10 space-x-3">
          <button
            className="bg-neutral-500 text-white px-4 rounded hover:bg-neutral-600"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-neutral-500 text-white px-4 rounded hover:bg-neutral-600"
            onClick={handleLoad}
          >
            Load
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

export const Persist: Story = {
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
      },
      {
        id: 'e2',
        source: '2',
        sourceHandle: 'geometry',
        target: '3',
        targetHandle: 'geometry',
      },
      {
        id: 'e3',
        source: '2',
        sourceHandle: 'geometry',
        target: '4',
        targetHandle: 'geometry',
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
      nodeThemes: {
        geometry: {
          name: 'Geometry',
          color: '#059669',
        },
      },
      nodeTypes: {
        combineXYZ: {
          theme: 'geometry',
          name: 'Combine XYZ',
          inputs: [
            {
              name: 'X',
              id: 'x',
              valueType: 'number',
            },
            {
              name: 'Y',
              id: 'y',
              valueType: 'number',
            },
            {
              name: 'Z',
              id: 'z',
              valueType: 'number',
            },
          ],
          outputs: [
            {
              name: 'Vector',
              id: 'vector',
              valueType: 'vector',
            },
          ],
        },
        points: {
          theme: 'geometry',
          name: 'Points',
          inputs: [
            {
              name: 'Count',
              id: 'count',
              valueType: 'number',
            },
            {
              name: 'Radius',
              id: 'radius',
              valueType: 'number',
            },
            {
              name: 'Position',
              id: 'position',
              valueType: 'vector',
            },
          ],
          outputs: [
            {
              name: 'Geometry',
              id: 'geometry',
              valueType: 'geometry',
            },
          ],
        },
        viewer: {
          theme: 'geometry',
          name: 'Viewer',
          inputs: [
            {
              name: 'Geometry',
              id: 'geometry',
              valueType: 'geometry',
            },
          ],
        },
      },
    },
  },
}
