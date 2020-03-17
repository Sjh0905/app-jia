import Toast from "react-native-root-toast";
import CryptoJS from '../staticJs/sha1.min'
import Big from 'big.js'
import ENV from "../environmentConfigs/env";
import RNFS from "react-native-fs";

const globalFunc = {}


globalFunc.testFunc = function () {
    console.warn("hahaha")
}


globalFunc.CryptoJS = CryptoJS


// 检测邮箱
globalFunc.testEmail = function (src) {
    if(!src)return
    var src = src.trim();
    return /^[_a-zA-Z0-9-\+]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/.test(src)
    // return /^[_a-zA-Z0-9-\\+]+(\.[_a-zA-Z0-9-]+)*@[\.0-9A-z]+((.com)|(.net)|(.com.cn)|(.cn)|(.COM)|(.NET)|(.COM.CN)|(.CN))+$/.test(src)
}

// 检测密码，8到16位字母+数字
globalFunc.testPsw = function (psw) {
    return /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(psw)
}

// 拼接字符串
globalFunc.getUrl = (...params) => {
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

    if (url[url.length - 1] == '/')
        url = url.substring(0, url.length - 1)

    return url
}

// 判断身份证号
globalFunc.testIdCode = function (src) {
    if (/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(src)) {
        return true
    }
    return false
}

//校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串
globalFunc.testId = function (id) {
    if (/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/.test(id)) return true
    return false
}

// 判断手机号或者邮箱
globalFunc.emailOrMobile = function (src) {
    if (/^((1[3-8][0-9])+\d{8})$/.test(src)) {
        return 1
    }
    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(src)) {
        return 2
    }
    return 0
}

// 判断手机号
globalFunc.testMobile = function (mobile) {
    // return /^\d{11}$/.test(mobile);

    console.log("testMobile",mobile);
    if(/[_a-zA-Z\@\.\u4E00-\u9FFF]/.test(mobile))return false//如果有特殊字符，非法

    // if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile)) return true
    // return false
	return true
}

// globalFunc.testMobileByCount = function(mobile){
//     return /^\d{11}$/.test(mobile);
// }

// 判断推荐人 0到8位数字
globalFunc.testReferee = function (referee) {
    return /^\d{0,8}$/.test(referee)
}

// 判断是否全是数字
globalFunc.testNumber = function (number) {
    return /^[0-9]*$/.test(number)
}

// 姓名只显示姓
globalFunc.changeName =  (name) =>{
    if (!name) return '';
    return name.substr(0, 1) + new Array(name.length).join('*');
}

// 电话只显示前三位
globalFunc.changePhone = (phone) =>{
    if (!phone) return;
    let number = phone.slice(0,3)
    return `${number} **** ****`
}

// 银行卡显示后四位
globalFunc.changeBankCard = (card) =>{
    if(!card)return
    let number = card.slice(15)
    return `**** **** **** *** ${number}`
}

// 不允许特殊字符
globalFunc.testSpecial = function (src) {
    return /["'<>%;)(&=＜＞％；）（＆＇＂＝]/.test(src)
}


// 检测ACT地址
globalFunc.testACTAddress = function (src) {
    return /^ACT([0-9a-zA-Z]{32,33})|([0-9a-zA-Z]{64,65})$/.test(src)
}

// 检测BTC地址
globalFunc.testBTCAddress = function (src) {
    return /^[13][0-9a-zA-Z]{30,36}$/.test(src)
}

// 检测ETH地址
globalFunc.testETHAddress = function (src) {
    return /^0x[0-9A-Fa-f]{40}$/.test(src)
}

// 检测OMNI地址
globalFunc.testOMNIAddress = function (src) {
    return /^[13][0-9a-zA-Z]{30,36}$/.test(src)
}

// 检测EOS地址
globalFunc.testEOSAddress = function (src) {
    return /^(?=^[1-5.a-z]{1,12}$)(([1-5a-z]{1,}[.]{1}[1-5a-z]{1,})|([1-5a-z]{1,12}))$/.test(src)

}

// 检测WCG地址
globalFunc.testWCGAddress = function (src) {
    return /^WCG-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{5}$/.test(src)
}

//格式化时间年-月-日  时：分：秒
globalFunc.formatDateUitl = function (time, formatString = 'YYYY-MM-DD hh:mm:ss', offset = 8) {

    let pad0 = function (num, n) {
        let len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }

    // time += (3600000 * offset)

    let myDate = new Date(time);

    formatString = formatString.replace('yy', myDate.getYear())
    console.log()
    formatString = formatString.replace('YYYY', myDate.getFullYear())
    formatString = formatString.replace('MM', pad0(myDate.getMonth() + 1, 2))
    formatString = formatString.replace('DD', pad0(myDate.getDate(), 2))
    formatString = formatString.replace('hh', pad0(myDate.getHours(), 2))
    formatString = formatString.replace('mm', pad0(myDate.getMinutes(), 2))
    formatString = formatString.replace('ss', pad0(myDate.getSeconds(), 2))

    return formatString;
}
//倒计时,new Date("2019/03/10 00:00:00").getTime()可以将指定时间转化为时间戳
globalFunc.timeCountdown = function (nowTime = 0,beginTime = 0) {
    let stepTime = beginTime - nowTime;
    if(stepTime <= 0)return 0;

    let stepDay = Math.floor(stepTime/86400000);
    stepTime -= stepDay * 86400000;
    let stepHour = Math.floor(stepTime/3600000);
    stepTime -= stepHour * 3600000;
    let stepMinute = Math.floor(stepTime/60000);
    stepTime -= stepMinute * 60000;
    let stepSecond = Math.floor(stepTime/1000);

    // console.log('stepDay  stepHour  stepMinute  stepSecond ',stepDay,stepHour,  stepMinute , stepSecond);
    stepHour < 10 && (stepHour = "0" + stepHour);
    stepMinute < 10 && (stepMinute = "0" + stepMinute);

    stepSecond < 10 && (stepSecond = "0" + stepSecond);


    if(stepDay > 0){
        return stepDay + "天" + stepHour + "时" + stepMinute + "分" + stepSecond + "秒"
    }
    if(stepHour > 0){
        return stepHour + "时" + stepMinute + "分" + stepSecond + "秒"
    }
    if(stepMinute > 0){
        return stepMinute + "分" + stepSecond + "秒"
    }
    if(stepSecond > 0){
        return stepSecond + "秒"
    }
}

//处理买卖盘精度
globalFunc.formatDealAmount = function(symbol,amount,baseScale = 2){
    if(symbol == 'GRC_USDT' && amount >= 1000){
        return globalFunc.accFixed(globalFunc.accDiv(amount,1000),2) + 'k'
    }
    return globalFunc.accFixed(amount,baseScale || 2)
}

// 合并对象，保留original里的值
globalFunc.mergeObj = function (originalObj, targetObj) {
    if (!targetObj) {
        return originalObj
    }
    return Object.assign(targetObj, originalObj)
}


// 精度处理不保留四舍五入，只舍弃，不进位
globalFunc.accFixed = function (num, acc = 8) {
    // console.warn('isNaN(num)',isNaN(num))
    if (isNaN(num)) return (0).toFixed(acc)
    let number = Number(globalFunc.accDiv(Math.floor(globalFunc.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
    return number.toFixed(acc);
}

// 精度处理不保留四舍五入，只进位，不舍弃
globalFunc.accFixed2 = function (num, acc = 8) {
    // console.warn('isNaN(num)',isNaN(num))
    if (isNaN(num)) return (0).toFixed(acc)
    let number = Number(globalFunc.accDiv(Math.ceil(globalFunc.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
    return number.toFixed(acc);
}

// 资产页使用，新的Math Floor方法
globalFunc.newFixed = function (num, acc) {
    if (isNaN(num)) return 0
    // 检测科学计数法
    let reg = /^[\-]?(\d+)?[\.]?(\d+)?(e)([\-]?\d+)$/
    let numString = new Big(num).toString()

    // 如果是科学计数法，用原方法
    if (reg.test(numString)) {
        let number = Number(globalFunc.accDiv(Math.floor(globalFunc.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
        return number.toFixed(acc);
    }

    // 如果不是科学计数法
    let numArr = numString.split('.')

    if (acc <= 0) {
        return numArr[0]
    }

    return ( numArr = numString.split('.') ) && ( numArr[1] = ( numArr[1] || '' ).substring(0,acc).padEnd(acc,'0') ) + 1 && numArr.join('.');
}

//对输入的数值校验，转化为指定小数位的数字
globalFunc.inputTransToNumbers = (val,num = 2)=>{
    let value = val.replace(/[^0-9.]/g, '').replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    if(value.toString().split(".")[1]){
        if(value.toString().split(".")[1].length < num+1){
            return value
        } else {
            return this.toFixed(value,num)
        }
    }
    else{
        return value
    }
}

/**
 * 精度加法运算
 * 使用big.js
 */
globalFunc.accAdd = function (arg1, arg2) {
    let num1 = new Big(arg1)
    let num2 = new Big(arg2)
    return num1.plus(num2).toString()
}

/**
 * 精度减法运算
 * 使用big.js
 */
globalFunc.accMinus = function (arg1, arg2) {
    let num1 = new Big(arg1)
    let num2 = new Big(arg2)
    return num1.minus(num2).toString()
}

/**
 * 精度除法运算
 * 使用big.js
 */
globalFunc.accDiv = function (arg1, arg2) {
    let num1 = new Big(arg1)
    let num2 = new Big(arg2)
    return num1.div(num2).toString()
}

/**
 * 精度乘法运算
 * 使用big.js
 */
globalFunc.accMul = function (arg1, arg2) {
    let num1 = new Big(arg1)
    let num2 = new Big(arg2)
    return num1.mul(num2).toString()
}

/**
 * toast
 * @param msg
 * @param position
 * @param duration
 */
globalFunc.toast = function (msg, {position = Toast.positions.CENTER, duration = Toast.durations.SHORT} = {
    position: Toast.positions.CENTER, duration: Toast.durations.SHORT
}) {
    Toast.show(msg, {
        duration: duration,
        position: position,
    })
}

/**
 * 超时的提示
 */
globalFunc.timeoutHandler = function () {
    globalFunc.toast('请求超时')
}

/**
 * 转换极验调用的接口
 */
globalFunc.getGeetestApi = function (url) {
    let baseUrl = ENV.networkConfigs.baseUrl

    ENV.networkConfigs.port && (baseUrl = baseUrl + ':' + ENV.networkConfigs.port + '/')
    return globalFunc.getUrl(baseUrl, url)
}

/**
 * 删除登录临时存的cookie,安卓专用
 */
globalFunc.deleteHeaderCookie = function () {
    delete ENV.networkConfigs.headers.cookie
}

globalFunc.downloadImage = async function(uri,callback) {
    console.log(RNFS);
    const formUrl = uri;
    const extendName = uri.split('.').pop();
    const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera/${((Math.random() * 1000) | 0)}.${extendName}`;
    // http://wvoice.spriteapp.cn/voice/2015/0902/55e6fc6e4f7b9.mp3
    const options = {
        fromUrl: formUrl,
        toFile: downloadDest,
        background: false,
        begin: (res) => {
            console.log('begin', res);
            console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
        },
        progress: (res) => {
            let pro = res.bytesWritten / res.contentLength;
            console.log('pro',pro);
        }
    };
        const ret = RNFS.downloadFile(options);
        console.log(ret);
        ret.promise.then((result)=>{
            callback('file://' + downloadDest,result);
        }).catch((ex)=>{
            callback('',ex);
        })
}

globalFunc.testC2COrder = function (order) {
    return /^\d{16}$/.test(order);
}

globalFunc.deleteFile = (uri)=>{
    return RNFS.unlink(uri)
        .then(() => {
            console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            console.log(err.message);
        });
}
// 数组新增且去重
globalFunc.addArray = function (item, arr) {
    if (!Array.isArray(arr)) return []
    arr.push(item)
    return [...new Set(arr)]
}

// 数组删除且去重
globalFunc.removeArray = function (item, arr) {
    if (!Array.isArray(arr)) return []
    let newSet = new Set(arr)
    newSet.delete(item)
    return [...newSet]
}

export default globalFunc


