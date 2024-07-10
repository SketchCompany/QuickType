import { BinaryExpr, FunctionDeclaration, IfDeclaration, NumericLiteral, Program, VarDeclaration } from "./ast"
import Environment from "./environment"
import { interpret } from "./interpreter"
import { BooleanValue, FunctionValue, RuntimeValue, create_null } from "./values"



export function interpret_program(program: Program, env: Environment): RuntimeValue{
    let lastInterpreted: RuntimeValue = create_null()

    for(const statement of program.body){
        lastInterpreted = interpret(statement, env)
    }
    return lastInterpreted
}

export function interpret_var_declaration(declaration: VarDeclaration, env: Environment): RuntimeValue{
    const value = declaration.value ? interpret(declaration.value, env) : create_null()
    return env.declareVar(declaration.identifier, value, declaration.constant)
}

export function interpret_fn_declaration(declaration: FunctionDeclaration, env: Environment): RuntimeValue{
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body
    } as FunctionValue

    return env.declareVar(declaration.name, fn, true)
}

export function interpret_if_declaration(declaration: IfDeclaration, env: Environment): RuntimeValue{
    //console.dir(declaration, {depth: null})
    const value = interpret(declaration.condition, env)
    // console.log(declaration, value)
    if((value as BooleanValue).value == true){
        let result: RuntimeValue = create_null()
        // interpret the function body line by line
        for(const stmt of declaration.body){
            result = interpret(stmt, env)
        }
        return result
    }
    else if(declaration.elseIfDeclaration){
        const elseValue = interpret_if_declaration(declaration.elseIfDeclaration, env)
        return elseValue
    }
    else if(declaration.elseBody){
        let result: RuntimeValue = create_null()
        // interpret the function body line by line
        for(const stmt of declaration.elseBody){
            result = interpret(stmt, env)
        }
        return result
    }
    else{
        return create_null()
    } 
}
