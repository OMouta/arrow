class Tokenizer {
    constructor(input) {
        this.input = input;
        this.position = 0;
    }

    // Read the next token
    nextToken() {
        this.skipWhitespace();

        if (this.position >= this.input.length) return null;

        const char = this.input[this.position];

        // Tokenize based on character patterns
        if (/[a-zA-Z_]/.test(char)) return this.identifier();
        if (/[0-9]/.test(char)) return this.number();
        if (char === '<' || char === '>') return this.operator();
        if (char === '{' || char === '}' || char === '(' || char === ')') return this.punctuation();
        if (char === '"') return this.string();
        if (char === ':') return this.colon();

        this.position++;
        return { type: "UNKNOWN", value: char };
    }

    skipWhitespace() {
        while (/\s/.test(this.input[this.position])) this.position++;
    }

    identifier() {
        let start = this.position;
        while (/[a-zA-Z0-9_]/.test(this.input[this.position])) this.position++;
        return { type: "IDENTIFIER", value: this.input.slice(start, this.position) };
    }

    number() {
        let start = this.position;
        while (/[0-9]/.test(this.input[this.position])) this.position++;
        return { type: "NUMBER", value: this.input.slice(start, this.position) };
    }

    operator() {
        const operators = ["<==", "<:", ":>", "<+>", "<->", "<*>", "</>"];
        for (let op of operators) {
            if (this.input.slice(this.position, this.position + op.length) === op) {
                this.position += op.length;
                return { type: "OPERATOR", value: op };
            }
        }
        return null;
    }

    punctuation() {
        return { type: "PUNCTUATION", value: this.input[this.position++] };
    }

    string() {
        this.position++; // Skip starting quote
        let start = this.position;
        while (this.input[this.position] !== '"' && this.position < this.input.length) this.position++;
        const value = this.input.slice(start, this.position);
        this.position++; // Skip ending quote
        return { type: "STRING", value };
    }

    colon() {
        this.position++;
        return { type: "COLON", value: ":" };
    }

    tokenize() {
        const tokens = [];
        let token;
        while ((token = this.nextToken()) !== null) tokens.push(token);
        return tokens;
    }
}

export default Tokenizer;