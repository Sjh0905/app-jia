/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ListView, WebView,Platform,AsyncStorage} from 'react-native';

import {observer} from 'mobx-react'
import {observable, action, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from './baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import device from '../configs/device/device'
import BaseStyles from "../style/BaseStyle";

import ChartData from "./ChartData";
import changeSymbolIcon from "../assets/DealPage/change-symbol.png";
import MarketDealList from "./MarketDealList";
import Modal from "react-native-modal";
import selectedIcon from "../assets/TraddingHall/traddinghall_selected.png"
import unselectIcon from "../assets/TraddingHall/traddinghall_unselect.png"

// const WEBVIEWRESOURCE = {
//     uri: ''
// }
// const WEBVIEWRESOURCE = require('../assets/chart/index.html');

const WEBVIEWRESOURCE = Platform.select({
    ios: require('../assets/chart/index.html'),
    android: __DEV__ && require('../assets/chart/index.html') || {uri:"file:///android_asset/chart/index.html"},
});
const loadingImg = require('../assets/TraddingHall/gif.gif');
const KLineCacheVersion = '20190911'


const isIOS = Platform.OS == 'ios' ? true : false


@observer
export default class TraddingHall extends RNComponent {


    //获取服务器时间
    getTimeStamp() {
        this.$http.send('TIMESTAMP', {
            bind: this,
            callBack: this.re_getTimeStamp
        })
    }

    re_getTimeStamp(data) {
        typeof(data) == 'string' && (data = JSON.parse(data));
        //console.log('TIMESTAMP======',data)
    }

    // console.log(log)
    //获取K线历史数据
    oldType = null;
    getBars(type, isChangeSymbol) {
        let _type = type || this.oldType || 'K_1_DAY';
        //console.log('=========',this.$store.state.symbol)
        var o = this;
        var url = '/v1/market/bars/'+this.$store.state.symbol+'/'+ _type;
        this.$http.urlConfigs.BARS = {url:url, method: 'get'};
        this.$http.send('BARS', {
            bind: this,
            query: this.getKlineDay(_type),
            callBack: this.re_getBars.bind(this, type,isChangeSymbol)
        })
    }

    re_getBars(type,isChangeSymbol,d) {
        console.log('历史数据加载了一次',d);
        // typeof(data) == 'string' && (data = JSON.parse(data));
        if(!d)
            return;

        var data = d.bars;
        var i, b;
        this.bars = [];
        for(var i = 0; i < data.length; ++i) {
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
            if(this.hasLoad && this.hasBars){
                if(type){
                    this.sendHistoryChange();
                }else{
                    this.sendHistory();
                }
            }
        }
    }

    initListen() {
        // this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol})
        // this.$socket.emit('subscribe', {symbol: this.$store.state.symbol})
        // 获取k线数据
        this.listen({key: 'KLINE_DATA',func:this.sendSocket})
        this.listen({key:'HIDE_MARKET_MODAL_FUNC',func:this.hideMarketModalFunc});

        // return;
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

    sendMessage = () => {
        this.hasLoad = true;
        this.sendSymbol();

        if(this.hasBars && this.hasLoad)
            this.sendHistory();
    }
    @computed get exchangRateDollar(){
        return this.$store.state.exchangRateDollar
    }


    @computed
    get buyList (){
        let buyOrdersTemp = this.$store.state.depthMerge && this.$store.state.depthMerge.buyOrders || []
        let buyList = this.getPriceChangeOrders(buyOrdersTemp).slice() || []
        return buyList
    }

    @computed
    get sellList (){

        let sellOrdersTemp = this.$store.state.depthMerge && this.$store.state.depthMerge.sellOrders || []
        let sellList = this.getPriceChangeOrders(sellOrdersTemp).slice() || []
        return sellList
    }


    @computed
    get marketPriceMerge() {
        return this.$store.state.marketPriceMerge && this.$store.state.marketPriceMerge[this.$store.state.symbol] || {}
    }

    @computed get newPrice(){
        return this.$store.state.newPrice || {}
    }

    @computed get priceNow(){
        return this.$store.state.newPrice || this.$store.state.depthMerge || {}
    }

    @computed get depthMerge(){
        return this.$store.state.depthMerge || {}
    }
    @computed get symbol(){
        return this.$store.state.symbol || {}
    }

    @computed get tradeLObj() {
        if (this.$store.state.tradeList && this.$store.state.tradeList[this.symbol])
            return this.$store.state.tradeList[this.symbol];

        return {};
    }
    //K线中的价格精度
    @computed get KlineQuoteScale() {
        return Math.pow(10,this.tradeLObj.quoteScale || 8) || 100000000;
    }

    @computed get marketUseRate() {
        return this.$store.state.marketUseRate || {}
    }

    //收藏的币对
    @computed get collectionSymbols() {
        return this.$store.state.collectionSymbols || [];
    }

    @computed
    get GRCPriceRange() {
        return this.$store.state.GRCPriceRange || []
    }

    getPriceChangeOrders = (transaction)=> {

        let transactionData = [...transaction]

        if(this.symbol == 'KK_USDT' && this.GRCPriceRange.length >0){
            let minPrice = this.GRCPriceRange[0] || 0;
            let maxPrice = this.GRCPriceRange[this.GRCPriceRange.length -1] || 10;

            // console.log('this is minPrice',minPrice,'maxPrice',maxPrice);

            if(transactionData instanceof Array)
                transactionData = transactionData.filter(v => !!v && v.price >= minPrice && v.price <= maxPrice)

            transactionData = transactionData.splice(0, 20)
            return transactionData || []
        }

        transactionData = transactionData.splice(0, 20)
        return transactionData || []

    }

    goBack = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.goBack()
        }
    })()

    goDeal0 = () => {
        this.$router.goBackToRoute('Home')
        setTimeout(()=>{
            this.notify({key: 'CHANGE_TAB'}, 2);
            setTimeout(()=>{
                this.notify({key: 'SET_TAB_INDEX'},0);
                this.notify({key: 'CLEAR_INPUT'});
            })
        })
    }

    goDeal1 = () => {
        this.$router.goBackToRoute('Home')
        setTimeout(()=>{
            this.notify({key: 'CHANGE_TAB'}, 2);
            setTimeout(()=>{
                this.notify({key: 'CLEAR_INPUT'});
                this.notify({key: 'SET_TAB_INDEX'},1);
            })
        })
    }

    sendSymbol = ()=> {
        var d = {data:this.$store.state.symbol, type: 'symbol'};
        //this && this.chart && this.chart.postMessage(JSON.stringify(d));
        this && this.chart && this.chart.injectJavaScript('var symbol="' + this.$store.state.symbol + '"')
        //console.log(JSON.stringify(d));
    }

    sendHistory = ()=> {
        this.isLoading && (this.isLoading = false);
        var d = {data:this.bars, type: 'history',KlineQuoteScale:this.KlineQuoteScale};
        this && this.chart && this.chart.postMessage(JSON.stringify(d));
        console.log(JSON.stringify(d));
    }

    sendHistoryChange = ()=>{
        var d = {data:this.bars, type: 'historyChange', barType: this.barArray[this.currentBar].barType, lineType: this.barArray[this.currentBar].lineType,KlineQuoteScale:this.KlineQuoteScale};

        console.log('barchange-=========================',d)
        this && this.chart && this.chart.postMessage(JSON.stringify(d));
    }

    reloadHistory = ()=>{
        var d = {data:this.bars, type: 'reloadHistory', barType: this.barArray[this.currentBar].barType, lineType: this.barArray[this.currentBar].lineType, symbol: this.$store.state.symbol,KlineQuoteScale:this.KlineQuoteScale};
        console.log('barchange-=========================',d)
        this && this.chart && this.chart.postMessage(JSON.stringify(d));
    }

    //向webview发送当前的网络状态
    sendNetWorkState = (isNONE)=>{
        this && this.chart && this.chart.postMessage(JSON.stringify({
            type: 'networkStateChange',
            data: isNONE
        }))
    }

    sendSocket = (data)=> {
        let type = this.barArray[this.currentBar]['value'];
        if(data.type === type){
            console.log(data)
            var d = {data:data || {}, type: 'socket',KlineQuoteScale:this.KlineQuoteScale};
            this && this.chart && this.chart.postMessage(JSON.stringify(d));
        }
    }

    @observable
    isShowBar = false;
    //显示bar
    showBar = () => {
        this.hasLoad && (this.isShowBar = true);
    }
    //隐藏bar
    hideBar = () => {
        this.isShowBar && (this.isShowBar = false);
    }
    //设置bar
    setBar = (val) =>{
        this.currentBar = val;
        //this.hideBar();
        //加载数据
        //1 获取新的历史记录
        this.getBars(this.barArray[val]['value']);
        //剩下的内容在web端执行
        //2 修改webview 的历史数据
        //3 调用webview的点击事件
    }

    renderError=(e)=>{
        if(e === 'NSURLErrorDomain'){
            return;
        }
    }

    @observable
    currentBar = this.barArray.length - 1;
    barArray = [{
        name: '分时',
        value: 'K_1_MIN',
        lineType: 3,
        barType: '1'
    },
        {
            name: '5分',
            value: 'K_1_MIN',
            lineType: 1,
            barType: '5'
        },
        {
            name: '15分',
            value: 'K_1_MIN',
            lineType: 1,
            barType: '15'
        },
        {
            name: '30分',
            value: 'K_1_MIN',
            lineType: 1,
            barType: '30'
        },
        {
        name: '1小时',
        value: 'K_1_HOUR',
        lineType: 1,
        barType: '60'
    },
        {
            name: '4小时',
            value: 'K_1_HOUR',
            lineType: 1,
            barType: '240'
        },
        {
        name: '日线',
        value: 'K_1_DAY',
        lineType: 1,
        barType: 'D'
    }];

    componentWillMount(){
        this.oldSymbol = null;


        AsyncStorage.getItem('KLineCacheVersionObj').then((data)=> {
            console.log('this is _KLineCacheVersionObj',data);

            if(!data){
                this._KLineCacheVersionObj = {};
            }else{
                typeof data == 'string' && (this._KLineCacheVersionObj = JSON.parse(data))
            }
        })


        var symbol = this.$store.state.symbol
        AsyncStorage.getItem(symbol).then((data)=>{

            //如果本地缓存中存在
            if(data){

                data && (data = JSON.parse(data))
                // data && this.re_getBars('','',data);
                console.log('this is AsyncStorage symbol为'+symbol+'的K线',data);

                let startTime = data.nextStartTime

                //如果新上的币对，本地数据是[]，需要从1年前开始调取，保证后台新导的K线能查询
                if(data.bars instanceof Array && data.bars.length == 0){
                    startTime = this.$store.state.serverTime - 365*24*3600*1000
                }

                let lastDate = new Date(startTime);
                let nowDate = new Date();

                // if(lastDate.getMonth() == nowDate.getMonth()){
                //
                //     //如果本月昨天的K线已经存在，开始时间是昨天
                //     if(lastDate.getDate() == nowDate.getDate() - 1){
                //     }
                //     console.log('昨天的K线已经存在，不需要再调取接口，直接渲染本地数据');
                //     this.re_getBars('','',data)
                //     return;
                // }

                let _type = 'K_1_DAY';
                var url = '/v1/market/bars/'+symbol+'/'+ _type;
                this.$http.urlConfigs['BARS_'+symbol] = {url:url, method: 'get'};
                this.$http.send('BARS_'+symbol, {
                    bind: this,
                    query: {
                        start: startTime,
                        end: this.$store.state.serverTime
                    },
                    callBack: this.re_joinBars.bind(this,symbol,data)
                })

            }else{
                //如果本地缓存中没有
                // this.getBars();
                console.log('本地缓存中没有'+symbol+'的数据');
                let _type = 'K_1_DAY';


                var symbolKline =  ChartData[symbol+'_'+_type];
                if(symbolKline){
                    this.re_setKLineToAsyncStorage(symbol,symbolKline)
                    // return//取完本地文件的数据后允许继续调用接口获取最新数据
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
        })

    }

    re_joinBars = (symbol,data,d)=>{
        console.log(symbol+'需要拼接的两分数据',data,d)

        //如果缓存中的最后一条数据和接口获取的第一条相同，删除缓存中的最后一条
        if(d && JSON.stringify(data.bars[data.bars.length-1]) == JSON.stringify(d.bars[0])){
            console.log('缓存中的最后一条数据和接口获取的第一条相同');
            // data.bars.length--;
            data.bars.splice(data.bars.length-1,1);
        }
        data.bars = data.bars.concat(d.bars)
        // console.log('需要拼接的两分数据',data)
        data && this.re_getBars('','',data);
        // data && this.re_getBars('','',data);

        //页面渲染后需要重新保存在本地缓存
        let bars = data.bars;
        //默认最后一条数据的时间是下一次更新的开始时间
        data.nextStartTime = bars.length > 0 ? bars[bars.length - 1][0] : (this.$store.state.serverTime - 2 * 24 * 60 * 60 * 1000);
        console.log('this is symbol为'+symbol+'的K线',data);
        AsyncStorage.setItem(symbol,JSON.stringify(data))
    }

    re_setKLineToAsyncStorage = (symbol,d)=>{
        if(!d)return;

        this.re_getBars('','',d)

        let bars = d.bars;
        //默认最后一条数据的时间是下一次更新的开始时间
        d.nextStartTime = bars.length > 0 ? bars[bars.length - 1][0] : (this.$store.state.serverTime - 2 * 24 * 60 * 60 * 1000);
        console.log('this is traddinghall 中 symbol为'+symbol+'的K线',d);
        AsyncStorage.setItem(symbol,JSON.stringify(d))


        this._KLineCacheVersionObj[symbol] = KLineCacheVersion
        AsyncStorage.setItem('KLineCacheVersionObj',JSON.stringify(this._KLineCacheVersionObj));

        // setTimeout(()=>{
        //     AsyncStorage.getItem(symbol).then((data)=>{
        //         console.log('this is AsyncStorage symbol为'+symbol+'的K线',data);
        //     })
        // })
    }

    componentDidMount(){
        this.initListen()
        this.getTimeStamp()
        //this.getBars()

        // this.listen({key: 'onNetworkStateChange',func: this.sendNetWorkState})

    }

    componentWillUpdate(){
        if(this.oldSymbol != null && this.oldSymbol != this.$store.state.symbol){
            //第二次
            this.getBars(undefined, true);
        }
        this.oldSymbol = this.$store.state.symbol;
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.chart = null;
    }

    @observable
    isLoading = true;



    clickTitle =( () => {


	    let last = 0;
	    return (...paras) => {
		    if (Date.now() - last < 1000) return;
		    last = Date.now();
		    this.$router.push('MarketList',{transition:'forVertical'})
	    }
    })()

    getKlineDay = (type)=>{
        if(type === 'K_1_MIN'){
            return {
                start: this.$store.state.serverTime-2*24*3600*1000,
                end: this.$store.state.serverTime
            }
        }
        if(type === 'K_1_HOUR'){
            return {
                start: this.$store.state.serverTime-30*24*3600*1000,
                end: this.$store.state.serverTime
            }
        }
        if(type === 'K_1_DAY'){
            return {
                start: this.$store.state.serverTime-365*24*3600*1000,
                end: this.$store.state.serverTime
            }
        }
    }


	@observable showMarketModal = false//切换币对


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


	//改变币种自选状态
    operCollect = (symbol,itemSelect)=>{

        console.log('修改自选币种状态',{
            symbol: symbol,
            status: !itemSelect
        });

        this.loading = true;

        //如果没有登录本地缓存
        if(!this.$store.state.authMessage.userId){
            let collectionMarket = [];

            // 如果是增加
            if (!itemSelect) {
                collectionMarket = this.$globalFunc.addArray(symbol,(this.collectionSymbols || []).slice())
            }
            // 如果是减少
            if (itemSelect) {
                collectionMarket = this.$globalFunc.removeArray(symbol, (this.collectionSymbols || []).slice())
            }

            AsyncStorage.setItem('collectionSymbols',collectionMarket.toString(),()=>{
                this.notify({key:'GET_COLLECTION_MARKET'});
                this.loading = false;
                this.$globalFunc.toast('操作成功！',{
                    duration:1000
                })
            })
            return;
        }



        this.$http.send('POST_COLLECTION_SYMBOL', {
            bind: this,
            params: {
                symbol: symbol,
                status: !itemSelect
            },
            callBack: this.re_operCollect,
            errorHandler: this.error_operCollect
        })

    }

    re_operCollect = (data)=>{
        typeof data === 'string' && (data = JSON.parse(data))

        if(data.errorCode == 0){
            this.notify({key:'GET_COLLECTION_MARKET'})
            this.$globalFunc.toast('操作成功！',{
                duration:1000
            })
        }
        this.loading = false;

        console.log('this is collectionSymbols',this.collectionSymbols);

    }

    error_operCollect = (err) =>{
        this.loading = false;
        console.log('opper collectionSymbols error',err);
    }


    render() {

        let symbol = this.$store.state.symbol;
        let itemSelect = this.collectionSymbols.indexOf(symbol) > -1;

        return (
            <View style={[styles.container]}>
                {/*<NavHeader
                    headerTitle={this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}
                    goBack={this.goBack}
                    touchComp={<View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text allowFontScaling={false} style={{color:StyleConfigs.txt172A4D,fontSize:StyleConfigs.fontSize17}}>{this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}</Text>
                        <Image source={require('../assets/TraddingHall/xiajiantou.png')}
                               style={{width: 8, height: 4,  marginLeft: 5}}/>
                    </View>}
                    touchCompClick={this.clickTitle}
                />*/}
                <View style={[styles.container2, BaseStyles.navBgColor0602, !isIOS && styles.androidContainer,]}>
	                <View style={[styles.IOSStatusBar, !isIOS && styles.androidStatusBar]}></View>
	                <View style={{width: '100%',height: getHeight(88),paddingHorizontal:15,flexDirection:'row',justifyContent:'space-between'}}>
		                <View style={{flexDirection:'row',alignItems:'center'}}>
			                <TouchableOpacity onPress={this.goBack} activeOpacity={0.8} hitSlop={{top:15,left:15,
				                bottom:15, right:15}}>
				                <Image source={require('../assets/NavigationHeader/go-back-icon2.png')} style={{ width: getWidth(32),height: getHeight(32), marginLeft:1}} resizeMode={'contain'}/>
			                </TouchableOpacity>

			                <View style={{backgroundColor:'#c5cfd5', height:getHeight(30), width:1,marginHorizontal:getWidth(30)}}/>
			                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} activeOpacity={0.8}
			                                  onPress={this.showMarketModalFunc}>
				                <Image source={require('../assets/DealPage/change-symbol.png')} style={{ width: getWidth(56),height: getHeight(56)}} resizeMode={'contain'}/>
				                <Text style={[{fontSize:StyleConfigs.fontSize20,marginLeft: getWidth(-12)},styles.color172A4D, ]}>{this.$store.state.symbol.split('_')[0] + ' / ' + this.$store.state.symbol.split('_')[1]}</Text>
			                </TouchableOpacity>

		                </View>
		                <View style={styles.collectionBox}>
                            <TouchableOpacity style={styles.collectionBtn} onPress={()=>this.operCollect(symbol,itemSelect)} activeOpacity={StyleConfigs.activeOpacity}>
                                {itemSelect &&
                                    <Image source={selectedIcon} style={styles.collectionImg}/>
                                    ||
                                    <Image source={unselectIcon} style={styles.collectionImg}/>
                                }
                            </TouchableOpacity>
		                </View>
	                </View>
                </View>



                <ScrollView style={{

                    //flex: 1,
                    backgroundColor:StyleConfigs.bgColor}}>


	                <View style={{paddingHorizontal:15,paddingVertical:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
						<View>
							<Text allowFontScaling={false}
							      style={[this.priceNow.price - this.marketPriceMerge[1]>=0 && styles.colorGreen || styles.colorRed, {fontSize: 30,fontWeight:'bold',fontFamily:'System',
								      marginTop:-getHeight(12)}]}>{this.$globalFunc.accFixed(this.priceNow.price||0, this.tradeLObj.quoteScale || 8)}</Text>
							<View style={{flexDirection:'row', marginTop:getHeight(14)}}>
								<Text allowFontScaling={false}
								      style={[{color:StyleConfigs.txt6B7DA2,fontSize: StyleConfigs.fontSize14,marginTop: 0,marginLeft: 3}]}>≈{this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate[this.symbol.split('_')[1]] * this.exchangRateDollar) || 0,2)}CNY</Text>
								<Text allowFontScaling={false} style={[this.priceNow.price - this.marketPriceMerge[1]>=0 && styles.colorGreen || styles.colorRed, {fontSize: StyleConfigs.fontSize14,marginTop: 0,marginLeft:getWidth(12)}]}>{((((this.priceNow.price - this.marketPriceMerge[1]) / this.marketPriceMerge[1])*100)||0).toFixed(2)}%</Text>
							</View>

						</View>
						<View>
							<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={[styles.color6B7DA2,styles.size12,{marginRight:getWidth(48)}]}>高</Text><Text allowFontScaling={false} style={[styles.color172A4D, styles.size12]}>{this.$globalFunc.accFixed(Math.max(this.marketPriceMerge[2],this.priceNow.price),this.tradeLObj.quoteScale || 8)}</Text></View>
							<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={[styles.color6B7DA2,styles.size12,{marginRight:getWidth(48),marginVertical:getHeight(20)}]}>低</Text><Text allowFontScaling={false}	style={[styles.color172A4D, styles.size12]}>{this.$globalFunc.accFixed(Math.min(this.marketPriceMerge[3],this.priceNow.price||99999),this.tradeLObj.quoteScale || 8)}</Text></View>
							<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={[styles.color6B7DA2,styles.size12,{marginRight:getWidth(30)}]}>24H</Text><Text allowFontScaling={false} style={[styles.color172A4D, styles.size12]}>{ ( this.marketPriceMerge[5]||0.00000000)}</Text></View>

						</View>
	                </View>




                   {/* <View style={{height: getHeight(170), padding: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text allowFontScaling={false}
                                style={[this.priceNow.price - this.marketPriceMerge[1]>=0 && styles.colorGreen || styles.colorRed, {fontSize: 18}]}>{this.$globalFunc.accFixed(this.priceNow.price||0, this.tradeLObj.quoteScale || 8)}</Text>
                            <Text
                                allowFontScaling={false}
                                style={[this.priceNow.price - this.marketPriceMerge[1]>=0 && styles.colorGreen || styles.colorRed, {fontSize: 18}]}>{this.marketPriceMerge[4]-this.marketPriceMerge[1]>=0 && '↑' || '↓'}</Text>
                            <Text
                                allowFontScaling={false}
                                style={[{color:StyleConfigs.txt172A4D,fontSize: StyleConfigs.fontSize13,marginTop: 3,marginLeft: 3}]}>
                                ¥{this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate[this.symbol.split('_')[1]] * this.exchangRateDollar) || 0,2)}
                            </Text>
                        </View>


                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: getHeight(20)}}>
                             <View style={{flexDirection: 'row'}}>
                                <Text
                                    allowFontScaling={false}
                                    style={[this.priceNow.price - this.marketPriceMerge[1]>=0 && styles.colorGreen || styles.colorRed, {fontSize: 14}, {marginRight: 10}]}>{this.$globalFunc.accFixed(this.priceNow.price - this.marketPriceMerge[1],this.tradeLObj.quoteScale || 8)}</Text>
                                <Text
                                    allowFontScaling={false}
                                    style={[this.priceNow.price - this.marketPriceMerge[1]>=0 && styles.colorGreen || styles.colorRed, {fontSize: 14}]}>{((((this.priceNow.price - this.marketPriceMerge[1]) / this.marketPriceMerge[1])*100)||0).toFixed(2)}%</Text>
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <Text allowFontScaling={false} style={[styles.color9FA7B8, styles.size12, {marginRight: 10}]}>24h最低价</Text>
                                <Text
                                    allowFontScaling={false}
                                    style={[styles.color172A4D, styles.size12]}>{this.$globalFunc.accFixed(Math.min(this.marketPriceMerge[3],this.priceNow.price||99999),this.tradeLObj.quoteScale || 8)}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text allowFontScaling={false} style={[styles.color9FA7B8, styles.size12, {marginRight: 10}]}>24h成交量</Text>
                                {console.log('marketPriceMerge',this.marketPriceMerge,'pricenow====',this.priceNow)}
                                <Text
                                    allowFontScaling={false}
                                    style={[styles.color172A4D, styles.size12]}>{ ( this.marketPriceMerge[5]||0.00000000)} {this.$store.state.symbol.split('_')[0]}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text allowFontScaling={false} style={[styles.color9FA7B8, styles.size12, {marginRight: 10}]}>24h最高价</Text>
                                <Text allowFontScaling={false}
                                    style={[styles.color172A4D, styles.size12]}>{this.$globalFunc.accFixed(Math.max(this.marketPriceMerge[2],this.priceNow.price),this.tradeLObj.quoteScale || 8)}</Text>
                            </View>


                        </View>
                    </View>*/}

                    <View style={{
                        height: getHeight(76),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // marginTop: getHeight(20),
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: '#fff',
	                    borderBottomColor: '#f4f5f7',
	                    borderBottomWidth:getHeight(10),
	                    borderStyle:'solid'
                    }}>
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*onPress={this.showBar}*/}
                            {/*style={styles.showBarBtn}>*/}
                            {/*<Text allowFontScaling={false} style={[styles.size15, {color: '#3576F5'}]}>{this.barArray[this.currentBar]['name']}</Text>*/}
                            {/*<View style={styles.triangle}></View>*/}
                        {/*</TouchableOpacity>*/}
                        {
                            this.barArray.length > 0 && this.barArray.map((v,i)=><TouchableOpacity
                                key={i}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.setBar.bind(this, i)}
                                style={[styles.showBarBtn,{borderStyle: 'solid',borderBottomWidth: 2,borderBottomColor:this.currentBar === i &&  '#172A4d' || 'transparent'}]}>
                                <Text allowFontScaling={false} style={[styles.size12, {color: this.currentBar === i && '#172A4d'|| '#6B7DA2',fontWeight:this.currentBar === i && 'bold'|| 'normal'}]}>{v.name}</Text>
                            </TouchableOpacity>)
                        }
                        {/*<Text allowFontScaling={false} style={[styles.size14, styles.color172A4D]}></Text>*/}
                    </View>
                    <View style={{height: getHeight(700),position:'relative'}}>
                        <WebView
                            ref={(chart)=>{
                                if(!chart)return;
                                this.chart = chart
                            }}
                            renderError={this.renderError}
                            //style={{width:getWidth(750),backgroundColor:'#eee'}}
							//source={require('chart/index.html')}
                            source={WEBVIEWRESOURCE}
                            decelerationRate="normal"
                            onLoadEnd = {this.sendMessage}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            allowUniversalAccessFromFileURLs={true}//安卓专用，允许跨域
                            mixedContentMode={'always'}
                        />
                        {/*{!!this.isLoading &&*/}
                            {/*<View*/}
                            {/*style={{*/}
                                {/*position:'absolute',*/}
                                {/*top:0,*/}
                                {/*left: 0,*/}
                                {/*width: '100%',*/}
                                {/*height: '100%',*/}
                                {/*backgroundColor: StyleConfigs.bgColor,*/}
                                {/*zIndex: 999,*/}
                                {/*alignItems:'center',*/}
                                {/*justifyContent:'center'*/}
                            {/*}}>*/}
                            {/*<Image*/}
                                {/*resizeMode={'contain'}*/}
                                {/*style={{*/}
                                    {/*width:'10%'*/}
                                {/*}}*/}
                                {/*source={loadingImg}*/}
                            {/*/>*/}
                        {/*</View>}*/}
                    </View>


                    <View style={styles.listTitleWrap}>
                        <View style={styles.titleSide}><Text style={[styles.titleText,styles.size12]}>买盘</Text><Text style={[styles.titleText,styles.size12]}>数量({this.$store.state.symbol.split('_')[0]})</Text></View>
                        <View style={styles.titleMid}><Text style={[styles.titleText,styles.size12]}>价格({this.$store.state.symbol.split('_')[1]})</Text></View>
                        <View style={styles.titleSide}><Text style={[styles.titleText2,styles.size12]}>数量({this.$store.state.symbol.split('_')[0]})</Text><Text style={[styles.titleText2,styles.size12]}>卖盘</Text></View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // paddingLeft: 10,
                        // paddingRight: 10
                    }}>

                        <View style={styles.xbox}>
                            {/*<Text allowFontScaling={false} style={[*/}
                            {/*    styles.colorC5CFD5,*/}
                            {/*    styles.size12,*/}
                            {/*    {marginTop: getHeight(20),*/}
                            {/*        marginBottom: getHeight(20),*/}
                            {/*        paddingLeft: 10,*/}
                            {/*        paddingRight: 5}*/}
                            {/*    ]}>买</Text>*/}
                            <View style={{
                                // height: getHeight(224),
                                overflow: 'hidden',
                                // borderStyle: 'solid',
                                // borderTopWidth: StyleSheet.hairlineWidth,
                                // borderTopColor: StyleConfigs.borderBottomColor,
                                paddingLeft: getWidth(30),
                                paddingRight: 5,

                            }}>

                                {

                                    this.buyList.length > 0 && this.buyList.map(
                                        (o, i) => {
                                            return (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    // marginTop: PlatformOS === 'ios' && getHeight(4) || getHeight(2),//ios写的是getHeight(4)
                                                    // marginBottom: getHeight(2)
                                                    height:getHeight(60),
                                                    alignItems:'center'
                                                }} key={'market' + i}>
                                                    <View style={styles.listLineWrap}>
                                                        <Text allowFontScaling={false} style={[{color:'#6B7DA2',marginRight:getWidth(30)}, styles.size13]}>{i+1}</Text>
                                                        <Text allowFontScaling={false} style={[styles.color172A4D, styles.size13]}>{this.$globalFunc.formatDealAmount(this.symbol,o.amount,this.tradeLObj.baseScale)}</Text>

                                                    </View>

                                                    <Text
                                                        allowFontScaling={false}
                                                        style={[styles.colorGreen, styles.size13]}>{this.$globalFunc.accFixed(o.price, this.tradeLObj.quoteScale || 8)}</Text>
                                                </View>
                                            )
                                        }
                                    )

                                }
                            </View>
                        </View>
                        {/*<View style={{width: 10}}></View>*/}
                        <View style={styles.xbox}>
                            {/*<Text allowFontScaling={false} style={[*/}
                            {/*    styles.colorC5CFD5,*/}
                            {/*    styles.size12,*/}
                            {/*    {marginTop: getHeight(20),marginBottom: getHeight(20),paddingLeft: 5,*/}
                            {/*        paddingRight: 10}*/}
                            {/*    ]}>卖</Text>*/}
                            <View style={{
                                // height: getHeight(224),
                                overflow: 'hidden',
                                // borderStyle: 'solid',
                                // borderTopWidth: StyleSheet.hairlineWidth,
                                // borderTopColor: StyleConfigs.borderBottomColor,
                                paddingLeft: 5,
                                paddingRight: getWidth(30)
                            }}>

                                {
                                    this.sellList.length > 0 && this.sellList.map(
                                        (o, i) => {
                                            return (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    // marginTop: PlatformOS === 'ios' && getHeight(4) || getHeight(2),//ios写的是getHeight(4)
                                                    // marginBottom: getHeight(2),
                                                    height:getHeight(60),
                                                    alignItems:'center'

                                                }} key={'market2' + i}>
                                                    <Text
                                                        allowFontScaling={false}
                                                        style={[styles.colorRed, styles.size13]}>{this.$globalFunc.accFixed(o.price,this.tradeLObj.quoteScale || 8)}</Text>
                                                    <View style={styles.listLineWrap}>
                                                        {/*<Text allowFontScaling={false} style={[styles.color172A4D, styles.size13]}>{o.amount}</Text>*/}
                                                        <Text allowFontScaling={false} style={[styles.color172A4D, styles.size13]}>{this.$globalFunc.formatDealAmount(this.symbol,o.amount,this.tradeLObj.baseScale)}</Text>
                                                        <Text allowFontScaling={false} style={[{color:'#6B7DA2',marginLeft:getWidth(30)}, styles.size13]}>{i+1}</Text>
                                                    </View>


                                                </View>
                                            )
                                        }
                                    )

                                }
                            </View>
                        </View>


                    </View>
                    <View style={{
                        height: getHeight(getDeviceTop(true)+10+80)
                    }}>

                    </View>

                </ScrollView>
                <View style={{
                    width: '100%',
                    position: 'absolute',
                    paddingBottom: getHeight(getDeviceTop(true) + 10),
                    paddingTop:getHeight(10),
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor:StyleConfigs.bgF2FFFFFF,
	                paddingHorizontal:getWidth(20),
                    shadowColor:  StyleConfigs.borderShadowColor,
                    shadowOffset: {width: 2, height: 2,},
                    shadowOpacity: 1,
                    shadowRadius: 7,
                    elevation: 5//安卓专用
                }}>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={[styles.bbtn, styles.bgGreen]} onPress={this.goDeal0}>
                        <Text allowFontScaling={false} style={{color: '#fff', fontSize: 15}}>买入</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={[styles.bbtn, styles.bgRed]} onPress={this.goDeal1}>
                        <Text allowFontScaling={false} style={{color: '#fff', fontSize: 15}}>卖出</Text>
                    </TouchableOpacity>
                </View>
                {/*点击会消失的窗口*/}
                {this.isShowBar &&
                <TouchableOpacity
                    onPress={this.hideBar}
                    ref={'wall'}
                    style={styles.wall}
                >
                    <View style={styles.barBox}>
                        {
                            this.barArray.length > 0 && this.barArray.map((val, i)=>{
                                let style = [styles.barBtn];
                                i == this.currentBar && style.push(styles.barBtnActive);
                                return <Text
                                    allowFontScaling={false}
                                    key={'barbtn_' + i}
                                    onPress={this.setBar.bind(this,i)}
                                    style={style}
                                >{val.name}
                                </Text>
                            })
                        }
                    </View>
                </TouchableOpacity>
                }



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

            </View>
        )
    }
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleConfigs.navBgColor0602,
	    paddingTop: getDeviceTop()
    },


    size12: {fontSize: StyleConfigs.fontSize12},
    size13: {fontSize: StyleConfigs.fontSize13},
    size14: {fontSize: StyleConfigs.fontSize14},
    size15: {fontSize: StyleConfigs.fontSize15},
    color100: {color: '#fff'},
    color172A4D: {color: StyleConfigs.txt172A4D},
    color6B7DA2: {color: StyleConfigs.txt6B7DA2},
    colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
    color9FA7B8: {color: StyleConfigs.txt9FA7B8},
    colorGreen: {color: StyleConfigs.txtGreen},
    colorRed: {color: StyleConfigs.txtRed},
    bgGreen: {backgroundColor: '#34A753'},
    bgRed: {backgroundColor: '#EF5656'},
    xbox: {
        flex: 1
    },
    bbtn: {
        width:PlatformOS === 'ios' && getWidth(344) || getWidth(330),
        height: getHeight(80),
        borderRadius: StyleConfigs.borderRadius1o5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    showBarBtn:{
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderBottomColor: '#3576F5',
        height: '100%',
	    // borderBottomColor: '#3576F5',

	    // borderBottomWidth: 2
    },
    triangle: {
        marginLeft: getWidth(10),
        marginTop: getHeight(10),
        height: 0,
        borderTopColor: '#3576F5',
        borderWidth: getHeight(10),
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        width: getWidth(18.4)
    },
    wall: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    barBox: {
        marginTop: getHeight(380),
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
        backgroundColor:'#3a3a3a',
        height: getHeight(76),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    barBtn: {
        paddingTop: getHeight(10),
        paddingBottom:getHeight(10),
        paddingLeft: getWidth(10),
        paddingRight: getWidth(10),
        color: '#fff'
    },
    barBtnActive: {
        color: '#3576F5'
    },
    listTitleWrap: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal:getWidth(30),
        paddingVertical:getHeight(32),
        borderTopColor: '#f4f5f7',
        borderTopWidth:getHeight(10),
        borderStyle:'solid'


    },
    titleSide:{
        flexDirection:'row',
    },
    titleText:{
        marginRight: getWidth(20),
        color:'#A2B5D9',
    },
    titleText2:{
        marginLeft: getWidth(20),
        color:'#A2B5D9',
    },
    listLineWrap:{
        flexDirection:'row',

    },
	container2: {
		flexDirection: "column",
		alignItems: "center",
		height: getHeight(128),
		width: '100%',

		// borderColor: 'green',
		// borderStyle: 'solid',
		// borderWidth: 1,
	},
	androidContainer: {
		height: getHeight(88),
		// marginTop:getHeight(20),
	},

	IOSStatusBar: {
		height: getHeight(40),

		// borderColor: 'blue',
		// borderStyle: 'solid',
		// borderWidth: 1,
	},
	androidStatusBar: {
		height: getHeight(0),
	},
	modalScrollView:{
		// flex:1,
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		// alignItems:'flex-end',
		// flexDirection:'row-reverse',
		flexDirection:PlatformOS === 'ios' ? 'row-reverse' :'row',
		backgroundColor:'#00000080',
		zIndex:9999
	},
    collectionBox:{
        height:'100%',
    },
    collectionBtn:{
        height:'100%',
        width:getWidth(100),
        alignItems:'flex-end',
        justifyContent:'center'
    },
    collectionImg:{
        width:getWidth(32),
        height:getWidth(32)
    }

})
