import env from "../environmentConfigs/env";

/**
 * hjx 2018.3.31 模仿了vuex
 */
const store = {}

import Version from '../versionConfigs/Version'
import GlobalFunc from '../globalFunctionConfigs/GlobalFunction'

// state
store.state = {}
store.state.testNum = 1

/**
 * webview需要提前加载的链接
 * @type {*[]}
 */
store.state.webviewUrl = [
    // 'https://customerservice8872.zendesk.com/hc/zh-cn/requests/new',//customerServiceUrl
    // '',//邀请好友
    // '',//帮助中心
    // env.networkConfigs.downloadUrl+'index/mobileNotice/?isApp=true'
]


/**
 * 终端类型
 * Android
 * iOS
 */
store.state.sourceType = 'Android'
/**
 * 版本控制
 * @type {string}
 */
store.state.version = Version.version

/**
 * 当前计价货币
 * @type {string}
 */
store.state.baseCurrency = 'BTC'


// 美金汇率 2019-07-25
store.state.exchangRateDollar = 7.02

/**
 * 货币种类
 * @type {{}}
 */
store.state.currency = new Map()
store.state.currencyChange = 0 // 币种信息发送变化
store.state.appraisementChange = 0 // 币种估值发生变化

/**
 * 默认币种精度
 * @type {{BTC: number, CFC: number, ETH: number, KFC: number, LTC: number, MFC: number, USDT: number}}
 */
store.state.currencyJingDU = {
    BTC:4,
    CFC:3,
    ETH:4,
    KFC:5,
    LTC:4,
    MFC:4,
    USDT:2,
    TT:4,
    YY:4,
    KK:4,
    FF:4
}

/**
 *
 * @type {Array}
 */
store.state.GRCPriceRange = []

/**
 * 语言
 * @type {string}
 */
store.state.language = 'CN'

/**
 * c2ccookie是否已获取
 * @type {string}
 */
store.state.cookieForC2C = false


/**
 * 本地cookie存储
 * @type {{}}
 */
store.state.cookie = {}

store.state.marketList = null
store.state.marketPriceMerge = null
store.state.newPrice = null
store.state.depthMerge = null
store.state.marketUseRate = null
store.state.tradeList = null
store.state.feeBdbState = 1//默认开启抵扣
store.state.feeDividend = 0;
store.state.reward = 0;
store.state.activity = 0;
store.state.allDealData = [];
store.state.deviceHeightState = {

};
store.state.marketListDefault = {
    area:'mainBoard',
    tab:2//默认挖矿区
};
//存储币对汇率
store.state.price = {};

//存储是否减免
store.state.feeDiscount = {};

/**
 * 用户推送信息
 * @type {null}
 */
store.state.userPushMsg = null;
store.state.userPushArray = [];

/**
 *首页主板区展示币对
 1.ACT/USDT
 2.BDB/usdt
 3.BTC/usdt
 4.can/usdt
 5.eos/eth
 6.eth/usdt
 7.eth/btc
 8.icc/eth
 9.iost/eth
 10.key/eth
 * @type {string[]}
 */
// store.state.mainPageSymbol = ['ACT_USDT','BDB_ETH','BT_ETH','BTC_USDT','EOS_ETH','ETH_USDT','ETH_BTC','ICC_ETH','IOST_ETH','KEY_ETH'];
//2019-05-16
/**
 * QST/USDT;
 * BDB/USDT;
 * BTC/USDT;
 * ETH/USDT;
 * EOS/USDT，最后一个EOS先待定
 * 'EOS_ETH'
 * @type {string[]}
 */
store.state.mainPageSymbol = ['QST_USDT','BDB_USDT','BTC_USDT','ETH_USDT','EOS_ETH'];

/**
 * 挖矿区币对
 * @type {string[]}
 */
store.state.innovationZoneSymbol = ['KK_USDT'];

/**
 * 身份信息 运行过程中cookie失效后需要初始化
 * @type {{userId: string, city: string, country: string, createdAt: string, email: string, id: string, idCode: string, name: string, province: string, street: string, updatedAt: string, version: string, zipcode: string}}
 */
store.state.authMessage = {
    userId: '',
    city: '',
    country: '',
    createdAt: '',
    email: '',
    id: '',
    idCode: '',
    name: '',
    province: '',
    street: '',
    updatedAt: '',
    version: '',
    zipcode: ''
}

/**
 * 是否登录
 * @type {boolean}
 */
store.state.isLogin = false


/**
 * 认证状态 运行过程中cookie失效后需要初始化
 * sms: false,  手机
 * ga: false,   谷歌验证
 * identity: false, 身份认证
 * capital: false,  资金密码
 * @type {null}
 */

store.state.authState = {
    sms: false,
    ga: false,
    identity: false,
    capital: false
}
/**
 * c2c认证状态
 * @type {{
 * mail: boolean,
 * method: boolean,银行卡
 * identity: boolean,身份认证
 * sms: boolean,手机
 * ga: boolean谷歌验证
 * }}
 */
store.state.authStateForC2C = {
    mail: false,
    method: false,
    identity: false,
    sms: false,
    ga: false
}
/**
 * 手势解锁是否开启 运行过程中cookie失效后需要初始化
 * @type {boolean}
 */
store.state.gesture = false
// store.state.gesture = true
/**
 * 手势登录是否显示 运行过程中cookie失效后需要初始化
 * @type {boolean}
 */
store.state.showGesture = false
// store.state.showGesture = true
store.state.showGestureTime = true//控制显示次数和10分钟的时间判断

/**
 * 手势推荐弹窗是否显示
 * @type {boolean}
 */
store.state.recommendGesture = false
// store.state.recommendGesture = true


store.state.symbol = 'KK_USDT'

/**
 * 直接存储接口返回的所有币对，格式不做处理
 * @type {Array}
 */
store.state.allSymbols = []

/**
 * 存储接口返回的自选币对
 * @type {Array}
 */
store.state.collectionSymbols = []

/**
 * 汇率  lf
 */
store.state.exchange_rate = {}


/**
 * 服务器时间
 * @type {string}
 */
store.state.serverTime = 0
store.state.serverTimeInterval = null
store.state.serverTimeCallBack = null


// 实名认证状态
store.state.getIdentityInfo = {
    identityAuth: false,
    identityAuthInfo:[],//驳回详细信息
    certificate_negative_url: false,
    certificate_positive_url: false,
    living_body_url: false,
    cardType: 0,
    cerificatePage:'RealNameCertification', //'IDCardA',
    identityAuthState: '3',//APP只调用了/auth/getIdentityInfo，所以 0 或 3 都是未认证状态
    time:0
}

/**
 * c2c订单状态
 * @type {{DYSTOCIA: string, ROBFAIL: string, CREATE: string, PROCESSING: {BUY_ORDER: string, SELL_ORDER: string}, EXPIRE1: string, EXPIRE2: string, COMPLETE: string, CANCEL: string, APPEAL: string, ABNORMAL: string}}
 */
store.state.c2cOrderStatusMap = {
    DYSTOCIA:'订单难产,剩余量不足',
    ROBFAIL:'订单抢锁失败',
    CREATE:  '订单创建',
    PROCESSING:  {
        BUY_ORDER:'待付款',
        SELL_ORDER:'待收款',
        UNCONFIRMED:'未确认',
        BUYER_CONFIRM:'买方确认',
        SELLER_CONFIRM:'卖方确认',
        SELLER_ONCE_CONFIRM:'未确认'
    },//进行中
    COMPLETE:  '已完成',
    CANCEL:  '已取消',
    OTHER:{
        EXPIRE1:'确认付款超时',
        EXPIRE2:'确认收款超时',
        APPEAL:'申诉订单',
        ABNORMAL:'订单异常',
    }//其他
}

//手机号区域
store.state.areaCode = '0086'

store.state.areaNameCn = '中国大陆地区'

//首页币对导航数组
store.state.homeSymbols = []
// 修改state，使用方式为this.$store.commit(keys,...params)
store.mutations = {}

store.mutations.TEST_FUNC = function (state, num) {
    state.testNum = num
}

/**
 * 更改终端类型
 * @param state
 * @param type
 * @constructor
 */
store.mutations.SET_SOURCE_TYPE = function (state, type) {
    state.sourceType = type
}


/**
 * 更改用户信息
 * @param state
 * @param info
 * capital:资金密码
 * sms:手机
 * ga:谷歌验证
 * identity:身份验证
 * @constructor
 */
store.mutations.SET_AUTH_MESSAGE = (state, info) => {
    state.authMessage = info
    state.isLogin = info.userId ? true : false
}


/**
 * 修改认证状态
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_AUTH_STATE = (state, info) => {
    state.authState = info
}

/**
 * 修改c2c认证状态
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_AUTH_STATE_FOR_C2C = (state, info) => {
    state.authStateForC2C = info
}

/**
 * GRC价格区间
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_GRC_PRICE_RANGE = (state, info) => {
    state.GRCPriceRange = info
}
/**
 *
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_COOKIE_FOR_C2C = (state, info) => {
    state.cookieForC2C = info
}

/**
 * cookie
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_COOKIE = (state, info) => {
    state.cookie = info
}

/**
 * 美金汇率
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_EXCHANGE_RATE_DOLLAR = (state, info) => {
    state.exchangRateDollar = info
}

store.mutations.SET_SYMBOL = (state, info) => {
    state.symbol = info
}

/**
 * 直接存储接口返回的所有币对，格式不做处理
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_ALL_SYMBOLS = (state, info) => {
    state.allSymbols = info
}

/**
 * 存储接口返回的自选币对
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_COLLECTION_SYMBOLS = (state, info) => {
    state.collectionSymbols = info
}


/**
 * 扩充交易币种
 * @param state
 * @param currencyArr
 * @constructor
 *
 * currency是一个ap，键名为币种名称，键值为一个对象，里包含：
 * currency: String || 币种名称
 * fullName: String || 币种全称
 * description: String || 币种描述(可以作为币种全称)
 * addressAliasTo: String || 币种协议
 * total: Number || 总值（等于可用available+冻结frozen）
 * available: Number || 可用
 * frozen: Number || 冻结
 * appraisement: Number || 估值（等于总值total*汇率rate）
 * rate: Number || 对BTC的汇率
 * depositEnabled:Boolean || 是否可充，false为不可充，true为可充，此属性USDT、USDT2专用
 * withdrawEnabled:Boolean || 是否可提，false为不可提，true为可提，此属性USDT、USDT2专用
 * withdrawDisabled:Boolean || 是否可提，false为可提，true为不可提，第一版用到的字段，目前接口不返回这个字段
 */
store.mutations.CHANGE_CURRENCY = (state, currencyArr) => {
    // 如果currency没有或者不是数组
    if (!currencyArr || currencyArr instanceof Array === false) return
    // 扩充currency
    for (let i = 0; i < currencyArr.length; i++) {
        // 如果没有name这个属性，跳过即可
        if (!currencyArr[i].name) {
            continue
        }
        // 获取Map币种的对应的对象
        let target = state.currency.get(currencyArr[i].name)
        // 如果不存在，新建一个对象，插入进Map
        if (!target) {
            state.currency.set(currencyArr[i].name, {
                currency: currencyArr[i].name || '',
                isUSDT2: currencyArr[i].name == 'USDT2' || '',//是否是USDT2
                isUSDT3: currencyArr[i].name == 'USDT3' || '',//是否是USDT3
                fullName: currencyArr[i].fullName || '',
                description: currencyArr[i].description || '',
                addressAliasTo: currencyArr[i].addressAliasTo || '',
                total: currencyArr[i].total || 0,
                available: currencyArr[i].available || 0,
                frozen: currencyArr[i].frozen || 0,
                appraisement: currencyArr[i].appraisement || 0,
                otcTotal: currencyArr[i].otcTotal || 0,
                otcAvailable: currencyArr[i].otcAvailable || 0,
                otcFrozen: currencyArr[i].otcFrozen || 0,
                otcAppraisement: currencyArr[i].otcAppraisement || 0,
                rate: currencyArr[i].rate || 0,
                depositEnabled: currencyArr[i].depositEnabled || false,
                withdrawEnabled: currencyArr[i].withdrawEnabled || false,
                withdrawDisabled: currencyArr[i].withdrawDisabled || false,
                rechargeOpenTime: currencyArr[i].rechargeOpenTime || 0,
                withdrawOpenTime: currencyArr[i].withdrawOpenTime || 0,
                displayTime: currencyArr[i].displayTime || 0,
                memo: currencyArr[i].memo === 'yes'
            })
        }
        // 如果已存在，更新内容
        if (target) {
            target.currency = currencyArr[i].name || target.currency || ''
            target.isUSDT2 = currencyArr[i].name == 'USDT2' || target.currency == 'USDT2' || ''
            target.isUSDT3 = currencyArr[i].name == 'USDT3' || target.currency == 'USDT3' || ''
            target.fullName = currencyArr[i].fullName || target.fullName || ''
            target.description = currencyArr[i].description || target.description || ''
            target.addressAliasTo = currencyArr[i].addressAliasTo || target.addressAliasTo || ''
            target.total = currencyArr[i].total || target.total || 0
            target.available = currencyArr[i].available || target.available || 0
            target.frozen = currencyArr[i].frozen || target.frozen || 0
            target.appraisement = currencyArr[i].appraisement || target.appraisement || 0
            target.otcTotal = currencyArr[i].otcTotal || target.otcTotal || 0,
            target.otcAvailable = currencyArr[i].otcAvailable || target.otcAvailable || 0,
            target.otcFrozen = currencyArr[i].otcFrozen || target.otcFrozen || 0,
            target.otcAppraisement = currencyArr[i].otcAppraisement || target.otcAppraisement || 0
            target.rate = currencyArr[i].rate || target.rate || 0
            target.depositEnabled = currencyArr[i].depositEnabled || target.depositEnabled || false
            target.withdrawEnabled = currencyArr[i].withdrawEnabled || target.withdrawEnabled || false
            target.withdrawDisabled = currencyArr[i].withdrawDisabled || target.withdrawDisabled || false
            target.rechargeOpenTime = currencyArr[i].rechargeOpenTime || currencyArr[i].rechargeOpenTime || 0
            target.withdrawOpenTime = currencyArr[i].withdrawOpenTime || currencyArr[i].withdrawOpenTime || 0
            target.displayTime = currencyArr[i].displayTime || currencyArr[i].displayTime || 0
            target.memo = currencyArr[i].memo === 'yes'


        }
        if(target && (target.isUSDT2 || target.isUSDT3)){
            target.displayTime = new Date('2119-12-31').getTime()/1000;//由于不能显示USDT2币种，需要displayTime足够大，在前端入口处统一配置
        }


    }

    // state.currencyChange++
    // if (state.currencyChange > 100) state.currencyChange = 0
}


/**
 * 扩充交易金额，获取account后，对此表进行修改，使用big.js进行精度的处理
 * @param state
 * @param accounts
 * @constructor
 */
store.mutations.CHANGE_ACCOUNT = (state, accounts) => {
    // 如果获取到的信息没有或者不是数组，直接退出即可
    if (!accounts || accounts instanceof Array === false) return
    // 扩充account
    for (let i = 0; i < accounts.length; i++) {
        // 如果没有currency这个属性，跳过即可
        if (!accounts[i].currency) {
            continue
        }
        // 获取Map币种对应的对象
        let target = state.currency.get(accounts[i].currency)


        // 如果不存在这个属性，新建一个
        if (!target) {
            state.currency.set(accounts[i].currency, target = {
                currency: accounts[i].currency,
                fullName: accounts[i].fullName || '',
                description: accounts[i].description || '',
                addressAliasTo: accounts[i].addressAliasTo || '',
                total: accounts[i].total || 0,
                available: accounts[i].available || 0,
                frozen: accounts[i].frozen || 0,
                appraisement: accounts[i].appraisement || 0,
                otcTotal: accounts[i].otcTotal || 0,
                otcAvailable: accounts[i].otcAvailable || 0,
                otcFrozen: accounts[i].otcFrozen || 0,
                otcAppraisement: accounts[i].otcAppraisement || 0,
                rate: accounts[i].rate || 0,
                withdrawDisabled: accounts[i].withdrawDisabled || false,
                rechargeOpenTime: accounts[i].rechargeOpenTime || 0,
                withdrawOpenTime: accounts[i].withdrawOpenTime || 0,
                displayTime: accounts[i].displayTime || 0,
            })
        }

        // 扩充此属性
        // 扩充可用
        if (accounts[i].type === 'SPOT_AVAILABLE') {
            target.available = GlobalFunc.newFixed(accounts[i].balance, 8)
        }
        // 扩充冻结
        if (accounts[i].type === 'SPOT_FROZEN') {
            target.frozen = GlobalFunc.newFixed(accounts[i].balance, 8)
        }
        // 扩充锁仓
        if (accounts[i].type === 'SPOT_LOCKED') {
            // target.frozen = GlobalFunc.accFixed(accounts[i].balance, 8)
            target.locked = GlobalFunc.newFixed(accounts[i].balance, 8)
            // target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
        }
        // 扩充OTC可用
        if (accounts[i].type === 'OTC_AVAILABLE') {
            target.otcAvailable = GlobalFunc.newFixed(accounts[i].balance, 8)
        }
        // 扩充OTC冻结
        if (accounts[i].type === 'OTC_FROZEN') {
            target.otcFrozen = GlobalFunc.newFixed(accounts[i].balance, 8)
        }

        // 修改总值
        target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))
        // 修改估值
        target.appraisement = parseFloat(GlobalFunc.accMul(target.total, target.rate))

        // 修改OTC总值
        target.otcTotal = parseFloat(GlobalFunc.accAdd(target.otcAvailable, target.otcFrozen))
        // 修改OTC估值
        target.otcAppraisement = parseFloat(GlobalFunc.accMul(target.otcTotal, target.rate))
    }
}


/**
 * 清空currency
 * @param state
 * @param info
 * @constructor
 */
store.mutations.CLEAR_CURRENCY = (state, info) => {
    state.currency.clear()
}

/**
 * 修改对BTC的估值，获取最新市场信息后，直接调用，对currency的Map对象里的rate做出修改
 * @param state
 * @param price
 * @constructor
 */
store.mutations.CHANGE_PRICE_TO_BTC = (state, price) => {

    state.price = Object.assign(state.price, price)
    price = state.price

    state.exchange_rate = {
        btcExchangeRate : price['BTC_USDT'] && price['BTC_USDT'][4] || 1,
        ethExchangeRate : price['ETH_USDT'] && price['ETH_USDT'][4] || 1,
    }

    let baseSymbol = 'BTC', middleSymbol = ['ETH', 'USDT']

    // 循环遍历币种资料
    for (let keys of state.currency.keys()) {
        // 获取币种对应的对象
        let target = state.currency.get(keys)

        // 如果没有
        if (!target) {
            continue
        }

        // 如果对应的是基础货币
        if (keys == baseSymbol) {
            target.rate = 1
            target.appraisement = target.total
            continue
        }

        // 获取对应的keys_BTC
        let priceObj = price[keys + '_' + baseSymbol]


        // 如果不存在初始值
        if (!priceObj) {
            // 拿一个翻转货币
            let reversalPriceObj = price[baseSymbol + '_' + keys]

            // 如果有翻转的货币
            if (reversalPriceObj) {
                priceObj = [
                    reversalPriceObj[0],
                    reversalPriceObj[1] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[1]) : 0,
                    reversalPriceObj[2] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[2]) : 0,
                    reversalPriceObj[3] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[3]) : 0,
                    reversalPriceObj[4] != 0 ? GlobalFunc.accDiv(1, reversalPriceObj[4]) : 0,
                    reversalPriceObj[5]
                ]
            }

            // 如果没有翻转的，从中转货币里转
            if (!reversalPriceObj) {

                let priceObjToMiddleSymbol = null, i = 0, middlePrice = null

                do {
                    priceObjToMiddleSymbol = price[keys + '_' + middleSymbol[i]]

                    if(price[middleSymbol[i] + '_' + baseSymbol]){
                        middlePrice = price[middleSymbol[i] + '_' + baseSymbol];
                    }else{
                        middlePrice = price[baseSymbol + '_' + middleSymbol[i]];
                        middlePrice && (middlePrice = [
                            middlePrice[0],
                            middlePrice[1] != 0 ? GlobalFunc.accDiv(1, middlePrice[1]) : 0,
                            middlePrice[2] != 0 ? GlobalFunc.accDiv(1, middlePrice[2]) : 0,
                            middlePrice[3] != 0 ? GlobalFunc.accDiv(1, middlePrice[3]) : 0,
                            middlePrice[4] != 0 ? GlobalFunc.accDiv(1, middlePrice[4]) : 0,
                            middlePrice[5]
                        ])
                    }
                    i++
                } while (!priceObjToMiddleSymbol && i < middleSymbol.length)

                // 如果连对中转币对的值都没有，那就没有估值了
                if (!priceObjToMiddleSymbol || !middlePrice) continue

                // 如果拿到了对中转货币priceObjToEth的估值，并且拿到了中转货币对目标货币的估值，两者相乘即为对目标货币的估值
                priceObj = [
                    priceObjToMiddleSymbol[0],
                    GlobalFunc.accMul(priceObjToMiddleSymbol[1], middlePrice[1]),
                    GlobalFunc.accMul(priceObjToMiddleSymbol[2], middlePrice[2]),
                    GlobalFunc.accMul(priceObjToMiddleSymbol[3], middlePrice[3]),
                    GlobalFunc.accMul(priceObjToMiddleSymbol[4], middlePrice[4]),
                    priceObjToMiddleSymbol[5]
                ]
            }
        }

        // 修改目标的比率
        target.rate = priceObj[4]

        // 修改估值
        target.appraisement = GlobalFunc.accMul(target.rate, target.total)

    }

}
/*store.mutations.CHANGE_PRICE_TO_BTC = (state, price) => {

    state.price = Object.assign(state.price, price)
    price = state.price

    let baseSymbol = 'BTC', middleSymbol = 'ETH',
        middlePrice = price[middleSymbol + '_' + baseSymbol]

    // 循环遍历币种资料
    for (let keys of state.currency.keys()) {
        // 获取币种对应的对象
        let target = state.currency.get(keys)

        // 如果没有
        if (!target) {
            continue
        }

        // 如果对应的是基础货币
        if (keys == baseSymbol) {
            target.rate = 1
            target.appraisement = target.total
            continue
        }

        // 获取对应的keys_BTC
        let priceObj = price[keys + '_' + baseSymbol]


        // 如果不存在初始值
        if (!priceObj) {
            // 拿一个翻转货币
            let reversalPriceObj = price[baseSymbol + '_' + keys]

            if (reversalPriceObj) {
                priceObj = [
                    reversalPriceObj[0],
                    reversalPriceObj[1] ? GlobalFunc.accDiv(1, reversalPriceObj[1]) : 0,
                    reversalPriceObj[2] ? GlobalFunc.accDiv(1, reversalPriceObj[2]) : 0,
                    reversalPriceObj[3] ? GlobalFunc.accDiv(1, reversalPriceObj[3]) : 0,
                    reversalPriceObj[4] ? GlobalFunc.accDiv(1, reversalPriceObj[4]) : 0,
                    reversalPriceObj[5]
                ]
            }
        }


        // 如果既没有拿到值，又没有拿到中转的货币对
        if (!priceObj && !middlePrice) {
            continue
        }

        // 如果没有，从ETH里转
        if (!priceObj && middlePrice) {
            let priceObjToMiddleSymbol = price[keys + '_' + middleSymbol]

            // 如果连对中转币对的值都没有，那就没有估值了
            if (!priceObjToMiddleSymbol) continue
            // 如果拿到了对中转货币priceObjToEth的估值，并且拿到了中转货币对目标货币的估值，两者相乘即为对目标货币的估值
            priceObj = [
                priceObjToMiddleSymbol[0],
                GlobalFunc.accMul(priceObjToMiddleSymbol[1], middlePrice[1]),
                GlobalFunc.accMul(priceObjToMiddleSymbol[2], middlePrice[2]),
                GlobalFunc.accMul(priceObjToMiddleSymbol[3], middlePrice[3]),
                GlobalFunc.accMul(priceObjToMiddleSymbol[4], middlePrice[4]),
                priceObjToMiddleSymbol[5]
            ]
        }

        // console.warn("this is keys", keys, priceObj)
        // 修改目标的比率
        target.rate = priceObj[4]

        // 修改估值
        target.appraisement = GlobalFunc.accMul(target.rate, target.total)

    }

}*/


/**
 * 重置currency
 * @param state
 * @param info
 * @constructor
 */
store.mutations.RESET_CURRENCY = (state, info) => {
    state.currency.clear()
    state.currencyChange++
    if (state.currencyChange > 100) state.currencyChange = 0
}


/**
 * 改变汇率
 * @param state
 * @param info
 * btcExchangeRate
 * @constructor
 */
store.mutations.SET_EXCHANGE_RATE = (state, info) => {
    state.exchange_rate = info
}


store.mutations.SET_MARKET_LIST = (state, info) => {
    state.marketList = info
}
store.mutations.SET_MARKET_PRICE_MERGE = (state, info) => {
    state.marketPriceMerge = info
}
store.mutations.SET_NEW_PRICE = (state, info) => {
    state.newPrice = info
}
store.mutations.SET_DEPTH_MERGE = (state, info) => {
    state.depthMerge = info
}
store.mutations.SET_MARKET_USE_RATE = (state, info) => {
    state.marketUseRate = info
}
store.mutations.SET_TRADE_LIST = (state, info) => {
    state.tradeList = info
}

/**
 * 全站交易数据
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_ALL_DEAL_DATA = (state, info) => {
    state.allDealData = info
}

/**
 * 获取服务器时间
 * @param state
 * @param time
 * @constructor
 */
store.mutations.SET_SERVER_TIME = (state, time) => {
    state.serverTime = time
    state.serverTimeInterval && clearInterval(state.serverTimeInterval)
    let thatTime = new Date()

    state.serverTimeInterval = setInterval(() => {
        let now = new Date()
        state.serverTime += now - thatTime//因为app后台运行时setInterval不执行，所以这么写
        thatTime = now
        // state.serverTime += 1000

        state.serverTimeCallBack &&  state.serverTimeCallBack(state.serverTime)
    }, 1000)

}

/**
 * 计算服务器时间的回调
 * @param state
 * @param callback
 * @constructor
 */
store.mutations.SET_SERVER_TIME_CALL_BACK = (state, callback) => {
    state.serverTimeCallBack = callback
}


/**
 * 修改谷歌认证状态
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_GOOGLE_STATE = (state, val) => {
    state.authState && (state.authState.ga = val)
}
store.mutations.SET_MOBILE_STATE = (state, val) => {
    state.authState && (state.authState.sms = val)
}
/**
 * BDB燃烧状态
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_FEE_BDB_STATE = (state, val) => {
    state.feeBdbState = val;
}

/**
 * 今日待分配USDT
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_FEE_DIVIDEND = (state, val) => {
    state.feeDividend = val;
}

/**
 * 返利百分比
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_REWARD = (state, val) => {
    state.reward = val;
}

/**
 * 活动百分比
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_ACTIVITY = (state, val) => {
    state.activity = val;
}

// 设备信息
store.mutations.SET_DEVICE_HEIGHT_STATE = (state, val) => {
    state.deviceHeightState = val;
}
/**
 * 用户信息推送
 */
store.mutations.SET_USER_PUSH_MSG = (state, info) => {
    state.userPushMsg = info
}
store.mutations.SET_USER_PUSH_ARRAY = (state, info) => {

    info.length === 0 && (state.userPushArray = []) || (state.userPushArray.push(info));

}
/**
 * 减免手续费
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_FEE_DISCOUNT = (state,val) => {
    state.feeDiscount = val;
}

// 实名认证状态
store.mutations.GET_IDENTITY_INFO = (state,val) => {
    state.getIdentityInfo = val;
}

/**
 *
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_MARKET_LIST_DEFAULT = (state,val) => {
    state.marketListDefault = val;
}
/**
 * 手势密码状态
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_GESTURE = (state,val) => {
    state.gesture = val;
}
/**
 * 手势登录状态
 * @param state
 * @param val
 * @constructor
 */
store.mutations.SET_SHOW_GESTURE = (state,val) => {
    state.showGesture = val;
}
store.mutations.SET_SHOW_GESTURE_TIME = (state,val) => {
    state.showGestureTime = val;
}

/**
 * 手势推荐弹窗是否显示
 * @type {boolean}
 */
store.mutations.SET_RECOMMEND_GESTURE = (state,val) => {
    state.recommendGesture = val;
}

store.mutations.SET_AREA_CODE = function (state, num) {
	state.areaCode = num
}

store.mutations.SET_AREA_NAMECN = function (state, info) {
	state.areaNameCn = info
}


store.mutations.SET_HOME_SYMBOLS = function (state, num) {
	state.homeSymbols = num
}


export default store