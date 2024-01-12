import { CSSProperties, JSXElementConstructor } from 'react'
import { buildNode } from './node-types'

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
   * Groups of nodes that can be used to organize the node palette. Also allows styling
   * and configuring the colors of the nodes as a group.
   */
  nodeGroups: NodeGroupTypes

  /**
   * The nodes types that are registered and can be created in the graph
   */
  nodes: NodeTypes
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

export type NodeGroupTypes = {
  [key: string]: NodeGroupConfig
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
}

export interface ValueTypeConfigOptions extends ValueTypeConfigBase {
  inputType: 'options' | 'buttonGroup'
  options: Option[]
  defaultValue: Option['value'] // Ensures defaultValue is one of the option values
}

interface ValueTypeConfigValue extends ValueTypeConfigBase {
  inputType: 'value'
  defaultValue: string // Ensures defaultValue is a string
}

interface ValueTypeConfigCheckbox extends ValueTypeConfigBase {
  inputType: 'checkbox'
  defaultValue: boolean // Ensures defaultValue is a boolean
}

interface ValueTypeConfigNoInput extends ValueTypeConfigBase {
  inputType: null | undefined
}

export type ValueTypeConfig =
  | ValueTypeConfigOptions
  | ValueTypeConfigValue
  | ValueTypeConfigCheckbox
  | ValueTypeConfigNoInput

export interface Option {
  name: string
  value: string
}

interface NodeGroupConfig {
  name: string
  color: string
}

export interface NodeConfig {
  group: keyof IGraphConfig['nodeGroups']
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
  identifier: string
  valueType: keyof ValueTypes
  isArray?: boolean
  defaultValue?: any
  isConstant?: boolean
}

export interface NodeOutputConfig {
  name: string
  identifier: string
  valueType: string
  array?: boolean
}

function isValueTypeConfigOptions(
  config: ValueTypeConfig,
): config is ValueTypeConfigOptions {
  return config.inputType === 'options' || config.inputType === 'buttonGroup'
}

function isValueTypeConfigValue(
  config: ValueTypeConfig,
): config is ValueTypeConfigValue {
  return config.inputType === 'value'
}

function isValueTypeConfigCheckbox(
  config: ValueTypeConfig,
): config is ValueTypeConfigCheckbox {
  return config.inputType === 'checkbox'
}

type WithType<T, K> = T & {
  type: K
}

export class GraphConfig {
  readonly valueTypes: ValueTypes = {}
  readonly keybindings: KeyBindings
  readonly nodeGroups: {
    [key: string]: NodeGroupConfig
  } = {}
  private readonly nodes: {
    [key: string]: NodeConfig
  } = {}
  private customNodes: {
    [key: string]: JSXElementConstructor<any>
  } = {}

  constructor(props?: Partial<IGraphConfig>) {
    this.keybindings = {
      save: ['meta+s'],
      copy: ['meta+c'],
      paste: ['meta+v'],
      delete: ['x', 'backspace'],
      ...props?.keybindings,
    }
    this.valueTypes = props?.valueTypes ?? this.valueTypes
    this.nodeGroups = props?.nodeGroups ?? this.nodeGroups
    this.nodes = props?.nodes ?? this.nodes
  }

  validate(): GraphConfig {
    const errors: string[] = []
    Object.values(this.nodes).forEach((node) => {
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
    group: string,
    node: JSXElementConstructor<T>,
    inputs: NodeInputConfig[],
    outputs: NodeOutputConfig[],
  ) {
    this.customNodes[type] = node
    this.nodes[type] = {
      group,
      name,
      inputs: inputs,
      outputs: outputs,
      custom: true,
    }
    this.validate()
  }

  customNode<T>(type: string): JSXElementConstructor<T> {
    return this.customNodes[type]
  }

  nodeConfigs(): WithType<NodeConfig, string>[] {
    return Object.entries(this.nodes).map(([type, value]) => ({
      ...value,
      type,
    }))
  }

  getNodeConfig(type: string): NodeConfig {
    return this.nodes[type]
  }

  nodeConfigsByGroup(group: string): NodeConfig[] {
    return Object.values(this.nodes).filter((n) => n.group === group)
  }

  nodeGroupConfigs(): WithType<NodeGroupConfig, string>[] {
    return Object.entries(this.nodeGroups).map(([type, value]) => ({
      ...value,
      type,
    }))
  }

  nodeGroupConfig<T extends keyof this['nodeGroups']>(
    nodeType: T,
  ): NodeGroupConfig {
    return this.nodeGroups[nodeType as keyof NodeGroupTypes]
  }

  valueType<T extends keyof this['valueTypes']>(type: T): ValueTypeConfig {
    const config = this.valueTypes[type as keyof ValueTypes]
    if (config == null) console.log(type, config)
    if (isValueTypeConfigOptions(config)) {
      return config as ValueTypeConfigOptions
    } else if (isValueTypeConfigValue(config)) {
      return config as ValueTypeConfigValue
    } else if (isValueTypeConfigCheckbox(config)) {
      return config as ValueTypeConfigCheckbox
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

  getNodeComponents(): Record<string, JSXElementConstructor<any>> {
    return Object.entries(this.nodes)
      .map(([type, node]): [string, JSXElementConstructor<any>] => {
        if (node.custom) {
          console.log('returning custom node')
          return [type, this.customNode(type)]
        } else {
          return [type, buildNode(node)]
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
