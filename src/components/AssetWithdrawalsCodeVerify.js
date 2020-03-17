/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetWithdrawalsCodeVerifyStyle'
// import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import CodeVerifyItem from './AssetWithdrawalsCodeVerifyItem'

import TabView from './baseComponent/BaseTabView'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
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

        // 获取认证状态
        this.getAuthStateStatus()
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


    // 获取手机认证 谷歌认证
    @action
    getAuthStateStatus = () => {
        this.$http.send('GET_AUTH_STATE', {
            bind: this,
            callBack: this.re_getAuthStateStatus,
            errorHandler: this.error_getAuthStateStatus
        })
    }

    // 获取认证状态回调
    @action
    re_getAuthStateStatus = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (data.errorCode) {
            return
        }
        this.$store.commit('SET_AUTH_STATE', data.dataMap)
    }

    // 获取认证状态出错
    @action
    error_getAuthStateStatus = (err) => {
        console.warn('获取认证状态', err)
    }

    // 渲染
    _renderScreen = ({route}) => {
        switch (route.key) {
            case 'ga':
                return <CodeVerifyItem type={'ga'}/>
            case 'mobile':
                return <CodeVerifyItem type={'mobile'}/>
            default:
                return null
        }
    }

    state = {
        index: 0,
        routes: [
            {key: 'ga', title: '谷歌验证'},
            {key: 'mobile', title: '手机验证'}
        ]
    }

    @action
    onIndexChange = (index) => {
        this.setState({index: index})
    }

    // 渲染两个选择
    @action
    _renderSelect = () => {
        return (
            <View style={[styles.container, styles.tabViewBox]}>
                <TabView
                    renderScreen={this._renderScreen}
                    state={this.state}
                    onIndexChange={this.onIndexChange}
                    indicatorStyle={[styles.indicatorStyle]}
                    tabStyle={[styles.tabBar]}
                    tabBoxStyle={[styles.tabBoxStyle, baseStyles.navTwoBgColor]}
                    useSceneMap={false}
                />
            </View>
        )

    }

    // 渲染谷歌认证
    @action
    _renderGa = () => {
        return (
            <View style={[styles.container]}>
                <CodeVerifyItem type={'ga'}/>
            </View>
        )
    }

    // 渲染手机认证
    @action
    _renderMobile = () => {
        return (
            <View style={[styles.container]}>
                <CodeVerifyItem type={'mobile'}/>
            </View>
        )
    }


    /*----------------------- 挂载 -------------------------*/

    render() {

        let bindGa = this.$store.state.authState.ga
        let bindMobile = this.$store.state.authState.sms


        return (
            <View style={[styles.container, baseStyles.bgColor,{paddingTop:getDeviceTop()}]}>
                <NavHeader headerTitle={'提现确认'} goBack={this.goBack}/>

                <View style={styles.container}>
                    {/*两个都绑定了 渲染选择*/}
                    {
                        bindGa && bindMobile && this._renderSelect()
                    }
                    {/*只绑定了谷歌 渲染谷歌*/}
                    {
                        bindGa && !bindMobile && this._renderGa()
                    }
                    {/*只绑定了手机 渲染手机*/}
                    {
                        !bindGa && bindMobile && this._renderMobile()
                    }
                </View>

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
