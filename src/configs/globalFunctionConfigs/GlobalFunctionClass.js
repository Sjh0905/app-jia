export default class GlobalFunctionClass {
    constructor(GlobalFunc) {
        for (let funcName of Object.keys(GlobalFunc)) {
            this[funcName] = GlobalFunc[funcName]
        }
    }
}