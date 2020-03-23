/**
 * Created by zhangzuohua on 2018/4/14.
 */


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NativeModules, requireNativeComponent} from 'react-native';
import ENV from '../../configs/environmentConfigs/env'
import GlobalFunc from '../../configs/globalFunctionConfigs/GlobalFunction'
import Toast from "react-native-root-toast";
//俩个参数 第一个manager名字 第二个view名字
const JiYanView = requireNativeComponent('JiYanView')//,JiYanView);

// "http://ui.xxx.org/user/getGeetest"//http://www.geetest.com/demo/gt/register-slide"
// "http://www.geetest.com/demo/gt/validate-slide"//"http://ui.xxx.org/user/getGeetest"//"
export default class JiYan extends Component {
    static propTypes = {
        API1: PropTypes.string.isRequired,
        API2: PropTypes.string.isRequired,
    };

    // onJiYanResult = (result) => this.props.onJiYanResult && this.props.onJiYanResult(result)


    startCaptcha = () => NativeModules.JiYanViewManager.startCaptcha()

    getApi = (url) => {
        let baseUrl = ENV.networkConfigs.baseUrl

        ENV.networkConfigs.port && (baseUrl = baseUrl + ':' + ENV.networkConfigs.port + '/')
        return GlobalFunc.getUrl(baseUrl, url)
    }


    // 开始
    static startJiYan = (key) => {
        JiYan._currentComponent = key
        try {
            NativeModules.JiYanViewManager.startCaptcha()
        } catch(err) {
            Toast.show('网络初始化失败，请检查网络设置', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
            })
        }
    }


    // 设置
    static setOptions = (key, onResult) => {
        JiYan._setResultMap(key, onResult)
    }

    // 删除
    static deleteOptions = (key) => {
        JiYan._jiYanResultMap.delete(key)
    }


    // 获取
    static _onJiYanResult = (result) => {

        // 此处需要修改 不能简单的try catch
        // 当验证失败 则 result.nativeEvent.result = 'fail'
        // 当验证成功 则 result.nativeEvent.result = JSON串

        // 未知错误
        let errMessage = '';
        if(result && result.nativeEvent && result.nativeEvent.result == 'fail'){
            // 有数的错误 可根据文档进行提示
            switch (result.nativeEvent.code.toString()){
                case '-10':
                    // errMessage = '验证被封禁';
                    errMessage = '极验禁止使用';
                    break;
                case '-20':
                    // errMessage = '尝试过多';
                    errMessage = '尝试次数过多';
                    break;
                case '-50':
                    // errMessage = '极验服务器异常gettype.php';
                    errMessage = '网络异常.';
                    break;
                case '-51':
                    // errMessage = '极验服务器异常get.php';
                    errMessage = '网络异常..';
                    break;
                case '-52':
                    // errMessage = '极验服务器异常ajax.php';
                    errMessage = '网络异常…';
                    break;
                case '-1001':
                    // errMessage = '请求超时';
                    errMessage = '网络缓慢 请稍候重试';
                    break;
                case '-1003':
                    // errMessage = '无法连接到主机 （wxj备注 一般是网不好 或者没网）';
                    errMessage = '网络不畅 请检查网络';
                    break;
                case '-1004':
                    // errMessage = '无法连接到服务器';
                    errMessage = '网络不畅';
                    break;
                case '-1005':
                    // errMessage = '网络丢失 （wxj备注 一般是突然断网）';
                    errMessage = '网络异常 请检查网络';
                    break;
                case '-1006':
                    // errMessage = 'DNS查询失败';
                    errMessage = '网络异常 请稍候重试';
                    break;
                case '-1009':
                    // errMessage = '未连接到互联网 （wxj备注 没开网）';
                    errMessage = '未连接互联网';
                    break;
                case '-1011':
                    // errMessage = '服务器无响应';
                    errMessage = '网络无响应 请重试';
                    break;
                case '-1015':
                    // errMessage = 'NSURLErrorCannotDecodeRawData无法解析的原始数据';
                    errMessage = '验证不通过';
                    break;
                case '-1016':
                    // errMessage = 'NSURLErrorCannotDecodeContentData解析返回内容错误';
                    errMessage = '验证不通过 稍后重试';
                    break;
                case '-1017':
                    // errMessage = 'NSURLErrorCannotParseResponse无法解析响应体';
                    errMessage = '验证不通过 请稍候重试';
                    break;
                default:
                    errMessage = '网络异常 错误码：' + result.nativeEvent.code.toString();
            }
        }
        if(result && result.nativeEvent && result.nativeEvent.result != 'fail'){
            try{
                let func = JiYan._getResultMap(JiYan._currentComponent)
                func && func(result.nativeEvent)
                errMessage = '';
            }catch(ex){

            }
        }

        if(errMessage){
            Toast.show(errMessage, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
            })
        }
    }


    // 设置
    static _setResultMap = (key, func) => {
        JiYan._jiYanResultMap.set(key, func)
    }

    // 获取
    static _getResultMap = (key) => {
        return JiYan._jiYanResultMap.get(key)
    }

    // 回调函数集合
    static _jiYanResultMap = new Map()

    // 当前回调
    static _currentComponent = null


    render() {
        let API1 = this.getApi(this.props.API1)
        let API2 = this.getApi(this.props.API2)

        // console.warn('this is API1', API1)
        // console.warn('this is API1', API2)

        return (
            <JiYanView style={{width: 375, height: 100, marginTop: 60, marginLeft: 40}}
                       API1={API1}
                       API2={API2}
                       onJiYanResult={JiYan._onJiYanResult}/>
        );
    }
}

