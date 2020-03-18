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
	Platform, AsyncStorage, ImageBackground,KeyboardAvoidingView
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import Toast from 'react-native-root-toast'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal'

import OrderDetailheader from '../common/OrderDetailheader'
import GlobalFunc from "../../configs/globalFunctionConfigs/GlobalFunction";
import Fetch from '../common/FetchUtil'



@observer
export default class OtcOrderDetail extends RNComponent {

	@computed	get userId () {
		return this.$store.state.authMessage.userId;
	}


	@computed get authState(){
		return this.$store.state.authState;
	}
	@computed get verifyType(){
		return this.authState && this.authState.sms && 1 || 0
	}

	@observable price = 0
	@observable amount = 0


	@observable ctc_order = {}
	@observable user_info = {}
	@observable pay_info = []
	@observable bussness_info = []

	@observable name = ''
	@observable orderId = ''
	@observable time = ''



	@observable cardNumber = ''
	@observable bankName = ''
	@observable bankAddr = ''




	//$params
	componentDidMount() {
		super.componentDidMount();
		console.log('this.$params.statu====',this.orderId,this.$params.status,this.authState)





		this.getOrderDtail()
		this.getAuthentication();
	}

	getAuthentication = async _ =>{
		let data = await Fetch('GET_AUTH_STATE',{},this)
		typeof data === 'string' && (data = JSON.parse(data))
		console.log('datsa=========',this,data)

	}

	getOrderDtail = async _ =>{
		console.log('this.$params.item===',this.$params.item,this.$params.item.type)
		let params = {userId: this.userId,c2cOrderType: this.$params.item.type,ctcOrderId: this.$params.item.id}
		let data = await Fetch('CTC_ORDER_DETAIL',params,this)
		typeof data === 'string' && (data = JSON.parse(data))
		console.log('this.currentItem=========',data)

		if(data.errorCode === 0 && data.dataMap){
			  this.price = data.dataMap.ctcOrder && data.dataMap.ctcOrder.price;
			  this.amount  = data.dataMap.ctcOrder && data.dataMap.ctcOrder.amount;

			  this.orderId  = data.dataMap.ctcOrder && data.dataMap.ctcOrder.id;
			  this.time  = this.$globalFunc.formatDateUitl(data.dataMap.ctcOrder && data.dataMap.ctcOrder.createdAt,'YYYY-MM-DD hh:mm:ss') ;

			  this.user_info = data.dataMap.user;
			  this.ctc_order = data.dataMap.ctcOrder;



			  this.pay_info = data.dataMap.userPayInfoList || [];
			  this.bussness_info = data.dataMap.businessPayInfoList || [];


			console.log('=======++++++==this.user_info',this.user_info)
			console.log('=======++++++==this.pay_info',this.pay_info,)
			console.log('=======++++++==this.ctc_order',this.ctc_order)
			console.log('=======++++++==this.bussness_info',this.bussness_info)
			  // this.name  = data.dataMap.userPayInfoList[0] && data.dataMap.userPayInfoList[0].username;
			  // this.name  = data.dataMap.user && data.dataMap.user.name || data.dataMap.business[0] && data.dataMap.business.name;

			  // this.cardNumber = data.dataMap.userPayInfoList[0] && data.dataMap.userPayInfoList[0].cardNumber
			  // this.bankName = data.dataMap.userPayInfoList[0] && data.dataMap.userPayInfoList[0].bankName
			  // this.bankAddr = data.dataMap.userPayInfoList[0] && data.dataMap.userPayInfoList[0].bankAddr
		}
	}




	@observable isDrawer = false



	@observable verifyType = 0  //0谷歌 //1手机
	@observable textInput = ''



	@action openDrawer = v =>this.isDrawer = true;
	@action cloeseDrawer = v => !(this.isDrawer = false) && this.clearInput();
	@action changeTab = type => {
		this.verifyType = type;
		this.clearInput();
	}
	@action changeText = text => this.textInput = text;
	@action clearInput = text => this.textInput = '';





	//验证 谷歌验证码
	sendGaRequest = async ()=>{

		let params = this.verifyType ? {type:"mobile",code:this.textInput,purpose:"Confirm",ctcOrderId:this.orderId} : {type:'ga',code:this.textInput,purpose:'Confirm',ctcOrderId:this.orderId}

		let data = await Fetch('COMMEN_AUTH_FORCTC',params,this);
		typeof data === 'string' && (data = JSON.parse(data));
		console.log('data========data========',data);

		if( data.errorCode === 0 ){
			Toast.show('确认成功',{duration: 1200,position: Toast.positions.CENTER })
			this.cloeseDrawer()
			this.notify({key: 'REFRESH_CTC_ORDERLIST'})
			this.$router.goBack()
			return ;
		}

		if( data.errorCode ){
			Toast.show('请填写正确的验证码',{duration: 1200,position: Toast.positions.CENTER })
			return ;
		}



	}

	//用户确认已付款
	conFirmPayMoney = async ()=>{
		let data = await Fetch('COMFIRM_PAYMENT',{ctcOrderId:this.orderId},this)
		typeof data === 'string' && (data = JSON.parse(data));
		if(data.result === 'SUCCESS'){
			Toast.show('付款成功',{duration: 1200,position: Toast.positions.CENTER })

			this.notify({key: 'REFRESH_CTC_ORDERLIST'});
			this.$router.goBack();
			return
		}
		Toast.show('系统繁忙，请稍后重试',{duration: 1200,position: Toast.positions.CENTER })
	}

	cancelOrder = async ()=>{
		let data = await Fetch('CANCEL_CTC_ORDER',{confirmNOPay:0,ctcOrderId:this.orderId},this)
		typeof data === 'string' && (data = JSON.parse(data));
		console.log('string========',data)
		if (data && data.errorCode === 0){
			Toast.show('撤销成功',{duration: 1200,position: Toast.positions.CENTER })
			this.notify({key: 'REFRESH_CTC_ORDERLIST'})
			this.$router.goBack()
			return
		}
		if (data && data.errorCode === 2 || data.errorCode === 9){
			Toast.show('24小时内超过3笔取消订单将禁止2天C2C交易',{duration: 1200,position: Toast.positions.CENTER })
			return
		}
		Toast.show('撤销出现异常',{duration: 1200,position: Toast.positions.CENTER })
	}
	confirmReceiveMoney = ()=>{
		this.openDrawer();

	}



	@observable sended = false
	@observable timer = 60


	//发送手机验证码
	sendVerifyRequest = async ()=>{
		let data = await Fetch('ORDER_MAIL_CODE',{type:'mobile',"mun":"","purpose":"Confirm"},this);
		console.log('sendVerifyRequest=====',data)

		data && (data = JSON.parse(data))

		if (data.errorCode === 0){
			this.interval && clearInterval(this.interval)

			this.sended = true;

			this.interval = setInterval(v=>{
				if(this.timer>0){
					this.timer --
				}
				if(this.timer<=0){
					clearInterval(this.interval)
					this.sended = false;
					this.timer  = 60
				}

			},1000)
			return
		}

		if(data.errorCode === 1){
			Toast.show('用户未登录', {duration: 1000,	position: Toast.positions.CENTER})
			return
		}
		if(data.errorCode === 2){
			Toast.show('过于频繁', {duration: 1000,	position: Toast.positions.CENTER})
			return
		}
		if(data.errorCode === 3){
			Toast.show('手机验证码发送异常', {duration: 1000,	position: Toast.positions.CENTER})
			return
		}
		if(data.errorCode === 4){
			Toast.show('过于频繁', {duration: 1000,	position: Toast.positions.CENTER})
			return
		}
		if(data.errorCode === 100){
			Toast.show('过于频繁被锁定', {duration: 1000,	position: Toast.positions.CENTER})
			return
		}







		//
		// data.errorCode === 1 && (this.verificationCodeWA = '用户未登录')
		// data.errorCode === 2 && (this.verificationCodeWA = '过于频繁')
		// data.errorCode === 3 && (this.verificationCodeWA = '手机验证码发送异常')
		// data.errorCode === 4 && (this.verificationCodeWA = '过于频繁')
		// data.errorCode === 100 && (this.verificationCodeWA = '过于频繁被锁定')









	}





	render() {

		return (

			<ScrollView style={styles.container}>
				<OrderDetailheader status={this.$params.status} item={this.$params.item}/>
				<View style={styles.mainBox}>

					<View style={styles.totalWrap}><Text style={styles.text26RedBold}>¥ {this.$globalFunc.accFixed(this.$globalFunc.accMul(this.price,this.amount),2)}</Text></View>
					<View style={styles.priceAmountWrap}>
						<View style={styles.priceAmounLeft}>
							<View style={styles.priceLine}><Text style={[styles.text13Gray,{marginRight: getWidth(50)}]}>单价</Text><Text style={styles.text13Black}>{this.$globalFunc.accFixed(this.price,2)}</Text></View>
							<View style={styles.priceLine}><Text style={[styles.text13Gray,{marginRight: getWidth(50)}]}>数量</Text><Text style={styles.text13Black}>{this.$globalFunc.accFixed(this.amount,2)}</Text></View>
						</View>
						<View style={styles.priceAmounRight}>
							<Image source={require('../assets/usdt_logo.png')} style={styles.usdtLogo}/>
							<Text style={styles.text11Black}>USDT</Text>
						</View>

					</View>
				</View>
				<View style={styles.graySpaceView}/>

				{(this.$params.status === "等待买方付款" && this.$params.item.type === 'BUY_ORDER') ?
				<View style={styles.mainBox2}>
					<View style={styles.box2Item}>
						<View style={styles.bankcardImgWrap}><Image source={require('../assets/bank_card.png')} style={styles.bankcardImg}/><Text style={styles.text15BlackBold}>银行卡</Text></View>
					</View>
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>收款人 {this.pay_info.length}</Text>
						<Text style={styles.text14Black}>{(this.pay_info.length && this.pay_info[0].username || this.bussness_info.length && this.bussness_info[0].username)}</Text>
					</View>
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>银行卡号</Text>
						<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].cardNumber || this.bussness_info.length && this.bussness_info[0].cardNumber}</Text>
					</View>
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>开户银行</Text>
						<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].bankName || this.bussness_info.length && this.bussness_info[0].bankName}</Text>
					</View>
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>开户支行</Text>
						<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].bankAddr || this.bussness_info.length && this.bussness_info[0].bankAddr}</Text>
					</View>
				</View>:null}

				{(this.$params.status === "买方已确认付款" && this.$params.item.type === 'SELL_ORDER') ?
					<View style={styles.mainBox2}>
						<View style={styles.box2Item}>
							<View style={styles.bankcardImgWrap}><Image source={require('../assets/bank_card.png')} style={styles.bankcardImg}/><Text style={styles.text15BlackBold}>银行卡</Text></View>
						</View>
						<View style={styles.box2Item}>
							<Text style={styles.text14Gray}>收款人</Text>
							<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].username || this.bussness_info.length && this.bussness_info[0].username}</Text>
						</View>
						<View style={styles.box2Item}>
							<Text style={styles.text14Gray}>银行卡号</Text>
							<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].cardNumber || this.bussness_info.length && this.bussness_info[0].cardNumber}</Text>
						</View>
						<View style={styles.box2Item}>
							<Text style={styles.text14Gray}>开户银行</Text>
							<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].bankName || this.bussness_info.length && this.bussness_info[0].bankName}</Text>
						</View>
						<View style={styles.box2Item}>
							<Text style={styles.text14Gray}>开户支行</Text>
							<Text style={styles.text14Black}>{this.pay_info.length && this.pay_info[0].bankAddr || this.bussness_info.length && this.bussness_info[0].bankAddr}</Text>
						</View>
					</View>:null}


				<View style={styles.graySpaceView}/>




				<View style={styles.mainBox2}>
					{/*<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>卖家昵称</Text>
						<Text style={styles.text14Black}></Text>
					</View>*/}
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>{this.$params.item.type==='BUY_ORDER'?'卖家姓名':'买家姓名'}</Text>
						<Text style={styles.text14Black}>{this.user_info.name}</Text>
					</View>
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>订单号</Text>
						<Text style={styles.text14Black}>#{this.ctc_order.orderId}</Text>
					</View>
					<View style={styles.box2Item}>
						<Text style={styles.text14Gray}>下单时间</Text>
						<Text style={styles.text14Black}>{this.$globalFunc.formatDateUitl(this.ctc_order.createdAt||0,'YYYY-MM-DD hh:mm:ss')}</Text>
					</View>
				</View>


				{(this.$params.status === "等待买方付款" && this.$params.item.type === 'BUY_ORDER') ? <View style={styles.redViewWrap}>
					<View style={styles.redView}>
						<Text style={styles.text11Red}>交易提醒：请及时付款并点击“确认付款”，未付款点击“确认付款”，经核实，将会暂时封锁账号。在转账过程中请勿备注BTC、USDT等信息，防止汇款被拦截、银行卡被冻结等问题</Text>
					</View>
				</View> : null}

				{(this.$params.status === "等待买方付款" && this.$params.item.type === 'BUY_ORDER') ? <View style={styles.btnWrap}>
					<TouchableOpacity style={styles.btnCancel} onPress={this.cancelOrder}><Text style={styles.text14BlackBold}>取消订单</Text></TouchableOpacity>
					<TouchableOpacity style={styles.btnConfirm} onPress={this.conFirmPayMoney}><Text style={styles.text14WhiteBold}>我已付款成功</Text></TouchableOpacity>

				</View> : null}


				{(this.$params.status === "买方已确认付款" && this.$params.item.type === 'SELL_ORDER') ? <View style={styles.btnWrap}>
					<TouchableOpacity style={styles.btnConfirm2} onPress={this.confirmReceiveMoney}><Text style={styles.text14WhiteBold}>确认已收款</Text></TouchableOpacity>

				</View> : null}



				<Modal isVisible={this.isDrawer} useNativeDriver={true} onBackdropPress={this.cloeseDrawer} style={{margin:0,justifyContent:'flex-end',alignItems:'center'}}>
					<KeyboardAvoidingView style={styles.verifyContainer} behavior="padding" enabled>
						{(this.authState.sms||this.authState.ga) ? <View style={styles.verifyLine1}>
							{this.authState.ga?<TouchableOpacity style={styles.verifyLine1TextWrap} onPress={()=>this.changeTab(0)} hitSlop={{top:10,left:10,bottom:10,right: 10}}><Text style={this.verifyType?styles.text16Gray:styles.text18BlackBold}>谷歌验证</Text></TouchableOpacity>:null}
							{this.authState.sms?<TouchableOpacity style={styles.verifyLine1TextWrap} onPress={()=>this.changeTab(1)} hitSlop={{top:10,left:10,bottom:10,right: 10}}><Text style={this.verifyType?styles.text18BlackBold:styles.text16Gray}>手机验证</Text></TouchableOpacity>:null}
						</View> : null}
						<View style={styles.verifyLine2}><Text style={styles.text14Black}>{this.verifyType?'手机验证':'谷歌验证'}</Text></View>
						<View style={styles.verifyLine3}>
							<TextInput style={styles.ipt} placeholder={'请输入验证码'} maxLength={6} placeholderTextColor={'#b5bcc6'} underlineColorAndroid={'transparent'} onChangeText={this.changeText} value={this.textInput} keyboardType={'numeric'}/>
							{this.verifyType?<View style={styles.mobbileCode}>{!this.sended?<Text style={styles.text14Red} onPress={this.sendVerifyRequest}>发送验证码</Text>: <Text style={styles.text14Red}>{this.timer}</Text>}</View>:null}
						</View>
						<TouchableOpacity style={styles.verifyLine4} onPress={this.sendGaRequest}><Text style={styles.text16WhiteBold}>确认</Text></TouchableOpacity>
					</KeyboardAvoidingView>
				</Modal>

			</ScrollView>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:'#fff'
	},

	mainBox: {
		// flex: 1,
		backgroundColor: '#fff',
		marginTop: -getHeight(28),
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		// overflow: 'hidden'
		paddingHorizontal:getWidth(30),
		paddingVertical:getHeight(30)
	},
	titleWrap:{
		flexDirection:'row',
		alignItems:'center'
	},

	usdtLogo:{
		width:getWidth(52),
		height:getWidth(52),
		marginBottom: getHeight(6)
	},

	totalWrap:{
		marginBottom:getHeight(24)
	},
	priceAmountWrap:{
		flexDirection: 'row',
		justifyContent:'space-between',
		alignItems: 'center'
	},
	priceAmounLeft:{},
	priceAmounRight:{
		alignItems:'center',
		justifyContent: 'center'
	},
	priceLine:{
		flexDirection:'row',
		marginVertical:getHeight(6)
	},

	graySpaceView:{
		backgroundColor:'#e7ebee',
		height:getHeight(20)
	},


	mainBox2:{
		paddingLeft:getWidth(30)
	},
	box2Item:{
		height:getHeight(88),
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingRight:getWidth(30),
		borderStyle:'solid',
		borderBottomWidth:StyleSheet.hairlineWidth,
		borderBottomColor:'#e7ebee'
	},


	text11Red:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 11,
		color: '#3576F5',
	},

	text14BlackBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#172a4d',
		fontWeight:'600',
		fontFamily:'System'
	},

	text16WhiteBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#fff',
		fontWeight:'600',
		fontFamily:'System'
	},
	text18BlackBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 18,
		color: '#172a4d',
		fontWeight:'600',
		fontFamily:'System'
	},
	text14WhiteBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#fff',
		fontWeight:'600',
		fontFamily:'System'
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
	text16Gray:{
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

	text26RedBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 26,
		color: '#3576F5',
		fontWeight:'600',
		fontFamily:'System'
	},
	text13Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 13,
		color: '#8994A5',
	},
	text13Black:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 13,
		color: '#172A4D',
	},
	text11Black:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 11,
		color: '#172A4D',
	},


	bankcardImgWrap:{
		flexDirection:'row',
		alignItems:'center'
	},

	bankcardImg:{
		width:getWidth(26),
		height:getWidth(26),
		marginRight:getWidth(12)
	},


	text15Black:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#172a4d',
	},
	redViewWrap:{
		paddingHorizontal:getWidth(30),
		marginTop:getHeight(52)
	},
	redView:{
		paddingHorizontal: getWidth(20),
		paddingVertical: getHeight(20),
		borderStyle: 'solid',
		borderColor:'#3576F550',
		borderWidth:StyleSheet.hairlineWidth,
		backgroundColor:'#3576F506',
		borderRadius:3
	},

	btnWrap:{
		paddingHorizontal:getWidth(30),
		marginTop:getHeight(20),
		height:getHeight(128),
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center'
	},

	btnCancel:{
		width:getWidth(316),
		height:getHeight(80),
		borderRadius:2,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#f7f7fa'
	},
	btnConfirm:{
		width:getWidth(316),
		height:getHeight(80),
		borderRadius:2,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor: '#3576F5',
	},
	btnConfirm2:{
		width:'100%',
		height:getHeight(80),
		borderRadius:2,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor: '#3576F5',
	},





	verifyContainer:{
		width:'100%',
		paddingHorizontal:getWidth(30),
		backgroundColor:'#fff',

	},
	verifyLine1:{
		flexDirection:'row',
		height:getHeight(120),
		alignItems:'center',
		borderStyle:'solid',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#c5cfd5'
	},
	verifyLine1TextWrap:{
		marginHorizontal:getWidth(25)
	},
	verifyLine2:{
		marginTop: getHeight(60)
	},
	verifyLine3:{},
	verifyLine4:{
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#3576F5',
		height:getHeight(88),
		marginBottom:getHeight(30),
		borderRadius:3
	},


	ipt:{
		width:'100%',
		height:getHeight(84),
		borderStyle:'solid',
		borderBottomWidth:StyleSheet.hairlineWidth,
		borderBottomColor:'#c5cfd5',
		fontSize:18,
		marginTop:getHeight(22),
	},
	mobbileCode:{
		position:'absolute',
		right:0
	}



});


