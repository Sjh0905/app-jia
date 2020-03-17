/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {View, Text, NetInfo, WebView, Image, ScrollView} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import {observer} from 'mobx-react'
import {observable,action} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import TabBar from './baseComponent/BaseTabBar'
import TestNav from './TestNavPage'
import Mine from './MinePage'
import OneHome from './OneHome'

import Market from './Market'
import Deal from './Deal'


import Asset from './AssetPage'

import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import styles from '../style/HomePageStyle'
import Toast from "react-native-root-toast";
// import {action} from "mobx/lib/mobx";

import GesturePasswordLogin from './GesturePasswordLogin'
import {computed} from "mobx";
import CookieManager from 'react-native-cookies';
import env from "../configs/environmentConfigs/env";
import MyRecommend from "./MineMyRecommend";
import WebPage from './WebPage.js'
import DealPage from "./DealPage";
// 首页图标
const icon = [require("../assets/HomePage/home-page-home.png"), require("../assets/HomePage/home-page-market.png"), require("../assets/HomePage/home-page-trade.png"), require("../assets/HomePage/home-page-assets.png"), require("../assets/HomePage/home-page-mine.png")]
const selectedIcon = [require("../assets/HomePage/home-page-home-selected.png"), require("../assets/HomePage/home-page-market-selected.png"), require("../assets/HomePage/home-page-trade-selected.png"), require("../assets/HomePage/home-page-assets-selected.png"), require("../assets/HomePage/home-page-mine-selected.png")]

// type Props = {};
// export default class App extends Component<Props> {

var targetHours = [3 , 6 , 9 , 12 , 15 , 18 , 21 , 0]
var targetMinutes = [0]

// var targetHours = [20]
// var targetMinutes = [60]

@observer
export default class App extends RNComponent {

    constructor() {
        super()
        // 选择页签
        this.state = {
            selectedTab: 0
        }
    }

    @computed get gesture() {
        return this.$store.state.gesture

    }
    @computed get showGesture() {

        return this.$store.state.showGesture
    }
    @computed get showGestureTime() {

        return this.$store.state.showGestureTime
    }
    @computed get recommendGesture() {

        return this.$store.state.recommendGesture
    }


    // 循环检查登录信息
    getCheckLogin = null

    componentWillMount() {
        // 监听其他页面改变页签
        this.listen({key: 'CHANGE_TAB', func: this.setSelected})

        this.$store.commit('SET_SERVER_TIME_CALL_BACK',this.refreshGRCPriceRange);
        // 初始化订阅socket
        // this.initSocket();
        // 初始化数据请求
        // this.initGetDatas();


    }
	componentDidMount() {
		// 监听其他页面改变页签

		// 初始化订阅socket
		// this.initSocket();
		// 初始化数据请求
		// this.initGetDatas();

		// this.notify({key:'CONTROL_NOTICE'},0) //停
		// this.notify({key:'CONTROL_NOTICE'},1) //开


		this.props.navigation.addListener('willBlur',payload => {this.notify({key:'CONTROL_NOTICE'},0)})
		this.props.navigation.addListener('didFocus',payload => {
		    this.notify({key:'CONTROL_NOTICE'},1);
		    // 此处需要调用一下
            this.notify({key:'GET_FEE_DIVIDEND'});
            this.notify({key: 'GET_AUTH_STATE'});
		})

        // NetInfo.addEventListener('change', (networkType) => {
        //     if(networkType.toUpperCase() === 'NONE'){
        //         //断网了
        //         Toast.show('无网络可用，请检查网络', {
        //             duration: Toast.durations.LONG,
        //             position: Toast.positions.CENTER
        //         })
        //     }
        //
        //     //广播网络状态
        //     this.notify({
        //         key: 'onNetworkStateChange'
        //     },networkType.toUpperCase() === 'NONE');
        // })


	}



    componentWillUnmount() {
        super.componentWillUnmount()
        this.getCheckLogin && clearInterval(this.getCheckLogin)
    }

    //判断是否刷新价格区间
    refreshGRCPriceRange = (serverTime) => {

        let date = new Date(serverTime)
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()

        // console.log("当前服务器时间",date.getHours(),date.getMinutes(),date.getSeconds());

        //2 , 5 , 8 , 11 , 14 , 17 , 20 , 23 targetMinutes.indexOf((minute+1)%60) > -1
        if(targetHours.indexOf((hour+1)%24) > -1 && (targetMinutes.indexOf((minute+1)%60) > -1) && second >= 57){
            console.log("当前服务器时间需要掉接口");
            this.notify({key: 'GET_GRC_PRICE_RANGE'});
        }

        //3 , 6 , 9 , 12 , 15 , 18 , 21 , 0 targetMinutes.indexOf(minute%60) > -1
        if(targetHours.indexOf(hour) > -1 && (targetMinutes.indexOf(minute%60) > -1) && second < 3){
            console.log("当前服务器时间需要掉接口");
            this.notify({key: 'GET_GRC_PRICE_RANGE'});
        }

    }

    // 前端通过本地cookie信息进行判断
    checkLogin = (index) => {
        index != 2 && CookieManager.get(env.networkConfigs.baseUrl).then((cookie) => {
            console.log('homepage3 CookieManager.get =>', cookie);
            console.log('homepage3 this.$store.state.authMessage =>', this.$store.state.authMessage);
            //未登录状态下是{}，排除此情况
            if(JSON.stringify(cookie) != '{}' && !cookie.hasOwnProperty('_bitsession_')){
                this.clearLoginInfo();
                this.getCheckLogin && clearInterval(this.getCheckLogin);
                this.getCheckLogin = null;
                this.setSelected(0);
            }
        });

        index == 2 && CookieManager.get(env.networkConfigs.baseUrl).then((cookie) => {
            console.log('homepage2 CookieManager.get =>', cookie);
            console.log('homepage2 this.$store.state.authMessage =>', this.$store.state.authMessage);
            //未登录状态下是{}，排除此情况
            if(JSON.stringify(cookie) != '{}' && !cookie.hasOwnProperty('_bitsession_')){
                this.clearLoginInfo();
                this.getCheckLogin && clearInterval(this.getCheckLogin);
                this.getCheckLogin = null;
                // this.setSelected(0);
            }
        });

        // this.$http.send('CHECK_LOGIN_IN', {
        //     bind: this,
        //     callBack: this.re_checkLogin,
        //     errorHandler: this.error_checkLogin
        // })
    }

    // // 登录一下回调
    // re_checkLogin = (data) => {
    //     typeof (data) === 'string' && (data = JSON.parse(data))
    //
    //     console.log('homepage checklogin',data);
    //
    //     // if (data.result === 'FAIL' || data.errorCode) {
    //     //     return
    //     // }
    //     //
    //     // this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)
    //     //
    //     // this.$event.notify({key:'NEW_LOGIN'})
    //
    //     // this.$router.popToTop()
    //
    // }
    // // 登录一下出错
    // error_checkLogin = (err) => {
    //     console.warn("homepage checklogin error", err)
    // }


    clearLoginInfo = ()=>{
        let authMessage = {
            userId: '',
            city: '',
            country: '',
            createdAt: '',
            email: '',
            id: '',
            idCode: '',
            name: '',
            province: '',
            street: '',
            updatedAt: '',
            version: '',
            zipcode: ''
        }
        let authState = {
            sms: false,
            ga: false,
            identity: false,
            capital: false
        }
        //清空用户信息
        this.$store.commit('SET_AUTH_MESSAGE', authMessage);
        //初始化认证状态
        this.$store.commit('SET_AUTH_STATE', authState);
        //初始化手势密码
        this.$store.commit('SET_GESTURE',false);
        this.$store.commit('SET_SHOW_GESTURE',false);

    }

    // getInitData只需要在登陆且切换到3的时候调用一次 因此做一下避免重复调用
    loginChange = true;
    // 注意，mobx可能不会触发componentWillReceiveProps，所以使用原生的state

    setSelected = (() => {
        let last = 0;
        let lastIndex = 0;
        return (index) => {
            if (Date.now() - last < 1000 && lastIndex == index) return;
            last = Date.now();
            lastIndex = index;
            console.log('index=====',index)
            index && this.notify({key:'CONTROL_NOTICE'},0) //停
            !index && this.notify({key:'CONTROL_NOTICE'},1) //开

            if(index < 4){
                this.notify({key:'RE_EXCHANGE_RATE_DOLLAR'});
            }

            if(index < 3){//this.$router[this.$router.length - 1].routeName != 'MyRecommend'
                this.getCheckLogin && clearInterval(this.getCheckLogin);
                this.getCheckLogin = null;
            }


            if ((index == 4 || index == 3) && !this.$store.state.authMessage.userId) {
                this.loginChange = true;
                this.$router.push('Login')
                return
            }

            if(index == 4 || index == 3 || index == 2){
                this.getCheckLogin && clearInterval(this.getCheckLogin);
                // 循环检查登录信息
                this.getCheckLogin = setInterval(() => {
                    this.checkLogin(index)
                }, 6000)
            }

            if(index == 4){
                this.notify({key:'RE_FEE_BDB_STATE'});
                this.notify({key: 'GET_AUTH_STATE'});
                this.notify({key:'GET_FEE_DIVIDEND'});
                this.notify({key: 'GET_IDENTITY_INFO'});
            }

            if(index == 3 && this.$store.state.authMessage.userId){
                this.getInitData();
                this.notify({key: 'GET_IDENTITY_INFO'});
                this.notify({key: 'RE_CURRENCY'});
            }

            if(index == 2 && this.$store.state.authMessage.userId){
                this.notify({key: 'RE_CURRCENY_ORDER'});
            }

            if(index == 2){
                this.notify({key: 'GET_GRC_PRICE_RANGE'});
            }

            this.loginChange = false;

            this.setState({selectedTab: index})

        }

    })()

    @action
    getInitData = () => {
        this.$http.send('MARKET_PRICES', {
            bind: this,
            callBack: this.re_getInitData,
            errorHandler: this.error_getInitData
        })
    }
    // 返回初始data
    @action
    re_getInitData = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        // console.warn("this is initdata",data)
        if (!data) return
        this.$store.commit('CHANGE_PRICE_TO_BTC', data)
    }
    // 获取data出错
    @action
    error_getInitData = (err) => {
        console.warn('获取init数据出错', err)
    }

    isWebViewLoad = {};
    prevLoad = (type)=>{
        if(!this.isWebViewLoad[type]){
            this.refs[type] && this.refs[type].injectJavaScript("window.symbol = "+this.$store.state.symbol+";window.historyData = [];window.render();");
            this.isWebViewLoad[type] = true;
        }
    }

    render() {
        return (
            (this.gesture && this.showGesture && this.showGestureTime) &&
            <GesturePasswordLogin/>
            ||
            <View style={styles.box}>

                <TabNavigator tabBarStyle={[styles.container]}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 0}
                        title="首页"
                        titleStyle={styles.textStyle}
                        selectedTitleStyle={styles.selectedStyle}
                        renderIcon={() => <Image source={require('../assets/HomePage/home-page-home.png')} style={styles.iconStyle} resizeMode={'contain'}/> }
                        renderSelectedIcon={() => <Image style={styles.iconStyle} source={require('../assets/HomePage/home-page-home-selected.png')} resizeMode={'contain'}/>}
                        onPress={() => this.setSelected(0)}>
                        <OneHome/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 1}
                        title="行情"
                        titleStyle={styles.textStyle}
                        selectedTitleStyle={styles.selectedStyle}
                        renderIcon={() => <Image source={require('../assets/HomePage/home-page-market.png')} style={styles.iconStyle} resizeMode={'contain'}/> }
                        renderSelectedIcon={() => <Image style={styles.iconStyle} source={require('../assets/HomePage/home-page-market-selected.png')} resizeMode={'contain'}/>}
                        onPress={() => this.setSelected(1)}>
                        <Market/>
                    </TabNavigator.Item>
                    {/*<TabNavigator.Item*/}
                        {/*selected={this.state.selectedTab === 2}*/}
                        {/*title="交易"*/}
                        {/*titleStyle={styles.textStyle}*/}
                        {/*selectedTitleStyle={styles.selectedStyle}*/}
                        {/*renderIcon={() => <Image source={require('../assets/HomePage/home-page-trade.png')} style={styles.iconStyle} resizeMode={'contain'}/> }*/}
                        {/*renderSelectedIcon={() => <Image style={styles.iconStyle} source={require('../assets/HomePage/home-page-trade-selected.png')} resizeMode={'contain'}/>}*/}
                        {/*onPress={() => this.setSelected(2)}>*/}
                        {/*<Deal/>*/}
                    {/*</TabNavigator.Item>*/}
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 2}
                        title="交易"
                        titleStyle={styles.textStyle}
                        selectedTitleStyle={styles.selectedStyle}
                        renderIcon={() => <Image source={require('../assets/HomePage/home-page-trade.png')} style={styles.iconStyle} resizeMode={'contain'}/> }
                        renderSelectedIcon={() => <Image style={styles.iconStyle} source={require('../assets/HomePage/home-page-trade-selected.png')} resizeMode={'contain'}/>}
                        onPress={() => this.setSelected(2)}>
                        <DealPage/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 3}
                        title="资产"
                        titleStyle={styles.textStyle}
                        selectedTitleStyle={styles.selectedStyle}
                        renderIcon={() => <Image source={require('../assets/HomePage/home-page-assets.png')} style={styles.iconStyle} resizeMode={'contain'}/> }
                        renderSelectedIcon={() => <Image style={styles.iconStyle} source={require('../assets/HomePage/home-page-assets-selected.png')} resizeMode={'contain'}/>}
                        onPress={() => this.setSelected(3)}>
                        <Asset/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 4}
                        title="我的"
                        titleStyle={styles.textStyle}
                        selectedTitleStyle={styles.selectedStyle}
                        renderIcon={() => <Image source={require('../assets/HomePage/home-page-mine.png')} style={styles.iconStyle} resizeMode={'contain'}/> }
                        renderSelectedIcon={() => <Image style={styles.iconStyle} source={require('../assets/HomePage/home-page-mine-selected.png')} resizeMode={'contain'}/>}
                        onPress={() => this.setSelected(4)}>
                        <Mine/>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        )
    }
}
// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
//     tab: {
//         height: 50,
//         backgroundColor: '#222222',
//         alignItems: 'center'
//     },
//     tabText: {
//         marginTop: 1,
//         color: '#ffffff',
//         fontSize: 12
//     },
//     selectedTabText: {
//         marginTop: 1,
//         color: StyleConfigs.btnBlue,
//         fontSize: 12
//     },
//     icon: {
//         width: 20,
//         height: 21,
//         resizeMode: 'stretch',
//         marginTop: 5
//     }
// });
