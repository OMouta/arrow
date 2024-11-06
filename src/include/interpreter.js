class Interpreter {
    constructor() {
        this.environment = {}; // Store variable values
    }

    evaluate(ast) {
        for (const node of ast) {
            if (node.type === "Assignment") this.evalAssignment(node);
        }
    }

    evalAssignment(node) {
        const value = this.evalExpression(node.value);
        this.environment[node.name] = value;
    }

    evalExpression(node) {
        if (node.type === "Literal") return this.evalLiteral(node);
        if (node.type === "BinaryExpression") return this.evalBinaryExpression(node);
        return null;
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

    evalLiteral(node) {
        return node.value;
    }
}

export default Interpreter;