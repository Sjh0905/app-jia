/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Platform,Image, Text, TextInput, View,TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import styles from '../style/SignForgetPswStyle'
import signBaseStyles from '../style/SignBaseStyle'
import Loading from './baseComponent/Loading'

import BaseButton from './baseComponent/BaseButton'

import CountDown from './baseComponent/BaseCountDown'


import CodeIcon from '../assets/SignForgetPsw/code-icon.png'
import EmailIcon from '../assets/SignForgetPsw/email-icon.png'
import MobileIcon from '../assets/SignForgetPsw/mobile-icon.png'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import JiYan from "./baseComponent/JiYan";
import device from "../configs/device/device";
import GetGeetestAndroid from "../../native/GetGeetest";
import ENV from "../configs/environmentConfigs/env";
import Toast from "react-native-root-toast";

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/


    // 用户名
    @observable
    userName = ''

    // 用户名错误提示
    @observable
    userNameWA = ''

    // 验证码错误提示
    @observable
    verificationCodeWA = ''

    // 验证码
    @observable
    verificationCode = ''

    @observable
    sending = false

    @observable
    selectedTab = 'mobile'


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        JiYan.setOptions('signForgetPsw', this.onJiYanResult)
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        JiYan.deleteOptions('signForgetPsw')
    }

    /*----------------------- 函数 -------------------------*/


    @action
    goBack = () => {
        this.$router.goBack()
    }


    // 判断输入用户名 不会判断为空
    @action
    testUserName = ()=> {
        let userNameFlag = this.$globalFunc.testEmail(this.userName);
        let mobileFlag = this.$globalFunc.testMobile(this.userName);

        if (this.userName === '') {
            this.userNameWA = ''
            return false
        }

        //如果既不是邮箱格式也不是手机格式
        if (!userNameFlag && !mobileFlag) {
            this.userNameWA = '请输入正确的手机/邮箱'
            return false
        }

        //如果是手机
        mobileFlag && (this.selectedTab = 'mobile')
        //如果是邮箱
        userNameFlag && (this.selectedTab = 'email')

        this.userNameWA = ''
        return true
    }

    // 判断输入验证码 基本上不会判断
    @action
    testVerificationCode = function () {
        if (this.verificationCode === '') {
            this.verificationCodeWA = ''
            return false
        }
        this.verificationCodeWA = ''
        return true
    }

    // 可以发送
    @action
    canSend = () => {

    }

    @action
    canSendVerification = () => {
        let canSend = true
        canSend = canSend && this.testUserName()
        if (this.userName == '') {
            this.userNameWA = '请输入手机/邮箱'
        }
        return canSend
    }

    // 获取验证码
    @action
    getVerificationCode = () => {
        let canSend = this.canSendVerification()

        if (!canSend) return

        this.onJiYanResult();
        /*if(Platform.OS === 'ios'){

            JiYan.startJiYan('signForgetPsw')
            return;
        }


        let API1=this.$globalFunc.getGeetestApi("/user/pullGeetest?client_type='APP'");
        let API2=this.$globalFunc.getGeetestApi('/user/checkGeetest');

        GetGeetestAndroid.tryPromise(ENV.networkConfigs.domain, API2).then((map)=> {
            // alert(map['user_id']);
            // console.log('android_cookie======',map.cookie);
            // ENV.networkConfigs.headers.cookie = map.cookie;

            this.onJiYanResult({result:map['gtStr']});
        })*/
    }

    // 极验回调
    @action
    onJiYanResult = (result) => {
        // let jiYanResult = JSON.parse(result.result)
        let params = {
            // geetest_challenge: jiYanResult.geetest_challenge,
            // geetest_seccode: jiYanResult.geetest_seccode,
            // geetest_validate: jiYanResult.geetest_validate,
            client_type: 'APP',
            "type": this.selectedTab,
            "mun": this.userName,
            'purpose': this.selectedTab === 'mobile' && 'findBackPassword' || 'resetLoginPassword',
        }
        console.log('params.................',params)

        this.$http.send('POST_VERIFICATION_CODE', {
            bind: this,
            timeout:3000,
            params: params,
            callBack: this.re_onJiYanResult,
            errorHandler: this.error_onJiYanResult,
            timeoutHandler:this.timeoutHandler
        })

        // Platform.OS === "android" && this.$globalFunc.deleteHeaderCookie();

    }

    // 极验请求的回调
    @action
    re_onJiYanResult = (data) => {
        if (typeof data === 'string') data = JSON.parse(data)
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.selectedTab === 'email' && (this.userNameWA = '邮箱未注册');
                    this.selectedTab === 'mobile' && (this.userNameWA = '该手机号未被注册/绑定');
                    break;
                case 2:
                    this.selectedTab === 'email' && (this.userNameWA = '无效的邮箱格式');
                    this.selectedTab === 'mobile' && (this.userNameWA = '手机号格式不对');
                    break;
                case 3:
                    this.verificationCodeWA = '发送过于频繁'
                    break;
                case 4:
                    this.userNameWA = '发送异常'
                    break;
                default:
                    this.userNameWA = '发送异常'
            }
            return
        }
        // if(this.selectedTab === 'mobile'){
        //     this.refs.CountDownMobile.beginCountDown()
        // }
        // if(this.selectedTab === 'email'){
        //     this.refs.CountDownEmail.beginCountDown()
        // }

        this.refs.CountDownEmail.beginCountDown()
    }

    // 极验请求的回调出错
    @action
    error_onJiYanResult = (err) => {
        console.warn('找回密码获取手机验证码失败！', err)
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 点击发送
    @action
    commit = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            let canSend = true
            // 判断用户名
            canSend = this.testUserName() && canSend
            canSend = this.testVerificationCode() && canSend

            if (this.userName === '') {
                this.userNameWA = '请输入手机/邮箱'
                canSend = false
            }
            if (this.verificationCode === '') {
                this.verificationCodeWA = '请输入验证码'
                canSend = false
            }

            if (!canSend) {
                return
            }


            let params = {
                type: this.selectedTab,
                purpose: this.selectedTab === 'mobile' && 'findBackPassword' || 'resetLoginPassword',
                "examinee": this.userName,
                "code": this.verificationCode
            }

            console.log('找回密码参数======',params);


            this.$http.send('FIND_BACK_PASSWORD', {
                bind: this,
                timeout:3000,
                params: params,
                callBack: this.re_commit,
                errorHandler: this.error_commit,
                timeoutHandler:this.timeoutHandler

            })

            this.sending = true
        }
    })()

    // 超时
    timeoutHandler = ()=>{
        // this.$globalFunc.timeoutHandler
        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
        this.sending = false
    }

    // 点击发送回调
    @action
    re_commit = (data) => {
        console.log('用户身份信息',data);
        typeof (data) === 'string' && (data = JSON.parse(data))
        this.sending = false
        if (data.result === 'FAIL' || data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    // this.userNameWA = '邮箱未注册'
                    this.selectedTab === 'email' && (this.userNameWA = '邮箱未注册');
                    this.selectedTab === 'mobile' && (this.userNameWA = '该手机号未被注册/绑定');
                    break;
                case 2:
                    this.verificationCodeWA = '验证码错误/已过期'
                    break;
                default:
                    this.userNameWA = '暂不可用'
            }
            return
        }
        if(data.dataMap && data.dataMap.userProfile && (data.dataMap.userProfile.province !== undefined)){
            this.$router.push('SignResetPsw', {userName: this.userName, type: this.selectedTab, userType: data.dataMap.userProfile.province})
        }else{
            this.userNameWA = '暂不可用!';
        }
    }

    // 点击发送回调出错
    @action
    error_commit = (err) => {
        console.warn('找回密码出错', err)
        this.sending = false
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
        // this.$globalFunc.toast('暂不可用')

    }

    // 点击选择手机
    @action
    onSelectMobile = ()=>{
        this.selectedTab !== 'mobile' && (this.selectedTab = 'mobile');
        this.userNameWA = '';//切换页签时错误提示需要清空
    }

    // 点击选择邮箱
    @action
    onSelectEmail = ()=>{
        this.selectedTab !== 'email' && (this.selectedTab = 'email');
        this.userNameWA = '';//切换页签时错误提示需要清空
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, {backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader
                    goBack={this.goBack}
                    // headerTitle={'忘记密码'}
                />
                <Text style={{color:StyleConfigs.txt172A4D,fontSize:StyleConfigs.fontSize26,marginTop:getHeight(52),marginLeft:getWidth(60)}}>找回密码</Text>


                {/*tab*/}
                {/*<View style={styles.tabBox}>*/}
                    {/*<TouchableOpacity onPress={this.onSelectMobile} activeOpacity={1} style={[styles.tabItem, this.selectedTab === 'mobile' && styles.tabItemSelected || {}]}>*/}
                        {/*<Text allowFontScaling={false} style={[styles.tabText,this.selectedTab === 'mobile' && styles.tabTextSelected || {}]}>手机找回</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity onPress={this.onSelectEmail} activeOpacity={1} style={[styles.tabItem, this.selectedTab === 'email' && styles.tabItemSelected || {}]}>*/}
                        {/*<Text allowFontScaling={false} style={[styles.tabText,this.selectedTab === 'email' && styles.tabTextSelected || {}]}>邮箱找回</Text>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}
                {/*tab end*/}

                <View
                    style={[styles.forgetPswBox, signBaseStyles.inputContainer, signBaseStyles.inputContainerPaddingTop,{backgroundColor:StyleConfigs.bgColor}]}>


                    {/*输入邮箱*/}
                    <View
                        style={[signBaseStyles.inputItemBox]}
                    >
                        {/*<View*/}
                            {/*style={[signBaseStyles.iconBox]}*/}
                        {/*>*/}
                            {/*<Image source={EmailIcon} style={[signBaseStyles.icon, styles.emailIcon]} resizeMode={'contain'}/>*/}
                        {/*</View>*/}
                        <TextInput
                            allowFontScaling={false}
                            autoCapitalize={'none'}
                            style={[signBaseStyles.input]}
                            placeholder={'请输入您的手机/邮箱'}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            onBlur={this.testUserName}
                            onChangeText={(text) => {
                                this.userName = text
                            }}
                            keyboardType={'email-address'}
                            returnKeyType={'done'}
                        />
                    </View>


                    {/*手机错误提示 begin*/}
                    {this.userNameWA !== '' ? (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.userNameWA}</Text>
                        </View>
                    ) : null}
                    {/*手机错误提示 end*/}


                    {/*输入密码*/}
                    <View
                        style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}
                    >
                        <View style={[signBaseStyles.inputLeftBox]}>
                            {/*<View*/}
                                {/*style={[signBaseStyles.iconBox]}*/}
                            {/*>*/}
                                {/*<Image source={CodeIcon} style={[signBaseStyles.icon, styles.codeIcon]} resizeMode={'contain'}/>*/}
                            {/*</View>*/}
                            <TextInput
                                allowFontScaling={false}
                                style={[signBaseStyles.inputLeftInput]}
                                placeholder={'请输入验证码'}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.testVerificationCode}
                                onChangeText={(text) => {
                                    this.verificationCode = text
                                }}
                                keyboardType={'numeric'}
                                returnKeyType={'done'}

                            />
                        </View>

                        {/*获取验证码 begin*/}

                        <CountDown
                            onPress={this.getVerificationCode}
                            delay={true}
                            time={60}
                            boxStyle={signBaseStyles.inputRightBox}
                            text={'发送验证码'}
                            textStyle={[signBaseStyles.inputRightText,{color:StyleConfigs.txtBlue}]}
                            ref={'CountDownEmail'}
                        />


                        {/*获取验证码 end*/}
                    </View>

                    {/*邮箱错误提示 begin*/}
                    {this.verificationCodeWA != '' ? (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.verificationCodeWA}</Text>
                        </View>
                    ) : null}
                    {/*邮箱错误提示 end*/}


                    <BaseButton
                        text={'确  认'}
                        textStyle={[signBaseStyles.buttonText]}
                        style={[signBaseStyles.button, styles.commitBtn]}
                        onPress={this.commit}
                    />

                </View>

                {
                    /*this.selectedTab == 'mobile' && <View
                    style={[styles.forgetPswBox, signBaseStyles.inputContainer, signBaseStyles.inputContainerPaddingTop,{backgroundColor:StyleConfigs.bgColor}]}>


                    {/!*输入手机*!/}
                    <View
                        style={[signBaseStyles.inputItemBox]}
                    >
                        {/!*<View*!/}
                            {/!*style={[signBaseStyles.iconBox]}*!/}
                        {/!*>*!/}
                            {/!*<Image source={MobileIcon} style={[signBaseStyles.icon, styles.mobileIcon]} resizeMode={'contain'}/>*!/}
                        {/!*</View>*!/}
                        <TextInput
                            allowFontScaling={false}
                            autoCapitalize={'none'}
                            style={[signBaseStyles.input]}
                            placeholder={'请输入您的手机'}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            onBlur={this.testUserName}
                            onChangeText={(text) => {
                                this.userName = text
                            }}
                            keyboardType={'numeric'}
                            returnKeyType={'done'}
                        />
                    </View>


                    {/!*邮箱错误提示 begin*!/}
                    {this.userNameWA !== '' ? (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.userNameWA}</Text>
                        </View>
                    ) : null}
                    {/!*邮箱错误提示 end*!/}


                    {/!*输入密码*!/}
                    <View
                        style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}
                    >
                        <View style={[signBaseStyles.inputLeftBox]}>
                            {/!*<View*!/}
                                {/!*style={[signBaseStyles.iconBox]}*!/}
                            {/!*>*!/}
                                {/!*<Image source={CodeIcon} style={[signBaseStyles.icon, styles.codeIcon]} resizeMode={'contain'}/>*!/}
                            {/!*</View>*!/}
                            <TextInput
                                allowFontScaling={false}
                                style={[signBaseStyles.inputLeftInput]}
                                placeholder={'请输入手机验证码'}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.testVerificationCode}
                                onChangeText={(text) => {
                                    this.verificationCode = text
                                }}
                                keyboardType={'numeric'}
                                returnKeyType={'done'}

                            />
                        </View>

                        {/!*获取验证码 begin*!/}

                        <CountDown
                            onPress={this.getVerificationCode}
                            delay={true}
                            time={60}
                            boxStyle={signBaseStyles.inputRightBox}
                            text={'发送验证码'}
                            textStyle={[signBaseStyles.inputRightText,{color:StyleConfigs.txtBlue}]}
                            ref={'CountDownMobile'}
                        />


                        {/!*获取验证码 end*!/}
                    </View>

                    {/!*手机错误提示 begin*!/}
                    {this.verificationCodeWA != '' ? (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.verificationCodeWA}</Text>
                        </View>
                    ) : null}
                    {/!*手机错误提示 end*!/}


                    <BaseButton
                        text={'确  认'}
                        textStyle={[signBaseStyles.buttonText]}
                        style={[signBaseStyles.button, styles.commitBtn]}
                        onPress={this.commit}
                    />

                </View>*/
                }

                {
                    this.sending && <Loading leaveNav={true}/>
                }


            </View>
        )
    }
}
