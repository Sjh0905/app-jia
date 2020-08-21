if (!window.location) {
    // App is running in simulator
    window.navigator.userAgent = 'ReactNative';
}

//安卓专用
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function (targetLength, padString) {
        // 转数值或者非数值转换成0
        targetLength = targetLength >> 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength || padString === '') {
            return String(this);
        }
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
            // 添加到初始值以确保长度足够
            padString += padString.repeat(targetLength / padString.length);
        }
        return String(this) + padString.slice(0, targetLength);
    };
}

import ReactNativeComponent from './configs/classConfigs/ReactNativeComponent'


import GlobalFuncClass from './configs/globalFunctionConfigs/GlobalFunctionClass'
import GlobalFunc from './configs/globalFunctionConfigs/GlobalFunction'
import RouterClass from './configs/navigationConfigs/RouterClass'
import StoreClass from './configs/storeConfigs/StoreClass'
import StoreConfigs from './configs/storeConfigs/StoreConfigs'
import EventBusClass from './configs/eventBus/EventBus'
import NetworkClass from './configs/networkConfigs/NetworkClass'
import RequestAddress from './configs/networkConfigs/RequestAddress'
import EnvConfigs from './configs/environmentConfigs/env'

import SocketClass from './configs/socketConfigs/SocketClass'

import LanguageClass from './configs/languageConfigs/LanguageClass'
import EN from './configs/languageConfigs/EN'
import CH from './configs/languageConfigs/CH'
import {Dimensions, PixelRatio,Platform} from "react-native"
import {Buffer} from 'buffer'
import device from '../src/configs/device/device'
import ExtraDimensions from 'react-native-extra-dimensions-android';



ReactNativeComponent.setGlobalFunction(GlobalFuncClass, GlobalFunc)


ReactNativeComponent.setRouter(RouterClass)


ReactNativeComponent.setStore(StoreClass, StoreConfigs)


ReactNativeComponent.setEventBus(EventBusClass)


ReactNativeComponent.setNetwork(NetworkClass, EnvConfigs.networkConfigs, RequestAddress)


ReactNativeComponent.setSocket(SocketClass, EnvConfigs.socketConfigs)


ReactNativeComponent.setI18n(LanguageClass, 'CH', {EN, CH})
const iPhone11Array = ['iPhone12,1','iPhone12,3','iPhone12,5']
global.isIPhoneX = function(){
    let result = false;
    if(device.DeviceModel === 'iPhone X'){
        result = true;
    }
    if(device.DeviceModel === 'iPhone XS'){
        result = true;
    }
    if(device.DeviceModel === 'iPhone XR'){
        result = true;
    }
    if(device.DeviceModel === 'iPhone XS Max'){
        result = true;
    }
    if(iPhone11Array.indexOf(device.getDeviceId) >-1 ){
        result = true;
    }
    return result;
}
global.getDeviceTop = function(isOrigin){
    let result = 0;
    if(device.DeviceModel === 'iPhone X'){
        result = 44;
    }
    if(device.DeviceModel === 'iPhone XS'){
        result = 44;
    }
    if(device.DeviceModel === 'iPhone XR'){
        result = 44;
    }
    if(device.DeviceModel === 'iPhone XS Max'){
        result = 44;
    }
    if(iPhone11Array.indexOf(device.getDeviceId) >-1){
        result = 44;
    }
    if(isOrigin){
        return result;
    }
    return getHeight(result);
}
global.getDeviceBottom = function(isOrigin){
    let result = 0;
    if(device.DeviceModel === 'iPhone X'){
        result = 34;
    }
    if(device.DeviceModel === 'iPhone XS'){
        result = 34;
    }
    if(device.DeviceModel === 'iPhone XR'){
        result = 34;
    }
    if(device.DeviceModel === 'iPhone XS Max'){
        result = 34;
    }
    // alert(iPhone11Array.indexOf(device.getDeviceId) +'getDeviceBottom='+JSON.stringify(device));
    if(iPhone11Array.indexOf(device.getDeviceId) >-1){
        // alert('进入判断逻辑===='+iPhone11Array.indexOf(device.getDeviceId) +'getDeviceBottom='+JSON.stringify(device)+'getDeviceBottom='+JSON.stringify(device));
        result = 34;
    }
    if(isOrigin){
        return result;
    }
    return getHeight(result);
}

if (Platform.OS === "ios") {

    //平台类型
    global.PlatformOS = "ios"
    global.PlatformiOSPlus = device.DeviceModel && device.DeviceModel.lastIndexOf('Plus')>-1 || false

    // 设置宽高
    global.DefaultWidth = 750
    global.DefaultHeight = 1334
    global.DeviceHeight = Dimensions.get("window").height-getDeviceTop(true)
    global.DeviceHeight2 = Dimensions.get("window").height-getDeviceTop(true)
    global.DeviceWidth = Dimensions.get("window").width
    global.RealWindowHeight = Dimensions.get("window").height

    // alert(DeviceHeight + device.DeviceModel + DeviceWidth)

    // if(device.DeviceModel === 'iPhone X'){
    //     global.DeviceHeight = Dimensions.get("window").height-44
    // }

    console.warn('this is deviceHeight=======', global.DeviceHeight, global.DeviceWidth)
    // global.getHeight = (px) => PixelRatio.getPixelSizeForLayoutSize((global.DeviceHeight / global.DefaultHeight) * px)
    global.getHeight = (px) => (global.DeviceHeight / global.DefaultHeight) * px
    global.getDealHeight = (px) => (global.DeviceHeight / global.DefaultHeight) * px
    global.imgHeight = (px) => PixelRatio.getPixelSizeForLayoutSize(px)
// global.getWidth = (px) => PixelRatio.getPixelSizeForLayoutSize((global.DeviceWidth / global.DefaultWidth) * px)
    global.getWidth = (px) => (global.DeviceWidth / global.DefaultWidth) * px
    global.imgWidth = (px) => PixelRatio.getPixelSizeForLayoutSize(px)
}
if (Platform.OS === "android") {
    //平台类型
    global.PlatformOS = "android"

    // alert('生产商：'+device.Manufacturer);
    // global.DeviceHeight = ExtraDimensions.get("REAL_WINDOW_HEIGHT") -ExtraDimensions.get("STATUS_BAR_HEIGHT")-ExtraDimensions.get("SMART_BAR_HEIGHT")-ExtraDimensions.get("SOFT_MENU_BAR_HEIGHT")
    // global.DeviceHeight = ExtraDimensions.get("REAL_WINDOW_HEIGHT") -ExtraDimensions.get("SMART_BAR_HEIGHT")-ExtraDimensions.get("SOFT_MENU_BAR_HEIGHT")//针对华为手机，如果多减一个STATUS_BAR_HEIGHT样式更乱

    let deviceHeight = ExtraDimensions.get("REAL_WINDOW_HEIGHT");
    let deviceWidth = ExtraDimensions.get("REAL_WINDOW_WIDTH");
    let smartBarHeight = ExtraDimensions.get("SMART_BAR_HEIGHT");
    let statusBarHeight = ExtraDimensions.get("STATUS_BAR_HEIGHT");
    let softMenuBar = ExtraDimensions.get("SOFT_MENU_BAR_HEIGHT");


    // alert(deviceWidth + device.DeviceModel + deviceHeight)

    global.DefaultWidth = 720
    global.DefaultHeight = 1440
    global.RealWindowHeight = deviceHeight
    global.DeviceHeight = deviceHeight - smartBarHeight - softMenuBar//针对华为手机，如果多减一个STATUS_BAR_HEIGHT样式更乱
    global.DeviceHeight2 = deviceHeight - smartBarHeight - softMenuBar - statusBarHeight//针对华为手机，如果多减一个STATUS_BAR_HEIGHT样式更乱
    global.DeviceWidth = deviceWidth
    global.DeviceDealHeight = global.DeviceHeight

    global.RateDeviceHeight = global.DeviceHeight / 1440
    global.RateDealDeviceHeight = global.DeviceDealHeight / 1440
    global.RateDeviceWidth = global.DeviceWidth / 720


    if((deviceHeight == 640 && deviceWidth == 360) || (deviceHeight == 720 && deviceWidth == 360)){
        deviceHeight === 640 && (global.DeviceDealHeight = 567)//567在手势密码处用到了，改的时候注意下
        global.RateDeviceHeight = global.DeviceHeight / (deviceHeight * 2)
        global.RateDealDeviceHeight = global.DeviceDealHeight / (deviceHeight * 2)
        global.RateDeviceWidth = global.DeviceWidth / (deviceWidth * 2)

    }
    if(deviceHeight > 720 && deviceWidth > 360){
        global.RateDeviceHeight = global.DeviceHeight / 1440
        global.RateDealDeviceHeight = global.DeviceDealHeight / 1440
        global.RateDeviceWidth = global.DeviceWidth / 720
    }

    // alert(global.DeviceHeight+' '+global.DeviceWidth+' '+ExtraDimensions.get("SOFT_MENU_BAR_HEIGHT"));
    // alert(ExtraDimensions.get("REAL_WINDOW_HEIGHT")+''+ExtraDimensions.get("REAL_WINDOW_WIDTH")+''+ExtraDimensions.get("SMART_BAR_HEIGHT"));
    // global.getHeight = (px) => PixelRatio.getPixelSizeForLayoutSize((global.DeviceHeight / global.DefaultHeight) * px)
    global.getHeight = (px) => global.RateDeviceHeight * px
    global.getDealHeight = (px) => global.RateDeviceHeight * px
    // global.getDealHeight = (px) => global.RateDealDeviceHeight * px
    global.imgHeight = (px) => PixelRatio.getPixelSizeForLayoutSize(px)
    // global.getWidth = (px) => PixelRatio.getPixelSizeForLayoutSize((global.DeviceWidth / global.DefaultWidth) * px)
    global.getWidth = (px) => global.RateDeviceWidth * px
    global.imgWidth = (px) => PixelRatio.getPixelSizeForLayoutSize(px)
}



global.Buffer = Buffer


if (!__DEV__) {
    if(global.console){
        console.info = ()=>{}
        console.log = ()=>{}
        console.warn = ()=>{}
        console.debug = ()=>{}
        console.error = ()=>{}
        console.trace = ()=>{}
    }
}

console.warn('this is height and width', global.DeviceHeight, global.DeviceWidth)


// 关闭计时太长的警告信息
console.ignoredYellowBox = ['Setting a timer']

global.__VERSION__ = {
    ios: 16,
    android: 15
}

// 全局控制是否显示引导页
// 如果需要改引导页内容 则在approach.js中修改
global.showApproach = false;




