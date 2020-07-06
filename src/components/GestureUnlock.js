/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Text, TouchableOpacity, View,AsyncStorage} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'

import styles from '../style/GestureUnlockStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import IntoIcon from '../assets/MinePage/into-icon.png'

import GestureIconOff from '../assets/GestureUnlock/gesture-off.png';
import {Switch} from 'react-native-switch'

import device from "../configs/device/device";
import env from "../configs/environmentConfigs/env";
import inputStyles from "../style/MineInputStyle";
import GesturePasswordSet from "./GesturePasswordSet";
import BaseButton from "./baseComponent/BaseButton";

@observer
export default class GestureUnlock extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    gestureState = false

    @observable
    BDBInfo = true

    @observable
    BDBInfoAnimating = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

        // console.warn("我的组件开始挂载")


    }

    @computed get gesture() {
        return this.$store.state.gesture

    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getBDBInfo()
    }


    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/


    goBack = () => {
        this.$router.goBack()
    }

    // 手势密码开关
    @action
    gestureLockChange = (v) => {
        // return false
        console.log('gesture',v);

        this.$store.commit('SET_GESTURE',this.$store.state.gesture?false:true)


        if(!this.$store.state.gesture){
            var userId = this.$store.state.authMessage.userId + '';

            userId != '' && AsyncStorage.setItem(userId,'')

            console.log('gesture',this.$store.state.showGesture,this.$store.state.showGestureTime);
        }

        this.$store.state.gesture && this.$router.push('GesturePasswordSet');

        // this.gestureState = v;
    }

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

    // 跳转到关于我们
    @action
    goToAboutUs = () => {
        this.$router.push('AboutUs')

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
        typeof data == 'string' && (data = JSON.parse(data))

        console.warn('data', data)

        this.$store.commit('SET_AUTH_MESSAGE', {})

        this.notify({key: 'CHANGE_TAB'}, 0);
        this.notify({key: 'SET_TAB_INDEX'},0);
        this.goBack();

    }

    // 登出出错
    @action
    error_logout = (err) => {

    }

    // 平台币是否抵扣
    @action
    getBDBInfo = () => {
        this.$http.send('FIND_FEE_DEDUCTION_INFO', {
            bind: this,
            callBack: this.re_getBDBInfo,
            errorHandler: this.error_getBDBInfo
        })
    }

    // 平台币是否抵扣回调
    @action
    re_getBDBInfo = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data) return
        console.log('this is tt', data)
        if (data.errorCode) {

            return
        }
        if (data.dataMap.TTFEE === 'yes') {
            this.BDBInfo = true
            this.$store.commit('SET_FEE_BDB_STATE',1);
            console.log('feeBdbState初始化为',this.$store.state.feeBdbState);

        }
        if (data.dataMap.TTFEE === 'no') {
            this.BDBInfo = false
            this.$store.commit('SET_FEE_BDB_STATE',0);
            console.log('feeBdbState初始化为',this.$store.state.feeBdbState);

        }
        // BDB状态
        // this.BDBReady = true
        // this.loading = !(this.BDBReady)
    }

    // 平台币是否抵扣出错
    @action
    error_getBDBInfo = (err) => {
        console.warn('抵扣出错', err)
        // this.BDBReady = true
        // this.loading = !(this.BDBReady)
    }


    // 抵扣开关
    @action
    BDBFeeChange = (value) => {
        if (this.BDBInfoAnimating) return
        this.BDBInfoAnimating = true
        this.BDBInfo = value
        this.$http.send('FEE_CHANGE', {
            bind: this,
            params: {
                // 'feebdb': this.BDBInfo ? 'yes' : 'no'
                'deduction': this.BDBInfo ? 'yes' : 'no'
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

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader
                    goBack={this.goBack}
                />
                <Text style={baseStyles.securityCenterTitle}>设置</Text>
                <View style={[{backgroundColor:StyleConfigs.bgColor, flex:1}]}>

                    {/*关于我们 begin*/}
                    {/*<TouchableOpacity*/}
                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                        {/*onPress={this.goToAboutUs}*/}
                    {/*>*/}
                        {/*<View style={[styles.itemBox, styles.itemPadding]}>*/}
                            {/*<View style={styles.itemLeft}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemText, baseStyles.textColor]}>关于我们</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.itemRight}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.intoText, baseStyles.textColor]}>{this.$store.state.version}</Text>*/}
                                {/*/!*<Image source={IntoIcon} style={styles.intoIcon}/>*!/*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.goToAboutUs}
                    >
                        <View style={[styles.itemBox, styles.boxPadding]}>
                            <View style={[styles.itemLeft]}>
                                <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>关于我们</Text>
                            </View>
                            <View style={[styles.itemRight]}>
                                <Text  allowFontScaling={false} style={[styles.intoText]}>{this.$store.state.version}</Text>
                                <Image source={IntoIcon} style={styles.intoIcon}/>
                            </View>

                        </View>
                    </TouchableOpacity>

                    {/*关于我们 end*/}



                    {/*手势解锁*/}
                    {/*<View style={[styles.itemBox, styles.boxPadding]}>*/}
                        {/*<View style={[styles.itemLeft]}>*/}
                            {/*/!*<View style={styles.iconBox}>*!/*/}
                                {/*/!*{this.gesture*!/*/}
                                    {/*/!*&&*!/*/}
                                    {/*/!*<Image source={null} style={[styles.myRecommendIcon, styles.icon]}/>*!/*/}
                                    {/*/!*||*!/*/}
                                    {/*/!*<Image source={GestureIconOff} style={[styles.myRecommendIcon, styles.icon]}/>*!/*/}
                                {/*/!*}*!/*/}
                            {/*/!*</View>*!/*/}
                            {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>手势密码</Text>*/}
                        {/*</View>*/}
                        {/*<View style={[styles.itemRight]}>*/}
                            {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.intoText]}></Text>*/}
                            {/*<Switch*/}
                                {/*value={this.gesture}*/}
                                {/*onValueChange={this.gestureLockChange}*/}
                                {/*circleBorderWidth={0}*/}
                                {/*backgroundActive={StyleConfigs.btnBlue}*/}
                                {/*backgroundInactive={StyleConfigs.borderC5CFD5}*/}
                                {/*circleSize={20}*/}
                            {/*/>*/}
                        {/*</View>*/}

                    {/*</View>*/}
                    {/*<View style={[styles.descBox, styles.boxPadding]}>*/}
                        {/*<Text style={[styles.descText]}>离开软件10分钟后再进入，需要使用手势解锁</Text>*/}
                    {/*</View>*/}

                    {/*使用TT支付手续费*/}
                    <View style={[styles.itemBox,styles.itemBox2, styles.boxPadding]}>
                        <View style={[styles.itemLeft]}>
                            <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.iconText]}>使用TT支付手续费</Text>
                            <Text style={[styles.descText]}>设置TT抵扣手续费，享受抵扣优惠</Text>
                        </View>
                        <View style={[styles.itemRight]}>
                            {
                                this.BDBInfo ?
                                <Text  allowFontScaling={false} style={[styles.statusText, baseStyles.textBlue]}>已开启</Text>
                                :
                                <Text  allowFontScaling={false} style={[styles.statusText]}>已关闭</Text>
                            }

                            <Switch
                                value={this.BDBInfo}
                                onValueChange={this.BDBFeeChange}
                                circleBorderWidth={0}
                                backgroundActive={StyleConfigs.btnBlue}
                                backgroundInactive={StyleConfigs.borderC5CFD5}
                                circleSize={20}
                            />
                        </View>

                    </View>
                    {/*<View style={[styles.descBox, styles.boxPadding]}>*/}
                        {/*<Text style={[styles.descText]}>设置TT抵扣手续费，享受抵扣优惠</Text>*/}
                    {/*</View>*/}

                    <BaseButton
                        text={'退出登录'}
                        onPress={this.logout}
                        style={[baseStyles.btnBlue, styles.settingLogout]}
                        textStyle={[baseStyles.textWhite, styles.logoutText]}
                    >
                    </BaseButton>


                </View>
            </View>
            )
        }

}
