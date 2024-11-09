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

        //console.log(`Processing char: ${char} at position: ${this.position}`);

        if (char === ':' && this.input[this.position + 1] === ':') {
            if (this.input[this.position + 2] === '>') return this.multiLineComment();
            return this.singleLineComment();
        }

        if (char === '<') {
            if (this.input.slice(this.position, this.position + 5) === '<var>') {
                this.position += 5;
                return { type: "KEYWORD", value: "var" };
            }
            if (this.input.slice(this.position, this.position + 7) === '<const>') {
                this.position += 7;
                return { type: "KEYWORD", value: "const" };
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
        return { type: "COMMENT", value: this.input.slice(start, this.position) };
    }

    multiLineComment() {
        this.position += 3; // Skip ::>
        const start = this.position;
        while (this.position < this.input.length && !(this.input[this.position] === '<' && this.input[this.position + 1] === ':' && this.input[this.position + 2] === ':')) {
            this.position++;
        }
        this.position += 3; // Skip <::
        return { type: "COMMENT", value: this.input.slice(start, this.position - 3) };
    }

    identifier() {
        const start = this.position;
        while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.position])) {
            //onsole.log(`Processing identifier char: ${this.input[this.position]} at position: ${this.position}`);
            this.position++;
        }
        const value = this.input.slice(start, this.position);
        //console.log(`Identifier found: ${value}`);
        return { type: "IDENTIFIER", value };
    }

    number() {
        const start = this.position;
        while (this.position < this.input.length && /[0-9]/.test(this.input[this.position])) this.position++;
        if (this.position < this.input.length && this.input[this.position] === '.') {
            this.position++;
            while (this.position < this.input.length && /[0-9]/.test(this.input[this.position])) this.position++;
        }
        return { type: "NUMBER", value: parseFloat(this.input.slice(start, this.position)) };
    }

    operator() {
        const operators = ["<==", "<:", ":>", "<+>", "<->", "<*>", "</>", "<&&>", "<||>", "<!!>", "<=>", "<!=>", "<>>", "<<>", "<>=>", "<<=>"];
        for (const op of operators) {
            if (this.input.slice(this.position, this.position + op.length) === op) {
                this.position += op.length;
                return { type: "OPERATOR", value: op };
            }
        }
        // Handle basic operators
        const basicOperators = ['+', '-', '*', '/'];
        if (basicOperators.includes(this.input[this.position])) {
            return { type: "OPERATOR", value: this.input[this.position++] };
        }
        return null;
    }

    punctuation() {
        return { type: "PUNCTUATION", value: this.input[this.position++] };
    }

    string() {
        this.position++; // Skip starting quote
        const start = this.position;
        while (this.position < this.input.length && this.input[this.position] !== '"') this.position++;
        const value = this.input.slice(start, this.position);
        this.position++; // Skip ending quote
        return { type: "STRING", value };
    }

    colon() {
        this.position++;
        return { type: "COLON", value: ":" };
    }

    expect(type, value = null) {
        const token = this.advance();
        if (!token || token.type !== type || (value && token.value !== value)) {
            throw new Error(`Expected ${value || type}, got ${token ? token.value : "EOF"} at line ${this.line}, column ${this.column}`);
        }
        return token;
    }

    tokenize() {
        const tokens = [];
        let token;
        while ((token = this.nextToken()) !== null) {
            //console.log(`Token: ${JSON.stringify(token)}`);
            tokens.push(token);
        }
        return tokens;
    }
}

export default Tokenizer;