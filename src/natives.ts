import { ArrayLiteral, CallExpr, Expr, Identifier, NumericLiteral } from "./ast";
import Environment from "./environment";
import { interpret_call_expr } from "./expressions";
import { ArrayValue, BooleanValue, FunctionValue, NativeFnValue, NullValue, NumberValue, ObjectValue, RuntimeValue, StringValue, create_null, create_number, create_string } from "./values";


export default class Natives{
    public log(args: RuntimeValue[], scope: Environment): RuntimeValue {
        let finalLog:string = ""
        for(const arg of args){
            if(arg.type == "string"){
                finalLog += (arg as StringValue).value
            }
            else if(arg.type == "number"){
                finalLog += (arg as NumberValue).value.toString()
            }
            else if(arg.type == "boolean"){
                finalLog += (arg as BooleanValue).value.toString()
            }
            else {
                console.log(finalLog)
                console.log(arg)
                return create_null()
            }
            finalLog += "  "
        }
        console.log(finalLog)
        return create_null()
    }
    public time(args: RuntimeValue[], scope: Environment): RuntimeValue {
        const time = Date.now()
        return create_number(time)
    }
    public upper(args: RuntimeValue[], scope: Environment): RuntimeValue {
        let result: RuntimeValue = create_null()
        if(args[0].type == "string"){
            result = create_string((args[0] as StringValue).value.toUpperCase())
        }
        else{
            throw new Error("Cannot use " + args[0].type + " for translation into an upper case letter.")
        }
        return result
    }
    public lower(args: RuntimeValue[], scope: Environment): RuntimeValue {
        let result: RuntimeValue = create_null()
        if(args[0].type == "string"){
            result = create_string((args[0] as StringValue).value.toLowerCase())
        }
        else{
            throw new Error("Cannot use " + args[0].type + " for translation into an upper case letter.")
        }
        return result
    }
    public for(args: RuntimeValue[], scope: Environment): RuntimeValue {
        if(args[1].type == "function"){
            if(args[0].type == "number"){
                const count = (args[0] as NumberValue).value
                for (let i = 0; i < count; i++) {
                    interpret_call_expr({kind: "CallExpr", args: [
                        {kind: "NumericLiteral", value: i} as NumericLiteral,
                    ] as Expr[], caller: {kind: "Identifier", symbol: (args[1] as FunctionValue).name} as Identifier} as CallExpr, scope)
                }
            }
            else if(args[0].type == "array"){
                const array = (args[0] as ArrayValue).elements
                const count = array.length
                for (let i = 0; i < count; i++) {
                    const element = array[i];
                    interpret_call_expr({kind: "CallExpr", args: [
                        array.shift(),
                        {kind: "NumericLiteral", value: i} as NumericLiteral,
                        {kind: "ArrayLiteral", elements: array} as ArrayLiteral
                    ] as Expr[], caller: {kind: "Identifier", symbol: (args[1] as FunctionValue).name} as Identifier} as CallExpr, scope)           
                }
            }
            else throw new Error("Invalid paramter at position 0. Cannot use " + args[0] + " as first parameter")
        }
        return create_null()
    }
}