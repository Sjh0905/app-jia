
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/SettingPageStyle'
import IntoIcon from '../assets/SettingPage/into-icon.png'
import device from "../configs/device/device";
import BaseButton from './baseComponent/BaseButton'
import Modal from 'react-native-modal'
import ENV from "../configs/environmentConfigs/env";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    loading = false

    @observable
    verifyModalShow = false


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

    @action
    goBack = () => {
        this.$router.goBack()
    }

    // 跳转到修改密码
    @action
    goToModifyLoginPsw = () => {
        this.$router.push('ModifyLoginPsw')
    }

    // 跳转到关于我们
    @action
    goToAboutUs = () => {
        // this.$router.push('AboutUs')

    }

    // 跳转到语言设置
    @action
    goToLanguageSetting = () => {

    }
    // 查看用户协议
    @action
    goToUserAgreement = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            // this.$router.push('UserAgreement')
            this.goWebView({
                // url: 'https://www.2020.exchange/index/help/userAgreement',
                url: 'index/mobileNoticeDetail?id=100626&isApp=true',
                loading: false,
                navHide: false,
                title: '用户协议'
            })
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
            params.url.length && (params.url.indexOf('http') === -1) && (params.url = ENV.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
            return this.$router.push('WebPage',params)
        }
    })()
    // 登出
    // @action
    // logout = () => {
    //     this.$http.send('LOGOFF', {
    //         bind: this,
    //         callBack: this.re_logout,
    //         errorHandler: this.error_logout
    //     })
    // }
    //
    // // 登出回调
    // @action
    // re_logout = (data) => {
    //     typeof data == 'string' || (data = JSON.parse(data))
    //
    //     console.warn('data', data)
    //
    //     this.$store.commit('SET_AUTH_MESSAGE', {})
    //
    //     //初始化参数
    //     this.$store.commit('SET_GESTURE',false);
    //     this.$store.commit('SET_SHOW_GESTURE',false);
    //
    //     this.notify({key: 'CHANGE_TAB'}, 0);
    //     this.notify({key: 'SET_TAB_INDEX'},0);
    //     this.goBack();
    //
    //
    // }
    //
    // // 登出出错
    // @action
    // error_logout = (err) => {
    //
    // }

    // 打开模态框
    @action
    openVerifyModal = () => {
        this.verifyModalShow = true

    }

    // 关闭模态框
    @action
    closeVerifyModal = () => {
        this.verifyModalShow = false
    }


    /*----------------------- 挂载 -------------------------*/

    render() {


        let language = ''

        switch (this.$store.state.language) {
            case 'CN':
                language = '中文'
                break;
            case 'EN':
                language = '英文'
                break;
            default:
                language = '中文'
        }


        return (
            <View style={[styles.container, {backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader goBack={this.goBack}/>

                <Text style={baseStyles.securityCenterTitle}>关于我们</Text>
                <View style={{flex:1,backgroundColor:StyleConfigs.bgColor}}>

                    {/*用户协议 begin*/}
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.goToUserAgreement}
                    >
                        <View style={[styles.itemBox, styles.itemPadding]}>
                            <View style={styles.itemLeft}>
                                <Text allowFontScaling={false} style={[styles.itemText, baseStyles.textColor]}>用户协议</Text>
                            </View>
                            <View style={styles.itemRight}>
                                {/*<Text allowFontScaling={false} style={[styles.intoText, baseStyles.textColor]}>{this.$store.state.version}</Text>*/}
                                <Image source={IntoIcon} style={styles.intoIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/*用户协议 end*/}

                    {/*版本 begin*/}
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.openVerifyModal}
                    >
                        <View style={[styles.itemBox, styles.itemPadding]}>
                            <View style={styles.itemLeft}>
                                <Text allowFontScaling={false} style={[styles.itemText, baseStyles.textColor]}>版本</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Text allowFontScaling={false} style={[styles.intoText,{color:StyleConfigs.txtC5CFD5}]}>{this.$store.state.version}</Text>
                                <Image source={IntoIcon} style={styles.intoIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/*版本 end*/}

                    {/*语言设置 begin*/}
                    {/*<TouchableOpacity*/}
                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                        {/*onPress={this.goToLanguageSetting}*/}
                    {/*>*/}
                        {/*<View style={[styles.itemBox, styles.itemPadding]}>*/}
                            {/*<View style={styles.itemLeft}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemText, baseStyles.textColor]}>语言设置</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.itemRight}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.intoText, baseStyles.textColor]}>{language}</Text>*/}
                                {/*/!*<Image source={IntoIcon} style={styles.intoIcon}/>*!/*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*语言设置 end*/}


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
                                {/*<Image source={VerifyModalIcon} style={styles.verifyModalIcon}/>*/}
                                <Text  allowFontScaling={false} style={styles.modalArticleText}>当前已是最新版本</Text>
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
            </View>
        )
    }
}
