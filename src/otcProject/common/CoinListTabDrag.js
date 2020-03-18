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
export default class CoinListTabDrag extends RNComponent {


	render() {


		return (
			<View style={styles.container}>
				<View style={styles.textWrap}>
					<Text style={styles.text14RedBold}>USDT</Text>
				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: getHeight(72),
		borderBottomColor: '#e7ebee',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderStyle: 'solid',
		paddingHorizontal: getWidth(30),
		flexDirection: 'row'
	},
	textWrap: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	text14RedBold:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#3576F5',
		fontWeight:'600',
		fontFamily:'System'
	}


});



