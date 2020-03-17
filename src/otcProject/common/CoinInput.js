/**
 * Created by chest on 09/25/2019.
 */


/**
 * Created by chest on 09/25/2019.
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
	Platform, AsyncStorage, ImageBackground
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import Toast from 'react-native-root-toast'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal'


@observer
export default class CoinInput extends RNComponent {


	@observable orderType = 0 //0按金额购买 1按数量购买
	@observable focus = false

	@observable inputText = ''

	switchOrder =  v =>{
		this.orderType = +!this.orderType;
		this.props.getOrderType && this.props.getOrderType(this.orderType)
		this.clearText();
	}


	changeText = v => {
		this.inputText = v
		this.props.getInputText && this.props.getInputText(v)
	}

	clearText = v => this.changeText('')



	render() {

		let amountText = this.props.type ? '出售数量' : '购买数量';
		let moneyText = this.props.type ? '出售金额' : '购买金额';

		return (
			<View style={styles.container}>
				<View style={this.focus ?styles.mariWrapFocus :styles.mainWrap}>
					<Text style={styles.text12BlackBold}>{this.orderType && amountText || moneyText}</Text>
					<View style={styles.inputWrap}>
						{this.orderType?null:<Text style={styles.text23BlackBold}>￥</Text>}

						<TextInput style={styles.input}
							placeholder={this.orderType?'请输入数量':'100元起'}
							maxLength={16}
							secureTextEntry={false}
							style={styles.input}
							placeholderTextColor={'#b5bcc6'}
							underlineColorAndroid={'transparent'}
							onChangeText={this.changeText}
							value = {this.inputText}
         			        keyboardType={'numeric'}
						/>
						{/*{*/}
							{/*this.orderType ?*/}
								{/*(this.props.type ? <TouchableOpacity style={styles.positonButton}>*/}
									{/*<Text style={styles.text12Red}>最大</Text>*/}
								{/*</TouchableOpacity> : <View style={styles.positonView}>*/}
									{/*<Text style={styles.text18BlackBold}>USDT</Text>*/}
								{/*</View>)*/}

								{/*:*/}
							{/*null*/}
						{/*}*/}
						{
							this.orderType ?
								(<View style={styles.positonView}>
									<Text style={styles.text18BlackBold}>USDT</Text>
								</View>)
								:
							null
						}

					</View>
				</View>

				<View style={styles.tipWrap}>
					{/*<Text style={styles.text11Gray}>单价约 72,412.10 CNY/USDT</Text>*/}
					<Text> </Text>
					<TouchableOpacity style={styles.switchWrap} onPress={this.switchOrder} hitSlop={{top:10,left:20,bottom:10,right: 10}}>
						<Image style={styles.switchImg} source={require('../assets/switch_img.png')}/>
						<Text style={styles.text11Red}>按{this.orderType ?'金额':'数量'}{this.props.type ? '出售':'购买'}</Text>
					</TouchableOpacity>
				</View>


				<View style={styles.btnWrap}>
					<TouchableOpacity style={styles.btnWrapTouch} onPress={this.props.clickTrade}>
						<Image style={styles.buyImg} source={require('../assets/buy.png')}/>
						<Text style={styles.text15WhiteBold}>{this.props.type ? '出售' : '购买'}</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.gantanhaoWrap}>
					<Image style={styles.gantanhaoImg} source={require('../assets/gantanhao.png')}/>
					{/*<Text style={styles.text11Gray}>交易0手续费</Text>*/}
					<Text style={styles.text11Gray}>小额快速交易，0手续费</Text>
				</View>




			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: getWidth(30)
	},
	mainWrap: {
		marginTop: getHeight(30),
		borderBottomColor: '#e7ebee',
		borderBottomWidth: 1,
		borderStyle: 'solid',
	},
	mariWrapFocus:{
		marginTop: getHeight(30),
		borderBottomColor: '#c43e4e',
		borderBottomWidth: 1,
		borderStyle: 'solid',
	},
	text12BlackBold: {
		padding: 2,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#172a4d',
		fontWeight: '600',
		fontFamily: 'System'
	},
	inputWrap: {
		width: '100%',
		flexDirection: 'row',
		alignItems:'center',
		justifyContent:'space-between',
		marginTop:getHeight(40),
		marginBottom:getHeight(24),
		position:'relative'

	},
	text23BlackBold: {
		padding: 2,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 23,
		color: '#172a4d',
		fontWeight: '600',
		fontFamily: 'System'
	},
	text18BlackBold: {
		padding: 2,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 23,
		color: '#172a4d',
		fontWeight: '600',
		fontFamily: 'System'
	},
	input: {
		width: '100%',
		height: getHeight(60),
		fontSize: 18,
		color: '#172a4d',
		paddingVertical: 0,
		paddingHorizontal: getWidth(20),
	},


	positonButton:{
		position:'absolute',
		right:0,
		width:getWidth(88),
		height:getHeight(48),
		borderRadius:getWidth(24),
		borderStyle: 'solid',
		borderWidth:1,
		borderColor:'rgba(196,62,78,0.5)',
		backgroundColor:'rgba(196,62,78,0.08)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	positonView:{
		position:'absolute',
		right:0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text12Red:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#c43e4e',
	},


	tipWrap:{
		flexDirection: 'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingVertical:getHeight(12)
	},

	text11Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 11,
		color: '#8994a5',
	},
	switchWrap:{
		flexDirection:'row',
		alignItems:'center',

	},
	text11Red:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 11,
		color: '#c43e4e',
	},
	switchImg:{
		width:getWidth(20),
		height:getWidth(20),
		marginHorizontal:getWidth(12)
	},
	btnWrap:{
		width:'100%',
		alignItems:'center',
		justifyContent:'center',
		marginTop:getHeight(54)
	},

	btnWrapTouch:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		width:'100%',
		height:getHeight(72),
		backgroundColor: '#c43e4e',
		borderRadius:getHeight(3)

	},

	buyImg:{
		width:getWidth(20),
		height:getHeight(28),
		marginRight:getWidth(5)
	},
	text15WhiteBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#fff',
		fontWeight:'600',
		fontFamily:'System',

		marginLeft:getWidth(5)

	},
	gantanhaoWrap:{
		flexDirection:'row',
		marginVertical:getHeight(12)
	},

	gantanhaoImg:{
		width:getWidth(24),
		height:getWidth(24),
		marginRight: getWidth(10)
	}
});



