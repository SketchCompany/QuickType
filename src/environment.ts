import { RuntimeValue, create_bool, create_nativeFn, create_null, create_number } from "./values"
import Natives from "./natives";

export function createGlobalEnvironment(){
    const natives = new Natives()
    const env = new Environment()

    // default variables
    env.declareVar("true", create_bool(true), true)
    env.declareVar("false", create_bool(false), true)
    env.declareVar("null", create_null(), true)

    // natives functions
    env.declareVar("log", create_nativeFn(natives.log), true)
    env.declareVar("upper", create_nativeFn(natives.upper), true)
    env.declareVar("lower", create_nativeFn(natives.lower), true)
    env.declareVar("time", create_number(Date.now()), true)

    return env
}

export default class Environment{
    private parent?: Environment
    private variables: Map<string, RuntimeValue>
    private constants: Set<string>

    constructor(parentENV?: Environment){
        this.parent = parentENV
        this.variables = new Map()
        this.constants = new Set() 
    }

    public declareVar(varname: string, value: RuntimeValue, constant: boolean): RuntimeValue{
        if(this.variables.has(varname)){
            throw new Error("Cannot declare variable " + varname + ". As it already is defined.")
        }

        this.variables.set(varname, value)

        if(constant) this.constants.add(varname)
        return value
    }

    public assignVar(varname: string, value: RuntimeValue): RuntimeValue{
        const env = this.resolve(varname)

        if(env.constants.has(varname)){
            throw new Error("Cannot reassign to variable " + varname + " as it was declared as constant.")
        }

        env.variables.set(varname, value)
        return value
    }

    public lookupVar(varname: string): RuntimeValue{
        const env = this.resolve(varname)
        return env.variables.get(varname) as RuntimeValue
    }

    public resolve(varname: string): Environment{
        if(this.variables.has(varname)) return this
        if(this.parent == undefined) throw new Error("Cannot resolve " + varname + " as it does not exist.")
        return this.parent.resolve(varname)
    }
}