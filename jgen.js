export class DSLInterpreter {
    constructor(customOperators = {}) {
        this.operators = {
            ...customOperators
        };
    }

    isOperator(json) {
        return json && typeof json === 'object' && Object.keys(this.operators).includes(Object.keys(json)[0]);
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
