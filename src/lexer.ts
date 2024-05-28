function checkLetter(c: string){
    return /[a-zA-Z]$/.test(c)
}
function checkNumber(c: string){
    return /[0-9]$/.test(c)
}

export enum TokenType{
    Number,
    Identifier,
    String,
    Comment,

    OpenParen, 
    CloseParen,
    OpenBrace,
    CloseBrace,
    OpenBracket,
    CloseBracket,

    BinaryOperator,
    Equals,
    Semicolon,
    Comma,
    Colon,
    Dot,
    ExclamationMark,
    
    VerticalBarOperator,
    AmpersandOperator,

    EqualsComperator,
    NotEqualsComperator,
    GreaterComperator,
    LessComperator,
    NotGreaterComperator,
    NotLessComperator,

    Let,
    Const,
    Fn,
    If,
    Else,
    While,
    Return,

    EOF,
}

export interface Token{
    value: string,
    type: TokenType
}

const KEYWORDS: Record<string, TokenType> = {
    "v": TokenType.Let,
    "c": TokenType.Const,
    "f": TokenType.Fn,
    "if": TokenType.If,
    "else": TokenType.Else,
    "and": TokenType.AmpersandOperator,
    "or": TokenType.VerticalBarOperator,
    "not": TokenType.NotEqualsComperator,
    "is": TokenType.EqualsComperator,
    "gt": TokenType.GreaterComperator,
    "ls": TokenType.LessComperator,
    "ngt": TokenType.NotGreaterComperator,
    "nls": TokenType.NotLessComperator,
    "while": TokenType.While,
}

function addToken(value = "", type: TokenType){
    return {value, type}
}

/**
 * tokenizes a given `string` into the `token type` and its `value`
 * @param {string} code is the `string` that needs to be tokenized
 * @returns {Array<JSON>} an `Array` with the found tokens in JSON format, for example like this: 
 * ```
 * {token: "IDENTIFIER", value: "example"}
 * ```
 */
export function tokenize(code: string): Token[]{
    const tokens = new Array<Token>()
    const src = code.split("")

    while(src.length > 0){
        if(src[0] === "("){
            tokens.push(addToken(src.shift(), TokenType.OpenParen))
        }
        else if(src[0] === ")"){
            tokens.push(addToken(src.shift(), TokenType.CloseParen))
        }
        else if(src[0] === "{"){
            tokens.push(addToken(src.shift(), TokenType.OpenBrace))
        }
        else if(src[0] === "}"){
            tokens.push(addToken(src.shift(), TokenType.CloseBrace))
        }
        else if(src[0] === "["){
            tokens.push(addToken(src.shift(), TokenType.OpenBracket))
        }
        else if(src[0] === "]"){
            tokens.push(addToken(src.shift(), TokenType.CloseBracket))
        }
        else if(src[0] === "/" && src[1] === "*"){
            src.shift()
            src.shift()
            while(src.length > 0){
                if(src.shift() != "*" || src.shift() != "/") continue
                else break
            }
        }
        else if(src[0] === "/" && src[1] === "/"){
            src.shift()
            src.shift()
            while(src.length > 0 && src.shift() != "\n"){
                continue
            }
        }
        else if(src[0] === "+" || src[0] === "-" || src[0] === "*" || src[0] === "/" || src[0] === "%"){
            tokens.push(addToken(src.shift(), TokenType.BinaryOperator))
        }
        else if(src[0] === "=" && src[1] !== "="){
            tokens.push(addToken(src.shift(), TokenType.Equals))
        }
        // else if(src[0] === ";"){
        //     tokens.push(addToken(src.shift(), TokenType.Semicolon))
        // }
        else if(src[0] === ":"){
            tokens.push(addToken(src.shift(), TokenType.Colon))
        }
        else if(src[0] === ","){
            tokens.push(addToken(src.shift(), TokenType.Comma))
        }
        else if(src[0] === "."){
            tokens.push(addToken(src.shift(), TokenType.Dot))
        }
        else if(src[0] === ">"){
            tokens.push(addToken(src.shift(), TokenType.GreaterComperator))
        }
        else if(src[0] === "<"){
            tokens.push(addToken(src.shift(), TokenType.LessComperator))
        }
        else if(src[0] === "|"){
            src.shift()
            tokens.push(addToken("|", TokenType.VerticalBarOperator))
        }
        else if(src[0] === "&"){
            src.shift()
            tokens.push(addToken("&", TokenType.AmpersandOperator))
        }
        else if(src[0] === "="){
            if(src[1] === "="){
                src.shift()
                src.shift()
                tokens.push(addToken("==", TokenType.EqualsComperator))
            }
        }
        else if(src[0] === "!"){
            if(src[1] === "="){
                src.shift()
                src.shift()
                tokens.push(addToken("!=", TokenType.NotEqualsComperator))
            }
            else if(src[1] === "<"){
                src.shift()
                src.shift()
                tokens.push(addToken("!<", TokenType.NotLessComperator))
            }
            else if(src[1] === ">"){
                src.shift()
                src.shift()
                tokens.push(addToken("!>", TokenType.NotGreaterComperator))
            }
            else{
                src.shift()
                tokens.push(addToken("!", TokenType.ExclamationMark))
            }
        }
        else{
            if(src[0] === "\""){
                src.shift()
                let string = ""
                while(src.length > 0 && src[0] != "\""){
                    string += src.shift()
                }
                src.shift()
                tokens.push(addToken(string, TokenType.String))
            }
            else if(src[0] === "'"){
                src.shift()
                let string = ""
                while(src.length > 0 && src[0] != "'"){
                    string += src.shift()
                }
                src.shift()
                tokens.push(addToken(string, TokenType.String))
            }
            else if(checkNumber(src[0])){
                let number = ""
                while(src.length > 0 && checkNumber(src[0])){
                    number += src.shift()
                }
                tokens.push(addToken(number, TokenType.Number))
            }
            else if(checkLetter(src[0])){
                let identifier = ""
                while(src.length > 0 && checkLetter(src[0]) || checkNumber(src[0])){
                    identifier += src.shift()
                }

                const reserved = KEYWORDS[identifier]
                if(typeof reserved == "number"){
                    tokens.push(addToken(identifier, reserved))
                }
                else{
                    tokens.push(addToken(identifier, TokenType.Identifier))
                }
            }
            else if(src[0] === " " || src[0] === "\n" || src[0] === "\t" || src[0] === "\r"){
                src.shift()
            }
            else{
                console.error("Unexpected token '" + src[0] + "' found")
                throw new Error("Unexpected token '" + src[0] + "' found")
            }
        }
    }
    tokens.push({type: TokenType.EOF, value: "EndOfFile"})
    return tokens
}