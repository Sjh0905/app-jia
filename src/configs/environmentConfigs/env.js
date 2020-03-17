const env = {}
// appwss.eunex.group
// app.eunex.group
env.networkConfigs = {}
// env.networkConfigs.baseUrl = process.env.URL || 'https://android.eunex.group/'//生产环境
env.networkConfigs.baseUrl = process.env.URL || 'https://app.eunex.group/'//生产环境2
// env.networkConfigs.baseUrl = process.env.URL || 'https://www.highdefi.com/'//测试环境
// env.networkConfigs.baseUrl = process.env.URL || 'http://10.113.11.89:8000/'//王琪
// env.networkConfigs.baseUrl = process.env.URL || 'http://10.113.11.20:8000/'//cuifan
// env.networkConfigs.currencyLogoUrl = process.env.LOGOURL || 'http://logo.eunex.group/'//币种logo地址
env.networkConfigs.c2cUrl = process.env.C2CURL || 'https://otc.eunex.group/'
env.networkConfigs.GRCURL = process.env.GRCURL || 'https://build.eunex.group/events/grc-token-mining'//GRC活动页

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
//注意拼接downloadUrl的时候最后一定要加"/"
if(env.networkConfigs.baseUrl.indexOf('android.eunex.group') > -1){
    env.networkConfigs.downloadUrl = 'https://www.eunex.group/';
}
if(env.networkConfigs.baseUrl.indexOf('app.eunex.group') > -1){
    env.networkConfigs.downloadUrl = 'https://www.eunex.group/';
}
//跳转到app下载页面所需地址
// env.networkConfigs.testUrl =   //测试环境


env.socketConfigs = {}


// socket请求地址

env.socketConfigs.url = process.env.SOCKET || 'wss://appwss.eunex.group/v1/market/notification' //node生产地址2
// env.socketConfigs.url = process.env.SOCKET || 'wss://wss.highdefi.com/v1/market/notification' //test地址

env.socketConfigs.options = {}
env.socketConfigs.options.path = '/v1/market/notification'  //请求路径
env.socketConfigs.options.transports = ['websocket'] //请求
env.socketConfigs.options.reconnection = true //是否自动重新连接
env.socketConfigs.options.reconnectionAttempts = 100 //重新连接尝试次数
env.socketConfigs.options.reconnectionDelayMax = 3000 //重新连接之间最长等待时间
env.socketConfigs.options.timeout = 20000 //connect_error和connect_timeout事件发出之前的等待时间
env.socketConfigs.options.autoConnect = true //自动连接
env.socketConfigs.options.query = {} //携带的query

export default env


