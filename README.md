# Arrow Language
[Setup](#setup) | [Syntax Reference](#syntax-reference)

<img src="assets/arrow_logo.png" alt="Arrow-Logo" width="200" height="200"> <img src="assets/arrow_full.png" alt="Arrow-Logo" width="200" height="200"> <img src="assets/arrow_bw.png" alt="Arrow-Logo" width="200" height="200">

## Description

Arrow is a fun, experimental interpreted programming language that uses arrows and special syntax elements to make programming visually intuitive and compact. Developed using JavaScript in the `Deno 2` ecosystem, Arrow is intended for programmers who enjoy minimalist and symbolic syntax, allowing for efficient expressions and type-checked assignments. This language is especially suited for developers interested in learning about language design, parsing, and interpreter construction.

## Purpose
Arrow aims to create an intuitive programming experience focused on simplicity and a unique syntax that is both visually distinct and easy to read. With features like variable type-checking, flexible function definitions, and arrow-based operators, Arrow provides an alternative way to experiment with programming fundamentals, control structures, and I/O. It’s designed as a sandbox for learning and expanding language development skills in a modular, extensible way.

## Feature Table

| Feature                  | Description                                           | Status           |
|--------------------------|-------------------------------------------------------|------------------|
| Variable Declaration     | Declares and assigns values to variables.             | ✅ Implemented - Needs Improvements   |
| Type-Checked Assignment  | Assigns values with enforced type checks.             | 🔲 Not Implemented   |
| Basic Operators          | Supports addition, subtraction, multiplication, and division. | ✅ Implemented  - Needs Improvements   |
| Logical Operators        | And, Or, Not operators for conditional logic.         | 🔲 Not Implemented |
| Function Definition      | Defines functions with arguments and optional return types. | 🔲 Not Implemented   |
| Function Invocation      | Calls functions with arguments.                       | 🔲 Not Implemented   |
| If-Else Conditionals     | Branches code based on conditions.                    | 🔲 Not Implemented   |
| While Loop               | Executes code while a condition is true.              | 🔲 Not Implemented |
| For Loop                 | Executes code a fixed number of times.                | 🔲 Not Implemented |
| Array Declaration        | Declares arrays for storing ordered data.             | 🔲 Not Implemented |
| Array Access             | Accesses elements within an array by index.           | 🔲 Not Implemented |
| Object Declaration       | Declares objects with key-value pairs.                | 🔲 Not Implemented |
| Object Property Access   | Accesses properties of an object by key.              | 🔲 Not Implemented |
| Built-In Functions       | Includes print for output and input for user input.   | 🔲 Not Implemented   |
| Comments                 | Allows single and multi line comments for documentation.        | ✅ Implemented   |

# Setup

To get started with the Arrow language, follow these steps:

## 1. Install Deno 2

First, you need to install Deno 2. You can download and install it from the [official Deno website](https://deno.land/).

## 2. Clone the Repository

Clone this repository to your local machine using the following command:

```sh
git clone https://github.com/OMouta/arrow.git
cd arrow-lang
```

## 3. Run the Scripts

You can use the scripts defined in the `deno.jsonc` file to run and test the Arrow language.

### Run the Arrow Interpreter

To run the Arrow interpreter, use the following command:

```sh
deno task run path/to/your/arrow/code.arrow
```

### Run the Tests

To run the tests with debug information, use the following command:

```sh
deno task test
```

This will execute the Arrow code in the `test/test.arrow` file and output debug information.

# Syntax Reference

## 1. Variable Declaration and Assignment

### Basic Assignment:
```arrow
variableName <== value
```

### Type-Checked Assignment:
```arrow
variableName <: type :> <== value
```

(Throws an error if `value` doesn’t match `type`)

Examples:
```arrow
count <== 42
message <: string :> <== "Hello Arrow"
```

## 2. Function Definition and Invocation

### Function Definition:
```arrow
==> functionName(arg1 <: type1 :>, arg2 <: type2 :>) <: returnType :> {
    // function body
    --> returnValue
}
```

- `==>`: Denotes the start of a function definition.
- `<: returnType :>`: Optional type annotation for the return value.
- `-->`: Return keyword, followed by value.

### Function Invocation:
```arrow
functionName >> (arg1, arg2, ...)
```

Examples:
```arrow
==> greetUser(name <: string :>) <: string :> {
    --> "Hello, " <+> name
}

message <== greetUser >> ("ArrowUser")
```

## 3. Operators and Expressions

### Arithmetic Operators:

- Addition: `x <+> y`
- Subtraction: `x <-> y`
- Multiplication: `x <*> y`
- Division: `x </> y`

### Logical Operators:

- And: `x <&&> y`
- Or: `x <||> y`
- Not: `<!!> x`

Examples:
```arrow
result <== x <+> y
isActive <== flag <&&> condition
```

## 4. Control Flow Statements

### If-Else Conditionals:

```arrow
?? -> (condition) {
    // if block
} ?? else {
    // else block
}
```

### While Loop:

```arrow
@@ -> (condition) {
    // loop body
}
```

### For Loop:

```arrow
@@ for (init ; condition ; increment) {
    // loop body
}
```

Examples:

```arrow
?? -> (score >= 50) {
    result <== "Pass"
} ?? else {
    result <== "Fail"
}

i <== 0
@@ -> (i < 5) {
    i <== i <+> 1
}
```

## 5. Arrays and Objects

### Array Declaration:

```arrow
arrayName <== [item1, item2, ...]
```

### Access Array Elements:

```arrow
item <== arrayName[index]
```

### Object Declaration:

```arrow
objectName <== { key1: value1, key2: value2, ... }
```

### Access Object Properties:

```arrow
propertyValue <== objectName.key
```

Examples:
```arrow
items <== [10, 20, 30]
firstItem <== items[0]

settings <== { volume: 75, theme: "dark" }
currentTheme <== settings.theme
```

## 6. Built-In Functions

### Print (Output to console):

```arrow
print >> (message)
```

### Input (User input):

```arrow
inputValue <== input >> ("Prompt message")
```

- `print`: Outputs the provided message to the console or display.
- `input`: Displays a prompt and waits for user input.

Examples:

```arrow
print >> ("Hello, Arrow!")
userName <== input >> ("Enter your name: ")
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
age <: int :> <== 25
name <: string :> <== "ArrowLang"

:: Function definition with return type
==> isValidAge(userAge <: int :>) <: bool :> {
    ?? -> (userAge >= 18) {
        --> true
    } ?? else {
        --> false
    }
}

:: Function call
canVote <== isValidAge >> (age)

:: Using a loop with an array
values <== [10, 20, 30]
sum <== 0

@@ for (i <== 0 ; i < values.length ; i <== i <+> 1) {
    sum <== sum <+> values[i]
}

:: Output the sum
print >> ("Total Sum: " <+> sum)
```
