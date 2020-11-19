/**
 * hjx 2018.4.16
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ListView,
    WebView,
    FlatList,
    Keyboard,
    SectionList,
    Platform, AsyncStorage
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import BaseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import BaseTabView from './baseComponent/BaseTabView'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Toast from 'react-native-root-toast'
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import device from "../configs/device/device";
import Loading from './baseComponent/Loading'
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaseDefaultBar from './baseComponent/BaseDefaultBar'
import GestureProgressBar from './GestureProgressBar'
import signBaseStyles from "../style/SignBaseStyle";
import BaseButton from "./baseComponent/BaseButton";

// const WEBVIEWRESOURCE = {
//     uri: ''
// }

// const WEBVIEWRESOURCE = require('../assets/chart/chart/index_min.html');

const WEBVIEWRESOURCE = Platform.select({
    ios: require('../assets/chart/chart/index_min.html'),
    android: __DEV__ && require('../assets/chart/chart/index_min.html') || {uri:"file:///android_asset/chart/chart/index_min.html"},
});
const loadingImg = require('../assets/TraddingHall/gif.gif');

let bar = new Promise(function(resolve){});
let loadBar = function(){
    return bar;
}

@observer
export default class Deal extends RNComponent {
    loadBar(){
        bar = new Promise((resolve,reject)=>{

            var symbol = this.$store.state.symbol
            AsyncStorage.getItem(symbol).then((data)=>{

                //如果本地缓存中存在
                if(data){

                    data && (data = JSON.parse(data))
                    // data && this.re_getBars('','',data);
                    // console.log('this is AsyncStorage symbol为'+symbol+'的K线',data);

                    let startTime = data.nextStartTime

                    if(data.bars instanceof Array && data.bars.length == 0){
                        startTime = this.$store.state.serverTime - 365*24*3600*1000
                    }

                    let lastDate = new Date(startTime);
                    let nowDate = new Date();
                    //如果本月昨天的K线已经存在，不需要再调取接口，直接渲染本地数据
                    if(lastDate.getMonth() == nowDate.getMonth()  &&  lastDate.getDate() == nowDate.getDate() - 1){
                        console.log('昨天的K线已经存在，不需要再调取接口，直接渲染本地数据');
                        resolve(data);//TODO
                        // this.re_getBars('','',data)
                        return;
                    }

                    let _type = 'K_1_DAY';
                    var url = '/v1/market/bars/'+symbol+'/'+ _type;
                    this.$http.urlConfigs['BARS_'+symbol] = {url:url, method: 'get'};
                    this.$http.send('BARS_'+symbol, {
                        bind: this,
                        query: {
                            start: startTime,
                            end: this.$store.state.serverTime
                        },
                        callBack: this.re_joinBars.bind(this,resolve,symbol,data)
                    })

                }else{
                    //如果本地缓存中没有
                    // this.getBars();
                    console.log('本地缓存中没有'+symbol+'的数据');
                    let _type = 'K_1_DAY';
                    var url = '/v1/market/bars/'+symbol+'/'+ _type;
                    this.$http.urlConfigs['BARS_'+symbol] = {url:url, method: 'get'};
                    let startTime = this.$store.state.serverTime - 365*24*3600*1000
                    this.$http.send('BARS_'+symbol, {
                        bind: this,
                        query: {
                            start: startTime,
                            end: this.$store.state.serverTime
                        },
                        callBack: this.re_setKLineToAsyncStorage.bind(this,resolve, symbol)
                    })

                }
            })



            // var o = this;
            // var url = '/v1/market/bars/' + this.$store.state.symbol + '/' + 'K_1_DAY';
            // this.$http.urlConfigs.BARS = {url: url, method: 'get'};
            // this.$http.send('BARS', {
            //     bind: this,
            //     query: {
            //         start: this.$store.state.serverTime-365*24*3600*1000,
            //         end: this.$store.state.serverTime
            //     },
            //     callBack: (...arg) => {
            //         console.log('this is deal',arg)
            //         console.log('this is deal',...arg)
            //         resolve(...arg);
            //     }
            // })
        })
        return bar;
    }

    re_joinBars = (resolve,symbol,data,d)=>{
        console.log(symbol+'需要拼接的两分数据',data,d)

        //如果缓存中的最后一条数据和接口获取的第一条相同，删除缓存中的最后一条
        if(d && JSON.stringify(data.bars[data.bars.length-1]) == JSON.stringify(d.bars[0])){
            console.log('缓存中的最后一条数据和接口获取的第一条相同');
            // data.bars.length--;
            data.bars.splice(data.bars.length-1,1);
        }
        data.bars = data.bars.concat(d.bars)
        // console.log('需要拼接的两分数据',data)
        data && resolve(data);//TODO
        // data && this.re_getBars('','',data);

        //页面渲染后需要重新保存在本地缓存
        let bars = data.bars;
        //默认最后一条数据的时间是下一次更新的开始时间
        data.nextStartTime = bars.length > 0 ? bars[bars.length - 1][0] : (this.$store.state.serverTime - 2 * 24 * 60 * 60 * 1000);
        console.log('this is symbol为'+symbol+'的K线',data);
        AsyncStorage.setItem(symbol,JSON.stringify(data))
    }

    re_setKLineToAsyncStorage = (resolve,symbol,d)=>{
        if(!d)return;

        // this.re_getBars('','',d)
        resolve(d)//TODO

        let bars = d.bars;
        //默认最后一条数据的时间是下一次更新的开始时间
        d.nextStartTime = bars.length > 0 ? bars[bars.length - 1][0] : (this.$store.state.serverTime - 2 * 24 * 60 * 60 * 1000);
        console.log('this is traddinghall 中 symbol为'+symbol+'的K线',d);
        AsyncStorage.setItem(symbol,JSON.stringify(d))

        // setTimeout(()=>{
        //     AsyncStorage.getItem(symbol).then((data)=>{
        //         console.log('this is AsyncStorage symbol为'+symbol+'的K线',data);
        //     })
        // })
    }

    componentWillMount(){
        this.listen({key:'SET_TAB_INDEX',func:this.listenOnIndexChange});
        loadBar = this.loadBar.bind(this);
        this.loadBar();
    }
    // shouldComponentUpdate(nextProps, nextState) {

        // console.log('**************nextProps',nextProps);
        // console.log('**************nextState',nextState);
        // console.log('**************this.state.index === nextState.index',this.state.index === nextState.index);
        // return this.componentUpdate || this.state.index === nextState.index;
    // }

    componentDidMount(){
        super.componentDidMount();
        // if(this.scrollTabView)
        //     this.scrollTabView.goToPage(0);
    }
    @observable
    componentUpdate = false;

    // @observable
    state = {
        index: 0,
        routes: [
            {key: 'buy', title: '买入'},
            {key: 'sell', title: '卖出'},
            {key: 'currentOrder', title: '当前委托'}
        ]
    }



    @action    goBack = () => {
        this.$router.goBack()
    }


    @action    listenOnIndexChange = (index) => {

        // console.log('this.tab==========',this.tab);
        // this.tab.props.activeTab = index;

        // console.log('设置后this.tab==========',this.tab);

        try{
            this.componentUpdate = true;
            if(this.scrollTabView)
                this.scrollTabView.goToPage(index);

            this.notify({key: 'CLEAR_INPUT'});

            setTimeout(()=>{
                this.componentUpdate = false;
            },200)
        }catch(ex){
            alert('切换tab错误' + '  ' + ex.toString());
            console.log('切换tab错误',ex);
        }
    }

    @action
    onIndexChange = (() => {
        let last = 0;
        let lastIndex = 0;
        let lastShowLogin = false;
        return ({i,from}) => {
            if (Date.now() - last < 1000 && i == lastIndex){
                return;
            }
            last = Date.now();
            lastIndex = i;
            // console.log('this.tab==========',this.tab);
            if (i == 2) {
                //进入当前委托页需要登录
                if (!this.$store.state.authMessage.userId) {
                    if(this.scrollTabView)
                        this.scrollTabView.goToPage(from);
                    if(Date.now() - lastShowLogin < 1000){
                        return;
                    }
                    lastShowLogin = Date.now();
                    this.$router.push('Login');
                    return;
                }

                this.notify({key: 'RE_CURRCENY_ORDER'});
                this.notify({key: 'CLEAR_INPUT'},true);

            } else {
                this.notify({key: 'CLEAR_INPUT'});
            }
        }
    })()

    @action canJumpToTab = (tab) => {
        if(tab.key == 'currentOrder'){
            if (!this.$store.state.authMessage.userId){
                this.$router.push('Login');
                return false;
            }
            // this.notify({key: 'RE_CURRCENY_ORDER'});

        }

        return true;
    }


    clickTitle = (() => {
	    let last = 0;
	    return (...paras) => {
		    if (Date.now() - last < 1000) return;
		    last = Date.now();
		    this.$router.push('MarketList', {transition: 'forVertical'})
            setTimeout(()=>{
                this.notify({key:'CLEAR_INPUT'},true);
            })
        }
    })()



    clickLeft = (() => {
	    let last = 0;
	    return (...paras) => {
		    if (Date.now() - last < 1000) return;
		    last = Date.now();
		    this.$router.push('TraddingHall')
		    // this.$router.push('TraddingHall',{transition:'forVertical'})
            setTimeout(()=>{
                this.notify({key: 'CLEAR_INPUT'});
            })
	    }
    })()


    goHistory = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            if (!this.$store.state.authMessage.userId) {//进入历史委托页需要登录
                this.$router.push('Login');

                return
            }

            this.$router.push('HistoryOrder')
            this.notify({key: 'CLEAR_INPUT'})
        }
    })()

    render() {
        return (
            <View
                onLayout={(e)=>{
                    console.log('e.nativeEvent.layout.height',e.nativeEvent.layout.height);
                    // this.$store.commit('SET_DEVICE_HEIGHT_STATE', e.nativeEvent.layout.height);
                }}
                style={[styles.container,BaseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>
                <NavHeader
                    headerTitle={this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}
                    goBack={this.goBack}
                    touchComp={<View style={{flexDirection: 'row',alignItems:'center'}}>
                        <Text allowFontScaling={false} style={{
                            color:StyleConfigs.txt172A4D,fontSize:StyleConfigs.fontSize17
                        }}>{this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}</Text>
                        <Image source={require('../assets/TraddingHall/xiajiantou.png')}
                               style={{width: 8, height: 4,  marginLeft: 5}}/>
                    </View>}
                    touchCompClick={this.clickTitle}

                    touchCompLeft={<Image style={{width: getWidth(40), height: getDealHeight(40)}}
                                          source={require('../assets/TraddingHall/qiehuan.png')}
                                          resizeMode={'contain'}
                    />}
                    touchCompLeftClick={this.clickLeft}

                    headerRightTitle={'历史委托'}
                    headerRightOnPress={this.goHistory}

                />

                <ScrollableTabView
                    style={{flex: 1}}
                    ref = {(scrollTabView)=>{this.scrollTabView = scrollTabView}}
                    renderTabBar={() =>
                        <BaseDefaultBar
                            tabLabels={['买入','卖出','当前委托']}
                            tabUnderlineWidth={[getWidth(60),getWidth(60),getWidth(108)]}
                            tabBarBackgroundColor={StyleConfigs.navBgColor0602}
                            tabInActiveColor={'#9FA7B8'}
                        />
                    }
                    initialPage={0}
                    // page={1}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#3576F5'
                    tabBarInactiveTextColor='#9FA7B8'
                    tabBarTextStyle={{fontSize: 14,marginBottom:getHeight(-22),color:'#9FA7B8'}}
                    tabBarUnderlineStyle={{
                        backgroundColor: '#3576F5',
                        height:getDealHeight(4),
                        // width:getDealHeight(DeviceWidth*2/5),
                        // marginLeft:getDealHeight(DeviceWidth*2/13)
                        marginLeft: DeviceWidth / 6 - (4 * 14 / 2),
                        width: (4 * 14),
                        borderRadius:getHeight(4)
                    }}
                    onChangeTab={this.onIndexChange}
                    prerenderingSiblingsNumber={1}
                >

                    <DealItem tabLabel={' 买入 '} type={0}/>
                    <DealItem tabLabel={' 卖出 '} type={1}/>
                    <CurrentOrder tabLabel={' 当前委托 '} type={2}/>
                </ScrollableTabView>
            </View>
        )
    }
}


@observer
class DealItem extends RNComponent {

    @computed get exchangRateDollar(){
        return this.$store.state.exchangRateDollar
    }

    @computed get newPrice() {
        return this.$store.state.newPrice || {}
    }

    @computed get sellOrders() {
        if (!this.$store.state.depthMerge || !this.$store.state.depthMerge.sellOrders)
            return {sellOrders:[],totalAmount:1};

        let sellOrders = this.$store.state.depthMerge.sellOrders.slice(0, 9)
        let totalAmount =  sellOrders.reduce( (pre,curr)=>
            curr.perAmount= this.$globalFunc.accAdd((curr && curr.amount || 0),pre)
            ,0);
        // (curr && curr.amount || 0)+pre
        // console.log('this is sellOrders',sellOrders);
        totalAmount == 0 && (totalAmount = 1)
        return {sellOrders:sellOrders,totalAmount:totalAmount}
    }

    @computed get buyOrders() {
        if (!this.$store.state.depthMerge || !this.$store.state.depthMerge.buyOrders)
            return {buyOrders:[],totalAmount:1};

        let buyOrders = this.$store.state.depthMerge.buyOrders.slice(0, 9)
        let totalAmount =  buyOrders.reduce( (pre,curr)=>
            curr.perAmount = this.$globalFunc.accAdd((curr && curr.amount || 0),pre)
            ,0);
        // (curr && curr.amount || 0)+pre
        totalAmount == 0 && (totalAmount = 1)
        return {buyOrders:buyOrders,totalAmount:totalAmount}
    }

    @computed get symbol() {
        return this.$store.state.symbol;
    }

    @computed get marketUseRate() {
        if (!this.$store.state.marketUseRate || !this.$store.state.marketUseRate[this.symbol.split('_')[1]])
            return '';

        return this.$store.state.marketUseRate[this.symbol.split('_')[1]];
    }

    @computed get tradeLObj() {
        if (this.$store.state.tradeList && this.$store.state.tradeList[this.symbol])
            return this.$store.state.tradeList[this.symbol];

        return {};
    }

    @computed get getCurrAsset() {

        return this.$store.state.currency.get(this.props.type && this.symbol.split('_')[0] || this.symbol.split('_')[1]) || {};
    }

    @computed get priceNow() {
        return this.$store.state.newPrice || this.$store.state.depthMerge || {}
    }

    @computed
    get marketPriceMerge() {
        return this.$store.state.marketPriceMerge && this.$store.state.marketPriceMerge[this.$store.state.symbol] || {}
    }

    @computed
    get allDealData() {
        // return [];
        return this.$store.state.allDealData
    }

    @computed
    get deviceHeightState() {
        // return [];
        return this.$store.state.deviceHeightState
    }

	@observable
	fee = 0

    componentWillUpdate(){
        if(this.oldSymbol !== null && this.oldSymbol != this.$store.state.symbol){
            //第二次
            loadBar();
            this.getBars(true);
        }
        this.oldSymbol = this.$store.state.symbol;
        // console.log('**************deal只需要渲染一次',this.props.type);

    }
	componentWillMount() {
		this.oldSymbol = null;
        this.getBars();
        // 如果没有获取

        // if (!this.$store.state.currency) {
        // 	this.getCurrency()
        // } else {
        // 	// this.currencyReady = true
        // 	// this.loading = !(this.currencyReady && this.accountReady && this.authStateReady)
        // 	this.getAccounts()
        // }

        this.listen({key:'ON_DEVICE_LAYOUT',func:this.listenOnDeviceLayout});


    }


    componentDidMount() {
        this.getAuthState();
        this.initListen();
        //this.getBars();


        this.listen({key: 'CLEAR_INPUT', func: this.clearInput});
        this.listen({key: 'onNetworkStateChange',func: this.sendNetWorkState})
    }


    // 判断验证状态
    @action
    getAuthState = () => {
        this.$http.send('GET_AUTH_STATE', {
            bind: this,
            callBack: this.re_getAuthState,
            errorHandler: this.error_getAuthState
        })
        return
    }


    // 判断验证状态回调
    @action
    re_getAuthState = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return

        console.log('Deal验证返回================', data);


        this.$store.commit('SET_AUTH_STATE', data.dataMap)
    }
    // 判断验证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
    }


    // 获取币种
    @action
    getCurrency = () => {
        this.$http.send('GET_CURRENCY', {
            bind: this,
            callBack: this.re_getCurrency,
            errorHandler: this.error_getCurrency,
        })
    }

    // 获取币种的状态
    @action
    re_getCurrency = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data.dataMap || !data.dataMap.currencys) {
            return
        }
        this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
        // this.currencyReady = true
        // this.loading = !(this.currencyReady && this.authStateReady && this.authStateReady)
        this.getAccounts()
    }


    //获取账户信息
    @action
    getAccounts = () => {
        if (!this.$store.state.authMessage.userId) return
        // 请求各项估值
        this.$http.send('GET_ACCOUNTS', {
            bind: this,
            callBack: this.re_getAccount,
            errorHandler: this.error_getAccount
        })
    }

    // 获取账户信息回调
    @action
    re_getAccount = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data || !data.accounts) {
            return
        }
        this.$store.commit('CHANGE_ACCOUNT', data.accounts)
        // this.accountReady = true
        // this.loading = !(this.currencyReady && this.authStateReady && this.authStateReady)
        // 关闭loading
    }


    @observable
    listData = []
    // @observable
    //
    // placeholderPrice = '价格' + '(' + this.$store.state.symbol.split('_')[1] + ')'
    //
    // @observable
    // placeholderAmount = '数量' + '(' + this.$store.state.symbol.split('_')[0] + ')'

    @computed get placeholderPrice() {
        return '价格' + '(' + this.$store.state.symbol.split('_')[1] + ')'
    }

    @computed get placeholderAmount() {
        return '数量' + '(' + this.$store.state.symbol.split('_')[0] + ')'
    }


    @observable    price = this.priceNow.price && this.marketUseRate && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate) || 0, this.tradeLObj.quoteScale || 8)
    // @observable    price = ''
    @observable    priceFlag = true
    @observable    priceCont = ''
    @observable    amount = ''
    @observable    amountFlag = true
    @observable    amountSellFlag = false
    @observable    amountCont = ''
    @observable    transFlag = true
    @observable    transCont = ''
    @observable    transAmount = 0
    @observable    tradeFlag = false
    @observable    oper = this.props.type && '卖出' || '买入'
    @observable    isLoading = true;
    @observable    secItemIndex = 0;
    @observable    secItemShow = 0;
    @observable    scrollClickFlag = true;

    @observable
    priceStyle = {};

    @observable
    amountStyle = {};



    clearInput = (flag,price) => {
        if(!flag){//打开marketlist的时候暂时不需要清空数据
            // this.price = this.priceNow.price && this.marketUseRate && (this.priceNow.price * this.marketUseRate) && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate) || 0, 2) || ''
            price > 0 && (this.price = price + '')
            this.amount = '';
            this.priceCont = '';
            this.amountCont = '';

            this.priceFlag = true;
            this.amountFlag = true;
            this.amountSellFlag = false;
            this.transFlag = true;
            this.tradeFlag = false;
            this.transCont = '';
            this.transAmount = 0;

            Keyboard.dismiss();

        }

        // let that = this;

        // setTimeout(()=>{
        //     that.price = that.priceNow.price && that.marketUseRate && (that.priceNow.price * that.marketUseRate) && that.$globalFunc.accFixed2((that.priceNow.price * that.marketUseRate) || 0, 2) || ''
        // },18)



        //最新成交初始化
        if(this.secItemIndex != 1)return;

        this.secScrollToLocation();
    }

    tradeOrder = () => {

        // Alert.alert("提示", "已是最新版本--", [
        // 	{
        // 		text: "我知道了", onPress: () => {
        // 			console.log("点了我知道了");
        // 		}
        // 	}
        // ])
        //
        // Toast.show('请进行手机认证或谷歌认证', {
        // 	duration: Toast.durations.LONG,
        // 	position: Toast.positions.BOTTOM
        // })

        Keyboard.dismiss();//隐藏数字键盘

        // 登录
        if (!this.$store.state.authMessage.userId) {
            this.$router.push('Login')
            return
        }

        // 判断是否绑定谷歌或手机，如果都没绑定
        if (!this.$store.state.authState.ga && !this.$store.state.authState.sms) {
            Alert.alert("提示", "为了您的资金安全，请先绑定谷歌验证或手机验证", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return
        }

        // 判断是否绑定邮箱
        if (!this.$store.state.authState.email) {
            Alert.alert("提示", "为了您的资金安全，请先绑定邮箱", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return
        }


        let available = this.getCurrAsset.available || '0';

        let text = this.price, tp = this.tradeLObj;
        let tl = text.length, zp = text.indexOf('.'),sp = text.indexOf(' '),plus = text.indexOf('+');

        let text2 = this.amount;
        let tl2 = text2.length, zp2 = text2.indexOf('.'),sp2 = text2.indexOf(' '),plus2 = text2.indexOf('+');



        // if (this.props.type && this.amount != '' && Number(this.amount) > Number(available)) {
        //
        //     Alert.alert("提示", "您的余额不足,请充值", [
        //         {
        //             text: "我知道了", onPress: () => {
        //                 console.log("点了我知道了");
        //             }
        //         }
        //     ])
        //
        //     return
        // }




        if (isNaN(text) || zp == 0 || text.indexOf('.', zp + 1) > -1 || text[text.length - 1] == '.' || sp>-1 || plus>-1) {
            Alert.alert("提示", "请输入正确的价格", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return

        }

        if (text.length > 1 && text[0] == '0' && text[1] != '.') {
            Alert.alert("提示", "请输入正确的价格", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return

        }


        if (zp > 0 && (tl - (zp + 1) - (tp.quoteScale || 8)) > 0) {
            Alert.alert("提示", '价格小数点后不能超过' + (tp.quoteScale || 8) + '位', [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])

            return;
        }

        if (!tp.quoteMinimum || tp.quoteScale < 0)
            return;


        var pnum = this.$globalFunc.accFixed(1*Math.pow(10,-tp.quoteScale), tp.quoteScale);

        if (/*text != '' &&*/ Number(text) < Number(pnum)) {
            Alert.alert("提示", '价格不能低于' + pnum, [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])

            return;
        }


        if (isNaN(text2) || zp2 == 0 || text2.indexOf('.', zp2 + 1) > -1 || text2[tl2 - 1] == '.' || sp2>-1 || plus2>-1) {
            Alert.alert("提示", "请输入正确的数量", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return

        }

        if (tl2 > 1 && text2[0] == '0' && text2[1] != '.') {
            Alert.alert("提示", "请输入正确的数量", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return

        }

        if (this.props.type && text2 != '' && Number(available) >= 0) {//卖出时持仓量限制
            if (Number(available)==0 || Number(available) < Number(text2)) {
                Alert.alert("提示", "您的余额不足,请充值", [
                    {
                        text: "我知道了", onPress: () => {
                            console.log("点了我知道了");
                        }
                    }
                ])

                return
            }
        }

        if (zp2 > 0 && (tl2 - (zp2 + 1) - (tp.baseScale || 0)) > 0) {

            Alert.alert("提示", tp.baseScale && ('数量小数点后不能超过' + tp.baseScale + '位') || '数量只能输入整数', [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])

            return;
        }


        if (!tp.baseMinimum || tp.baseScale < 0)
            return;

        var num = this.$globalFunc.accFixed(tp.baseMinimum, tp.baseScale);

        if (/*text2!= '' &&*/ Number(text2) < Number(num)) {

            Alert.alert("提示", '数量不能小于' + num, [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return

        }

        if (!this.props.type && Number(this.price * this.amount) > Number(available)) {

            Alert.alert("提示", "您的余额不足,请充值", [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])
            return
        }


        if (Number(this.price) > 0 && Number(this.amount) > 0) {
            if (Number(this.price) * Number(this.amount) < (this.tradeLObj.miniVolume || '0')) {
                this.transFlag = false;

                Alert.alert("提示", "交易额不能低于" + (this.tradeLObj.miniVolume || '0'), [
                    {
                        text: "我知道了", onPress: () => {
                            console.log("点了我知道了");
                        }
                    }
                ])

                return;
            }

            if (Number(this.price) * Number(this.amount) > 10000000) {
                this.transFlag = false;

                Alert.alert("提示", "交易额不能超过10000000", [
                    {
                        text: "我知道了", onPress: () => {
                            console.log("点了我知道了");
                        }
                    }
                ])

                return;
            }

        }




        let params = {
            symbol: this.$store.state.symbol,
            price: this.price,
            amount: this.amount,
            orderType: this.props.type,
            source :'iOS'
            // customFeatures: this.fee ? 65536 : 0
        }


        // if (this.$store.state.feeBdbState) {
        //     Object.assign(params, {customFeatures: 65536});
        // }



        this.tradeFlag = true;
        this.oper = '委托中';
        console.log('trade_params====',params)
        this.$http.send('TRADE_ORDERS',
            {
                bind: this,
                timeout:3000,
                params: params,
                callBack: this.Callback,
                errorHandler: this.RE_ERROR,
                timeoutHandler:this.timeoutHandler
            }
        )


    }

    Callback = (data) => {
        console.log('data====---', data)
        Keyboard.dismiss();//隐藏数字键盘
        Toast.show('挂单成功', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
        this.notify({key: 'RE_ACCOUNTS'})
        this.price = this.priceNow.price && this.marketUseRate && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate) || 0, this.tradeLObj.quoteScale || 8);
        this.amount = '';
        this.transAmount = '';
        this.tradeFlag = false;
        this.oper = this.props.type && '卖出' || '买入';

    }

    RE_ERROR = (err) => {
        console.log('交易买卖失败返回==========',err)
        Keyboard.dismiss();//隐藏数字键盘

        this.tradeFlag = false;
        this.oper = this.props.type && '卖出' || '买入';

        let err_type = err.data;
        let message = err.message

        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })

        if (err.error == 'Bad Request') {
            Alert.alert("提示", "请求错误", [
                {
                    text: "我知道了", onPress: () => {
                    }
                }
            ])
            return
        }

        if (message == 'user_cannot_trade') {
            Alert.alert("提示", "监测到您的账户存在异常行为，为了亲的资产安全，暂不可用，请联系客服处理", [
                {
                    text: "我知道了", onPress: () => {
                    }
                }
            ])
            return
        }

        switch (err_type) {
            case 'amount':
                Alert.alert("提示", "最多交易10000000个", [
                    {
                        text: "我知道了", onPress: () => {
                        }
                    }
                ])
                break;
            case 'price':
                Alert.alert("提示", "价格不能超过10000000", [
                    {
                        text: "我知道了", onPress: () => {
                        }
                    }
                ])
                break;
            case 'volume(price*amount)':
                Alert.alert("提示", "交易额不能超过10000000", [
                    {
                        text: "我知道了", onPress: () => {
                        }
                    }
                ])
                break;
            case 'symbol':
                Alert.alert("提示", "暂未开放", [
                    {
                        text: "我知道了", onPress: () => {
                        }
                    }
                ])
                break;
            case 'null':
                Alert.alert("提示", "余额不足请充值", [
                    {
                        text: "我知道了", onPress: () => {
                        }
                    }
                ])
                break;
            // case 'account_freeze_failed':
            // 	Alert.alert("提示", "资产冻结失败", [
            // 		{
            // 			text: "我知道了", onPress: () => {
            // 				console.log("点了我知道了");
            // 			}
            // 		}
            // 	])
            // 	break;
            default:
                Alert.alert("提示", "暂不可用", [
                    {
                        text: "我知道了", onPress: () => {
                        }
                    }
                ])
                break;
        }


    }

    // 超时
    timeoutHandler = ()=>{
        // this.$globalFunc.timeoutHandler
        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // console.log(log)
    //获取K线历史数据
    getBars(isChangeSymbol) {
        bar.then((...arg)=>{
            this.re_getBars.call(this,isChangeSymbol,...arg )
        })
    }

    re_getBars(isChangeSymbol, d) {
        // typeof(data) == 'string' && (data = JSON.parse(data));

        if (!d)
            return;

        var data = d.bars;
        var i, b;
        this.bars = [];
        for (var i = 0; i < data.length; ++i) {
            // t, OHLC, V
            b = data[i];
            this.bars.push({
                time: b[0],
                open: b[1],
                high: b[2],
                low: b[3],
                close: b[4],
                volume: b[5]
            });
        }
        this.bars = this.bars.sort((a,b)=>{return (a.time - b.time)});
        this.hasBars = true;
        // console.log('BARS======',this.bars);

		if(isChangeSymbol){
            this.reloadHistory();
		}else{
            if(this.hasLoad && this.hasBars)
                this.sendHistory();
		}
    }

    initListen() {
        // this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol})
        // this.$socket.emit('subscribe', {symbol: this.$store.state.symbol})
        // 获取k线数据
        this.listen({key: 'KLINE_DATA',func:this.sendSocket})
        // this.$socket.on({
        //     key: 'topic_bar',
        //     bind: this,
        //     callBack: (message) => {
        //
        //         let b = message.data;
        //         if (!b) return;
        //         // onRealtimeCallback(
        //         this.k_data = {
        //             time: b[0],
        //             open: b[1],
        //             high: b[2],
        //             low: b[3],
        //             close: b[4],
        //             volume: b[5]
        //         }
        //
        //         this.sendSocket();
        //     }
        // })
    }

    sendSymbol = () => {
        var d = {data: this.$store.state.symbol, type: 'symbol'};
        //this.chart.postMessage(JSON.stringify(d));
        this.chart.injectJavaScript('var symbol="' + this.$store.state.symbol + '"')
        //console.log(JSON.stringify(d));
    }

    reloadHistory = ()=>{
        var d = {data:this.bars, type: 'reloadHistory', symbol: this.$store.state.symbol};
        console.log('barchange-=========================',d)
        this.chart.postMessage(JSON.stringify(d));
    }

    sendHistory = ()=> {
        setTimeout(()=>{
            this.isLoading && (this.isLoading = false);
        })
        var d = {data: this.bars, type: 'history'};
        setTimeout(()=>{
            this.chart.postMessage(JSON.stringify(d));
        },500)
        // alert(new Date().getTime())
        //console.log(JSON.stringify(d));

    }

    sendSocket = (data)=> {
        var d = {data:data || {}, type: 'socket'};
        this.chart.postMessage(JSON.stringify(d));
        //console.log(JSON.stringify(d));
    }

    sendMessage = () => {
        this.hasLoad = true;
        this.sendSymbol();

        if (this.hasBars && this.hasLoad)
            this.sendHistory();

    }

    //向webview发送当前的网络状态
    sendNetWorkState = (isNONE)=>{
        this.chart.postMessage({
            type: 'networkStateChange',
            data: isNONE
        })
    }

    renderError=(e)=>{
        // console.log('renderError deal',e);
        if(e === 'NSURLErrorDomain'){
            return;
        }
    }

    @observable priceValue = ''

    @action
    clickPrice = (price) => {

        this.price = this.$globalFunc.accFixed(price, this.tradeLObj.quoteScale || 8);//保留精度
        this.verifyPrice();
    }


    //计算成交金额
    transactionAmount = (tp) => {

        if (this.price <= 0 || this.amount <= 0) {
            this.transAmount = 0;
            return;

        }
        let at = this.$globalFunc.accMul(this.price, this.amount);

        if (!this.props.type && Number(at) > Number(this.getCurrAsset.available)) {
            this.transAmount = 0;

            this.transFlag = false;
            this.transCont = '您的余额不足,请充值!';
            return;

        }
        if (Number(at)<Number(tp.miniVolume || '0')) {
            this.transAmount = 0;
            this.transFlag = false;
            this.transCont = '交易额不能低于' + (tp.miniVolume || '0') + '!';
            return;
        }
        if (Number(at)>10000000) {
            this.transAmount = 0;
            this.transFlag = false;
            this.transCont = '交易额不能超过10000000';
            return;
        }
        this.transAmount = this.$globalFunc.accFixed(at, tp.quoteScale);//精度处理;


        this.transCont = '';
        this.transFlag = true;


    }

    //按百分比计算买入卖出金额
    calculate = (point) => {
        var myAsset = this.getCurrAsset.available;
        console.log('=====================', myAsset);
        if ((Number(myAsset) !=0 && !Number(myAsset)) || Number(myAsset) < 0) return;

        let plus = this.price.indexOf('+');

        if ((!this.props.type && !Number(this.price)) || plus > -1) {
            this.priceFlag = false;
            this.priceCont = '请输入正确的价格!'
            return;
        }

        if (!this.props.type && Number(this.price)) {//买入
            var asset = this.$globalFunc.accMul(myAsset, point);
            this.amount = this.$globalFunc.accDiv(asset, this.price);
        } else if (this.props.type) {//卖出
            this.amount = this.$globalFunc.accMul(myAsset, point);
        }

        var tp = this.tradeLObj;
        this.amount = this.$globalFunc.accFixed(this.amount, tp.baseScale || 0);//精度处理
        this.verifyAmount();

        if(this.priceFlag && this.amountFlag)
            this.transactionAmount(tp);
    }

    //加号减号按钮点击事件
    calcuStep = (type, calcu) => {

        let tp = this.tradeLObj;
        let scale = (type == 'price') && 'quoteScale' || 'baseScale';//精度
        let verify = (type == 'price') && 'verifyPrice' || 'verifyAmount';
        let sv = (type == 'price') && 8 || 0;//如果接口未返回，默认价格8位，数量0位
        let svp = (type == 'price') && 0.00000001 || 1;
        let step = tp[scale] && (this.$globalFunc.accFixed(0, (tp[scale] || sv)  - 1) + '1') || svp;
        if (calcu == 'add')
            this[type] = this.$globalFunc.accAdd(Number(this[type]) && Number(this[type]) || 0, step);
        if (calcu == 'minus' && Number(this[type]) > 0)
            this[type] = this.$globalFunc.accMinus(Number(this[type]) && Number(this[type]) || 0, step);

        this[type] = this.$globalFunc.accFixed(Number(this[type]) && Number(this[type]) || 0, tp[scale] || sv);
        this[verify]();

    }


    //验证价格
    verifyPrice = () => {

        let text = this.price, tp = this.tradeLObj;
        let tl = text.length, zp = text.indexOf('.'),sp = text.indexOf(' '),plus = text.indexOf('+');

        if(text != ''){
            this.priceStyle = {
                'padding':0,
                'textAlign':'center'
            }
        }


        if (isNaN(text) || zp == 0 || text.indexOf('.', zp + 1) > -1 || text[text.length - 1] == '.' || sp>-1 || plus>-1) {
            this.priceFlag = false;
            this.priceCont = '请输入正确的价格!';
            this.transAmount = 0;
            return;

        }

        if (text.length > 1 && text[0] == '0' && text[1] != '.') {
            this.priceFlag = false;
            this.priceCont = '请输入正确的价格!';
            this.transAmount = 0;
            return;

        }

        if (zp > 0 && (tl - (zp + 1) - (tp.quoteScale || 8)) > 0) {
            this.priceFlag = false;
            this.priceCont = '价格小数点后不能超过' + (tp.quoteScale || 8) + '位!';
            this.transAmount = 0;
            return;
        }

        if (!tp.quoteMinimum || tp.quoteScale < 0)
            return;



        var num = this.$globalFunc.accFixed(1*Math.pow(10,-tp.quoteScale), tp.quoteScale);
        // console.log('************tp.quoteMinimum**********',tp.quoteMinimum);
        // console.log('************最小金额******************',tp.quoteScale);


        if (text != '' && Number(text) < Number(num)) {
            this.priceFlag = false;
            this.priceCont = '价格不能低于' + num + '!';
            this.transAmount = 0;
            return;
        }

        if(!this.props.type && text === ''){
            this.transCont = '';
            this.transFlag = true;
        }


        this.priceFlag = true;
        if(this.priceFlag && this.amountFlag)
            this.transactionAmount(tp);

    }
    //验证数量
    verifyAmount = () => {
        var text = this.amount, tp = this.tradeLObj;
        var tl = text.length, zp = text.indexOf('.'),sp = text.indexOf(' '),plus = text.indexOf('+');


        if(text != ''){
            this.amountStyle = {
                'padding':0,
                'textAlign':'center'
            }
        }

        if (isNaN(text) || zp == 0 || text.indexOf('.', zp + 1) > -1 || text[text.length - 1] == '.' || sp>-1 || plus>-1) {
            this.amountFlag = false;
            this.amountSellFlag = false;
            this.amountCont = '请输入正确的数量!';
            this.transAmount = 0;
            return;

        }

        if (text.length > 1 && text[0] == '0' && text[1] != '.') {
            this.amountFlag = false;
            this.amountSellFlag = false;
            this.amountCont = '请输入正确的数量!';
            this.transAmount = 0;
            return;

        }


        if (!tp.baseMinimum || tp.baseScale < 0)
            return;

        var num = this.$globalFunc.accFixed(tp.baseMinimum, tp.baseScale);
        //买入时最大成交量,暂时不做，如果加上此句话，前面需要对tp.maxAmount做非法验证，否则有可能引起闪退BUG，如值为''时
        // bnum = this.$globalFunc.accFixed(tp.maxAmount, tp.baseScale);



        // if (!this.props.type && Number(text) > Number(bnum)) {//买入时最大成交量,暂时不做
        //     this.amountFlag = false;
        //     this.amountCont = '不能大于' + bnum + '!';
        //     this.transAmount = 0;
        //     return;
        //
        // }


        if (this.props.type && text != '' &&  this.getCurrAsset.available >= 0) {//卖出时持仓量限制
            if (Number(this.getCurrAsset.available)==0 || Number(this.getCurrAsset.available) < Number(text)) {
                this.amountFlag = false;
                this.amountSellFlag = true;

                this.transFlag = false;
                this.transCont = '您的余额不足,请充值!';
                this.transAmount = 0;
                return;
            }
        }

        if (zp > 0 && (tl - (zp + 1) - (tp.baseScale || 0)) > 0) {
            this.amountFlag = false;
            this.amountSellFlag = false;
            this.amountCont = tp.baseScale && ('数量小数点后不能超过' + tp.baseScale + '位!') || '数量只能输入整数!';
            this.transAmount = 0;
            return;
        }

        if (text != '' && Number(text) < Number(num)) {
            this.amountFlag = false;
            this.amountSellFlag = false;
            this.amountCont = '数量不能小于' + num + '!';
            this.transAmount = 0;
            return;
        }

        // if(this.props.type){
            this.transFlag = true;
            this.transCont = '';
        // }


        this.amountFlag = true;
        if(this.priceFlag && this.amountFlag)
            this.transactionAmount(tp);

    }

    checkTimeAndPos = (obj)=>{
        if((obj.currentTimeStamp - obj.startTimeStamp) < 500 &&
            Math.sqrt((obj.currentPageX - obj.startPageX) * (obj.currentPageX - obj.startPageX) + (obj.currentPageY - obj.startPageY) * (obj.currentPageY - obj.startPageY)) < 15){
            return true;
        }
        return false;
    }

    clickLeft = (() => {

        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('TraddingHall')
            // this.$router.push('TraddingHall',{transition:'forVertical'})
        }

    })()

    onPressWebView = (e)=>{
        console.log(e.touchHistory)
        if(e && e.touchHistory && e.touchHistory.touchBank && e.touchHistory.touchBank && (e.touchHistory.touchBank.length > 0) &&
            this.checkTimeAndPos(e.touchHistory.touchBank[e.touchHistory.touchBank.length - 1])){
            this.clickLeft()
        }
    }

    @action
    listenOnScroll = (ev)=> {
        // console.log('onScroll=========this.scrollClickFlag', ev.nativeEvent.contentOffset.y)
        this.secItemShow = true;

        if (getDeviceTop() != 0 && ev.nativeEvent.contentOffset.y > 553 || ev.nativeEvent.contentOffset.y > 400){
            this.scrollClickFlag = true;
            this.secItemIndex = 1;
        }


        if(ev.nativeEvent.contentOffset.y < 5){

            this.scrollClickFlag = true;
            this.secItemIndex = 0;
            this.secItemShow = false;
        }

    }


    @action
    secScrollToLocation = ()=> {

        if(!this.scrollClickFlag)return;
        this.scrollClickFlag = false;
        // console.log('secScrollToLocation==========this.scrollClickFlag',this.$globalFunc.formatDateUitl(new Date().getTime(), 'hh:mm:ss'));

        this.secItemShow = true;
        this.secItemIndex = this.secItemIndex === 0 ?1:0;
        this.sectionList.scrollToLocation({
            itemIndex: this.secItemIndex
        })

        setTimeout(()=>{this.scrollClickFlag = true},2000);

    }


    listenOnDeviceLayout = (result) =>{
        this.dealPageHeight = ((result.realHeight-49)/global.RateDeviceHeight-55-80-88)*global.RateDeviceHeight
    }

    @observable
    dealPageHeight = !this.deviceHeightState.isShowSoftMenuBar
        &&
        ((this.deviceHeightState.realHeight-this.deviceHeightState.softMenuBar-49)/global.RateDeviceHeight-55-80-88)*global.RateDeviceHeight
        ||
        ((this.deviceHeightState.realHeight-49)/global.RateDeviceHeight-55-80-88)*global.RateDeviceHeight



    @action
    renderDealPage = ()=>{
        return (

            //交易买卖页面
            <View style={[styles.container2,{height:this.dealPageHeight || 'auto'}]}>

                <View style={styles.halfBox1}>
                    <View style={{marginVertical:getDealHeight(20)}}><Text allowFontScaling={false}
                                                                       style={{fontSize: StyleConfigs.fontSize13, color: StyleConfigs.txt172A4D}}>限价单</Text></View>
                    <View style={[styles.iptBox]}>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.calcuStep('price', 'minus')

                            }}
                            style={styles.imgBox}
                        >
                            <Image source={require('../assets/Deal/jianhao.png')} style={styles.img}></Image>
                        </TouchableOpacity>
                        <TextInput
                            allowFontScaling={false}
                            ref={'ipt'}
                            style={styles.ipt}
                            placeholder={this.placeholderPrice}
                            placeholderTextColor={StyleConfigs.txtC5CFD5}
                            underlineColorAndroid={'transparent'}
                            keyboardType="numeric"
                            returnKeyType={'done'}
                            onChangeText={(text) => {

                                this.price = text;
                                this.verifyPrice();

                            }}

                            value={this.price}

                        />

                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.calcuStep('price', 'add');
                            }}
                            style={styles.imgBox}
                        >
                            <Image source={require('../assets/Deal/jiahao.png')} style={styles.img}></Image>
                        </TouchableOpacity>
                    </View>


                    {
                        this.priceFlag &&
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical:getDealHeight(15),
                        }}>
                            <Text allowFontScaling={false} style={{color:StyleConfigs.txtC5CFD5,fontSize:StyleConfigs.fontSize12}}>估值</Text>
                            <Text allowFontScaling={false}
                                  style={[{flex: 1,textAlign:'right',color:StyleConfigs.txt9FA7B8,fontSize:StyleConfigs.fontSize12}]}
                                  ellipsizeMode='tail'
                                  numberOfLines={1}
                            >¥{this.price && this.marketUseRate && this.$globalFunc.accFixed2(this.price * this.marketUseRate * this.exchangRateDollar || 0, 2) || '0.00'}</Text>

                        </View>
                        ||
                        <View style={{
                            flexDirection: 'row',
                            marginVertical:getDealHeight(15)
                        }}>
                            <Text allowFontScaling={false} style={{'color': '#3576F5'}}>{this.priceCont}</Text>
                        </View>

                    }
                    <View style={styles.iptBox}>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.calcuStep('amount', 'minus');
                            }}
                            style={styles.imgBox}
                        >
                            <Image source={require('../assets/Deal/jianhao.png')} style={styles.img}></Image>
                        </TouchableOpacity>
                        <TextInput
                            allowFontScaling={false}

                            style={styles.ipt}
                            placeholder={this.placeholderAmount}
                            placeholderTextColor={StyleConfigs.txtC5CFD5}
                            underlineColorAndroid={'transparent'}
                            keyboardType={"numeric"}
                            returnKeyType={'done'}

                            onChangeText={(text) => {
                                this.amount = text;
                                this.verifyAmount();

                            }}

                            value={this.amount}
                        />
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.calcuStep('amount', 'add');
                            }}
                            style={styles.imgBox}
                        >
                            <Image source={require('../assets/Deal/jiahao.png')} style={styles.img}></Image>
                        </TouchableOpacity>
                    </View>


                    <View style={[{
                        // height:20,
                        // marginTop:-30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // marginVertical:getDealHeight(15),
                        // zIndex:999安卓加上了这个属性小提示框不会显示的
                    },PlatformOS == 'ios' && {zIndex:999} || {}]}>
                        <GestureProgressBar
                            color={this.props.type == 0 ? '#86CB12' : '#EF5656'}
                            onProgress={(progress)=>{

                                // console.log('this is progress',progress/100);

                                this.calculate(progress/100);
                            }}
                        />
                    </View>


                    {
                        !this.transAmount &&
                        <View style={styles.totalMoney}>
                            <Text allowFontScaling={false}
                                  style={[{color:StyleConfigs.txtC5CFD5}, styles.size13]}>成交金额({this.$store.state.symbol.split('_')[1]})</Text>
                        </View>

                        ||
                        <View style={styles.totalMoney}>
                            <Text allowFontScaling={false}
                                  style={[{color:StyleConfigs.txtC5CFD5}, styles.size13]}>{this.transAmount + this.$store.state.symbol.split('_')[1]}</Text>
                        </View>

                    }
                    {
                        this.transFlag &&
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical:(getDeviceTop() != 0) && getDealHeight(19) || getDealHeight(14)
                        }}>
                            <Text allowFontScaling={false} style={[styles.colorC5CFD5, styles.size13]}>可用</Text>
                            <Text allowFontScaling={false} style={[styles.color172A4D, styles.size13]}>
                                {(this.$store.state.authMessage.userId && this.getCurrAsset.available || '0') + ' ' + (this.props.type && this.symbol.split('_')[0] || this.symbol.split('_')[1])}
                            </Text>
                        </View>
                        ||
                        <View style={{
                            height:(getDeviceTop() != 0) && getDealHeight(65) || getDealHeight(60),
                            flexDirection: 'row',
                            // marginVertical:(getDeviceTop() != 0) && getDealHeight(18) || getDealHeight(14)
                            paddingTop:(getDeviceTop() != 0) && getDealHeight(17) || getDealHeight(14)
                        }}>
                            <Text allowFontScaling={false} style={{'color': '#3576F5'}}>{this.transCont}</Text>
                        </View>

                    }


                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={this.props.type && styles.dealBtnRed || styles.dealBtnGreen}
                        onPress={this.tradeOrder}
                        disabled={this.tradeFlag}
                    >
                        <Text allowFontScaling={false} style={[styles.color100, styles.size16]}>{this.oper}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            height: getDealHeight(380),
                            marginTop: getDealHeight(16),
                        }}
                        activeOpacity={1}
                        onPress={
                            this.onPressWebView
                        }
                    >
                        <WebView
                            renderError={this.renderError}
                            ref={(chart)=>{
                                if(!chart)return;
                                    this.chart = chart
                            }}
                            style={
                                {
                                    width: getWidth(344),
                                    height: getDealHeight(380),
                                    backgroundColor: 'transparent'
                                }
                            }
                            source={WEBVIEWRESOURCE}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            decelerationRate="normal"
                            // onLoad={this.sendMessage}
                            onLoadEnd={this.sendMessage}
                            allowUniversalAccessFromFileURLs={true}//安卓专用，允许跨域
                            scalesPageToFit={false}
                            mixedContentMode={'always'}
                        />
                        {!!this.isLoading && <View
                            style={{
                                position:'absolute',
                                top:0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: StyleConfigs.bgColor,
                                zIndex: 999,
                                alignItems:'center',
                                justifyContent:'center'
                            }}>
                            <Image
                                resizeMode={'contain'}
                                style={{
                                    width:'10%'
                                }}
                                source={loadingImg}
                            />
                        </View>}
                    </TouchableOpacity>

                </View>
                <View style={{width: 10}}></View>
                <View style={styles.halfBox2}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: getDealHeight(20),
                        marginBottom: getDealHeight(30)
                    }}>
                        <Text allowFontScaling={false}
                              style={[styles.colorC5CFD5, styles.size12]}>价格( {this.$store.state.symbol.split('_')[1]} )</Text>
                        <Text allowFontScaling={false}
                              style={[styles.colorC5CFD5, styles.size12]}>数量( {this.$store.state.symbol.split('_')[0]} )</Text>
                    </View>
                    <View style={{height: getDealHeight(382), flexDirection: 'column-reverse'}}>
                        {
                            !!this.sellOrders.sellOrders && this.sellOrders.sellOrders.length > 0 &&
                            this.sellOrders.sellOrders.map((o, i) => {
                                return <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    style={styles.line}
                                    key={'deal' + i}
                                    onPress={() => this.clickPrice(o.price)}>
                                    <View style={{
                                        // width: (this.tradeLObj.sellAmount === undefined && this.tradeLObj.maxAmount || this.tradeLObj.sellAmount) && o.amount && ((o.amount / (this.tradeLObj.sellAmount === undefined && this.tradeLObj.maxAmount || this.tradeLObj.sellAmount) > 1 ? 1 : o.amount / (this.tradeLObj.sellAmount === undefined && this.tradeLObj.maxAmount || this.tradeLObj.sellAmount)) * 100 + '%') || '0%',
                                        width: o.perAmount && ((o.perAmount / (this.sellOrders.totalAmount)) * 100 + '%') || '0%',
                                        // width:'100%',
                                        height: getDealHeight(38),
                                        backgroundColor: '#EF5656',
                                        opacity: 0.12,
                                        position: 'absolute',
                                        top: 1.5,
                                        left: 0
                                    }}/>
                                    <Text allowFontScaling={false} style={[styles.size13, {color:StyleConfigs.txt9FA7B8}]}>{this.$globalFunc.accFixed(o.amount, this.tradeLObj.baseScale || 2)}</Text>
                                    <Text allowFontScaling={false}
                                          style={[styles.size13, styles.colorRed]}>{this.$globalFunc.accFixed(o.price, this.tradeLObj.quoteScale || 8)}</Text>


                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={{marginTop:getDealHeight(5),flexDirection:'row',height: getDealHeight(96), justifyContent: 'center', alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={[this.marketPriceMerge[4] - this.marketPriceMerge[1] >= 0 && styles.colorGreen || styles.colorRed, styles.size16,{fontWeight:'bold'}]}>
                            {this.priceNow.price && this.$globalFunc.accFixed(this.priceNow.price || 0, this.tradeLObj.quoteScale || 8) || ''}
                            ¥{this.priceNow.price && this.marketUseRate && (this.priceNow.price * this.marketUseRate * this.exchangRateDollar) && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate * this.exchangRateDollar) || 0, 2) || '' }
                        </Text>
                        {this.marketPriceMerge[4] - this.marketPriceMerge[1] >= 0 &&
                        <Image source={require('../assets/Deal/zhang.png')} style={{width:getWidth(18),height:getDealHeight(24)}}/>
                        ||
                        <Image source={require('../assets/Deal/die.png')} style={{width:getWidth(18),height:getDealHeight(24)}}/>}


                    </View>
                    <View style={{height: getDealHeight(390),paddingTop:getDealHeight(8)}}>
                        {
                            !!this.buyOrders.buyOrders && this.buyOrders.buyOrders.length > 0 &&
                            this.buyOrders.buyOrders.map((o, i) => {
                                return <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    style={styles.line2}
                                    onPress={() => this.clickPrice(o.price)}
                                    key={'55a4' + i}>
                                    <View style={{
                                        // width: this.tradeLObj.maxAmount && o.amount && ((o.amount / this.tradeLObj.maxAmount > 1 ? 1 : o.amount / this.tradeLObj.maxAmount) * 100 + '%') || '0%',
                                        // width:'100%',
                                        width: o.perAmount && ((o.perAmount / (this.buyOrders.totalAmount)) * 100 + '%') || '0%',
                                        height: getDealHeight(38),
                                        backgroundColor: '#86CB12',
                                        opacity: 0.12,
                                        position: 'absolute',
                                        top: 1.5,
                                        right: 0
                                    }}/>

                                    <Text allowFontScaling={false}
                                          style={[styles.size13, styles.colorGreen]}>{this.$globalFunc.accFixed(o.price,this.tradeLObj.quoteScale || 8)}</Text>
                                    <Text allowFontScaling={false} style={[styles.size13, {color:StyleConfigs.txt9FA7B8}]}>{this.$globalFunc.accFixed(o.amount, this.tradeLObj.baseScale || 2)}</Text>


                                </TouchableOpacity>
                            })
                        }
                    </View>


                </View>


            </View>


        );

    }

    //最新成交
    @action
    rendItemHeader = (secItemIndex) => {
        return (
            <View>
                {secItemIndex == 0 &&
                    <TouchableOpacity
                        style={styles.latestDealDown}
                        activeOpacity={0.9}
                        onPress={() => this.secScrollToLocation()}
                    >
                        <Text style={[styles.size13, {color: StyleConfigs.txt172A4D}]}>最新成交</Text>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/Deal/down.png')} style={styles.latestDealImage}></Image>
                    </TouchableOpacity>
                ||
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.latestDealDown}
                        onPress={() => this.secScrollToLocation()}
                    >
                        <Text style={[styles.size13, {color: StyleConfigs.txt172A4D}]}>最新成交</Text>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/Deal/up.png')} style={styles.latestDealImage}></Image>
                    </TouchableOpacity>
                }

                <View style={styles.latestDealHeader}>
                    <Text allowFontScaling={false} style={[styles.size13, styles.colorC5CFD5, {width: '27%'}]}>时间</Text>
                    <Text allowFontScaling={false} style={[styles.size13, styles.colorC5CFD5, {width: '35%',textAlign:'right'}]}>成交数量</Text>
                    <Text allowFontScaling={false} style={[styles.size13, styles.colorC5CFD5, {width: '38%',textAlign:'right'}]}>成交价格({this.$store.state.symbol.split('_')[1]})</Text>
                </View>
            </View>

        )
    }

    // 最新成交列表为空时渲染的组件
    @action
    renderEmpty = () => {
        return (
            <View style={[styles.emptyBox,PlatformOS == 'android' && {height:this.aheight || (DeviceHeight-getDealHeight(49+40+40+82+55+88))} || {}]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
            </View>
        )
    }

    @observable
    aheight = (this.dealPageHeight/global.RateDeviceHeight - 45)*global.RateDeviceHeight

    @action
    renderWait = () => {
        return (
            <View style={{width:'100%',height:this.aheight || (DeviceHeight-getHeight(49+40+40+82+55+88))}}>
                <Loading leaveNav={false}/>
                {/*<Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>*/}
            </View>
        )
    }

    // //最新成交列表
    // @action
    // renderAllDealPage = (data) =>{
    //     console.log(data);
    //
    //     return (
    //         <View style={{width:'100%',height:this.aheight}}>
    //             <FlatList
		// 			data={data || []}
		// 			renderItem={this.allListRenderRow}
		// 			keyExtractor={(item, index) => index.toString()}
    //                 initialNumToRender={20}
    //             />
    //         </View>
    //     )
    // }

    //最新成交列表行
    @action
    allListRenderRow = ({item}) => {
        return (
            <View style={styles.latestDealList}
            >
                <Text style={{width:'27%',color:StyleConfigs.txt9FA7B8}}>
                    {item.createdAt && this.$globalFunc.formatDateUitl(item.createdAt, 'hh:mm:ss') || ''}
                </Text>
                <Text style={{width:'35%',textAlign:'right',color:StyleConfigs.txt172A4D}}>
                    {item.amount && this.$globalFunc.accFixed(item.amount, this.tradeLObj.baseScale || 0) || ''}
                </Text>
                <Text style={[{width:'38%',textAlign:'right'},item.direction && styles.colorGreen || styles.colorRed]}>
                    {item.price && this.$globalFunc.accFixed(item.price,this.tradeLObj.quoteScale || 8) || ''}
                </Text>
            </View>
        )
    }


    @action
    listRenderRow = ({item}) => {
        if (item.name == 'dealPage')
            return this.renderDealPage();

        if (item.data.name == 'empty')
            return this.renderEmpty();

        if(!this.secItemShow)
            return this.renderWait();

        // return this.renderAllDealPage(item.data);
        //|| (DeviceHeight-getHeight(49+40+30+82+55+88))
        return (
            <View style={{width:'100%',height:this.aheight || 'auto',paddingBottom:PlatformOS == 'ios' && getDealHeight(20) || getDealHeight(2)}}>
                <FlatList
                    data={item.data || []}
                    renderItem={this.allListRenderRow}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={20}
                />
            </View>
        )

    }


    render() {

        let d = this.allDealData.length && [...this.allDealData] || {'name':'empty'}
        let secItemIndex = this.secItemIndex;//为了保证能监听到secItemIndex变化渲染不同组件

        return(

            <View style={[styles.container,BaseStyles.bgColor]}>
                <SectionList
                    style={{flex:1}}
                    stickySectionHeadersEnabled={true}
                    ref={sl => this.sectionList = sl}
                    renderItem={this.listRenderRow}
                    renderSectionHeader={({section}) => {
                        // console.log('section==imgNotice',section.key === 'imgNotice');
                        if(section.key === 'dealPage')return;

                        return this.rendItemHeader(secItemIndex);
                    }}
                    keyExtractor = {(item, index) => index.toString()}
                    //为了保证变量的值变化时能及时被渲染，需要将数据绑定到data里边
                    sections={[
                        {data:[{'name':'dealPage',price:this.price,priceFlag:this.priceFlag,priceCont:this.priceCont,amount:this.amount,
                                amountFlag:this.amountFlag,amountSellFlag:this.amountSellFlag,amountCont:this.amountCont,transFlag:this.transFlag,
                                transCont:this.transCont,transAmount:this.transAmount,tradeFlag:this.tradeFlag,oper:this.oper,newPrice:this.newPrice,
                                sellOrders:this.sellOrders.sellOrders,buyOrders:this.buyOrders.buyOrders,symbol:this.symbol,marketUseRate:this.marketUseRate,tradeLObj:this.tradeLObj,
                                getCurrAsset:this.getCurrAsset,priceNow:this.priceNow,marketPriceMerge:this.marketPriceMerge,isLoading:this.isLoading
                            }],key:'dealPage'},
                        {data:[{data:d}],key:'allDealData'}
                    ]}
                    onScroll = {(ev) => {this.listenOnScroll(ev)}}
                    scrollEventThrottle = {1}
                    // initialNumToRender={6}
                    keyboardShouldPersistTaps={'always'}//解决textinput点击两次才能获取焦点的问题
                />


            </View>
        )
    }
}


@observer
class CurrentOrder extends RNComponent {


    constructor(){
        super();
        this.state = {
            refreshing:false
        }
        console.log('deal只需要渲染一次',3);

    }

    @computed get tradeLObj() {
        return this.$store.state.tradeList || {};
    }


    componentDidMount() {
        this.getOrder()
        this.listen({key: 'RE_CURRCENY_ORDER', func: this.getOrder});

    }
    // 列表为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
            </View>
        )
    }


    @action
    listRenderRow = ({item, index}) => {

        let rowData = item
        //价格精度显示
        let quoteScale = this.tradeLObj[rowData.symbol] ? (this.tradeLObj[rowData.symbol].quoteScale || 8) : 8

        return (
            <View style={{
                height: getDealHeight(120),
                borderBottomColor: StyleConfigs.borderBottomColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
                paddingLeft: getWidth(20),
                paddingRight: getWidth(20),
                flexDirection: 'row',
                alignItems: 'center'
            }}
            >
                <View style={styles.rowV1}>
                    <View style={{marginBottom: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={rowData.type === 'BUY_LIMIT' && styles.ballGreen || styles.ballRed}><Text allowFontScaling={false}
                                style={[styles.color100, styles.size12]}>{rowData.type === 'BUY_LIMIT' && '买' || '卖'}</Text>
                            </View><Text allowFontScaling={false}
                            style={[styles.color172A4D, styles.size15]}>{rowData.symbol.split('_')[0]}</Text><Text allowFontScaling={false}
                            style={[styles.colorC5CFD5, styles.size13]}> / {rowData.symbol.split('_')[1]}</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 5}}>
                        <Text allowFontScaling={false}
                            style={[styles.colorC5CFD5, styles.size13]}>{this.$globalFunc.formatDateUitl(rowData.createdAt, 'MM-DD hh:mm:ss')}</Text>

                    </View>
                </View>
                <View style={styles.rowV2}>
                    <Text allowFontScaling={false} style={[styles.color172A4D, styles.size15]}>{this.$globalFunc.accFixed(rowData.price,quoteScale)}</Text>
                </View>

                <View style={styles.rowV3}>
                    <Text allowFontScaling={false} style={[styles.color172A4D, styles.size15, {marginBottom: 5}]}>{rowData.filledAmount}</Text>
                    <Text allowFontScaling={false} style={[styles.color9FA7B8, styles.size14, {marginTop: 5}]}>{rowData.amount}</Text>
                </View>

                <View style={styles.rowV4}>
                    <TouchableOpacity style={styles.chedan} onPress={() => this.cancelOrder(rowData, index)}
                                      /*disabled={rowData.chedan === '撤单中'}*/>
                        <Text allowFontScaling={false} style={{color: '#3576F5', fontSize: 12}}>{rowData.chedan}</Text>


                    </TouchableOpacity>
                </View>


            </View>
        )
    }

    @action
    rendItemHeader = () => {
        return (
            <View style={{
                paddingLeft: getWidth(20),
                paddingRight: getWidth(20),
                flexDirection: 'row',
                alignItems: 'center',
                // borderBottomWidth:1,
                // borderBottomColor: StyleConfigs.listSplitlineColor,
                backgroundColor: StyleConfigs.sectTitleColor,
                height: getDealHeight(60)
            }}>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '34%'}]}>市场</Text>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '29%'}]}>价格</Text>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '21%'}, {textAlign: 'right'}]}>成交量 / 数量</Text>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '16%'}, {textAlign: 'right'}]}>操作</Text>
            </View>
        )
    }


    refreshData = () =>{
        // console.warn('this is refreshing','刷新啦！');

        if(this.refreshFlag){
            this.refreshFlag = false;
            this.getOrder();
            return;
        }

    }


    @observable    clickOrder = new Set()
    @observable    currentOrder = []
    @observable    refreshFlag = true

    @observable currentOrderMap = new Map()

    getOrder() {
        if (!this.$store.state.authMessage.userId) {
            this.loading = false
            return
        }

        // this.loading = true
        this.$http.send('POST_USER_ORDERS',
            {
                bind: this,
                params: {
                    offsetId: 0,
                    limit: 200,
                    isFinalStatus: false,
                },
                callBack: this.re_getOrder,
            })
    }


    re_getOrder(data) {
        console.log('re_getOrder------', data)

        this.refreshFlag = true;
        this.currentOrderMap.clear()
        data.orders.forEach((val, key) => {
            val.chedan = '撤单'
            this.currentOrderMap.set(val.id, val)
        })
    }


    // 撤单
    @action
    cancelOrder = (order, index) => {

        let currentObj = this.currentOrderMap.get(order.id)

        currentObj.chedan = '撤单'

        currentObj = JSON.parse(JSON.stringify(currentObj))

        this.currentOrderMap.set(order.id, currentObj)


        let params = {
            targetOrderId: order.id,
            symbol: order.symbol,
            orderType: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY_LIMIT' : 'CANCEL_SELL_LIMIT',
            source :'iOS'
        }
        console.log('撤单参数===',params)

        this.$http.send('TRADE_ORDERS', {
            bind: this,
            params: params,
            callBack: this.re_cancelOrder,
            errorHandler: this.error_cancelOrder
        })
    }
    re_cancelOrder =  (data)=> {
        console.log("撤单返回！", data)

        setTimeout(()=>{
            Toast.show('撤单成功', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        },1000)

        setTimeout(()=>{
            this.getOrder();
        },2000)


    }

    error_cancelOrder = (data)=> {
        console.log("撤单返回_error_cancelOrder", data)

    }

    goToTrade = ()=>{
        this.notify({key: 'SET_TAB_INDEX'},0);
        this.notify({key: 'CLEAR_INPUT'},false);
    }


    render() {


        let currentOrder = [...this.currentOrderMap.values()]
        return (
            <View style={{backgroundColor:StyleConfigs.bgColor,flex:1}}>
                {/*{!this.$store.state.authMessage.userId }?

				<View style={{flexDirection:'row',justifyContent:'center'}}>
					<Text allowFontScaling={false} style={[styles.size14,styles.color100]}>请登录后查看</Text>
				</View> :*/}

                {
                    this.$store.state.authMessage.userId && (!!currentOrder.length) &&
                        <View style={styles.flatBox}>

                            <SectionList
                                style={[styles.container]}
                                stickySectionHeadersEnabled={true}
                                renderItem={this.listRenderRow}
                                renderSectionHeader={() => this.rendItemHeader()}
                                keyExtractor = {(item,index) => index.toString()}
                                sections={
                                    [{data:currentOrder,key:'currentOrder'}]
                                }
                                onRefresh={this.refreshData}
                                refreshing={this.state.refreshing}
                                // getItemLayout={(data, index) => ( {length: getDealHeight(120), offset: getDealHeight(120)* index, index})}

                            />
                        </View>
                    || this.$store.state.authMessage.userId &&
                        <View style={[styles.emptyBox]}>
                            <Image source={EmptyIcon} style={styles.emptyIcon}/>
                            <Text allowFontScaling={false} style={[styles.emptyText]}>暂无订单记录</Text>
                            <BaseButton
                                onPress={this.goToTrade}
                                style={[signBaseStyles.button,styles.toTradeBtn]}
                                textStyle={[signBaseStyles.buttonText,{fontSize:StyleConfigs.fontSize16}]}
                                activeOpacity={StyleConfigs.activeOpacity}
                                text={'去交易'}
                            />
                        </View>
                    ||
                    null

                }

            </View>
        );
    }
}

/**
 * 如果通过修改padding或者margin修改了本页面的总高度，需要修改函数listenOnScroll中ev.nativeEvent.contentOffset.y的最大值
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red'
    },

    listView: {
        // height:getDealHeight(600),
        marginTop: getDealHeight(20),
        backgroundColor: '#131316'
    },
    listTitleWrap: {
        height: getDealHeight(64),
        borderBottomWidth: 1,
        borderBottomColor: '#202126',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: getWidth(20),
        marginRight: getWidth(20)
    },
    listTitleBase: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)'
    },
    listTitle1: {
        width: '40%'
    },
    listTitle2: {
        width: '35%'

    },
    listTitle3: {
        width: '25%',
        textAlign: 'right'
    },
    listRowWrap: {
        height: getDealHeight(120),
        borderBottomWidth: 1,
        borderBottomColor: '#202126',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20)
    },
    rowBase: {},
    row1: {
        width: '40%'
    },
    row2: {
        width: '35%'
    },
    row3: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },


    size12: {fontSize: 12},
    size13: {fontSize: 13},
    size14: {fontSize: 14},
    size15: {fontSize: 15},
    size16: {fontSize: 16},
    color100: {color: '#fff'},
    color80: {color: StyleConfigs.txt9FA7B8},
    color9FA7B8: {color: StyleConfigs.txt9FA7B8},
    color40: {color: 'rgba(255,255,255,0.4)'},
    colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
    color172A4D: {color: StyleConfigs.txt172A4D},
    colorGreen: {color: '#86CB12'},
    colorRed: {color: '#EF5656'},
    bgGreen: {backgroundColor: '#86CB12'},
    bgRed: {backgroundColor: '#EF5656'},
    row3Btn: {
        width: getWidth(156),
        height: getDealHeight(58),
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },


    indicatorStyle: {
        backgroundColor: StyleConfigs.btnBlue,
        position: 'absolute',
        left: getWidth(750 / 10),/*getWidth(750 / 15),*/
        bottom: 0,
        right: 0,
        height: getDealHeight(4),
        width: getWidth(750 / 8),/*getWidth(750 / 5),*/
        alignSelf: 'center',
    },
    indicatorStyle2: {
        backgroundColor: StyleConfigs.btnBlue,
        position: 'absolute',
        left: getWidth(750 / 15),
        bottom: 0,
        right: 0,
        height: getDealHeight(4),
        width: getWidth(750 / 5),
        alignSelf: 'center',
    },
    tabBoxStyle: {
        height: getDealHeight(80),
        justifyContent: 'center'
    },


    container2: {
        // height:(604.33/global.RateDeviceHeight-55-80-88)*global.RateDeviceHeight,
        // flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
        backgroundColor: StyleConfigs.bgColor,
        // backgroundColor: 'green',
        paddingBottom:(getDeviceTop() != 0) && getDealHeight(6) || getDealHeight(8),
        // paddingVertical: getDealHeight(20),
        paddingHorizontal: getDealHeight(20),
        paddingTop:PlatformOS === 'ios' && (PlatformiOSPlus || getDeviceTop() != 0) && getDealHeight(26) || getDealHeight(15)
    },
    halfBox1: {
        flex: 1,
        // backgroundColor: 'red'
    },
    halfBox2: {
        flex: 1,
        // backgroundColor: 'yellow'
    },
    iptBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#0E0E0E',
        // width: getWidth(344),
        height: getDealHeight(72),
        borderRadius: StyleConfigs.borderRadius,
        borderWidth:StyleSheet.hairlineWidth,
        // borderColor:StyleConfigs.listSplitlineColor
        borderColor: StyleConfigs.borderC8CFD5,
        overflow:'hidden'
    },
    ipt: {
        padding:0,
        // width:'50%',
        height: getDealHeight(72),
        color: StyleConfigs.txt172A4D,
        flex: 1,
        // paddingLeft:getWidth(10),
        textAlign: 'center',
        // lineHeight: getDealHeight(72)
        // alignItems:'center',
        // justifyContent:'center'
    },
    img: {
        marginTop: getDealHeight(22),
        marginBottom: getDealHeight(20),
        marginLeft: getWidth(19),
        marginRight: getWidth(19),
        width: getWidth(23),
        height: getDealHeight(23)
    },
    imgBox:{
        width:getWidth(68),
        backgroundColor:StyleConfigs.sectTitleColor,
        justifyContent: 'center',
        alignItems: 'center',

    },
    ratio: {
        width: getWidth(80),
        height: getDealHeight(40),
        // lineHeight:getDealHeight(30),
        borderStyle: 'solid',
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: StyleConfigs.borderC5CFD5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: StyleConfigs.borderRadius,
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalMoney: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#0E0E0E',
        borderStyle: 'solid',
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: StyleConfigs.borderC8CFD5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: StyleConfigs.borderRadius,
        height: getDealHeight(72)
    },
    dealBtnGreen: {
        backgroundColor: '#86CB12',
        borderRadius: 4,
        height: getDealHeight(72),
        alignItems: 'center',
        justifyContent: 'center'
    },
    dealBtnRed: {
        backgroundColor: '#EF5656',
        borderRadius: 4,
        height: getDealHeight(72),
        alignItems: 'center',
        justifyContent: 'center'
    },
    line: {
        //flexDirection: 'row',
        //用于数据逆序排列
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: getDealHeight(42)

    },
    line2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: getDealHeight(42)


    },
    rowV1: {
        width: '34%',
    },
    rowV2: {
        width: '29%',

    },
    rowV3: {
        width: '21%',
        alignItems: 'flex-end'

    },
    rowV4: {
        width: '16%',
        alignItems: 'flex-end'

    },

    ballRed: {
        width: getWidth(32),
        height: getDealHeight(32),
        backgroundColor: '#EF5656',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getDealHeight(16),
        marginRight: 10
    },
    ballGreen: {
        width: getWidth(32),
        height: getDealHeight(32),
        backgroundColor: '#86CB12',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getDealHeight(16),
        marginRight: 10


    },
    chedan: {
        paddingLeft: getWidth(4),
        paddingRight: getWidth(4),
        height: getDealHeight(40),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#3576F5',
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flatBox: {
        flex: 1,
        // height:600,
        // marginBottom: -getDealHeight(120),
        //
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1
    },
    emptyIcon: {
        width:getWidth(300),
        height:getDealHeight(250)
    },
    emptyBox: {
        height:getDealHeight(920),
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop:getDealHeight(200),
        // paddingBottom:getDealHeight(350)

    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    },
    latestDeal:{
        position:'absolute',
        bottom:0,
        left:0,
        backgroundColor:'#131316',
        opacity:0.9,
        height:(getDeviceTop() != 0) && getHeight(60) || getHeight(55),
        // width:(getDeviceTop() != 0) && getHeight(650) || getHeight(750),
        width:DeviceWidth,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: getHeight(20)
        // paddingRight: getWidth(10)

    },
    latestDealDown:{
        backgroundColor:StyleConfigs.sectTitleColor,
        // backgroundColor:'#555',
        opacity:1,
        height:(getDeviceTop() != 0) && getHeight(61) || getHeight(55),
        // width:(getDeviceTop() != 0) && getHeight(650) || getHeight(750),
        width:DeviceWidth,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: getHeight(20)

    },
    latestDealTouch:{
        width:(getDeviceTop() != 0) && getHeight(520) || getHeight(590),
        height:getHeight(49),
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems:'flex-end'
    },
    latestDealImage:{
        // color:'#fff',
        width:getHeight(30),
        height:getHeight(30)
    },
    latestDealList:{
        height: (getDeviceTop() != 0) && getDealHeight(45.7) ||getDealHeight(46),
        backgroundColor:StyleConfigs.bgColor,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        flexDirection: 'row',
        alignItems: 'center',
        width:'100%'
    },
    latestDealHeader:{
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: StyleConfigs.bgColor,
        // backgroundColor: 'red',
        height: getDealHeight(53)
    },
    toTradeBtn:{
        marginTop:50,
        width:120,
        height:36
    }

});