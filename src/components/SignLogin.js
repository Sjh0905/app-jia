/**
 * hjx 2018.4.16
 */

import React from 'react';
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import styles from '../style/SignLoginStyle'
import baseStyles from '../style/BaseStyle'

import NavHeader from './baseComponent/NavigationHeader'
import BaseButton from './baseComponent/BaseButton'

import Loading from './baseComponent/Loading'

import signBaseStyles from '../style/SignBaseStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import JiYan from "./baseComponent/JiYan";
import GetGeetestAndroid from "../../native/GetGeetest";
import ENV from "../configs/environmentConfigs/env";
import root from "../configs/versionConfigs/Version";
import Toast from "react-native-root-toast";

const loginLogin = require('../assets/SignLogin/login-logo.png')


@observer
export default class App extends RNComponent {

    /*----------------------- data -------------------------*/
    @observable
    loading = false

    // 密码错误
    @observable
    pswWrong = ''

    // 密码
    @observable
    psw = ''

    //邮箱
    @observable
    email = '';

    // 手机号
    @observable
    mobile = '';

    // 用户名错误
    @observable
    userNameWrong = ''

    // 发送中
    @observable
    sending = false

    @observable
    selectedTab = 'email'


    /*----------------------- 生命周期 -------------------------*/

    constructor() {
        super();
        this.$beforeParams
        &&
        (this.backTo = this.$beforeParams.backTo)
        &&
        (typeof(this.$beforeParams.closeCallback) == 'function')
        &&
        (this.closeCallback = this.$beforeParams.closeCallback)
    }

    componentWillMount() {
        super.componentWillMount()
        JiYan.setOptions('login', this.onJiYanResult)
    }


    componentWillUnmount() {
        super.componentWillUnmount()
        JiYan.deleteOptions('login')
    }

    /*----------------------- 函数 -------------------------*/


    // 返回
    goBack = () => {
        this.$router.goBack()
    }

    // 忘记密码
    @action
    forgetPsw = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('ForgetPsw')
        }
    })()

    @action
    goWorkOrder = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            // this.$router.push('WorkOrder');
        }
    })()

    // 极验登录
    @action
    clickToLogin = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            let canSend = this.canSend()
            if (!canSend) return

            if(Platform.OS === 'ios'){

                JiYan.startJiYan('login')
                return;
            }


            let API1=this.$globalFunc.getGeetestApi("/user/pullGeetest?client_type='APP'");
            let API2=this.$globalFunc.getGeetestApi('/user/checkGeetest');

            console.log('API1======',API1);
            console.log('API2======',API2);

            GetGeetestAndroid.tryPromise(ENV.networkConfigs.domain, API2).then((map)=> {
                // alert(map['gtStr']);
                // console.log('android_cookie======',map.cookie);ENV.networkConfigs.headers.cookie
                // ENV.networkConfigs.headers.cookie = map.cookie;
                this.onJiYanResult({result:map['gtStr']});
            }).catch((ex)=>{
                alert(ex);
            });
        }
    })()

    // 极验返回
    @action
    onJiYanResult = result => {
        let canSend = this.canSend()
        if (!canSend) return

        // let jiYanResult = JSON.parse(result.result)
        //如果通过验证
        let params = {
            // 'geetest_challenge': jiYanResult.geetest_challenge,
            // 'geetest_seccode': jiYanResult.geetest_seccode,
            // 'geetest_validate': jiYanResult.geetest_validate,
            'client_type': 'APP',
            // "email": this.userName,
            'source': 'APP'
        }
        // console.log('signlogin params===',params)

        let address = '';

        if(this.selectedTab === 'mobile'){
            address = 'LOGIN_BY_MOBILE';
            params.mobile = this.userName;
            params.password = this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString();
        }
        if(this.selectedTab === 'email'){
            address = 'LOGIN';
            params.email = this.userName;
            params.password1 = this.$globalFunc.CryptoJS.SHA1(this.userName.toLowerCase() + ':' + this.psw).toString();
            params.password2 = this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString();
        }

        if(!address){
            return;
        }

        console.log('signlogin params===',params)

        // 发送登录请求
        this.$http.send(address, {
            bind: this, params: params,
            timeout:3000,
            callBack: this.re_login,
            errorHandler: this.error_login,
            timeoutHandler:this.timeoutHandler

        })
        this.sending = true

        // Platform.OS === "android" && this.$globalFunc.deleteHeaderCookie();deleteHeaderCookie

    }

    // 超时
    timeoutHandler = ()=>{
        // this.$globalFunc.timeoutHandler
        this.sending = false
        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }

    @action
    re_login = (data) => {
        console.log('login=======================================', data);
        typeof(data) === 'string' && (data = JSON.parse(data))
        // console.warn('data', data)
        this.sending = false
        if (data.errorCode || data.result === 'FAIL') {

            switch (data.errorCode) {
                case 1:
                    this.userNameWrong = '用户名或密码错误'
                    break;
                case 2:
                    this.selectedTab === 'mobile' && (this.userNameWrong = '手机格式不对')
                    this.selectedTab === 'email' && (this.userNameWrong = '邮箱格式不对')
                    break;
                case 3:
                    this.$router.push('Verify', {
                        userName: this.userName,
                        type: this.selectedTab,
                        backTo: this.backTo,
                        closeCallback: this.closeCallback
                    })
                    break;
                case 4:
                    this.userNameWrong = '需要先完成上一步验证';
                    this.clickToLogin();
                    break;
                case 5:
                    this.userNameWrong = '您暂被禁止登录'
                    break;
                case 101:
                    this.userNameWrong = '密码错误次数过多，请稍后重试'//case:1.密码错误次数过多，请稍后重试
                    break;
                case 6:
                    this.selectedTab === 'mobile' && (this.userNameWrong = '请找回或重置一次密码才可使用手机登录')
                    break;
                case 7:
                    this.userNameWrong = '请检查cookie配置'
                case 10000:
                    this.userNameWrong = '欧联用户登录，请通过"忘记密码?"方式重置密码后再登录'
                    break;
                default:
                    this.userNameWrong = '登录异常'
            }
            return
        }


        this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile);
        //判断当前用户手势密码是否存在
        if(data && data.dataMap && data.dataMap.userProfile){
            let userId = data.dataMap.userProfile.userId + '';

            AsyncStorage.getItem(userId).then((data)=> {
                // data == null && this.$store.commit('SET_RECOMMEND_GESTURE',true);
                data && this.$store.commit('SET_GESTURE',true);
            })
        }


        this.closeCallback && this.closeCallback();
        if(this.backTo){
            this.$router.goBackToRoute(this.backTo)
        }else{
            this.$router.popToTop()
        }
        // 新登录
        this.$event.notify({key:'NEW_LOGIN'})


        // this.$router.popToTop()
    }


    @action
    error_login = (err) => {
        console.warn("this is wrong!",err)
        this.sending = false
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })

        // this.$globalFunc.toast('暂不可用')
    }


    // 去注册
    goToRegister = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.goto('Register');
        }
    })()


    // 检测邮箱
    @action
    testEmail = () => {
        let userNameFlag = this.$globalFunc.testEmail(this.userName);
        let mobileFlag = this.$globalFunc.testMobile(this.userName);

        if (this.userName === '') {
            this.userNameWrong = ''
            return false
        }

        //如果既不是邮箱格式也不是手机格式
        if (!userNameFlag && !mobileFlag) {
            this.userNameWrong = '请输入正确的邮箱或手机号码'
            return false
        }

        //如果是手机
        mobileFlag && (this.selectedTab = 'mobile')
        //如果是邮箱
        userNameFlag && (this.selectedTab = 'email')

        this.userNameWrong = ''
        return true
    }

    // 检测手机
    @action
    testMobile = () => {
        if (this.userName === '') {
            this.userNameWrong = ''
            return false
        }
        if (!this.$globalFunc.testMobile(this.userName)) {
            this.userNameWrong = '请输入正确的手机'
            return false
        }
        this.userNameWrong = ''
        return true
    }

    // 检测密码格式
    @action
    testPsw = () => {
        if (this.psw === '') {
            this.pswWrong = ''
            return false
        }
        this.pswWrong = ''
        return true
    }

    @action
    testUserName = ()=>{
        if( this.selectedTab === 'mobile' && this.testMobile()){
            return true;
        }
        if( this.selectedTab === 'email' && this.testEmail()){
            return true;
        }

        return false;
    }

    // 表单验证
    @action
    canSend = function () {
        let canSend = true
        canSend = this.testPsw() && canSend
        canSend = this.testUserName() && canSend
        if (this.userName === '') {
            this.userNameWrong = '请输入邮箱或手机号码'
            canSend = false
        }
        if (this.psw === '') {
            this.pswWrong = '请输入密码'
            canSend = false
        }
        return canSend
    }

    @action
    onSelectMobile = ()=>{
        if(this.selectedTab !== 'mobile'){
            this.selectedTab = 'mobile';
            this.userName = '';
            this.psw = '';
            this.userNameWrong = '';
            this.pswWrong = '';
        }
    }
    @action
    onSelectEmail = ()=>{
        if(this.selectedTab !== 'email'){
            this.selectedTab = 'email';
            this.userName = '';
            this.psw = '';
            this.userNameWrong = '';
            this.pswWrong = '';
        }
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-getHeight(300)}  style={[styles.container, styles.bg]}>

                <NavHeader
                    navStyle={{backgroundColor:StyleConfigs.signLoginBackColor}}
                    goBack={this.goBack}
                    headerLeftTitle={'取消'}
                    headerLeftOnPress={this.goBack}
                    // headerRightOnPress={this.goWorkOrder}
                />
                <View style={styles.topBox}>
                    {/*登录logo begin*/}
                    <Image
                        source={loginLogin}
                        style={styles.loginLogo}
                        resizeMode={'contain'}
                    />
                    <Text allowFontScaling={false} style={[baseStyles.text8994A5,baseStyles.size16]}>登录欧联</Text>
                    {/*登录logo end*/}
                    {/*<View style={styles.tabBox}>*/}
                        {/*<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectMobile} style={[styles.loginTab,this.selectedTab === 'mobile' && styles.selectedTab || {}]}>*/}
                            {/*<Text allowFontScaling={false} style={[baseStyles.textColor,styles.tabText,this.selectedTab === 'mobile' && styles.selectedTabText || {}]}>手机登录</Text>*/}
                            {/*<View style={[styles.tabUnderlineStyle,this.selectedTab === 'mobile' && styles.selectedTBLine || {}]}/>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectEmail} style={[styles.loginTab,this.selectedTab === 'email' && styles.selectedTab || {}]}>*/}
                            {/*<Text allowFontScaling={false} style={[baseStyles.textColor,styles.tabText,this.selectedTab === 'email' && styles.selectedTabText || {}]}>邮箱登录</Text>*/}
                            {/*<View style={[styles.tabUnderlineStyle,this.selectedTab === 'email' && styles.selectedTBLine || {}]}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                </View>


                {/*输入框 begin*/}
                <View style={[styles.inputBox, signBaseStyles.inputContainer]}>

                    {/*手机 begin*/}
                    {
                        /*!!(this.selectedTab === 'mobile') && <View
                        style={[styles.inputDetail, styles.emailBox, signBaseStyles.inputItemBox]}>
                        <View style={[signBaseStyles.iconBox]}>
                            <Image source={mobileIcon} style={[styles.inputIcon, styles.mobileIcon]} resizeMode={'contain'} />
                        </View>
                        <TextInput
                            allowFontScaling={false}
                            autoCapitalize={'none'}
                            style={[signBaseStyles.input]}
                            placeholder={'请输入您的手机'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.testMobile}
                            onChangeText={(text) => {
                                this.userName = text
                            }}
                            // value={this.userName}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}

                        />
                    </View>*/}
                    {/*手机 end*/}

                    {/*邮箱 begin*/}
                    {/*!!(this.selectedTab === 'email') && */
                    <View
                        style={[styles.inputDetail, styles.emailBox, signBaseStyles.inputItemBox]}>
                        {/*<View style={[signBaseStyles.iconBox]}>*/}
                            {/*<Image source={emailIcon} style={[styles.inputIcon, styles.emailIcon]} resizeMode={'contain'}/>*/}
                        {/*</View>*/}
                        <TextInput
                            allowFontScaling={false}
                            autoCapitalize={'none'}
                            style={[signBaseStyles.input]}
                            placeholder={'邮箱或手机号码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.testEmail}
                            // onFocus={()=>{console.log('获取焦点')}}
                            onChangeText={(text) => {
                                this.userName = text
                            }}
                            returnKeyType={'done'}
                            keyboardType={'email-address'}

                        />
                    </View>}
                    {/*邮箱 end*/}

                    {/*邮箱错误提示 begin*/}
                    {this.userNameWrong != '' ? (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.userNameWrong}</Text>
                        </View>
                    ) : null}
                    {/*邮箱错误提示 end*/}


                    {/*密码 begin*/}
                    <View
                        style={[styles.inputDetail, styles.pswBox, signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
                        {/*<View style={[signBaseStyles.iconBox]}>*/}
                            {/*<Image source={pswIcon} style={[styles.inputIcon, styles.pswIcon]} resizeMode={'contain'}/>*/}
                        {/*</View>*/}
                        {
                            /*!!(this.selectedTab === 'mobile') && <TextInput
                                allowFontScaling={false}
                                style={[signBaseStyles.input]}
                                placeholder={'请输入您的密码'}
                                secureTextEntry={true}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.testPsw}
                                // value={this.psw}
                                onChangeText={(text) => {
                                    this.psw = text
                                }}
                                returnKeyType={'done'}

                            />*/
                        }
                        {
                            /*this.selectedTab === 'email' && */
                            <TextInput
                                allowFontScaling={false}
                                style={[signBaseStyles.input]}
                                secureTextEntry={true}
                                placeholder={'密码'}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.testPsw}
                                value={this.psw}
                                onChangeText={(text) => {
                                    this.psw = text
                                }}
                                returnKeyType={'done'}

                                />
                        }
                    </View>
                    {/*密码 end*/}


                    {/*密码错误提示 begin*/}
                    {this.pswWrong != '' ? (
                        <View style={signBaseStyles.wrongAnsBox}>
                            <View style={signBaseStyles.wrongAnsPadding}></View>
                            <Text allowFontScaling={false} style={signBaseStyles.wrongAns}>{this.pswWrong}</Text>
                        </View>
                    ) : null}
                    {/*密码错误提示 end*/}

                    {/*按钮 begin*/}
                    <BaseButton
                        onPress={this.onJiYanResult}
                        style={[styles.loginBtn, signBaseStyles.button]}
                        textStyle={[signBaseStyles.buttonText]}
                        activeOpacity={StyleConfigs.activeOpacity}
                        text={this.sending ? '正 在 登 录' : '登  录'}
                    >
                    </BaseButton>
                    {/*按钮 end*/}

                    {/*忘记密码 begin*/}
                    <TouchableOpacity
                        style={styles.forgetPswBox}
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.forgetPsw}
                    >
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.forgetPsw}
                        >
                            <Text
                                allowFontScaling={false}
                                style={styles.forgetPsw}
                            >忘记密码</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {/*忘记密码 end*/}


                    {/*没有账号 begin*/}
                    <TouchableOpacity style={[styles.goToRegisterBox]}
                                      activeOpacity={StyleConfigs.activeOpacity}
                                      onPress={this.goToRegister}
                    >
                        <Text allowFontScaling={false} style={[baseStyles.text8994A5, styles.haveNoAccount]}>还没有欧联账号？</Text>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.goToRegister}
                        >
                            <Text allowFontScaling={false} style={[baseStyles.textBlue, styles.goToRegister]}>注册</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {/*没有账号 end*/}
                </View>
                {/*输入框 end*/}


                {
                    (this.loading || this.sending) && <Loading leaveNav={true}/>
                }


            </KeyboardAvoidingView>
        )
    }
}
