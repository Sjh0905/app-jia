import React, {Component} from 'react'

export default class {
    constructor() {
        this.event = new Map()
    }

    /**
     *
     * @param bind  React Component,usually 'this'
     * @param key   String,event key
     * @param func  Function,a function
     * @returns {boolean}
     */
    listen({bind, key, func}) {
        if (bind instanceof Component !== true || typeof (key) !== 'string'
            || typeof (func) !== 'function'
        ) {
            // console.warn('you must input right params!')
            return false
        }


        let newMap = this.event.get(key)

        if (typeof(newMap) === 'undefined') {
            this.event.set(key, newMap = new Map())
        }


        let newSet = newMap.get(bind)

        if (typeof (newSet) === 'undefined') {
            newMap.set(bind, newSet = new Set())
        }
        newSet.add(func)
        return true
    }

    /**
     *
     * @param key   String,event key
     * @param bind  React Component,usually 'this'
     * @param func  Function,a function
     * @param params   params func needs
     * @returns {boolean}
     */
    notify({key, bind, func}, ...params) {
        // 只有一个值
        if (typeof (key) === 'string' && !bind && !func) {
            this.event.forEach((maps, keys) => {
                if (keys !== key) return
                maps && maps.forEach((sets, binds) => {
                    sets && sets.forEach(func => {
                        func.bind(binds)(...params)
                    })
                })
            })
            return true
        }
        // 有两个值
        if (typeof (key) === 'string' && bind instanceof Component === true && !func) {
            this.event.forEach((maps, keys) => {
                if (keys !== key) return
                maps && maps.forEach((sets, binds) => {
                    if (binds !== bind) return
                    sets && sets.forEach(func => {
                        func.bind(binds)(...params)
                    })
                })
            })
            return true
        }
        //有三个值
        if (typeof (key) === 'string' && bind instanceof Component === true && typeof (func) === 'function') {
            this.event.forEach((maps, keys) => {
                if (keys !== key) return
                maps && maps.forEach((sets, binds) => {
                    if (binds !== bind) return
                    sets && sets.forEach(funcs => {
                        if (funcs !== func) return
                        funcs && funcs.bind(binds)(...params)
                    })
                })
            })
            return true
        }
        console.log("you must input right params!")
        return false
    }

    /**
     *
     * @param bind  React Component,usually 'this'
     * @param key   String,event key
     * @param func  Function,a function
     * @returns {boolean}
     */
    unListen({bind, key, func}) {

        //第一个有值，并且是key
        if (typeof (key) === 'string' && !bind && !func) {
            let key = bind
            this.event.forEach((value, keys) => {
                if (keys !== key) return
                value && value.clear()
            })
            return true
        }


        // 第一个有值，并且是React对象
        if (bind instanceof Component === true && !key && !func) {
            this.event.forEach((value) => {
                if (typeof (value) === 'undefined') return
                value.forEach((value, binds) => {
                    if (binds !== bind) return
                    value && value.clear()
                })
            })
            return true
        }

        // 前两个有值，前两个值分别为React对象和key
        if (bind instanceof Component === true && typeof (key) === 'string' && !func) {
            this.event.forEach((value, keys) => {
                if (keys !== key) return
                value && value.forEach((values, binds) => {
                    if (binds !== bind) return
                    values && values.clear()
                })
            })
            return true
        }
        // 三个都有值，分别是React对象、Key和Function
        if (bind instanceof Component === true && typeof (key) === 'string' && typeof (func) === 'function') {
            this.event.forEach((value, keys) => {
                if (keys !== key) return
                value && value.forEach((values, binds) => {
                    if (binds !== bind) return
                    values && values.delete(func)
                })
            })
            return true
        }
        console.log("you must input right params!")
        return false
    }
}
