import {Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration, IfDeclaration, FunctionDeclaration, AssignmentExpr, Property, ObjectLiteral, CallExpr, MemberExpr, StringLiteral, ForDeclaration} from "./ast"
import { tokenize, Token, TokenType } from "./lexer"

export default class Parser{
    private tokens: Token[] = []

    private not_eof(): boolean{
        return this.tokens[0].type != TokenType.EOF
    }

    private get(){
        return this.tokens[0] as Token
    }

    private next(){
        return this.tokens[1] as Token
    }

    private shift(){
        const prev = this.tokens.shift() as Token
        return prev
    }

    private expected(type: TokenType, err: string){
        const prev = this.tokens.shift() as Token
        if(!prev || prev.type != type){
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type)
            throw new Error("Parser Error:\n" +  err + " " + JSON.stringify(prev) + " - Expecting: " + type)
        }
        return prev
    }

    public produceAST(source: string): Program{
        this.tokens = tokenize(source)
        const program: Program = {
            kind: "Program",
            body: [],
        }

        // parse until end of file
        while(this.not_eof()){
            program.body.push(this.parse_stmt())
        }

        return program
    }

    private parse_stmt(): Stmt{
        // skip to parse_expr
        switch(this.get().type){
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration()
            case TokenType.Fn:
                return this.parse_fn_declaration()
            case TokenType.If:
                return this.parse_if_stmt()
            case TokenType.For:
                return this.parse_for_stmt()
            case TokenType.While:
                return this.parse_if_stmt()
            default:
                return this.parse_expr()
        }
    }

    private parse_for_stmt(): Stmt {
        this.shift() // remove for

        const name = this.expected(TokenType.Identifier, "Expected for loop name following for keyword.").value

        this.expected(TokenType.OpenParen, "Expected opening parentheses in for loop declaration.")
        const count = this.parse_additive_expr()
        this.expected(TokenType.CloseParen, "Missing closing parentheses in for loop decalration.")

        this.expected(TokenType.OpenBrace, "Expected opening brace in for loop declaration.")
        const body: Stmt[] = []

        while(this.get().type !== TokenType.EOF && this.get().type !== TokenType.CloseBrace){
            body.push(this.parse_stmt())
        }
        this.expected(TokenType.CloseBrace, "Expected closing brace in for loop declaration.")
        return {kind: "ForDeclaration", name, count, body} as ForDeclaration
    }

    private parse_fn_declaration(): Stmt {
        this.shift() // remove fn keyword
        const name = this.expected(TokenType.Identifier, "Expected function name following fn keyword.").value

        const args = this.parse_args()
        const params: string[] = []
        for(const arg of args){
            if(arg.kind !== "Identifier"){
                throw new Error("Inside function declaration expected parameters to be of type string.")
            }

            params.push((arg as Identifier).symbol)
        }

        this.expected(TokenType.OpenBrace, "Expected function body following declaration.")
        const body: Stmt[] = []

        while(this.get().type !== TokenType.EOF && this.get().type !== TokenType.CloseBrace){
            body.push(this.parse_stmt())
        }
        this.expected(TokenType.CloseBrace, "Closing brace expected inside function declaration.")
        const fn = {
            body, 
            name, 
            parameters: params, 
            kind: "FunctionDeclaration"
        } as FunctionDeclaration

        return fn
    }

    private parse_var_declaration(): Stmt{
        const isConstant = this.shift().type == TokenType.Const
        const identifier = this.expected(TokenType.Identifier, "Expected identifier name following let | const keywords.").value
        
        // if(this.get().type == TokenType.Semicolon){
        //     this.shift() //expect semicolon
        //     if(isConstant){
        //         throw new Error("Must assigne value to constant expression. No value provided.")
        //     }
        //     return {kind: "VarDeclaration", identifier, constant: false} as VarDeclaration
        // }
        this.expected(TokenType.Equals, "Expected equals token following identifier in var declaration.")
        const declaration = {kind: "VarDeclaration", identifier, value: this.parse_expr(), constant: isConstant} as VarDeclaration
    
        // this.expected(TokenType.Semicolon, "Variable declaration statement must end with semicolon.")
        return declaration
    }

    private parse_if_stmt(): Stmt{
        this.shift() // remove if
        this.expected(TokenType.OpenParen, "Expected opening parantheses in if statement.")

        const condition = this.parse_condition_expr()
        // console.log("condition")
        // console.dir(condition, {depth: 3})

        this.expected(TokenType.CloseParen, "Missing closing parantheses in if statement.")

        this.expected(TokenType.OpenBrace, "Expected function body following if statement declaration.")
        const body:Stmt[] = []

        while(this.get().type !== TokenType.EOF && this.get().type !== TokenType.CloseBrace){
            body.push(this.parse_stmt())
        }
        this.expected(TokenType.CloseBrace, "Closing brace expected inside if statement declaration.")

        if(this.get().type == TokenType.Else && this.next().type == TokenType.If){
            this.shift() // remove else
            
            const elseIfDeclaration = this.parse_if_stmt()

            return {kind: "IfDeclaration", condition, body, elseIfDeclaration} as IfDeclaration
        }
        else if(this.get().type == TokenType.Else){
            this.shift() // remove else
            let elseBody:Stmt[] = []
            this.expected(TokenType.OpenBrace, "Expected function body following if statement declaration.")
            while(this.get().type !== TokenType.EOF && this.get().type !== TokenType.CloseBrace){
                elseBody.push(this.parse_stmt())
            }
            this.expected(TokenType.CloseBrace, "Closing brace expected inside if statement declaration.")

            return {kind: "IfDeclaration", condition, body, elseBody} as IfDeclaration

        }
        else console.log("no else condition defined")

        return {kind: "IfDeclaration", condition, body} as IfDeclaration
    }

    // presidence
    // Assignment
    // Object
    // Additve
    // Multiplicative
    // Call
    // Member
    // Primary Expression

    private parse_expr(): Expr{
        return this.parse_assignment_expr()
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr()

        if(this.get().type == TokenType.Equals){
            this.shift()
            const value = this.parse_assignment_expr()
            return {value, assigne: left, kind: "AssignmentExpr"} as AssignmentExpr
        }
        return left
    }

    private parse_object_expr(): Expr {
        if(this.get().type !== TokenType.OpenBrace){
            return this.parse_additive_expr()
        }

        this.shift()
        const properties = new Array<Property>()

        while(this.not_eof() && this.get().type != TokenType.CloseBrace){
            const key = this.expected(TokenType.Identifier, "Object literal key expected").value

            // allows shorthand ({key, short...})
            if(this.get().type == TokenType.Comma){
                this.shift()
                properties.push({key, kind: "Property"} as Property)
                continue
            }
            else if(this.get().type == TokenType.CloseBrace){
                properties.push({key, kind: "Property"})
                continue
            }

            this.expected(TokenType.Colon, "Missing colon following identifier in Object literal")
            const value = this.parse_stmt()

            properties.push({kind: "Property", value, key})
            if(this.get().type != TokenType.CloseBrace){
                this.expected(TokenType.Comma, "Expected comma or closing brace following property")
            }
        }

        this.expected(TokenType.CloseBrace, "Object literal missing closing brace.")
        return {kind: "ObjectLiteral", properties} as ObjectLiteral
    }

    private parse_condition_expr(): Expr{
        let left = this.parse_additive_expr()
        const comperator = this.get();
        while(
            comperator.type == TokenType.AmpersandOperator ||
            comperator.type == TokenType.VerticalBarOperator ||
            comperator.type == TokenType.EqualsComperator ||
            comperator.type == TokenType.NotEqualsComperator ||
            comperator.type == TokenType.GreaterComperator ||
            comperator.type == TokenType.LessComperator ||
            comperator.type == TokenType.NotGreaterComperator ||
            comperator.type == TokenType.NotLessComperator
        ){
            if(this.get().type == TokenType.CloseParen) return left
            const operator = this.shift()
            let right:any
            if(operator.type == TokenType.VerticalBarOperator || operator.type == TokenType.AmpersandOperator){
                right = this.parse_condition_expr()
            }
            else right = this.parse_additive_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr
        }
        return left
    }

    private parse_additive_expr(): Expr{
        let left = this.parse_multiplicative_expr()

        while(this.get().value == "+" || this.get().value == "-"){
            const operator = this.shift()
            const right = this.parse_multiplicative_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parse_multiplicative_expr(): Expr{
        let left = this.parse_call_member_expr()

        while(this.get().value == "*" || this.get().value == "/" || this.get().value == "%"){
            const operator = this.shift()
            const right = this.parse_call_member_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parse_call_member_expr(): Expr{
        const member = this.parse_member_expr()

        if(this.get().type == TokenType.OpenParen){
            return this.parse_call_expr(member)
        }
        else{
            return member
        }
    }

    private parse_call_expr(caller: Expr): Expr{
        let call_expr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args()
        } as CallExpr

        if(this.get().type == TokenType.OpenParen){
            call_expr = this.parse_call_expr(call_expr)
        }

        return call_expr
    }

    private parse_args(): Expr[]{
        this.expected(TokenType.OpenParen, "Expected open paranthesis.")
        const args = this.get().type == TokenType.CloseParen ? [] : this.parse_arguments_list_expr()
        this.expected(TokenType.CloseParen, "Missing closing parenthesis inside arguments list.")
        return args
    }

    private parse_arguments_list_expr(): Expr[]{
        const args = [this.parse_assignment_expr()]

        while(this.get().type == TokenType.Comma && this.shift()){
            args.push(this.parse_assignment_expr())
        }

        return args
    }

    private parse_member_expr(): Expr{
        let object = this.parse_unary_expr()

        while(this.get().type == TokenType.Dot || this.get().type == TokenType.OpenBracket){
            const operator = this.shift()
            let property: Expr
            let computed: boolean

            // non-computed values aka obj.expr
            if(operator.type == TokenType.Dot){
                computed = false
                property = this.parse_primary_expr() // get identifier

                if(property.kind != "Identifier"){
                    throw new Error("Cannot use dot operator without right hand side being an identifier.")
                }
            }
            else{ // this allows obj[computedValue]
                computed = true
                property = this.parse_expr()
                this.expected(TokenType.CloseBracket, "Missing closing bracket in computed value.")
            }

            object = {kind: "MemberExpr", object, property, computed} as MemberExpr
        }

        return object
    }

    private parse_unary_expr(): Expr{
        if(this.get().type == TokenType.ExclamationMark){
            this.shift()
            const left = this.parse_additive_expr()
            const right = this.parse_additive_expr()
            return {kind: "BinaryExpr", left, right, operator: {type: TokenType.NotEqualsComperator, value: "!"} as Token} as BinaryExpr
        }
        else return this.parse_primary_expr()
    }

    private parse_primary_expr(): Expr{
        const tk = this.get().type

        switch(tk){
            case TokenType.Identifier:
                return {kind: "Identifier", symbol: this.shift().value } as Identifier
            case TokenType.Number:
                return {kind: "NumericLiteral", value: parseFloat(this.shift().value) } as NumericLiteral
            case TokenType.String:
                return {kind: "StringLiteral", value: this.shift().value } as StringLiteral
            case TokenType.OpenParen:
                this.shift()
                const value = this.parse_expr()
                this.expected(TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expected closing parenthes")
                return value
            default:
                console.error("Unexpected token ", this.get(), " found during parsing")
                throw new Error("Unexpected token " + JSON.stringify(this.get()) + " found during parsing")
        }
    }
}