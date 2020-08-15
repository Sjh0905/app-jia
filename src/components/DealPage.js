
import React from 'react';
import {
    Animated,
    Easing,
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
    Platform, AsyncStorage, ImageBackground
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
import changeSymbolIcon from '../assets/DealPage/change-symbol.png'
import klineIcon from '../assets/DealPage/kline.png'
import moreIcon from '../assets/DealPage/more.png'
import buyGray from '../assets/DealPage/buy-gray.png'
import sellGray from '../assets/DealPage/sell-gray.png'
import buySelected from '../assets/DealPage/buy-selected.png'
import sellSelected from '../assets/DealPage/sell-selected.png'
import buyBtn from '../assets/DealPage/buy-btn.png'
import sellBtn from '../assets/DealPage/sell-btn.png'
import depthDefault from '../assets/DealPage/depth-default.png'
import triangleDown from '../assets/DealPage/triangle-down.png'
import triangleUp from '../assets/DealPage/triangle-up.png'
import depthBuy from '../assets/DealPage/depth-buy.png'
import depthSell from '../assets/DealPage/depth-sell.png'
import allOrderIcon from '../assets/DealPage/all-order-icon.png'
import device from "../configs/device/device";
import Loading from './baseComponent/Loading'
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaseDefaultBar from './baseComponent/BaseDefaultBar'
import GestureProgressBar from './GestureProgressBar'
import signBaseStyles from "../style/SignBaseStyle";
import BaseButton from "./baseComponent/BaseButton";
import styles from "../style/DealPageStyle"
import ModalDropdown from 'react-native-modal-dropdown';
import DealPageDropDownStyle from "../style/DealPageDropDownStyle"
import CurrentOrder from "./CurrentOrder"
import Modal from 'react-native-modal'
import MarketDealList from "./MarketDealList";
import rechargeIcon from '../assets/AssetPageDetail/recharge-icon.png'

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
export default class DealPage extends RNComponent {

    @computed
    get marketPriceMerge() {
        return this.$store.state.marketPriceMerge && this.$store.state.marketPriceMerge[this.$store.state.symbol] || {}
    }

    @observable selectedTitleBar = 'BIBI'
    @observable dealType = 0
    @observable componentUpdate = false;
    // @observable
    state = {
        index: 0,
        routes: [
            {key: 'buy', title: '买入'},
            {key: 'sell', title: '卖出'},
            {key: 'currentOrder', title: '当前委托'}
        ]
    }
    @observable showMarketModal = false//切换币对
    @observable showDepthModal = false;//切换买卖盘
    @observable depthShowType = 'depth';//切换买卖盘，'depth'默认全部显示，'buy':买盘，'sell'卖盘
    // @observable depthShowType = 'buy';//切换买卖盘，'depth'默认全部显示，'buy':买盘，'sell'卖盘
    // @observable depthShowType = 'sell';//切换买卖盘，'depth'默认全部显示，'buy':买盘，'sell'卖盘
    @observable pageBotKLineBoxBottom = new Animated.Value(-168);
    @observable pageBotKLineBoxShow = false;
    @observable pageBotKLineBoxShowModal = false;
    @observable legalModalShow = false;


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
        this.listen({key:'HIDE_MARKET_MODAL_FUNC',func:this.hideMarketModalFunc});
        loadBar = this.loadBar.bind(this);
        this.loadBar();

        this.oldSymbol = null;
        this.getBars();
    }

    componentWillUpdate(){
        if(this.oldSymbol !== null && this.oldSymbol != this.$store.state.symbol){
            //第二次
            loadBar();
            this.getBars(true);
        }
        this.oldSymbol = this.$store.state.symbol;
        // console.log('**************deal只需要渲染一次',this.props.type);

    }
    // shouldComponentUpdate(nextProps, nextState) {

        // console.log('**************nextProps',nextProps);
        // console.log('**************nextState',nextState);
        // console.log('**************this.state.index === nextState.index',this.state.index === nextState.index);
        // return this.componentUpdate || this.state.index === nextState.index;
    // }

    componentDidMount(){
        super.componentDidMount();
        this.initListen();//Kline
        this.listen({key: 'onNetworkStateChange',func: this.sendNetWorkState})

        // if(this.scrollTabView)
        //     this.scrollTabView.goToPage(0);

    }
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
    checkTimeAndPos = (obj)=>{
        if((obj.currentTimeStamp - obj.startTimeStamp) < 500 &&
            Math.sqrt((obj.currentPageX - obj.startPageX) * (obj.currentPageX - obj.startPageX) + (obj.currentPageY - obj.startPageY) * (obj.currentPageY - obj.startPageY)) < 15){
            return true;
        }
        return false;
    }

    onPressWebView = (e)=>{
        console.log(e.touchHistory)
        if(e && e.touchHistory && e.touchHistory.touchBank && e.touchHistory.touchBank && (e.touchHistory.touchBank.length > 0) &&
            this.checkTimeAndPos(e.touchHistory.touchBank[e.touchHistory.touchBank.length - 1])){
            this.clickLeft()
        }
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
            // if(this.scrollTabView)
            //     this.scrollTabView.goToPage(index);

            this.notify({key: 'CLEAR_INPUT'});

            setTimeout(()=>{
                this.componentUpdate = false;
            },200)
        }catch(ex){
            // alert('切换tab错误' + '  ' + ex.toString());
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
                    // if(this.scrollTabView)
                    //     this.scrollTabView.goToPage(from);
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

    @action
    onSelectBIBI = () => {
        if(this.selectedTitleBar === 'BIBI')
            return;

        this.selectedTitleBar = 'BIBI'

    }

    @action
    onSelectOTC = () => {


        // this.legalModalShow = true
        // if(this.selectedTitleBar === 'OTC')
        //     return;

        // this.selectedTitleBar = 'OTC'


	    // this.$router.push('C2CHomePage')

		    if(this.$store.state.authMessage.userId){
			    this.$router.push('OtcIndex');
			    return
		    }
		    if(!this.$store.state.authMessage.userId){
			    this.$router.push('Login');
			    return
		    }

    }

    @action
    changeDealType = ()=>{
        this.dealType = this.dealType == 0 ? 1 : 0;
    }

    @action
    changeDepthShowType = (type)=>{
        this.depthShowType = type;
        this.hideDepthModalFunc()
    }

    @action
    showDepthModalFunc = ()=>{
        this.showDepthModal = true
        setTimeout(()=>{
            this.refs.depthScrollView.scrollToEnd();
        })
    }

    @action
    hideDepthModalFunc = ()=>{
        if(!this.showDepthModal)return;
        this.refs.depthScrollView.scrollTo({
            y: 0,animated: true
        });
        setTimeout(()=>{
            this.showDepthModal = false;
        },17)
    }

    @action
    renderHeaderBox = () => {
        return <NavHeader
            headerTitle={'交易'}
            // headerTitle={this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}
            navStyle={[PlatformOS == 'ios' && {marginTop:-getHeight(40)} || {}]}
            // goBack={this.goBack}
            // touchComp={
            //     PlatformOS === 'ios' &&
            //     <View style={styles.titleBarBox}>
            //         {/*{/!*由于直接控制TouchableOpacity的样式在iOS真机上会出现样式错乱，所以外边包一层view通过长度截取达到效果*!/}*/}
            //         <View style={[styles.titleMainBoardBarView,this.selectedTitleBar === 'BIBI' && {marginRight:-getHeight(3),zIndex:999} || {}]}>
            //             <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectBIBI} style={[styles.titleBar,styles.titleMainBoardBar,this.selectedTitleBar === 'BIBI' && styles.selectedTitleBar || {}]}>
            //                 <Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'BIBI' && styles.selectedTBText || {}]}>币币</Text>
            //             </TouchableOpacity>
            //         </View>
            //         <View style={[styles.titleWeiMiBarView,this.selectedTitleBar === 'OTC' && {marginLeft:-getHeight(3)} || {}]}>
            //             <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectOTC} style={[styles.titleBar,styles.titleWeiMiBar,this.selectedTitleBar === 'OTC' && styles.selectedTitleBar || {}]}>
            //                 <Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'OTC' && styles.selectedTBText || {}]}>法币</Text>
            //             </TouchableOpacity>
            //         </View>
            //     </View>
            //     ||
            //     <View style={styles.titleBarBoxAndroid}>
            //         <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectBIBI} style={[styles.titleBarAndroid,styles.titleMainBoardBarAndroid,this.selectedTitleBar === 'BIBI' && styles.selectedTitleBar || {}]}>
            //             <Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'BIBI' && styles.selectedTBText || {}]}>币币</Text>
            //         </TouchableOpacity>
            //         <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectOTC} style={[styles.titleBarAndroid,styles.titleWeiMiBarAndroid,this.selectedTitleBar === 'OTC' && styles.selectedTitleBar || {}]}>
            //             <Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'OTC' && styles.selectedTBText || {}]}>法币</Text>
            //         </TouchableOpacity>
            //     </View>
            // }
            // touchCompClick={this.clickTitle}

        />
    }

    showMarketModalFunc = ()=>{

        this.showMarketModal = true;

        setTimeout(()=>{
            if(this.refs.MarketListScrollView){
                this.refs.MarketListScrollView.scrollTo({
                    x: -getWidth(275*2),animated: true// x滚动的绝对值要和MarketDealList视图的width相同
                });
            }
        })

    }
    hideMarketModalFunc = ()=>{
        if(!this.showMarketModal)return;
        this.refs.MarketListScrollView.scrollTo({
            x: 0,animated: true
        });
        setTimeout(()=>{
            this.showMarketModal = false;
        },100)
    }

    renderItemHeader = ()=>{

        // let quoteChangeRate = (this.marketPriceMerge[4] - this.marketPriceMerge[1])/this.marketPriceMerge[1]*100>-0.005 || this.marketPriceMerge[1]===0

        let priceBegin = this.marketPriceMerge[1] || 0;
        let priceEnd = this.marketPriceMerge[4] || 0;
        let quoteChangeFlag = (priceEnd-priceBegin)/priceBegin*100>-0.005 || priceBegin===0

        return <View style={styles.itemHeader}>
            <TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
                style={styles.itemHeaderLeft}
                onPress={this.showMarketModalFunc}
            >
                <Image source={changeSymbolIcon} style={styles.changeSymbol} resizeMode={'contain'}/>
                <Text style={styles.itemHeaderSymbol}>{this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}</Text>
                {/*<View style={styles.quoteChangeView}><Text style={[styles.quoteChange]}>+2.31%</Text></View>*/}

                <View style={[styles.quoteChangeView, quoteChangeFlag && {} || styles.quoteChangeRedView]}>
                    <Text  allowFontScaling={false} style={[styles.quoteChange,quoteChangeFlag && {} || styles.quoteChangeRed]}>
                        {priceBegin === 0 || Math.abs((priceEnd-priceBegin)/priceBegin*100)<0.005 && ''}
                        {(priceEnd-priceBegin)/priceBegin*100>=0.005 && '+'}
                        {(priceEnd-priceBegin)/priceBegin*100<=-0.005 && '-'}
                        {priceBegin === 0 && '0.00%' || Math.abs((priceEnd-priceBegin)/priceBegin*100).toFixed(2) + '%'}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.itemHeaderRight}>
                <TouchableOpacity onPress={()=>this.$router.push('TraddingHall')} activeOpacity={StyleConfigs.activeOpacity} style={styles.iconTouch}>
                    <Image source={klineIcon} style={styles.kline}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.legalModalShow = true} activeOpacity={StyleConfigs.activeOpacity}>
                    <Image source={moreIcon} style={styles.moreImg}/>
                </TouchableOpacity>
            </View>
        </View>
    }

    renderMainPage = ()=>{
        return this.dealType == 0 &&
            <DealItem tabLabel={' 买入 '} type={0} changeDealType={this.changeDealType} depthShowType={this.depthShowType} showDepthModalFunc={this.showDepthModalFunc}/>
            ||
            <DealItem tabLabel={' 卖出 '} type={1} changeDealType={this.changeDealType} depthShowType={this.depthShowType} showDepthModalFunc={this.showDepthModalFunc}/>
    }

    @action
    listRenderRow = ({item}) => {
        if (item.name == 'headerBox')
            return this.renderHeaderBox();

        if (item.name == 'mainPage')
            return this.renderMainPage();
    }

    changeKLineBoxBottom = ()=>{
        if(this.pageBotKLineBoxBottom._value == -168){
            Animated.timing(
                this.pageBotKLineBoxBottom,
                {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.linear,
                    // useNativeDriver:true
                }
            ).start()
            this.pageBotKLineBoxShow = true

            //修改iPhone X的底部导航栏适配
            setTimeout(()=>{
                this.pageBotKLineBoxShowModal = true
            },100)
            return
        }
        if(this.pageBotKLineBoxBottom._value == 0){
            Animated.timing(
                this.pageBotKLineBoxBottom,
                {
                    toValue: -168,
                    duration: 250,
                    easing: Easing.linear,
                    // useNativeDriver:true
                }
            ).start()
            this.pageBotKLineBoxShow = false
            this.pageBotKLineBoxShowModal = false
        }

    }

    //关闭法币交易弹窗
    closeLegalModal = ()=>{
        this.legalModalShow = false;
    }

    //跳转到充值页面
    toAssetRecharge = ()=>{
        this.closeLegalModal();
        setTimeout(()=>{
            if(!this.$store.state.authMessage.userId) {
                this.$router.push('Login');
                return
            }
            this.$router.push('AssetPageSearch')
        },100)
    }

    render() {
        return (
            <View
                onLayout={(e)=>{
                    console.log('e.nativeEvent.layout.height',e.nativeEvent.layout.height);
                    // this.$store.commit('SET_DEVICE_HEIGHT_STATE', e.nativeEvent.layout.height);
                }}
                style={[styles.container,BaseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602},PlatformOS == 'ios' && {paddingTop:getHeight(40)} || {}]}>


                <SectionList
                    style={{flex:1}}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={true}
                    // ref={sl => this.sectionList = sl}
                    renderItem={this.listRenderRow}
                    renderSectionHeader={({section}) => {
                        // console.log('section==imgNotice',section.key === 'imgNotice');
                        if(section.key === 'headerBox')return;

                        return this.renderItemHeader();
                    }}
                    keyExtractor = {(item, index) => index.toString()}
                    //为了保证变量的值变化时能及时被渲染，需要将数据绑定到data里边
                    sections={[
                        {data:[{'name':'headerBox',selectedTitleBar:this.selectedTitleBar}],key:'headerBox'},
                        {data:[{'name':'mainPage',dealType:this.dealType}],key:'mainPage'}
                    ]}
                    // initialNumToRender={6}
                    keyboardShouldPersistTaps={'always'}//解决textinput点击两次才能获取焦点的问题
                />

                {/*法币交易 去充值 共用模态框 begin*/}
                <Modal
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    animationInTiming={10}
                    animationOutTiming={10}
                    isVisible={this.legalModalShow}
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                >
                    <TouchableOpacity
                        style={{flex:1}}
                        activeOpacity={1}
                        onPress={this.closeLegalModal}
                    >
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={styles.toAssetRechargeBox}
                            onPress={this.toAssetRecharge}
                        >
                            <Image source={rechargeIcon} style={styles.rechargeIcon} />
                            <Text style={styles.rechargeText} allowFontScaling={false}>充币</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/*<View style={styles.verifyModalBox}>*/}
                        {/*<View style={styles.modalArticleBox}>*/}
                            {/*/!*<Image source={VerifyModalIcon} style={styles.verifyModalIcon}/>*!/*/}
                            {/*<Text  allowFontScaling={false} style={[styles.modalArticleText,PlatformOS == 'ios' && {fontFamily:'PingFangSC-Regular'} || {}]}>OTC近期上线，敬请期待！</Text>*/}
                        {/*</View>*/}
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*onPress={this.closeLegalModal}*/}
                        {/*>*/}
                            {/*<View style={styles.modalFooterBox}>*/}
                                {/*<Text  allowFontScaling={false} style={styles.modalFooterText}>我知道了</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}

                    {/*</View>*/}

                </Modal>
                {/*法币交易 去充值 共用模态框 end*/}

                {/*切换币对*/}
                <Modal
                    style={{margin:0}}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.showMarketModal}
                    backdropColor={'#00000080'}
                    // backdropOpacity={0.5}
                >
                    <ScrollView
                        ref={'MarketListScrollView'}
                        horizontal={true}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        style={styles.modalScrollView}
                    >
                        <MarketDealList/>
                        <TouchableOpacity
                            onPress={this.hideMarketModalFunc}
                            activeOpecity={1}
                            style={{height: RealWindowHeight,width:DeviceWidth}}
                        />
                    </ScrollView>
                </Modal>
                {/*切换币对end*/}

                {/*切换买卖盘*/}
                <Modal
                    style={{margin:0}}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.showDepthModal}
                    backdropColor={'#00000080'}
                    // backdropOpacity={0.5}
                >
                    <ScrollView
                        ref={'depthScrollView'}
                        scrollEnabled={false}
                        style={styles.depthScrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            onPress={this.hideDepthModalFunc}
                            activeOpecity={1}
                            style={{height: RealWindowHeight}}
                        />
                        <View style={{backgroundColor:StyleConfigs.bgColor}}>
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={styles.modalBtn}
                                textStyle={[styles.modalBtnTxt,this.depthShowType == 'depth' && styles.colorRed || {}]}
                                text={'默认'}
                                onPress={()=>this.changeDepthShowType('depth')}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={styles.modalBtn}
                                textStyle={[styles.modalBtnTxt,this.depthShowType == 'buy' && styles.colorRed || {}]}
                                text={'买盘'}
                                onPress={()=>this.changeDepthShowType('buy')}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={[styles.modalBtn,{borderBottomWidth:5}]}
                                textStyle={[styles.modalBtnTxt,this.depthShowType == 'sell' && styles.colorRed || {}]}
                                text={'卖盘'}
                                onPress={()=>this.changeDepthShowType('sell')}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                onPress={this.hideDepthModalFunc}
                                style={[styles.modalBtn,{borderBottomWidth:0}]}
                                textStyle={styles.modalBtnCancleTxt}
                                text={'取消'}
                            />
                        </View>

                    </ScrollView>
                </Modal>
                {/*切换买卖盘end*/}

                <Animated.View style={[styles.pageBotKLineBox,{bottom:this.pageBotKLineBoxBottom}]}>
                    <View style={[BaseStyles.flexRowBetween,styles.kLineBoxTop]}>
                        <Text style={styles.kLineBoxTitle}>{this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]} 日线图</Text>
                        <TouchableOpacity
                            onPress={this.changeKLineBoxBottom}
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={[BaseStyles.flexRowBetween,styles.kLineBoxOper]}>
                            <Text style={styles.kLineBoxTouchText}>{this.pageBotKLineBoxShow && '收起' ||'展开'}</Text>
                            <Image source={this.pageBotKLineBoxShow && triangleDown || triangleUp} style={{width:10,height:7}}/>
                        </TouchableOpacity>
                    </View>
                    {/*K线*/}
                    <TouchableOpacity
                        style={{
                            height: 168,
                            marginTop: getDealHeight(0),
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
                                    width: getWidth(DefaultWidth),
                                    height: 168,
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
                        {!this.pageBotKLineBoxShowModal && <View
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
                        </View>}
                    </TouchableOpacity>
                    {/*K线end*/}

                </Animated.View>

                {/*<ScrollableTabView*/}
                    {/*style={{flex: 1}}*/}
                    {/*ref = {(scrollTabView)=>{this.scrollTabView = scrollTabView}}*/}
                    {/*renderTabBar={() =>*/}
                        {/*<BaseDefaultBar*/}
                            {/*tabLabels={['买入','卖出','当前委托']}*/}
                            {/*tabUnderlineWidth={[getWidth(60),getWidth(60),getWidth(108)]}*/}
                            {/*tabBarBackgroundColor={StyleConfigs.navBgColor0602}*/}
                            {/*tabInActiveColor={'#9FA7B8'}*/}
                        {/*/>*/}
                    {/*}*/}
                    {/*initialPage={0}*/}
                    {/*// page={1}*/}
                    {/*tabBarBackgroundColor='#FFFFFF'*/}
                    {/*tabBarActiveTextColor='#3576F5'*/}
                    {/*tabBarInactiveTextColor='#9FA7B8'*/}
                    {/*tabBarTextStyle={{fontSize: 14,marginBottom:getHeight(-22),color:'#9FA7B8'}}*/}
                    {/*tabBarUnderlineStyle={{*/}
                        {/*backgroundColor: '#3576F5',*/}
                        {/*height:getDealHeight(4),*/}
                        {/*// width:getDealHeight(DeviceWidth*2/5),*/}
                        {/*// marginLeft:getDealHeight(DeviceWidth*2/13)*/}
                        {/*marginLeft: DeviceWidth / 6 - (4 * 14 / 2),*/}
                        {/*width: (4 * 14),*/}
                        {/*borderRadius:getHeight(4)*/}
                    {/*}}*/}
                    {/*onChangeTab={this.onIndexChange}*/}
                    {/*prerenderingSiblingsNumber={1}*/}
                {/*>*/}

                    {/*<DealItem tabLabel={' 买入 '} type={0}/>*/}
                    {/*<DealItem tabLabel={' 卖出 '} type={1}/>*/}
                    {/*<CurrentOrder tabLabel={' 当前委托 '} type={2}/>*/}
                {/*</ScrollableTabView>*/}
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

        let inx = this.props.depthShowType == 'sell' ? 10 : 5;
        let sellOrdersTemp = this.$store.state.depthMerge.sellOrders
        let sellOrders = this.getPriceChangeOrders(sellOrdersTemp).slice(0, inx)
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

        let inx = this.props.depthShowType == 'buy' ? 10 : 5;
        let buyOrdersTemp = this.$store.state.depthMerge.buyOrders
        let buyOrders = this.getPriceChangeOrders(buyOrdersTemp).slice(0, inx)
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

    @computed get symbolTransaction() {
        return this.$store.state.serverTime > this.tradeLObj.startTime;//当服务器时间大于开始时间时说明已经开放
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

    @computed
    get GRCPriceRange() {
        return this.$store.state.GRCPriceRange || []
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

    getPriceChangeOrders = (transactionData)=> {

        if(this.symbol == 'KK_USDT' && this.GRCPriceRange.length >0){
            let minPrice = this.GRCPriceRange[0] || 0;
            let maxPrice = this.GRCPriceRange[this.GRCPriceRange.length -1] || 10;

            // console.log('this is minPrice',minPrice,'maxPrice',maxPrice);

            if(transactionData instanceof Array)
                transactionData = transactionData.filter(v => !!v && v.price >= minPrice && v.price <= maxPrice)

            return transactionData || []
        }

        return transactionData || []

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
        return '数量' //+ '(' + this.$store.state.symbol.split('_')[0] + ')'
    }

    @computed get placeholderAmountSymbol() {
        return this.$store.state.symbol.split('_')[0]
    }


    @observable    price = this.priceNow.price && this.marketUseRate && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate) || 0, this.tradeLObj.quoteScale || 8)
    // @observable    price = ''
    @observable    priceFlag = true
    @observable    priceNowFlag = true
    @observable    priceCont = ''
    @observable    amount = ''
    @observable    amountFlag = true
    @observable    amountSellFlag = false
    @observable    amountCont = ''
    @observable    transFlag = true
    @observable    transCont = ''
    @observable    transAmount = 0
    @observable    tradeFlag = false
    @observable    oper = this.props.type && '卖出 ' || '买入 '
    @observable    isLoading = true;
    @observable    secItemIndex = 0;
    @observable    secItemShow = 0;
    @observable    scrollClickFlag = true;
    @observable    priceStyle = {};
    @observable    amountStyle = {};
    @observable    dropdownShow = false;
    @observable    dropdownIndex = 0;//0限价单 1市价单

    dealTypeTextArr = ['限价单','市价单']
    depthShowTypeObj = {'depth':'默认', 'buy':'买盘', 'sell':'卖盘'}

    clearInput = (flag,price) => {
        if(!flag){//打开marketlist的时候暂时不需要清空数据
            // this.price = this.priceNow.price && this.marketUseRate && (this.priceNow.price * this.marketUseRate) && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate) || 0, 2) || ''
            price > 0 && (this.price = price + '')
            this.amount = '';
            this.priceCont = '';
            this.amountCont = '';

            this.priceFlag = true;
            this.priceNowFlag = true;
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

    tradeOrder = async() => {

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

        //如果选择的是市价，price直接取当前最新价格
        if(this.dropdownIndex == 1){
            this.price = this.priceNow.price && this.marketUseRate && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate) || 0, this.tradeLObj.quoteScale || 8);
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

        if (/*text != '' &&*/this.symbol !='KK_USDT' && Number(text) < Number(pnum)) {
            Alert.alert("提示", '价格不能低于' + pnum, [
                {
                    text: "我知道了", onPress: () => {
                        console.log("点了我知道了");
                    }
                }
            ])

            return;
        }

        if (this.symbol == 'KK_USDT' && !this.checkPriceRange(2)) {
            return;
        }

        if(text != ''){
            let result = await this.comparePriceNow(2);
            console.log('this is result',result);

            if(!result)return
        }

        // console.log('==================================================================================================');
        // return


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
        var bnum = tp.maxAmount;
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

        // 暂时屏蔽前端拦截，白名单有后端来配置
        // if (/*text2!= '' &&*/bnum > 0 && Number(text2) > Number(bnum)) {
        //
        //     Alert.alert("提示", '数量不能大于' + bnum, [
        //         {
        //             text: "我知道了", onPress: () => {
        //                 console.log("点了我知道了");
        //             }
        //         }
        //     ])
        //     return
        //
        // }

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

        //二维数组第一层 0限价 1市价，第二层 0买入 1卖出
        let dealTypeMap = [
            ['BUY_LIMIT','SELL_LIMIT'],
            ['BUY_MARKET','SELL_MARKET']
        ]

        let params = {
            symbol: this.$store.state.symbol,
            price: this.price,
            amount: this.amount,
            type: dealTypeMap[this.dropdownIndex][this.props.type],
            source :'iOS'
            // type: this.props.type,
            // customFeatures: this.fee ? 65536 : 0
        }


        if (this.$store.state.feeBdbState) {
            Object.assign(params, {customFeatures: 65536});
        }



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
        this.priceNowFlag = true;
        this.oper = this.props.type && '卖出' || '买入';
        this.notify({key: 'RE_CURRCENY_ORDER'});

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

        if (err.error == 'order Exception') {
            Alert.alert("提示", "挂单价格不在预定范围", [
                {
                    text: "我知道了", onPress: () => {
                    }
                }
            ])
            return
        }

        if (err.error == 'ORDER_GRANTER_THAN_MAXAMOUNT') {

            let bnum = err_type && err_type.split("|")[1] || "最大值"
            bnum = this.$globalFunc.testTrim(bnum)
            
            Alert.alert("提示", "数量不能大于"+bnum, [
                {
                    text: "我知道了", onPress: () => {
                    }
                }
            ])
            return
        }

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
            this.transCont = '交易额不能低于' + (tp.miniVolume || '0') ;
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

    //检测币对交易价格，false 不通过 true 通过
    checkPriceRange = (type)=> {
        // return true// TODO delee
        let len = this.GRCPriceRange.length;
        if(len == 0)return true

        let minPrice = this.GRCPriceRange[0];
        let maxPrice = this.GRCPriceRange[len-1];

        if(minPrice > 0 && this.price < minPrice){

            if(type == 2){
                Alert.alert("提示", '价格不能低于' + minPrice, [
                    {text: "我知道了", onPress: () => {console.log("点了我知道了");}}
                ])
                return false;
            }

            this.priceFlag = false;
            this.priceCont = '价格不能低于' + minPrice ;
            this.transAmount = 0;

            return false
        }

        if(maxPrice > 0 && this.price > maxPrice){

            if(type == 2){
                Alert.alert("提示", '价格不能高于' + maxPrice, [
                    {text: "我知道了", onPress: () => {console.log("点了我知道了");}}
                ])
                return false;
            }

            this.priceFlag = false;
            this.priceCont = '价格不能高于' + maxPrice ;
            this.transAmount = 0;

            return false
        }

        return true;
    }

    //挂单价格低于等于时价的1/2或高于等于2倍的时候弹窗提示
     comparePriceNow = async (type) => {
        let priceNow = this.priceNow.price && this.$globalFunc.accFixed(this.priceNow.price || 0, this.tradeLObj.quoteScale || 8) || ''
        if(Number(priceNow) == 0)return true

        let multiple = this.$globalFunc.accDiv(this.price,Number(priceNow));

        if(type == 1){
            multiple == 1/2 && (this.priceCont = '挂单价格等于时价1/2，确定下单吗？')
            multiple < 1/2 && (this.priceCont = '挂单价格低于时价1/2，确定下单吗？')
            multiple == 2 && (this.priceCont = '挂单价格等于时价2倍，确定下单吗？')
            multiple > 2 && (this.priceCont = '挂单价格高于时价2倍，确定下单吗？')
            this.priceCont != '' && (this.priceNowFlag = false)
            return;
        }

        if(type == 2){
            let priceCont = ''
            multiple == 1/2 && (priceCont = '挂单价格等于时价1/2，确定下单吗？')
            multiple < 1/2 && (priceCont = '挂单价格低于时价1/2，确定下单吗？')
            multiple == 2 && (priceCont = '挂单价格等于时价2倍，确定下单吗？')
            multiple > 2 && (priceCont = '挂单价格高于时价2倍，确定下单吗？')
            // var result = false;

            if(priceCont == '')return true

            return new Promise((resolve, reject) => {
                Alert.alert("提示", priceCont, [
                    {text: "确定", onPress: () => {
                            console.log("点了确定");
                            // result = true
                            resolve(true)
                    }},
                    {text: "取消", onPress: () => {
                            console.log("点了取消");
                            // result = false
                            resolve(false)
                    }}
                ])
            })

        }

    }


    //验证价格
    verifyPrice = () => {

        let text = this.price, tp = this.tradeLObj;
        let tl = text.length, zp = text.indexOf('.'),sp = text.indexOf(' '),plus = text.indexOf('+');
        this.priceCont = ''
        this.priceNowFlag = true

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


        if (text != '' && this.symbol !='KK_USDT' && Number(text) < Number(num)) {
            this.priceFlag = false;
            this.priceCont = '价格不能低于' + num ;
            this.transAmount = 0;
            return;
        }

        if (text != '' && this.symbol == 'KK_USDT' && !this.checkPriceRange(1)) {
            return;
        }

        //与时价比较
        if(text != ''){this.comparePriceNow(1)}

        if(!this.props.type && text === ''){
            this.transCont = '';
            this.transFlag = true;
        }


        this.priceFlag = true;
        if(this.dropdownIndex == 0 && this.priceFlag && this.amountFlag)
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
        var bnum = tp.maxAmount;


        // if (!this.props.type && Number(text) > Number(bnum)) {//买入时最大成交量,暂时不做
        //     this.amountFlag = false;
        //     this.amountCont = '不能大于' + bnum ;
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
            this.amountCont = '数量不能小于' + num ;
            this.transAmount = 0;
            return;
        }

        // 暂时屏蔽前端拦截，白名单有后端来配置
        // 最大交易量限制，直接用bnum > 0 来判断就行，不用特定哪个币对，不需限制的为undefined，自然也不会大于0
        // if ((bnum > 0 && text != '') && Number(text) > Number(bnum)) {
        //     this.amountFlag = false;
        //     this.amountSellFlag = false;
        //     this.amountCont = '数量不能大于' + bnum ;
        //     this.transAmount = 0;
        //     return;
        // }

        // if(this.props.type){
            this.transFlag = true;
            this.transCont = '';
        // }


        this.amountFlag = true;
        if(this.dropdownIndex == 0 && this.priceFlag && this.amountFlag)
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
        this.oper = this.oper == '委托中' ? '委托中' : (this.props.type && '卖出 ' || '买入 ')//由于切换买卖监听不到this.oper变化，所以在此做判断

        return (

            //交易买卖页面
            <View style={[styles.container2,{height:PlatformOS === 'ios'?(this.dealPageHeight || 'auto'):'auto',marginBottom:getHeight(15)}]}>

                <View style={[styles.halfBox1]}>
                    {/*切换买入卖出*/}
                    <View style={styles.changeDealTypeBox}>
                        <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.props.changeDealType}>
                            <ImageBackground source={this.props.type == 0 && buySelected || buyGray} style={styles.buyTypeBtn}>
                                <Text style={[styles.buyTypeBtnText,this.props.type == 0 ? styles.btnTextSelected  : {}]}>买入</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.props.changeDealType}
                            activeOpacity={StyleConfigs.activeOpacity}
                            // style={styles.sellTypeTouch}
                        >
                            <ImageBackground source={this.props.type == 1 && sellSelected || sellGray} style={styles.buyTypeBtn}>
                                <Text style={[styles.buyTypeBtnText,this.props.type == 1 ? styles.btnTextSelected : {}]}>卖出</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    {/*切换买入卖出end*/}

                    {/*委托类型*/}
                    <View style={styles.modalDropdownBox}>
                        {this.dropdownShow &&
                            <Image source={triangleUp} style={styles.dropdownImg}/>
                            ||
                            <Image source={triangleDown} style={styles.dropdownImg}/>
                        }
                        <ModalDropdown
                            {...DealPageDropDownStyle}
                            animated={false}
                            options={this.dealTypeTextArr}
                            defaultIndex={0}
                            defaultValue={this.dealTypeTextArr[0]}
                            onDropdownWillShow={(d)=>{
                                this.dropdownShow = true
                                // console.log('this is DealPage onDropdownWillShow',);
                            }}
                            onDropdownWillHide={(d)=>{
                                this.dropdownShow = false
                                // console.log('this is DealPage onDropdownWillHide',);
                            }}
                            onSelect={(inx,val)=>{
                                this.dropdownIndex = inx;
                                console.log('this is DealPage onSelect',inx,val,'this.dropdownIndex',this.dropdownIndex);
                            }}
                            renderSeparator={()=><View style={{width:200,height:0.5,backgroundColor:StyleConfigs.bgColor}}/>}
                        />
                    </View>
                    {/*委托类型*/}

                    {/*<View style={{marginVertical:getDealHeight(20)}}><Text allowFontScaling={false}*/}
                                                                       {/*style={{fontSize: StyleConfigs.fontSize13, color: StyleConfigs.txt172A4D}}>限价单</Text></View>*/}
                    {/*限价价格框*/}
                    {this.dropdownIndex == 0 &&
                        <View style={[styles.iptBox]}>
                            <TextInput
                                allowFontScaling={false}
                                ref={'ipt'}
                                style={styles.ipt}
                                placeholder={this.placeholderPrice}
                                placeholderTextColor={StyleConfigs.txt6B7DA2}
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
                                    this.calcuStep('price', 'minus')

                                }}
                                style={[styles.imgBox,styles.imgBoxJianHao]}
                            >
                                <Image source={require('../assets/Deal/jianhao.png')} style={styles.img}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={() => {
                                    this.calcuStep('price', 'add');
                                }}
                                style={[styles.imgBox,styles.imgBoxJiaHao]}
                            >
                                <View style={styles.imgBoxLine}/>
                                <Image source={require('../assets/Deal/jiahao.png')} style={styles.img}/>
                            </TouchableOpacity>
                        </View>
                        ||
                        null
                    }
                    {/*市价价格框*/}
                    {
                        this.dropdownIndex == 1 &&
                        <View style={[styles.iptBox,styles.iptDisabled]}>
                            <Text style={styles.iptDisabledTxt}>{'以市场最优价'+this.oper}</Text>
                        </View>
                        ||
                        null
                    }
                    {/*限价估值*/}
                    {
                        (this.dropdownIndex == 0 && this.priceFlag && this.priceNowFlag) &&
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom:getDealHeight(30),
                        }}>
                            {/*<Text allowFontScaling={false} style={{color:StyleConfigs.txtC5CFD5,fontSize:StyleConfigs.fontSize12}}>估值</Text>*/}
                            <Text allowFontScaling={false}
                                  style={[{flex: 1,textAlign:'left',color:StyleConfigs.txt6B7DA2,fontSize:StyleConfigs.fontSize12}]}
                                  ellipsizeMode='tail'
                                  numberOfLines={1}
                            >≈{this.price && this.marketUseRate && this.$globalFunc.accFixed2(this.price * this.marketUseRate * this.exchangRateDollar || 0, 2) || '0.00'}CNY</Text>

                        </View>
                        ||
                        <View style={{
                            flexDirection: 'row',
                            marginBottom:getDealHeight(30),
                            // marginVertical:getDealHeight(15),
                        }}>
                            {this.dropdownIndex == 0 &&
                            <Text allowFontScaling={false} style={{'color': StyleConfigs.txtRed,fontSize:StyleConfigs.fontSize12}}>{this.priceCont}</Text>
                            ||
                            <Text allowFontScaling={false} style={{height:getDealHeight(26)}}>{''}</Text>
                            }
                        </View>

                    }
                    <View style={styles.iptBox}>
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*onPress={() => {*/}
                                {/*this.calcuStep('amount', 'minus');*/}
                            {/*}}*/}
                            {/*style={styles.imgBox}*/}
                        {/*>*/}
                            {/*<Image source={require('../assets/Deal/jianhao.png')} style={styles.img}></Image>*/}
                        {/*</TouchableOpacity>*/}
                        <TextInput
                            allowFontScaling={false}

                            style={styles.ipt}
                            placeholder={this.placeholderAmount}
                            placeholderTextColor={StyleConfigs.txt6B7DA2}
                            underlineColorAndroid={'transparent'}
                            keyboardType={"numeric"}
                            returnKeyType={'done'}

                            onChangeText={(text) => {
                                this.amount = text;
                                this.verifyAmount();
                            }}

                            value={this.amount}
                        />
                        <Text style={styles.iptUnit}>{this.placeholderAmountSymbol}</Text>
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*onPress={() => {*/}
                                {/*this.calcuStep('amount', 'add');*/}
                            {/*}}*/}
                            {/*style={styles.imgBox}*/}
                        {/*>*/}
                            {/*<Image source={require('../assets/Deal/jiahao.png')} style={styles.img}></Image>*/}
                        {/*</TouchableOpacity>*/}
                    </View>


                    {
                        (this.amountFlag || this.amountSellFlag) &&
                        <View style={{
                            flexDirection: 'row',
                            // justifyContent: 'space-between',
                            marginTop:getDealHeight(4),
                            marginBottom:getDealHeight(28)
                        }}>
                            <Text allowFontScaling={false} style={[styles.color6B7DA2, styles.size12]}>可用</Text>
                            <Text allowFontScaling={false} style={[styles.color6B7DA2, styles.size12]}>
                                {(this.$store.state.authMessage.userId && this.getCurrAsset.available || '0') + ' ' + (this.props.type && this.symbol.split('_')[0] || this.symbol.split('_')[1])}
                            </Text>
                        </View>
                        ||
                        <View style={{
                            // height:getDealHeight(70),
                            flexDirection: 'row',
                            marginTop:getDealHeight(4),
                            marginBottom:getDealHeight(28),
                            // paddingTop:(getDeviceTop() != 0) && getDealHeight(20) || getDealHeight(18),
                            // paddingBottom:(getDeviceTop() != 0) && getDealHeight(24.5) || getDealHeight(23)
                        }}>
                            <Text allowFontScaling={false} style={{'color': StyleConfigs.txtRed,fontSize:StyleConfigs.fontSize12}}>{this.amountCont}</Text>
                        </View>

                    }


                    {/*进度条*/}
                    <View style={[{
                        // height:20,
                        // marginTop:-30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // marginVertical:getDealHeight(15),
                        // zIndex:999安卓加上了这个属性小提示框不会显示的
                    },PlatformOS == 'ios' && {zIndex:999} || {}]}>
                        <GestureProgressBar
                            color={this.props.type == 0 ? '#34A753' : '#EF5656'}
                            type={this.props.type}
                            onProgress={(progress)=>{

                                // console.log('this is progress',progress/100);

                                this.calculate(progress/100);
                            }}
                        />
                    </View>
                    {/*进度条结束*/}

                    {
                        this.transFlag &&
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical:(getDeviceTop() != 0) && getDealHeight(19) || getDealHeight(14)
                        }}>
                            <Text allowFontScaling={false} style={[styles.colorA2B5D9, styles.size10]}>0</Text>
                            <Text allowFontScaling={false} style={[styles.colorA2B5D9, styles.size10]}>
                                {(this.$store.state.authMessage.userId && this.getCurrAsset.available || '0') + ' ' + (this.props.type && this.symbol.split('_')[0] || this.symbol.split('_')[1])}
                            </Text>
                        </View>
                        ||
                        <View style={{
                            // height:(getDeviceTop() != 0) && getDealHeight(19) || getDealHeight(14),
                            flexDirection: 'row',
                            marginVertical:(getDeviceTop() != 0) && getDealHeight(19) || getDealHeight(14)
                            // paddingTop:(getDeviceTop() != 0) && getDealHeight(17) || getDealHeight(14)
                        }}>
                            <Text allowFontScaling={false} style={[{'color': '#3576F5'},styles.size10]}>{this.transCont}</Text>
                        </View>

                    }


                    {/*交易额*/}
                    {
                        (this.dropdownIndex == 0 && !this.transAmount) &&
                        <View style={styles.totalMoney}>
                            <Text allowFontScaling={false}
                                  style={[{color:StyleConfigs.txt6B7DA2}, styles.size14]}>交易额</Text>
                            <Text allowFontScaling={false}
                                  style={[{color:StyleConfigs.txt172A4D,marginLeft:4}, styles.size14]}>--</Text>
                        </View>

                        || this.dropdownIndex == 0 &&
                        <View style={styles.totalMoney}>
                            <Text allowFontScaling={false}
                                  style={[{color:StyleConfigs.txt6B7DA2}, styles.size14]}>交易额</Text>
                            <Text allowFontScaling={false}
                                  style={[{color:StyleConfigs.txt172A4D,marginLeft:4}, styles.size14]}>{this.transAmount + this.$store.state.symbol.split('_')[1]}</Text>
                        </View>
                        ||
                        <View style={styles.totalMoney}/>

                        }
                    {/*交易额结束*/}


                    {/*买入卖出按钮*/}
                    {
                        !this.symbolTransaction &&
                        <View style={[styles.dealBtnGreen,styles.dealBtnDisabled]}>
                            <Text allowFontScaling={false} style={[styles.color100, styles.size16]}>即将开启</Text>
                        </View>
                        ||
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={this.props.type && styles.dealBtnRed || styles.dealBtnGreen}
                            onPress={this.tradeOrder}
                            disabled={this.tradeFlag}
                        >
                            <ImageBackground source={this.props.type && sellBtn || buyBtn} style={styles.dealBtn} resizeMode={'stretch'}>
                                    <Text allowFontScaling={false} style={[styles.color100, styles.size16]}>{this.oper + this.$store.state.symbol.split('_')[0]}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    }

                    {/*买入卖出按钮结束*/}

                    {/*K线*/}
                    <TouchableOpacity
                        style={{
                            height: getDealHeight(0),
                            marginTop: getDealHeight(0),
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
                    {/*K线end*/}

                </View>

                {/*中间留白*/}
                <View style={{width: getWidth(30)}}/>
                {/*中间留白结束*/}

                {/*买卖盘*/}
                <View style={styles.halfBox2}>

                    {/*买卖盘标题*/}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // marginTop: getDealHeight(20),
                        marginBottom: getDealHeight(20),
                        paddingRight: getWidth(30)
                    }}>
                        <Text allowFontScaling={false}
                              style={[styles.colorA2B5D9, styles.size12]}>价格</Text>
                        <Text allowFontScaling={false}
                              style={[styles.colorA2B5D9, styles.size12]}>数量</Text>
                    </View>
                    {/*买卖盘标题结束*/}

                    {/*卖盘*/}
                    {
                        this.props.depthShowType != 'buy' &&
                        <View style={{height: this.props.depthShowType == 'sell' && getDealHeight(500) || getDealHeight(250), flexDirection: 'column-reverse'}}>
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
                                            height: getDealHeight(50),
                                            backgroundColor: '#EF5656',
                                            opacity: 0.08,
                                            position: 'absolute',
                                            top: 1.5,
                                            left: 0
                                        }}/>
                                        {/*<Text allowFontScaling={false} style={[styles.size12, {color:StyleConfigs.txt6B7DA2}]}>{this.$globalFunc.accFixed(o.amount,this.symbol == 'KK_USDT' ? 2 : (this.tradeLObj.baseScale || 2))}</Text>*/}
                                        <Text allowFontScaling={false} style={[styles.size12, {color:StyleConfigs.txt6B7DA2}]}>{this.$globalFunc.formatDealAmount(this.symbol,o.amount,this.tradeLObj.baseScale)}</Text>
                                        <Text allowFontScaling={false}
                                              style={[styles.size12, styles.colorRed]}>{this.$globalFunc.accFixed(o.price, this.tradeLObj.quoteScale || 8)}</Text>


                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    }
                    {/*卖盘结束*/}

                    {/*时价*/}
                    <View style={{marginTop:getDealHeight(5),height: getDealHeight(63), justifyContent: 'center'}}>
                        <Text allowFontScaling={false}
                              style={[this.marketPriceMerge[4] - this.marketPriceMerge[1] >= 0 && styles.colorGreen || styles.colorRed, styles.size16,{fontWeight:'bold'}]}>
                            {this.priceNow.price && this.$globalFunc.accFixed(this.priceNow.price || 0, this.tradeLObj.quoteScale || 8) || ''}
                        </Text>
                        <Text allowFontScaling={false}
                              style={[styles.color6B7DA2,styles.size10]}>
                            ≈{this.priceNow.price && this.marketUseRate && (this.priceNow.price * this.marketUseRate * this.exchangRateDollar) && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate * this.exchangRateDollar) || 0, 2) || '' }CNY
                        </Text>

                        {/*{this.marketPriceMerge[4] - this.marketPriceMerge[1] >= 0 &&*/}
                        {/*<Image source={require('../assets/Deal/zhang.png')} style={{width:getWidth(18),height:getDealHeight(24)}}/>*/}
                        {/*||*/}
                        {/*<Image source={require('../assets/Deal/die.png')} style={{width:getWidth(18),height:getDealHeight(24)}}/>}*/}
                    </View>
                    {/*时价结束*/}

                    {/*买盘*/}
                    {
                        this.props.depthShowType != 'sell' &&
                        <View style={{height:this.props.depthShowType == 'buy' && getDealHeight(500) || getDealHeight(250),paddingTop:getDealHeight(8)}}>
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
                                            height: getDealHeight(50),
                                            backgroundColor: '#34A753',
                                            opacity: 0.08,
                                            position: 'absolute',
                                            top: 1.5,
                                            right: 0
                                        }}/>

                                        <Text allowFontScaling={false}
                                              style={[styles.size12, styles.colorGreen]}>{this.$globalFunc.accFixed(o.price,this.tradeLObj.quoteScale || 8)}</Text>
                                        {/*<Text allowFontScaling={false} style={[styles.size12, {color:StyleConfigs.txt6B7DA2}]}>{this.$globalFunc.accFixed(o.amount, this.symbol == 'KK_USDT' ? 2 : (this.tradeLObj.baseScale || 2))}</Text>*/}
                                        <Text allowFontScaling={false} style={[styles.size12, {color:StyleConfigs.txt6B7DA2}]}>{this.$globalFunc.formatDealAmount(this.symbol,o.amount,this.tradeLObj.baseScale)}</Text>


                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    }
                    {/*买盘*/}

                    {/*买卖盘操作按钮*/}
                    <TouchableOpacity onPress={this.props.showDepthModalFunc} activeOpacity={StyleConfigs.activeOpacity} style={styles.depthOperBox}>
                        <TouchableOpacity onPress={this.props.showDepthModalFunc} activeOpacity={StyleConfigs.activeOpacity} style={styles.depthOperLeft}>
                            <Text style={[styles.txt6B7DA2,styles.size12]}>{this.depthShowTypeObj[this.props.depthShowType]}</Text>
                            {/*<Image source={triangleDown} style={{width:7, height:5,marginLeft:getWidth(20)}}/>*/}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.showDepthModalFunc} activeOpacity={StyleConfigs.activeOpacity}>
                            {this.props.depthShowType == 'depth' && <Image source={depthDefault} style={styles.depthType}/>}
                            {this.props.depthShowType == 'buy' && <Image source={depthBuy} style={styles.depthType}/>}
                            {this.props.depthShowType == 'sell' && <Image source={depthSell} style={styles.depthType}/>}
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {/*买卖盘操作按钮结束*/}
                </View>
                {/*买卖盘结束*/}


            </View>


        );

    }

    //当前委托
    @action
    rendItemHeader = (secItemIndex) => {
        return (
            <View style={styles.secItemHeader}>
                <Text style={styles.secItemHeaderText}>当前委托</Text>
                <TouchableOpacity style={styles.secItemHeaderRight} onPress={this.goHistory} hitSlip={{top:10,left:10,right:10,bottom:10}} activeOpacity={0.8}>
                    <Image source={allOrderIcon} style={styles.allOrderIcon}/>
                    <Text style={styles.alltext}>历史</Text>
                </TouchableOpacity>
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

        // if (item.data.name == 'empty')
        //     return this.renderEmpty();

        // if(!this.secItemShow)
        //     return this.renderWait();

        // return this.renderAllDealPage(item.data);
        //|| (DeviceHeight-getHeight(49+40+30+82+55+88))

        return <CurrentOrder tabLabel={' 当前委托 '} type={2}/>

        // return (
        //     <View style={{width:'100%',height:this.aheight || 'auto',paddingBottom:PlatformOS == 'ios' && getDealHeight(20) || getDealHeight(2)}}>
        //         <FlatList
        //             data={item.data || []}
        //             renderItem={this.allListRenderRow}
        //             keyExtractor={(item, index) => index.toString()}
        //             initialNumToRender={20}
        //         />
        //     </View>
        // )

    }


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
                        {data:[{'name':'dealPage',price:this.price,priceFlag:this.priceFlag,priceNowFlag:this.priceNowFlag,priceCont:this.priceCont,amount:this.amount,
                                amountFlag:this.amountFlag,amountSellFlag:this.amountSellFlag,amountCont:this.amountCont,transFlag:this.transFlag,
                                transCont:this.transCont,transAmount:this.transAmount,tradeFlag:this.tradeFlag,oper:this.oper,newPrice:this.newPrice,
                                sellOrders:this.sellOrders.sellOrders,buyOrders:this.buyOrders.buyOrders,symbol:this.symbol,marketUseRate:this.marketUseRate,tradeLObj:this.tradeLObj,
                                getCurrAsset:this.getCurrAsset,priceNow:this.priceNow,marketPriceMerge:this.marketPriceMerge,isLoading:this.isLoading,dropdownShow:this.dropdownShow,
                                dropdownIndex:this.dropdownIndex
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