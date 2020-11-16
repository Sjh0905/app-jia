/**
 * Created by hjx on 2018/4/4
 */
import env from '../environmentConfigs/env'

const c2cUrl = env.networkConfigs.c2cUrl
const requestAddress = {}

requestAddress.TEST = {
    url: "/apis/some/url",
    method: "get",
    timeout: 10000,
    baseUrl: '',
    credentials: 'same-origin',
    urlFragment: ''
}

// requestAddress.GET_CURRENCY = {url: '/user/currencys', method: 'get'} //获取币种

requestAddress.LOGIN = {url: '/user/signin', method: 'post'}  // 登录
// requestAddress.LOGIN = {url: '/user/signInForTest', method: 'post'}  // 登录，链接后台测试专用

requestAddress.LOGIN_BY_MOBILE = {url: '/user/signInByMobile', method: 'post'} // 手机登录

requestAddress.LOGOFF = {url: '/user/signout', method: 'post'} //登出

requestAddress.REGISTER = {url: '/user/register', method: 'post'}  // 邮箱注册
requestAddress.REGISTER_BY_MOBILE = {url: '/user/registerByMobile', method: 'post'}  // 手机注册


requestAddress.VERIFYING_LOGIN_STATE = {url: '/auth/isFalseLogin', method: 'post'} //验证伪登录状态

requestAddress.POST_VERIFICATION_CODE = {url: '/auth/getVerificationCode', method: 'post'} //发起各种验证码请求，如谷歌、手机等

requestAddress.POST_COMMON_AUTH = {url: '/auth/commonAuth', method: 'post'} //各种认证，如绑定手机、绑定密码、发起提现等

requestAddress.GET_AUTH_STATE = {url: '/auth/getAuths', method: 'post'} //获取认证状态

requestAddress.CHECK_LOGIN_IN = {url: '/user/checkLogin', method: 'post'} //检查登录

requestAddress.AREACODE = {url: '/user/AreaCode', method: 'get'} //获取地区手机号前缀


requestAddress.COMMON_SYMBOLS = {url: '/user/symbols', method: 'get'} //获取货币对

requestAddress.DEPTH = {url: '/v1/market/depth', method: 'get'} //深度

requestAddress.GET_EXCHANGE__RAGE = {url: '/user/getExchangeRate', method: 'get'} //获取各种汇率


requestAddress.GET_HOME_BANNERM = {url: '/user/homeBannerM', method: 'get'} //移动端banner


requestAddress.HOME_SYMBOLS_APP = {url: '/user/homePage/symbols/APP', method: 'get'} //首页导航币种顺序


requestAddress.FIND_BACK_PASSWORD = {url: '/auth/commonAuth', method: 'post'} //找回密码

requestAddress.FIND_BACK_PASSWORD_RESET = {url: '/user/resetLoginPassword', method: 'post'}//找回密码重置

requestAddress.FIND_BACK_PASSWORD_RESET_MOBILE = {url: '/user/resetMobileLoginPassword', method: 'post'}//找回密码重置_手机

requestAddress.VERIFYING_LOGIN_STATE = {url: '/auth/isFalseLogin', method: 'post'} //验证伪登录状态

requestAddress.FIND_FEE_BDB_INFO = {url: '/user/findfeebdbinfo', method: 'get'} //查询BDB是否抵扣

requestAddress.CHANGE_FEE_BDB = {url: '/user/feebdbchange', method: 'post'} //修改BDB抵扣策略

requestAddress.FIND_FEE_DEDUCTION_INFO = {url: '/user/findFeeDeductionInfo', method: 'get'} //查询TT是否抵扣

requestAddress.FEE_CHANGE = {url: '/user/feechange', method: 'post'} //修改TT抵扣策略

requestAddress.POST_CHANGE_PASSWORD = {url: '/user/alterLoginPassword', method: 'post'} //修改密码接口


requestAddress.TRADE_ORDERS = {url: '/v1/trade/orders', method: 'post'} // 买卖/撤单

requestAddress.GRC_PRICE_RANGE = {url: '/user/grc/symbol/priceRange', method: 'get'} // 获取grcPriceRange 的接口

requestAddress.KK_PRICE_RANGE = {url: '/user/kk/symbol/priceRange', method: 'get'} // 获取KKPriceRange 的接口

requestAddress.GET_CURRENCY = {url: '/user/currencys', method: 'get'}   //获取币种

requestAddress.GET_OTC_CURRENCY = {url: '/user/otc/currency', method: 'get'} //获取法币

requestAddress.GET_ACCOUNTS = {url: '/v1/user/currency/accounts', method: 'get'}    // 获取账户信息
// requestAddress.GET_ACCOUNTS = {url: '/v1/user/accounts', method: 'get'}    // 获取账户信息2

requestAddress.MARKET_PRICES = {url: '/v1/market/prices', method: 'get'} // 获取货币对价格

requestAddress.GET_EXCHANGE_RAGE = {url: '/user/getExchangeRate', method: 'get'}//获取各种汇率

requestAddress.GET_RECHARGE_ADDRESS = {url: '/user/deposit', method: 'post'} //充值

requestAddress.RECHARGE_LOG = {url: '/user/depositLog', method: 'post'} //充值记录

requestAddress.WITHDRAWS_LOG = {url: '/user/withdrawLog', method: 'post'}  //提现记录

requestAddress.GET_TRANSFER_LIST = {url: '/user/inner/transfer/list', method: 'get'}  //内部转账记录

requestAddress.GET_TRANSFER_SPOT_LIST = {url: '/user/transfer/spot/list', method: 'get'}  //划转记录

requestAddress.KK_ACTIVITY_REWARDS = {url: '/user/getKKActivityRewards', method: 'post'} // 获取KK 详情列表的接口

requestAddress.INITIAL_REWARD = {url:'/user/initial/reward', method: 'get'} // 获取活动奖励的接口

requestAddress.REWARDS_LOG = {url: '/user/getGrcActivityRewards', method: 'post'}  //奖励记录

requestAddress.GET_TKF_PAY_RECORD = {url: '/tkf/tkfPayRecord', method: 'get'}  //基金理财记录

requestAddress.GET_WEEK_REWARD = {url: '/user/getWeekReward', method: 'get'}  //周热度奖励接口

requestAddress.GET_MONTH_REWARD = {url: '/user/getMonthReward', method: 'get'}  //月度返现接口

requestAddress.GET_PURCHASE_RECORD = {url: '/user/transfer/spot/purchaseRecord', method: 'get'}  //资金往来

requestAddress.POST_MY_RECOMMEND = {url: '/user/myinvitees', method: 'post'} // 获取我的推荐奖励


requestAddress.TIMESTAMP = {url: '/v1/common/timestamp', method: 'get'} // 获取服务器时间

requestAddress.BARS = {url: '/v1/market/bars/', method: 'get'} // 获取K线历史数据

requestAddress.POST_WITHDRAW_ADDRESS = {url: '/user/withdrawAddressesByCurrency', method: 'post'}//提现地址列表

requestAddress.POST_WITHDRAW_FEE_INFO = {url: '/user/getwithdrawFeeInfo', method: 'post'} //获取提现费率

requestAddress.GET_SEVER_TIME = {url: '/user/getServerTime', method: 'get'}    // 获取服务器时间 /user/getServerTime

requestAddress.POST_DELETE_ADDRESS = {url: '/user/delWithdrawAddresses', method: 'post'} //删除提现地址

requestAddress.POST_USER_ORDERS = {url: '/user/orders', method: 'post'} // 当前委托和历史委托，参数为'offsetId:开始查询的订单id','limit:获取数量','isFinalStatus:是否为历史订单，true为历史订单，false为当前订单'

requestAddress.POST_CANCEL_WITHDRAWALS = {url: '/user/cancelWithdrawRequest', method: 'post'}   // 撤销提现申请

//requestAddress.NOTICE_LIST = {url: '/user/findNoticeInfo', method: 'post'}

// requestAddress.GET_ORDERS_DETAIL = {url: '/v1/trade/orders', method: 'get'} //获取委托订单详情，需要拼接
requestAddress.GET_ORDERS_DETAIL = {url: '/user/orders', method: 'get'} //获取委托订单详情，需要拼接
requestAddress.POST_FEE_DETAIL = {url: '/user/feeDetails', method: 'post'} //获取抵扣详情




// mobile 公告列表
requestAddress.MOBILE_POST_NOTICE_LIST = {url: '/user/findNoticeList', method: 'post'}
// mobile 公告详情
requestAddress.MOBILE_POST_NOTICE_DETAIL = {url: '/user/findNoticeInfo', method: 'post'}

requestAddress.POST_COMMON_AUTH_UNBIND = {url: '/auth/removeAuth', method: 'post'} //解绑手机接口，解绑谷歌验证

//获取cookie接口 发给h5活动页面 h5接到原始数据发送到他自己的地方（/user/putcookies）接口 post方法
requestAddress.GET_COOKIES = {url: '/user/cookies', method: 'get'}

//获取版本号
requestAddress.GET_APP_UPDATE = {url: '/user/AppUpdate', method: 'get'}

//获取当前挖矿分红
requestAddress.GET_FEE_DIVIDEND = {url: '/activity/getFeeDividend', method: 'get'}

// BDB燃烧奖励
requestAddress.BURING_BDB_REWARD = {url: '/activity/buringBDBReward', method: 'post'}

// 获取我的推荐奖励BT
requestAddress.GET_MY_INVITES_FOR_BT = {url: '/activity/getMyInvitesForBT', method: 'post'}

// BT文案参数配置
requestAddress.REGULATION_CONFIG = {url: '/activity/regulationConfig', method: 'get'}

// 获取海报图片
requestAddress.GET_INVITE_POSTER = {url: '/user/getInvitePoster', method: 'post'}

// 获取工单类型列表
requestAddress.LIST_ORDER_TYPE = {url: '/xxx/listOrderType', method: 'get'}

// 提交工单
requestAddress.CREATE_ORDER = {url: '/xxx/createOrder', method: 'post'}

//获取人工实名认证状态
requestAddress.GET_IDENTITY_AUTH_STATUS = {url:'/auth/getIdentityAuthStatus', method: 'get'}

//人工认证提交身份认证
requestAddress.SEND_IDENTITY = {url: '/auth/sendIdentity', method: 'post'}

//获取被驳回的认证状态，此接口已经存在调用
// requestAddress.GET_IDENTITY_INFO = {url: '/auth/getIdentityInfo', method: 'get'}

// 上传身份证 正面/反面
requestAddress.SEND_IDENTITY_CARD = {url: '/auth/sendIdentityCard', method: 'post'}

// 上传视频
requestAddress.SEND_IDENTITY_BODY = {url: '/auth/sendIdentityBody', method: 'post'}

// 获取数字
requestAddress.AUTH_RANDOM_NUMBER = {url: '/auth/authRandomNumber', method: 'post'}

// 获取驳回后用户的认证状态，目前APP只调用这个
requestAddress.GET_IDENTITY_INFO = {url: '/auth/getIdentityInfo', method: 'get'}

// 获取身份认证状态
requestAddress.GET_IDENTITY_AUTH_STATUS = {url: '/auth/getIdentityAuthStatus', method: 'get'}

// Lite方案获取token
requestAddress.GET_FACE_TOKEN = {url: 'http://28a735.natappfree.cc/auth/faceToken', method: 'post'}

// 退出认证
requestAddress.EXIT_AUTHENTICATION = {url: '/auth/exitAuthentication', method: 'post'}

// 重新上传
requestAddress.UPLOADA_AGAIN = {url: '/auth/uploadaAgain', method: 'post'}

// 获取c2c需要cookie的接口
requestAddress.GET_COOKIES_C2C = {url: '/user/getCookies', method: 'get'}

// 调用火币汇率的接口
requestAddress.GET_HUOBI_MARKET_RATE = {url: 'https://otc-api.huobi.co/v1/data/market/detail', method: 'get',baseUrl:''}

// 获取自选区
requestAddress.GET_COLLECTION_SYMBOL = {url: '/user/getCollectionSymbol', method: 'get'}
// 点击取消\添加自选区
requestAddress.POST_COLLECTION_SYMBOL = {url: '/user/collectSymbol', method: 'post'}
// 自选区币对排序
requestAddress.POST_ORDER_SYMBOL = {url: '/user/orderSymbol', method: 'post'}

//查询报名记录
requestAddress.GET_GETREG_DATA = {url: '/quant/getRegData/', method: 'get'}
//获取用户组等级信息
requestAddress.GET_ASSEMBLE_GET = {url: '/assemble/getMem/', method: 'get'}

// 是否是会员
requestAddress.GET_CHECK_MEMBER = {url: '/memberCard/checkMember/', method: 'get'}

// 会员购买记录
requestAddress.GET_BUY_RECORDS = {url: '/memberCard/buyRecords/', method: 'get'}



//---------------------------------------C2C接口部分----------------------------------------------

requestAddress.GET_USER_ACCOUNT_V2 = {url: '/future/account/userAccountv2', method: 'get'}  //账户余额
requestAddress.GET_POSITION_RISK_V2 = {url: '/future/account/positionRiskv2', method: 'get'}  //仓位

//---------------------------------------C2C接口部分----------------------------------------------


requestAddress.PUT_COOKIES_C2C = {url: '/user/putUserCookies', method: 'get',baseUrl:c2cUrl}

// 判断登录状态 checkLoginForC2C
requestAddress.CHECK_LOGIN = {url: '/c2c/user/checkLoginForC2C', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl};
//无参数

//socket监听地址：根据checkLoginForC2C接口返回的数据 dataMap中的socket信息拼接该用户socket监听地址
// let socket = data.dataMap.socket;
// let socket_url = socket.url + '?key=' + socket.data.key + '&unid=' + socket.data.unid + '&time=' + socket.data.time;


// 申请商家时候获取当前用户认证状态 getUserAuthInfo
requestAddress.GET_USER_AUTO_INFO = {url: '/c2c/user/getUserAuthInfo', method: 'get', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

// 2018-8-14 申请成为商家
requestAddress.APPLY_BUSINESS = {url: '/c2c/user/submissionForSeller', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// 申请成为商家时，body中传参 {currency:'支付币种'}

// 我的订单 接口 /user/getListOfCtcOrders
requestAddress.GET_LIST_ORDERS = {url: '/c2c/user/getListOfCtcOrders', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//     offset: this.selectIndex,
//     maxResults: 10,
//     status: 'OTHER', //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消, 'OTHER'
//     ctcOrderId: search || '',//传 单号 或''
// }

// 2018-8-21 c2c首页请求列表
requestAddress.GET_LIST_OF_LISTS= {url: '/c2c/user/getListOfLists', method: 'get', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// url末尾通过问号拼接参数 {
//     offset: this.offset,
//     maxResults: this.maxResults,
//     status: 'BUY_ORDER',//'SELL_ORDER'  'BUY_ORDER'
//     currency: 'USDT',
// }

// 我的订单 确认付款
requestAddress.COMFIRM_PAYMENT = {url: '/c2c/user/toConfirmPayment', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//   "ctcOrderId": this.ctc_order.id
// }

// 订单详情 getCtcOrderDetail
requestAddress.CTC_ORDER_DETAIL = {url: '/c2c/user/getCtcOrderDetail', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
requestAddress.CTC_ORDER_DETAIL = {url: '/c2c/user/getOtcOrderDetail', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//     userId: this.userId,
//     c2cOrderType: this.order_type,//根据接口返回的订单类型传入对应的值
//     ctcOrderId: this.ctcOrderId,
// }

// 获取服务器时间 /user/getServerTime
requestAddress.GET_SEVER_TIME_FOR_C2C = {url: '/c2c/user/getServerTime', method: 'get', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

// 获取用户的认证状态,PC中是GET_AUTH_STATE
requestAddress.GET_AUTH_STATE_FOR_C2C = {url: '/c2c/auth/getAuthsForC2C', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

// 获取用户的usdt资产
requestAddress.ACCOUNTS = {url: '/c2c/user/userAccounts', method: 'get',baseUrl:c2cUrl}
// url末尾通过问号拼接参数 {
//   currency: 'USDT'
// }

// 确认下单接口
requestAddress.PLACE_AN_ORDER = {url: '/c2c/user/placeAnOrder', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//     orderId: this.buyItem.id,//买单或者买单id
//     amount: this.inputNum,//下单数量
// }

// 商户下单接口
requestAddress.CREATE_POSTER_ORDER = {url: '/c2c/user/createPostersOrder', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//   postersType: 'BUY_ORDER',//如果卖单则为'SELL_ORDER'
//     userId: this.userId,
//     currency: 'USDT',
//     toCurrency: 'CNY',
//     price: this.buyInputPrice,
//     total: this.buyInputNum,
//     amount: this.buyInputNum,
//     maxLimit: this.buyInputMaxNum,
//     minLimit: this.buyInputMinNum,
// }

// 买入详情，取消订单 /cancelCtcOrder
requestAddress.CANCEL_CTC_ORDER = {url: '/c2c/user/cancelCtcOrder', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//     confirmNOPay: this.no_pay_agree ? 0 : 1,//未付款是0 否1
//     ctcOrderId: this.ctcOrderId,
// }

// 发送邮箱/短信验证码
requestAddress.ORDER_MAIL_CODE = {url: '/c2c/auth/getVerificationCodeForC2C', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//   type: "email",//"email" ,"mobile"
//     mun: "",
//     purpose:"Confirm"
// }

// 验证短信/邮箱验证码 commonAuthForC2C
requestAddress.COMMEN_AUTH_FORCTC = {url: '/c2c/auth/commonAuthForC2C', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//     "type": pickedType,//pickedType 为 'mobile'、'ga'、'email' 之一
//     "code": code,
//     "purpose":"Confirm",
//     "ctcOrderId": this.ctc_order.id
// }

// 2018-8-20 支付设置部分
// 支付设置初始化
requestAddress.PAYMENT_SET_INIT = {url: '/c2c/payInf/showPayInfo', method: 'get',baseUrl:c2cUrl}
//无参数

// 获取支持交易的银行
requestAddress.GET_BANK = {url: '/c2c/payInf/getBanks', method: 'get',baseUrl:c2cUrl}
//无参数

// 添加支付信息
requestAddress.ADD_PAYMENT_INFO = {url: '/c2c/payInf/addPayInfo', method: 'post',baseUrl:c2cUrl}
//body中传参为formdata类型的数据
//------------绑定银行卡-----------
// userPayInfoBean: "{
// "type":"BANKCARD",
// "mark":"备注",
// "username":"测试",
// "bankName":"中国民生银行",
// "bankId":100002,
// "bankAddr":"北京崇文门",
// "cardNumber":"6217002090190190",
// "isDefault":0,
// "method":"ga",
// "code":"330331"}"
//------------绑定支付宝，目前生产没有上线此功能-----------
// formData.append('userPayInfoBean', JSON.stringify({
//   'type': 'ALIPAY',
//   'mark': this.aLiPayPrompt,
//   'username': this.aLiPayName,
//   'cardNumber': this.aLiPayAccount,
//   'url': !this.aLiPayCodeImgType && this.aLiPayCodeImg || null,
//   'isDefault': 1,
//   'method': method,
//   'code': code
// }))
// //如果this.aLiPayCodeImgType为true增加以下字段
// this.aLiPayCodeImgType && formData.append('image', this.aLiPayCodeImg, 'ALIPAY.' + this.aLiPayCodeImgType)

// 修改支付信息
requestAddress.CHANGE_PAYMENT_INFO = {url: '/c2c/payInf/modifyBankcard', method: 'post',baseUrl:c2cUrl}
//body中传参为formdata类型的数据
//-------------------修改绑定银行卡信息----------------------
// userPayInfoBean: "{
// "type":"BANKCARD",
// "mark":"备注",
// "username":"测试",
// "bankName":"中国民生银行",
// "bankId":100002,
// "bankAddr":"北京崇文门",
// "cardNumber":"6217002090190190",
// "isDefault":0,
// 'id': this.bankId,
// "method":"ga",
// "code":"330331"}"

//------------修改绑定支付宝信息，目前生产没有上线此功能-----------
// formData.append('userPayInfoBean', JSON.stringify({
//   'type': 'ALIPAY',
//   'mark': this.aLiPayPrompt,
//   'username': this.aLiPayName,
//   'cardNumber': this.aLiPayAccount,
//   'url': !this.aLiPayCodeImgType && this.aLiPayCodeImg || null,
//   'id': this.aLiPayCodeId,
//   'isDefault': 1,
//   'method': method,
//   'code': code
// }))
//
// this.aLiPayCodeImgType && formData.append('image', this.aLiPayCodeImg, 'ALIPAY.' + this.aLiPayCodeImgType)

// 目前未用到，修改启用状态
requestAddress.CHANGE_PAYMENT_STATUS = {url: '/c2c/payInf/modifyStatus', method: 'get',baseUrl:c2cUrl}
// url末尾拼接参数 {
//   type: 'ALIPAY'支付宝支付 \ 'BANKCARD'银行支付
// }

// 删除支付信息
requestAddress.DELETE_PAYMENT_INFO = {url: '/c2c/payInf/delete', method: 'get',baseUrl:c2cUrl}
// url末尾拼接参数 {
//   id: id
// }
// 设置默认支付
requestAddress.SET_DEFAULT_PAYMENT = {url: '/c2c/payInf/isDefault', method: 'get',baseUrl:c2cUrl}
// url末尾拼接参数 {
//   id: this.modifyDefaultBankId
// }

// 发送手机验证码
requestAddress.SEND_MOBILE_VERIFY_CODE = {url:'/c2c/payInf/SendCode',method:'get',baseUrl:c2cUrl}
//无参数

// 商家中心
// 商家中心顶部接口
requestAddress.POST_BUSINESS_BASE_INFO = {url: '/c2c/user/getBusinessBaseInfo', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参{
//   userId: this.userId,
// }
// 商户部分挂单接口
requestAddress.GET_PART_POSTER_ORDER_LIST = {url: '/c2c/user/getPartPosterOrderList', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

// 我的商家订单
requestAddress.GET_BUSINESS_ORDER_LIST = {url: '/c2c/user/getBusinessOrderList', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参{
//     binessUserId: this.userId,
//     status: 'COMPLETE',//'COMPLETE' 'PROCESSING' 'CANCEL'
//     offset: this.offset,
//     maxResults: this.maxResults
// }

// 我的商家撤单
requestAddress.CANCEL_POSTER_ORDER = {url: '/c2c/user/cancelPostersOrder', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// body中传参 {
//   postersOrderId: this.itemContainer.id,
// }

// 登出 signoutForC2C
requestAddress.SIGNOUT_CTC = {url: '/c2c/user/signoutForC2C', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

//登出后清除cookie，btb_url:C2C项目的域名https://www.valuepay.io/
// 'apis/user/clearUserCookies?uri=' + encodeURI(btb_url);

// 检测用户是否被禁止交易
requestAddress.VALIDATE_USER_CAN_TRADE = {url: '/c2c/user/validateUserCanTrade', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

// 点击关闭c2c首次弹框
requestAddress.CONFIRM_MARKET_RULES_RECORD = {url: '/c2c/user/confirmMarketRulesRecord', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数

// 首次进入c2c是否显示弹框
requestAddress.IS_FIRST_VISIT = {url: '/c2c/user/isFirstVisit', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//无参数


//---------------------------------------C2C项目中前端代码有写但是未用到的接口----------------------------------------


// 我的订单 确认已收，目前没有用到
requestAddress.COMFIRM_RECEIVED = {url: '/c2c/user/toConfirmReceived', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// 进入详情页时候判断用户支付方式有无变化，目前调用此接口代码为注释状态
requestAddress.USER_PAY_INFO = {url: '/c2c/user/validateUserPayInfo', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
//body中传参
// {
//   ctcOrder: ctc_order,
// }
// 点击一键购买
requestAddress.POST_DASH_BUTTON = {url: '/c2c/user/quickBuy', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
requestAddress.POST_DASH_BUTTON_SELL = {url: '/c2c/user/quickSell', method: 'post', timeout: null, responseType: 'json',baseUrl:c2cUrl}
// 获取银行卡信息
requestAddress.GET_DASH_BUTTON = {url: '/c2c/user/payInfo', method: 'get', timeout: null, responseType: 'json',baseUrl:c2cUrl}

export default requestAddress