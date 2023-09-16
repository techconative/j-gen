export class DSLInterpreter {
    constructor(customOperators = {}) {
        this.operators = {
            'add': this.add,
            'resolve': this.resolve,
            'bind': this.bind,
            'delete': this.delete,
            ...customOperators
        };
    }

    add(context, params) {
        return params.reduce((acc, curr) => acc + curr, 0);
    }

    resolve(context, params) {
        return params[0];
    }

    bind(context, params) {
        return params[0];
    }

    delete(context, params) {
        return null;
    }

    isOperator(json) {
        return json && typeof json === 'object' && Object.keys(this.operators).includes(Object.keys(json)[0]);
    }

    setOperator(name, func) {
        this.operators[name] = func;
    }

    compile(json) {
        if (Array.isArray(json)) {
            let compiledList = json.map(item => this.compile(item));
            return (context) => {
                return compiledList.map(compiledItem => typeof compiledItem === 'function' ? compiledItem(context) : compiledItem);
            };
        } else if (this.isOperator(json)) {
            const operatorName = Object.keys(json)[0];
            let paramsArray = Array.isArray(json[operatorName]) ? json[operatorName] : [json[operatorName]];

            for (let i = 0; i < paramsArray.length; i++) {
                paramsArray[i] = this.compile(paramsArray[i]);
            }

            return (context) => {
                let executedParams = paramsArray.map(param => typeof param === 'function' ? param(context) : param);
                return this.operators[operatorName].call(this, context, executedParams);
            };
        } else if (typeof json === 'object') {  // Check and compile nested operators within normal JSON
            const compiledJson = {};
            for (let key in json) {
                compiledJson[key] = this.compile(json[key]);
            }
            return (context) => {
                const result = {};
                for (let key in compiledJson) {
                    result[key] = typeof compiledJson[key] === 'function' ? compiledJson[key](context) : compiledJson[key];
                }
                return result;
            };
        } else {
            return json;
        }
    }

    run(compiledClosure, context) {
        if (typeof compiledClosure === 'function') {
            return compiledClosure(context);
        }
        return compiledClosure;
    }
}
