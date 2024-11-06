/*
Arrow Language Syntax Reference

-----------------------------
| 1. Variable Declaration and Assignment
-----------------------------
  - Basic Assignment:
      variableName <== value
      
  - Type-Checked Assignment:
      variableName <: type :> <== value
      (Throws an error if `value` doesn’t match `type`)

  Examples:
    count <== 42
    message <: string :> <== "Hello Arrow"

-----------------------------
| 2. Function Definition and Invocation
-----------------------------
  - Function Definition:
      ==> functionName(arg1 <: type1 :>, arg2 <: type2 :>) <: returnType :> {
          // function body
          --> returnValue
      }
      
    - `==>`: Denotes the start of a function definition.
    - `<: returnType :>`: Optional type annotation for the return value.
    - `-->`: Return keyword, followed by value.

  - Function Invocation:
      functionName >> (arg1, arg2, ...)
      
  Examples:
    ==> greetUser(name <: string :>) <: string :> {
        --> "Hello, " <+> name
    }

    message <== greetUser >> ("ArrowUser")

-----------------------------
| 3. Operators and Expressions
-----------------------------
  - Arithmetic Operators:
      Addition: x <+> y
      Subtraction: x <-> y
      Multiplication: x <*> y
      Division: x </> y
      
  - Logical Operators:
      And: x <&&> y
      Or: x <||> y
      Not: <!!> x
      
  Examples:
    result <== x <+> y
    isActive <== flag <&&> condition

-----------------------------
| 4. Control Flow Statements
-----------------------------
  - If-Else Conditionals:
      ?? -> (condition) {
          // if block
      } ?? else {
          // else block
      }

  - While Loop:
      @@ -> (condition) {
          // loop body
      }

  - For Loop:
      @@ for (init ; condition ; increment) {
          // loop body
      }

  Examples:
    ?? -> (score >= 50) {
        result <== "Pass"
    } ?? else {
        result <== "Fail"
    }
    
    i <== 0
    @@ -> (i < 5) {
        i <== i <+> 1
    }

-----------------------------
| 5. Arrays and Objects
-----------------------------
  - Array Declaration:
      arrayName <== [item1, item2, ...]

  - Access Array Elements:
      item <== arrayName[index]

  - Object Declaration:
      objectName <== { key1: value1, key2: value2, ... }

  - Access Object Properties:
      propertyValue <== objectName.key

  Examples:
    items <== [10, 20, 30]
    firstItem <== items[0]
    
    settings <== { volume: 75, theme: "dark" }
    currentTheme <== settings.theme

-----------------------------
| 6. Built-In Functions
-----------------------------
  - Print (Output to console):
      print >> (message)
      
  - Input (User input):
      inputValue <== input >> ("Prompt message")
      
    - `print`: Outputs the provided message to the console or display.
    - `input`: Displays a prompt and waits for user input.

  Examples:
    print >> ("Hello, Arrow!")
    userName <== input >> ("Enter your name: ")

-----------------------------
| 7. Comments
-----------------------------
  - Single-Line Comment:
      :: This is a comment

  - Multi-Line Comment:
      ::> This is a comment
      a comment <::

-----------------------------
| 8. Full Example Code
-----------------------------
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

// Import the necessary classes from the include folder
import Tokenizer from './include/tokenizer.js';
import Parser from './include/parser.js';
import Interpreter from './include/interpreter.js';

// Step 1: Tokenize
const tokenizer = new Tokenizer(code);
const tokens = tokenizer.tokenize();

if (debug) {
    console.log(tokens);
}

// Step 2: Parse
const parser = new Parser(tokens);
const ast = parser.parse();

if (debug) {
    console.log(ast);
}

// Step 3: Evaluate
const interpreter = new Interpreter();
interpreter.evaluate(ast);

// Output the result of interpretation
if (debug) {
    console.log(interpreter.environment);
} else {
    console.log('Arrow code executed successfully!');
}