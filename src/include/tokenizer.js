class Tokenizer {
    constructor(code) {
        this.code = code;
        this.position = 0;
        this.tokens = [];
    }

    tokenize() {
        console.log('Starting tokenization...');
        while (this.position < this.code.length) {
            const char = this.code[this.position];
            console.log(`Current char: '${char}' at position ${this.position}`);

            if (/\s/.test(char)) {
                this.position++;
            } else if (char === '<') {
                if (this.code[this.position + 1] === '-') {
                    this.tokenizeAssignment();
                } else {
                    this.tokenizeVariableDeclaration();
                }
            } else if (char === ';') {
                this.tokens.push({ type: 'SEMICOLON' });
                this.position++;
            } else if (char === ':' && this.code[this.position + 1] === ':') {
                this.tokenizeComment();
            } else if (/\d/.test(char)) {
                this.tokenizeNumber();
            } else if (char === '"') {
                this.tokenizeString();
            } else {
                this.tokenizeIdentifier();
            }
        }
        console.log('Tokenization complete:', this.tokens);
        return this.tokens;
    }

    tokenizeVariableDeclaration() {
        const start = this.position;
        while (this.code[this.position] !== '>') {
            this.position++;
        }
        this.position++;
        const value = this.code.slice(start, this.position);
        this.tokens.push({ type: 'VARIABLE_DECLARATION', value });
        console.log(`Tokenized variable declaration: ${value}`);
    }

    tokenizeAssignment() {
        if (this.code[this.position + 1] === '-') {
            this.tokens.push({ type: 'ASSIGNMENT' });
            this.position += 2;
            console.log('Tokenized assignment');
        } else {
            throw new Error('Unexpected token: ' + this.code[this.position]);
        }
    }

    tokenizeIdentifier() {
        const start = this.position;
        while (/\w/.test(this.code[this.position])) {
            this.position++;
        }
        const value = this.code.slice(start, this.position);
        this.tokens.push({ type: 'IDENTIFIER', value });
        console.log(`Tokenized identifier: ${value}`);
    }

    tokenizeNumber() {
        const start = this.position;
        while (/\d/.test(this.code[this.position])) {
            this.position++;
        }
        const value = this.code.slice(start, this.position);
        this.tokens.push({ type: 'NUMBER', value });
        console.log(`Tokenized number: ${value}`);
    }

    tokenizeString() {
        const start = this.position;
        this.position++; // Skip the opening quote
        while (this.position < this.code.length && this.code[this.position] !== '"') {
            this.position++;
        }
        this.position++; // Skip the closing quote
        const value = this.code.slice(start, this.position);
        this.tokens.push({ type: 'STRING', value });
        console.log(`Tokenized string: ${value}`);
    }

    tokenizeComment() {
        if (this.code[this.position + 2] === '>') {
            this.tokenizeMultiLineComment();
        } else {
            this.tokenizeSingleLineComment();
        }
    }

    tokenizeSingleLineComment() {
        const start = this.position;
        while (this.position < this.code.length && this.code[this.position] !== '\n') {
            this.position++;
        }
        const value = this.code.slice(start, this.position);
        this.tokens.push({ type: 'COMMENT', value });
        console.log(`Tokenized single-line comment: ${value}`);
    }

    tokenizeMultiLineComment() {
        const start = this.position;
        this.position += 3; // Skip "::>"
        while (this.position < this.code.length && !(this.code[this.position] === '<' && this.code[this.position + 1] === ':' && this.code[this.position + 2] === ':')) {
            this.position++;
        }
        this.position += 3; // Skip "<::"
        const value = this.code.slice(start, this.position);
        this.tokens.push({ type: 'COMMENT', value });
        console.log(`Tokenized multi-line comment: ${value}`);
    }
}

export default Tokenizer;