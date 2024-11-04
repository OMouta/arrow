class Interpreter {
    constructor() {
        this.environment = {}; // Store variable values
    }

    evaluate(ast) {
        for (let node of ast) {
            if (node.type === "Assignment") this.evalAssignment(node);
        }
    }

    evalAssignment(node) {
        const value = this.evalExpression(node.value);
        this.environment[node.name] = value;
    }

    evalExpression(node) {
        if (node.type === "Literal") return this.evalLiteral(node);
        return null;
    }

    evalLiteral(node) {
        return node.value;
    }
}

export default Interpreter;