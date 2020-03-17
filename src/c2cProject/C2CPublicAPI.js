import Env from "../configs/environmentConfigs/env";

export var getAuthStateForC2C = async ($http, $store)=>{

    let sleep = (time)=> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    }

    let http1 = $http.send('GET_AUTH_STATE_FOR_C2C', {
        callBack: function (data) {
            typeof data == 'string' && (data = JSON.parse(data))
            if (data.result === 'FAIL' || data.errorCode) {
                return
            }

            $store.commit('SET_AUTH_STATE_FOR_C2C', data.dataMap)
        },
        errorHandler: function (err) {
            console.warn("出错了！", err)
        }
    })
    await Promise.all([sleep(1500), http1])

    return false

}

export var getCookieForC2C = async ($http, $store,Env)=> {
    let sleep = (time)=> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    }

    let http1 = $http.send('GET_COOKIES_C2C', {
        bind: this,
        callBack: function(res){
            console.log('this is C2CPublicAPI cookies',res);
            // var res2 = '{"cookies":{"name":"_bitsession_","value":"AAAAAcUg030000016b4f41c89aAPP7c494f5ff4c0eb5322d3bc281fa7dd478bd93260a3ecebe56a12c2bc9e7c65f0","comment":null,"domain":null,"maxAge":-1,"path":null,"secure":false,"version":0,"httpOnly":false}}'
            var that = this
            $http.send('PUT_COOKIES_C2C', {
                bind: this,
                query:{uri:encodeURI(Env.networkConfigs.c2cUrl) + '&paras=' + encodeURI(JSON.stringify(res))},
                callBack: function(res1){
                    console.log('this is C2CPublicAPI cookies put result',res1);
                    if(res1){
                        // alert('获取到cookie啦')
                        $store.commit('SET_COOKIE_FOR_C2C',true);
                    }
                },
                successBack:function(arg){
                }
            })

        }
    })

    await Promise.all([sleep(1500), http1])
}

