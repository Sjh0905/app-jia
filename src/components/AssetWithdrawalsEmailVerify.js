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
import styles from '../style/AssetWithdrawalsEmailVerifyStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import CountDown from './baseComponent/BaseCountDown'
import BaseButton from './baseComponent/BaseButton'
import Toast from "react-native-root-toast";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    verificationCode = ''

    @observable
    amount = ''

    @observable
    realAmount = ''

    @observable
    description = ''

    @observable
    address = ''

    @observable
    currency = ''


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()


    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.amount = this.$params.amount
        this.currency = this.$params.currency
        this.address = this.$params.address
        this.description = this.$params.description
        this.realAmount = this.$params.realAmount
    }

    // 挂载后
    componentDidMount() {
        this.getVerificationCode()
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

    // 获取邮箱验证码
    @action
    getVerificationCode = (() => {
        let last = 0;
        return (item) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$http.send('POST_VERIFICATION_CODE', {
                bind: this,
                timeout:3000,
                params: {
                    type: 'email',
                    purpose: 'withdraw',
                    withdrawTime: this.$globalFunc.formatDateUitl(this.$store.state.serverTime, 'YYYY-MM-DD hh:mm:ss'),
                    currency: this.currency,
                    amount: parseFloat(this.amount),
                },
                callBack: this.re_getEmailVerification,
                errorHandler: this.error_getEmailVerification,
                timeoutHandler:this.timeoutHandler
            })
            this.refs.CountDown.beginCountDown()
        }
    })()


    // 获取邮箱验证码
    @action
    re_getEmailVerification = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '用户未登录'
                    break;
                case 2:
                    msg = '过于频繁'
                    break;
                case 3:
                    msg = '发送异常'
                    break;
                case 4:
                    msg = '用户无权限'
                    break;
                case 5:
                    msg = '修改登录密码未超过24h'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }
            this.$globalFunc.toast(msg)

        }

    }

    // 获取邮箱验证码出错
    @action
    error_getEmailVerification = (err) => {
        console.warn('获取邮箱验证码出错', err)
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 提交
    @action
    commit = (() => {
        let last = 0;
        return () => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if (this.verificationCode === '') {

                this.$globalFunc.toast('请填写邮箱验证码')
                return
            }
            this.$http.send('POST_COMMON_AUTH', {
                bind: this,
                timeout:5000,
                params: {
                    type: 'email',
                    purpose: 'withdraw',
                    code: this.verificationCode,
                },
                callBack: this.re_commitEmailVerification,
                errorHandler: this.error_commitEmailVerification,
                timeoutHandler:this.timeoutHandler
            })
            this.loading = true
        }
    })()

    // 超时
    timeoutHandler = ()=>{
        // this.$globalFunc.timeoutHandler
        this.loading = false
        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 提交邮箱验证成功
    @action
    re_commitEmailVerification = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        this.loading = false
        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '用户未登录'
                    break;
                case 2:
                    msg = '验证码错误/过期'
                    break;
                case 3:
                    msg = '暂不可用，请稍后再试'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }

            this.$globalFunc.toast(msg)

            return
        }
        this.$router.push('WithdrawalsCodeVerify', {
            amount: this.amount,
            description: this.description,
            address: this.address,
            currency: this.currency,
            realAmount: this.realAmount
        })
    }

    // 提交邮箱验证失败
    @action
    error_commitEmailVerification = function (err) {
        this.loading = false

        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })

        err.message != "Network request failed" && this.$globalFunc.toast('暂不可用，请稍后再试')

    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.bgColor,{paddingTop:getDeviceTop()}]}>
                <NavHeader headerTitle={'提现确认'} goBack={this.goBack}/>

                <View style={[styles.paddingBox, styles.container]}>
                    <Text allowFontScaling={false} style={[styles.verifyTitle]}>已向您的邮箱发送验证码，请查收</Text>
                    <View style={[styles.inputBox]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[styles.input,{color:StyleConfigs.txt131F30}]}
                            placeholder={'邮箱验证码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            value={this.verificationCode}
                            onChangeText={(text) => {
                                this.verificationCode = text
                            }}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}
                        />
                        <CountDown
                            onPress={this.getVerificationCode}
                            text={'获取'}
                            textStyle={[baseStyles.textBlue, styles.countDownText]}
                            boxStyle={[styles.countDownBox]}
                            time={60}
                            ref={'CountDown'}
                            delay={true}
                        />
                    </View>

                    <BaseButton
                        onPress={this.commit}
                        textStyle={[baseStyles.textWhite, styles.btnText]}
                        text={'确定'}
                        style={[baseStyles.btnBlue, styles.btn]}
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
