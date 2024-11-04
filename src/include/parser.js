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
        if (token && token.type === "IDENTIFIER") return this.parseAssignment();
        this.advance();
        return null;
    }

    parseAssignment() {
        const identifier = this.advance(); // var name
        this.expect("OPERATOR", "<=="); // assignment operator
        const value = this.parseExpression();
        return { type: "Assignment", name: identifier.value, value };
    }

    parseExpression() {
        const token = this.peek();
        if (token.type === "NUMBER") return this.literal("NUMBER");
        if (token.type === "STRING") return this.literal("STRING");
        return null;
    }

    literal(type) {
        const token = this.expect(type);
        return { type: "Literal", value: token.value };
    }

    expect(type, value = null) {
        const token = this.advance();
        if (!token || token.type !== type || (value && token.value !== value)) {
            throw new Error(`Expected ${value || type}, got ${token ? token.value : "EOF"}`);
        }
        return token;
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