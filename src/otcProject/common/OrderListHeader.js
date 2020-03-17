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





@observer
export default class OrderListHeader extends RNComponent {


	goBack = _ => this.$router.goBack();


	render() {
		return (

			<View style={styles.container}>
				<View style={styles.toolbar}>
					<TouchableOpacity onPress={this.goBack} hitSlop={{top:15,left:15, bottom:15, right:15}}>
						<Image source={require('../assets/back_arrow2.png')} style={styles.backImg}/>
					</TouchableOpacity>
					<View></View>
				</View>

				<View style={styles.navigateBar}>
					<Text style={styles.text28BlackBold}>订单记录</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: getHeight(246),
		paddingTop: getHeight(40),
		paddingHorizontal: getWidth(30),
		backgroundColor:'#fff'
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
		justifyContent: 'space-between',
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


});



