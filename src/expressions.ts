import { ArrayLiteral, AssignmentExpr, BinaryExpr, CallExpr, Expr, HTMLLiteral, Identifier, ImportLiteral, MemberExpr, ObjectLiteral, StringLiteral } from "./ast"
import Environment from "./environment"
import { interpret } from "./interpreter"
import { Token, TokenType } from "./lexer"
import fs from "fs"
import { ArrayValue, BooleanValue, FunctionValue, HTMLValue, ImportValue, NativeFnValue, NumberValue, ObjectValue, RuntimeValue, StringValue, create_nativeFn, create_null } from "./values"



export function interpret_binary_expr(binop: BinaryExpr, env: Environment): RuntimeValue{
    const lhs = interpret(binop.left, env)
    const rhs = interpret(binop.right, env)

    if(binop.operator.type == TokenType.AmpersandOperator || binop.operator.type == TokenType.VerticalBarOperator || binop.operator.type == TokenType.EqualsComperator || binop.operator.type == TokenType.NotEqualsComperator || binop.operator.type == TokenType.LessComperator || binop.operator.type == TokenType.GreaterComperator || binop.operator.type == TokenType.NotLessComperator || binop.operator.type == TokenType.NotGreaterComperator){
        return interpret_condition_binary_expr(lhs, rhs, binop.operator)
    }
    if(lhs.type == "number" && rhs.type == "number"){
        return interpret_numeric_binary_expr(lhs as NumberValue, rhs as NumberValue, binop.operator)
    }
    if(lhs.type == "string" && rhs.type == "string" && binop.operator.value == "+"){
        return interpret_string_binary_expr(lhs as StringValue, rhs as StringValue)
    }

    return create_null()
}

export function interpret_condition_binary_expr(lhs: RuntimeValue, rhs: RuntimeValue, operator: Token): BooleanValue{
    if(operator.type == TokenType.EqualsComperator){
        if(lhs == rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.NotEqualsComperator){
        if(lhs != rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.GreaterComperator){
        if(lhs > rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.LessComperator){
        if(lhs > rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.NotLessComperator){
        if(lhs !< rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.NotGreaterComperator){
        if(lhs !> rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.AmpersandOperator){
        if(lhs && rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else if(operator.type == TokenType.VerticalBarOperator){
        if(lhs || rhs){
            return {type: "boolean", value: true} as BooleanValue
        }
        else return {type: "boolean", value: false} as BooleanValue
    }
    else return {type: "boolean", value: false} as BooleanValue
}

export function interpret_string_binary_expr(lhs: StringValue, rhs: StringValue): StringValue{
    const result = lhs.value + rhs.value
    return { type: "string", value: result} as StringValue
}

export function interpret_numeric_binary_expr(lhs: NumberValue, rhs: NumberValue, operator: Token): NumberValue{
    let result = 0
    if(operator.value == "+") result = lhs.value + rhs.value
    else if(operator.value == "-") result = lhs.value - rhs.value
    else if(operator.value == "*") result = lhs.value + rhs.value
    else if(operator.value == "/") result = lhs.value / rhs.value
    else if(operator.value == "%") result = lhs.value % rhs.value
    else throw new Error("The operator " + operator.value + " was not setup for interpretation in numeric binary expressions.")
    return { type: "number", value: result} as NumberValue
}

export function interpret_identifier(identifier: Identifier, env: Environment): RuntimeValue{
    const value = env.lookupVar(identifier.symbol)
    return value
}

export function interpret_object_expr(obj: ObjectLiteral, env: Environment): RuntimeValue{
    const object = { type: "object", properties: new Map()} as ObjectValue

    for(const {key, value} of obj.properties){
        // handle valid key: pair
        const runtimeValue = (value == undefined) ? env.lookupVar(key) : interpret(value, env)

        object.properties.set(key, runtimeValue)
    }

    return object
}

export function interpret_member_expr(expr: MemberExpr, env: Environment): RuntimeValue{
    const lhs = interpret(expr.object, env)
    if(lhs.type == "object"){
        const obj = lhs as ObjectValue
        let value:any
        if(expr.computed){
            let computedValue:any
            if(expr.property.kind == "StringLiteral") value = obj.properties.get((expr.property as StringLiteral).value)
            else{
                computedValue = interpret(expr.property, env)
                if(!computedValue){
                    console.error("Cannot interpret member expression: ", expr.property)
                    throw new Error("Cannot interpret member expression: " + JSON.stringify(expr.property))
                } 
                value = obj.properties.get((computedValue as StringLiteral).value)
            } 
        }
        else{
            if(expr.property.kind == "Identifier") value = obj.properties.get((expr.property as Identifier).symbol)
        }
        if(!value) value = create_null()
        return value
    }
    else if(lhs.type == "array"){
        const array = lhs as ArrayValue
        let value:any
        if(expr.computed){
            const computedValue = interpret(expr.property, env)
            if(!computedValue || computedValue.type != "number"){
                console.error("Cannot interpret array expression: ", expr.property)
                throw new Error("Cannot interpret array expression: " + JSON.stringify(expr.property))
            }
            const index = (computedValue as NumberValue).value
            if(array.elements.length < index){
                throw new Error("Cannot get value from array, because it is out of range.")
            }
            const arrayElement = array.elements.at(index)
            if(!arrayElement) throw new Error("Value from array could not be found at position " + index + ". Value was " + arrayElement)
            value = interpret(arrayElement, env)
        }
        else throw new Error("Cannot interpret array expression, because it is not set as an computed expression.")
        return value
    }
    return lhs
}

export function interpret_call_expr(expr: CallExpr, env: Environment): RuntimeValue{
    const args = expr.args.map((arg) => interpret(arg, env))
    const fn = interpret(expr.caller, env)

    if(fn.type == "nativeFn"){     
        const result = (fn as NativeFnValue).call(args, env)
        return result
    }
    
    if(fn.type == "function"){
        const func = fn as FunctionValue
        const scope = new Environment(func.declarationEnv)

        // if(func.parameters.length < args.length){
        //     throw new Error("Cannot assign more arguments than the function can handle: parameters: " + func.parameters.length + " passed arguments: " + args.length)
        // }
        // else if(func.parameters.length > args.length)
        // {
        //     throw new Error("Cannot assign less arguments than the function handles: needed paramters: " + func.parameters.length)
        // }

        for (let i = 0; i < func.parameters.length; i++) {
            const varname = func.parameters[i];
            if(args.length - 1 < i){
                scope.declareVar(varname, create_null(), false)
            }
            else scope.declareVar(varname, args[i], false)
        }

        let result: RuntimeValue = create_null()
        // interpret the function body line by line
        for(const stmt of func.body){
            result = interpret(stmt, scope)
        }
        return result
    } 

    console.error("Cannot call value that is not a function: ", fn)
    throw new Error("Cannot call value that is not a function: " + JSON.stringify(fn))
}

export function interpret_assignment(node: AssignmentExpr, env: Environment): RuntimeValue{
    if(node.assigne.kind !== "Identifier"){
        console.error("Invalid value for an assingment expression ", node.assigne)
        throw new Error("Invalid value for an assingment expression " + JSON.stringify(node.assigne))
    }

    const varname = (node.assigne as Identifier).symbol
    return env.assignVar(varname, interpret(node.value, env))
}

export function interpret_array(node: ArrayLiteral, env: Environment): RuntimeValue{
    // const array:RuntimeValue[] = []
    // for (let i = 0; i < node.elements.length; i++) {
    //     const element = interpret(node.elements[i], env);
    //     array.push(element)
    // }
    // return {type: "array", elements: array} as ArrayValue

    return {type: "array", elements: node.elements} as ArrayValue
}

export function interpret_import(node: ImportLiteral, env: Environment): RuntimeValue{
    const result = interpret(node.program, env)
    return env.declareVar(node.name.value, result, true)
}

export function interpret_html(node: HTMLLiteral, env: Environment): RuntimeValue{
    return {type: "html", html: node.html} as HTMLValue
}