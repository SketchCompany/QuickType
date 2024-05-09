import { Expr, Stmt } from "./ast"
import Environment from "./environment"

export type ValueType = "null" | "number" | "string" | "boolean" | "object" | "nativeFn" | "function" | "member" | "if"

export interface RuntimeValue {
    type: ValueType
}

export interface NullValue extends RuntimeValue {
    type: "null"
    value: null
}

export function create_null(){
    return {type: "null", value: null} as NullValue
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean"
    value: boolean
}

export function create_bool(value = true){
    return {type: "boolean", value} as BooleanValue
}

export interface NumberValue extends RuntimeValue {
    type: "number"
    value: number
}

export function create_number(value = 0){
    return {type: "number", value} as NumberValue
}

export interface StringValue extends RuntimeValue {
    type: "string"
    value: string
}

export function create_string(value = ""){
    return {type: "string", value} as StringValue
}

export interface ObjectValue extends RuntimeValue {
    type: "object"
    properties: Map<string, RuntimeValue>
}

export type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue

export interface NativeFnValue extends RuntimeValue {
    type: "nativeFn"
    call: FunctionCall
}

export function create_nativeFn(call: FunctionCall){
    return { type: "nativeFn", call} as NativeFnValue
}

export interface FunctionValue extends RuntimeValue {
    type: "function"
    name: string,
    parameters: string[]
    declarationEnv: Environment
    body: Stmt[]
}