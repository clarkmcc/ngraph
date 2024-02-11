import { CSSProperties, JSXElementConstructor } from 'react'
import {
  BaseInputProps,
  getBuiltinInputs,
  InputSlots,
} from './components/inputs.ts'

export const ANY = '__any'

export interface IGraphConfig {
  /**
   * Keybindings for the graph editor
   */
  keybindings?: KeyBindings

  /**
   * Configures the different types of values supported by the node inputs and outputs
   */
  valueTypes: ValueTypes

  /**
   * Groups of nodes that can be used to organize the node palette, allowing styling
   * and configuring the colors of the nodes as a group.
   */
  nodeKinds: NodeKindTypes

  /**
   * The nodes types that are registered and can be created in the graph
   */
  nodeTypes: NodeTypes
}

export type KeyBindings = {
  save: string[]
  copy: string[]
  paste: string[]
  delete: string[]
}

export type ValueTypes = {
  [key: string]: ValueTypeConfig
}

export type NodeKindTypes = {
  [name: string]: NodeKindConfig
}

export type NodeTypes = {
  [key: string]: NodeConfig
}

/**
 * The different types of values that can be used for node inputs and outputs.
 */
interface ValueTypeConfigBase {
  name: string
  color: string
  /**
   * The shape to use for the input/output handle attached to the node.
   */
  shape?: 'diamond' | 'diamondDot' | 'circle'
  /**
   * Indicates that this is a custom input element and should not be rendered using
   * the config-based rendering system
   */
  custom?: boolean
}

export interface ValueTypeConfigOptions extends ValueTypeConfigBase {
  inputEditor: 'options' | 'buttonGroup'
  options: Option[]
  defaultValue: Option['value'] // Ensures defaultValue is one of the option values
}

interface ValueTypeConfigText extends ValueTypeConfigBase {
  inputEditor: 'text' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'url' | 'email' | 'tel' | 'password' | 'search' | 'color' | 'email'
  defaultValue: string // Ensures defaultValue is a string
}

interface ValueTypeConfigNumber extends ValueTypeConfigBase {
  inputEditor: 'number' | 'range' | 'decimal'
  defaultValue: number
}

interface ValueTypeConfigCheckbox extends ValueTypeConfigBase {
  inputEditor: 'checkbox'
  defaultValue: boolean // Ensures defaultValue is a boolean
}

interface ValueTypeConfigCustom extends ValueTypeConfigBase {
  inputEditor: string
}

interface ValueTypeConfigNoInput extends ValueTypeConfigBase {
  inputEditor: null | undefined
}

export type ValueTypeConfig =
  | ValueTypeConfigOptions
  | ValueTypeConfigText
  | ValueTypeConfigNumber
  | ValueTypeConfigCheckbox
  | ValueTypeConfigNoInput
  | ValueTypeConfigCustom

export interface Option {
  name: string
  value: string
}

export interface NodeKindConfig {
  name: string
  color: string
}

export interface NodeConfig {
  kind: keyof IGraphConfig['nodeKinds']
  name: string
  inputs?: NodeInputConfig[]
  outputs?: NodeOutputConfig[]
  /**
   * These styles are applied to the node's div element. This can be used to
   * configure node widths, background, etc.
   */
  style?: CSSProperties
  /**
   * Node is a custom node and should not be rendered using the config-based
   * rendering system
   */
  custom?: boolean
}

export interface NodeInputConfig {
  name: string
  id: string
  valueType: Extract<keyof ValueTypes, string>
  isArray?: boolean
  defaultValue?: any
  isConstant?: boolean
  /**
   * The group that this input belongs to. When specified, this input and
   * any other inputs with this group name will be rendered under a collapsable
   * accordion.
   */
  inputGroup?: string
}

export interface NodeOutputConfig {
  name: string
  id: string
  valueType: string
  isArray?: boolean
}

function isValueTypeConfigOptions(
  config: ValueTypeConfig,
): config is ValueTypeConfigOptions {
  return (
    config.inputEditor === 'options' || config.inputEditor === 'buttonGroup'
  )
}

type WithType<T, K> = T & {
  type: K
}

export type InputProps = BaseInputProps & NodeInputConfig & ValueTypeConfig

export class GraphConfig {
  readonly valueTypes: ValueTypes = {}
  readonly keybindings: KeyBindings
  readonly nodeKinds: {
    [key: string]: NodeKindConfig
  } = {}
  private readonly nodeTypes: {
    [key: string]: NodeConfig
  } = {}
  private customNodes: {
    [key: string]: JSXElementConstructor<any>
  } = {}
  private inputs: {
    [key: string]: JSXElementConstructor<any>
  } = {}

  constructor(props?: Partial<IGraphConfig>) {
    this.keybindings = {
      save: ['meta+s'],
      copy: ['meta+c'],
      paste: ['meta+v'],
      delete: ['x', 'Backspace', 'Delete'],
      ...props?.keybindings,
    }
    this.valueTypes = props?.valueTypes ?? this.valueTypes
    this.valueTypes[ANY] = {
      name: 'Any',
      color: '#a1a1a1',
      inputEditor: null,
    }
    this.nodeKinds = props?.nodeKinds ?? this.nodeKinds
    this.nodeTypes = props?.nodeTypes ?? this.nodeTypes
    for (const [key, value] of Object.entries(getBuiltinInputs())) {
      this.inputs[key] = value
    }
  }

  validate(): GraphConfig {
    const errors: string[] = []
    Object.values(this.nodeTypes).forEach((node) => {
      if (node.inputs) {
        node.inputs.forEach((input) => {
          if (!this.valueTypes[input.valueType]) {
            errors.push(
              `Node '${node.name}' has an input that references non-existent value type '${input.valueType}'`,
            )
          }
        })
      }
      if (node.outputs) {
        node.outputs.forEach((output) => {
          if (!this.valueTypes[output.valueType]) {
            errors.push(
              `Node '${node.name}' has an output that references non-existent value type '${output.valueType}'`,
            )
          }
        })
      }
    })
    if (errors.length > 0) {
      throw new Error(errors.join('\n'))
    }
    return this
  }

  registerCustomNode<T>(
    name: string,
    type: string,
    kind: string,
    node: JSXElementConstructor<T>,
    inputs: NodeInputConfig[],
    outputs: NodeOutputConfig[],
  ) {
    this.customNodes[type] = node
    this.nodeTypes[type] = {
      kind,
      name,
      inputs: inputs,
      outputs: outputs,
      custom: true,
    }
    this.validate()
  }

  registerInput(
    type: string,
    input: JSXElementConstructor<InputProps>,
    valueType: Omit<ValueTypeConfig, 'inputEditor'>,
  ) {
    this.inputs[type] = input
    this.valueTypes[type] = {
      ...valueType,
      inputEditor: type,
    }
    this.validate()
  }

  customNode<T>(type: string): JSXElementConstructor<T> {
    return this.customNodes[type]
  }

  /**
   * Accepts a value type and returns the input component that should be used to
   * render the input for that value type.
   * @param valueType
   */
  getInputComponent(
    valueType: string,
  ): JSXElementConstructor<InputProps & { slots?: InputSlots }> | null {
    const inputEditor = this.valueTypes[valueType]?.inputEditor
    if (inputEditor == null) return null
    return this.inputs[inputEditor]
  }

  nodeConfigs(): WithType<NodeConfig, string>[] {
    return Object.entries(this.nodeTypes).map(([type, value]) => ({
      ...value,
      type,
    }))
  }

  getNodeConfig(type: string): NodeConfig {
    return this.nodeTypes[type]
  }

  nodeConfigsByKind(kind: string): WithType<NodeConfig, string>[] {
    return Object.entries(this.nodeTypes)
      .map(([type, n]) => ({ type, ...n }))
      .filter((n) => n.kind === kind)
  }

  nodeKindConfigs(): WithType<NodeKindConfig, string>[] {
    return Object.entries(this.nodeKinds).map(([type, value]) => ({
      ...value,
      type,
    }))
  }

  getRegisteredNodeTypes() {
    return Object.entries(this.nodeKinds).map(([type, kind]) => ({
      type,
      name: kind.name,
      nodes: this.nodeConfigsByKind(type).map((node) => ({
        type: node.type,
        name: node.name,
      })),
    }))
  }

  getNodeKindConfig<T extends keyof this['nodeKinds']>(
    nodeType: T,
  ): NodeKindConfig {
    return this.nodeKinds[nodeType as keyof NodeKindTypes]
  }

  valueType<T extends keyof this['valueTypes']>(type: T): ValueTypeConfig {
    const config = this.valueTypes[type as Extract<keyof ValueTypes, string>]
    if (config == null)
      console.error(
        `No value type config for '${String(type)}'. Registered value types:`,
        this.valueTypes,
      )
    if (isValueTypeConfigOptions(config)) {
      return config as ValueTypeConfig
    }
    return config
  }

  getInputConfig(input: NodeInputConfig): NodeInputConfig & ValueTypeConfig {
    return {
      ...this.valueType(input.valueType),
      ...input,
    }
  }

  getOutputConfig(
    output: NodeOutputConfig,
  ): NodeOutputConfig & ValueTypeConfig {
    return {
      ...this.valueType(output.valueType),
      ...output,
    }
  }

  getNodeComponents(
    buildNode: (
      config: GraphConfig,
      node: NodeConfig,
    ) => JSXElementConstructor<any>,
  ): Record<string, JSXElementConstructor<any>> {
    return Object.entries(this.nodeTypes)
      .map(([type, node]): [string, JSXElementConstructor<any>] => {
        if (node.custom) {
          return [type, this.customNode(type)]
        } else {
          return [type, buildNode(this, node)]
        }
      })
      .reduce(
        (acc: Record<string, JSXElementConstructor<any>>, [type, node]) => {
          acc[type] = node
          return acc
        },
        {},
      )
  }
}
