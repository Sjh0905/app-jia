import React from 'react';
import {StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ListView,FlatList} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from './baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import device from "../configs/device/device";



@observer
export default class HistoryOrderDetail extends RNComponent {


	@observable
	avargePrice = 0
	@observable
	orderDetail = []
	@observable
	totalFee = 0

	@observable
	replaced = false//是否抵扣
	@observable
	originalCurrency = ''//费率币种
	@observable
	replacedCurrency = ''//抵扣币种
	@observable
	originalFee = 0 //原来的手续费
	@observable
	refundedFee = 0 //退还金额
	@observable
	replacedFee = 0 //抵扣手续费

	@computed
	get filledPrice() {
		let filledPrice = 0
		this.orderDetail.forEach(v => {
			filledPrice += v.amount * v.price
		})
		return filledPrice
	}

	@computed
	get amount() {
		let amount = 0
		this.orderDetail.forEach(v => {
			amount += v.amount
		})
		return amount
	}

	componentDidMount() {
		this.getDetail()
		// this.getFeeDetail()
	}


	getFeeDetail = () => {
		this.$http.send('POST_FEE_DETAIL', {
			bind: this,
			params: {
				orderId: this.$params.order.id,
				// orderId: '2817743'
			},
			callBack: this.re_getFeeDetail,

		})
	}

	re_getFeeDetail = (data) => {
		typeof data === 'string' && (data = JSON.parse(data))
		if (!data) return
		console.log("获取费率详情！", data)
		// this.feeDetailReady = true
		// this.loading = !(this.orderDetailReady && this.feeDetailReady)
		if (data.errorCode) {
			return
		}
		this.replaced = true
		let fundObj = data.dataMap.extOrderFeeRefund
		this.originalCurrency = fundObj.originalFeeCurrency
		this.replacedCurrency = fundObj.replacedFeeCurrency
		this.originalFee = fundObj.originalFee
		this.refundedFee = fundObj.refundedFee
		this.replacedFee = fundObj.replacedFee

	}


	// 获取订单详情
	getDetail = () => {
		this.$http.send('GET_ORDERS_DETAIL', {
			bind: this,
			urlFragment: `/${this.$params.order.id}/matches`,
			// params: {
			// 	limit: 10,
			// },
			callBack: this.re_getDetail
		})
	}

	// 获取订单详情回调
	re_getDetail = (data) => {
		typeof data === 'string' && (data = JSON.parse(data))
		if (!data || !data.matches) return false
		console.log("order detail获取到数据！", data)

		this.orderDetail = data.matches
		let avargePrice = 0, price = 0, amount = 0


		this.orderDetail.forEach(v => {
			amount = this.$globalFunc.accAdd(amount, v.amount)
			price = this.$globalFunc.accAdd(price, this.$globalFunc.accMul(v.price, v.amount))
		})


		avargePrice = this.$globalFunc.accDiv(price, (amount === 0 ? 1 : amount))
		this.avargePrice = parseFloat(avargePrice)

		let fee = 0
		this.orderDetail.forEach(v => {
			fee += v.fee
		})
		this.totalFee = fee

	}


	goBack = () => {
		this.$router.goBack()
	}


	// 订单状态
	getStatus = function (order) {
		if (order.status === 'PARTIAL_CANCELLED') return '部分成交(' + (((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)) + '%)'
		// `撤单（成交 ${((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)}%）` //部分成功
		if (order.status === 'FULLY_CANCELLED') return '撤单'
		// if (order.status === 'FULLY_FILLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyFilled')
		if (order.status === 'FULLY_FILLED') return "完全成交 (100%)"
	}


	@action
	listRenderRow = ({item}) => {

		return (
			<View style={styles.listItem}><Text  allowFontScaling={false} style={[styles.size13, styles.color9FA7B8]}>{this.$globalFunc.formatDateUitl(item.createdAt,'MM-DD hh:mm:ss')}</Text><Text  allowFontScaling={false} style={[styles.size13, styles.color9FA7B8]}>{this.$globalFunc.accFixed(item.price,this.$params.order.quoteScale)} {this.$params.order.symbol.split('_')[1]}</Text><Text  allowFontScaling={false}
				style={[styles.size13, styles.color9FA7B8]}>{item.amount} {this.$params.order.symbol.split('_')[0]}</Text></View>
		)
	}


	listRenderRow2 = ({item}) => {

		return (
			<View style={styles.listItemWrap}>
				<View style={styles.listItem1}>
					<Text style={styles.listItemTxt1}>时间</Text>
					<Text style={styles.listItemTxt2}>{this.$globalFunc.formatDateUitl(item.createdAt,'MM-DD hh:mm:ss')}</Text>
				</View>
				<View style={styles.listItem2}>
					<Text style={styles.listItemTxt1}>成交价</Text>
					<Text style={styles.listItemTxt2}>{this.$globalFunc.accFixed(item.price,this.$params.order.quoteScale)} {this.$params.order.symbol.split('_')[1]}</Text>
				</View>
				<View style={styles.listItem3}>
					<Text style={styles.listItemTxt1}>成交量</Text>
					<Text style={styles.listItemTxt2}>{item.amount} {this.$params.order.symbol.split('_')[0]}</Text>
				</View>
			</View>
		)
	}


	render() {


		return (
			<View style={styles.container}>
				<NavHeader
					headerTitle={''}
					goBack={this.goBack}
				/>


				<View style={{paddingHorizontal:getWidth(30), flex:1}}>
					<View style={styles.titleWrap}><Text style={styles.titleTxt}>成交明细</Text></View>


					<View style={{flexDirection:'row',alignItems:'center'}}>
						<Text  allowFontScaling={false} style={{color:this.$params.order.type === 'BUY_LIMIT' && StyleConfigs.txtGreen || StyleConfigs.txtRed,
							fontSize:StyleConfigs.fontSize16}}>{this.$params.order.type === 'BUY_LIMIT' && '买入' || '卖出'}</Text>
						<Text style={{color:StyleConfigs.txt172A4D, fontSize:StyleConfigs.fontSize16, fontWeight:'600',fontFamily:'System',marginLeft:getWidth(10)}}>{this.$params.order.symbol.split('_')[0] + ' / ' + this.$params.order.symbol.split('_')[1]}</Text>
					</View>

					<View style={styles.tableWrap}>
						<View style={styles.tableItem1}>
							<Text style={styles.tableTxt1}>成交总额({this.$params.order.symbol.split('_')[1]})</Text>
							<Text style={styles.tableTxt2}>{this.$globalFunc.accFixed(this.filledPrice, 8)}</Text>
							<Text style={styles.tableTxt3}>单价({this.$params.order.symbol.split('_')[1]})</Text>
							<Text style={styles.tableTxt4}>{this.$globalFunc.accFixed(this.$params.order.price, this.$params.order.quoteScale)}</Text>
						</View>
						<View style={styles.tableItem2}>
							<Text style={styles.tableTxt1}>成交均价({this.$params.order.symbol.split('_')[1]})</Text>
							<Text style={styles.tableTxt2}>{(this.orderDetail.length === 0) && (this.$params.order.status !== 'FULLY_CANCELLED') && this.$globalFunc.accFixed(this.$params.order.price, this.$params.order.quoteScale) || this.$globalFunc.accFixed(this.avargePrice, this.$params.order.quoteScale)}</Text>
							<Text style={styles.tableTxt3}>手续费({this.$params.order.type !== 'BUY_LIMIT' ? this.$params.order.symbol.split('_')[1] : this.$params.order.symbol.split('_')[0]})</Text>
							<Text style={styles.tableTxt4}>{this.$globalFunc.accFixed(this.totalFee, 8)} </Text>
						</View>
						<View style={styles.tableItem3}>
							<Text style={styles.tableTxt1}>成交量({this.$params.order.symbol.split('_')[0]})</Text>
							<Text style={styles.tableTxt2}>{this.$globalFunc.accFixed(this.$params.order.filledAmount, 8)}</Text>
							<Text style={styles.tableTxt3}>实际到账({this.$params.order.type!=='BUY_LIMIT'?this.$params.order.symbol.split('_')[1]:this.$params.order.symbol.split('_')[0]})</Text>
							{/*<Text style={styles.tableTxt4}>0.8991841</Text>*/}


							{this.$params.order.type === 'BUY_LIMIT' &&
							<Text  allowFontScaling={false} style={styles.tableTxt4}>
								{this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.amount, this.$globalFunc.accMinus(this.totalFee, this.refundedFee)), 8)}
							</Text>
							||
							<Text  allowFontScaling={false} style={styles.tableTxt4}>
								{this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.filledPrice , this.$globalFunc.accMinus(this.totalFee , this.refundedFee)),8)}
							</Text>
							}












						</View>


					</View>

					<View style={{width:'120%', backgroundColor:'#f7f8fa', height:getHeight(20), position:'relative',left:-getWidth(30)}}/>




					<FlatList
						data={this.orderDetail || []}
						renderItem={this.listRenderRow2}
						keyExtractor={(item, index) => index.toString()}
					/>






				</View>

{/*
				<View style={{backgroundColor:StyleConfigs.bgColor,flex:1}}>

					<View style={styles.box1}>
						<View style={styles.box1line1}>
							<View
								style={this.$params.order.type === 'BUY_LIMIT' && styles.ballGreen || styles.ballRed}><Text  allowFontScaling={false}
								style={[styles.color100, styles.size12]}>{this.$params.order.type === 'BUY_LIMIT' && '买' || '卖'}</Text></View>
							<Text  allowFontScaling={false}
								style={[styles.color9FA7B8, styles.size15]}>{this.$params.order.symbol.split('_')[0] + ' / ' + this.$params.order.symbol.split('_')[1]}</Text>
						</View>
						<View style={{marginTop: 10}}>
							<Text  allowFontScaling={false} style={{color: '#C43E4E', fontSize: 12}}>{this.getStatus(this.$params.order)}</Text>
						</View>
					</View>

					<View style={styles.box2}>
						<View style={styles.box2line1}>
							<View><Text  allowFontScaling={false} style={[styles.size13, styles.colorC5CFD5]}>成交量 / 数量</Text></View>
							<View style={{flexDirection: 'row'}}><Text  allowFontScaling={false}
								style={[styles.size15, styles.color9FA7B8]}>{this.$globalFunc.accFixed(this.$params.order.filledAmount, 8)}</Text><Text  allowFontScaling={false}
								style={[styles.size14, styles.colorC5CFD5]}> / {this.$globalFunc.accFixed(this.$params.order.amount, 8)}</Text></View>
						</View>
						<View style={styles.box2line2}>
							<View><Text  allowFontScaling={false} style={[styles.size13, styles.colorC5CFD5]}>均价 / 单价</Text></View>
							<View style={{flexDirection: 'row'}}><Text  allowFontScaling={false}
								style={[styles.size15, styles.color9FA7B8]}>{(this.orderDetail.length === 0) && (this.$params.order.status !== 'FULLY_CANCELLED') && this.$globalFunc.accFixed(this.$params.order.price, this.$params.order.quoteScale) || this.$globalFunc.accFixed(this.avargePrice, this.$params.order.quoteScale)}</Text><Text  allowFontScaling={false}
								style={[styles.size14, styles.colorC5CFD5]}> / {this.$globalFunc.accFixed(this.$params.order.price, this.$params.order.quoteScale)}</Text></View>
						</View>

					</View>

					<View style={styles.box3}>
						<View style={styles.box3line}><Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size13]}>应收手续费</Text><Text  allowFontScaling={false}
							style={[styles.colorC5CFD5, styles.size15, {textDecorationLine: 'line-through'}]}>
							{this.$globalFunc.accFixed(this.$params.order.fee, 8)} {this.$params.order.type === 'BUY_LIMIT' ?
							this.$params.order.symbol.split('_')[0] : this.$params.order.symbol.split('_')[1]}
						</Text></View>

						{!this.replaced &&
						<View style={styles.box3line}><Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size13]}>手续费</Text><Text  allowFontScaling={false}
							style={[styles.color9FA7B8, styles.size15]}>
							{this.$globalFunc.accFixed(this.totalFee, 8)} {this.$params.order.type !== 'BUY_LIMIT' ? this.$params.order.symbol.split('_')[1] : this.$params.order.symbol.split('_')[0]}
						</Text></View>
						||
						<View style={styles.box3line}><Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size13]}>手续费</Text>
							{this.originalFee !== this.refundedFee &&
								<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size15]}>
									{this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.originalFee, this.refundedFee), 8)} {this.$params.order.type === 'BUY_LIMIT' ? this.$params.order.symbol.split('_')[0] : this.$params.order.symbol.split('_')[1]}
								</Text>
							}
							{this.replacedFee !== 0 &&
								<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size15]}>
									{this.$globalFunc.accFixed(this.replacedFee, 8)}{this.replacedCurrency}
								</Text>
							}
							{this.$params.order.status === 'FULLY_CANCELLED' &&
								<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size15]}>
									{this.$globalFunc.accFixed(0, 8)} {this.$params.order.type === 'BUY_LIMIT' ? this.$params.order.symbol.split('_')[0] : this.$params.order.symbol.split('_')[1]}
								</Text>
							}
						</View>
						}

						<View style={styles.box3line}><Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size13]}>成交金额</Text><Text  allowFontScaling={false}
							style={[styles.color9FA7B8, styles.size15]}>{this.$globalFunc.accFixed(this.filledPrice, 8)} {this.$params.order.symbol.split('_')[1]}</Text></View>
						<View style={styles.box3line}><Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size13]}>实际到账</Text>
							{this.$params.order.type === 'BUY_LIMIT' &&
								<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size15]}>
									{this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.amount, this.$globalFunc.accMinus(this.totalFee, this.refundedFee)), 8)}
									{this.$params.order.type!=='BUY_LIMIT'?this.$params.order.symbol.split('_')[1]:this.$params.order.symbol.split('_')[0]}
								</Text>
								||
								<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size15]}>
									{this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.filledPrice , this.$globalFunc.accMinus(this.totalFee , this.refundedFee)),8)}
									{this.$params.order.type!=='BUY_LIMIT'?this.$params.order.symbol.split('_')[1]:this.$params.order.symbol.split('_')[0]}
								</Text>
							}
						</View>
					</View>


					<View style={styles.box4}>
						<View style={{marginLeft: getWidth(20)}}><Text  allowFontScaling={false}
							style={[styles.color9FA7B8, styles.size13]}>成交详情</Text></View>
						<View style={styles.listTitle}>
							<Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size12]}>日期</Text>
							<Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size12]}>成交价格</Text>
							<Text  allowFontScaling={false} style={[styles.colorC5CFD5, styles.size12]}>成交数量</Text>
						</View>



					<View style={{height:getHeight(530)}}>

						<FlatList
							data={this.orderDetail || []}
							renderItem={this.listRenderRow}
							keyExtractor={(item, index) => index.toString()}
						/>

					</View>



					</View>
				</View>*/}

			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: StyleConfigs.navBgColor0602,
        paddingTop: getDeviceTop()
	},

	listView: {
		// height:getHeight(600),
		marginTop: getHeight(20),
		backgroundColor: StyleConfigs.bgColor
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
	color9FA7B8: {color: StyleConfigs.txt9FA7B8},
	// color80: {color: 'rgba(255,255,255,0.8)'},
	colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
	colorGreen: {color: '#02987D'},
	colorRed: {color: '#C73F4F'},
	bgGreen: {backgroundColor: '#02987D'},
	bgRed: {backgroundColor: '#C73F4F'},
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
		backgroundColor: '#02987D',
		borderRadius: 4,
		height: getHeight(72),
		alignItems: 'center',
		justifyContent: 'center'
	},
	dealBtnRed: {
		backgroundColor: '#C73F4F',
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


	},
	rowV1: {
		width: '39%',
	},
	rowV2: {
		width: '35%',

	},
	rowV3: {
		width: '26%',
		alignItems: 'flex-end'

	},
	rowV4: {
		width: '16%',
		alignItems: 'flex-end'

	},

	ballRed: {
		width: getWidth(32),
		height: getWidth(32),
		backgroundColor: '#C73F4F',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: getWidth(16),
		marginRight: 10
	},
	ballGreen: {
		width: getWidth(32),
		height: getWidth(32),
		backgroundColor: '#02987D',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: getWidth(16),
		marginRight: 10


	},
	chedan: {
		width: getWidth(72),
		height: getHeight(40),
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#C43E4E',
		borderStyle: 'solid',
		alignItems: 'center',
		justifyContent: 'center'
	},
	box1: {
		height: getHeight(139),
		justifyContent: 'center',
		alignItems: 'center',
	},
	box1line1: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	box1line2: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	box2: {
		height: getHeight(154),
		marginLeft: getWidth(20),
		marginRight: getWidth(20),
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: StyleConfigs.borderBottomColor,
	},
	box2line1: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	box2line2: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: getHeight(20)
	},
	box3: {
		height: getHeight(230),
		marginLeft: getWidth(20),
		marginRight: getWidth(20),
		marginTop: getHeight(32)
	},
	box3line: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: getWidth(20)
	},
	box4: {},
	listTitle: {
		height: getHeight(60),
		backgroundColor: StyleConfigs.sectTitleColor,
		paddingLeft: getWidth(20),
		paddingRight: getWidth(20),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: getHeight(28)

	},
	listItem: {
		paddingLeft: getWidth(20),
		paddingRight: getWidth(20),
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: getHeight(20)
	},




	titleWrap:{
		paddingVertical:getHeight(60),

	},
	titleTxt:{
		fontSize:StyleConfigs.fontSize28,
		color:StyleConfigs.txt172A4D,
		fontWeight:'600',
		fontFamily:'System'
	}
	,tableWrap:{
		flexDirection:'row',
		justifyContent:'space-between',
		marginTop:getHeight(38),
		width:'100%',
	},
	tableItem1:{
		width:'33%',
		alignItems:'flex-start'
	},
	tableItem2:{
		width:'36%',
		alignItems:'flex-start',
		paddingLeft:getWidth(30)
	},
	tableItem3:{
		width:'30%',
		alignItems:'flex-end'
	},
	tableTxt1:{
		fontSize:StyleConfigs.fontSize12,
		color:StyleConfigs.txtB5BCC6,
		marginBottom:getHeight(14)
	},
	tableTxt2:{
		fontSize:StyleConfigs.fontSize14,
		color:StyleConfigs.txt172A4D,
		marginBottom:getHeight(32)
	},
	tableTxt3:{
		fontSize:StyleConfigs.fontSize12,
		color:StyleConfigs.txtB5BCC6,
		marginBottom:getHeight(14)
	},
	tableTxt4:{
		fontSize:StyleConfigs.fontSize14,
		color:StyleConfigs.txt172A4D,
		marginBottom:getHeight(30)
	},










	listItemWrap:{
		borderStyle:'solid',
		borderBottomColor:'#e7ebee',
		borderBottomWidth:StyleSheet.hairlineWidth,
		paddingVertical: getHeight(40)


	},
	listItem1:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		marginBottom:getHeight(40)
	},
	listItem2:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		marginBottom:getHeight(40)

	},
	listItem3:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between'
	},

	listItemTxt1:{
		fontSize:StyleConfigs.fontSize14,
		color:StyleConfigs.txt8994A5
	},
	listItemTxt2:{
		fontSize:StyleConfigs.fontSize14,
		color:StyleConfigs.txt1F3F59
	},


});