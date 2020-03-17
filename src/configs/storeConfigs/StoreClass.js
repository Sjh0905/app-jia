/**
 * Created by hjx on 2018/03/31
 */
import {observable} from "mobx"

export default class StoreClass {
    state = {}
    mutations = {}

    constructor(configs) {
        if (configs.state) {
            this.state = observable(configs.state)
        }
        if (configs.mutations) {
            this.mutations = configs.mutations
        }

    }

    commit(keys, ...params) {
        this.mutations[keys] && this.mutations[keys](this.state, ...params)
    }


}