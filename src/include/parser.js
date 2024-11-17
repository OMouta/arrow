class Parser {
    constructor(tokens, debug = false) {
        this.tokens = tokens;
        this.position = 0;
        this.debug = debug;
    }

    parse() {
        if (this.debug) console.log('Starting parsing...');
        const ast = {
            type: 'Program',
            body: []
        };

        while (this.position < this.tokens.length) {
            const statement = this.parseStatement();
            if (statement) {
                ast.body.push(statement);
            }
        }

        if (this.debug) console.log('Parsing complete:', ast);
        return ast;
    }

    parseStatement() {
        const token = this.tokens[this.position];

        if (token.type === 'VARIABLE_DECLARATION') {
            return this.parseVariableDeclaration();
        }

        if (token.type === 'COMMENT') {
            this.position++;
            return null;
        }

        if (token.type === 'IDENTIFIER') {
            const nextToken = this.tokens[this.position + 1];
            if (nextToken && nextToken.type === 'ASSIGNMENT') {
                return this.parseAssignment();
            }
        }

        throw new Error('Unexpected token: ' + token.type);
    }

    parseVariableDeclaration() {
        const token = this.tokens[this.position];
        this.position++;

        const identifierToken = this.tokens[this.position];
        if (identifierToken.type !== 'IDENTIFIER') {
            throw new Error('Expected identifier, got: ' + identifierToken.type);
        }
        this.position++;

        const assignmentToken = this.tokens[this.position];
        if (assignmentToken.type !== 'ASSIGNMENT') {
            throw new Error('Expected assignment, got: ' + assignmentToken.type);
        }
        this.position++;

        const valueToken = this.tokens[this.position];
        let value;
        if (valueToken.type === 'NUMBER') {
            value = Number(valueToken.value);
        } else if (valueToken.type === 'STRING') {
            value = valueToken.value.slice(1, -1); // Remove quotes
        } else {
            throw new Error('Expected value, got: ' + valueToken.type);
        }
        this.position++;

        return {
            type: 'VariableDeclaration',
            kind: token.value,
            id: {
                type: 'Identifier',
                name: identifierToken.value
            },
            init: {
                type: valueToken.type === 'NUMBER' ? 'NumericLiteral' : 'StringLiteral',
                value: value
            }
        };
    }

    parseAssignment() {
        const identifierToken = this.tokens[this.position];
        if (identifierToken.type === 'IDENTIFIER') {
            this.position++;
        } else {
            throw new Error('Expected identifier, got: ' + identifierToken.type);
        }

        const assignmentToken = this.tokens[this.position];
        if (assignmentToken.type !== 'ASSIGNMENT') {
            throw new Error('Expected assignment, got: ' + assignmentToken.type);
        }
        this.position++;

        const valueToken = this.tokens[this.position];
        let value;
        if (valueToken.type === 'NUMBER') {
            value = Number(valueToken.value);
        } else if (valueToken.type === 'STRING') {
            value = valueToken.value.slice(1, -1); // Remove quotes
        } else {
            throw new Error('Expected value, got: ' + valueToken.type);
        }
        this.position++;

        return {
            type: 'Assignment',
            id: {
                type: 'Identifier',
                name: identifierToken.value
            },
            value: {
                type: valueToken.type === 'NUMBER' ? 'NumericLiteral' : 'StringLiteral',
                value: value
            }
        };
    }
}

export default Parser;