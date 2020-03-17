
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/SecurityCenterStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import Modal from 'react-native-modal'

import SettingIcon from '../assets/MinePage/setting-icon.png'

import MyRecommendIcon from '../assets/MinePage/my-recommend-icon.png'
import IntoIcon from '../assets/MinePage/into-icon.png'
import unstate from '../assets/MinePage/security-center-unstate.png'
import CardIcon from '../assets/MinePage/card-icon.png'
import PhoneIcon from '../assets/MinePage/phone-icon.png'
import EmailIcon from '../assets/MinePage/email-icon.png'
import GoogleIcon from '../assets/MinePage/google-icon.png'
import bankcard from '../assets/C2cAssets/bankcard.png'
import HeaderIcon from '../assets/MinePage/header-icon.png'
import GestureIconOff from '../assets/MinePage/gesture-off.png';

import BaseButton from './baseComponent/BaseButton'
import {Switch} from 'react-native-switch'
import device from "../configs/device/device";
import GetGeetestAndroid from "../../native/GetGeetest";
import env from "../configs/environmentConfigs/env";
import CertificationResult from "./CertificationResult";
import Toast from "react-native-root-toast";

@observer
export default class SecurityCenter extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    loading = true

    @observable
    userName = ''

    @observable
    UID = ''

    @observable
    BDBInfo = true

    @observable
    BDBInfoAnimating = false

    @observable
    authReady = false

    @observable
    BDBInfoReady = false

    @observable
    verifyModalShow = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

        // console.warn("我的组件开始挂载")


    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        // 获取认证状态
        this.getAuthState()

        // 获取BDB抵扣
        // this.getBDBInfo()

        this.listen({key:'RE_FEE_BDB_STATE',func:this.getBDBInfo});

        this.$event.listen({bind: this, key: 'NEW_LOGIN', func: this.getAuthState})
    }


    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    @action
    goBack = () => {
        this.$router.goBack()
    }

    // 去设置
    @action
    goToSetting = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('Setting')
        }

    })()

    // 去收益
    @action
    goIncome = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('AdditionalRewards')
        }
    })()


    // 渲染设置
    @action
    renderSet = () => {
        return (
            <TouchableOpacity
                onPress={this.goToSetting}
            >
                <Image
                    style={styles.settingIcon}
                    source={SettingIcon}
                />
            </TouchableOpacity>
        )
    }

    // 登出
    @action
    logout = () => {
        this.$http.send('LOGOFF', {
            bind: this,
            callBack: this.re_logout,
            errorHandler: this.error_logout
        })
    }

    // 登出回调
    @action
    re_logout = (data) => {
        typeof data == 'string' || (data = JSON.parse(data))

        console.warn('data', data)

        this.$store.commit('SET_AUTH_MESSAGE', {})

        this.notify({key: 'CHANGE_TAB'}, 0);
        this.notify({key: 'SET_TAB_INDEX'},0);


    }

    // 登出出错
    @action
    error_logout = (err) => {

    }

    // BDB抵扣开关
    @action
    BDBFeeChange = (value) => {
        if (this.BDBInfoAnimating) return
        this.BDBInfoAnimating = true
        this.BDBInfo = value
        this.$http.send('CHANGE_FEE_BDB', {
            bind: this,
            params: {
                'feebdb': this.BDBInfo ? 'yes' : 'no'
            },
            callBack: this.re_clickToggle,
            errorHandler: this.error_clickToggle
        })
    }

    // 点击切换手续费折扣
    @action
    re_clickToggle = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        this.BDBInfoAnimating = false

        this.$store.commit('SET_FEE_BDB_STATE',this.$store.state.feeBdbState === 1?0:1);
        console.log('feeBdbState改变后为',this.$store.state.feeBdbState);



    }

    // 点击切换手续费折扣失败
    @action
    error_clickToggle = (err) => {
        console.warn('点击切换手续费折扣失败', err)
        this.BDBInfo = !this.BDBInfo
        this.BDBInfoAnimating = false
    }


    // 获取手机认证 谷歌认证
    @action
    getAuthState = () => {
        this.$http.send('GET_AUTH_STATE', {
            bind: this,
            callBack: this.re_getAuthState,
            errorHandler: this.error_getAuthState
        })
    }

    // 获取认证状态回调
    @action
    re_getAuthState = (data) => {
        console.log('data-----',data)
        typeof data === 'string' && (data = JSON.parse(data))
        // console.warn("this is data",data)

        if (data.errorCode) {

            return
        }

        this.$store.commit('SET_AUTH_STATE', data.dataMap)
        this.authReady = true
        this.loading = !(this.authReady)

    }

    // 获取认证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn('获取认证状态', err)
        this.authReady = true
        this.loading = !(this.authReady)
    }


    // // BDB是否抵扣
    // @action
    // getBDBInfo = () => {
    //     this.$http.send('FIND_FEE_BDB_INFO', {
    //         bind: this,
    //         callBack: this.re_getBDBInfo,
    //         errorHandler: this.error_getBDBInfo
    //     })
    // }

    // // BDB是否抵扣回调
    // @action
    // re_getBDBInfo = (data) => {
    //     typeof (data) === 'string' && (data = JSON.parse(data))
    //     if (!data) return
    //     console.warn('this is bdb', data)
    //     if (data.errorCode) {
    //
    //         return
    //     }
    //     if (data.dataMap.BDBFEE === 'yes') {
    //         this.BDBInfo = true
    //         this.$store.commit('SET_FEE_BDB_STATE',1);
    //         console.log('feeBdbState初始化为',this.$store.state.feeBdbState);
    //
    //     }
    //     if (data.dataMap.BDBFEE === 'no') {
    //         this.BDBInfo = false
    //         this.$store.commit('SET_FEE_BDB_STATE',0);
    //         console.log('feeBdbState初始化为',this.$store.state.feeBdbState);
    //
    //     }
    //     // BDB状态
    //     this.BDBReady = true
    //     this.loading = !(this.authReady)
    // }

    // BDB是否抵扣出错
    // @action
    // error_getBDBInfo = (err) => {
    //     console.warn('BDB抵扣出错', err)
    //     this.BDBReady = true
    //     this.loading = !(this.authReady)
    // }


    // 打开去认证的模态框
    @action
    openVerifyModal = () => {
        this.verifyModalShow = true

    }

    // 关闭去认证的模态框
    @action
    closeVerifyModal = () => {
        this.verifyModalShow = false
    }


    // 跳到实名认证
    @action
    goToAuth = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            // 这里要根据获取到的步骤情况跳转到身份证 或者 身份证反面 或者 视频验证 这里先按照身份证计算
            if(this.$store.state.getIdentityInfo.identityAuthState === '5'){
                Toast.show('请耐心等待PC端认证反馈', {
                    duration: 3000,
                    position: Toast.positions.CENTER
                })
                return;
            }
            if(!this.$store.state.getIdentityInfo.identityAuth){
                this.$router.push(
                    this.$store.state.getIdentityInfo.cerificatePage
                    ,{
                        cardType: this.$store.state.getIdentityInfo.cardType,
                        from: 'Home'
                    });
                return;
            }
        }
    })()

    @action
    goToEmail = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if (!this.$store.state.authState.email) {
                // this.openVerifyModal()
                this.$router.push('BindEmail')
                return
            }
            this.$router.push('ReleaseEmail')
        }
    })()

    // 跳到手机认证
    @action
    goToMobile = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if (!this.$store.state.authState.sms) {
                // this.openVerifyModal()
                this.$router.push('BindMobile')
                return
            }
            this.$router.push('ReleaseMobile')
        }
    })()


    // 跳到谷歌认证
    @action
    goToGoogle = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if (!this.$store.state.authState.ga) {
                // this.openVerifyModal()
                this.$router.push('BindGoogle')
                return
            }
            this.$router.push('ReleaseGoogle')
        }
    })()

    // 跳到我的推荐
    @action
    gotoRecommend = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('MyRecommend')
        }
    })()

    //跳转到C2C支付设置
    goToBindBank = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('PaymentSet')
        }
    })()

    goWebView = (()=>{
        let last = 0;
        return (params={
            url: '',
            loading: false,
            navHide: false,
            title: ''
        }) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if(!params.url){
                return;
            }
            params.url.length && (params.url.indexOf('http') === -1) && (params.url = env.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
            return this.$router.push('WebPage',params)
        }
    })()


    @action
    pressButton = ()=>{
        this.goWebView({
            url: 'static/mobileBTActivityHomePage'
        })
    }

    // 跳转到修改密码
    @action
    goToModifyLoginPsw = () => {
        this.$router.push('ModifyLoginPsw')
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        console.log('authMessage',this.$store.state.authMessage)
        let UID = this.$store.state.authMessage.userId || ''

        let userName;
        if(this.$store.state.authMessage.province === 'mobile'){
            userName = this.$store.state.authMessage.mobile.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') || '';
        }
        if(this.$store.state.authMessage.province === 'email'){
            userName = this.$store.state.authMessage.email || '';
        }

        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>
                <NavHeader
                    goBack={this.goBack}
                    // headerTitle={'安全中心'}
                />
                <Text style={baseStyles.securityCenterTitle}>安全中心</Text>
                <View style={[styles.container, baseStyles.bgColor]}>

                    {/*各类 begin*/}
                    <View style={{backgroundColor:StyleConfigs.bgColor}}>
                        {/*</TouchableOpacity>*/}

                        {/*邮箱认证*/}
                        {
                            this.$store.state.authMessage.province === 'mobile' && <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToEmail}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        {/*<View style={styles.iconBox}>*/}

                                            {/*<Image source={EmailIcon} style={[styles.emailIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>邮箱认证</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        {
                                            (this.$store.state.authState && this.$store.state.authState.email) ||
                                            <Image source={unstate} style={styles.unstateIcon}/>
                                        }
                                        {
                                            this.$store.state.authState && this.$store.state.authState.email &&
                                            <Text  allowFontScaling={false}
                                                   style={[baseStyles.textColor, styles.verifyText]}>{'已认证'}</Text>
                                            ||
                                            <Text  allowFontScaling={false}
                                                   style={[baseStyles.textRed, styles.verifyText]}>{'未认证'}</Text>
                                        }
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        }

                        {/*手机认证*/}
                        {
                            this.$store.state.authMessage.province === 'email' && <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToMobile}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        {/*<View style={styles.iconBox}>*/}

                                            {/*<Image source={PhoneIcon} style={[styles.phoneIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>手机认证</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        {
                                            (this.$store.state.authState && this.$store.state.authState.sms) ||
                                            <Image source={unstate} style={styles.unstateIcon}/>
                                        }
                                        {this.$store.state.authState && this.$store.state.authState.sms
                                            &&
                                        <Text  allowFontScaling={false}
                                               style={[baseStyles.textColor, styles.verifyText]}>{'已认证'}</Text>
                                            ||
                                        <Text  allowFontScaling={false}
                                               style={[baseStyles.textRed, styles.verifyText]}>{'未认证'}</Text>
                                        }
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        }

                        {/*谷歌认证*/}
                        <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToGoogle}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        {/*<View style={styles.iconBox}>*/}

                                            {/*<Image source={GoogleIcon} style={[styles.googleIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>谷歌认证</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        {
                                            (this.$store.state.authState && this.$store.state.authState.ga) ||
                                            <Image source={unstate} style={styles.unstateIcon}/>
                                        }

                                        {this.$store.state.authState && this.$store.state.authState.ga
                                        &&
                                        <Text  allowFontScaling={false}
                                               style={[baseStyles.textColor, styles.verifyText]}>{'已认证'}</Text>
                                        ||
                                        <Text  allowFontScaling={false}
                                               style={[baseStyles.textRed, styles.verifyText]}>{'未认证'}</Text>
                                        }
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/*修改密码 begin*/}
                        <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToModifyLoginPsw}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={styles.itemLeft}>
                                        <Text allowFontScaling={false} style={[styles.iconText, baseStyles.textColor]}>修改密码</Text>
                                    </View>
                                    <View style={styles.itemRight}>
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/*修改密码 end*/}


                    </View>
                    {/*各类 end*/}
                </View>


                {/*去认证模态框 begin*/}

                {/*去认证模态框 end*/}


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
