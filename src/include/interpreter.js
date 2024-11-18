class Interpreter {
    constructor(debug = false) {
        this.environment = {};
        this.functions = {};
        this.types = {
            '<int>': value => Number.isInteger(value),
            '<float>': value => typeof value === 'number' && !Number.isInteger(value),
            '<str>': value => typeof value === 'string',
            '<bool>': value => typeof value === 'boolean',
            '<any>': () => true,
            '<null>': value => value === undefined || value === null,
        };
        this.constants = new Set();
        this.debug = debug;
    }

    evaluate(node) {
        if (this.debug) console.log('Evaluating node:', node);
        switch (node.type) {
            case 'Program':
                return this.evaluateProgram(node);
            case 'VariableDeclaration':
                return this.evaluateVariableDeclaration(node);
            case 'Assignment':
                return this.evaluateAssignment(node);
            case 'FunctionDeclaration':
                return this.evaluateFunctionDeclaration(node);
            case 'CallExpression':
                return this.evaluateCallExpression(node);
            case 'ReturnStatement':
                return this.evaluateReturnStatement(node);
            default:
                throw new Error('Unknown node type: ' + node.type);
        }
    }

    evaluateProgram(node) {
        node.body.forEach(statement => this.evaluate(statement));
        if (!this.functions['main']) {
            throw new Error('Missing main function');
        }
        this.evaluateCallExpression({
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'main' },
            arguments: []
        });
    }

    evaluateVariableDeclaration(node) {
        const name = node.id.name;
        const value = node.init.value;
        const type = node.kind;

        const isConst = type.startsWith('<const');
        const baseType = isConst ? type.replace('<const ', '<') : type;

        if (!this.types[baseType]) {
            throw new Error(`Unknown type: ${type}`);
        }

        if (!this.types[baseType](value)) {
            throw new Error(`Type error: Expected ${baseType} but got ${typeof value}`);
        }

        this.environment[name] = value;
        if (isConst) {
            this.constants.add(name);
        }
        if (this.debug) console.log('Environment updated:', this.environment);
    }

    evaluateAssignment(node) {
        const name = node.id.name;
        const value = node.value.value;

        if (!(name in this.environment)) {
            throw new Error(`Undefined variable: ${name}`);
        }

        if (this.constants.has(name)) {
            throw new Error(`Cannot reassign constant variable: ${name}`);
        }

        this.environment[name] = value;
        if (this.debug) console.log('Environment updated:', this.environment);
    }

    evaluateFunctionDeclaration(node) {
        const name = node.id.name;
        this.functions[name] = node;
        if (this.debug) console.log('Function registered:', name);
    }

    evaluateCallExpression(node) {
        const func = this.functions[node.callee.name];
        if (!func) {
            throw new Error(`Undefined function: ${node.callee.name}`);
        }

        const args = node.arguments.map(arg => this.evaluate(arg));
        const localEnv = { ...this.environment };

        func.params.forEach((param, index) => {
            localEnv[param.value] = args[index];
        });

        let returnValue;
        for (const statement of func.body.body) {
            const result = this.evaluate(statement, localEnv);
            if (result && result.type === 'ReturnStatement') {
                returnValue = result.value;
                break;
            }
        }

        const returnType = func.returnType.replace('<fn ', '<').trim();
        if (!this.types[returnType](returnValue)) {
            throw new Error(`Type error: Expected ${returnType} but got ${typeof returnValue}`);
        }

        return returnValue;
    }

    evaluateReturnStatement(node) {
        return {
            type: 'ReturnStatement',
            value: node.argument.value
        };
    }
}

export default Interpreter;