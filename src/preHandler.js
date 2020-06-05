export default async function ($http, $store) {

    let sleep = (time)=> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    }

    let http1 = $http.send('CHECK_LOGIN_IN', {
        callBack: function (data) {
            typeof data == 'string' && (data = JSON.parse(data))
            if (data.result === 'FAIL' || data.errorCode) {
                return
            }

            $store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)
            $store.commit('SET_HOT_VAL', data.dataMap && data.dataMap.hotVal || 0)
        },
        errorHandler: function (err) {
            console.warn("出错了！", err)
        }
    })

    // 获取动态symbols
    let http2 = $http.send('COMMON_SYMBOLS', {
        callBack: function (data) {
            // 临时写死
            let btx = [];
            let quoteConfig = [];
            let tradingParameters = [];
            data.symbols.map(function (v, i) {
                let type = v['name'].split('_')[1] == 'BTC' ? 'BTC' : 'BTX';
                if (v['name'].split('_')[1] == type) {
                    btx.push(v['name']);
                }
                quoteConfig.push({name: v.name, baseScale: v.baseScale, quoteScale: v.quoteScale});
                tradingParameters.push({name: v.name, maxAmount: v.maxAmount, miniVolume: v.miniVolume});
            })

            // // 判断用户登录后最后选择的币对
            // let user_symbol = $cookies.get('user_symbol_cookie');
            // let user_id = $store.state.authMessage.userId;
            //
            // if (!!user_id && !!user_symbol && user_symbol.split('-')[0] == user_id) {
            // 	$store.commit('SET_SYMBOL', user_symbol.split('-')[1]);
            // } else {
            // 	// 如果没有用户登录选择币对，则为KK_USDT币对
            // 	$store.commit('SET_SYMBOL', 'KK_USDT');
            // }

            $store.commit('SET_SYMBOL', 'KK_USDT');
            // 精度
            $store.commit('SET_QUOTECONFIG', quoteConfig);
            // 存储当前比对最小交易额和深度满值
            $store.commit('SET_TRADING_PARAMETERS', tradingParameters);
        }
    })

    let http3 = $http.send('GET_SEVER_TIME', {
        callBack: function (data) {
            typeof data === 'string' && (data = JSON.parse(data))
            // console.warn("data", data)
            $store.commit('SET_SERVER_TIME', data)
        }
    })

// 获取BT文案参数配置
//     let http4 = $http.send('REGULATION_CONFIG', {
//         callBack: function(data){
//             typeof (data) === 'string' && (data = JSON.parse(data))
//             console.log('REGULATION_CONFIG===========1111=',data);
//             if (!data) {
//                 return
//             }
//             // data.reward = 0.21;
//             // data.activity = 0.21
//             $store.commit('SET_REWARD',  data.reward);
//             $store.commit('SET_ACTIVITY',  data.activity);
//             $store.commit('SET_REGULATION_CONFIG', true);
//         },
//         errorHandler: function(err){
//             console.warn("获取BT文案参数配置失败", err)
//         }
//     })


    await Promise.all([
        sleep(1950),
        Promise.race([
            sleep(8000),
            Promise.all([
                http1,http2,http3
            ])
        ])
    ])


    // await new Promise(function (resolve, reject) {
    //     setTimeout(resolve, 5000)
    // })


    return false


}