/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Text, TextInput, View,AsyncStorage} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import styles from '../style/SignVerificationItemStyle'
import baseStyles from '../style/BaseStyle'
import BaseButton from './baseComponent/BaseButton'
import propTypes from 'prop-types'
import signBaseStyles from '../style/SignBaseStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'

import gaIcon from '../assets/SignVerification/google-icon.png'
import mobileIcon from '../assets/SignVerification/phone-icon.png'

import Loading from './baseComponent/Loading'
import CountDown from './baseComponent/BaseCountDown'
import {getCookieForC2C} from "../c2cProject/C2CPublicAPI";
import Env from "../configs/environmentConfigs/env";
import Toast from "react-native-root-toast";

const typeArr = ['ga', 'mobile']

@observer
export default class App extends RNComponent {

    /*----------------------- props -------------------------*/
    static propTypes = {
        // 类型，ga或mobile
        type: propTypes.string.isRequired,
    }

    static defaultProps = {
        // ga或mobile
        type: typeArr[0],
    }


    /*----------------------- data -------------------------*/

    @observable
    templateData = 0

    @observable
    userName = ''

    @observable
    GACode = ''
    @observable
    GACodeWA = ''

    @observable
    verificationCode = ''

    @observable
    verificationCodeWA = ''


    @observable
    sending = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        //TODO: 这里可能会有问题
        this.userName = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.userName

        this.$route.routes[this.$route.routes.length - 1].params
            &&
            (this.backTo = this.$route.routes[this.$route.routes.length - 1].params.backTo)
            &&
            (typeof(this.$route.routes[this.$route.routes.length - 1].params.closeCallback) == 'function')
            &&
            (this.closeCallback = this.$route.routes[this.$route.routes.length - 1].params.closeCallback)

    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    doGetCookieForC2C =async()=>{
        // await getCookieForC2C(this.$http,this.$store,Env);
    }


    @action
    templateFunc = () => {

    }

    @action
    commitGa = () => {

    }


    // 渲染谷歌验证
    renderGa = () => {

        return (
            <View style={[ signBaseStyles.inputContainer, signBaseStyles.inputContainerPaddingTop,styles.inputBox]}>
                <View style={[styles.inputItemBox, signBaseStyles.inputItemBox]}>
                    {/*图标 begin*/}
                    {/*<View style={[signBaseStyles.iconBox]}>*/}
                        {/*<Image source={gaIcon}*/}
                               {/*style={[signBaseStyles.icon]}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    {/*图标 end*/}
                    {/*输入框 begin*/}
                    <TextInput
                        allowFontScaling={false}
                        style={[signBaseStyles.input]}
                        placeholder={'请输入谷歌验证码'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        underlineColorAndroid={'transparent'}
                        value={this.GACode}
                        onChangeText={(text) => {
                            this.GACode = text

                            this.$globalFunc.testVerificationCode(text,this.commit)
                        }}
                        returnKeyType={'done'}
                        keyboardType={'numeric'}
                    />
                    {/*输入框 end*/}
                </View>


                {/*错误提示*/}
                {
                    this.GACodeWA != '' && (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={signBaseStyles.wrongAns}>{this.GACodeWA}</Text>
                        </View>
                    )
                }


                {/*按钮 begin*/}
                <BaseButton
                    text={'确  认'}
                    textStyle={[signBaseStyles.buttonText]}
                    onPress={this.commit}
                    style={[baseStyles.btnBlue, styles.inputButton, signBaseStyles.button]}
                />
                {/*按钮 end*/}
            </View>
        )

    }


// 点击获取验证码
    @action
    click_getVerificationCode = () => {
        // 发送
        let params = {
            "type": "mobile", "mun": this.userName, "purpose": "login"
        }

        this.$http.send('POST_VERIFICATION_CODE', {
            bind: this,
            params: params,
            timeout:3000,
            callBack: this.re_getVerificationCode,
            errorHandler: this.error_getVerificationCode,
            timeoutHandler:this.timeoutHandler
        })
    }

    // 验证码回复
    @action
    re_getVerificationCode = (data) => {
        if (typeof data === 'string') data = JSON.parse(data)
        console.log('发送手机验证码回复', data)
        if (data.errorCode) {
            data.errorCode === 1 && (this.verificationCodeWA = '此用户未绑定手机')
            data.errorCode === 2 && (this.verificationCodeWA = '过于频繁')
            data.errorCode === 4 && (this.verificationCodeWA = '登录验证未通过')
            data.errorCode === 8 && (this.verificationCodeWA = '登录验证未通过!')
            data.errorCode === 16 && (this.verificationCodeWA = '登录验证未通过.')
        }
    }

    // 验证码回复出错
    @action
    error_getVerificationCode = (err) => {
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
        console.warn("获取验证码出错！", err)
    }


    // 测试手机短信
    @action
    testVerificationCode = () => {
        if (this.verificationCode === '') {
            this.verificationCodeWA = ''
            return false
        }
        this.verificationCodeWA = ''
        return true
    }

    // 测试绑定谷歌验证码
    testGACode = () => {
        if (this.GACode === '') {
            this.GACodeWA = ''
            return false
        }
        this.GACodeWA = ''
        return true
    }


    // 发送手机验证
    @action
    commit = () => {
        if (this.sending) return

        let canSend = true

        if (this.props.type == typeArr[0]) {
            canSend = this.testGACode() && canSend
            if (this.GACode === '') {
                this.GACodeWA = '请输入谷歌验证码'
                canSend = false
            }
        }
        if (this.props.type == typeArr[1]) {
            canSend = this.testVerificationCode() && canSend
            if (this.verificationCode === '') {
                this.verificationCodeWA = '请输入手机验证码'
                canSend = false
            }
        }

        if (!canSend) {
            return
        }
        console.log('二次验证参数==',{
            type: this.props.type == typeArr[0] ? 'ga' : 'mobile',
            code: this.props.type == typeArr[0] ? this.GACode : this.verificationCode,
            purpose: 'login',
            examinee: this.userName,
            'source': 'APP'
        })


        this.$http.send('POST_COMMON_AUTH', {
            bind: this,
            params: {
                type: this.props.type == typeArr[0] ? 'ga' : 'mobile',
                code: this.props.type == typeArr[0] ? this.GACode : this.verificationCode,
                purpose: 'login',
                examinee: this.userName,
                'source': 'APP'
            },
            errorHandler: this.error_commit,
            callBack: this.re_commit,
            timeoutHandler:this.timeoutHandler

        })
        this.sending = true
    }

    // 超时
    timeoutHandler = ()=>{

        // this.$globalFunc.timeoutHandler

        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
        this.sending = false
    }



    // 回调发送手机验证
    @action
    re_commit = (data) => {
        console.log('here1')
        typeof data === 'string' && (data = JSON.parse(data))
        this.sending = false
        //接口返回后清空输入框
        this.GACode = ''
        this.verificationCode = ''

        if (data.errorCode || data.result === 'FAIL') {
            if (this.props.type == typeArr[0]) {
                data.errorCode == '3' && (this.GACodeWA = '暂不可用，请稍后再试')
                data.errorCode == '4' && (this.GACodeWA = '验证未通过')
            }

            if (this.props.type == typeArr[1]) {
                data.errorCode == '1' && (this.verificationCodeWA = '用户未绑定')
                data.errorCode == '2' && (this.verificationCodeWA = '验证码错误')
                data.errorCode == '3' && (this.verificationCodeWA = '验证码过期')
                data.errorCode == '4' && (this.verificationCodeWA = '登录验证未通过')
                data.errorCode == '8' && (this.verificationCodeWA = '登录验证未通过!')
                data.errorCode == '16' && (this.verificationCodeWA = '登录验证未通过.')
                data.errorCode == '100' && (this.verificationCodeWA = '暂不可用，请稍后再试')
            }
            return
        }
console.log('here2')
        // console.warn('userProfile', data)

        this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)
        //判断当前用户手势密码是否存在
        if(data && data.dataMap && data.dataMap.userProfile){
            let userId = data.dataMap.userProfile.userId + '';

            AsyncStorage.getItem(userId).then((data)=> {
                // data == null && this.$store.commit('SET_RECOMMEND_GESTURE',true);
                data && this.$store.commit('SET_GESTURE',true);
            })
        }

        this.doGetCookieForC2C();

        console.log('here3')
        this.$event.notify({key:'NEW_LOGIN'})

        console.log('here4')
        if(this.closeCallback){
            this.closeCallback();
        }
        console.log('here5')
        console.log('backTo-------',this.backTo)

        if(this.backTo){
            this.$router.goBackToRoute(this.backTo)
        }else{
            this.$router.popToTop()
        }

        this.$http.send('GET_AUTH_STATE', {
            bind: this,
            callBack: this.re_get_auth_state
        })
    }

    // 返回用户状态
    re_get_auth_state = (data) => {
        let dataObj = JSON.parse(data)
        this.$store.commit('SET_AUTH_STATE', dataObj.dataMap)
    }


    // 回调发送手机验证出错
    @action
    error_commit = (err) => {
        console.warn('err', err)
        this.sending = false
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
        // this.$globalFunc.toast('暂不可用')
    }


    // 渲染手机验证
    renderMobile = () => {

        return (
            <View style={[styles.inputBox, signBaseStyles.inputContainer, signBaseStyles.inputContainerPaddingTop]}>
                <View style={[styles.inputItemBox, signBaseStyles.inputItemBox]}>
                    <View style={signBaseStyles.inputLeftBox}>
                        {/*图标 begin*/}
                        {/*<View style={[signBaseStyles.inputLeftIconBox]}>*/}
                            {/*<Image source={mobileIcon}*/}
                                   {/*style={[signBaseStyles.icon]}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        {/*图标 end*/}


                        {/*输入框 begin*/}
                        <TextInput
                            allowFontScaling={false}
                            style={[signBaseStyles.inputLeftInput]}
                            placeholder={'请输入手机验证码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            value={this.verificationCode}
                            onChangeText={(text) => {
                                this.verificationCode = text

                                this.$globalFunc.testVerificationCode(text,this.commit)
                            }}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}

                        />
                        {/*输入框 end*/}
                    </View>

                    {/*获取验证码 begin*/}

                    <CountDown
                        onPress={this.click_getVerificationCode}
                        boxStyle={signBaseStyles.inputRightBox}
                        textStyle={[signBaseStyles.inputRightText,{color:StyleConfigs.txtBlue}]}
                        countingTextStyle={signBaseStyles.inputRightText}
                        text={'发送验证码'}
                        time={60}
                    ></CountDown>

                    {/*获取验证码 end*/}

                </View>


                {/*错误提示*/}
                {
                    this.verificationCodeWA != '' && (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={signBaseStyles.wrongAns}>{this.verificationCodeWA}</Text>
                        </View>
                    )
                }


                {/*按钮 begin*/}
                <BaseButton
                    text={'确   认'}
                    textStyle={[signBaseStyles.buttonText]}
                    onPress={this.commit}
                    style={[baseStyles.btnBlue, styles.inputButton, signBaseStyles.button]}
                />
                {/*按钮 end*/}
            </View>
        )
    }


    /*----------------------- 挂载 -------------------------*/

    render() {


        return (
            <View style={[styles.container]}>
                {
                    this.props.type == typeArr[0] && this.renderGa()
                }
                {
                    this.props.type == typeArr[1] && this.renderMobile()
                }
                {
                    this.sending && <Loading/>
                }

            </View>
        )
    }
}
