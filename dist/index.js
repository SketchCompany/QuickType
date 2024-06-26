"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  run: () => run
});
module.exports = __toCommonJS(src_exports);

// src/lexer.ts
function checkLetter(c) {
  return /[a-zA-Z]$/.test(c);
}
function checkNumber(c) {
  return /[0-9]$/.test(c);
}
var KEYWORDS = {
  "v": 25 /* Let */,
  "c": 26 /* Const */,
  "f": 27 /* Fn */,
  "if": 28 /* If */,
  "else": 29 /* Else */,
  "and": 18 /* AmpersandOperator */,
  "or": 17 /* VerticalBarOperator */,
  "not": 20 /* NotEqualsComperator */,
  "is": 19 /* EqualsComperator */,
  "gt": 21 /* GreaterComperator */,
  "ls": 22 /* LessComperator */,
  "ngt": 23 /* NotGreaterComperator */,
  "nls": 24 /* NotLessComperator */,
  "for": 30 /* For */,
  "while": 31 /* While */
};
function addToken(value = "", type) {
  return { value, type };
}
function tokenize(code) {
  const tokens = new Array();
  const src = code.split("");
  while (src.length > 0) {
    if (src[0] === "(") {
      tokens.push(addToken(src.shift(), 4 /* OpenParen */));
    } else if (src[0] === ")") {
      tokens.push(addToken(src.shift(), 5 /* CloseParen */));
    } else if (src[0] === "{") {
      tokens.push(addToken(src.shift(), 6 /* OpenBrace */));
    } else if (src[0] === "}") {
      tokens.push(addToken(src.shift(), 7 /* CloseBrace */));
    } else if (src[0] === "[") {
      tokens.push(addToken(src.shift(), 8 /* OpenBracket */));
    } else if (src[0] === "]") {
      tokens.push(addToken(src.shift(), 9 /* CloseBracket */));
    } else if (src[0] === "/" && src[1] === "*") {
      src.shift();
      src.shift();
      while (src.length > 0) {
        if (src.shift() != "*" || src.shift() != "/")
          continue;
        else
          break;
      }
    } else if (src[0] === "/" && src[1] === "/") {
      src.shift();
      src.shift();
      while (src.length > 0 && src.shift() != "\n") {
        continue;
      }
    } else if (src[0] === "+" || src[0] === "-" || src[0] === "*" || src[0] === "/" || src[0] === "%") {
      tokens.push(addToken(src.shift(), 10 /* BinaryOperator */));
    } else if (src[0] === "=" && src[1] !== "=") {
      tokens.push(addToken(src.shift(), 11 /* Equals */));
    } else if (src[0] === ":") {
      tokens.push(addToken(src.shift(), 14 /* Colon */));
    } else if (src[0] === ",") {
      tokens.push(addToken(src.shift(), 13 /* Comma */));
    } else if (src[0] === ".") {
      tokens.push(addToken(src.shift(), 15 /* Dot */));
    } else if (src[0] === ">") {
      tokens.push(addToken(src.shift(), 21 /* GreaterComperator */));
    } else if (src[0] === "<") {
      tokens.push(addToken(src.shift(), 22 /* LessComperator */));
    } else if (src[0] === "|") {
      src.shift();
      tokens.push(addToken("|", 17 /* VerticalBarOperator */));
    } else if (src[0] === "&") {
      src.shift();
      tokens.push(addToken("&", 18 /* AmpersandOperator */));
    } else if (src[0] === "=") {
      if (src[1] === "=") {
        src.shift();
        src.shift();
        tokens.push(addToken("==", 19 /* EqualsComperator */));
      }
    } else if (src[0] === "!") {
      if (src[1] === "=") {
        src.shift();
        src.shift();
        tokens.push(addToken("!=", 20 /* NotEqualsComperator */));
      } else if (src[1] === "<") {
        src.shift();
        src.shift();
        tokens.push(addToken("!<", 24 /* NotLessComperator */));
      } else if (src[1] === ">") {
        src.shift();
        src.shift();
        tokens.push(addToken("!>", 23 /* NotGreaterComperator */));
      } else {
        src.shift();
        tokens.push(addToken("!", 16 /* ExclamationMark */));
      }
    } else {
      if (src[0] === '"') {
        src.shift();
        let string = "";
        while (src.length > 0 && src[0] != '"') {
          string += src.shift();
        }
        src.shift();
        tokens.push(addToken(string, 2 /* String */));
      } else if (src[0] === "'") {
        src.shift();
        let string = "";
        while (src.length > 0 && src[0] != "'") {
          string += src.shift();
        }
        src.shift();
        tokens.push(addToken(string, 2 /* String */));
      } else if (checkNumber(src[0])) {
        let number = "";
        while (src.length > 0 && checkNumber(src[0])) {
          number += src.shift();
        }
        tokens.push(addToken(number, 0 /* Number */));
      } else if (checkLetter(src[0])) {
        let identifier = "";
        while (src.length > 0 && checkLetter(src[0]) || checkNumber(src[0])) {
          identifier += src.shift();
        }
        const reserved = KEYWORDS[identifier];
        if (typeof reserved == "number") {
          tokens.push(addToken(identifier, reserved));
        } else {
          tokens.push(addToken(identifier, 1 /* Identifier */));
        }
      } else if (src[0] === " " || src[0] === "\n" || src[0] === "	" || src[0] === "\r") {
        src.shift();
      } else {
        console.error("Unexpected token '" + src[0] + "' found");
        throw new Error("Unexpected token '" + src[0] + "' found");
      }
    }
  }
  tokens.push({ type: 33 /* EOF */, value: "EndOfFile" });
  return tokens;
}

// src/parser.ts
var Parser = class {
  constructor() {
    this.tokens = [];
  }
  not_eof() {
    return this.tokens[0].type != 33 /* EOF */;
  }
  get() {
    return this.tokens[0];
  }
  next() {
    return this.tokens[1];
  }
  shift() {
    const prev = this.tokens.shift();
    return prev;
  }
  expected(type, err) {
    const prev = this.tokens.shift();
    if (!prev || prev.type != type) {
      console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
      throw new Error("Parser Error:\n" + err + " " + JSON.stringify(prev) + " - Expecting: " + type);
    }
    return prev;
  }
  produceAST(source) {
    this.tokens = tokenize(source);
    const program = {
      kind: "Program",
      body: []
    };
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }
    return program;
  }
  parse_stmt() {
    switch (this.get().type) {
      case 25 /* Let */:
      case 26 /* Const */:
        return this.parse_var_declaration();
      case 27 /* Fn */:
        return this.parse_fn_declaration();
      case 28 /* If */:
        return this.parse_if_stmt();
      case 30 /* For */:
        return this.parse_for_stmt();
      case 31 /* While */:
        return this.parse_if_stmt();
      default:
        return this.parse_expr();
    }
  }
  parse_for_stmt() {
    this.shift();
    const name = this.expected(1 /* Identifier */, "Expected for loop name following for keyword.").value;
    this.expected(4 /* OpenParen */, "Expected opening parentheses in for loop declaration.");
    const count = this.parse_additive_expr();
    this.expected(5 /* CloseParen */, "Missing closing parentheses in for loop decalration.");
    this.expected(6 /* OpenBrace */, "Expected opening brace in for loop declaration.");
    const body = [];
    while (this.get().type !== 33 /* EOF */ && this.get().type !== 7 /* CloseBrace */) {
      body.push(this.parse_stmt());
    }
    this.expected(7 /* CloseBrace */, "Expected closing brace in for loop declaration.");
    return { kind: "ForDeclaration", name, count, body };
  }
  parse_fn_declaration() {
    this.shift();
    const name = this.expected(1 /* Identifier */, "Expected function name following fn keyword.").value;
    const args = this.parse_args();
    const params = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        throw new Error("Inside function declaration expected parameters to be of type string.");
      }
      params.push(arg.symbol);
    }
    this.expected(6 /* OpenBrace */, "Expected function body following declaration.");
    const body = [];
    while (this.get().type !== 33 /* EOF */ && this.get().type !== 7 /* CloseBrace */) {
      body.push(this.parse_stmt());
    }
    this.expected(7 /* CloseBrace */, "Closing brace expected inside function declaration.");
    const fn = {
      body,
      name,
      parameters: params,
      kind: "FunctionDeclaration"
    };
    return fn;
  }
  parse_var_declaration() {
    const isConstant = this.shift().type == 26 /* Const */;
    const identifier = this.expected(1 /* Identifier */, "Expected identifier name following let | const keywords.").value;
    this.expected(11 /* Equals */, "Expected equals token following identifier in var declaration.");
    const declaration = { kind: "VarDeclaration", identifier, value: this.parse_expr(), constant: isConstant };
    return declaration;
  }
  parse_if_stmt() {
    this.shift();
    this.expected(4 /* OpenParen */, "Expected opening parantheses in if statement.");
    const condition = this.parse_condition_expr();
    this.expected(5 /* CloseParen */, "Missing closing parantheses in if statement.");
    this.expected(6 /* OpenBrace */, "Expected function body following if statement declaration.");
    const body = [];
    while (this.get().type !== 33 /* EOF */ && this.get().type !== 7 /* CloseBrace */) {
      body.push(this.parse_stmt());
    }
    this.expected(7 /* CloseBrace */, "Closing brace expected inside if statement declaration.");
    if (this.get().type == 29 /* Else */ && this.next().type == 28 /* If */) {
      this.shift();
      const elseIfDeclaration = this.parse_if_stmt();
      return { kind: "IfDeclaration", condition, body, elseIfDeclaration };
    } else if (this.get().type == 29 /* Else */) {
      this.shift();
      let elseBody = [];
      this.expected(6 /* OpenBrace */, "Expected function body following if statement declaration.");
      while (this.get().type !== 33 /* EOF */ && this.get().type !== 7 /* CloseBrace */) {
        elseBody.push(this.parse_stmt());
      }
      this.expected(7 /* CloseBrace */, "Closing brace expected inside if statement declaration.");
      return { kind: "IfDeclaration", condition, body, elseBody };
    } else
      console.log("no else condition defined");
    return { kind: "IfDeclaration", condition, body };
  }
  // presidence
  // Assignment
  // Object
  // Additve
  // Multiplicative
  // Call
  // Member
  // Primary Expression
  parse_expr() {
    return this.parse_assignment_expr();
  }
  parse_assignment_expr() {
    const left = this.parse_object_expr();
    if (this.get().type == 11 /* Equals */) {
      this.shift();
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" };
    }
    return left;
  }
  parse_object_expr() {
    if (this.get().type !== 6 /* OpenBrace */) {
      return this.parse_additive_expr();
    }
    this.shift();
    const properties = new Array();
    while (this.not_eof() && this.get().type != 7 /* CloseBrace */) {
      const key = this.expected(1 /* Identifier */, "Object literal key expected").value;
      if (this.get().type == 13 /* Comma */) {
        this.shift();
        properties.push({ key, kind: "Property" });
        continue;
      } else if (this.get().type == 7 /* CloseBrace */) {
        properties.push({ key, kind: "Property" });
        continue;
      }
      this.expected(14 /* Colon */, "Missing colon following identifier in Object literal");
      const value = this.parse_stmt();
      properties.push({ kind: "Property", value, key });
      if (this.get().type != 7 /* CloseBrace */) {
        this.expected(13 /* Comma */, "Expected comma or closing brace following property");
      }
    }
    this.expected(7 /* CloseBrace */, "Object literal missing closing brace.");
    return { kind: "ObjectLiteral", properties };
  }
  parse_condition_expr() {
    let left = this.parse_additive_expr();
    const comperator = this.get();
    while (comperator.type == 18 /* AmpersandOperator */ || comperator.type == 17 /* VerticalBarOperator */ || comperator.type == 19 /* EqualsComperator */ || comperator.type == 20 /* NotEqualsComperator */ || comperator.type == 21 /* GreaterComperator */ || comperator.type == 22 /* LessComperator */ || comperator.type == 23 /* NotGreaterComperator */ || comperator.type == 24 /* NotLessComperator */) {
      if (this.get().type == 5 /* CloseParen */)
        return left;
      const operator = this.shift();
      let right;
      if (operator.type == 17 /* VerticalBarOperator */ || operator.type == 18 /* AmpersandOperator */) {
        right = this.parse_condition_expr();
      } else
        right = this.parse_additive_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parse_additive_expr() {
    let left = this.parse_multiplicative_expr();
    while (this.get().value == "+" || this.get().value == "-") {
      const operator = this.shift();
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parse_multiplicative_expr() {
    let left = this.parse_call_member_expr();
    while (this.get().value == "*" || this.get().value == "/" || this.get().value == "%") {
      const operator = this.shift();
      const right = this.parse_call_member_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator
      };
    }
    return left;
  }
  parse_call_member_expr() {
    const member = this.parse_member_expr();
    if (this.get().type == 4 /* OpenParen */) {
      return this.parse_call_expr(member);
    } else {
      return member;
    }
  }
  parse_call_expr(caller) {
    let call_expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args()
    };
    if (this.get().type == 4 /* OpenParen */) {
      call_expr = this.parse_call_expr(call_expr);
    }
    return call_expr;
  }
  parse_args() {
    this.expected(4 /* OpenParen */, "Expected open paranthesis.");
    const args = this.get().type == 5 /* CloseParen */ ? [] : this.parse_arguments_list_expr();
    this.expected(5 /* CloseParen */, "Missing closing parenthesis inside arguments list.");
    return args;
  }
  parse_arguments_list_expr() {
    const args = [this.parse_assignment_expr()];
    while (this.get().type == 13 /* Comma */ && this.shift()) {
      args.push(this.parse_assignment_expr());
    }
    return args;
  }
  parse_member_expr() {
    let object = this.parse_unary_expr();
    while (this.get().type == 15 /* Dot */ || this.get().type == 8 /* OpenBracket */) {
      const operator = this.shift();
      let property;
      let computed;
      if (operator.type == 15 /* Dot */) {
        computed = false;
        property = this.parse_primary_expr();
        if (property.kind != "Identifier") {
          throw new Error("Cannot use dot operator without right hand side being an identifier.");
        }
      } else {
        computed = true;
        property = this.parse_expr();
        this.expected(9 /* CloseBracket */, "Missing closing bracket in computed value.");
      }
      object = { kind: "MemberExpr", object, property, computed };
    }
    return object;
  }
  parse_unary_expr() {
    if (this.get().type == 16 /* ExclamationMark */) {
      this.shift();
      const left = this.parse_additive_expr();
      const right = this.parse_additive_expr();
      return { kind: "BinaryExpr", left, right, operator: { type: 20 /* NotEqualsComperator */, value: "!" } };
    } else
      return this.parse_primary_expr();
  }
  parse_primary_expr() {
    const tk = this.get().type;
    switch (tk) {
      case 1 /* Identifier */:
        return { kind: "Identifier", symbol: this.shift().value };
      case 0 /* Number */:
        return { kind: "NumericLiteral", value: parseFloat(this.shift().value) };
      case 2 /* String */:
        return { kind: "StringLiteral", value: this.shift().value };
      case 4 /* OpenParen */:
        this.shift();
        const value = this.parse_expr();
        this.expected(5 /* CloseParen */, "Unexpected token found inside parenthesised expression. Expected closing parenthes");
        return value;
      default:
        console.error("Unexpected token ", this.get(), " found during parsing");
        throw new Error("Unexpected token " + JSON.stringify(this.get()) + " found during parsing");
    }
  }
};

// src/values.ts
function create_null() {
  return { type: "null", value: null };
}
function create_bool(value = true) {
  return { type: "boolean", value };
}
function create_number(value = 0) {
  return { type: "number", value };
}
function create_string(value = "") {
  return { type: "string", value };
}
function create_nativeFn(call) {
  return { type: "nativeFn", call };
}

// src/natives.ts
var Natives = class {
  log(args, scope) {
    let finalLog = "";
    for (const arg of args) {
      if (arg.type == "string") {
        finalLog += arg.value;
      } else if (arg.type == "number") {
        finalLog += arg.value.toString();
      } else if (arg.type == "boolean") {
        finalLog += arg.value.toString();
      } else {
        console.log(finalLog);
        console.log(arg);
        return create_null();
      }
      finalLog += "   ";
    }
    console.log(finalLog);
    return create_null();
  }
  upper(args, scope) {
    let result = create_null();
    if (args[0].type == "string") {
      result = create_string(args[0].value.toUpperCase());
    } else {
      throw new Error("Cannot use " + args[0].type + " for translation into an upper case letter.");
    }
    return result;
  }
  lower(args, scope) {
    let result = create_null();
    if (args[0].type == "string") {
      result = create_string(args[0].value.toLowerCase());
    } else {
      throw new Error("Cannot use " + args[0].type + " for translation into an upper case letter.");
    }
    return result;
  }
};

// src/environment.ts
function createGlobalEnvironment() {
  const natives = new Natives();
  const env = new Environment();
  env.declareVar("true", create_bool(true), true);
  env.declareVar("false", create_bool(false), true);
  env.declareVar("null", create_null(), true);
  env.declareVar("log", create_nativeFn(natives.log), true);
  env.declareVar("upper", create_nativeFn(natives.upper), true);
  env.declareVar("lower", create_nativeFn(natives.lower), true);
  env.declareVar("time", create_number(Date.now()), true);
  return env;
}
var Environment = class {
  constructor(parentENV) {
    this.parent = parentENV;
    this.variables = /* @__PURE__ */ new Map();
    this.constants = /* @__PURE__ */ new Set();
  }
  declareVar(varname, value, constant) {
    if (this.variables.has(varname)) {
      throw new Error("Cannot declare variable " + varname + ". As it already is defined.");
    }
    this.variables.set(varname, value);
    if (constant)
      this.constants.add(varname);
    return value;
  }
  assignVar(varname, value) {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw new Error("Cannot reassign to variable " + varname + " as it was declared as constant.");
    }
    env.variables.set(varname, value);
    return value;
  }
  lookupVar(varname) {
    const env = this.resolve(varname);
    return env.variables.get(varname);
  }
  resolve(varname) {
    if (this.variables.has(varname))
      return this;
    if (this.parent == void 0)
      throw new Error("Cannot resolve " + varname + " as it does not exist.");
    return this.parent.resolve(varname);
  }
};

// src/expressions.ts
function interpret_binary_expr(binop, env) {
  const lhs = interpret(binop.left, env);
  const rhs = interpret(binop.right, env);
  if (binop.operator.type == 18 /* AmpersandOperator */ || binop.operator.type == 17 /* VerticalBarOperator */ || binop.operator.type == 19 /* EqualsComperator */ || binop.operator.type == 20 /* NotEqualsComperator */ || binop.operator.type == 22 /* LessComperator */ || binop.operator.type == 21 /* GreaterComperator */ || binop.operator.type == 24 /* NotLessComperator */ || binop.operator.type == 23 /* NotGreaterComperator */) {
    return interpret_condition_binary_expr(lhs, rhs, binop.operator);
  }
  if (lhs.type == "number" && rhs.type == "number") {
    return interpret_numeric_binary_expr(lhs, rhs, binop.operator);
  }
  if (lhs.type == "string" && rhs.type == "string" && binop.operator.value == "+") {
    return interpret_string_binary_expr(lhs, rhs);
  }
  return create_null();
}
function interpret_condition_binary_expr(lhs, rhs, operator) {
  if (operator.type == 19 /* EqualsComperator */) {
    if (lhs == rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 20 /* NotEqualsComperator */) {
    if (lhs != rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 21 /* GreaterComperator */) {
    if (lhs > rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 22 /* LessComperator */) {
    if (lhs > rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 24 /* NotLessComperator */) {
    if (lhs < rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 23 /* NotGreaterComperator */) {
    if (lhs > rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 18 /* AmpersandOperator */) {
    if (lhs && rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else if (operator.type == 17 /* VerticalBarOperator */) {
    if (lhs || rhs) {
      return { type: "boolean", value: true };
    } else
      return { type: "boolean", value: false };
  } else
    return { type: "boolean", value: false };
}
function interpret_string_binary_expr(lhs, rhs) {
  const result = lhs.value + rhs.value;
  return { type: "string", value: result };
}
function interpret_numeric_binary_expr(lhs, rhs, operator) {
  let result = 0;
  if (operator.value == "+")
    result = lhs.value + rhs.value;
  else if (operator.value == "-")
    result = lhs.value - rhs.value;
  else if (operator.value == "*")
    result = lhs.value + rhs.value;
  else if (operator.value == "/")
    result = lhs.value / rhs.value;
  else if (operator.value == "%")
    result = lhs.value % rhs.value;
  else
    throw new Error("The operator " + operator.value + " was not setup for interpretation in numeric binary expressions.");
  return { type: "number", value: result };
}
function interpret_identifier(identifier, env) {
  const value = env.lookupVar(identifier.symbol);
  return value;
}
function interpret_object_expr(obj, env) {
  const object = { type: "object", properties: /* @__PURE__ */ new Map() };
  for (const { key, value } of obj.properties) {
    const runtimeValue = value == void 0 ? env.lookupVar(key) : interpret(value, env);
    object.properties.set(key, runtimeValue);
  }
  return object;
}
function interpret_member_expr(expr, env) {
  const lhs = interpret(expr.object, env);
  if (lhs.type == "object") {
    const obj = lhs;
    let value;
    if (expr.computed) {
      let computedValue;
      if (expr.property.kind == "StringLiteral")
        value = obj.properties.get(expr.property.value);
      else {
        computedValue = interpret(expr.property, env);
        if (!computedValue) {
          console.error("Cannot interpret member expression: ", expr.property);
          throw new Error("Cannot interpret member expression: " + JSON.stringify(expr.property));
        }
        value = obj.properties.get(computedValue.value);
      }
    } else {
      if (expr.property.kind == "Identifier")
        value = obj.properties.get(expr.property.symbol);
    }
    if (!value)
      value = create_null();
    return value;
  }
  return lhs;
}
function interpret_call_expr(expr, env) {
  const args = expr.args.map((arg) => interpret(arg, env));
  const fn = interpret(expr.caller, env);
  if (fn.type == "nativeFn") {
    const result = fn.call(args, env);
    return result;
  }
  if (fn.type == "function") {
    const func = fn;
    const scope = new Environment(func.declarationEnv);
    for (let i = 0; i < func.parameters.length; i++) {
      if (func.parameters.length < args.length) {
        throw new Error("Cannot assign more arguments than the function can handle: parameters: " + func.parameters.length + " passed arguments: " + args.length);
      } else if (func.parameters.length > args.length) {
        throw new Error("Cannot assign less arguments than the function handles: needed paramters: " + func.parameters.length);
      }
      const varname = func.parameters[i];
      scope.declareVar(varname, args[i], false);
    }
    let result = create_null();
    for (const stmt of func.body) {
      result = interpret(stmt, scope);
    }
    return result;
  }
  console.error("Cannot call value that is not a function: ", fn);
  throw new Error("Cannot call value that is not a function: " + JSON.stringify(fn));
}
function interpret_assignment(node, env) {
  if (node.assigne.kind !== "Identifier") {
    console.error("Invalid value for an assingment expression ", node.assigne);
    throw new Error("Invalid value for an assingment expression " + JSON.stringify(node.assigne));
  }
  const varname = node.assigne.symbol;
  return env.assignVar(varname, interpret(node.value, env));
}

// src/statements.ts
function interpret_program(program, env) {
  let lastInterpreted = create_null();
  for (const statement of program.body) {
    lastInterpreted = interpret(statement, env);
  }
  return lastInterpreted;
}
function interpret_var_declaration(declaration, env) {
  const value = declaration.value ? interpret(declaration.value, env) : create_null();
  return env.declareVar(declaration.identifier, value, declaration.constant);
}
function interpret_fn_declaration(declaration, env) {
  const fn = {
    type: "function",
    name: declaration.name,
    parameters: declaration.parameters,
    declarationEnv: env,
    body: declaration.body
  };
  return env.declareVar(declaration.name, fn, true);
}
function interpret_if_declaration(declaration, env) {
  const value = interpret(declaration.condition, env);
  if (value.value == true) {
    let result = create_null();
    for (const stmt of declaration.body) {
      result = interpret(stmt, env);
    }
    return result;
  } else if (declaration.elseIfDeclaration) {
    const elseValue = interpret_if_declaration(declaration.elseIfDeclaration, env);
    return elseValue;
  } else if (declaration.elseBody) {
    let result = create_null();
    for (const stmt of declaration.elseBody) {
      result = interpret(stmt, env);
    }
    return result;
  } else {
    return create_null();
  }
}
function interpret_for_declaration(declaration, env) {
  if (declaration.count.kind == "NumericLiteral") {
    let result;
    for (let i = 0; i < declaration.count.value; i++) {
      for (const stmt of declaration.body) {
        result = interpret(stmt, env);
      }
    }
    return result;
  } else {
    console.log("Count in interpretation of for declaration was not a numeric literal: ", declaration.count);
    return create_null();
  }
}

// src/interpreter.ts
function interpret(astNode, env) {
  switch (astNode.kind) {
    case "NumericLiteral":
      return { value: astNode.value, type: "number" };
    case "StringLiteral":
      return { value: astNode.value, type: "string" };
    case "Identifier":
      return interpret_identifier(astNode, env);
    case "ObjectLiteral":
      return interpret_object_expr(astNode, env);
    case "CallExpr":
      return interpret_call_expr(astNode, env);
    case "MemberExpr":
      return interpret_member_expr(astNode, env);
    case "BinaryExpr":
      return interpret_binary_expr(astNode, env);
    case "AssignmentExpr":
      return interpret_assignment(astNode, env);
    case "Program":
      return interpret_program(astNode, env);
    case "VarDeclaration":
      return interpret_var_declaration(astNode, env);
    case "FunctionDeclaration":
      return interpret_fn_declaration(astNode, env);
    case "IfDeclaration":
      return interpret_if_declaration(astNode, env);
    case "ForDeclaration":
      return interpret_for_declaration(astNode, env);
    default:
      console.error("This AST Node has not yet been setup for interpretation: ", astNode);
      throw new Error("This AST Node has not yet been setup for interpretation: " + JSON.stringify(astNode));
  }
}

// src/main.ts
var fs = __toESM(require("fs"));
function runLanguage(inputSource) {
  return __async(this, null, function* () {
    const env = createGlobalEnvironment();
    console.log("\nQuick Type v0.0.1\n");
    let input;
    if (inputSource.includes(".quicktype") || inputSource.includes(".quick") || inputSource.includes(".qt")) {
      input = fs.readFileSync(inputSource).toString();
    } else {
      input = inputSource;
    }
    const parser = new Parser();
    const program = parser.produceAST(input);
    const result = interpret(program, env);
  });
}

// src/index.ts
function run(input) {
  runLanguage(input);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
//# sourceMappingURL=index.js.map