# j-gen

A minimalistic evaluator of a custom JSON language.

## Motivation:

While working with LLMs in order to achieve a specific task when need to have a consistent way of expressing what need to be 
achieved as a result of a given prompt.

The language has to be of below nature,

- Simple(not just Easy).
- Consistent.
- Infinitely recursive.

## Grammar:

- Each JSON will either be an operator or a data.
- The JSON is an operator, if the first key is one of the configured strings.
- Each operator will have to be resolved to a function with the value of it will be passed as a parameter for the function.
- When a JSON is not an operator, it represents a normal JSON.
- The execution has to happen in a nested manner. For example, if an operator has another operator as a parameter, the inner one needs to be executed first.
- The DSL has to be converted to the code first and then the execution has to happen on an explicit call.
- The response of the DSL will be the execution result of the JSON.
- When the DSL is a list and if JSON is an operator, the result will be a list with the evaluated results.
- When the JSON is not an operator, it will be returned as is.

## Usage:

- Define the operators.

Ex,
```
let interpreter = new DSLInterpreter({
    'add': (ctx, params) => {
        return params.reduce((accumulator, current) => accumulator + current, 0);
    }});
```

- Compile the expressions,

```
let dslJson = {
    'add': [
        1,
        2,
        3
    ]
};

let compiled = interpreter.compile(dslJson);
```
- Execute it with optional context,

```
interpreter.run(compiled, null);
// This should return 6
```

For more details refer to the [test file](jgentest.js).

## Running tests:

```
 node jgentest.js
```
