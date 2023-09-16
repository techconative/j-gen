import { DSLInterpreter } from './jgen.js';

let interpreter = new DSLInterpreter({
    'add': (ctx, params) => {
        return params.reduce((accumulator, current) => accumulator + current, 0);
    },
    'mul': (ctx, params) => {
        return params.reduce((accumulator, current) => accumulator * current, 1);
    },
    'append': (ctx, params) => {
        return params.reduce((accumulator, current) => accumulator + current, '');
    }
});

let dslJson = {
    'add': [
        1,
        { 'mul': [12, 12, 12] }
    ]
};

let compiled = interpreter.compile(dslJson);

console.log(interpreter.run(compiled, null));
console.assert(interpreter.run(compiled, null) === 1729);

dslJson = {
    'append': [
        'test1',
        { 'mul': [12, 12, 12] }
    ]
};

compiled = interpreter.compile(dslJson);
console.log(interpreter.run(compiled, null));
console.assert(interpreter.run(compiled, null) === 'test11728');


dslJson = [{
    'append': [
        'test1',
        { 'mul': [12, 12, 12] }
    ]
}];

compiled = interpreter.compile(dslJson);
console.log(interpreter.run(compiled, null));
console.assert(interpreter.run(compiled, null)[0] === 'test11728');


dslJson = [{
    'append': [
        'test1',
        { 'mul': [12, 12, 12] }
    ]
},
    {
        'add': [
            { 'mul': [9, 9, 9] },
            { 'mul': [10, 10, 10] }
        ]
    }];

compiled = interpreter.compile(dslJson);
console.log(interpreter.run(compiled, null));
console.assert(interpreter.run(compiled, null)[0] === 'test11728');
console.assert(interpreter.run(compiled, null)[1] === 1729);

dslJson = [{
    'something': [
        'test1',
        { 'mul': [12, 12, 12] }
    ]
}];

compiled = interpreter.compile(dslJson);
console.log(JSON.stringify(interpreter.run(compiled, null)));
console.assert(interpreter.run(compiled, null)[0]['something'][0] === 'test1');
console.assert(interpreter.run(compiled, null)[0]['something'][1] === 1728);
