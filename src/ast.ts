import { Token } from "./lexer"

export type NodeType = 
  // statements
  | "Program"
  | "VarDeclaration"
  | "FunctionDeclaration"
  | "IfDeclaration"
  | "WhileDeclaration"

  // expressions
  | "AssignmentExpr"
  | "MemberExpr"
  | "CallExpr"

  // literals
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "StringLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "ArrayLiteral"
  | "ImportLiteral"
  | "HTMLLiteral"


export interface Stmt{
  kind: NodeType
}

export interface Program extends Stmt{
  kind: NodeType
  body: Stmt[]
}

export interface VarDeclaration extends Stmt{
  kind: "VarDeclaration"
  constant: boolean
  identifier: string
  value?: Expr
}

export interface FunctionDeclaration extends Stmt{
  kind: "FunctionDeclaration"
  parameters: string[]
  name: string
  body: Stmt[]
}

export interface Expr extends Stmt{}

export interface BinaryExpr extends Expr{
  kind: "BinaryExpr"
  left: Expr
  right: Expr
  operator: Token
}

export interface CallExpr extends Expr{
  kind: "CallExpr"
  args: Expr[]
  caller: Expr
}

export interface MemberExpr extends Expr{
  kind: "MemberExpr"
  object: Expr,
  property: Expr,
  computed: boolean
}

export interface Identifier extends Expr{
  kind: "Identifier"
  symbol: string
}

export interface NumericLiteral extends Expr{
  kind: "NumericLiteral"
  value: number
}

export interface StringLiteral extends Expr{
  kind: "StringLiteral"
  value: string
}

export interface AssignmentExpr extends Expr{
  kind: "AssignmentExpr"
  assigne: Expr
  value: Expr
}

export interface Property extends Expr{
  kind: "Property"
  key: string
  value?: Expr
}

export interface ObjectLiteral extends Expr{
  kind: "ObjectLiteral"
  properties: Property[]  
}

export interface IfDeclaration extends Expr{
  kind: "IfDeclaration"
  condition: BinaryExpr
  body: Stmt[]
  elseIfDeclaration?: IfDeclaration
  elseBody?: Stmt[]
}

export interface ArrayLiteral extends Expr{
  kind: "ArrayLiteral"
  elements: Expr[]
}

export interface ImportLiteral extends Expr{
  kind: "ImportLiteral"
  name: StringLiteral,
  program: Program
}

export interface HTMLLiteral extends Expr{
  kind: "HTMLLiteral"
  html: string
}