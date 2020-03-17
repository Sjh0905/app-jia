/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import styles from '../style/SignResetPswVerifyItemStyle'
import propTypes from 'prop-types'
import signBaseStyles from "../style/SignBaseStyle";
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import GoogleIcon from '../assets/SignResetPsw/google-icon.png'
import CodeIcon from '../assets/SignResetPsw/code-icon.png'
import BaseButton from './baseComponent/BaseButton'
import CountDown from './baseComponent/BaseCountDown'
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
    loading = false

    @observable
    userName = ''

    @observable
    psw = ''

    @observable
    GACode = ''

    @observable
    GACodeWA = ''

    // 验证码错误提示
    @observable
    verificationCodeWA = ''

    // 验证码
    @observable
    verificationCode = ''


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.userName = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.email
        this.psw = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.psw
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

    // 提交谷歌验证
    @action
    commitGa = () => {
        let canSend = true
        canSend = canSend && this.testGACode()

        if (this.GACode == '') {
            this.GACodeWA = '请输入验证码'
        }
        if (!canSend) return


        let params = {
            "purpose": "resetLoginPassword",
            "examinee": this.psw,
            "code": this.GACode,
            "type": 'ga'
        }

        this.$http.send('POST_COMMON_AUTH', {
            bind: this,
            timeout:3000,
            params: params,
            callBack: this.re_commit_ga,
            errorHandler: this.error_commit_ga,
            timeoutHandler:this.timeoutHandler

        })

        this.sending = true

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
        // this.$globalFunc.toast('暂不可用')
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 提交手机验证
    @action
    commitMobile = () => {
        let canSend = true
        canSend = canSend && this.testVerificationCode()

        if (this.verificationCode == '') {
            this.verificationCodeWA = '请输入验证码'
        }

        if (!canSend) return

        let params = {
            "purpose": "resetLoginPassword",
            "examinee": this.psw,
            "code": this.verificationCode,
            "type": 'mobile'
        }

        this.$http.send('POST_COMMON_AUTH', {
            bind: this,
            timeout:3000,
            params: params,
            callBack: this.re_commit_mobile,
            errorHandler: this.error_commit_mobile,
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
                    this.pswWA = '暂不可用'
                    break;
                default:
                    this.pswWA = '暂不可用，请稍后再试'
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
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
        // this.$globalFunc.toast('暂不可用')
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


    // 检测验证码
    testVerificationCode = () => {
        if (this.verificationCode === '') {
            this.verificationCodeWA = ''
            return false
        }
        this.verificationCodeWA = ''
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


    // 获取手机验证码
    @action
    getVerificationCode = () => {
        // 发送
        let params = {
            "type": 'mobile',
            "mun": this.userName,
            "purpose": "resetLoginPassword",
            "examinee": this.userName
        }

        this.$http.send('POST_VERIFICATION_CODE', {
            bind: this,
            timeout:3000,
            params: params,
            callBack: this.re_getVerificationCode,
            errorHandler: this.error_getVerificationCode,
            timeoutHandler:this.timeoutHandler
        })

    }

    // 获取手机验证码回调
    @action
    re_getVerificationCode = (data) => {
        if (typeof data === 'string') data = JSON.parse(data)
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.pswWA = '该用户未被绑定'
                    break;
                case 2:
                    this.pswWA = '发送频繁'
                    break;
                case 3:
                    this.pswWA = '发送异常'
                    break;
                case 4:
                    this.pswWA = '登录异常'
                    break;
                default:
            }
        }
    }

    // 获取手机验证码出错
    @action
    error_getVerificationCode = (err) => {
        console.warn('获取手机验证码出错', err)
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 渲染谷歌验证
    renderGoogle = () => {
        if (this.props.type != typeArr[0]) return null


        return (
            <View style={[signBaseStyles.inputContainer, styles.inputContainer,signBaseStyles.inputContainerPaddingTop]}>
                <View style={[signBaseStyles.inputItemBox]}>
                    <View style={[signBaseStyles.iconBox]}>
                        <Image source={GoogleIcon} style={[signBaseStyles.icon, styles.googleIcon]}/>
                    </View>
                    <TextInput
                        allowFontScaling={false}
                        style={[signBaseStyles.input]}
                        placeholder={'请输入谷歌验证码'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        underlineColorAndroid={'transparent'}
                        onBlur={this.testGACode}
                        onChangeText={(text) => {
                            this.GACode = text
                        }}
                    />
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
                    onPress={this.commitGa}
                    style={[baseStyles.btnBlue, styles.inputButton, signBaseStyles.button]}
                />
                {/*按钮 end*/}


            </View>
        )


    }


    // 渲染手机验证
    renderMobile = () => {

        if (this.props.type != typeArr[1]) return null


        return (
            <View style={[signBaseStyles.inputContainer, styles.inputContainer,signBaseStyles.inputContainerPaddingTop]}>
                <View style={[signBaseStyles.inputItemBox]}>
                    <View style={[signBaseStyles.inputLeftBox]}>
                        <View style={[signBaseStyles.inputLeftIconBox]}>
                            <Image source={CodeIcon} style={[signBaseStyles.icon, styles.codeIcon]}/>
                        </View>
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
                        />
                    </View>
                    {/*获取验证码 begin*/}
                    <CountDown
                        onPress={this.getVerificationCode}
                        boxStyle={[signBaseStyles.inputRightBox]}
                        textStyle={[signBaseStyles.inputRightText]}
                        text={'获取验证码'}
                        time={60}
                    />

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
                    text={'确  认'}
                    textStyle={[signBaseStyles.buttonText]}
                    onPress={this.commitMobile}
                    style={[baseStyles.btnBlue, styles.inputButton, signBaseStyles.button]}
                />
                {/*按钮 end*/}


            </View>
        )


    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.bgColor]}>
                {
                    this.renderMobile()
                }
                {
                    this.renderGoogle()
                }
            </View>
        )
    }
}
