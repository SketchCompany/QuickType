import {runLanguage} from "./main"

/**
 * This method runs the complete programming language, to read your `input` / `code`, parse it and interpret it, so you can get an `output` / `result` about your `program`.
 * @param {string} input is the `path` to the file, where your `input` / `code` is existing in
 */
export function run(input:string){
    runLanguage(input)
}