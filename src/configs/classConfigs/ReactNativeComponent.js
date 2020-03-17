/*
* hjx 2018.3.31
* */

import React, {Component} from 'react'

// 封装RN组件
export default class RNComponent extends Component {

    // 路由跳转方法
    static RouterInstance = null
    // socket实例
    static SocketInstance = null
    // 事件实例
    static EventBusInstance = null
    // 请求实例
    static HttpInstance = null
    // 公共仓库
    static StoreInstance = null
    // 多语言
    static I18nInstance = null
    // 全局函数
    static GlobalFuncInstance = null

    // 测试
    // static testStatic = 1


    // 设置路由
    static setRouter(RouterClass, options) {
        RNComponent.RouterInstance = new RouterClass(options)
    }

    // 设置socket
    static setSocket(SocketClass, options) {
        RNComponent.SocketInstance = new SocketClass(options)
    }

    // 设置store
    static setStore(StoreClass, options) {
        RNComponent.StoreInstance = new StoreClass(options)
    }

    // 设置国际化
    static setI18n(I18nClass, defaultLocal, options) {
        RNComponent.I18nInstance = new I18nClass(defaultLocal, options)
    }

    // 设置全局函数
    static setGlobalFunction(GlobalFunctionClass, options) {
        RNComponent.GlobalFuncInstance = new GlobalFunctionClass(options)
    }

    // 设置事件传递
    static setEventBus(EventBusClass, options) {
        RNComponent.EventBusInstance = new EventBusClass(options)
    }

    // 设置网络请求实例
    static setNetwork(NetWorkClass, options, requestAddress) {
        RNComponent.HttpInstance = new NetWorkClass(options, requestAddress)
    }


    // 组件使用全局函数
    get $globalFunc() {
        return RNComponent.GlobalFuncInstance
    }

    // 组件使用http
    get $http() {
        return RNComponent.HttpInstance
    }

    // 组件使用路由
    get $router() {
        return RNComponent.RouterInstance
    }

    // 路由状态
    get $route() {
        return RNComponent.RouterInstance.state
    }

    get $nav() {
        return RNComponent.RouterInstance.getNav
    }

    // 组件使用socket
    get $socket() {
        return RNComponent.SocketInstance
    }

    // 组件使用公共仓库
    get $store() {
        return RNComponent.StoreInstance
    }

    // 组件使用国际化 this.$i18n.t('key')
    get $i18n() {
        return RNComponent.I18nInstance.$i18n
    }

    // 组件使用event
    get $event() {
        return RNComponent.EventBusInstance
    }

    // 获取params
    get $params() {
        return this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params
    }

    // 在constructor中获取params
    get $beforeParams() {
        return this.$route.routes[this.$route.routes.length - 1] && this.$route.routes[this.$route.routes.length - 1].params
    }


    // 事件监听
    listen({key = null, bind = this, func = null} = {key: null, bind: this, func: null}) {
        this.$event.listen({key, bind, func})
    }

    // 事件广播
    notify({key = null, bind = null, func = null} = {key: null, bind: null, func: null}, ...params) {
        this.$event.notify({key, bind, func}, ...params)
    }

    // 事件取消监听
    unListen({bind = this, key = null, func = null} = {bind: this, key: null, func: null}) {
        // 测试
        this.$event.unListen({bind, key, func})
    }


    // 生命周期
    // 创建
    constructor() {
        super()
    }


    // 挂载前
    componentWillMount() {
        // console.warn("组件即将挂载！")
    }

    // 渲染
    render() {

    }

    // 挂载后
    componentDidMount() {

    }

    // 获取新props
    componentWillReceiveProps(nextProps) {

    }

    // 是否更新组件
    // shouldComponentUpdate() {
    //
    // }

    // 组件即将更新
    componentWillUpdate() {

    }

    // 组件更新
    componentDidUpdate() {

    }

    // 组件即将卸载
    componentWillUnmount() {
        let ok = this.$event.unListen({bind: this})
        this.$socket.off({bind: this})
    }


}