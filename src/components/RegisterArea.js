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
	FlatList, Platform, ActivityIndicator,
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Fetch from '../otcProject/common/FetchUtil'

const search_png = require('../assets/MarketDealList/search.png')
const isIOS = Platform.OS == 'ios' ? true : false

const Sleep = ms => new Promise(res=>setTimeout(res,ms));

const generReg = val =>	new RegExp(`(.*)(${val.split('').join(')(.*)(')})(.*)`, 'i')




@observer
export default class RegisterArea extends RNComponent {



	componentDidMount() {
		super.componentDidMount();
		this.begin()
	}

	@observable hadInit = false
	@observable listData = []

	@observable result = []
	@observable textInput = ''


	async begin() {
		this.hadInit = false;
		await this.getAreaCode()
		this.hadInit = true;
	}

	getAreaCode =  async ()=>{
		let data = await Fetch('AREACODE', {}, this)
		data && (this.listData = data)

	}

	goBack = _ => this.$router.goBack();


	clickItem = (code,nameCn) => {


        this.notify({key: 'CHANGE_AREA'},code == '0086' ? 0 : 1);

		this.$store.commit('SET_AREA_CODE',code )
		this.$store.commit('SET_AREA_NAMECN',nameCn )
		this.goBack()
	}






	textChange = text =>{
		Sleep(200);
		this.textInput = text;
		if(this.textInput){
			this.result = this.listData.filter(v=>generReg(text).test(v.nameCn))
		}
	}




	listItem = ({item, index}) => {
		return (
			<TouchableOpacity style={styles.itemWrap} onPress={()=>this.clickItem(item.areaCode,item.nameCn)}>
				<Text style={styles.text14Black}>{item.nameCn}</Text>
				<Text style={styles.text14Gray}>{item.areaCode && item.areaCode.replace(/00/,'+')}</Text>
			</TouchableOpacity>
		)

	}

	render() {


		return (

			<View style={styles.container}>
				<View style={[styles.IOSStatusBar, !isIOS && styles.androidStatusBar]}></View>
				<View style={styles.headerWrap}>
					<View style={styles.iptWrap}><Image style={styles.img} source={search_png}/>
					<TextInput style={styles.input} placeholder={'请选择国家和地区'} maxLength={16} placeholderTextColor={'#8994A5'} underlineColorAndroid={'transparent'} onChangeText={this.textChange} value={this.traditionInputText} /></View>
					<TouchableOpacity onPress={this.goBack}><Text style={styles.text14Gray}>取消</Text></TouchableOpacity>
				</View>
				{this.hadInit ?<FlatList data={this.textInput?this.result:this.listData} renderItem={this.listItem} keyExtractor={(item, index) => index.toString()}/> :<ActivityIndicator animating={!this.hadInit} style={styles.loading}/>}


			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:StyleConfigs.navBgColor0602,
		paddingTop:getDeviceTop(),
	},
	IOSStatusBar: {
		height: getHeight(40),
	},
	androidStatusBar: {
		height: getHeight(0),
	},
	headerWrap:{
		width:'100%',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		borderStyle:'solid',
		// borderBottomColor:'rgba(255,255,255,0.95)',
		borderBottomColor:'#e7ebee',
		borderBottomWidth:StyleSheet.hairlineWidth,
		paddingHorizontal:getWidth(30),
		height:getHeight(88)
	},



	iptWrap:{
		flexDirection: 'row',
		alignItems: 'center'
	},



	img:{
		width:getWidth(28),
		height:getWidth(28),
		marginRight:getWidth(20)
	},
	input:{
		width:getWidth(400),
		height:getHeight(84),
		// borderStyle:'solid',
		// borderWidth:StyleSheet.hairlineWidth,
		// borderColor:'#c5cfd5',
		paddingHorizontal:getWidth(24)

	},
	itemWrap:{
		width:'100%',
		paddingHorizontal:getWidth(30),
		height:getHeight(80),
		borderStyle:'solid',
		borderBottomColor:'#f7f7fb',
		// borderBottomColor:'red',
		borderBottomWidth:StyleSheet.hairlineWidth,
		flexDirection:'row',
		justifyContent: 'space-between',
		alignItems:'center'

	},


	text14Black:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#172a4d',
	},

	text14Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 14,
		color: '#8994a5',
	},

	text16Gray:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#8994a5',
	},


	loading:{
		marginTop:getHeight(500)
	}
});

