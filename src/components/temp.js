import requestAddress from "../configs/networkConfigs/RequestAddress";
import io from 'socket.io-client'

requestAddress.GET_COOKIES_C2C = {url: '/user/getCookies', method: 'get'} //获取cookie接口 发给h5活动页面 h5接到原始数据发送到他自己的地方（/user/putcookies）接口 post方法
requestAddress.PUT_COOKIES_C2C = {url: '/user/putUserCookies', method: 'get'}
requestAddress.GET_PAY_INFO = {url: '/c2c/user/checkLoginForC2C', method: 'post'}
// requestAddress.GET_PAY_INFO = {url: '/c2c/user/getListOfCtcOrders', method: 'post'}


this.$http.send('GET_COOKIES_C2C', {
    bind: this,
    callBack: function(res){
        console.log('this is cookies',JSON.stringify(res));
        var that = this
        this.$http.send('PUT_COOKIES_C2C', {
            bind: this,
            baseUrl:'https://www.valuepay.io/',
            query:{uri:encodeURI('https://www.valuepay.io/') + '&paras=' + encodeURI(JSON.stringify(res))},
            callBack: function(res1){
                console.log('this is cookies put result',res1);
                that.$http.send('GET_PAY_INFO', {
                    // params:{"offset":1,"maxResults":10,"status":"COMPLETE","ctcOrderId":""},
                    bind: this,
                    baseUrl:'https://www.valuepay.io/',
                    callBack: function(payinfo){
                        console.log('this is cookies get payinfo',payinfo);
                        payinfo = JSON.parse(payinfo);
                        let socket = payinfo.dataMap.socket;
                        let socket_url = 'wss://' + socket.url + '?key=' + socket.data.key + '&unid=' + socket.data.unid + '&time=' + socket.data.time;
                        // that.socket = io(socket_url);
                        console.log('this is socket.url',socket_url);
                        // that.socket = io('wss://onli-quotation.xx.xx',{
                        //     transports : ['websocket'],
                        //     path : '/v1/market'
                        // });

                        that.socket = io(socket_url,{
                            transports : ['websocket'],
                        });

                        that.socket.on('connect', ()=> {
                            console.log('socket_url '+'socket顺利连接！')
                        })


                        that.socket.on('connect_error', function (connect_error) {
                            console.warn('socket_url'+'连接出错',connect_error)
                        })
                        that.socket.on('disconnect', function (reason) {
                            console.warn('socket_url'+'连接出错2',reason)
                        })
                        that.socket.on('reconnect',function(attempt){
                            console.warn("尝试重连！",attempt)
                        })
                    }
                })

            },
            successBack:function(arg){
                console.log(arg);
                that.$http.send('GET_PAY_INFO', {
                    params:{"offset":1,"maxResults":10,"status":"COMPLETE","ctcOrderId":""},
                    bind: this,
                    baseUrl:'https://www.valuepay.io/',
                    callBack: function(payinfo){
                        console.log('this is cookies get payinfo',payinfo);

                    }
                })
            }
        })
        setTimeout(()=>{

        },3000)

    }
})

var 进行中 = {
    "dataMap": {
        "ctcOrders": {
            "page": {
                "isEmpty": false,
                    "itemsPerPage": 10,
                    "pageIndex": 1,
                    "totalItems": 1,
                    "totalPages": 1
            },
            "results": [{
                "amount": 100.0000000000000000,
                "binessUserId": 116000,
                "confirmStatus": "UNCONFIRMED",
                "createdAt": 1560414981474,
                "currency": "USDT",
                "expireTime1": 1560508181000,
                // "fee": 0E-16,
                "id": 100331,
                "orderId": 1906130836214651,
                "orderStatus": "PROCESSING",
                "payIds": "100112",
                "postersId": 100274,
                "price": 1.0000000000000000,
                "randomStr": "gO14651",
                "toCurrency": "CNY",
                "total": 100.0000000000000000,
                "type": "SELL_ORDER",
                "updatedAt": 1560414981474,
                "userId": 331003,
                "version": 0
            }]
        }
    },
        "errorCode": 0,
        "result": "SUCCESS"
    }

if(res.status == 200 && successBack){
    successBack('成功啦=========================================')

}