/**
 * hjx 2018.4.16
 */

import React from 'react';
import {ListView, StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ScrollView,WebView} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed,autorun} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import BaseTabView from './baseComponent/BaseTabView'
import VerifyItem from './SignResetPswVerifyItem'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import signBaseStyles from "../style/SignBaseStyle";
import Slider from "./baseComponent/Slider";




const arr = [

	{name:'mimi',age:2},
	{name:'qiuqiu',age:2},
	{name:'huihui',age:1}


]








@observer
export default class Deal extends RNComponent {

	constructor() {
		super()
	}


	@observable price = 10
	@observable amount = 20

	// @computed get total() {
	// 	return this.price * this.amount
	// }


	getCurrencyList() {
		this.$http.send('COMMON_SYMBOLS', {
			bind: this,
			callBack: this.re_getCurrencyList
		});
	}

	re_getCurrencyList(data) {
		typeof(data) == 'string' && (data = JSON.parse(data));
		console.log('SYMBOLS======',data)
	}


	getPrices() {
		this.$http.send('MARKET_PRICES', {
			bind: this,
			callBack: this.re_getCurrencyLists
		})
	}

	//获取服务器时间
    getTimeStamp() {
        this.$http.send('TIMESTAMP', {
            bind: this,
            callBack: this.re_getTimeStamp
        })
    }

    re_getTimeStamp(data) {
        typeof(data) == 'string' && (data = JSON.parse(data));
        console.log('TIMESTAMP======',data)
    }

	// console.log(log)
    //获取K线历史数据
    getBars() {
		var o = this;
		var url = '/v1/market/bars/'+this.$store.state.symbol+'/'+'K_1_DAY';
        this.$http.urlConfigs.BARS = {url:url, method: 'get'};
        this.$http.send('BARS', {
            bind: this,
            query: {
                start:new Date().getTime()-365*2*24*3600*1000,
				end:new Date().getTime()
            },
            callBack: this.re_getBars
        })
    }

    re_getBars(d) {
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

		// console.log('BARS======',this.bars);
		this.sendHistory();
    }

	initSocket() {
        // 订阅某个币对的信息
        // this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
        this.$socket.emit('subscribe', {symbol: ''});

        // 接收所有币对实时价格
        this.$socket.on({
            key: 'topic_prices', bind: this, callBack: (message) => {
                this.socket_price = message;

                console.log('topic_prices======', message)
            }
        })

        // 获取所有币对价格
        this.$socket.on({
            key: 'topic_tick', bind: this, callBack: (message) => {
                // console.log('topic_tick======',message)
                this.socket_tick = message instanceof Array && message[0] || message;
            }
        })

        // 获取深度图信息 左侧列表
        this.$socket.on({
            key: 'topic_snapshot', bind: this, callBack: (message) => {
                // console.log('topic_snapshot======',BDB_ETH
                this.socket_snap_shot = message;
            }
        })


        // 获取k线数据
        this.$socket.on({
            key: 'topic_bar',
            bind: this,
            callBack: (message) => {

                let b = message.data;
                if (!b) return;
                // onRealtimeCallback(
                this.k_data = {
                    time: b[0],
                    open: b[1],
                    high: b[2],
                    low: b[3],
                    close: b[4],
                    volume: b[5]
                }

                // );

				this.sendSocket();
            }
        })
    }


	// 根据当前币对请求买或卖列表
	getCurrencyBuyOrSaleList (){
		this.$http.send('DEPTH', {
			bind: this,
			query: {
				symbol: this.$store.state.symbol
			},
			callBack: this.re_getCurrencyBuyOrSaleList
		})
	}

// 渲染买卖列表信息
	re_getCurrencyBuyOrSaleList (data) {
		typeof(data) == 'string' && (data = JSON.parse(data));

		console.log('DEPTH======',data)
		// this.buy_sale_list = data;
	}







	// 请求btc->cny汇率，header需要
	getExchangeRate() {
		this.$http.send('GET_EXCHANGE__RAGE', {
			bind: this,
			callBack: this.re_getExchangeRate
		})
	}

	// 渲染汇率
	re_getExchangeRate(data) {
		typeof(data) == 'string' && (data = JSON.parse(data));
		// console.log('GET_EXCHANGE__RAGE======',data)
		this.btc_eth_rate = data;
	}





	getCurrency = () => {
		this.$http.send('GET_CURRENCY', {
			bind: this,
			callBack: this.re_getCurrency,
		})
	}


	re_getCurrency = (data) => {
		typeof (data) === 'string' && (data = JSON.parse(data))

		// console.log('GET_CURRENCY======',data)
	}

	//获取账户信息
	getAccounts = () => {
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
		// console.log('GET_ACCOUNTS======', data)
	}


	// price接口数据返回
	re_getCurrencyLists(data) {
		typeof(data) == 'string' && (data = JSON.parse(data));
		console.log('MARKET_PRICES======',data)
	}

	componentDidMount(){
		this.getCurrencyList()
		this.getPrices()
		this.initSocket()
		this.getCurrencyBuyOrSaleList()
		this.getExchangeRate()
		this.getCurrency()
		this.getAccounts()
        this.getBanner()
        this.getTimeStamp()
        this.getBars()

    }


	getBanner() {this.$http.send('GET_HOME_BANNERM', {bind: this,callBack: this.re_getBanner})}
	re_getBanner(res)
	{
		// console.log('GET_HOME_BANNERM======',res)
		// this.imgData = res;
		// this.imgDataReady = true
	}

	@action
	add = () => {
		this.price++
	}

	@computed
	get total (){
		return this.price * this.amount
	}

	@action
	point = (o)=> {
		// console.log('店里;恩',o)
		this.userName = o.name
	}

	// run  = autorun(() => console.log('===',this.price));

	@observable
	userName = ''

	@observable
	sliderPosition = {
		position: 0,
		interval: null
	}

	@observable price = 1
	@observable amount = 20


    sendSymbol = ()=> {
		var d = {data:this.$store.state.symbol, type: 'symbol'};
        this.refs.chart.postMessage(JSON.stringify(d));
		console.log(JSON.stringify(d));
    }

     sendHistory = ()=> {
     	var d = {data:this.bars, type: 'history'};
        this.refs.chart.postMessage(JSON.stringify(d));
        console.log(JSON.stringify(d));

     }

      sendSocket = ()=> {
      	var d = {data:this.k_data || {}, type: 'socket'};
        this.refs.chart.postMessage(JSON.stringify(d));
        console.log(JSON.stringify(d));
      }


	sendMessage = ()=> {
		this.refs.chart.postMessage('data from rn');
	}


	render() {
		return (

			<View style={styles.container}>
				<View style={{height:30}}>

				</View>

				<Text allowFontScaling={false} style={styles.colorRed} onPress={this.add}>
					{this.total}
				</Text>


				<TextInput
                    allowFontScaling={false}
                    autoCapitalize={'none'}
                    style={{width:100,height:50}}
					placeholder={'请输入您的邮箱'}
					placeholderTextColor={'rgba(255,0,0,1)'}
					underlineColorAndroid={'transparent'}
					onChangeText={(text) => {
						this.userName = text
					}}
					value = {this.userName}
                    keyboardType={'email-address'}

                />



			<View　style={{height:400,width:375}}>
                {/*<WebView*/}
                    {/*ref={'chart'}*/}
                    {/*style={{width:375,backgroundColor:'#eee'}}*/}
                    {/*source={require('chart/index.html')}*/}
                    {/*javaScriptRnabled={true}*/}
                    {/*domStorageEnabled={true}*/}
                    {/*decelerationRate="normal"*/}
					{/*onLoad = {this.sendSymbol}*/}
                {/*/>*/}
			</View>









			<Text allowFontScaling={false} onPress={this.sendSymbol}>cklick symbol </Text>
			<Text allowFontScaling={false} onPress={this.sendHistory}>cklick history </Text>
			<Text allowFontScaling={false} onPress={this.sendSocket}>cklick socket </Text>

			</View>

		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},

	listView: {
		// height:getHeight(600),
		marginTop: getHeight(20),
		backgroundColor: '#131316'
	},
	listTitleWrap: {
		height: getHeight(64),
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
		height: getHeight(120),
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
	color80: {color: 'rgba(255,255,255,0.8)'},
	color40: {color: 'rgba(255,255,255,0.4)'},
	colorGreen: {color: '#86CB12'},
	colorRed: {color: '#EF5656'},
	bgGreen: {backgroundColor: '#86CB12'},
	bgRed: {backgroundColor: '#EF5656'},
	row3Btn: {
		width: getWidth(156),
		height: getHeight(58),
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},


	indicatorStyle: {
		backgroundColor: StyleConfigs.btnBlue,
		position: 'absolute',
		left: getWidth(750 / 6 - 750 / 8),
		bottom: 0,
		right: 0,
		height: getHeight(4),
		width: getWidth(750 / 4),
		alignSelf: 'center',
	},
	tabBoxStyle: {
		height: getHeight(80),
		justifyContent: 'center'
	},


	container2: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#000',
		padding: 10,
	},
	halfBox1: {
		flex: 1,
	},
	halfBox2: {
		flex: 1,
	},
	iptBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#0E0E0E',
		// width: getWidth(344),
		height: getHeight(72),
		borderRadius: 4,
		borderColor: '#202126',

	},
	ipt: {
		height: getHeight(72),
		color: '#fff',
		flex: 1,
		textAlign: 'center'
		// lineHeight: getHeight(72)
	},
	img: {
		width: getWidth(68),
		height: getHeight(68)
	},
	ratio: {
		width: getWidth(80),
		height: getHeight(40),
		// lineHeight:getHeight(30),
		borderStyle: 'solid',
		borderColor: '#202126',
		borderWidth: 1,
		borderRadius: 4,
		alignItems: 'center'
	},
	totalMoney: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0E0E0E',
		borderStyle: 'solid',
		borderColor: '#202126',
		borderWidth: 1,
		borderRadius: 4,
		height: getHeight(72)
	},
	dealBtnGreen: {
		backgroundColor: '#86CB12',
		borderRadius: 4,
		height: getHeight(72),
		alignItems: 'center',
		justifyContent: 'center'
	},
	dealBtnRed: {
		backgroundColor: '#EF5656',
		borderRadius: 4,
		height: getHeight(72),
		alignItems: 'center',
		justifyContent: 'center'
	},
	line: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: getHeight(46)


	}


});