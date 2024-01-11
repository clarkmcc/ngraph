import { NodeInputConfig, ValueTypeConfig } from '../config'
import { CSSProperties, memo, useCallback, useRef } from 'react'
import {
  Connection,
  HandleType,
  Position,
  useStoreApi,
  Handle as FlowHandle,
} from 'reactflow'
import { useGraphConfig } from '../context/GraphConfigContext'

type HandleProps = Pick<NodeInputConfig, 'array' | 'identifier'> &
  Pick<ValueTypeConfig, 'shape' | 'color'> & {
    style?: CSSProperties
    position: Position
    handleType: HandleType
  }

const SIZE = 8

export const Handle = memo(({ style, ...props }: HandleProps) => {
  const [config] = useGraphConfig()
  const ref = useRef<HTMLDivElement>(null)

  const width = SIZE
  const height = props.array ? SIZE * 1.8 : SIZE

  const api = useStoreApi()

  const isValidConnection = useCallback((connection: Connection) => {
    const sourceNodeType = api.getState().nodeInternals.get(connection.source!)
      ?.type
    const targetNodeType = api.getState().nodeInternals.get(connection.target!)
      ?.type

    const sourceNodeConfig = config.getNodeConfig(sourceNodeType!)
    const targetNodeConfig = config.getNodeConfig(targetNodeType!)

    // safety: should always have an output if there's a source node
    const sourceOutputConfig = sourceNodeConfig.outputs!.find(
      (v) => v.identifier === connection.sourceHandle,
    )
    // safety: should always have an input if there's this function is firing
    const targetInputConfig = targetNodeConfig.inputs!.find(
      (v) => v.identifier === connection.targetHandle,
    )
    if (!sourceOutputConfig || !targetInputConfig) {
      return true // allow connections where we can't verify the types
    }

    if (
      targetInputConfig.valueType !== 'any' &&
      sourceOutputConfig.valueType !== 'any'
    ) {
      return sourceOutputConfig.valueType === targetInputConfig.valueType
    } else {
      return true
    }
  }, [])

  const shapeStyle =
    props.shape === 'diamond'
      ? { borderRadius: 0, transform: 'rotate(45deg)', top: 8 }
      : {}

  return (
    <div
      className={`react-flow__handle-${props.position}`}
      style={{
        width: width * 2,
        height: height * 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: props.position === Position.Left ? -8 : undefined,
        right: props.position === Position.Right ? -8 : undefined,
        zIndex: 1000000,
      }}
    >
      <div
        style={{
          borderRadius: '5px',
          ...style,
          ...shapeStyle,
          width,
          height,
          border: '1px solid #0f1010',
          background: props.color,
        }}
      />
      <FlowHandle
        ref={ref}
        id={props.identifier}
        isValidConnection={isValidConnection}
        style={{
          border: 'none',
          background: 'transparent',
          width: width * 2,
          height: height * 2,
          // right: 0,
          // left: 0,
        }}
        type={props.handleType}
        position={props.position}
      />
    </div>
  )
})
