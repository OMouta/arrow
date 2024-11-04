/*
Language Specifications

1. File Extension

File Extension: .arrw

This extension is short and memorable, and it captures the essence of the language name.

2. Comment Syntax

Single-line comments: //→ or simply //

Example:
//→ This is a single-line comment

Multi-line comments: Start with ⟦ and end with ⟧

Example:
⟦
This is a multi-line comment
describing the function below.
⟧

3. Data Types

Primitive Types:

Integer: Represents whole numbers
Float: For decimal numbers
Text: A string of characters
Arrow: Custom data type that holds an operation or function

Composite Types:

List: A collection of elements, defined with « and »

myList <-- «1, 2, 3, 4»
Mapping: Key-value pairs, using <==>

myMap <-- « "name" <==> "Arrow", "type" <==> "language" »

4. Built-in Functions
Input/Output Functions:

output⟨message⟩: Prints a message to the console
input⟨⟩: Gets and input and assigns it to a variable

output⟨"Hello, Arrow!"⟩

text <-- input⟨⟩

Math Functions:

add⟨x, y⟩, subtract⟨x, y⟩, multiply⟨x, y⟩, divide⟨x, y⟩

result <-- add⟨5, 10⟩

Conversion Functions:

toText⟨value⟩, toFloat⟨value⟩, toInteger⟨value⟩

numText <-- toText⟨100⟩

5. Error Handling

Try-Catch Blocks:

Use !? for error handling with a catch block.

Copiar código
!? ⟨error <-- risky_function()⟩:
    ⦃
    output⟨"Error encountered:", error⟩
    ⦄

6. Custom Operators

Definition of Custom Operators: Users can define operators using symbolic arrows, for example:

=>=: Custom operator that could be set to execute specific actions.

Example:
define operator <==> doSomething

7. Standard Library Structure

File Import Syntax: Use arrow-based import paths to pull in external .arrw files:

import⟨"standardLib.arrw"⟩

Example Code in Arrow

Here’s a sample that puts together these elements to demonstrate Arrow’s syntax in action:

⟦
Define a function to add two numbers
⟧
--> add⟨a, b⟩ ->: Integer:
    ⦃
    result <-- a ⟨->+ b⟩
    result <-> result
    ⦄

⟦
Main program execution
⟧
x <-- 10
y <-- 5
sum <-- add⟨x, y⟩

output⟨"Sum of x and y is:", sum⟩

!? ⟨error <-- risky_function()⟩:
    ⦃
    output⟨"An error occurred:", error⟩
    ⦄

*/

function tokenize(code) {
    const tokens = [];
    const tokenPatterns = [
        { type: 'NUMBER', regex: /\b\d+(\.\d+)?\b/ },
        { type: 'ARROW', regex: /<--|->|\+->|-<-|\*>|<==>|->\+|<</ },
        { type: 'IDENTIFIER', regex: /\b[a-zA-Z_]\w*\b/ },
        { type: 'WHITESPACE', regex: /\s+/ },
        { type: 'SYMBOL', regex: /[\(\)\{\}]/ },
        { type: 'STRING', regex: /"[^"]*"/ },
    ];

    let position = 0;
    while (position < code.length) {
        let match = null;
        for (const { type, regex } of tokenPatterns) {
            regex.lastIndex = position;
            match = regex.exec(code);
            if (match && match.index === position) {
                if (type !== 'WHITESPACE') {
                    tokens.push({ type, value: match[0] });
                }
                position += match[0].length;
                break;
            }
        }
        if (!match) {
            console.error(`Unexpected token at position ${position}: ${code[position]}`);
            throw new Error(`Unexpected token at position ${position}: ${code[position]}`);
        }
    }
    return tokens;
}

// Example usage:
const code = "x <-- 5";
const tokens = tokenize(code)
console.log(tokens);