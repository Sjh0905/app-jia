/**
 * Created by chest on 09/23/2019.
 */


import React ,{Component} from 'react';
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
import RNComponent from "../../configs/classConfigs/ReactNativeComponent";

const status_png1 = require('../assets/order_complete.png')
const status_png2 = require('../assets/order_cancel.png')
const status_png3 = require('../assets/order_pendding.png')



@observer
export default class OrderListHeader extends RNComponent {


	goBack = _ => this.$router.goBack();

	excuteImg = ()=>{
		if(this.props.status === '已取消') return status_png2;
		if(this.props.status === '已完成') return status_png1;
		return status_png3;
	}


	render() {
		const {status,item} = this.props
		return (

			<View style={styles.container}>
				<View style={styles.toolbar}>
					<TouchableOpacity onPress={this.goBack} hitSlop={{top:15,left:15,
						bottom:15, right:15}}>
						<Image source={require('../assets/back_arrow.png')} style={styles.backImg}/>
					</TouchableOpacity>
					<View></View>
				</View>

				<View style={styles.navigateBar}>
					<Image source={this.excuteImg()} style={styles.statusImg}/>
					<Text style={styles.text24WhiteBold}>{status}</Text>
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
		paddingHorizontal: getWidth(30),
		backgroundColor: '#E84A55'
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


	navigateBar: {
		paddingTop: getHeight(20),
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusImg:{
		width:getWidth(44),
		height:getWidth(44),
		marginRight:getWidth(12)
	},

	text28BlackBold: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 28,
		color: '#172A4D',
		fontWeight:'bold',
		fontFamily:'System'
	},

	text24WhiteBold: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 24,
		color: '#fff',
		fontWeight:'600',
		fontFamily:'System'
	}
});



