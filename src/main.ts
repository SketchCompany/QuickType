import Parser from "./parser";
import {interpret} from "./interpreter";
import {createGlobalEnvironment} from "./environment";
import fs from "fs";

const languageVersion = "0.0.4"

/**
 * This method runs the complete programming language, to read your `input` / `code`, parse it and interpret it, so you can get an `output` / `result` about your `program`.
 * @param {string} inputSource is the `path` to the file, where your `input` / `code` is existing in
 */
export async function runLanguage(inputSource: string) {
    const env = createGlobalEnvironment()

    console.log("\nQuick Type " + languageVersion + "\n")

    let input:string
    if(inputSource.includes(".quicktype") || inputSource.includes(".quick")){
        input = fs.readFileSync(inputSource).toString()
    }
    else{
        input = inputSource
    } 
    
    const parser = new Parser()
    const program = parser.produceAST(input)
    //console.log("main.ts: program:\n", program)

    const result = interpret(program, env)
    // console.log("main.ts: result:\n", result)
}