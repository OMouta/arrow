class Tokenizer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }

    nextToken() {
        this.skipWhitespace();

        if (this.position >= this.input.length) return null;

        const char = this.input[this.position];

        if (char === ':' && this.input[this.position + 1] === ':') {
            if (this.input[this.position + 2] === '>') return this.multiLineComment();
            return this.singleLineComment();
        }

        if (char === '<') {
            if (this.input.slice(this.position, this.position + 5) === '<var>') {
                this.position += 5;
                return { type: "KEYWORD", value: "var", line: this.line, column: this.column };
            }
            if (this.input.slice(this.position, this.position + 7) === '<const>') {
                this.position += 7;
                return { type: "KEYWORD", value: "const", line: this.line, column: this.column };
            }
        }

        if (/[a-zA-Z_]/.test(char)) return this.identifier();
        if (/[0-9]/.test(char)) return this.number();
        if (char === '<' || char === '>') return this.operator();
        if (char === '{' || char === '}' || char === '(' || char === ')') return this.punctuation();
        if (char === '"') return this.string();
        if (char === ':') return this.colon();

        this.position++;
        this.column++;
        return { type: "UNKNOWN", value: char, line: this.line, column: this.column };
    }

    skipWhitespace() {
        while (/\s/.test(this.input[this.position])) {
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.position++;
        }
    }

    singleLineComment() {
        this.position += 2; // Skip ::
        const start = this.position;
        while (this.position < this.input.length && this.input[this.position] !== '\n') this.position++;
        return { type: "COMMENT", value: this.input.slice(start, this.position), line: this.line, column: this.column };
    }

    multiLineComment() {
        this.position += 3; // Skip ::>
        const start = this.position;
        while (this.position < this.input.length && !(this.input[this.position] === '<' && this.input[this.position + 1] === ':' && this.input[this.position + 2] === ':')) {
            this.position++;
        }
        this.position += 3; // Skip <::
        return { type: "COMMENT", value: this.input.slice(start, this.position - 3), line: this.line, column: this.column };
    }

    identifier() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.position])) {
            this.position++;
            this.column++;
        }
        const value = this.input.slice(start, this.position);
        return { type: "IDENTIFIER", value, line: startLine, column: startColumn };
    }

    number() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        while (this.position < this.input.length && /[0-9]/.test(this.input[this.position])) {
            this.position++;
            this.column++;
        }
        if (this.position < this.input.length && this.input[this.position] === '.') {
            this.position++;
            this.column++;
            while (this.position < this.input.length && /[0-9]/.test(this.input[this.position])) {
                this.position++;
                this.column++;
            }
        }
        return { type: "NUMBER", value: parseFloat(this.input.slice(start, this.position)), line: startLine, column: startColumn };
    }

    operator() {
        const operators = ["<==", "<:", ":>", "<+>", "<->", "<*>", "</>", "<&&>", "<||>", "<!!>", "<=>", "<!=>", "<>>", "<<>", "<>=>", "<<=>"];
        for (const op of operators) {
            if (this.input.slice(this.position, this.position + op.length) === op) {
                const startLine = this.line;
                const startColumn = this.column;
                this.position += op.length;
                this.column += op.length;
                return { type: "OPERATOR", value: op, line: startLine, column: startColumn };
            }
        }
        // Handle basic operators
        const basicOperators = ['+', '-', '*', '/'];
        if (basicOperators.includes(this.input[this.position])) {
            const startLine = this.line;
            const startColumn = this.column;
            return { type: "OPERATOR", value: this.input[this.position++], line: startLine, column: startColumn };
        }
        return null;
    }

    punctuation() {
        const startLine = this.line;
        const startColumn = this.column;
        return { type: "PUNCTUATION", value: this.input[this.position++], line: startLine, column: startColumn };
    }

    string() {
        const startLine = this.line;
        const startColumn = this.column;
        this.position++; // Skip starting quote
        this.column++;
        const start = this.position;
        while (this.position < this.input.length && this.input[this.position] !== '"') {
            this.position++;
            this.column++;
        }
        const value = this.input.slice(start, this.position);
        this.position++; // Skip ending quote
        this.column++;
        return { type: "STRING", value, line: startLine, column: startColumn };
    }

    colon() {
        const startLine = this.line;
        const startColumn = this.column;
        this.position++;
        this.column++;
        return { type: "COLON", value: ":", line: startLine, column: startColumn };
    }

    tokenize() {
        const tokens = [];
        let token;
        while ((token = this.nextToken()) !== null) {
            tokens.push(token);
        }
        return tokens;
    }
}

export default Tokenizer;