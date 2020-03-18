/**
 * Created by chest on 10/10/2019.
 */


/**
 * Created by chest on 09/23/2019.
 */


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
	Platform, AsyncStorage, ImageBackground,ActivityIndicator
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import Toast from 'react-native-root-toast'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal'

import OtcHeader from '../common/OtcHeader'
import GlobalFunc from "../../configs/globalFunctionConfigs/GlobalFunction";
import Fetch from '../common/FetchUtil'

import OrderListHeader from "../common/OrderListHeader";




const ORDER_STATUS = {COMPLETE:'已完成',CANCEL:'已取消',PROCESSING:'进行中',EXPIRE1:'确认付款超时',EXPIRE2:'确认收款超时',APPEAL:'申诉订单',ABNORMAL:'订单异常'}


const statusExcute = (orderStatus,confirmStatus)=>{
	if(orderStatus !== '进行中') return orderStatus;
	if( confirmStatus === "BUYER_CONFIRM" ) return '买方已确认付款';
	if( confirmStatus === "UNCONFIRMED" ) return '等待买方付款';

}






@observer
export default class OtcOrderList extends RNComponent {



	componentDidMount() {
		super.componentDidMount();
		this.listen({key: 'REFRESH_CTC_ORDERLIST', func: this.getAllList});
		this.getAllList()
	}

	@observable completeList = []
	@observable cancelList = []
	@observable processingList = []

	@observable hadInit = false

	@computed
	get excuteList(){
		return [...this.completeList,...this.cancelList,...this.processingList].sort((a,b)=>b.createdAt-a.createdAt)
	}

	getAllList = async _ =>{
		this.hadInit = false
		await this.getOrderListComplete()
		await this.getOrderListCancel()
		await this.getOrderListProcessing()
		this.hadInit = true
	}

	getOrderListComplete = async _ =>{
		let params = {offset:1,maxResults: 50,status: 'COMPLETE',ctcOrderId:''}
		let data = await Fetch('GET_LIST_ORDERS',params,this)
		typeof data === 'string' && (data = JSON.parse(data))
		console.log('data========COMPLETE',data)
		if(data.result === "SUCCESS") this.completeList = data.dataMap && data.dataMap.ctcOrders && data.dataMap.ctcOrders.results || []
	}

	getOrderListCancel = async _ =>{
		let params = {offset:1,maxResults: 50,status: 'CANCEL',ctcOrderId:''}
		let data = await Fetch('GET_LIST_ORDERS',params,this)
		typeof data === 'string' && (data = JSON.parse(data))
		console.log('data========CANCEL',data)
		if(data.result === "SUCCESS") this.cancelList = data.dataMap && data.dataMap.ctcOrders && data.dataMap.ctcOrders.results || []
	}

	getOrderListProcessing = async _ =>{
		let params = {offset:1,maxResults: 50,status: 'PROCESSING',ctcOrderId:''}
		let data = await Fetch('GET_LIST_ORDERS',params,this)
		typeof data === 'string' && (data = JSON.parse(data))
		console.log('data========PROCESSING',data)
		if(data.result === "SUCCESS") this.processingList = data.dataMap && data.dataMap.ctcOrders && data.dataMap.ctcOrders.results || []
	}




	goDetail = (item,status) => this.$router.push('OtcOrderDetail', {item,status});






	listItem = ({item, index}) => {
		const {type,orderStatus,createdAt,amount,price,confirmStatus} = item
		return (
			<TouchableOpacity style={styles.itemWrap} onPress={()=>this.goDetail(item,statusExcute(ORDER_STATUS[orderStatus],confirmStatus))}>
				<View style={styles.line1}>
					<View style={styles.line1L}><Text style={type==="SELL_ORDER"?styles.text16BlackBold:styles.text16RedBold}>{type==="SELL_ORDER"&&'出售'||'购买'}</Text><Text style={styles.text16BlackBold}>USDT</Text></View>
					<View style={styles.line1R}><Text style={orderStatus==='PROCESSING'?styles.text14Red:styles.text14Gray}>{statusExcute(ORDER_STATUS[orderStatus],confirmStatus)}</Text><Image style={styles.arrowImg} source={require('../assets/right_arrow.png')}/></View>
				</View>
				<View style={styles.line2}>
					<View style={styles.line2View1}><Text style={styles.text12Gray}>时间</Text></View>
					<View style={styles.line2View2}><Text style={styles.text12Gray}>数量(USDT)</Text></View>
					<View style={styles.line2View3}><Text style={styles.text12Gray}>总交易额(CNY)</Text></View>
				</View>
				<View style={styles.line2}>
					<View style={styles.line2View1}><Text style={styles.text14Gray}>{this.$globalFunc.formatDateUitl(createdAt,'hh:mm MM/DD')}</Text></View>
					<View style={styles.line2View2}><Text style={styles.text14Gray}>{this.$globalFunc.accFixed(amount,2)}</Text></View>
					<View style={styles.line2View3}><Text style={styles.text14Gray}>{this.$globalFunc.accFixed2(this.$globalFunc.accMul(price,amount),2)}</Text></View>
				</View>
				{/*<View style={styles.line4}><Text style={styles.text14Black}>惠儿宇宙无敌</Text></View>*/}
			</TouchableOpacity>
		)

	}



	render() {

		return (

			<View style={styles.container}>

				<OrderListHeader/>
				{this.hadInit && (this.excuteList.length ? <FlatList data={this.excuteList} renderItem={this.listItem}/> : <View
					style={styles.emptyWrap}><Image style={styles.arrayEmpty} source={require('../assets/empty.png')}/><Text style={styles.text12Gray}>暂无订单</Text></View>)}
				<ActivityIndicator animating={!this.hadInit} style={styles.loading}/>




			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:'#fff',
		position:'relative',
		alignItems:'center'
	},

	itemWrap:{
		paddingVertical:getHeight(26),
		paddingHorizontal:getWidth(30),
		borderStyle:'solid',
		borderBottomWidth:StyleSheet.hairlineWidth,
		borderBottomColor:'#e7ebee'

	},
	line1:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		marginBottom:getHeight(28)
	},
	line2:{
		flexDirection:'row',
		alignItems:'center',
		marginVertical:getHeight(6)
	},

	line2View1:{
		width:'39%'
	},
	line2View2:{
		width:'31%'
	},
	line2View3:{
		width:'30%',
		flexDirection: 'row-reverse'
	},
	line1L:{
		flexDirection:'row',
		alignItems:'center'
	},
	line1R:{
		flexDirection:'row',
		alignItems:'center'
	},
	line4:{
		flexDirection:'row',
		marginTop:getHeight(32)
	},






	text12Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#B5BCC6',
	},
	text14Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#8994A5',
	},
	text14Red:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#3576F5',
	},
	text14Black:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#1F3F59',
	},

	text16BlackBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#1F3F59',
		fontWeight:'600',
		fontFamily:'System'
	},
	text16RedBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#3576F5',
		fontWeight:'600',
		fontFamily:'System'
	},
	arrowImg:{
		width:getWidth(12),
		height:getWidth(20),
		marginLeft:getWidth(8)
	},

	loading:{
		position:"absolute",
		top:getHeight(500),
	}
	,arrayEmpty:{
		width:getWidth(184),
		height:getHeight(140),
		marginBottom:10
	},
	emptyWrap:{
		alignItems:'center',
		marginTop:getHeight(300)
	}
});

