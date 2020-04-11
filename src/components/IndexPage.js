import {DrawerNavigator} from 'react-navigation'
import RouterConfigs from '../configs/navigationConfigs/DrawerRouterConfigs'
import RouterOptions from '../configs/navigationConfigs/DrawerRouterOptions'
import {
    Vibration,
    StatusBar,
    View,
    Image,
    Text,
    Linking,
    TouchableOpacity,
    AsyncStorage,
    Platform,
    DeviceEventEmitter,
    AppState,
    ImageBackground,
    WebView
} from 'react-native'
import React from 'react'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import codePush from 'react-native-code-push'
import styles from '../style/IndexPageStyle'
import PreHandler from '../preHandler'
import Modal from 'react-native-modal'
import {observable,computed} from 'mobx'
import Env from '../configs/environmentConfigs/env.js'
import Loading from './baseComponent/Loading'
import SplashScreen from 'react-native-splash-screen'
import PushUtil from '../../native/PushUtil.js'
import Approach from '../components/Approach';
import root from '../configs/versionConfigs/Version';
import GetAndroidUpdate from "../../native/GetAndroidUpdate";
import ChartData from './ChartData'

import {getCookieForC2C} from "../c2cProject/C2CPublicAPI";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import MyConfirm from './baseComponent/MyConfirm'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import BaseButton from "./baseComponent/BaseButton";
import BaseStyles from '../style/BaseStyle'
import CookieManager from "react-native-cookies";
// import env from "../configs/environmentConfigs/env";
const MyApp = DrawerNavigator(RouterConfigs, RouterOptions);

const loadingImage = require('../assets/IndexPage/loading.gif');
// const loadingFinish = require('../assets/IndexPage/loadingfinish.gif');
const updateBackImg = require('../assets/IndexPage/updateBackImg.png');
var didReceiveMessage;

//TODO:上线应该是10分钟,测试需要临时改为1分
const gestureSpaceTime = 10 * 60 * 1000;

//K线缓存版本号,暂时记得是日期,改变本值可以全量覆盖刷新本地缓存
const KLineCacheVersion = '20190911'//TraddingHall中还有这个呢，改的时候别忘了
var KLineCacheVersionObj= {}
@codePush
export default class App extends RNComponent {
	constructor() {
		super();

        this.$socket.notifyNetwork((arg)=>{
            console.log('indexpage收到socket回复',arg,'币对',Object.keys(this.symbols).length);
            setTimeout(()=>{
                console.log('indexpage收到socket回复',arg,'币对',Object.keys(this.symbols).length);
                if(Object.keys(this.symbols).length == 0){
                    this.notify({key: 'RE_INIT_ONEHOME'});
                    this.initConstructor();
                    this.$store.commit('SET_SYMBOL','KK_USDT');//刷新后显示默认的币对
                    this.initDidMount();
                }
            },1500)
        })

		this.initConstructor();

        this.listen({key: 'RE_EXCHANGE_RATE_DOLLAR', func: this.getExchangeRateDollar})

        this.listen({key: 'RE_CURRENCY', func: this.getCurrency})//币种接口调取及时响应充提开关变化

        this.listen({key: 'RE_ACCOUNTS', func: this.getAccounts})

		this.listen({key: 'GET_AUTH_STATE',func: this.getAuthState});

        this.listen({key: 'GET_REGULATION_CONFIG', func: this.getRegulationConfig})

		// this.listen({key: 'GET_FEE_DIVIDEND', func: this.getFeeDividend})

        this.listen({key: 'GET_IDENTITY_INFO', func: this.getIdentityInfo})

        this.listen({key: 'GET_COLLECTION_MARKET', func: this.getCollectionMarket})

        this.listen({key: 'GET_GRC_PRICE_RANGE', func: this.getGRCPriceRange})

        PlatformOS == 'android' && this.listen({key: 'CHANGE_ANDROID_STATUS_BAR', func: this.changeAndroidStatusBar})

        this.$event.listen({
            bind: this, key: 'NEW_LOGIN', func: () => {
                this.$store.commit('CLEAR_CURRENCY')
                this.getCurrency()
                this.getCookies()
            }
        })

        setTimeout(()=>{
            this.setState({
                AnimateFinished: true
            })
        },1500)

        if(Platform.OS === 'ios'){
            this.$store.commit('SET_SOURCE_TYPE','iOS');
		}

        // setTimeout(()=>{
        //     this.setState({
        //         navBgColor0602: '#fafafa80'
        //     })
        // },5000)
	}

	initConstructor = () =>{

	    this.getExchangeRateDollar();

        this.getExchangeRateInterval && clearInterval(this.getExchangeRateInterval)
        // 循环获取美金汇率
        this.getExchangeRateInterval = setInterval(() => {
            this.getExchangeRateDollar()
        }, 10 * 60 * 1000)

		//获取版本号
		this.getAppUpdate();

        // 请求
        this.doPreHandler()


        // 获取币种
        this.getCurrency()



		//获取首页币种入口导航
		this.getHomeSymbolsApp()

        this.getBDBInfo()

        this.getAccountInterval && clearInterval(this.getAccountInterval)
        // 循环请求账户信息
        this.getAccountInterval = setInterval(() => {
            this.getAccounts()
        }, 5000)

        this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
        // 循环请求人民币汇率
        this.exchangeRateInterval = setInterval(() => {
            this.getExchangeRate()
        }, 60000)

        // this.getFeeDividendInterval && clearInterval(this.getFeeDividendInterval)
        // BT
        // this.getFeeDividendInterval = setInterval(() => {
        //     this.getFeeDividend()
        // }, 300000)

        this.getIdentityInfoInterval && clearInterval(this.getIdentityInfoInterval)
        // 循环请求认证状态
        this.getIdentityInfoInterval = setInterval(() => {
            this.getIdentityInfo()
            // this.getIdentityAuthStatus()

        }, 60000)

	}
    //远程推送消息
    @computed get userPushMsg() {
        return this.$store.state.userPushMsg;
    }
    @computed get userPushArray() {
        return this.$store.state.userPushArray;
    }



	doPreHandler = async () => {
		let loading = await PreHandler(this.$http, this.$store);
        this.setState({loading: loading})
        console.log('loginstate',this.$store.state.authMessage);

        var userId = this.$store.state.authMessage.userId + '';

        userId && userId != '' && AsyncStorage.getItem(userId).then((data)=> {
            //alert('从doPreHandler进入开启手势密码');
        	// console.log('AsyncStorage',data)
			data && this.$store.commit('SET_GESTURE',true);
			data && this.$store.commit('SET_SHOW_GESTURE',true);
            console.log('AsyncStorage SET_SHOW_GESTURE',this.showGesture)
        })
		// console.warn('preHandler 结束')
        //通过点击消息启动APP，如果调用了pushToPage方法但是并未成功打开新页面，需要等数据回来后重新打开一次
        if(this.userPushMsg != null){
            this.pushFlag = false;
            this.pushToPage(this.userPushMsg,this.userPushArray);
            this.$store.commit('SET_USER_PUSH_MSG',null);
        }
	}


	componentWillMount() {
		super.componentWillMount()
		// codePush.sync({
		//     updateDialog: {
		//         appendReleaseDescription: true,
		//         descriptionPrefix: '更新内容：',
		//         title: '更新',
		//         mandatoryUpdateMessage: '',
		//         mandatoryContinueButtonLabel: '更新',
		//     },
		//     mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
		//     deploymentKey: 'sW5jHeqd8qCneRuSlZHKHP0i8Sat4ksvOXqog',
		// })
		// console.warn('iOS给RN打招呼啦',this.props.userInfo);
		// console.log('PushUtil=====',PushUtil)
        //
		// PushUtil.getUparas().then(value => {
		// 	console.log('PushUtil=====2222',value)
		// }).catch(error => {
		// 	console.log('PushUtil=====2222',error)
		// })

        //获取本地cookies
        this.getCookies();

		// AsyncStorage.setItem('isFirstOpen','aaa')
		AsyncStorage.getItem('isFirstOpen').then((data)=> {
			this.setState({
				showApproach: data !== root.version.toString()
			})
		})

        //存这个版本号貌似没意义了，回头删除？
        AsyncStorage.getItem('KLineCacheVersion').then((data)=> {
			console.log('this is _KLineCacheVersion',data);
			this._KLineCacheVersion = data;
		})

        AsyncStorage.getItem('KLineCacheVersionObj').then((data)=> {
			console.log('this is _KLineCacheVersionObj',data);

			if(!data){
                this._KLineCacheVersionObj = {};
            }else{
                typeof data == 'string' && (this._KLineCacheVersionObj = JSON.parse(data))
            }
		})
		// alert(DeviceHeight);


		// setTimeout(()=>{
			// alert('this is to sen ');
           // PushUtil.sendMessageToRN();
		// },5000);

        AppState.addEventListener('change',this.onAppStateChange)


        // this.$http.send('GET_COOKIES_C2C', {
        //     bind: this,
        //     callBack: function(res){
        //         console.log('this is cookies',res);
        //         // var res2 = '{"cookies":{"name":"_bitsession_","value":"AAAAAcUg030000016b4f41c89aAPP7c494f5ff4c0eb5322d3bc281fa7dd478bd93260a3ecebe56a12c2bc9e7c65f0","comment":null,"domain":null,"maxAge":-1,"path":null,"secure":false,"version":0,"httpOnly":false}}'
        //         var that = this
        //         this.$http.send('PUT_COOKIES_C2C', {
        //             bind: this,
        //             query:{uri:encodeURI(Env.networkConfigs.c2cUrl) + '&paras=' + encodeURI(JSON.stringify(res))},
        //             callBack: function(res1){
        //                 console.log('this is cookies put result',res1);
        //
        //             },
        //             successBack:function(arg){
        //             }
        //         })
        //
        //     }
        // })


    }

    @computed get gesture() {
        return this.$store.state.gesture

    }
    @computed get showGesture() {

        return this.$store.state.showGesture
    }
    @computed get recommendGesture() {

        return this.$store.state.recommendGesture
    }


	// 加载中
	state = {
		loading: true,
		showApproach: false,
        androidNavBgColor:StyleConfigs.navBgColor0602,
        androidTranslucent:false
	}

	//循环获取美金汇率
    getExchangeRateInterval = null

	// 循环获取账户
	getAccountInterval = null

	// 循环获取人民币汇率
	exchangeRateInterval = null

	//计时手势登录
	showGestureInterval = null

	symbols = {}
	marketPrice = {}
	topicPrice = {}
	arr2 = {}
	marketPriceMerge = {}
	depthList = {}

	socket_tick = {}
	socket_snap_shot = {}


	marketUseRate = {}
	e_rate = {}
	tradeList = {}

    refreshFlag = true;

	@observable
    modalShow = false;

	//更新信息
    @observable
    updateInfoCN = ['','','','']
    @observable
    updateVersionName = '';

    klineData = {};

    allDealList = [];
    allDealInterval = null;
    refreshAllDeal = true;

    androidUpdateUrl = '';
    androidInternationalUrl = '';

    @observable
    pushFlag = true;

    pausedTime = 0;

    resumedTime = 0;

    //标记K线是否已经被缓存
    setKLineToAsyncStorageFlag = {}

    //全站成交最新刷新时间
    allDealRefreshTime = 0

    socket_tick_temp = {}


    componentDidMount() {

		this.initDidMount();

        this.listen({key:'RE_INIT_PAGE',func:()=>{

        	if(this.refreshFlag){
                this.initConstructor();
                this.$store.commit('SET_SYMBOL','KK_USDT');//刷新后显示默认的币对
                // this.initDidMount();
                if(this.$store.state.symbol == 'KK_USDT'){
                    this.getGRCPriceRange()
                }

                this.refreshFlag = false;

                setTimeout(()=>{this.refreshFlag = true},5000)

			}


		}});

        this.listen({
            key: 'CHANGE_SYMBOL',
            func: this.CHANGE_SYMBOL
        })

		SplashScreen.hide()

        //监听推送消息
		DeviceEventEmitter.addListener('eventPush', this.androidEventPush);
        //监听APP退出到后台
        //ios
		DeviceEventEmitter.addListener('EnterBackground', this.onActivityPaused);
		//android
		DeviceEventEmitter.addListener('onActivityPaused', this.onActivityPaused);

        //监听APP启动
        //ios
        DeviceEventEmitter.addListener('BecomeActive', this.clearGestureInterval);
        //android
        DeviceEventEmitter.addListener('onResumedClearInterval', this.clearGestureInterval);
        setTimeout(()=>{
            DeviceEventEmitter.addListener('onActivityResumed', this.androidEventResumed);
		},1000);


        // for(var key in ChartData){
        //     console.log('this is Kline',key,ChartData[key])
        // }

	}

	initDidMount = () =>{
        console.log('initDidMount');
        this.getSymbols()
        setTimeout(
            () => this.getMarketPrice(), 1500
        )

        this.getGRCPriceRange();

        // this.initSocket()
        // this.getDepth()
        this.CHANGE_SYMBOL();
        this.getExchangeRate()

        this.getAuthState()
		// this.getBDBInfo()
        // this.getFeeDividend()
        this.getIdentityInfo()
        // this.getIdentityAuthStatus()

        //获取自选区市场列表
        this.getCollectionMarket()

	}

	// 当app状态(是否被切换到后台)
    onAppStateChange = (data)=>{
        console.log('appstate',data);
        // active 活动的 background 后台运行 inactive 中间状态 比如在任务列表中活着
        this.notify({key: 'APP_STATE_CHANGE'},data);
    }

	// 卸载
	componentWillUnmount() {
		super.componentWillUnmount()
		this.getAccountInterval && clearInterval(this.getAccountInterval)
		this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
		this.getIdentityInfoInterval && clearInterval(this.getIdentityInfoInterval)
        if (Platform.OS === "android") {
            // DeviceEventEmitter.removeListener("eventPush",this.androidEventPush);
            DeviceEventEmitter.removeListener('onActivityResumed', this.androidEventResumed);
		}
        AppState.removeEventListener(this.onAppStateChange)
	}

    onActivityPaused = () => {
    	let last = Date.now();
    	this.pausedTime = last;
    	console.log('shengmingzhouqi','RN进入到后台',this.pausedTime);

    	setTimeout(()=>{

        },1000)

        // this.$store.commit('SET_SHOW_GESTURE_TIME',true);
        //
        // this.showGestureInterval && clearInterval(this.showGestureInterval);
        // this.showGestureInterval = setInterval(()=>{
    	 //    console.log('进入到定时器');
         //    var userId = this.$store.state.authMessage.userId + '';
         //    AsyncStorage.getItem(userId).then((data)=> {
         //        data && this.$store.commit('SET_GESTURE',true);
         //        data && this.$store.commit('SET_SHOW_GESTURE',true);
         //        data && this.$store.commit('SET_SHOW_GESTURE_TIME',true);
         //    })
        //
		// },1000);
        // this.showGestureInterval = setInterval(()=>{
         //    this.$store.commit('SET_SHOW_GESTURE_TIME',true);
		// },10 * 60 * 1000);
    }

    clearGestureInterval = () => {
        let resume = Date.now();
        this.resumedTime = resume;
        console.log('shengmingzhouqi','RN进入到前台',this.resumedTime);
        console.log('shengmingzhouqi','RN前后差值',this.resumedTime - this.pausedTime);
        if(this.pausedTime > 0 && this.resumedTime - this.pausedTime > gestureSpaceTime){
            //alert('从clearGestureInterval进入开启手势密码');
            console.log('shengmingzhouqi','RN前后差值符合手势密码显示条件',this.resumedTime - this.pausedTime);
            var userId = this.$store.state.authMessage.userId + '';
            console.log('userId',userId);
            userId && userId != '' && AsyncStorage.getItem(userId).then((data)=> {
                data && this.$store.commit('SET_GESTURE',true);
                data && this.$store.commit('SET_SHOW_GESTURE',true);
                data && this.$store.commit('SET_SHOW_GESTURE_TIME',true);
            })

            this.pausedTime = 0;
            this.resumedTime = 0;
        }
        // this.showGestureInterval && clearInterval(this.showGestureInterval);
        // var userId = this.$store.state.authMessage.userId + '';
    }



    androidEventResumed = () => {

    	setTimeout(()=>{
            if(!this.pushFlag)return;
            if(this.userPushMsg != null){
                this.pushToPage(this.userPushMsg,this.userPushArray);
                this.$store.commit('SET_USER_PUSH_MSG',null);
            }
            this.pushFlag = true;
		},100)

	}

    androidEventPush = (msg) => {
        // alert('this is push message',this.pushArray.find(v => v===msg.toPage))
        this.$store.commit('SET_USER_PUSH_MSG',null);
        if(msg && msg.foreground === 'FALSE'){//如果处于后台
            this.$store.commit('SET_USER_PUSH_MSG',msg);
            return;
        }
        var userPushArray = this.userPushArray;

        if(userPushArray.find(v => v===msg.toPage))
            return;

        this.pushToPage(msg,userPushArray);

        setTimeout(() => this.$store.commit('SET_USER_PUSH_ARRAY',[]),5000);
	}



    //跳转到推送指定页面
    pushToPage = (msg,userPushArray) =>{
        if(!msg)return;
        // this.$globalFunc.toast('推送的标题是'+msg.title);
        // this.$globalFunc.toast('判断$router生成与否'+this.$router);
        // setTimeout(()=>{
			if(!msg.title || !msg.toPage || userPushArray.find(v => v===msg.toPage))
				return;

        	let last = Date.now();
			let httpFlag = msg.toPage.indexOf('http');
        	this.$store.commit('SET_USER_PUSH_ARRAY',msg.toPage);

        	if(Date.now() - last >= 5000){
                this.$store.commit('SET_USER_PUSH_ARRAY',[]);
			}

			if(httpFlag == -1){
			    //跳转到APP内某一页
                // this.$router.push(msg.toPage);
			}

			if(httpFlag > -1){
				this.$router.push('WebPage',{
					url: msg.toPage,
					loading: false,
					navHide: false,
					title: msg.title
				});
				return;
			}



        // },3000);


    }

    //获取本地cookie
    getCookies = () =>{
        CookieManager.get(Env.networkConfigs.baseUrl).then((cookie) => {
            console.log('indexpage CookieManager.get =>', cookie);
            //未登录状态下是{}，排除此情况
            if(JSON.stringify(cookie) != '{}' && cookie.hasOwnProperty('_bitsession_')){
                this.$store.commit('SET_COOKIE',cookie)
            }
        })
    }

    clearAllDealInterval =()=>{
        this.allDealList = [];
        this.$store.commit('SET_ALL_DEAL_DATA',this.allDealList);
        clearInterval(this.allDealInterval);
        this.refreshAllDeal = true;
    }

	CHANGE_SYMBOL() {
        this.clearAllDealInterval()

        this.$store.commit('SET_DEPTH_MERGE',null)
		this.depthList ={}
		this.socket_snap_shot = {}

		this.$store.commit("SET_NEW_PRICE", null)
		this.socket_tick = {}



		this.initSocket()
		this.getDepth()

        if(this.$store.state.symbol == 'KK_USDT'){
            this.getGRCPriceRange()
        }
	}

	//获取美金汇率
    getExchangeRateDollar = ()=>{
        AsyncStorage.getItem('exchangRateDollar').then((data)=>{
            if(data && data >0){
                // console.log('本地硬盘汇率',data);
                this.$store.commit('SET_EXCHANGE_RATE_DOLLAR',data * 1)//* 1转化为number
            }
        })

        this.$http.send('GET_HUOBI_MARKET_RATE',{
            bind: this,
            callBack: this.re_getExchangeRateDollar,
            errorHandler: this.error_getExchangeRateDollar
        })
    }

    re_getExchangeRateDollar = (d)=>{
        if(!d || !d.data)return;
        let detail = d.data.detail || [];
        detail.map(v=>{
            if(v.coinName == 'USDT'){
                let rate = v.buy
                this.$store.commit('SET_EXCHANGE_RATE_DOLLAR',rate * 1)
                // console.log('插入本地硬盘汇率',rate);
                AsyncStorage.setItem('exchangRateDollar',rate)
            }
        })
    }
    error_getExchangeRateDollar = (err)=>{
        console.log("获取火币汇率出错！", err)
    }

    // 获取最新版本号
    getAppUpdate = () => {
        this.$http.send('GET_APP_UPDATE', {
            bind: this,
            callBack: this.re_getAppUpdate,
            errorHandler: this.error_getAppUpdate
        })
        return
    }


    // 获取最新版本号回调
    re_getAppUpdate = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        console.log('version',__VERSION__,data)
        if (!data) return

		if(Platform.OS === 'ios'){
            let iosUpdate = data.IOS;

            if(!iosUpdate)return

            iosUpdate && typeof iosUpdate === 'string' && (iosUpdate = JSON.parse(iosUpdate));

            if(iosUpdate.versionCode > __VERSION__.ios){

                //和后台管理定义好只能用+分割
                let updateInfoCN = iosUpdate.updateInfoCN || '修复了一些BUG+++'
                let updateInfoCNArr = updateInfoCN.split('+');
                this.updateInfoCN = updateInfoCNArr.concat(this.updateInfoCN.splice(updateInfoCNArr.length))
                this.updateVersionName = iosUpdate.versionName && ('V'+iosUpdate.versionName) || ''
                // console.log('this is iosUpdate',this.updateInfoCN);

                this.modalShow = true;
			}
		}
		if(Platform.OS === 'android'){
			let androindUpdate = data.Android;
			if(!androindUpdate)return
            androindUpdate && typeof androindUpdate === 'string' && (androindUpdate = JSON.parse(androindUpdate));

            if(androindUpdate.versionCode > __VERSION__.android){

                //和后台管理定义好只能用+分割
                let updateInfoCN = androindUpdate.updateInfoCN || '修复了一些BUG+++'
                let updateInfoCNArr = updateInfoCN.split('+');
                this.updateInfoCN = updateInfoCNArr.concat(this.updateInfoCN.splice(updateInfoCNArr.length))
                this.updateVersionName = androindUpdate.versionName && ('V'+androindUpdate.versionName) || ''

                console.log('this is androindUpdate',androindUpdate);

            	this.androidUpdateUrl = androindUpdate.downloadUrl;
            	this.androidInternationalUrl = androindUpdate.downInternationalUrl;
                this.modalShow = true;
			}
		}


    }
    // 获取最新版本号出错
    error_getAppUpdate = (err) => {
        console.warn("获取最新版本号出错！", err)
    }

    //国内下载
    onPressUpdate = ()=>{

        console.log('点击更新啦');
        if(Platform.OS === 'ios'){
            if(Env.networkConfigs.downloadPageUrl === ''){
                console.log('Env.networkConfigs.downloadPageUrl 不能为空');
                return;
            }

            let downloadPageUrl = Env.networkConfigs.downloadPageUrl;
            Linking.openURL(downloadPageUrl).catch((error)=>{
                console.log('出错了', error);
            });
		}
		if(Platform.OS === 'android' && this.androidUpdateUrl !== ''){
            GetAndroidUpdate.loadAndroidApk(this.androidUpdateUrl);
		}
	}

	//国际下载
    onInternationalUpdate = ()=>{
        console.log('this is androidInternationalUrl',this.androidInternationalUrl);
        if(Platform.OS === 'android' && this.androidInternationalUrl !== ''){
            GetAndroidUpdate.loadAndroidApk(this.androidInternationalUrl);
        }
    }

    // 平台币是否抵扣
    getBDBInfo = function () {
        this.$http.send('FIND_FEE_DEDUCTION_INFO', {
            bind: this,
            callBack: this.re_getBDBInfo,
            errorHandler: this.error_getBDBInfo
        })
    }

    // 平台币是否抵扣回调
    re_getBDBInfo = function (data) {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data) return
        if (data.errorCode) {
            return
        }
        if (data.dataMap.TTFEE === 'yes') {
            this.$store.commit('SET_FEE_BDB_STATE',1);
            console.log('feeBdbState 首页初始化为',this.$store.state.feeBdbState);

        }
        if (data.dataMap.TTFEE === 'no') {
            this.$store.commit('SET_FEE_BDB_STATE',0);
            console.log('feeBdbState 首页初始化为',this.$store.state.feeBdbState);

        }
    }

    // 平台币是否抵扣出错
    error_getBDBInfo = function (err) {
        console.log('平台币抵扣信息 首页调取出错', err)
    }




    // 判断验证状态
    getAuthState = () => {
        // if (!this.$store.state.authState) {
            this.$http.send('GET_AUTH_STATE', {
                bind: this,
                callBack: this.re_getAuthState,
                errorHandler: this.error_getAuthState
            })
            return
        // }
    }


    // 判断验证状态回调
    re_getAuthState = (data) => {
        console.log('authstate',data);
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return
		if(data.result === 'SUCCESS'){
            this.$store.commit('SET_AUTH_STATE', data.dataMap);
		}
    }
    // 判断验证状态出错
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
    }


    // 第一次获取实名认证状态，这个接口供PC专用，APP暂时不启动
    getIdentityAuthStatus = () => {
        this.$http.send('GET_IDENTITY_AUTH_STATUS', {
            bind: this,
            callBack: this.re_getIdentityAuthStatus,
            errorHandler: this.error_getIdentityAuthStatus
        })
        return
    }
    // 第一次获取实名认证状态回调
    re_getIdentityAuthStatus = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return
        console.log('getIdentityAuthStatus',data);

        let identityAuthState = data.dataMap.status
        // // 如果是通过和待审核状态，不让进
        // if (identityAuthState === '0' || identityAuthState === '2' || identityAuthState == '5' || identityAuthState == '6') {
        //     return
        // }
        // // 如果是未认证状态，直接进
        // if (status === '3') {
        //     return
        // }

        //由于commit是全量覆盖，所以直接拿出来改变某一项的值后再次commit
        let getIdentityInfo = this.$store.state.getIdentityInfo;
        getIdentityInfo.identityAuthState = identityAuthState;
        this.$store.commit('GET_IDENTITY_INFO', getIdentityInfo);

        // 如果是被驳回状态，请求下认证状态
        if (identityAuthState == '1') {
            this.getIdentityInfo()
        }
    }
    // 第一次获取实名认证状态出错
    error_getIdentityAuthStatus = (err) => {
        console.warn("第一次获取实名认证状态出错！", err)
    }

    // 获取驳回后的实名认证状态，APP现在用的是这个
    getIdentityInfo = () => {
        // if (!this.$store.state.authState) {
        this.$http.send('GET_IDENTITY_INFO', {
            bind: this,
            callBack: this.re_getIdentityInfo,
            errorHandler: this.error_getIdentityInfo
        })
        return
        // }
    }


    // 获取驳回后的实名认证状态回调
    re_getIdentityInfo = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return
        console.log('getIdentityInfo',data);

        if(data.result === 'SUCCESS' && data.dataMap && data.dataMap.identityAuths){
        	// 此处处理一下数据结构

			// 整体
            let identityAuth = (data.dataMap.status.toString() === '2');
            let identityAuthInfo = data.dataMap.identityAuths;

            // 整体的明细
            let identityAuthState = data.dataMap.status;

            // 身份证 反面 国徽
            let certificate_negative_url = data.dataMap.identityAuths.some((v)=>{
                return v.type === 'certificate_negative_url' && (v.authResult.toString() === '2');
            }) || false;

            // 身份证 正面 人像
            let certificate_positive_url = data.dataMap.identityAuths.some((v)=>{
                return v.type === 'certificate_positive_url' && (v.authResult.toString() === '2');
            }) || false;

            // 视频
            let living_body_url = data.dataMap.identityAuths.some((v)=>{
                return v.type === 'living_body_url' && (v.authResult.toString() === '2');
            }) || false;

            // let cerificatePage = 'IDCardA';
            let cerificatePage = 'RealNameCertification';
            let cardType = 0;

            if(certificate_positive_url){
                cardType = 1;
                cerificatePage = 'RealNameCertification'
                // cerificatePage = 'IDCardA'
            }
            if(certificate_negative_url){
                cardType = null;
                cerificatePage = 'CertificationNumber';
            }
            if(living_body_url){
                cardType = null;
                cerificatePage = ''
            }
            // 如果是被驳回 或 人工失效 则强制修改起点
            if(identityAuthState.toString() === '1' || identityAuthState.toString() === '3'){
                cardType = 0;
                cerificatePage = 'RealNameCertification'
                // cerificatePage = 'IDCardA'
            }
            this.$store.commit('GET_IDENTITY_INFO', {
                identityAuth,
                identityAuthInfo,
                certificate_negative_url,
                certificate_positive_url,
                living_body_url,
                cardType,
                cerificatePage,
                identityAuthState
			});
        }
    }
    // 获取驳回后的实名认证状态出错
    error_getIdentityInfo = (err) => {
        console.warn("获取实名认证状态出错！", err)
    }

    //安卓专用
    changeAndroidStatusBar = (androidNavBgColor,androidTranslucent) => {

        if(androidNavBgColor == 'init'){
            this.setState({
                androidNavBgColor:StyleConfigs.navBgColor0602,
                androidTranslucent:false
            })
            return;
        }

        this.setState({
            androidNavBgColor,
            androidTranslucent
        })
    }


    // 获取自选区市场列表
    getCollectionMarket = ()=>{
        // AsyncStorage.setItem('collectionSymbols','');
        //如果没有登录取本地缓存
        if(!this.$store.state.authMessage.userId){
            AsyncStorage.getItem('collectionSymbols').then((data)=>{
                if(data && data.length >= 0){
                    // console.log('获取自选区市场列表',data);
                    this.$store.commit('SET_COLLECTION_SYMBOLS',data.split(','))//* 1转化为number
                    this.notify({key:'REFRESH_MARKET_COLLECT_EDIT'});
                    return
                }

                this.$store.commit('SET_COLLECTION_SYMBOLS',[])
                this.notify({key:'REFRESH_MARKET_COLLECT_EDIT'});
            })
            return;
        }

        this.$http.send('GET_COLLECTION_SYMBOL', {bind: this, callBack: this.re_getCollectionMarket})
    }

    re_getCollectionMarket = (data)=>{
        typeof(data) == 'string' && (data = JSON.parse(data));
        console.log('=================getCollectionMarket',data)

        let symbols = data.dataMap && data.dataMap.symbols

        let collectionMarket = []
        symbols.forEach(v => {
            collectionMarket.indexOf(v.symbol) == -1 && (collectionMarket.push(v.symbol))
        })

        this.$store.commit('SET_COLLECTION_SYMBOLS',collectionMarket);

        //最新结果保存到本地
        AsyncStorage.setItem('collectionSymbols',collectionMarket.toString());

        this.notify({key:'REFRESH_MARKET_COLLECT_EDIT'});
    }




    getSymbols() {
		this.$http.send('COMMON_SYMBOLS', {bind: this, callBack: this.re_getSymbols})
	}

	re_getSymbols(data) {
		typeof(data) == 'string' && (data = JSON.parse(data));
		// console.log('=================!!!!symbol',data)
		this.symbols = data

        this.$store.commit('SET_ALL_SYMBOLS', data.symbols || []);

        data.symbols.forEach((v, k) => {
		    // console.log('这是第'+k+'个币对');
			// v.name === 'ACT_USDT' && (v.meta = {honeyArea : 'true'})//临时添加，后台接口调好后需要删除
			// v.name === 'ZIL_USDT' && (v.meta = {honeyArea : 'true'})//临时添加，后台接口调好后需要删除
			this.tradeList[v.name] = v;

            //1.如果本地未全量缓存过，在本地缓存K线数据
            //2.如果本地缓存版本号与最新版本号不一致，需要全部覆盖缓存
            // console.log('this is _KLineCacheVersion == KLineCacheVersion',this._KLineCacheVersion == KLineCacheVersion);
            // if(this._KLineCacheVersion == null || this._KLineCacheVersion != KLineCacheVersion){
            //     //setKLineToAsyncStorageFlag防止数组二次遍历重复缓存
            //     !this.setKLineToAsyncStorageFlag[v.name] && this.setKLineToAsyncStorage(v.name);
            // }


            //1.如果该币对没缓存过，
            //2.setKLineToAsyncStorageFlag防止数组二次遍历重复缓存
            if(!this._KLineCacheVersionObj[v.name] && !this.setKLineToAsyncStorageFlag[v.name]){
                this.setKLineToAsyncStorage(v.name);
            }
            //貌似没有用了？可以删除。
            if(k == data.symbols.length - 1){
                AsyncStorage.setItem('KLineCacheVersion',KLineCacheVersion)
            }
		});

		console.log('this.tradeList===========', this.tradeList)
		this.$store.commit('SET_TRADE_LIST', this.tradeList);


		//判断是否减免feeDiscount
        this.feeDiscount = [...new Set(this.symbols.symbols.map(v => v.name))].map(v => v.split('_'))
            .reduce((r, v) => (r[v[1]] = r[v[1]] || [])
                && r[v[1]].push(this.tradeList[v.join('_')].feeDiscount)
                && r, {})
        console.log('this.arr4===============',this.feeDiscount)
		Object.keys(this.feeDiscount).forEach(k =>{

            this.feeDiscount[k] = this.feeDiscount[k].find(v => v==='TRUE');
				// console.log('this.arr3===============',k,this.feeDiscount[k])
			}
		);
        this.$store.commit('SET_FEE_DISCOUNT', this.feeDiscount)


		this.arr2 = [...new Set(this.symbols.symbols.map(v => v.name))].map(v => v.split('_'))//拆分，得到大小键组成的数组
			.reduce((r, v) => (r[v[1]] = r[v[1]] || []) //构造数组{大键:[{name:小键,value:[...]}]},如空，赋初值
				&& r[v[1]].push({name: v[0], value: Array(6).fill(0),
					honeyArea:this.tradeList[v.join('_')] != undefined && this.tradeList[v.join('_')].meta != undefined && this.tradeList[v.join('_')].meta.honeyArea || 'qiantai',
					denominator:v[1]})//将当前小键加入数组，初值为[0,*6]
				&& r, {})//完成。初始化所有键值，并分成大键+数组的Object


		// console.log('this.feeDiscount===============',this.feeDiscount);

        console.log('this.arr2===============',this.arr2);

        this.$store.commit('SET_MARKET_LIST', this.arr2)


	}

    setKLineToAsyncStorage = (symbol)=>{
        this.setKLineToAsyncStorageFlag[symbol] = true
        let _type = 'K_1_DAY';
        // console.log('name',symbol,'Kline',ChartData[symbol+'_'+_type]);

        var symbolKline =  ChartData[symbol+'_'+_type];
        if(symbolKline){
            this.re_setKLineToAsyncStorage(symbol,symbolKline)
            return
        }

        var url = '/v1/market/bars/'+symbol+'/'+ _type;
        this.$http.urlConfigs['BARS_'+symbol] = {url:url, method: 'get'};
        let startTime = this.$store.state.serverTime - 365*24*3600*1000
        this.$http.send('BARS_'+symbol, {
            bind: this,
            query: {
                start: startTime,
                end: this.$store.state.serverTime
            },
            callBack: this.re_setKLineToAsyncStorage.bind(this, symbol)
        })
    }
    re_setKLineToAsyncStorage = (symbol,d)=>{
        if(!d)return;

        let bars = d.bars;
        //默认最后一条数据的时间是下一次更新的开始时间
        d.nextStartTime = bars.length > 0 ? bars[bars.length - 1][0] : (this.$store.state.serverTime - 2 * 24 * 60 * 60 * 1000);


        // let lastDate = new Date(d.nextStartTime);
        // let nowDate = new Date();
        //
        // //如果本月今天的K线已经存在，剔除不保存，为了保证今天的数据一直从接口调取，因为当天数据会实时更新
        // if(lastDate.getMonth() == nowDate.getMonth() && lastDate.getDate() == nowDate.getDate()){
        //     console.log('今天的K线存在，需要剔除后再保存');
        //
        // }

        // console.log('this is symbol为'+symbol+'的K线',d);
        AsyncStorage.setItem(symbol,JSON.stringify(d))

        this._KLineCacheVersionObj[symbol] = KLineCacheVersion
        AsyncStorage.setItem('KLineCacheVersionObj',JSON.stringify(this._KLineCacheVersionObj));

        // setTimeout(()=>{
        //     AsyncStorage.getItem(symbol).then((data)=>{
        //         console.log('this is AsyncStorage symbol为'+symbol+'的K线',data);
        //     })
        // })
    }

	getMarketPrice() {
		this.$http.send('MARKET_PRICES', {bind: this, callBack: this.re_getMarketPrice})
	}


	re_getMarketPrice(data) {
		// console.log('=================!!!!marketprice',data);
		typeof(data) == 'string' && (data = JSON.parse(data))

		this.marketPrice = data
		console.log('this.martketPrice=====',this.marketPrice)

		this.$store.commit('SET_MARKET_PRICE_MERGE', Object.assign({},this.marketPrice, this.topicPrice))


		// !this.$store.state.marketPriceMerge
		// && this.$store.commit('SET_MARKET_PRICE_MERGE', this.marketPrice)
		// || this.$store.commit('SET_MARKET_PRICE_MERGE', Object.assign(this.marketPrice, this.topicPrice))


		Object.keys(this.arr2).length && this.addData(this.symbols, this.marketPrice)
		this.$store.commit('SET_MARKET_LIST', this.arr2)

		if (this.e_rate && Object.keys(this.arr2).length)
			this.getMarketUseRate();
	}

    // 获取grc交易价格区间
    getGRCPriceRange = ()=> {
        this.$http.send('KK_PRICE_RANGE', {
            bind: this,
            callBack: this.re_getGRCPriceRange,
            errorHandler: this.error_getGRCPriceRange
        })
    }
    // 获取grc交易价格区间成功
    re_getGRCPriceRange = (data)=> {
        console.log('获取grc交易价格区间成功',data);
        if(!data || !data.kkPriceRange)return

        this.$store.commit('SET_GRC_PRICE_RANGE',data.kkPriceRange)
    }
    // 获取grc交易价格区间报错
    error_getGRCPriceRange = function () {
        console.log('获取grc交易价格区间报错');
    }

	getDepth() {
		this.$http.send('DEPTH', {
			bind: this,
			query: {
				symbol: this.$store.state.symbol
			},
			callBack: this.re_getDepth
		})
	}


	re_getDepth(data) {
		typeof(data) == 'string' && (data = JSON.parse(data));
		// console.log('DEPTH======',data)
        data.symbol == 'QST_ETH' && console.log('DEPTH======',JSON.stringify(data.buyOrders))
		this.depthList = data

		this.$store.commit('SET_DEPTH_MERGE', Object.assign({},this.depthList, this.socket_snap_shot))





		// !this.$store.state.depthMerge &&
		// this.$store.commit('SET_DEPTH_MERGE', this.depthList)
		// || this.$store.commit('SET_DEPTH_MERGE', Object.assign(this.depthList, this.socket_snap_shot))


	}

	getMarketUseRate = () => {


        // try {
            this.marketUseRate = {
                'USDT': 1,
                'BTC': this.e_rate.btcExchangeRate,
                'ETH': this.e_rate.ethExchangeRate,
                // 'BDB': this.e_rate.ethExchangeRate *(this.arr2.ETH.find(val=>val.name=='BDB')||{value:[0,0,0,0,0]}).value[4],
                '0': 1,
                '1': this.e_rate.btcExchangeRate,
                '2': this.e_rate.ethExchangeRate,
                // '3': this.e_rate.ethExchangeRate *(this.arr2.ETH.find(val=>val.name=='BDB')||{value:[0,0,0,0,0]}).value[4]
            };
        // }catch (e) {
        //     console.error(e)
        // }


		this.$store.commit('SET_MARKET_USE_RATE', this.marketUseRate)


	}

	//刷新全站成交
    refreshAllDealFunc = (message)=>{
        //全站交易数据
        if (message instanceof Array && message.length > 0) {
            message = message.filter(v => v.symbol === this.$store.state.symbol);
            // console.log('*************message',message);


            this.allDealList = message.splice(0, 20);

            // console.log('*************this.allDealList01',this.allDealList);

            // this.$store.commit('SET_ALL_DEAL_DATA',this.allDealList);
        }



        if (!!message.symbol && message.symbol === this.$store.state.symbol) {
            let lists = this.allDealList.filter(v => v.symbol === this.$store.state.symbol);
            lists.unshift(message);
            this.allDealList = lists.splice(0, 20);
            // console.log('*************this.allDealList02',this.allDealList);

            // this.$store.commit('SET_ALL_DEAL_DATA',this.allDealList);
        }

        for (let i = 20 - this.allDealList.length; this.allDealList.length && i >0; i--) {
            this.allDealList.push({
                price:0,
                amount:0,
                createdAt:0
            });
        }
        this.allDealRefreshTime = this.allDealList[0] && this.allDealList[0].createdAt || 0;
        console.log('00000000000000 topic_tick======this.allDealList',this.allDealList,this.allDealRefreshTime)
        this.$store.commit('SET_ALL_DEAL_DATA',this.allDealList);
    }


	timer = null;
	initSocket() {
		// console.log('topic_snapshot======iiiii')
        this.$socket.off({bind: this});

		// 订阅某个币对的信息
		console.log('00000000000000-unsubscribe', {symbol:this.$store.state.symbol})
		this.$socket.emit('unsubscribe', {symbol:this.$store.state.symbol})
		this.$socket.emit('subscribe', {symbol:this.$store.state.symbol})
		console.log('00000000000000-subscribe', {symbol:this.$store.state.symbol})

        //socket重连之后必须emit向服务端发送一条消息，要不然可能接不到数据
        this.$socket.on({
            key: 'connect',bind: this,callBack: ()=>{
                    console.log("00000000000000-监听socket连接状态，成功，再次订阅消息")
                    this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
                    this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});
                }
            }
        )

        // let i = 0;
        // clearTimeout(this.timer);
        // this.timer = setInterval((
        //
        // )=>{
        //     //1 模拟 把所有数据都错开的情况下
        //     if(i % 3 === 0){
        //     	//接收所有币对实时价格
        //     	let message = {
        //     		"ELF_BDB":[1526976825144,1,1,1,1,200+i],
			// 		"CS_ETH":[1526976825144,0.00172,0.00172,0.00172,0.00172,2800+i],
			// 		"BDB_ETH":[1526976825144,0.00015496,0.00015499,0.00015496,0.00015499,44000+i],
			// 		"EOS_ETH":[1526976825144,0.018489,0.018489,0.018489,0.018489,4000+i],
			// 		"BTC_USDT":[1526976825144,8142.84,8142.84,8142.84,8140.84,2+i],
			// 		"ETH_BTC":[1526976825144,0.15,0.15,0.15,0.15,200+i]};
        //         this.topicPrice = message
        //         this.$store.commit('SET_MARKET_PRICE_MERGE', Object.assign({},this.marketPrice, this.topicPrice))
        //         Object.keys(this.arr2).length && this.addData(this.symbols, this.topicPrice)
        //         this.$store.commit('SET_MARKET_LIST', this.arr2)
        //     }
        //     if(i % 3 === 1){
			// 	//获取所有币对价格
			// 	let message =
			// 		[
			// 			{"id":108140,"symbol":"BDB_ETH","price":0.00015499+(i/100000),"amount":933+i,"direction":true,"createdAt":1527058994563},
			// 			{"id":108139,"symbol":"BDB_ETH","price":0.00015499,"amount":67,"direction":true,"createdAt":1527058994563},
			// 			{"id":108137,"symbol":"BDB_ETH","price":0.00015499,"amount":1000,"direction":true,"createdAt":1527058978358},
			// 			{"id":108135,"symbol":"BDB_ETH","price":0.00015499,"amount":1000,"direction":true,"createdAt":1526999568562},
			// 			{"id":108130,"symbol":"BDB_ETH","price":0.00015496,"amount":10000,"direction":true,"createdAt":1526996091252},
			// 			{"id":108129,"symbol":"BDB_ETH","price":0.00015496,"amount":9900,"direction":true,"createdAt":1526996091252},
			// 			{"id":108103,"symbol":"BDB_ETH","price":0.00015496,"amount":100,"direction":true,"createdAt":1526985064862},
			// 			{"id":108043,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871726011},
			// 			{"id":107991,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871605913},
			// 			{"id":107941,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871485986},
			// 			{"id":107891,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871366347},
			// 			{"id":107841,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871246447},
			// 			{"id":107791,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871126660},
			// 			{"id":107741,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526871007959},
			// 			{"id":107691,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526870889247},
			// 			{"id":107665,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526728690951},
			// 			{"id":107615,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526728461796},
			// 			{"id":107561,"symbol":"BDB_ETH","price":0.00015499,"amount":64,"direction":true,"createdAt":1526725213942},
			// 			{"id":107403,"symbol":"BDB_ETH","price":0.00015499,"amount":1000,"direction":true,"createdAt":1526631211429},
			// 			{"id":107401,"symbol":"BDB_ETH","price":0.00015499,"amount":1000,"direction":true,"createdAt":1526625687334}
			// 			];
        //         this.topicPrice = message
        //         this.socket_tick = message instanceof Array && message[0] || message;
        //         this.$store.commit("SET_NEW_PRICE", this.socket_tick)
        //     }
        //     if(i % 3 === 2){
        //         //获取深度图信息 左侧列表
			// 	let message =
			// 		{
			// 			"symbol":"BDB_ETH",
			// 			"timestamp":1527058994563,
			// 			"price":0.00015499 + (i / 10000),
			// 			"buyOrders":[],
			// 			"sellOrders":[
			// 				{"price":0.00015499,"amount":1067},
			// 				{"price":0.000155,"amount":1000}
			// 				]
			// 		};
        //         if (message.symbol === this.$store.state.symbol) {
        //             this.socket_snap_shot = message;
        //             this.$store.commit('SET_DEPTH_MERGE', Object.assign({},this.depthList, this.socket_snap_shot))
        //         }
        //     }
        //
        //     //2 模拟所有数据并发的情况下
        //
        //     i++;
        //     //i = i % 3;
        // },500)

		// 接收所有币对实时价格
		this.$socket.on({
			key: 'topic_prices', bind: this, callBack: (message) => {
				//console.log('接收所有币对实时价格', JSON.stringify(message));
				// console.log('=================!!!!topicprice',message)
				this.topicPrice = message


				this.$store.commit('SET_MARKET_PRICE_MERGE', Object.assign({},this.marketPrice, this.topicPrice))


				// !this.$store.state.marketPriceMerge
				// && this.$store.commit('SET_MARKET_PRICE_MERGE', this.topicPrice)
				// || this.$store.commit('SET_MARKET_PRICE_MERGE', Object.assign(this.marketPrice, this.topicPrice))


				Object.keys(this.arr2).length && this.addData(this.symbols, this.topicPrice)
				// console.log({...this.arr2})
				this.$store.commit('SET_MARKET_LIST', this.arr2)
				// console.log('this.$store.state.marketList====',this.$store.state.marketList)
			}
		})



		// // 获取所有币对价格
		this.$socket.on({
			key: 'topic_tick', bind: this, callBack: (message) => {
                //console.log('获取所有币对价格', JSON.stringify(message));
                console.log('00000000000000 topic_tick======',message)




				// this.socket_tick = message instanceof Array && message[0] || message
				this.socket_tick = message instanceof Array && (message[0]['symbol'] ===  this.$store.state.symbol && message[0]) ||( message.symbol === this.$store.state.symbol && message )

                console.log('00000000000000 topic_tick======this.socket_tick 1',this.socket_tick)
                //如果非当前币对并且推送的是对象的情况下,this.socket_tick的值是false
                if(!this.socket_tick)return

                this.socket_tick_temp = this.socket_tick;
				this.$store.commit("SET_NEW_PRICE", this.socket_tick)

				// console.log('00000000000000-SET_NEW_PRICE',this.$store.state.newPrice,this.$store.state.symbol)

                console.log('00000000000000 topic_tick======this.socket_tick 2',this.socket_tick)
                // console.log('00000000000000 topic_tick======this.refreshAllDeal',this.refreshAllDeal)

                if(!this.refreshAllDeal){
                    console.log('00000000000000 topic_tick======准备延迟执行===',this.socket_tick.createdAt > this.allDealRefreshTime)
                    setTimeout(()=>{

                        if(this.socket_tick_temp.createdAt > this.allDealRefreshTime){
                            console.log('00000000000000 topic_tick======延迟了')
                            this.refreshAllDealFunc(message);
                            this.refreshAllDeal = true
                        }
                    },250);
                    return;
                }

				this.refreshAllDeal = false;

				this.refreshAllDealFunc(message);

                if(this.allDealInterval)
                	clearInterval(this.allDealInterval)

                this.allDealInterval = setInterval(()=>{
                    this.refreshAllDeal = true
                },500);

			}
		})

		// // 获取深度图信息 左侧列表
		this.$socket.on({
			key: 'topic_snapshot', bind: this, callBack: (message) => {
                message.symbol == 'QST_ETH' && console.log(' DEPTH======topic_snapshot==buy=', JSON.stringify(message.buyOrders));
                message.symbol == 'QST_ETH' && console.log(' DEPTH======topic_snapshot==sell=', JSON.stringify(message.sellOrders));
                // console.log('00000000000000--topic_snapshot======',message)
                // console.log('00000000000000--this.$store.state.symbol======',this.$store.state.symbol)
				if (message.symbol === this.$store.state.symbol) {
					this.socket_snap_shot = message;

					this.$store.commit('SET_DEPTH_MERGE', Object.assign({},this.depthList, this.socket_snap_shot))
					// console.log('00000000000000--depthMerge======',this.$store.state.depthMerge)
				}
				// this.socket_snap_shot = message;
				//
				// this.$store.commit('SET_DEPTH_MERGE', Object.assign({},this.depthList, this.socket_snap_shot))


				// !this.$store.state.depthMerge &&
				// this.$store.commit('SET_DEPTH_MERGE', this.socket_snap_shot)
				// || this.$store.commit('SET_DEPTH_MERGE', Object.assign(this.depthList, this.socket_snap_shot))

			}
		})
		// K线
		this.$socket.on({
            key: 'topic_bar',
            bind: this,
            callBack: (message) => {
                console.log('K线', JSON.stringify(message));
                let b = message.data;
                let type = message.type;
                if (!b) return;
                // onRealtimeCallback(
                this.klineData = {
                    time: b[0],
                    open: b[1],
                    high: b[2],
                    low: b[3],
                    close: b[4],
                    volume: b[5],
                    type:type
                }
                this.notify({key: 'KLINE_DATA'}, this.klineData);
            }
		})
	}

	addData = (sml, topicPrice) => {
		var sortFunc = (v1, v2) => v1.name > v2.name ? 1 : -1
		Object.keys(topicPrice)//遍历新数据的所有键
			.map(v => [v, topicPrice[v], ...v.split('_')])//得到一个二维数组，每元素为：[ 原键,值,小键,大键 ]
			.forEach(v => (this.arr2[v[3]] =
                this.arr2[v[3]] && this.arr2[v[3]].filter(vv => vv.name !== v[2])) //从arr2大键对应的数组里剔除原小键的内容
				&& this.arr2[v[3]].push({name: v[2], value: v[1],
					honeyArea:this.tradeList[v[0]] != undefined && this.tradeList[v[0]].meta != undefined && this.tradeList[v[0]].meta.honeyArea || 'qiantai',
					denominator:v[3]}) //对arr2大键对应的数组push新值
				&& this.arr2[v[3]].sort(sortFunc) || []) ;//对arr2大键对应的数组重新排序，收工

	}

	getExchangeRate() {
		this.$http.send('GET_EXCHANGE_RAGE', {
			bind: this,
			callBack: this.re_getExchangeRate,
			errorHandler: this.error_getExchangeRate
		})
	}

	re_getExchangeRate(data) {
		typeof (data) === 'string' && (data = JSON.parse(data))
		// console.warn("获取人民币费率", data)
		if (!data || !data.dataMap) return
		if (data.result === 'SUCCESS') {
			this.$store.commit('SET_EXCHANGE_RATE', data.dataMap.exchangeRate)
		}
		this.e_rate = this.$store.state.exchange_rate;
		console.log('-=-=-=-=-=-=-=-=-=-=', this.$store.state.exchange_rate)

		if (this.e_rate && Object.keys(this.arr2).length)
			this.getMarketUseRate();
	}


// 获取币种
	getCurrency = () => {
		this.$http.send('GET_CURRENCY', {
			bind: this,
			callBack: this.re_getCurrency,
			errorHandler: this.error_getCurrency,
		})
	}

// 获取币种的状态
	re_getCurrency = (data) => {
		typeof (data) === 'string' && (data = JSON.parse(data))
		console.log('currency============',data);
		if (!data.dataMap || !data.dataMap.currencys) {
			return
		}
		this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
		this.getAccounts()
	}

// 获取币种失败
	error_getCurrency = (err) => {
		console.warn("获取币种列表失败", err)
	}

//获取账户信息
	getAccounts = () => {
		// 如果不登录则不请求
		if (!this.$store.state.authMessage.userId) return
		// 请求各项估值
		this.$http.send('GET_ACCOUNTS', {
			bind: this,
			callBack: this.re_getAccount,
			errorHandler: this.error_getAccount
		})
	}
// 获取账户信息回调
	re_getAccount = (data) => {
		typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('account===========1111=',data);
		if (!data || !data.accounts) {
			return
		}
		this.$store.commit('CHANGE_ACCOUNT', data.accounts)
		//测试git
	}
// 获取账户信息失败
	error_getAccount = (err) => {
		console.warn("获取账户内容失败", err)
	}



//  获取首页导航币对
	getHomeSymbolsApp = () => {
		this.$http.send('HOME_SYMBOLS_APP', {
			bind: this,
			callBack: this.re_getHomeSymbolsApp,
			// errorHandler: this.error_getHomeSymbolsApp
		})
	}
//  获取首页导航币对
	re_getHomeSymbolsApp = (data) => {
		typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('re_getHomeSymbolsApp=======',data)
		this.$store.commit('SET_HOME_SYMBOLS',  data);

	}













// // 获取当前分红
//     getFeeDividend = ()=>{
//         // 如果不登录则不请求
//         // if (!this.$store.state.authMessage.userId) return
//         // 请求各项估值
//         this.$http.send('GET_FEE_DIVIDEND', {
//             bind: this,
//             callBack: this.re_getFeeDividend,
//             errorHandler: this.error_getFeeDividend
//         })
// 	}
// // 获取分红回调
// 	re_getFeeDividend = (data)=>{
//         typeof (data) === 'string' && (data = JSON.parse(data))
//         console.log('SET_FEE_DIVIDEND===========1111=',data);
//         if (!data || !data.dataMap) {
//             return
//         }
//         this.$store.commit('SET_FEE_DIVIDEND',  data.dataMap.dividend);
// 	}
// // 获取分红失败
//     error_getFeeDividend = (err) => {
//         console.warn("获取当前分红失败", err)
//     }


// // 获取BT文案参数配置
//     getRegulationConfig = ()=>{
//         // 如果不登录则不请求
//         // if (!this.$store.state.authMessage.userId) return
//         // 请求各项估值
//         this.$http.send('REGULATION_CONFIG', {
//             bind: this,
//             callBack: this.re_getRegulationConfig,
//             errorHandler: this.error_getRegulationConfig
//         })
//     }
// // 获取BT文案参数配置回调
//     re_getRegulationConfig = (data)=>{
//         typeof (data) === 'string' && (data = JSON.parse(data))
//         console.log('REGULATION_CONFIG===========1111=',data);
//         if (!data) {
//             return
//         }
//         this.$store.commit('SET_REWARD',  data.reward);
//         this.$store.commit('SET_ACTIVITY',  data.activity);
//     }
// // 获取BT文案参数配置失败
//     error_getRegulationConfig = (err) => {
//         console.warn("获取BT文案参数配置失败", err)
//     }

    onLayout = (e)=>{
		if(Platform.OS === 'android'){

			console.log('indexPage e.nativeEvent.layout.height',e.nativeEvent.layout.height);

            let realHeight = e.nativeEvent.layout.height;
            let deviceHeight = ExtraDimensions.get("REAL_WINDOW_HEIGHT");
            let statusBarHeight = ExtraDimensions.get("STATUS_BAR_HEIGHT");
            let softMenuBar = ExtraDimensions.get("SOFT_MENU_BAR_HEIGHT");

            let isShowSoftMenuBar = false;
            if(Math.abs(deviceHeight - statusBarHeight - softMenuBar - realHeight) <= 1){
				isShowSoftMenuBar = true;
			}
			if(deviceHeight === 640){
                realHeight = realHeight + 5
			}

			let result = {realHeight,deviceHeight,statusBarHeight,softMenuBar,isShowSoftMenuBar};
            this.$store.commit('SET_DEVICE_HEIGHT_STATE',  result);
            this.notify({key: 'ON_DEVICE_LAYOUT'}, result);
		}
	}

    onCancel = () => {
        this.$store.commit('SET_RECOMMEND_GESTURE',false);
    }

    onSure = () => {
        this.$store.commit('SET_RECOMMEND_GESTURE',false);
        this.$router.push('GesturePasswordSet');
    }

	render() {
		return (
			<View style={styles.root} onLayout={this.onLayout}>
				<StatusBar
                    // hidden={true}
					barStyle={'dark-content'}
                    translucent={this.state.androidTranslucent}//Android
                    backgroundColor={this.state.androidNavBgColor}//Android
				/>
                {
                	this.state.showApproach && <Approach></Approach>
                }
                {
                	this.state.loading && (
                    <ImageBackground
                        fadeDuration={0}
                        source={loadingImage}
                        style={styles.loadingImg}
                        resizeMode={'contain'}
                    >
                        {/*{*/}
                            {/*// this.state.AnimateFinished &&*/}
                            {/*// <Image*/}
                            {/*//     fadeDuration={0}*/}
                            {/*//     source={loadingFinish}*/}
                            {/*//     style={styles.loadingImg}*/}
                            {/*//     resizeMode={'contain'}*/}
                            {/*// />*/}
                            {/*// || null*/}

                            {/*this.$store.state.webviewUrl.map((v,i)=>*/}
                                {/*<WebView*/}
                                    {/*key={i}*/}
                                    {/*source={{uri: v}}*/}
                                    {/*style={[{*/}
                                        {/*opacity:0*/}
                                    {/*}]}*/}
                                    {/*mixedContentMode={'always'}*/}
                                {/*/>*/}
                            {/*)*/}
                        {/*}*/}
                        {/*<WebView*/}
                            {/*ref={'win'}*/}
                            {/*source={{uri: ''}}*/}
                            {/*// source={require('../assets/chart/index2.html')}*/}
                            {/*style={[{*/}
                                {/*opacity:0*/}
                            {/*}]}*/}
                            {/*mixedContentMode={'always'}*/}
                        {/*/>*/}
                    </ImageBackground>

				) ||
					<MyApp
                    ref={navigatorRef => {
                        if (!navigatorRef || !navigatorRef._navigation) return
                        this.$router.setDrawerNavigation(navigatorRef._navigation, navigatorRef.state.nav)
                    }}
                    screenProps={{}}
                />}
				{
                    this.modalShow &&
                    <Modal
                        animationIn={'fadeIn'}
                        animationOut={'fadeOut'}
                        isVisible={this.modalShow}
                        backdropColor={'black'}
                        backdropOpacity={0.5}
                    >

                            {true &&
                                <ImageBackground source={updateBackImg} style={styles.updateBox}>
                                    <View style={styles.updateVersionBox}>
                                        <Text style={styles.updateVersionText}>{this.updateVersionName != '' && this.updateVersionName || ''}</Text>
                                    </View>
                                    <BaseButton
                                        onPress={this.onPressUpdate}
                                        style={[styles.updateBtn]}
                                        textStyle={[styles.updateBtnText]}
                                        activeOpacity={StyleConfigs.activeOpacity}
                                        text={'立即更新'}
                                    />
                                </ImageBackground>
                                ||
                                <ImageBackground source={updateBackImg} style={styles.updateBox}>
                                    <View style={styles.updateVersionBox}>
                                        <Text style={styles.updateVersionText}>{this.updateVersionName != '' && this.updateVersionName || ''}</Text>
                                    </View>

                                    <View style={[BaseStyles.flexRowBetween,styles.updateBtnBox]}>
                                        <BaseButton
                                            onPress={this.onPressUpdate}
                                            style={[styles.updateBtnLeft]}
                                            textStyle={[styles.updateBtnText]}
                                            activeOpacity={StyleConfigs.activeOpacity}
                                            text={'中国大陆下载'}
                                        />
                                        <BaseButton
                                            onPress={this.onInternationalUpdate}
                                            style={[styles.updateBtnLeft,styles.updateBtnRight]}
                                            textStyle={[styles.updateBtnText,BaseStyles.textBlue]}
                                            activeOpacity={StyleConfigs.activeOpacity}
                                            text={'国际下载'}
                                        />
                                    </View>

                                </ImageBackground>
                            }

                    </Modal>

				}
				{
                    (!this.$store.state.gesture && this.$store.state.recommendGesture) &&
                    <MyConfirm
                        style={{marginTop:250}}
                        okText={'去开启'}
                        cancelText={'算了吧'}
                        title={'提示'}
                        message={'    新增手势登录功能，开启可更快登录交易！\n         您也可进入\"我的\"中开启 '}
                        close={null}
                        onSure={this.onSure}
						// onClose={this.onCancel}
                        onCancel={this.onCancel}
                    />
				}

			</View>
		)
	}

}




