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
	Platform, AsyncStorage, ImageBackground
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import Toast from 'react-native-root-toast'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal'


const back_png0 = require('../assets/back_arrow.png')
const back_png1 = require('../assets/back_arrow2.png')


const order_png1 = require('../assets/order.png')
const order_png2 = require('../assets/order2.png')



@observer
export default class OtcHeader extends RNComponent {




	@observable theme = 0     //0快捷区  1自选区
	@observable type = 0      //0买    1卖

	@computed   //快捷买卖 不允许卖
	get disableQuickSell(){
		return !this.theme && !this.type;
	}

	changeTheme = v => {

		this.type = 0;

		this.theme = v;
		this.props.getTheme && this.props.getTheme(v);
	}
	changeType = v => {

		// if(!this.theme){
		// 	Toast.show('暂无订单', {duration: 1000,position: Toast.positions.CENTER})   ;
		// 	return;
		// }

		this.type = v;
		this.props.getType && this.props.getType(v);

	}


	textArr = [_ => styles.text24White, _ => styles.text15Graytranspatenr, _ => styles.text24Black, _ => styles.text15Gray]

	getSellText = _ => {
		let arrayIndex = (this.theme && 0b10 || 0) | (this.type && 0b01 || 0);
		return this.textArr[arrayIndex]()
	}

	getBuyText = _ => {
		let arrayIndex = (this.theme && 0b10 || 0) | (!this.type && 0b01 || 0);
		return this.textArr[arrayIndex]()
	}

	goBack =  _ =>this.$router.goBack();

	clickOrder = _ =>this.props.clickOrder && this.props.clickOrder();




	render() {
		return (

			<View style={[styles.container, this.theme ? styles.themeBg1 : styles.themeBg0]}>
				<View style={styles.toolbar}>
					<TouchableOpacity onPress={this.goBack}>
						<Image source={this.theme ? back_png1 : back_png0} style={styles.backImg} hitSlop={{top:15,left:15, bottom:15, right:15}}/>
					</TouchableOpacity>
					<View style={[styles.switchButtonBox, this.theme ? styles.border4 : styles.border1]}>
						<TouchableOpacity style={[styles.switchButtonL, this.theme ? styles.border3 : styles.border2]}
						                  onPress={() => this.changeTheme(0)}>
							<Text style={this.theme ? styles.text12Gray : styles.text12White}>快捷区</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.switchButtonR, this.theme ? styles.border5 : styles.border3]}
						                  onPress={() => this.changeTheme(1)}>
							<Text style={this.theme ? styles.text12Red : styles.text12Transparent}>自选区</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.navigateBar}>
					<View style={styles.navigateSwitch}>
						<TouchableOpacity onPress={() => this.changeType(0)} disabled={this.disableQuickSell}>
							<Text style={this.getSellText()}>我要买</Text>
						</TouchableOpacity>
						<View style={styles.space}/>
						<TouchableOpacity onPress={() => this.changeType(1)}>
							<Text style={this.getBuyText()}>我要卖</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.orderWrap} onPress={this.clickOrder}>
						<Image source={this.theme&&order_png2||order_png1} style={styles.orderImage}/>
						<Text style={this.theme&&styles.orderText2||styles.orderText}>订单</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: getHeight(300),
		paddingTop: getHeight(40),
		paddingHorizontal: getWidth(30)
	},
	toolbar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: getHeight(88)
	},
	backImg: {
		width: getWidth(32),
		height: getWidth(32)
	},
	switchButtonBox: {
		width: getWidth(200),
		height: getHeight(56),
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: getHeight(56),
		position: 'relative'
	},

	switchButtonL: {
		position: 'absolute',
		left: -1,
		top: -1,
		width: getWidth(108),
		height: getHeight(56),
		borderRadius: getHeight(28),
		justifyContent: 'center',
		alignItems: 'center'
	},
	switchButtonR: {
		position: 'absolute',
		top: -1,
		right: -1,
		paddingLeft: getWidth(6),
		width: getWidth(108),
		height: getHeight(56),
		borderRadius: getHeight(28),
		justifyContent: 'center',
		alignItems: 'center'
	},
	switchText1: {
		color: '#fff',
		fontSize: 12,
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
	},
	switchText2: {
		color: 'rgba(255,255,255,0.5)',
		fontSize: 12,
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
	},


	navigateBar: {
		paddingTop: getHeight(40),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},


	navigateSwitch: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	navigateActiveText: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 24,
		color: '#fff',
		fontWeight: '600',
		fontFamily: 'System'
	},
	navigateQuietText: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#fefffe50',
	},
	space: {
		width: getWidth(40)
	},
	orderWrap: {
		alignItems: 'center'
	},

	orderImage: {
		width: getWidth(32),
		height: getWidth(32),
		marginBottom: getHeight(4)
	},
	orderText: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 10,
		color: '#fff',
	},
	orderText2: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 10,
		color: '#172a4d',
	},


	themeBg0: {
		backgroundColor: '#E84A55'
	},
	themeBg1: {
		backgroundColor: '#F7F7FB'
	},
	border1: {
		borderWidth: 1,
		borderStyle: 'solid',
		// borderColor: 'rgba(255,255,255,0.5)',
		borderColor: '#FFA5B0',
	},
	border2: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#fff',
	},
	border3: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: 'transparent',
	},
	border4: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#A2B5D9',
	},
	border5: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#3576F5',
	},

	text24White: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 24,
		color: '#fff',
		fontWeight: '600',
		fontFamily: 'System'
	},

	text24Black: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 24,
		color: '#172A4D',
		fontWeight: '600',
		fontFamily: 'System'
	},


	text15Gray: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#6B7DA2',
		fontWeight: '600',
		fontFamily: 'System'
	},
	text15Graytranspatenr: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 15,
		color: '#fefffe50',
		fontWeight: '600',
		fontFamily: 'System'
	},
	text12White: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#fff',
	},
	text12Transparent: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#ffffff50',
	},
	text12Gray: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#6B7DA2',
	},
	text12Red: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		color: '#3576F5',
	},


});



