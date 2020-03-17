/**
 * hjx 2018.4.16
 */

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


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    loading = false


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
                <NavHeader headerTitle={'设置'} goBack={this.goBack}/>

                <View style={{flex:1,backgroundColor:StyleConfigs.bgColor}}>

                    {/*修改登录密码 begin*/}
                    {/*<TouchableOpacity*/}
                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                        {/*onPress={this.goToModifyLoginPsw}*/}
                    {/*>*/}
                        {/*<View style={[styles.itemBox, styles.itemPadding]}>*/}
                            {/*<View style={styles.itemLeft}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemText, baseStyles.textColor]}>修改登录密码</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.itemRight}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.intoText, baseStyles.textColor]}></Text>*/}
                                {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*修改登录密码 end*/}

                    {/*关于我们 begin*/}
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.goToAboutUs}
                    >
                        <View style={[styles.itemBox, styles.itemPadding]}>
                            <View style={styles.itemLeft}>
                                <Text allowFontScaling={false} style={[styles.itemText, baseStyles.textColor]}>关于我们</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Text allowFontScaling={false} style={[styles.intoText, baseStyles.textColor]}>{this.$store.state.version}</Text>
                                {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/*关于我们 end*/}

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

                    {/*退出登录 begin*/}
                    {/*<View style={[styles.boxPadding,{backgroundColor:StyleConfigs.bgColor,justifyContent: 'flex-end',flex:1,paddingBottom:getHeight(158+getDeviceBottom())}]}>*/}
                        {/*<BaseButton*/}
                        {/*text={'退出登录'}*/}
                        {/*onPress={this.logout}*/}
                        {/*style={[baseStyles.btnBlue, styles.logout]}*/}
                        {/*textStyle={[baseStyles.textWhite, styles.logoutText]}*/}
                        {/*>*/}
                        {/*</BaseButton>*/}
                    {/*</View>*/}
                    {/*退出登录 end*/}


                    {/*加载中*/}
                    {
                        this.loading && <Loading leaveNav={false}/>
                    }
                </View>
            </View>
        )
    }
}
