/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/SignResetPswStyle'
import signBaseStyles from '../style/SignBaseStyle'
import PswIcon from '../assets/SignResetPsw/password-icon.png'
import PswConfirm from '../assets/SignResetPsw/password-confirm-icon.png'
import StyleConfigs from "../style/styleConfigs/StyleConfigs"
import BaseButton from './baseComponent/BaseButton'

import GoogleIcon from '../assets/SignResetPsw/google-icon.png'
import CodeIcon from '../assets/SignResetPsw/code-icon.png'
import EmailIcon from '../assets/SignResetPsw/email-icon.png'

import CountDown from './baseComponent/BaseCountDown'

import BaseCheckBox from './baseComponent/BaseCheckBox'

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    commitType = '';

    @observable
    userName = ''

    @observable
    loading = true

    @observable
    psw = ''

    @observable
    pswWA = ''

    @observable
    pswConfirm = ''

    @observable
    pswConfirmWA = ''

    @observable
    picker = 0

    @observable
    bindGa = false

    @observable
    bindMobile = false

    @observable
    bindEmail = false;

    @observable
    verificationCode = ''

    @observable
    verificationCodeWA = '';

    @observable
    GACode = ''

    @observable
    GACodeWA = ''

    @observable
    sending = false

    @observable
    tabType = 'ga';

    @observable
    type = '';

    @observable
    userType = '';




    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        // 用户名
        this.userName = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.userName;

        //找回类型
        this.type = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.type;

        // 用户类型
        this.userType = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.userType;

        this.getAuthState()
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

    // 获取认证状态
    @action
    getAuthState = () => {
        // 发送验证
        let params = {};
        params[this.type] = this.userName;
        console.log('身份验证接口',params)
        this.$http.send('VERIFYING_LOGIN_STATE', {
            bind: this,
            params: params,
            callBack: this.re_getAuthState,
            errorHandler: this.error_getAuthState
        })
    }

    // 获取认证状态回调
    @action
    re_getAuthState = (data) => {
        console.log('获取认证状态结果',data);
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (data.errorCode || data.result === 'FAIL') {
            this.$router.goBack()
            return
        }
        // 两者都验证了

        this.bindGa = data.dataMap.ga
        this.bindMobile = data.dataMap.sms
        this.bindEmail = data.dataMap.email;

        this.tabType = (this.bindGa && 'ga') || (this.bindMobile && 'sms')

        this.loading = false
    }

    // 获取认证状态
    @action
    error_getAuthState = (err) => {
        console.warn("验证身份出错", err)
    }


    // 获取验证码
    @action
    getVerificationCode = () => {
        // 发送
        let params = {
            "type": this.type === 'mobile' && 'email' || 'mobile',
            "mun": this.userName,
            "purpose": this.type === 'mobile' && 'findBackPassword' || "resetLoginPassword",
            "examinee": this.userName
        }

        this.$http.send('POST_VERIFICATION_CODE', {
            bind: this,
            params: params,
            callBack: this.re_getVerificationCode,
            errorHandler: this.error_getVerificationCode,
        })

    }

    // 获取手机验证码回调
    @action
    re_getVerificationCode = (data) => {
        console.log('获取验证码2',data);
        if (typeof data === 'string') data = JSON.parse(data)
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.pswWA = '该邮箱未被注册/绑定'
                    break;
                case 2:
                    this.pswWA = '请求过于频繁'
                    break;
                case 3:
                    this.pswWA = '发送异常'
                    break;
                case 4:
                    this.pswWA = '需要先完成上一步验证'
                    break;
                default:
                    this.pswWA = '发送异常'
            }
        }
    }

    // 获取手机验证码出错
    @action
    error_getVerificationCode = (err) => {
        console.warn('获取手机验证码出错', err)
    }


    // 回退
    @action
    goBack = () => {
        this.$router.goBack()
    }


    // 提交
    @action
    commit = () => {
        let canSend = true

        // let email = this.$store.state.authMessage.email
        // 判断用户名
        canSend = this.testPsw() && canSend
        canSend = this.testPswConfirm() && canSend
        canSend = !this.sending && canSend

        if (this.psw == '') {
            this.pswWA = '请输入密码'
            canSend = false
        }
        if (this.pswConfirm == '') {
            this.pswConfirmWA = '请确认密码'
            canSend = false
        }

        // if (this.verificationCode == '') {
        //     this.verificationCodeWA = '验证码不能为空'
        //     canSend = false
        // }
        //
        // if (this.GACode == '') {
        //     this.GACodeWA = '验证码不能为空'
        //     canSend = false
        // }

        let params = {

        }
        let address = '';

        let success = ()=>{}
        let error = ()=>{}

        // 如果是手机 且绑定了 邮箱
        if(this.type === 'mobile' && this.bindEmail){
            this.commitType = 'email';
            if(!this.testVerificationCode(this.verificationCode)){
                this.verificationCodeWA = '验证码不能为空'
                canSend = false;
            }
            if (this.verificationCode != '' && this.verificationCode.indexOf(" ") > -1) {
                this.verificationCodeWA = '您输入的验证码含有空格，请检查后重试'
                canSend = false
            }
            params = {
                "purpose": "findBackPassword",
                "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
                "code": this.verificationCode,
                "type": 'email'
            }
            address = 'POST_COMMON_AUTH';
            success = this.re_commit_email;
            error = this.error_commit_email;
        }

        // 如果是邮箱 且绑定了谷歌 且没有绑定手机
        if(this.type === 'email' && this.bindGa && !this.bindMobile){
            this.commitType = 'ga'
            if(!this.testVerificationCode(this.GACode)){
                this.GACodeWA = '验证码不能为空'
                canSend = false;
            }
            params = {
                "purpose": "resetLoginPassword",
                "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
                "code": this.GACode,
                "type": 'ga'
            }
            address = 'POST_COMMON_AUTH';

            success = this.re_commit_ga;
            error = this.error_commit_ga;
        }

        // 如果是邮箱 且绑定了手机 且没有绑定邮箱
        if(this.type === 'email' && !this.bindGa && this.bindMobile){
            this.commitType = 'mobile'
            if(!this.testVerificationCode(this.verificationCode)){
                this.verificationCodeWA = '验证码不能为空'
                canSend = false;
            }
            if (this.verificationCode != '' && this.verificationCode.indexOf(" ") > -1) {
                this.verificationCodeWA = '您输入的验证码含有空格，请检查后重试'
                // return false
                canSend = false
            }
            params = {
                "purpose": "resetLoginPassword",
                "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
                "code": this.verificationCode,
                "type": 'mobile'
            }
            address = 'POST_COMMON_AUTH';

            success = this.re_commit_mobile;
            error = this.error_commit_mobile;
        }

        // 如果是邮箱 且绑定了手机 且绑定了邮箱
        if(this.type === 'email' && this.bindGa && this.bindMobile){
            let verification = '';
            let verificationType = '';
            if(this.tabType === 'ga'){
                varification = this.GACode;
                verificationType = 'ga';

                success = this.re_commit_ga;
                error = this.error_commit_ga;
            }
            if(this.tabType === 'sms'){
                varification = this.verificationCode;
                verificationType = 'mobile'

                success = this.re_commit_mobile;
                error = this.error_commit_mobile;
            }
            this.commitType= verificationType;

            if(!this.testVerificationCode(varification)){
                this.tabType === 'ga' && (this.GACodeWA = '验证码不能为空');
                this.tabType === 'sms' && (this.verificationCodeWA = '验证码不能为空');

                canSend = false;
            }
            if (this.verificationCode != '' && this.verificationCode.indexOf(" ") > -1) {
                this.verificationCodeWA = '您输入的验证码含有空格，请检查后重试'
                // return false
                canSend = false
            }
            params = {
                "purpose": "resetLoginPassword",
                "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
                "code": varification,
                "type": verificationType
            }
            address = 'POST_COMMON_AUTH';
        }

        // 什么都没绑定
        if((this.type === 'email' && !this.bindGa && !this.bindMobile) || (this.type === 'mobile' && !this.bindEmail)){
            params = {
                "password": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString()
            }
            params[this.type] = this.userName;

            this.userType === 'mobile' && (address = 'FIND_BACK_PASSWORD_RESET_MOBILE');
            this.userType === 'email' && (address = 'FIND_BACK_PASSWORD_RESET');
            this.userType === '' && (address = 'FIND_BACK_PASSWORD_RESET');

            success = this.re_commit;
            error = this.error_commit;
        }

        if(canSend){
            this.$http.send(address, {
                bind: this,
                params: params,
                callBack: success,
                errorHandler: error,
                timeoutHandler:this.timeoutHandler

            })
            this.sending = true;
        }

        return;
        // 其他情况
    }

    // 超时
    timeoutHandler = ()=>{
        this.$globalFunc.timeoutHandler
        this.sending = false
    }


    // 回复谷歌验证
    @action
    re_commit_ga = (data) => {
        typeof data == 'string' && (data = JSON.parse(data))
        this.sending = false

        if (data.errorCode) {

            switch (data.errorCode) {
                case 1:
                    this.pswWA = '登录异常'
                    break;
                case 2:
                    this.GACodeWA = '谷歌验证未通过'
                    break;
                case 3:
                    this.pswWA = '系统异常'
                    break;
                default:
                    this.pswWA = '系统异常，请稍后再试'
            }

            return
        }
        this.checkLogin()
    }

    // 谷歌验证出错
    @action
    error_commit_ga = (err) => {
        console.warn("谷歌验证出错", err)
        this.sending = false
    }

    // 回复手机验证
    @action
    re_commit_mobile = (data) => {
        typeof data == 'string' && (data = JSON.parse(data))
        this.sending = false
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.pswWA = '该用户未被绑定'
                    break;
                case 2:
                    this.verificationCodeWA = '验证码错误'
                    break;
                case 3:
                    this.verificationCodeWA = '验证码过期'
                    break;
                case 4:
                    this.pswWA = '登录异常'
                    break;
                default:
                    this.pswWA = '系统异常，请稍后再试'
            }
            return
        }
        this.checkLogin()
    }

    // 手机验证出错
    @action
    error_commit_mobile = (err) => {
        console.warn("手机验证出错", err)
        this.sending = false
    }


    // 回复手机验证
    @action
    re_commit_email = (data) => {
        typeof data == 'string' && (data = JSON.parse(data))
        this.sending = false
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.pswWA = '该邮箱未被注册/绑定'
                    break;
                case 2:
                    this.verificationCodeWA = '验证码错误/已过期'
                    break;
                case 3:
                    this.verificationCodeWA = '验证码错误/已过期'
                    break;
                case 4:
                    this.pswWA = '需要先完成上一步验证'
                    break;
                default:
                    this.pswWA = '系统异常，请稍后再试'
            }
            return
        }
        this.checkLogin()
    }

    // 手机验证出错
    @action
    error_commit_email = (err) => {
        console.warn("邮箱验证出错", err)
        this.sending = false
    }

    // 两者都没验证回调
    @action
    re_commit = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        this.sending = false
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.userType === 'mobile' && (this.pswWA = '数据格式错误') || (this.pswWA = '密码格式错误');
                    break;
                case 2:
                    this.userType === 'mobile' && (this.pswWA = '需要先完成上一步验证');
                    break;
                case 3:
                    this.userType === 'mobile' && (this.pswWA = '需要先完成上一步验证');
                    break;
                case 4:
                    this.userType === 'mobile' && (this.pswWA = '该手机号未被注册/绑定');
                    break;
                default:
                    this.pswWA = '系统异常，请稍后再试'
            }

            return
        }
        this.checkLogin()
    }

    // 两者都没验证出错
    @action
    error_commit = (err) => {
        console.warn("验证出错", err)
        this.sending = false
        this.$globalFunc.toast('暂不可用')

    }


    // 登录一下
    checkLogin = () => {
        this.$http.send('CHECK_LOGIN_IN', {
            bind: this,
            callBack: this.re_checkLogin,
            errorHandler: this.error_checkLogin
        })
    }

    // 登录一下回调
    re_checkLogin = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))

        if (data.result === 'FAIL' || data.errorCode) {
            return
        }

        this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)

        this.$event.notify({key:'NEW_LOGIN'})

        this.$router.popToTop()

    }
    // 登录一下出错
    error_checkLogin = (err) => {
        console.warn("获取登录", err)
    }


    // 测试输入密码
    testPsw = () => {
        if (this.pswConfirm !== '' || this.pswConfirm === this.psw) {
            this.testPswConfirm()
        }
        if (this.psw === '') {
            this.pswWA = ''
            return false
        }
        if (!this.$globalFunc.testPsw(this.psw)) {
            this.pswWA = '输入密码不符合规范！请输入8到16位数字或字母'
            return false
        }
        this.pswWA = ''
        return true
    }

    // 检测确认密码
    testPswConfirm = () => {
        if (this.psw !== this.pswConfirm) {
            this.pswConfirmWA = '两次输入不一致'
            return false
        }
        this.pswConfirmWA = ''
        return true
    }

    // 检测验证码
    testVerificationCode = (code) => {
        if (code === '') {
            // this.GACodeWA = '';
            // this.verificationCodeWA = ''
            return false
        }
        this.verificationCodeWA = ''
        this.GACodeWA = '';
        return true
    }

    // 检测谷歌验证码
    testGACode = () => {
        if (this.GACode === '') {
            this.GACodeWA = ''
            return false
        }
        this.GACodeWA = ''
        return true
    }


    // 渲染谷歌验证
    renderGoogle = () => {
        // if (!this.bindMobile && this.bindGa)
            return (
                <View>
                    <View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
                        {/*<View style={[signBaseStyles.iconBox]}>*/}
                            {/*<Image source={GoogleIcon} style={[signBaseStyles.icon, styles.googleIcon]}/>*/}
                        {/*</View>*/}
                        <TextInput
                            allowFontScaling={false}
                            style={[signBaseStyles.input]}
                            placeholder={'请输入谷歌验证码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.testVerificationCode.bind(this.GACode)}
                            onChangeText={(text) => {
                                this.GACode = text
                            }}
                            // value={this.GACode}
                            keyboardType={'numeric'}
                        />
                    </View>

                    {/*谷歌验证码错误 begin*/}
                    {
                        !!this.GACodeWA && (
                            <View style={[signBaseStyles.wrongAnsBox]}>
                                <View style={[signBaseStyles.wrongAnsPadding]}></View>
                                <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.GACodeWA}</Text>
                            </View>
                        )
                    }
                    {/*谷歌验证码错误 end*/}

                </View>
            )
        return null

    }


    // 渲染手机验证
    renderMobile = () => {
        let verificationCodeWA = this.verificationCodeWA;
        // if (this.bindMobile && !this.bindGa)
            return (
                <View>
                    <View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
                        <View style={[signBaseStyles.inputLeftBox]}>
                            {/*<View style={[signBaseStyles.inputLeftIconBox]}>*/}
                                {/*<Image source={CodeIcon} style={[signBaseStyles.icon, styles.codeIcon]}/>*/}
                            {/*</View>*/}
                            <TextInput
                                allowFontScaling={false}
                                style={[signBaseStyles.inputLeftInput]}
                                placeholder={'请输入手机验证码'}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.testVerificationCode.bind(this.verificationCode)}
                                onChangeText={(text) => {
                                    this.verificationCode = text
                                }}
                                // value={this.verificationCode}
                                keyboardType={'numeric'}
                            />
                        </View>
                        {/*获取验证码 begin*/}
                        <CountDown
                            boxStyle={[signBaseStyles.inputRightBox]}
                            textStyle={[signBaseStyles.inputRightText,{color:StyleConfigs.txtBlue}]}
                            text={'获取验证码'}
                            onPress={this.getVerificationCode}
                        />

                        {/*获取验证码 end*/}
                    </View>

                    {/*手机验证码错误 begin*/}
                    {
                        !!verificationCodeWA && (
                            <View style={[signBaseStyles.wrongAnsBox]}>
                                <View style={[signBaseStyles.wrongAnsPadding]}></View>
                                <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{verificationCodeWA}</Text>
                            </View>
                        )
                    }
                    {/*手机验证码错误 end*/}

                </View>
            )
        return null
    }


    @action
    renderEmail = ()=>{
        // if (this.bindMobile && !this.bindGa)
            return (
                <View>
                    <View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
                        <View style={[signBaseStyles.inputLeftBox]}>
                            {/*<View style={[signBaseStyles.inputLeftIconBox]}>*/}
                                {/*<Image source={EmailIcon} resizeMode={'contain'} style={[signBaseStyles.icon]}/>*/}
                            {/*</View>*/}
                            <TextInput
                                allowFontScaling={false}
                                style={[signBaseStyles.inputLeftInput]}
                                placeholder={'请输入邮箱验证码'}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.testVerificationCode.bind(this.verificationCode)}
                                onChangeText={(text) => {
                                    this.verificationCode = text
                                }}
                                // value={this.verificationCode}
                                keyboardType={'numeric'}
                            />
                        </View>
                        {/*获取验证码 begin*/}
                        <CountDown
                            boxStyle={[signBaseStyles.inputRightBox]}
                            textStyle={[signBaseStyles.inputRightText,{color:StyleConfigs.txtBlue}]}
                            text={'获取验证码'}
                            onPress={this.getVerificationCode}
                        />

                        {/*获取验证码 end*/}
                    </View>

                    {/*邮箱验证码错误 begin*/}
                    {
                        !!this.verificationCodeWA && (
                            <View style={[signBaseStyles.wrongAnsBox]}>
                                <View style={[signBaseStyles.wrongAnsPadding]}></View>
                                <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.verificationCodeWA}</Text>
                            </View>
                        )
                    }
                    {/*邮箱验证码错误 end*/}

                </View>
            )
        return null
    }

    @action
    onChangeTab = (type)=>{
        this.tabType = type;
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container, baseStyles.bgColor]} verificationCodeWA={this.verificationCodeWA}>
                <NavHeader headerTitle={'重置密码'} goBack={this.goBack}/>


                <View
                    style={[signBaseStyles.inputContainer, styles.inputContainer, , signBaseStyles.inputContainerPaddingTop]}>

                    {/*输入新密码 begin*/}
                    <View style={[signBaseStyles.inputItemBox]}>
                        {/*<View style={[signBaseStyles.iconBox]}>*/}
                            {/*<Image source={PswIcon} style={[signBaseStyles.icon, styles.pswIcon]}/>*/}
                        {/*</View>*/}
                        <TextInput
                            allowFontScaling={false}
                            style={[signBaseStyles.input]}
                            placeholder={'请输入您的密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.testPsw}
                            onChangeText={(text) => {
                                this.psw = text
                            }}
                            // value={this.psw}
                            secureTextEntry={true}
                            returnKeyType={'done'}
                        />
                    </View>

                    {/*密码错误 begin*/}
                    {
                        !!this.pswWA && (
                            <View style={[signBaseStyles.wrongAnsBox]}>
                                <View style={[signBaseStyles.wrongAnsPadding]}></View>
                                <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.pswWA}</Text>
                            </View>
                        )
                    }
                    {/*密码错误 end*/}

                    {/*输入新密码 end*/}


                    {/*重复新密码 begin*/}
                    <View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
                        {/*<View style={[signBaseStyles.iconBox]}>*/}
                            {/*<Image source={PswConfirm} style={[signBaseStyles.icon, styles.pswConfirmIcon]}/>*/}
                        {/*</View>*/}
                        <TextInput
                            allowFontScaling={false}
                            style={[signBaseStyles.input]}
                            placeholder={'请再次确认密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.testPswConfirm}
                            onChangeText={(text) => {
                                this.pswConfirm = text
                            }}
                            // value={this.pswConfirm}
                            secureTextEntry={true}
                        />
                    </View>

                    {/*重复新密码错误 begin*/}
                    {
                        !!this.pswConfirmWA && (
                            <View style={[signBaseStyles.wrongAnsBox]}>
                                <View style={[signBaseStyles.wrongAnsPadding]}></View>
                                <Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.pswConfirmWA}</Text>
                            </View>
                        )
                    }
                    {/*重复新密码错误 begin*/}

                    {/*重复新密码 end*/}

                    {
                        (!!this.bindGa  && !!this.bindMobile && this.type === 'email') &&
                        (<View style={styles.tabBox}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.onChangeTab.bind(this,'ga')}
                                style={styles.tab}>
                                <BaseCheckBox
                                    keys={'checkbox1'}
                                    onPress={this.onChangeTab.bind(this,'ga')}
                                    checked={this.tabType === 'ga'}
                                />
                                <Text style={[styles.tabText,this.tabType === 'ga' && styles.selectedTabText || {} ]}> 谷歌验证</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.onChangeTab.bind(this,'sms')}
                                style={styles.tab}>
                                <BaseCheckBox
                                    keys={'checkbox2'}
                                    onPress={this.onChangeTab.bind(this,'sms')}
                                    checked={this.tabType === 'sms'}
                                />
                                <Text style={[styles.tabText,this.tabType === 'sms' && styles.selectedTabText || {} ]}> 手机验证</Text>
                            </TouchableOpacity>
                        </View>)
                    }

                    {/*绑定谷歌验证 begin*/}
                    {
                        (this.tabType === 'ga' && this.bindGa && this.type === 'email') && this.renderGoogle()
                    }
                    {/*绑定谷歌验证 end*/}


                    {/*绑定手机验证 begin*/}
                    {
                        (this.tabType === 'sms' && this.bindMobile && this.type === 'email') && this.renderMobile(this.verificationCodeWA)
                    }
                    {/*绑定手机验证 end*/}

                    {/*绑定手机验证 begin*/}
                    {
                        (this.bindEmail && this.type === 'mobile') && this.renderEmail(this.verificationCodeWA)
                    }
                    {/*绑定手机验证 end*/}


                    {/*确认按钮 begin*/}
                    <BaseButton
                        onPress={this.commit}
                        style={[signBaseStyles.button, styles.commitBtn]}
                        text={'确  认'}
                        textStyle={[signBaseStyles.buttonText]}
                    >
                    </BaseButton>
                    {/*确认按钮 end*/}


                </View>


                {/*加载中*/}
                {
                    !!(this.loading || this.sending) && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
