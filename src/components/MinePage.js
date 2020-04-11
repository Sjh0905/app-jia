/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/MinePageStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import Modal from 'react-native-modal'

import SettingIcon from '../assets/MinePage/setting-icon.png'
import InviteRebate from '../assets/MinePage/invite-rebate.png'
import SecurityCenter from '../assets/MinePage/security-center.png'
import HelpCenter from '../assets/MinePage/help-center.png'
import ContactCustomerService from '../assets/MinePage/contact-customer-service.png'

import MyRecommendIcon from '../assets/MinePage/my-recommend-icon.png'
import IntoIcon from '../assets/MinePage/into-icon.png'
import CardIcon from '../assets/MinePage/card-icon.png'
import PhoneIcon from '../assets/MinePage/phone-icon.png'
import EmailIcon from '../assets/MinePage/email-icon.png'
import GoogleIcon from '../assets/MinePage/google-icon.png'
import bankcard from '../assets/C2cAssets/bankcard.png'
import HeaderIcon from '../assets/MinePage/header-icon.png'
import HeaderMemberIcon from '../assets/MinePage/header-member-icon.png'
import GestureIconOff from '../assets/MinePage/gesture-off.png';

import BaseButton from './baseComponent/BaseButton'
import {Switch} from 'react-native-switch'
import device from "../configs/device/device";
import GetGeetestAndroid from "../../native/GetGeetest";
import env from "../configs/environmentConfigs/env";
import CertificationResult from "./CertificationResult";
import Toast from "react-native-root-toast";
import GestureUnlock from "./GestureUnlock";

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @computed get userId() {
        return this.$store.state.authMessage.userId
    }

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

    @observable
    modalMsg = ''
    @observable
    modalMsg2 = ''

    @observable
    isMember = false

    @observable
    memberExpiresTime = 0


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

        // 获取会员状态
        this.getCheckMember()

        // 获取BDB抵扣
        // this.getBDBInfo()

        // this.listen({key:'RE_FEE_BDB_STATE',func:this.getBDBInfo});

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
            // this.$router.push('Setting')
            this.$router.push('GestureUnlock')
        }

    })()

    // 去收益
    @action
    goIncome = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            // this.$router.push('AdditionalRewards')
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
    //
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
    //     this.loading = !(this.BDBReady && this.authReady)
    // }
    //
    // // BDB是否抵扣出错
    // @action
    // error_getBDBInfo = (err) => {
    //     console.warn('BDB抵扣出错', err)
    //     this.BDBReady = true
    //     this.loading = !(this.BDBReady && this.authReady)
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


    //是否是会员get (query:{})
    getCheckMember= function () {

        this.$http.send('GET_CHECK_MEMBER', {
            bind: this,
            urlFragment: this.userId,
            // query:{
            //   gname: this.gname
            // },
            callBack: this.re_getCheck,
            errorHandler: this.error_getCheck
        })
    }
    re_getCheck = function (data) {
        //检测data数据是JSON字符串转换JS字符串
        typeof data === 'string' && (data = JSON.parse(data))

        // this.expires = data.data.expires
        this.memberExpiresTime = data.data.expires_timestamp
        this.isMember = data.data.flag
        console.log('是否是会员get-----',this.data)

    }
    error_getCheck = function (err) {
        console.log("是否是会员get .err=====",err)
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
                Toast.show('请耐心等待实名认证反馈', {
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

            /*let status = this.$store.state.getIdentityInfo.identityAuthState;
            let identityAuthStateStr = ['未认证','被驳回','已通过','未认证','已失效','审核中'][status];

            if (status == 2 || status == 5 || status == 6) {
                this.modalMsg = '实名认证' + identityAuthStateStr;
                status != 2 && (this.modalMsg2 = '请耐心等待')
                status == 2 && (this.modalMsg2 = '')
                this.openVerifyModal()
                return
            }

            this.$router.push('RealNameCertification')*/
        }
    })()

    // 跳到实名认证
    @action
    goToAuth2 = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();


            // 这里要根据获取到的步骤情况跳转到身份证 或者 身份证反面 或者 视频验证 这里先按照身份证计算
            if(this.$store.state.getIdentityInfo.identityAuthState === '5'){
                Toast.show('请耐心等待实名认证反馈', {
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


            let status = this.$store.state.getIdentityInfo.identityAuthState;
            // let identityAuthStateStr = ['未认证','被驳回','已通过','未认证','已失效','审核中'][status];
            let identityAuthStateStr = ['未认证','被驳回','已通过','未认证','已失效','审核中','审核中'][status];


            if (status == 2 || status == 5 || status == 6) {
                this.modalMsg = '实名认证' + identityAuthStateStr;
                status != 2 && (this.modalMsg2 = '请耐心等待')
                status == 2 && (this.modalMsg2 = '')
                this.openVerifyModal()
                return
            }

            this.$router.push('RealNameCertification')
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
        },type) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if(!params.url){
                return;
            }
            params.url.length && (params.url.indexOf('http') === -1) && (params.url = env.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
            if(!type)return this.$router.push('WebPage',params)
            return this.$router.push('CustomerServiceWebPage',params)
        }
    })()

    @computed
    get FEE_DIVIDEND() {
        return this.$globalFunc.accFixed(this.$store.state.feeDividend || 0);
    }

    @action
    pressButton = ()=>{
        this.goWebView({
            url: 'static/mobileBTActivityHomePage'
        })
    }

    //邀请返佣
    @action
    inviteRebate = ()=>{
        this.$router.push('Poster')

        // this.goWebView({
        //     url:'https://9bull.zendesk.com/hc/zh-tw/articles/360027261734',title:'邀请返佣'
        // })
    }
    //安全中心
    @action
    goToSecurityCenter = ()=>{
        this.$router.push('SecurityCenter')
    }
    //帮助中心
    @action
    goToHelpCenter = ()=>{
        // this.goWebView({
        //     url: 'static/mobileBTActivityHomePage'
        // })
    }
    //客服中心
    @action
    contactCustomerService = ()=>{
        this.goWebView({
            url: 'https://customerservice8872.zendesk.com/hc/zh-cn/requests/new',
            title:'客服中心'
        },'customerService')
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        console.log('authMessage',this.$store.state.authMessage)
        let UID = this.$store.state.authMessage.uuid || this.$store.state.authMessage.userId || ''

        let userName;
        if(this.$store.state.authMessage.province === 'mobile'){
            userName = this.$store.state.authMessage.mobile.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') || '';
        }
        if(this.$store.state.authMessage.province === 'email'){
            userName = this.$store.state.authMessage.email || '';
        }
        let identityAuthState = this.$store.state.getIdentityInfo.identityAuthState;
        // let identityAuthStateStr = ['未认证','未认证','已通过','未认证','已过期','审核中'][identityAuthState];//face++状态
        // 后台:0未审核 1被驳回 2已通过 3人工失效 4系统失效
        // 最新的状态2019-11-04，APP只调用了/auth/getIdentityInfo，所以 0 或 3 都是未认证状态
        let identityAuthStateStr = ['未认证','被驳回','已通过','未认证','已失效','审核中','审核中'][identityAuthState];

        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>
                <NavHeader
                    goBack={this.$params && this.$params.goBack && this.goBack || null}
                    headerTitle={'我的'}
                    // headerRight={this.renderSet()}
                />

                <View style={[styles.container, baseStyles.bgColor]}>

                    {/*头像部分 begin*/}
                    <View style={[styles.headerIconBox, styles.boxPadding]}>
                        {
                            this.isMember &&
                            <Image source={HeaderMemberIcon} style={styles.headerIcon}/>
                            ||
                            <Image source={HeaderIcon} style={styles.headerIcon}/>
                        }
                        <View style={styles.userNameBox}>
                            <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.headerIconText]}>{userName}</Text>
                            <Text  allowFontScaling={false} style={[styles.headerUIDText,baseStyles.text9FA7B8 ]}>UID:{UID}</Text>
                        </View>
                    </View>
                    {/*头像部分 end*/}

                    {/*会员卡 begin*/}
                    {this.isMember &&
                        <View style={[styles.headerIconBox, styles.boxPadding, styles.memberBox]}>
                            <Text  allowFontScaling={false} style={[styles.memberTitle]}>我的2020会员</Text>
                            <Text  allowFontScaling={false} style={[styles.memberExpiresTime ]}>{this.$globalFunc.formatDateUitl(this.memberExpiresTime, 'YYYY-MM-DD')}到期</Text>
                        </View>
                        ||
                        null
                    }
                    {/*会员卡 end*/}


                    {/*线条*/}
                    <View style={styles.headerLine}/>

                    {/*使用支付交易手续费 begin*/}
                    {/*<View style={[styles.BDBFeeBox, styles.boxPadding, {*/}
                        {/*backgroundColor: '#141C25'*/}
                    {/*}]}>*/}
                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.BDBFeeText]}>使用支付交易手续费（）     </Text>*/}
                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.BDBFeeText]}>使用挖矿获得额外{this.$store.state.reward * 100}%奖励</Text>*/}
                        {/*<TouchableOpacity*/}
                            {/*onPress={this.goIncome}*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*style={[styles.itemRight]}>*/}
                            {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.intoText]}>查看收益</Text>*/}
                            {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<Switch*/}
                            {/*value={this.BDBInfo}*/}
                            {/*onValueChange={this.BDBFeeChange}*/}
                            {/*circleBorderWidth={0}*/}
                            {/*backgroundActive={StyleConfigs.btnBlue}*/}
                            {/*circleSize={20}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    {/*使用支付交易手续费 end*/}

                    {/*各类 begin*/}
                    <View style={{backgroundColor:StyleConfigs.bgColor}}>
                        {/*挖矿收益*/}
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*onPress={this.pressButton}*/}
                        {/*>*/}
                            {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                {/*<View style={[styles.itemLeft]}>*/}
                                    {/*<View style={styles.iconBox}>*/}
                                        {/*<Image source={null} style={[styles.chanziIcon, styles.icon]}/>*/}
                                    {/*</View>*/}
                                    {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>挖矿收益</Text>*/}
                                {/*</View>*/}
                                {/*<View style={[styles.itemRight]}>*/}
                                    {/*<View style={styles.itemRightColumn}>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.smallerText]}>今日平台交易手续费折合:</Text>*/}
                                        {/*<View style={styles.splitSmall}/>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.smallText,styles.opacity1]}>{this.FEE_DIVIDEND} USDT</Text>*/}
                                    {/*</View>*/}
                                    {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        {/*我的推荐*/}
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*onPress={this.gotoRecommend}*/}
                        {/*>*/}
                            {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                {/*<View style={[styles.itemLeft]}>*/}
                                    {/*<View style={styles.iconBox}>*/}
                                        {/*<Image source={MyRecommendIcon} style={[styles.myRecommendIcon, styles.icon]}/>*/}
                                    {/*</View>*/}
                                    {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>我的推荐</Text>*/}
                                {/*</View>*/}
                                {/*<View style={[styles.itemRight]}>*/}
                                    {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.intoText]}>UID:{UID}</Text>*/}
                                    {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}

                        {/*实名认证*/}
                        {/*<View>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={this.goToAuth}*/}
                            {/*>*/}
                                {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                    {/*<View style={[styles.itemLeft]}>*/}
                                        {/*<View style={styles.iconBox}>*/}
                                            {/*<Image source={CardIcon} style={[styles.cardIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>实名认证</Text>*/}
                                    {/*</View>*/}
                                    {/*<View style={[styles.itemRight]}>*/}
                                        {/*<Text  allowFontScaling={false}*/}
                                            {/*style={[baseStyles.textColor, styles.verifyText]}>{identityAuthStateStr}</Text>*/}
                                            {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*</TouchableOpacity>*/}

                        {/*</View>*/}

                        {/*实名认证2*/}
                        <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToAuth2}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        <View style={styles.iconBox}>
                                            <Image source={CardIcon} style={[styles.cardIcon, styles.icon]}/>
                                        </View>
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>实名认证</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        <Text  allowFontScaling={false}
                                            style={[baseStyles.textColor, styles.verifyText]}>{identityAuthStateStr}</Text>
                                            <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>
                        {/*跳转到C2C支付设置*/}
                        {/*<View>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={this.goToBindBank}*/}
                            {/*>*/}
                                {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                    {/*<View style={[styles.itemLeft]}>*/}
                                        {/*<View style={styles.iconBox}>*/}

                                            {/*<Image source={bankcard} style={[styles.bindcardIcon, styles.icon]} resizeMode={'contain'}/>*/}
                                        {/*</View>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>支付设置</Text>*/}
                                    {/*</View>*/}
                                    {/*<View style={[styles.itemRight]}>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.verifyText]}></Text>*/}
                                        {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}

                        {/*邀请返佣*/}
                        {/*<View>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={this.gotoRecommend}*/}
                            {/*>*/}
                                {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                    {/*<View style={[styles.itemLeft]}>*/}
                                        {/*<View style={styles.iconBox}>*/}
                                            {/*<Image source={InviteRebate} style={[styles.cardIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>我的邀请</Text>*/}
                                    {/*</View>*/}
                                    {/*<View style={[styles.itemRight]}>*/}
                                        {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*</TouchableOpacity>*/}

                        {/*</View>*/}
                        {/*安全中心*/}
                        <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToSecurityCenter}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        <View style={styles.iconBox}>
                                            <Image source={SecurityCenter} style={[styles.cardIcon, styles.icon]}/>
                                        </View>
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>安全中心</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>
                        {/*帮助中心*/}
                        {/*<View>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={this.goToHelpCenter}*/}
                            {/*>*/}
                                {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                    {/*<View style={[styles.itemLeft]}>*/}
                                        {/*<View style={styles.iconBox}>*/}
                                            {/*<Image source={HelpCenter} style={[styles.cardIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>帮助中心</Text>*/}
                                    {/*</View>*/}
                                    {/*<View style={[styles.itemRight]}>*/}
                                        {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*</TouchableOpacity>*/}

                        {/*</View>*/}
                        {/*客服中心*/}
                        <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.contactCustomerService}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        <View style={styles.iconBox}>
                                            <Image source={ContactCustomerService} style={[styles.cardIcon, styles.icon]}/>
                                        </View>
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>客服中心</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>
                        {/*设置*/}
                        <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToSetting}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        <View style={styles.iconBox}>
                                            <Image source={SettingIcon} style={[styles.cardIcon, styles.icon]}/>
                                        </View>
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>设置</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        <Image source={IntoIcon} style={styles.intoIcon}/>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>

                        {/*邮箱认证*/}
                        {
                           /* this.$store.state.authMessage.province === 'mobile' && <View>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToEmail}
                            >
                                <View style={[styles.itemBox, styles.boxPadding]}>
                                    <View style={[styles.itemLeft]}>
                                        <View style={styles.iconBox}>

                                            <Image source={EmailIcon} style={[styles.emailIcon, styles.icon]}/>
                                        </View>
                                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>邮箱认证</Text>
                                    </View>
                                    <View style={[styles.itemRight]}>
                                        <Text  allowFontScaling={false}
                                               style={[baseStyles.textColor, styles.verifyText]}>{this.$store.state.authState && this.$store.state.authState.email && '已认证' || '未认证'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>*/
                        }

                        {/*手机认证*/}
                        {
                        //     this.$store.state.authMessage.province === 'email' && <View>
                        //     <TouchableOpacity
                        //         activeOpacity={StyleConfigs.activeOpacity}
                        //         onPress={this.goToMobile}
                        //     >
                        //         <View style={[styles.itemBox, styles.boxPadding]}>
                        //             <View style={[styles.itemLeft]}>
                        //                 <View style={styles.iconBox}>
                        //
                        //                     <Image source={PhoneIcon} style={[styles.phoneIcon, styles.icon]}/>
                        //                 </View>
                        //                 <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>手机认证</Text>
                        //             </View>
                        //             <View style={[styles.itemRight]}>
                        //                 <Text  allowFontScaling={false}
                        //                     style={[baseStyles.textColor, styles.verifyText]}>{this.$store.state.authState && this.$store.state.authState.sms && '已认证' || '未认证'}</Text>
                        //             </View>
                        //         </View>
                        //     </TouchableOpacity>
                        // </View>
                        }

                        {/*谷歌认证*/}
                        {/*<View>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={this.goToGoogle}*/}
                            {/*>*/}
                                {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                                    {/*<View style={[styles.itemLeft]}>*/}
                                        {/*<View style={styles.iconBox}>*/}

                                            {/*<Image source={GoogleIcon} style={[styles.googleIcon, styles.icon]}/>*/}
                                        {/*</View>*/}
                                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>谷歌认证</Text>*/}
                                    {/*</View>*/}
                                    {/*<View style={[styles.itemRight]}>*/}
                                        {/*<Text  allowFontScaling={false}*/}
                                            {/*style={[baseStyles.textColor, styles.verifyText]}>{this.$store.state.authState && this.$store.state.authState.ga && '已认证' || '未认证'}</Text>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}



                        {/*提交工单*/}
                        {
                            /*<TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.$router.push('WorkOrder')
                            }}
                        >
                            <View style={[styles.itemBox, styles.boxPadding]}>
                                <View style={[styles.itemLeft]}>
                                    <View style={styles.iconBox}>
                                        <Image source={null} style={[styles.myRecommendIcon, styles.icon]}/>
                                    </View>
                                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>提交工单</Text>
                                </View>
                                <View style={[styles.itemRight]}>
                                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.intoText]}></Text>
                                    <Image source={IntoIcon} style={styles.intoIcon}/>
                                </View>
                            </View>
                        </TouchableOpacity>*/
                        }
                        {/*手势解锁*/}
                        {
                            /*<TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.$router.push('GestureUnlock')
                            }}
                        >
                            <View style={[styles.itemBox, styles.boxPadding]}>
                                <View style={[styles.itemLeft]}>
                                    <View style={styles.iconBox}>
                                        <Image source={GestureIconOff} style={[styles.myRecommendIcon, styles.icon]}/>
                                    </View>
                                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>手势解锁</Text>
                                </View>
                                <View style={[styles.itemRight]}>
                                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.intoText]}>{this.$store.state.gesture && '已开启' || '未开启'}</Text>
                                    <Image source={IntoIcon} style={styles.intoIcon}/>
                                </View>
                            </View>
                        </TouchableOpacity>*/
                        }

                        {/*/!*测试*!/*/}
                        {/*<View>*/}
                        {/*<TouchableOpacity*/}
                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                        {/*>*/}
                        {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                        {/*<View style={[styles.itemLeft]}>*/}
                        {/*<View style={styles.iconBox}>*/}

                        {/*<Image source={GoogleIcon} style={[styles.googleIcon, styles.icon]}/>*/}
                        {/*</View>*/}
                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>测试</Text>*/}
                        {/*</View>*/}
                        {/*<View style={[styles.itemRight]}>*/}
                        {/*<Text  allowFontScaling={false}*/}
                        {/*style={[baseStyles.textColor, styles.verifyText]}>{this.$globalFunc.formatDateUitl(this.$store.state.serverTime, 'YYYY-MM-DD hh:mm:ss')}</Text>*/}
                        {/*</View>*/}
                        {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}


                    </View>
                    {/*各类 end*/}

                    {/*退出登录 begin*/}
                    {/*<View style={[styles.boxPadding,{backgroundColor:StyleConfigs.bgColor,flex:1,justifyContent: 'center' }]}>*/}
                        {/*<BaseButton*/}
                            {/*text={'退出登录'}*/}
                            {/*onPress={this.logout}*/}
                            {/*style={[baseStyles.btnBlue, styles.logout]}*/}
                            {/*textStyle={[baseStyles.textWhite, styles.logoutText]}*/}
                        {/*>*/}
                        {/*</BaseButton>*/}
                    {/*</View>*/}
                    {/*退出登录 end*/}
                </View>


                {/*去认证模态框 begin*/}
                <Modal
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.verifyModalShow}
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                >
                    <View style={styles.verifyModalBox}>
                        <View style={styles.modalArticleBox}>
                            {/*<Text  allowFontScaling={false} style={styles.modalArticleText}>请前往二零二零官网</Text>*/}
                            {/*<Text  allowFontScaling={false} style={styles.modalArticleText}>(www.2020.exchange)进行</Text>*/}
                            <Text  allowFontScaling={false} style={styles.modalArticleText}>{this.modalMsg}</Text>
                            {this.modalMsg2 != '' && <Text  allowFontScaling={false} style={styles.modalArticleText}>{this.modalMsg2}</Text>}
                        </View>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.closeVerifyModal}
                        >
                            <View style={styles.modalFooterBox}>
                                <Text  allowFontScaling={false} style={styles.modalFooterText}>我知道了</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </Modal>
                {/*去认证模态框 end*/}


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
