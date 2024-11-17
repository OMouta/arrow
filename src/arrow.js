/*
# Syntax Reference

## 1. Assignment

### Basic Assignment:
```arrow
<type> variableName <- value
```

Examples:
```arrow
<str> message <- "Hello Arrow"
```

## 2. Function Definition and Invocation

### Function Definition:
```arrow
<bool fn> functionName(<const int> arg1, <const float> arg2 ) {
    // function body
    -> returnValue
}
```

- `<bool fn>`: Denotes the start of a function and its return type.
- `->`: Return keyword, followed by value.

### Function Invocation:
```arrow
functionName(arg1, arg2, ...)
```

Examples:
```arrow
<str fn> greetUser(<const str> name) {
    -> "Hello, " + name
}

message <- greetUser("ArrowUser")
```

## 3. Operators and Expressions

### Arithmetic Operators:

- Addition: `x + y`
- Subtraction: `x - y`
- Multiplication: `x * y`
- Division: `x / y`

### Logical Operators:

- And: `x && y`
- Or: `x || y`
- Not: `!! x`

### Comparison Operators:

- Equal to: `x == y`
- Not equal to: `x != y`
- Greater than: `x > y`
- Less than: `x < y`
- Greater than or equal to: `x >= y`
- Less than or equal to: `x <= y`

Examples:
```arrow
<var> result <- x + y
<var> isActive <- flag && condition
<var> isEqual <- x == y
<var> isNotEqual <- x != y
<var> isGreater <- x > y
<var> isLesser <- x < y
<var> isGreaterOrEqual <- x >= y
<var> isLesserOrEqual <- x <= y
```

## 4. Control Flow Statements

### If-Else Conditionals:

```arrow
if -> condition {
    // if block
} elif -> condition {
    // else block
} else {
    // else block
}
```

### While Loop:

```arrow
while -> condition {
    // loop body
}
```

### For Loop:

```arrow
for -> init ; condition ; increment {
    // loop body
}
```

Examples:

```arrow
if -> score >= 50 {
    result <- "Pass"
} else {
    result <- "Fail"
}

i <== 0
while -> i < 5 {
    i <- i + 1
}
```

## 5. Arrays and Objects

### Array Declaration:

```arrow
<any> arrayName <- [item1, item2, ...]
```

### Access Array Elements:

```arrow
<any> item <- arrayName[index]
```

### Object Declaration:

```arrow
<obj> objectName <- { key1: value1, key2: value2, ... }
```

### Access Object Properties:

```arrow
<any> propertyValue <- objectName.key
```

Examples:
```arrow
<int> items <== [10, 20, 30]
<int> firstItem <== items[0]

<obj> settings <== { volume: 75, theme: "dark" }
<str> currentTheme <== settings.theme
```

## 6. Built-In Functions

### Print (Output to console):

```arrow
print(message)
```

### Input (User input):

```arrow
<str> inputValue <- input("Prompt message")
```

- `print`: Outputs the provided message to the console or display.
- `input`: Displays a prompt and waits for user input.

Examples:

```arrow
print("Hello, Arrow!")
<str> userName <- input("Enter your name: ")
```

## 7. Comments

### Single-Line Comment:

```arrow
:: This is a comment
```

### Multi-Line Comment:

```arrow
::> This
is
a
comment <::
```

## 8. Full Example Code

```arrow
:: Declare variables
<const int> age <- 25
<const str> name <- "ArrowLang"

:: Function definition with return type
<bool fn> isValidAge(<const int> userAge) {
    if -> userAge >= 18 {
        -> true
    } else {
        -> false
    }
}

:: Function call
<const bool> canVote <- isValidAge(age)

:: Using a loop with an array
<const int> values <- [10, 20, 30]
<var int> sum <- 0

for -> i <- 0 ; i < values.length ; i <- i + 1 {
    sum <- sum + values[i]
}

:: Output the sum
print("Total Sum: " + sum)
```
*/

import fs from 'node:fs';
import path from 'node:path';
import process from "node:process";

// Read the Arrow code from a file in the arguments
const filePath = path.resolve(process.argv[2]);
const debug = process.argv[3] === '--debug';

if (!fs.existsSync(filePath)) {
    console.error('File not found');
    process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf-8');

const startTime = Date.now();

// Import the necessary classes from the include folder
import Tokenizer from './include/tokenizer.js';
import Parser from './include/parser.js';
import Interpreter from './include/interpreter.js';

try {
    // Step 1: Tokenize
    const tokenizer = new Tokenizer(code);
    const tokens = tokenizer.tokenize();

    if (debug) {
        console.log('Tokens:');
        console.log(tokens);
    }

    // Step 2: Parse
    const parser = new Parser(tokens);
    const ast = parser.parse();

    if (debug) {
        console.log('Abstract Syntax Tree (AST):');
        console.log(ast);
    }

    // Step 3: Evaluate
    const interpreter = new Interpreter();
    interpreter.evaluate(ast);

    const endTime = Date.now();

    // Output the result of interpretation
    if (debug) {
        console.log('Environment:');
        console.log(interpreter.environment);
    }

    console.log('Program exited successfully in ' + (endTime - startTime) + 'ms');
} catch (error) {
    console.error('Error:', error.message);
    console.error('Suggested fix:', getSuggestedFix(error.message));
    process.exit(1);
}

function getSuggestedFix(errorMessage) {
    if (errorMessage.includes('Expected')) {
        return 'Check the syntax near the indicated line and column.';
    }
    if (errorMessage.includes('Undefined variable')) {
        return 'Ensure the variable is declared before use.';
    }
    if (errorMessage.includes('Cannot reassign constant variable')) {
        return 'Avoid reassigning a constant variable.';
    }
    return 'Refer to the documentation for more details.';
}