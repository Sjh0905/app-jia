/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Clipboard, Image, Linking, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/MineBindGoogleStyle'
import BaseButton from './baseComponent/BaseButton'


import AppStoreIcon from '../assets/MineBindGoogle/bind-google-app-store-icon.png'
// import GooglePlayIcon from '../assets/MineBindGoogle/bind-google-google-play-icon.png'
import YingYongBaoIcon from '../assets/MineBindGoogle/bind-google-yingyongbao-icon.png'

import StyleConfigs from '../style/styleConfigs/StyleConfigs'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true

    // 密钥
    @observable
    secretKey = ''

    // 二维码地址
    @observable
    uri = ''

    // 是否获取认证状态成功
    @observable
    getAuthReady = false

    // 是否获取谷歌验证成功
    @observable
    getGAReady = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        // 获取认证状态
        this.getAuthState()
        // 获取谷歌验证
        this.getGoogleAuthMsg()

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
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || data.errorCode) {
            return
        }

        this.$store.commit('SET_AUTH_STATE', data.dataMap)
        if (data.dataMap.ga) {
            this.$router.goBack()
        }
        this.getAuthReady = true
        this.loading = !(this.getAuthReady && this.getGAReady)
    }

    // 判断验证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
        this.$router.goBack()
    }

    // 获取谷歌身份验证
    @action
    getGoogleAuthMsg = () => {
        this.$http.send('POST_VERIFICATION_CODE',
            {
                bind: this,
                params: {
                    type: 'ga',
                    mun: this.$store.state.authMessage.email,
                    purpose: 'bind'
                },
                callBack: this.re_getGoogleAuthMsg,
                errorHandler: this.error_getGoogleAuthMsg,
            })
    }
    // 获取谷歌身份验证回调
    @action
    re_getGoogleAuthMsg = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        console.warn('返回谷歌验证url data', data)
        if (!data || data.errorCode) {
            return
        }


        this.uri = data.dataMap.uri
        this.secretKey = data.dataMap.secretKey
        this.getGAReady = true
        this.loading = !(this.getAuthReady && this.getGAReady)

    }
    // 获取谷歌身份验证出错
    @action
    error_getGoogleAuthMsg = (err) => {
        console.warn("获取验证状态出错！", err)
        this.$router.goBack()
    }


    // 从苹果APP下载
    @action
    downloadAppStore = () => {
        let url = 'https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8'
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url)

            } else {
                return Linking.openURL(url)
            }
        }).catch(
            // this.$globalFunc.toast('打开出错')
        )
    }

    // 从谷歌商店下载
    @action
    downloadGooglePlay = () => {

    }

    // 从应用宝下载
    @action
    downloadYingYongBao = () => {
        let url = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.google.android.apps.authenticator2'
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url)

            } else {
                return Linking.openURL(url)
            }
        }).catch(
            // this.$globalFunc.toast('打开出错')
        )
    }


    // 点击复制
    @action
    copy = () => {
        Clipboard.setString(this.secretKey)

        this.$globalFunc.toast('复制成功')

    }

    // 下一步
    @action
    nextStep = () => {
        this.$router.push('BindGoogleStepTwo')
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.bgColor,styles.container2]}>
                <NavHeader goBack={this.goBack}/>
                <Text style={[baseStyles.securityCenterTitle]}>绑定谷歌</Text>

                <View style={[baseStyles.paddingBox, styles.containerBox,{backgroundColor:StyleConfigs.bgColor, flex:1}]}>
                    {/*第一步 begin*/}
                    <View style={styles.stepHeaderBox}>
                        {/*<Image source={StepOneIcon} style={styles.stepIcon}/>*/}
                        <Text  allowFontScaling={false} style={styles.stepHeaderText}>1.下载并安装</Text>
                    </View>
                    {/*第一步 end*/}

                    {/*安装图标 begin*/}
                    <View style={styles.downloadBox}>

                        {/*app store*/}
                        {PlatformOS == 'ios' && <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.downloadAppStore}
                        >
                            <View style={styles.downloadItem}>
                                <Image source={AppStoreIcon} style={styles.downloadIcon}/>
                                <Text  allowFontScaling={false} style={[baseStyles.textWhite, styles.downloadText]}>App Store</Text>
                            </View>
                        </TouchableOpacity>
                        }

                        {/*google play*/}
                        {/*{PlatformOS == 'android' && <TouchableOpacity*/}
                            {/*activeOpacity={1}*/}
                            {/*onPress={this.downloadGooglePlay}*/}

                            {/*>*/}
                            {/*<View style={styles.downloadItem}>*/}
                            {/*<Image source={GooglePlayIcon} style={styles.downloadIcon}/>*/}
                            {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.downloadText]}>Google Play</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>}*/}

                        {/*应用宝*/}
                        {PlatformOS == 'android' && <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.downloadYingYongBao}

                        >
                        <View style={styles.downloadItem}>
                        <Image source={YingYongBaoIcon} style={styles.downloadIcon} resizeMode={'contain'}/>
                        <Text  allowFontScaling={false} style={[baseStyles.textWhite, styles.downloadText,{marginRight:20}]}>应用宝</Text>
                        </View>
                        </TouchableOpacity>}

                    </View>
                    {/*安装图标 end*/}

                    {/*第二步 begin*/}
                    <View style={styles.stepHeaderBox}>
                        {/*<Image source={StepTwoIcon} style={styles.stepIcon}/>*/}
                        <Text  allowFontScaling={false} style={styles.stepHeaderText}>2.谷歌身份验证</Text>
                    </View>
                    {/*第二步 end*/}

                    <View style={styles.codeContainer}>
                        {/*提示 begin*/}
                        {/*<View style={styles.promptBox}>*/}
                            {/*<Text  allowFontScaling={false} style={[styles.promptText, baseStyles.textColor]}>*/}
                                {/*如果你的手机丢失、被盗或密钥被删除，你将需要此密钥找回你的谷歌二次验证。*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                        {/*提示 end*/}

                        {/*密钥 begin*/}
                        <View style={styles.codeDetailContainer}>
                            {/*<Text  allowFontScaling={false} style={[styles.codeTitle, baseStyles.textColor]}>密钥</Text>*/}
                            <View style={styles.codeDetailBox}>
                                <TextInput
                                    allowFontScaling={false}
                                    style={[baseStyles.textColor, styles.codeInput]}
                                    value={this.secretKey}
                                    editable={false}
                                    underlineColorAndroid={'transparent'}
                                />
                                <BaseButton
                                    onPress={this.copy}
                                    text={'复制'}
                                    textStyle={[baseStyles.textBlue, styles.copyText]}
                                    style={[baseStyles.btnBlue, styles.copyBtn]}
                                />
                            </View>
                            <Text  allowFontScaling={false} style={[styles.codePrompt, baseStyles.textColor]}>打开谷歌验证器-添加手动输入验证码-输入密钥</Text>

                        </View>
                        {/*密钥 end*/}
                    </View>

                    <BaseButton
                        onPress={this.nextStep}
                        style={[baseStyles.btnBlue, styles.nextBtn]}
                        text={'下一步'}
                        textStyle={[baseStyles.textWhite, styles.nextBtnText]}
                    />


                </View>


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
