import Environment from "./environment";
import { BooleanValue, FunctionValue, NativeFnValue, NullValue, NumberValue, ObjectValue, RuntimeValue, StringValue, create_null, create_string } from "./values";


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
            finalLog += "   "
        }
        console.log(finalLog)
        return create_null()
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
}