# Documentation

```mermaid

erDiagram
    NodeType ||--o{ NodeInput : has
    NodeType ||--o{ NodeOutput : has
    NodeType ||--o{ NodeKind : has
    NodeInput ||--|| ValueType : uses
    NodeOutput ||--|| ValueType : uses
    ValueType ||..|| InputEditor : uses
    NodeInput{
        string name
        string id
        ValueType valueType
        boolean isArray
        boolean isConstant
        any defaultValue
        string inputGroup
    }
    NodeOutput{
        string name
        string id
        ValueType valueType
        boolean isArray
    }
    NodeKind{
        string name
        string color
    }
    NodeType{
        string name
        string id
        string description
        NodeInput[] inputs
        NodeOutput[] outputs
        NodeKind kind
    }
    ValueType{
        string name
        string color
        string inputEditor
        any defaultValue
    }
```

## NodeType

A node type describes a kind of node that can put in a graph. It has a name and a list of inputs and outputs that have handles to connect to other nodes via edges.

## NodeInput

A node input is a handle that can be connected to a node output via an edge. 

