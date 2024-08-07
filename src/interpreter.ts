import { ValueType, RuntimeValue, NumberValue, NullValue, create_null, StringValue} from "./values"
import { ArrayLiteral, AssignmentExpr, BinaryExpr, CallExpr, FunctionDeclaration, HTMLLiteral, Identifier, IfDeclaration, ImportLiteral, MemberExpr, NodeType, NumericLiteral, ObjectLiteral, Program, Stmt, StringLiteral, VarDeclaration} from "./ast"
import Environment from "./environment"
import { interpret_assignment, interpret_binary_expr, interpret_call_expr, interpret_identifier, interpret_object_expr, interpret_member_expr, interpret_array, interpret_import, interpret_html } from "./expressions"
import { interpret_program, interpret_var_declaration, interpret_fn_declaration, interpret_if_declaration } from "./statements"

export function interpret(astNode: Stmt, env: Environment): RuntimeValue {

    switch(astNode.kind){
        case "NumericLiteral":
            return {value: ((astNode as NumericLiteral).value), type: "number"} as NumberValue
        case "StringLiteral":
            return {value: ((astNode as StringLiteral).value), type: "string"} as StringValue
        case "Identifier":
            return interpret_identifier(astNode as Identifier, env)
        case "ArrayLiteral":
            return interpret_array(astNode as ArrayLiteral, env)
        case "ImportLiteral":
            return interpret_import(astNode as ImportLiteral, env)
        case "HTMLLiteral":
            return interpret_html(astNode as HTMLLiteral, env)
        case "ObjectLiteral":
            return interpret_object_expr(astNode as ObjectLiteral, env)
        case "CallExpr":
            return interpret_call_expr(astNode as CallExpr, env)
        case "MemberExpr":
            return interpret_member_expr(astNode as MemberExpr, env)
        case "BinaryExpr":
            return interpret_binary_expr(astNode as BinaryExpr, env)
        case "AssignmentExpr":
            return interpret_assignment(astNode as AssignmentExpr, env)
        case "Program":
            return interpret_program(astNode as Program, env)
        case "VarDeclaration":
            return interpret_var_declaration(astNode as VarDeclaration, env)
        case "FunctionDeclaration":
            return interpret_fn_declaration(astNode as FunctionDeclaration, env)
        case "IfDeclaration":
            return interpret_if_declaration(astNode as IfDeclaration, env)
        default:
            console.error("This AST Node has not yet been setup for interpretation: ", astNode)
            throw new Error("This AST Node has not yet been setup for interpretation: " + JSON.stringify(astNode))
    }
}