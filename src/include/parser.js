class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    parse() {
        const ast = [];
        while (!this.isAtEnd()) {
            const node = this.parseStatement();
            if (node) ast.push(node);
        }
        return ast;
    }

    parseStatement() {
        const token = this.peek();
        if (token && token.type === "COMMENT") {
            this.advance(); // Skip comments
            return null;
        }
        if (token && token.type === "KEYWORD") return this.parseDeclaration();
        if (token && token.type === "IDENTIFIER") return this.parseAssignment();
        this.advance();
        return null;
    }

    parseDeclaration() {
        const keyword = this.advance(); // <var> or <const>
        const identifier = this.expect("IDENTIFIER"); // variable name
        let value = null;
        if (this.match("OPERATOR") && this.previous().value === "<==") {
            value = this.parseExpression();
        }
        return { type: "Declaration", kind: keyword.value, name: identifier.value, value, line: keyword.line, column: keyword.column };
    }

    parseAssignment() {
        const identifier = this.advance(); // var name
        this.expect("OPERATOR", "<=="); // assignment operator
        const value = this.parseExpression();
        return { type: "Assignment", name: identifier.value, value, line: identifier.line, column: identifier.column };
    }

    parseExpression() {
        if (this.match("OPERATOR") && this.previous().value === "<!!>") {
            const operator = this.previous();
            const right = this.parsePrimary();
            return { type: "UnaryExpression", operator: operator.value, right, line: operator.line, column: operator.column };
        }
        let left = this.parsePrimary();
        while (this.match("OPERATOR")) {
            const operator = this.previous();
            const right = this.parsePrimary();
            left = { type: "BinaryExpression", operator: operator.value, left, right, line: operator.line, column: operator.column };
        }
        return left;
    }

    parsePrimary() {
        const token = this.peek();
        if (token.type === "NUMBER") return this.literal("NUMBER");
        if (token.type === "STRING") return this.literal("STRING");
        if (token.type === "IDENTIFIER") return this.variable();
        return null;
    }

    variable() {
        const token = this.advance();
        return { type: "Variable", name: token.value, line: token.line, column: token.column };
    }

    literal(type) {
        const token = this.expect(type);
        return { type: "Literal", value: token.value, line: token.line, column: token.column };
    }

    expect(type, value = null) {
        const token = this.advance();
        if (!token || token.type !== type || (value && token.value !== value)) {
            throw new Error(`Expected ${value || type}, got ${token ? token.value : "EOF"} at line ${token.line}, column ${token.column}`);
        }
        return token;
    }

    match(type) {
        const token = this.peek();
        if (token && token.type === type) {
            this.advance();
            return true;
        }
        return false;
    }

    previous() {
        return this.tokens[this.position - 1];
    }

    peek() {
        return this.tokens[this.position];
    }

    advance() {
        return this.tokens[this.position++];
    }

    isAtEnd() {
        return this.position >= this.tokens.length;
    }
}

export default Parser;