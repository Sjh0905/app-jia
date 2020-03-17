import React, {Component} from 'react'
import StoreConfigs from '../storeConfigs/StoreConfigs'
import Toast from "react-native-root-toast";

export default class StockClass {

    onMap = new Map()
    io = null
    reconnection = null;

    constructor(options) {
        // this.io = io(options.url, options.options)

        this.options = options;
        this.symbol = StoreConfigs.state.symbol;
        this.socket = null;
        this.onMap = new Map()
        this.socketInterval = null
        this.init()
    }

    test() {

    }

    init() {

        if (this.socket) {
            return;
        }
        this.socket = new WebSocket(this.options.url);

        /*-----------------------------------------*/
        //初始化socket后需要执行func1或func2,二者不能混写
        //------------------func1------------------//

        this.socket.onopen = ()=> {//这里必须写箭头函数，否则作用域出错
            console.log('web socket connected.');
            this.reconnection && this.reconnection('web socket顺利连接通知Indexpage');

            this.socketInterval = null;//清空定时器
            this.socket.send(JSON.stringify({
                action: 'subscribe',
                symbol: this.symbol
            }));
            // this.emit('subscribe', {symbol:symbol});
        }

        //------------------func2------------------//
        // this.emit('subscribe', {symbol:symbol});
        /*-----------------------------------------*/


        this.socket.onmessage = (event)=>{
            // console.log("this.data = 服务端返回 ========"+event.data);
            var data = JSON.parse(event.data);
            if (Array.isArray(data) && data.length==2) {
                // console.log("this.data= callBack ========",data);
                var topic = data[0],
                    message = data[1];

                this.onMap.forEach(function(keyMap,key){
                    let funcArr = keyMap.get(topic);
                    funcArr && funcArr.map(function(callBack){
                        // console.log('funcArr ========',callBack);
                        callBack(message);
                    });
                    // console.log('this.onMap========',value);
                });

                // if (topic === 'topic_snapshot') {
                // } else if (topic === 'topic_bar') {
                // } else if (topic === 'topic_prices') {
                // } else if (topic === 'topic_tick') {
                // } else if (topic === 'topic_order') {
                // }
            }
        }

        this.socket.onclose = (event)=>{
            console.log('web socket disconnected.');
            this.close();
            if(!this.socketInterval)this.socketInterval = setInterval(()=>{
                this.init();
            }, 5000);//断开后自动重连
        }

        this.socket.onerror = (event)=>{
            console.log('web socket error.');
            this.close();
            if(!this.socketInterval)this.socketInterval = setInterval(()=>{
                this.init();
            }, 5000);//断开后自动重连
        }

        // this.io.on('connect', ()=> {
        //     console.log('socket顺利连接！')
        //     this.reconnection && this.reconnection('web socket顺利连接通知Indexpage');
        // })


        // this.io.on('connect_error', function () {
        //   console.warn('连接出错')
        // })
        // this.io.on('disconnect', function (reason) {
        //   console.warn(reason)
        // })
        // this.io.on('reconnect',function(attempt){
        //   console.warn("尝试重连！",attempt)
        // })
    }

    /**
     * 通知网络重新连接
     */
    notifyNetwork(reconnection){
        console.log('接收到问候，reconnection为',reconnection);
        this.reconnection = reconnection;
    }

    /**
     * 打开，重新连接
     */
    open() {
        // this.io.open()
    }

    /**
     * 连接，作用和open一样
     */
    connect() {
        // this.io.connect()
    }

    /**
     * 触发一个message事件，相当于emit('message')
     * @param params    一堆参数，最后一个参数可以是callback，参数为socket服务端返回的值
     */
    send(...params) {
        // this.io.send(...params)
    }

    /**
     * 触发一个自定义事件
     * @param key     字符串，事件名称
     * @param params  币对名称
     */
    emit(key, params) {
        //存储当期币对
        // this.symbol = params && params.symbol || '';
        // console.warn('this is this.socket====',this.socket);

        if(this.socket == null){
            Toast.show('您的网络可能中断了，请检查网络后重新切换币对', {
                duration: 1200,
                position: Toast.positions.CENTER
            })
        }

        if (this.socket && this.socket.readyState===1 && params && params.symbol) {
            console.log('web socket symbol',params.symbol);
            this.socket.send(JSON.stringify({
                action: key,
                symbol: params.symbol
            }));
        }
    }

    /**
     * 监听一个（自定义）事件
     * @param key   字符串，事件名称
     * @param callBack  函数，参数是socket服务端返回的值
     */
    on({key, bind, callBack}) {
        if (bind instanceof Component === false) {
            console.log("参数使用错误，必须有bind参数，且bind为Component实例，一般为this")
        }
        bind && (callBack = callBack.bind(bind))
        // 记录绑定的函数
        let keyMap = this.onMap.get(bind)
        !keyMap && this.onMap.set(bind, keyMap = new Map())
        let funcArr = keyMap.get(key)
        !funcArr && keyMap.set(key, funcArr = [])
        funcArr.push(callBack)

        // this.io.on(key, callBack)
    }

    /**
     * 取消监听 TODO：后续优化
     * @param key 字符串，事件名称
     * @param callBack  函数
     */
    off({key, bind, callBack}) {
        // 如果没有写bind，则表示取消绑定一个函数
        if (bind instanceof Component === false) {
            // this.io.off(key, callBack)
        }

        // 如果写了bind，则表示把此组件的on取消掉
        if (bind instanceof Component === true) {
            let keyMap = this.onMap.get(bind)
            // 如果没有绑定，退出即可
            if (!keyMap) return
            keyMap.forEach((value, keys) => {
                if (!value) return
                value.forEach((value) => {
                    // this.io.off(keys, value)
                })
            })
            this.onMap.delete(bind)
        }
    }

    /**
     * 只监听一次事件
     * @param key   字符串，事件名称
     * @param callBack    函数，参数是socket服务端返回的值
     */
    once(key, bind, callBack) {
        // this.io.once(key, callBack.bind(bind))
    }

    /**
     * 主动关闭socket
     */
    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    /**
     * 主动关闭socket，和close一致
     */
    disconnect() {
        // this.io.disconnect()
    }

}
