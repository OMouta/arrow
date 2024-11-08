class Interpreter {
    constructor() {
        this.environment = {}; // Store variable values
    }

    evaluate(ast) {
        for (const node of ast) {
            if (node.type === "Declaration") this.evalDeclaration(node);
            if (node.type === "Assignment") this.evalAssignment(node);
        }
    }

    evalDeclaration(node) {
        const value = node.value ? this.evalExpression(node.value) : null;
        this.environment[node.name] = { value, kind: node.kind };
    }

    evalAssignment(node) {
        const value = this.evalExpression(node.value);
        if (this.environment[node.name] && this.environment[node.name].kind === "const") {
            throw new Error(`Cannot reassign constant variable: ${node.name}`);
        }
        this.environment[node.name] = { value, kind: "var" };
    }

    evalExpression(node) {
        if (node.type === "Literal") return this.evalLiteral(node);
        if (node.type === "BinaryExpression") return this.evalBinaryExpression(node);
        if (node.type === "Variable") return this.evalVariable(node);
        return null;
    }

    evalVariable(node) {
        if (!this.environment[node.name]) {
            throw new Error(`Undefined variable: ${node.name}`);
        }
        return this.environment[node.name].value;
    }

    evalLiteral(node) {
        return node.value;
    }

    evalBinaryExpression(node) {
        const left = this.evalExpression(node.left);
        const right = this.evalExpression(node.right);
        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            case '<+>': return left + right;
            case '<->': return left - right;
            case '<*>': return left * right;
            case '</>': return left / right;
            default: throw new Error(`Unknown operator: ${node.operator}`);
        }
    }
}

export default Interpreter;