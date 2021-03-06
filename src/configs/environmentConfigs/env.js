const env = {}
// wss.2020.exchange
// app.2020.exchange
env.networkConfigs = {}
env.networkConfigs.baseUrl = process.env.URL || 'https://app.2020.exchange/'//生产环境
// env.networkConfigs.baseUrl = process.env.URL || 'http://app.2020-ex.com/'//测试环境

// env.networkConfigs.baseUrl = process.env.URL || 'http://10.113.10.137:8000/'//柚子皮
// env.networkConfigs.baseUrl = process.env.URL || 'http://18.163.24.239:8000/'//如果写IP地址，需要有专用的登录接口，否则不能set-cookie
// env.networkConfigs.baseUrl = process.env.URL || 'http://app-zpy.highdefi.com:8000/'//测试环境

// env.networkConfigs.currencyLogoUrl = process.env.LOGOURL || 'http://logo.2020.exchange/'//币种logo地址
// env.networkConfigs.c2cUrl = process.env.C2CURL || 'https://otc.2020.exchange/'
env.networkConfigs.GRCURL = process.env.GRCURL || 'https://xxx'//活动页

env.networkConfigs.port = process.env.PORT || ''
env.networkConfigs.timeout = 15000
env.networkConfigs.domain = env.networkConfigs.baseUrl.replace(/\/$/,'');
env.networkConfigs.headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}
env.networkConfigs.credentials = 'include'

env.networkConfigs.downloadUrl  = '';
env.networkConfigs.downloadPageUrl  = '';
//注意拼接downloadUrl的时候最后一定要加"/"
if(env.networkConfigs.baseUrl.indexOf('app.2020.exchange') > -1){
    env.networkConfigs.downloadUrl = 'https://www.2020.exchange/';
    // env.networkConfigs.downloadUrl = 'https://transfer.2020.exchange/';
    env.networkConfigs.downloadPageUrl  = 'https://download.2020.exchange/';
    env.networkConfigs.c2cUrl = 'https://otc.2020.exchange/'
    env.networkConfigs.futuresUrl = 'https://futures.2020.exchange/'
}

if(env.networkConfigs.baseUrl.indexOf('app.2020-ex.com') > -1){
    // env.networkConfigs.downloadUrl = 'http://zpy.2020-ex.com:8084/';
    env.networkConfigs.downloadUrl = 'http://transfer.2020-ex.com/';
    // env.networkConfigs.downloadUrl = 'http://www.2020-ex.com/';
    env.networkConfigs.downloadPageUrl  = 'http://download.2020-ex.com/';
    env.networkConfigs.c2cUrl = 'http://otc.2020-ex.com/'
    env.networkConfigs.futuresUrl = 'http://future.2020-ex.com/'
    // env.networkConfigs.futuresUrl = 'http://zpy.2020-ex.com:8085/'
}

//跳转到app下载页面所需地址
// env.networkConfigs.testUrl =   //测试环境

env.socketConfigs = {}
// socket请求地址
env.socketConfigs.url = process.env.SOCKET || 'wss://wss.2020.exchange/v1/market/notification' //node生产地址2
// env.socketConfigs.url = process.env.SOCKET || 'ws://appwss.2020-ex.com/v1/market/notification' //test地址

//如果用socket.io-client框架需要放开以下配置
// env.socketConfigs.options = {}
// env.socketConfigs.options.path = '/v1/market/notification'  //请求路径
// env.socketConfigs.options.transports = ['websocket'] //请求
// env.socketConfigs.options.reconnection = true //是否自动重新连接
// env.socketConfigs.options.reconnectionAttempts = 100 //重新连接尝试次数
// env.socketConfigs.options.reconnectionDelayMax = 3000 //重新连接之间最长等待时间
// env.socketConfigs.options.timeout = 20000 //connect_error和connect_timeout事件发出之前的等待时间
// env.socketConfigs.options.autoConnect = true //自动连接
// env.socketConfigs.options.query = {} //携带的query

export default env


