/**
 * Created by hjx on 2018/4/4.
 */

import fetch from 'cross-fetch'
import Alert from 'react-native'
import AndroidModule from '../../../native/AndroidUtil'

function getUrl(...params) {
    // console.log('requestpppppp',params)
    if(params.length > 0 && (params[1].indexOf('http://') > -1 || params[1].indexOf('https://') > -1)){
        params.shift();
    }
    let url = ""
    let tempUrl = ""
    let tempArr = []
    for (let i = 0; i < params.length; i++) {
        tempUrl += params[i].toString() + '/'
    }
    tempArr = tempUrl.split("/")
    for (let j = 0; j < tempArr.length; j++) {
        if (tempArr[j] === "") {
            continue
        }
        if (tempArr[j] === "http:" || tempArr[j] === "https:") {
            url += tempArr[j] + "//"
            continue
        }
        url += tempArr[j] + "/"
    }

    url = url.replace(/\/$/,'');
    // console.log('************url*************',url);
    return url
}


export default class NetworkClass {


    baseUrl = ''
    port = 80
    timeout = 15000
    headers = {}
    /**
     * credentials (String) - Authentication credentials mode. Default: "omit"
     "omit" - don't include authentication credentials (e.g. cookies) in the request
     "same-origin" - include credentials in requests to the same site
     "include" - include credentials in requests to all sites
     */
    credentials = 'same-origin'

    formData = undefined;

    urlConfigs = {}


    constructor(configs, urlConfigs) {
        console.log(configs);
        this.baseUrl = configs.baseUrl || 'www.eunex.com'
        this.port = configs.port || ''
        this.credentials = configs.credentials || 'same-origin'
        this.timeout = configs.timeout || 15000
        this.headers = configs.headers || {}
        this.urlConfigs = urlConfigs || {}
    }


    /**
     * 网络请求方法，使用Fetch，支持await
     * @param key
     * @param bind
     * @param params
     * @param callBack
     * @param errorHandler
     * @param urlFragment
     * @param query
     * @returns {Promise<void>}
     */
    send = async (key, {bind, params, callBack, errorHandler, urlFragment, query, timeoutHandler, baseUrl, timeout, method, credentials, formData}) => {

        // 没有key
        if (typeof (key) !== 'string') {
            console.log("you must input a key!")
            return false
        }

        let configure


        configure = this.urlConfigs[key]


        // 没有配置
        if (typeof (configure) === 'undefined') {
            console.log("network hasn't configure!", key)
            return false
        }


        let options = {}, url = configure.url


        // 获取配置 引用类型 会导致header 相互重复修改
        options.headers = {};
        if(this.headers){
            options.headers = JSON.parse(JSON.stringify(this.headers));
        }

        options.credentials = credentials || configure.credentials || this.credentials || 'same-origin'
        options.method = method || configure.method || 'get'
        options.method !== 'get' && options.method !== 'GET' && (options.body = JSON.stringify(params) || '{}')
        //form提交文件用
        formData !== undefined && (options.body = formData);
        formData !== undefined && (options.headers['Content-Type'] = 'multipart/form-data;charset=utf-8');


        let sendBaseUrl = baseUrl || configure.baseUrl || this.baseUrl || ''
        let sendUrlFragment = urlFragment || configure.urlFragment || ''

        let sendTimeout = timeout || configure.timeout || this.timeout || 15000

        this.port && (sendBaseUrl += ':' + this.port + '/')

        let sendUrl = getUrl(sendBaseUrl, url, sendUrlFragment)

        // 如果有query，拼接一下
        if (query) {
            let queryArr = []
            for (let keys in query) {
                queryArr.push(keys.toString() + '=' + query[keys].toString())
            }
            sendUrl += '?' + queryArr.join('&')
        }

        // 超时
        let timeOver = false

        // console.warn("测试发送数据", sendUrl, options, params)
        // console.log('fetchccccc',sendUrl,options)
        // 设置超时
        let sendFetch = Promise.race([fetch(sendUrl, options), new Promise(function (resolve, reject) {
            setTimeout(() => {
                timeOver = true
                reject(new Error('time out'))
                console.log('timeout',sendUrl,options)
            }, 60000)
        })])


        await sendFetch
            .then((res) => {
                PlatformOS == 'android' && AndroidModule.cookieFlush();
                // 如果超时了
                if (timeOver) {
                    return
                }

                // console.log("===http responsed!", key, res.status, res)

                if (res.status === 300 || res.status === 301 || res.status === 302 || res.status === 303 || res.status === 304 || res.status === 305 || res.status === 306 || res.status === 307) {
                    throw(res.text());
                    //throw new Error(res)
                }

                if (res.status === 404 || res.status === 401 || res.status === 400 || res.status === 402 || res.status === 403 || res.status === 405 || res.status === 406 || res.status === 407) {
                    throw(res.text());
                    //throw new Error(res)
                }

                if (res.status === 500 || res.status === 501 || res.status === 502 || res.status === 503 || res.status === 504 || res.status === 505 || res.status === 506 || res.status === 507) {
                    throw(res.text());
                    //throw new Error(res)
                }

                try{
                    return res.text()
                }catch(ex){
                    console.log('response is error');
                }
            })
            .then((data) => {
                // console.log("===here is data", key, data)

                try {
                    data = JSON.parse(data)
                } catch (e) {
                    console.log("The data may not be JSON type")
                }

                try{
                    bind && callBack && callBack.bind(bind)(data)
                    !bind && callBack && callBack(data)
                }catch(ex){
                    console.log('Callback is error', ex);
                }
            })
            .catch((arg) => {
                PlatformOS == 'android' && AndroidModule.cookieFlush();
                console.log('The response has some problem', arg)
                if(arg.message === 'time out'){
                    bind && timeoutHandler && timeoutHandler.bind(bind)(arg)
                    !bind && timeoutHandler && timeoutHandler(arg)
                    return;
                }

                if(arg instanceof Promise){
                    arg.then(function(errorData){
                        try{
                            errorData = JSON.parse(errorData);
                        }catch(ex){
                            console.log("The errormessage may not be JSON type")
                        }

                        try {
                            console.log('errorData==============', errorData);
                            bind && errorHandler && errorHandler.bind(bind)(errorData)
                            !bind && errorHandler && errorHandler(errorData)
                        } catch (e) {
                            console.log('errorHandlerError');
                        }
                    })
                }else{
                    try {
                        console.log('errorData==============', arg);
                        bind && errorHandler && errorHandler.bind(bind)(arg)
                        !bind && errorHandler && errorHandler(arg)
                    } catch (e) {
                        console.log('errorHandlerError');
                    }
                    return false;
                }

            })
    }


}