/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/SettingPageModifyLoginPswStyle'

import BaseButton from './baseComponent/BaseButton'
import device from "../configs/device/device";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/


    // 原密码
    @observable
    oldPsw = ''

    // 原密码错误提示
    @observable
    oldPswWA = ''

    // 新密码
    @observable
    psw = ''

    // 新密码错误提示
    @observable
    pswWA = ''

    // 新密码确认
    @observable
    pswConfirm = ''

    // 新密码确认错误提示
    @observable
    pswConfirmWA = ''

    // 发送中
    @observable
    sending = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
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


    // 旧密码
    @action
    testOldPsw = () => {
        if (this.oldPsw === '') {
            this.oldPswWA = ''
            return false
        }
        this.oldPswWA = ''
        return true
    }

    // 表单验证密码
    @action
    testPsw = () => {
        if (this.pswConfirm !== '' || this.pswConfirm === this.psw) {
            this.testPswConfirm()
        }
        if (this.psw === '') {
            this.pswWA = ''
            return false
        }
        if (!this.$globalFunc.testPsw(this.psw)) {
            this.pswWA = '密码不符合规范，请输入8到16位数字、字母或特殊字符'
            return false
        }
        this.pswWA = ''
        return true
    }

    // 表单验证确认
    @action
    testPswConfirm = () => {
        if (this.psw !== this.pswConfirm) {
            this.pswConfirmWA = '密码输入不一致'
            return false
        }
        if (this.pswConfirm === '') {
            this.pswConfirmWA = ''
            return false
        }
        this.pswConfirmWA = ''
        return true
    }

    // 发送
    @action
    commit = () => {
        let canSend = true
        canSend = this.testPsw() && canSend
        canSend = this.testPswConfirm() && canSend

        console.warn("this is canSend", canSend)

        if (this.psw == '') {
            this.pswWA = '请输入新密码'
            canSend = false
        }
        if (this.pswConfirm == '') {
            this.pswConfirmWA = '请确认新密码'
            canSend = false
        }

        console.warn("this is canSend", canSend)
        if (!canSend) {
            return
        }

        let email = this.$store.state.authMessage.email


        this.$http.send('POST_CHANGE_PASSWORD', {
            bind: this,
            params: {
                oldPassword: this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.oldPsw).toString(),
                newPassword: this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
            },
            callBack: this.re_commit,
            errorHandler: this.error_commit,
            timeoutHandler:this.timeoutHandler

        })

        this.sending = true

    }

    // 超时
    timeoutHandler = ()=>{
        this.$globalFunc.timeoutHandler
        this.sending = false
    }
    // 发送回调
    re_commit = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        this.sending = false
        if (!data) return
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    this.oldPswWA = '请登录后修改密码'
                    break;
                case 2:
                    this.oldPswWA = '原密码输入错误'
                    break;
                default:
                    this.oldPswWA = '暂不可用，请稍后再试'
            }
            return
        }
        this.$router.goBack()
    }
    // 发送回调出错
    error_commit = () => {
        this.sending = false
        this.oldPswWA = '暂不可用，请稍后再试'
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, {backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader goBack={this.goBack}/>
                <Text style={[baseStyles.securityCenterTitle,{marginBottom:15}]}>修改登录密码</Text>
                <View style={[styles.inputBox,{flex:1,backgroundColor:StyleConfigs.bgColor}]}>

                    {/*请输入旧密码 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBox}>
                            <Text allowFontScaling={false} style={styles.inputTitle}>旧密码</Text>
                        </View>
                        <TextInput
                            allowFontScaling={false}
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            placeholder={'输入旧密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            onBlur={this.testOldPsw}
                            value={this.oldPsw}
                            onChangeText={(text) => {
                                this.oldPsw = text
                            }}

                        />
                    </View>
                    {/*请输入旧密码 end*/}

                    {/*旧密码错误提示 begin*/}
                    {
                        !!this.oldPswWA && (
                            <View
                                style={[styles.wrongAnsBox]}
                            >
                                <Text allowFontScaling={false} style={[baseStyles.textRed, styles.wrongAns]}>{this.oldPswWA}</Text>
                            </View>
                        )
                    }
                    {/*旧密码错误提示 begin*/}


                    {/*请输入新密码 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBox}>
                            <Text allowFontScaling={false} style={styles.inputTitle}>新密码</Text>
                        </View>
                        <TextInput
                            allowFontScaling={false}
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            placeholder={'输入新密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            onBlur={this.testPsw}
                            value={this.psw}
                            onChangeText={(text) => {
                                this.psw = text
                            }}
                        />
                    </View>
                    {/*请输入新密码 end*/}


                    {/*新密码错误提示 begin*/}
                    {
                        !!this.pswWA && (
                            <View
                                style={[styles.wrongAnsBox]}
                            >
                                <Text allowFontScaling={false} style={[baseStyles.textRed, styles.wrongAns]}>{this.pswWA}</Text>
                            </View>
                        )
                    }
                    {/*新密码错误提示 begin*/}


                    {/*请再次输入新密码 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBox}>
                            <Text allowFontScaling={false} style={styles.inputTitle}>确认新密码</Text>
                        </View>
                        <TextInput
                            allowFontScaling={false}
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            placeholder={'再次输入新密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            onBlur={this.testPswConfirm}
                            onChangeText={(text) => {
                                this.pswConfirm = text
                            }}
                        />
                    </View>
                    {/*请再次输入新密码 end*/}


                    {/*再次输入新密码错误提示 begin*/}
                    {
                        !!this.pswConfirmWA && (
                            <View
                                style={[styles.wrongAnsBox]}
                            >
                                <Text allowFontScaling={false} style={[baseStyles.textRed, styles.wrongAns]}>{this.pswConfirmWA}</Text>
                            </View>
                        )
                    }
                    {/*再次输入新密码错误提示 begin*/}


                    {/*确认修改 begin*/}
                    <BaseButton
                        onPress={this.commit}
                        text={'确认修改'}
                        style={[baseStyles.btnBlue, styles.btn]}
                        textStyle={[baseStyles.textWhite, styles.btnText]}

                    />
                    {/*确认修改 end*/}


                </View>

                {/*加载中*/}
                {
                    !!this.sending && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
