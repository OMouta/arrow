class Interpreter {
    constructor(debug = false) {
        this.environment = {};
        this.types = {
            '<int>': value => Number.isInteger(value),
            '<float>': value => typeof value === 'number' && !Number.isInteger(value),
            '<str>': value => typeof value === 'string',
            '<bool>': value => typeof value === 'boolean',
            '<any>': () => true
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
            default:
                throw new Error('Unknown node type: ' + node.type);
        }
    }

    evaluateProgram(node) {
        node.body.forEach(statement => this.evaluate(statement));
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
}

export default Interpreter;