/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/MineReleaseGoogleStyle'
import InputStyle from "../style/MineInputStyle"
import BaseButton from './baseComponent/BaseButton'
import device from "../configs/device/device";
import CountDown from './baseComponent/BaseCountDown'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import Toast from "react-native-root-toast";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true

    // 密码
    @observable
    psw = ''

    // 邮箱
    @observable
    email

    // 邮箱验证码
    @observable
    emailCode = ''

    // 邮箱验证码
    @observable
    verificationCode = ''


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        // 获取认证状态
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

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }


    // 获取认证状态
    @action
    getAuthState = () => {
        this.$http.send('GET_AUTH_STATE', {
            bind: this,
            callBack: this.re_getAuthState,
            errorHandler: this.error_getAuthState
        })
    }
    // 判断验证状态回调
    @action
    re_getAuthState = (data) => {
        console.log('解绑授权接口',data)
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || data.errorCode) {
            return
        }

        this.$store.commit('SET_AUTH_STATE', data.dataMap)

        if (!data.dataMap.email) {
            this.$router.goBack()
        }

        this.loading = false
    }

    // 判断验证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
        this.loading = false
        this.$router.goBack()
    }


    // 提交解绑
    @action
    commit = () => {
        if (this.loading) return

        if (this.psw === '') {
            this.$globalFunc.toast('请输入密码')
            return
        }

        if (this.email === ''){
            this.$globalFunc.toast('请输入邮箱')
            return
        }

        if (this.verificationCode === '') {
            this.$globalFunc.toast('请输入邮箱验证码')
            return
        }
        console.log('params',{
            type: 'email',
            code: this.verificationCode,
            examinee: this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
            purpose: 'unbind'
        })
        this.$http.send("POST_COMMON_AUTH_UNBIND", {
            bind: this,
            timeout:3000,
            params: {
                type: 'email',
                code: this.verificationCode,
                examinee: this.email,
                password: this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
                purpose: 'unbind'
            },
            callBack: this.re_commit,
            errorHandler: this.error_commit,
            timeoutHandler:this.timeoutHandler
        })

        this.loading = true
    }

    // 超时
    timeoutHandler = ()=>{
        // this.$globalFunc.timeoutHandler
        this.loading = false
        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 提交返回
    @action
    re_commit = (data) => {
        console.log('解绑提交',data)
        typeof data === 'string' && (data = JSON.parse(data))
        this.loading = false
        if (!data) return

        if (data.errorCode) {

            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '登录密码错误'
                    break;
                case 2:
                    msg = '验证码错误/已过期'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }

            this.$globalFunc.toast(msg)

            return
        }


        this.$globalFunc.toast('解绑成功')

        // this.getAuthState()


        this.$store.commit('SET_GOOGLE_STATE', false)
        this.$router.popToTop()
    }
    // 提交出错
    @action
    error_commit = (err) => {
        console.warn("解绑邮箱出错！", err)
        this.loading = false

        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })

        err.message != "Network request failed" && this.$globalFunc.toast('系统异常，请稍后再试')

    }



    // 点击获取验证码
    @action
    getVerificationCode = () => {

        if (this.email === '') {
            this.$globalFunc.toast('请输入邮箱')
            return
        }

        if (!this.$globalFunc.testEmail(this.email)) {
            this.$globalFunc.toast('请输入正确的邮箱')
            return
        }


        let params = {
            "type": "email", "mun": this.email, "purpose": "unbind"
        }

        this.$http.send('POST_VERIFICATION_CODE', {
            bind: this,
            params: params,
            callBack: this.re_getVerificationCode,
            errorHandler: this.error_getVerificationCode
        })
    }

    // 点击验证码回复
    @action
    re_getVerificationCode = (data) => {
        console.log('获取邮箱验证码',data)
        typeof data === 'string' && (data = JSON.parse(data))
        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '邮箱错误'
                    break;
                case 2:
                    msg = '发送过于频繁'
                    break;
                case 3:
                    msg = '发送异常'
                    break;
                default:
                    msg = '发送异常'
            }

            this.$globalFunc.toast(msg)
            return
        }
        this.refs.CountDown.beginCountDown()

    }
    // 点击验证码出错
    @action
    error_getVerificationCode = (err) => {
        console.warn('绑定手机号获取手机验证码失败！', err)
        this.$globalFunc.toast('暂不可用，请稍后再试')
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, {backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader goBack={this.goBack}/>
                <Text style={[baseStyles.securityCenterTitle]}>解绑邮箱</Text>

                <View style={[baseStyles.paddingBox, InputStyle.containerBox,{flex:1,backgroundColor:StyleConfigs.bgColor,paddingTop:0}]}>
                    <Text  allowFontScaling={false} style={InputStyle.titleText}>登录密码</Text>
                    <View style={[InputStyle.inputDetailBox, InputStyle.inputBoxBottom]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[InputStyle.inputDetail]}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            placeholder={'输入你的登录密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            value={this.psw}
                            onChangeText={(text) => {
                                this.psw = text
                            }}
                            returnKeyType={'done'}
                        />
                    </View>
                    {/*邮箱*/}
                    <Text  allowFontScaling={false} style={InputStyle.titleText}>邮箱</Text>
                    <View style={[InputStyle.inputDetailBox, InputStyle.inputBoxBottom]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[InputStyle.inputDetail]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'输入你的邮箱'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            value={this.email}
                            onChangeText={(text) => {
                                this.email = text
                            }}
                            returnKeyType={'done'}
                            keyboardType={'email-address'}
                        />
                    </View>
                    {/*邮箱验证码*/}
                    <Text  allowFontScaling={false} style={InputStyle.titleText}>邮箱验证码</Text>
                    <View style={[InputStyle.inputDetailBox, InputStyle.spaceBetweenBox]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[InputStyle.inputVerificationDetail]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'输入验证码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            value={this.verificationCode}
                            onChangeText={(text) => {
                                this.verificationCode = text
                            }}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}
                        />
                        <CountDown
                            boxStyle={[InputStyle.inputVerificationTitleBox]}
                            textStyle={[InputStyle.inputVerificationTitle]}
                            time={60}
                            text={'获取验证码'}
                            onPress={this.getVerificationCode}
                            delay={true}
                            ref={'CountDown'}
                        />

                    </View>
                    <BaseButton
                        onPress={this.commit}
                        text={'确认'}
                        textStyle={[InputStyle.btnText]}
                        style={[InputStyle.btnbot]}
                    />

                </View>
                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
