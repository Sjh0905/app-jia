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
	Platform, AsyncStorage, ImageBackground, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import Toast from 'react-native-root-toast'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal'

import OtcHeader from '../common/OtcHeader'
import CoinListTab from '../common/CoinListTab'
import CoinInput from '../common/CoinInput'
import CoinListTabDrag from '../common/CoinListTabDrag'
import GlobalFunc from "../../configs/globalFunctionConfigs/GlobalFunction";
import Fetch from '../common/FetchUtil'

const Sleep = ms => new Promise(res=>setTimeout(res,ms))






@observer
export default class OtcIndex extends RNComponent {



	componentDidMount() {
		super.componentDidMount();
		this.begin()
	}
	async begin(){
		this.getOrderList(0);
		this.getOrderList(1);
		await Sleep(700)
		this.isDrawer = true
		this.riskWindow = true
	}


	@observable    hadInit = false


	@observable    theme = 0   //0快捷 1自选
	@observable    type = 0    //0买 1卖
	@observable    orderType = 0   //0按金额购买 1按数量购买
	@observable    inputText = ''  //快捷买卖input
	@observable    traditionInputText = ''  //自选买卖input


	@observable    traditionOrderType = 0 //0按金额购买 1按数量购买
	@observable    timer = 30 //自选交易 下单倒计时

	@observable    isDrawer = false
	@observable    quickTrade = false
	@observable    traditionTrade = false
	@observable    riskWindow = false

	@observable    currentItem = {} //自选列表item

	drawerId = ''
	@observable    drawerPrice = 0
	@observable    drawerAmount = 0


	@observable     buyList = []
	@observable     sellList = []


	@observable    riskViewed = true



	getTheme = v => this.theme = v;
	getType = v => this.type = v;
	getOrderType = v => this.orderType = v;

	getInputText = v =>this.inputText = v;
	clearText = _ => this.inputText = '';

	clearCoinInput = _ => this.coinInput.clearText()


	onBackdropPress = _ => this.closeDrawer();

	closeDrawer = _ => !(this.isDrawer = false) && !(this.quickTrade = false) && !(this.traditionTrade = false) && !(this.riskWindow = false)
		&& !this.clearTraditionInput()&& !this.stopCountDown() && (this.interval=null);


	clickTrade = async _ =>{

		if(isNaN(this.inputText) || this.inputText==='' ){
			Toast.show('请填入正确的数字', {duration: 1000,	position: Toast.positions.CENTER});
			return;
		}

        //快捷一键卖币
        if(this.theme == 0 && this.type == 1){
            this.clickTradeSell();
            return;
        }

		// if(this.orderType && (this.inputText<10 || this.inputText > 20000)){
		// 	Toast.show('USDT数量限额在10~20000之间', {duration: 1000,	position: Toast.positions.CENTER});
		// 	return;
		// }

		if(!this.orderType && (this.inputText<100)){
			Toast.show('USDT购买金额100元起', {duration: 1000,	position: Toast.positions.CENTER});
			return;
		}


		let params = {
			type:this.orderType?'amount':'price',
			paras:this.inputText
		}


		let data = await Fetch('POST_DASH_BUTTON',params,this);

		typeof data === 'string' && (data = JSON.parse(data));

		console.log('data============5555555',data)

		if(data.status === "PART"){
			Toast.show('暂无匹配订单', {duration: 1000, position: Toast.positions.CENTER})
			return ;
		}

		if(data.orderId){
			this.drawerId = data.orderId && data.orderId.id;
			this.drawerPrice = data.orderId && data.orderId.price;
			this.orderType && (this.drawerAmount = this.inputText) || (this.drawerAmount = this.$globalFunc.accFixed(this.$globalFunc.accDiv(this.inputText,this.drawerPrice),2));

			if(this.drawerAmount > data.orderId.maxLimit){
				Toast.show('购买数量超出最大交易额', {duration: 1000, position: Toast.positions.CENTER})
				return
			}
			if(this.drawerAmount < data.orderId.minLimit){
				Toast.show('不足最小交易额', {duration: 1000, position: Toast.positions.CENTER})
				return
			}
			if(this.drawerAmount > data.orderId.amount){
				Toast.show('下单数量超过可购买数量', {duration: 1000, position: Toast.positions.CENTER})
				return
			}

			(this.isDrawer = true) && (this.quickTrade = true);

			return
		}

	}

	//一键卖币
    clickTradeSell = async _ =>{

        let params = {
            type:this.orderType?'amount':'price',
            paras:this.inputText
        }

		let data = await Fetch('POST_DASH_BUTTON_SELL',params,this);

		typeof data === 'string' && (data = JSON.parse(data));

		console.log('data============clickTradeSell',data)

		if(data.status === "PART"){
			Toast.show('暂无匹配订单', {duration: 1000, position: Toast.positions.CENTER})
			return ;
		}

		if(data.orderId){
			this.drawerId = data.orderId && data.orderId.id;
			this.drawerPrice = data.orderId && data.orderId.price;
			this.orderType && (this.drawerAmount = this.inputText) || (this.drawerAmount = this.$globalFunc.accFixed(this.$globalFunc.accDiv(this.inputText,this.drawerPrice),2));

			if(this.drawerAmount > data.orderId.maxLimit){
				Toast.show('出售数量超出最大交易额', {duration: 1000, position: Toast.positions.CENTER})
				return
			}
			if(this.drawerAmount < data.orderId.minLimit){
				Toast.show('不足最小交易额', {duration: 1000, position: Toast.positions.CENTER})
				return
			}
			if(this.drawerAmount > data.orderId.amount){
				Toast.show('下单数量超过可出售数量', {duration: 1000, position: Toast.positions.CENTER})
				return
			}

			(this.isDrawer = true) && (this.quickTrade = true);

			return
		}

	}

	confirmTrade = async _ =>{
		await this.getAccess()
		await this.placeAnOrder(this.drawerId,this.drawerAmount)

		this.clearCoinInput()
		this.closeDrawer()

	}





	getAccess  = async _ => {
		let data = await Fetch('VALIDATE_USER_CAN_TRADE', {}, this);

		typeof data === 'string' && (data = JSON.parse(data))
		if (data.errorCode && data.errorCode === 1) {
			Toast.show('未登录', {duration: 1000, position: Toast.positions.CENTER});
			return;
		}
		if (data.errorCode && data.errorCode === 8) {
			Toast.show('有一个订单未完成，暂停继续下单，完成后恢复', {duration: 1000, position: Toast.positions.CENTER});
			return;
		}
		if (data.errorCode && data.errorCode === 9) {
			Toast.show('24H内超过3笔取消订单', {duration: 1000, position: Toast.positions.CENTER});
			return;
		}
	}


	//amount: "10"
	// orderId: 379

	placeAnOrder = async (orderId,amount) =>{

		let data = await Fetch('PLACE_AN_ORDER', {orderId,amount},this);

		typeof data === 'string' && (data = JSON.parse(data))

		console.log('data========datadata',data)


		// todo://

		this.closeDrawer()

		if(data.result === "SUCCESS"){
			Toast.show('下单成功', {duration: 3000,	position: Toast.positions.CENTER})
			this.getOrderList(0);
			this.getOrderList(1);
			return ;
		}

		if(data.result === 'FAIL' ){
			data.errorCode === 1 && Toast.show('window.location.reload', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 2 && Toast.show('24H内超过3笔取消订单将禁止1天C2C交易', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 3 && Toast.show('无此订单', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 4 && Toast.show('不在限额内', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 5 && Toast.show('账户余额不足', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 6 && Toast.show('购买数量超过上限', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 8 && Toast.show('有一个订单未完成，暂停继续下单，完成后恢复', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 9 && Toast.show('24H内超过3笔取消订单将禁止1天C2C交易', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 10 && Toast.show('您不能购买自己的挂单', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 15 && Toast.show('您没有绑定手机或者谷歌', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 12 && Toast.show('您没有实名认证', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 13 && Toast.show('您没有绑定银行卡', {duration: 1000,	position: Toast.positions.CENTER});
			data.errorCode === 110 && Toast.show('用户被禁用', {duration: 1000,	position: Toast.positions.CENTER});

			data.errorCode === 7 && Toast.show('没有匹配挂单', {duration: 1000,	position: Toast.positions.CENTER});
			return ;
		}




	}




	getOrderList = async v =>{
		//0买 1卖
		this.hadInit = false ;

		let params =  {	offset: 0,maxResults: 50,status: v ? 'SELL_ORDER' : 'BUY_ORDER',currency: 'USDT'}
		let data = await Fetch('GET_LIST_OF_LISTS',params,this,'get')

		typeof data === 'string' && (data = JSON.parse(data))

		console.log('data============23',data)

		if(data.errorCode === 0) !v && (this.buyList = data.dataMap.orders) || (this.sellList = data.dataMap.orders)

		this.hadInit = true;


	}

	goOtcOrderListPage = _ => this.$router.push('OtcOrderList')


	//======= 自选区 方法 ↓↓↓↓

	clickTraditionTrade = async item =>{
		this.currentItem = item;
		// console.log('this.currentItem=========',item)
		// let data = await Fetch('GET_DASH_BUTTON',{payId:item.payId.split(',')[0]},this,'get')
		(this.isDrawer = true) && (this.traditionTrade = true)

		this.startCountDown()
	}


	changeTraditionOrderType = type => !this.clearTraditionInput() &&  (this.traditionOrderType = type);



	startCountDown = ()=> this.interval = setInterval(_=>this.timer>0 && this.timer-- || this.closeDrawer() ,1000)



	stopCountDown = ()=>{
		clearInterval(this.interval);
		this.timer= 30
	}

	changeTraditionText = v => this.traditionInputText = v;


	excuteTraditionAmount = ()=>{
		if(!this.traditionOrderType){
			return this.$globalFunc.accFixed2(this.$globalFunc.accDiv(this.traditionInputText || 0,this.currentItem.price),2)
		}
		if(this.traditionOrderType){
			return this.traditionInputText || 0
		}
		// if(!this.traditionOrderType && this.type){
		// 	return this.$globalFunc.accFixed2(this.$globalFunc.accDiv(this.traditionInputText || 0,this.currentItem.price),2)
		// }
		// if(this.traditionOrderType && this.type){
		// 	return this.traditionInputText || 0
		// }
	}

	excuteTraditionTotal = ()=>{
		if(!this.traditionOrderType){
			return this.traditionInputText || 0
		}
		if(this.traditionOrderType){
			return this.$globalFunc.accFixed2(this.$globalFunc.accMul(this.traditionInputText || 0,this.currentItem.price),2)
		}
		// if(!this.traditionOrderType && this.type){
		// 	return this.traditionInputText || 0
		// }
		// if(this.traditionOrderType && this.type){
		// 	return this.$globalFunc.accFixed2(this.$globalFunc.accDiv(this.traditionInputText || 0,this.currentItem.price),2)
		// }
	}

	clearTraditionInput = ()=> this.traditionInputText = '';





	traditionconfirmTrade = async v =>{

		await this.getAccess()
		this.placeAnOrder(this.currentItem.id,this.excuteTraditionAmount())

	}

	clickRisk = () => this.riskViewed = !this.riskViewed

	clickLeave = ()=>{
		this.closeDrawer();
		this.$router.goBack();
	}

	clickGoOn = v => this.riskViewed &&this.closeDrawer()





	renderTheme0 = observer((props) => {
		return (
			<View style={styles.mainBox}>
				<CoinListTab/>
				<CoinInput ref ={v=>this.coinInput = v} type={this.type} theme={this.theme}
				           clickTrade={this.clickTrade} getOrderType={this.getOrderType}
				           getInputText={this.getInputText} clearText={this.clearText}
				/>
			</View>
		)
	})

	renderTheme1 = observer(() => {
		return (
			<View style={styles.mainBox}>
				<CoinListTabDrag/>


				{this.hadInit && ((this.type ?this.buyList.length:this.sellList.length)? <FlatList data={this.type ?this.buyList:this.sellList} renderItem={this.listItem}/>:<View
					style={styles.emptyWrap}><Image style={styles.arrayEmpty} source={require('../assets/empty.png')}/><Text style={styles.text12Gray}>暂无挂单</Text></View>)}

				<ActivityIndicator animating={!this.hadInit} style={styles.loading}/>


			</View>
		)
	})

	listItem = ({item, index}) => {
		return (
			<View style={styles.itemWrap}>
				<View style={styles.boxLeft}>
					<View style={[styles.lineBase,styles.line1]}>
						<View style={styles.avator}>
							<Text style={styles.text11White}>{item.name.substring(0, 1)}</Text>
						</View>
						<Text style={styles.text14BlackBold}>{item.name}</Text>
					</View>
					<View style={[styles.lineBase,styles.line2]}>
						<Text style={styles.text12Gray}>数量 {item.amount} USDT</Text>
					</View>
					<View style={[styles.lineBase,styles.line3]}>
						<Text style={styles.text12Gray}>限额 {item.minLimit}USDT - {item.maxLimit}USDT</Text>
					</View>
					<View style={[styles.lineBase,styles.line4]}>
							<Image style={styles.bankImg} source={require('../assets/bank_card.png')}/>
					</View>

				</View>
				<View style={styles.boxRight}>
					<View style={[styles.lineBase,styles.line5]}>
						<Text style={styles.text12Gray}>{item.sum} | {GlobalFunc.accMul(item.rate.toFixed(2),100)}%</Text>
					</View>
					<View style={[styles.lineBase,styles.line6]}>
						<Text style={styles.text12Gray}>单价</Text>
					</View>
					<View style={[styles.lineBase,styles.line7]}>
						<Text style={styles.text18RedkBold}>¥ {item.price.toFixed(2)}</Text>
					</View>
					<View style={[styles.lineBase,styles.line8]}>
						<TouchableOpacity style={this.type ? styles.btnSellWrap:styles.btnBuyWrap} onPress={()=>this.clickTraditionTrade(item)}>
							<Text style={styles.text13WhiteBold}>{this.type ? '出售':'购买'}</Text>
						</TouchableOpacity>
					</View>
				</View>

			</View>
		)

	}

    //快捷购买
	quickModal = ()=>{
		return (
			<Animated.View style={styles.drawerWrap}>
				<View style={styles.drawerItem}>
					<TouchableOpacity onPress={this.closeDrawer} hitSlop={{top:10,left:10,bottom:10,right: 10}}>
						<Image source={require('../assets/back_arrow3.png')} style={styles.imgBack3}/>
					</TouchableOpacity>
					<Text style={styles.text15BlackBold}>{this.type ? '确认出售' : '确认购买'}</Text>
					<TouchableOpacity onPress={this.closeDrawer} hitSlop={{top:10,left:10,bottom:10,right: 10}}>
						<Text style={styles.text14Gray}>关闭</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.drawerItem}>
					<Text style={styles.text14Gray}>{this.type ? '收款方式' : '付款方式'}</Text>
					<Text style={styles.text14Black}>银行卡</Text>
				</View>
				<View style={styles.drawerItem}>
					<Text style={styles.text14Gray}>单价</Text>
					<Text style={styles.text14Black}>{this.drawerPrice}CNY/USDT</Text>
				</View>
				<View style={styles.drawerItem}>
					<Text style={styles.text14Gray}>数量</Text>
					<Text style={styles.text14Black}>{this.drawerAmount}USDT</Text>
				</View>
				<View style={styles.drawerItem}>
					<Text style={styles.text14Gray}>{this.type ? '实收款' : '实付款'}</Text>
					<Text style={styles.text18Red}>¥{this.orderType&&this.$globalFunc.accFixed2(this.$globalFunc.accMul(this.drawerPrice,this.drawerAmount),2)||this.inputText}</Text>
				</View>

				<View style={styles.drawerBtnWrap}>
					<TouchableOpacity style={styles.drawerBtn} onPress={this.confirmTrade}>
						<Text style={styles.text15White}>{this.type ? '确认出售' : '确认购买'}</Text>
					</TouchableOpacity>
				</View>




			</Animated.View>
		)
	}

    //自选区
	traditionModal = ()=>{
		return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios"?'padding':''} enabled>

			<Animated.View style={styles.drawerWrap}>
				<View style={styles.traditionTitleWrap}>
					<View >
						<View style={styles.marginVertical5}><Text style={styles.text18BlackBold}>{this.type ?'出售':'购买'}USDT</Text></View>
						<View style={styles.marginVertical5}><Text style={styles.text14Black}>单价<Text style={styles.text14Red}>￥{this.currentItem.price.toFixed(2)}</Text></Text></View>
					</View>
					<View><Image source={require('../assets/usdt_logo.png')} style={styles.usdtLogo2}/></View>


				</View>
				<View style={styles.traditionMainWrap}>
					<View style={styles.traditionTypetab}>
						<TouchableOpacity style={this.traditionOrderType?styles.borderBottomTransparent:styles.borderBottomRed} hitSlop={{top:10,left:10,bottom:10,right: 10}}
						                  onPress={()=>this.changeTraditionOrderType(0)}><Text style={this.traditionOrderType?styles.text14Gray:styles.text14Red}>按价格{this.type?'出售':'购买'}</Text></TouchableOpacity>
						<TouchableOpacity style={this.traditionOrderType?styles.borderBottomRed:styles.borderBottomTransparent} hitSlop={{top:10,left:10,bottom:10,right: 10}}
						                  onPress={()=>this.changeTraditionOrderType(1)}><Text style={this.traditionOrderType?styles.text14Red:styles.text14Gray}>按数量{this.type?'出售':'购买'}</Text></TouchableOpacity>
					</View>
					<View style={styles.traditionIptWrap}>
						<TextInput style={styles.traditionInput} placeholder={this.traditionOrderType?'请输入数量':'请输入金额'}
						           maxLength={16} placeholderTextColor={'#b5bcc6'} underlineColorAndroid={'transparent'}
						           onChangeText={this.changeTraditionText} value={this.traditionInputText} keyboardType={'numeric'}/>
			           <View style={styles.traditionPosition}>
				           <Text style={styles.text14Black}>{this.traditionOrderType?'USDT':'CNY'}</Text>
				           <View style={styles.traditionPositionSpace}/>
				           <Text style={styles.text14Red}>{''&&'全部出售'}</Text>
			           </View>
					</View>
					<View style={styles.traditionLimitWrap}><Text style={styles.text13Gray}>限额 ¥{this.currentItem.minLimit} - ¥{this.currentItem.maxLimit}</Text></View>
					<View style={styles.traditionLine1}><Text></Text><Text style={styles.text12Gray}>交易数量 {this.excuteTraditionAmount()}USDT</Text></View>
					<View style={styles.traditionLine2}><Text style={styles.text14GrayBold}>实收款</Text><Text style={styles.text20RedBold}>￥{this.excuteTraditionTotal()}</Text></View>
					<View style={styles.traditionBtnWrap}>
						<TouchableOpacity style={styles.traditionBtnTouch1}><Text style={styles.text14WhiteBold}>{this.timer}s后自动取消</Text></TouchableOpacity>
						<TouchableOpacity style={styles.traditionBtnTouch2} onPress={this.traditionconfirmTrade}><Text style={styles.text14WhiteBold}>下单</Text></TouchableOpacity>
					</View>
				</View>


			</Animated.View>
	</KeyboardAvoidingView>

	)
	}

	riskWindowModal = ()=>{
		const active = require('../assets/selectActive.png')
		const base = require('../assets/selectDefault.png')
		return (
			<View style={styles.riskContainer}>
				<View style={styles.ristLine1}><Text style={styles.text20BlackBold}>提示</Text></View>
				<View>
					<Text style={styles.text16Black24}>1、法币交易是用户之间点对点交易，买方场外转账付款，卖方收款后确认发币；</Text>
					<Text style={styles.text16Black24}>2、成交后务必在15分钟内付款，转账后立即点击“我已付款”；</Text>
					<Text style={styles.text16Black24}>3、超过15分钟，如未点击“我已付款”，系统视为无效订单，会自动撤销订单；</Text>
					<Text style={styles.text16Black24}>4、订单撤销后，切勿再付款；如已付款，切勿撤销订单。如果操作有误，请第一时间提交申诉，上传付款证明；</Text>
					<Text style={styles.text16Black24}>5、法币交易存在风险，请充分了解交易规则，交易时保持电话畅通，关注邮件和短信提醒，谨防受骗！</Text>
				</View>
				<TouchableOpacity style={styles.ristLine2} onPress={this.clickRisk}>
					<Image source={this.riskViewed?active:base} style={styles.selectImg}/>
					<Text style={styles.text14Gray}>我已阅读和了解市场规则与风险</Text>
				</TouchableOpacity>
				<View style={styles.ristLine3}>
					<TouchableOpacity onPress={this.clickLeave} hitSlop={{top:10,left:10,bottom:10,right: 10}}><Text style={styles.text16BlackBold}>离开</Text></TouchableOpacity>
					<TouchableOpacity onPress={this.clickGoOn} hitSlop={{top:10,left:10,bottom:10,right: 10}} style={{marginLeft:getWidth(60)}}><Text style={styles.text16RedBold}>进入交易</Text></TouchableOpacity>
				</View>
			</View>
		)

	}




	render() {


		return (

			<View style={styles.container}>
				<OtcHeader getTheme={this.getTheme} getType={this.getType} clickOrder={this.goOtcOrderListPage}/>

				{this.theme ? <this.renderTheme1/> : <this.renderTheme0/>}




				<Modal isVisible={this.isDrawer} useNativeDriver={true} onBackdropPress={this.onBackdropPress} style={{margin:0,justifyContent:this.riskWindow?'center':'flex-end',alignItems:'center'}}>
					{this.quickTrade && this.quickModal()}
					{this.traditionTrade && this.traditionModal()}
					{this.riskWindow && this.riskWindowModal()}
				</Modal>

			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	mainBox: {
		flex: 1,
		backgroundColor: '#fff',
		marginTop: -getHeight(48),
		borderRadius: 10,
		overflow: 'hidden'
	},


	itemWrap: {
		flexDirection:'row',
		justifyContent:'space-between',
		paddingHorizontal: getWidth(30),
		paddingTop: getHeight(30),
		paddingBottom: getHeight(20),
		borderBottomColor: '#e7ebee',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderStyle: 'solid'
	},
	boxLeft:{

	},
	boxRight:{
		alignItems:'flex-end'
	},

	lineBase:{
		flexDirection: 'row',
		alignItems:'center'
	},
	line1:{
		marginBottom:getHeight(18)
	},
	line2:{
		marginBottom:getHeight(12)
	},
	line3:{
		marginBottom:getHeight(36)
	},
	line4:{},
	line5:{
		marginTop: getHeight(0),
		marginBottom:getHeight(20)
	},
	line6:{
		marginBottom:getHeight(10)

	},
	line7:{
		marginBottom:getHeight(16)
	},
	line8:{},



	avator: {
		width: getWidth(40),
		height: getWidth(40),
		backgroundColor: '#3576F5',
		marginRight: getWidth(10),
		justifyContent: 'center',
		alignItems:'center',
		borderRadius:getWidth(20)
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
	text16BlackBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#172a4d',
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
	text16Black24:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#172a4d',
		lineHeight:getHeight(40)
	},
	text11White:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 11,
		color: '#fff',
	},
	text16Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#6B7DA2',
	},
	text12Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#6B7DA2',
	},
	margin5H:{
		marginHorizontal:getWidth(6)
	},
	text18RedkBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 18,
		color: '#3576F5',
		fontWeight:'600',
		fontFamily:'System'
	},
	bankImg:{
		width:getWidth(26),
		height:getWidth(26)
	},
	text13WhiteBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 13,
		color: '#fff',
		fontWeight:'600',
		fontFamily:'System'
	},
	btnSellWrap:{
		width:getWidth(180),
		height:getHeight(56),
		backgroundColor:'#485f7c',
		borderRadius:getWidth(4),
		alignItems:'center',
		justifyContent:'center'
	},
	btnBuyWrap:{
		width:getWidth(180),
		height:getHeight(56),
		backgroundColor:'#3576F5',
		borderRadius:getWidth(4),
		alignItems:'center',
		justifyContent:'center'
	},
	drawerWrap:{

		// position:'absolute',
		// left:0,
		// right:0,
		// bottom:0,
		backgroundColor:'#fff',
		// overflow:'hidden',
		width:"100%",


		borderTopLeftRadius:getWidth(10),
		borderTopRightRadius:getWidth(10),
	},


	drawerItem:{
		paddingHorizontal:getWidth(30),
		height:getHeight(100),
		borderBottomColor: '#E7EBEE',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderStyle: 'solid',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center'
	},
	imgBack3:{
		width:getWidth(30),
		height:getHeight(28)
	},
	text14Gray: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#6B7DA2'
	},
	text14Black:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#172a4d',
	},
	text14Red:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#3576F5',
	},

	text15BlackBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#172a4d',
		fontWeight:'600',
		fontFamily:'System'
	},
	text18Red:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 18,
		color: '#3576F5',
	},

	drawerBtnWrap:{
		paddingHorizontal:getWidth(30),
		height:getHeight(160),
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#fff'
	},
	drawerBtn:{
		width:'100%',
		height:getHeight(88),
		backgroundColor:'#3576F5',
		borderRadius:getWidth(4),
		alignItems:'center',
		justifyContent:'center'
	},
	text15White:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#fff',
		fontWeight:'600',
		fontFamily:'System'
	},
	text13Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 13,
		color: '#6B7DA2',
	},






	//自选区 交易弹窗
	traditionTitleWrap:{
		backgroundColor:'#f7f7fb',
		height:getHeight(148),
		paddingHorizontal:getWidth(30),
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
	},
	usdtLogo2:{
		width:getWidth(52),
		height:getWidth(52)
	},




	text14GrayBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#6B7DA2',
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
	text20RedBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 20,
		color: '#3576F5',
		fontWeight:'600',
		fontFamily:'System'
	},
	text20BlackBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 20,
		color: '#172a4d',
		fontWeight:'600',
		fontFamily:'System'
	},
	marginVertical5:{
		marginVertical : getHeight(5)
	},
	traditionMainWrap:{
		backgroundColor:'#fff',
		paddingHorizontal:getWidth(30),
	},
	traditionTypetab:{
		width:getWidth(340),
		height:getHeight(76),

		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',

		borderStyle:'solid',
		borderBottomColor:'#f7f7fb',
		borderBottomWidth:getHeight(4),
	},
	borderBottomRed:{
		borderStyle:'solid',
		borderBottomColor:'#3576F5',
		borderBottomWidth:getHeight(4),
		height:getHeight(76),
		justifyContent:'center'


	},
	borderBottomTransparent:{
		borderStyle:'solid',
		borderBottomColor:'transparent',
		borderBottomWidth:getHeight(4),
		height:getHeight(76),
		justifyContent:'center'

	},
	traditionIptWrap:{
		marginTop:getHeight(39),
		position:'relative',
		flexDirection:'row',
		alignItems:'center'

	},
	traditionInput:{
		width:'100%',
		height:getHeight(84),
		borderStyle:'solid',
		borderWidth:StyleSheet.hairlineWidth,
		borderColor:'#c5cfd5',
		paddingHorizontal:getWidth(24)

	},
	traditionPosition:{
		flexDirection:'row',
		position:'absolute',
		right:getWidth(28)
	},
	traditionPositionSpace:{
		width:1,
		height:getHeight(32),
		marginHorizontal: getWidth(32),
		backgroundColor:'#c5cfd5'
	},


	traditionLimitWrap:{
		marginVertical: getHeight(12)
	},
	traditionLine1:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		marginTop:getHeight(16)
	},
	traditionLine2:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'baseline',
		marginTop:getHeight(6)

	},
	traditionBtnWrap:{
		marginVertical:getHeight(26),
		flexDirection:'row',
		justifyContent:'space-between'
	},
	traditionBtnTouch1:{
		width:getWidth(330),
		height:getHeight(80),
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#8b9baa',
		borderRadius:3
	},
	traditionBtnTouch2:{
		width:getWidth(330),
		height:getHeight(80),
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#3576F5',
		borderRadius:3
	},






	riskContainer:{
		width:getWidth(650),
		// height:getHeight(926),
		borderRadius:3,
		backgroundColor:'#fff',
		paddingHorizontal:getWidth(30),
		// marginBottom:getHeight(180)

	},
	ristLine1:{
		height:getHeight(100),
		flexDirection:'row',
		alignItems:'center'
	},
	ristLine2:{
		flexDirection:'row',
		alignItems:'center',
		marginTop:getHeight(24)
	},
	selectImg:{
		width:getWidth(30),
		height:getWidth(30),
		marginRight: getWidth(18)
	},
	ristLine3:{
		flexDirection:'row',
		justifyContent:'flex-end',
		marginTop:getHeight(40),
		marginBottom:getHeight(40)

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

