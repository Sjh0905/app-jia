/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, Text, View, Image, ScrollView, ListView, TouchableOpacity, FlatList,SectionList} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from './baseComponent/NavigationHeader'
import BaseDefaultBar from './baseComponent/BaseDefaultBar'

import BaseStyles from '../style/BaseStyle'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import device from "../configs/device/device";
import MarketItem from "./MarketItem"

@observer
export default class Market extends RNComponent {


	@computed get symbolIndex (){
		var symbolIndex ;
		this.$store.state.symbol.split('_')[1]  === 'USDT' && (symbolIndex = 0);
		this.$store.state.symbol.split('_')[1]  === 'BTC' && (symbolIndex = 1);
		this.$store.state.symbol.split('_')[1]  === 'ETH' && (symbolIndex = 2);
		this.$store.state.symbol.split('_')[1]  === 'BDB' && (symbolIndex = 3);
		return symbolIndex;
	}
    @computed get feeDiscount() {
        return this.$store.state.feeDiscount || {}
    }

	@observable  otherTestNum = 0
	@observable  imgData = []
	@observable  textData = []
	@observable  market_list = []
	@observable  _currencylist = []
	@observable  tabData = []
	@observable  selectedTitleBar = 'mainBoard'


	// @action
	// listRenderRow = ({item}) => {
	// 	return (
	// 		<TouchableOpacity style={styles.listRowWrap} onPress={() => this.gotoTrade(item.name)}>
	// 			<View style={[styles.rowBase, styles.row1]}>
	// 				<View style={{flexDirection: 'row', marginBottom: 2.5}}><Text  allowFontScaling={false}
	// 					style={[styles.size15, styles.color100]}>{item.name}</Text><Text  allowFontScaling={false}
	// 					style={[styles.size13, styles.color40]}> / ETH</Text></View>
	// 				<View style={{marginTop: 2.5}}><Text  allowFontScaling={false}
	// 					style={[styles.size13, styles.color40]}>成交量 {Math.floor(item.value[5])}</Text></View>
    //
	// 			</View>
	// 			<View style={[styles.rowBase, styles.row2]}>
	// 				<View>
	// 					<Text  allowFontScaling={false}
	// 						style={[styles.size15, (item.value[4] - item.value[1] >= 0) && styles.colorGreen || styles.colorRed, {marginBottom: 2.5}]}>{this.$globalFunc.accFixed(item.value[4], 8)}</Text>
	// 					<Text  allowFontScaling={false} style={[styles.size13, styles.color40, {marginTop: 2.5}]}>¥</Text>
	// 				</View>
	// 			</View>
	// 			<View style={[styles.rowBase, styles.row3]}>
	// 				<View
	// 					style={[styles.row3Btn, (item.value[4] - item.value[1] >= 0) && styles.bgGreen || styles.bgRed]}>
	// 					<Text  allowFontScaling={false} style={styles.color100}>
	// 						{item.value[1] === 0 || item.value[4] - item.value[1] <= 0 ? '' : '+'}
	// 						{item.value[1] == 0 ? '0%' : ((item.value[4] - item.value[1]) / item.value[1] * 100).toFixed(2) + '%'}
	// 					</Text>
	// 				</View>
    //
	// 			</View>
    //
    //
	// 		</TouchableOpacity>
	// 	)
	// }

	@action
	rendItemHeader = () => {
		return (
			<View style={styles.listTitleWrap}>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle1]}>名称 / 成交量</Text>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle2]}>最新价</Text>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle3]}>24h涨跌</Text>
			</View>
		)
	}

	@action
    onSelectMainBoard = () => {
		if(this.selectedTitleBar === 'mainBoard')
			return;

        this.selectedTitleBar = 'mainBoard'

	}

	@action
    onSelectWeiMi = () => {
        if(this.selectedTitleBar === 'weiMi')
            return;

        this.selectedTitleBar = 'weiMi'
	}

	//跳转到币对搜索页面
    toMarketCollectEdit = () => {
	    this.$router.push('MarketCollectEdit');
    }

    //跳转到币对搜索页面
    toMarketSearch = () => {
	    this.$router.push('MarketSearch');
    }


	render() {


		return (
			<View style={[styles.container, BaseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>
				<NavHeader
                    headerTitle={'行情'}
                    touchCompLeft={<Image style={{width: getWidth(32), height: getWidth(32)}}
                                          source={require('../assets/Market/edit.png')}
                                          resizeMode={'contain'}
                    />}
                    touchCompLeftClick={this.toMarketCollectEdit}
                    touchCompRight={<Image style={{width: getWidth(32), height: getWidth(32)}}
                                        source={require('../assets/Market/search.png')}
                                        resizeMode={'contain'}
                    />}
                    touchCompRightClick={this.toMarketSearch}

                />

				{
                    /*PlatformOS === 'ios' &&
						<View style={styles.titleBarBox}>
							{/!*由于直接控制TouchableOpacity的样式在iOS真机上会出现样式错乱，所以外边包一层view通过长度截取达到效果*!/}
							<View style={styles.titleMainBoardBarView}>
								<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectMainBoard} style={[styles.titleBar,styles.titleMainBoardBar,this.selectedTitleBar === 'mainBoard' && styles.selectedTitleBar || {}]}>
									<Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'mainBoard' && styles.selectedTBText || {}]}>主板区</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.titleWeiMiBarView}>
								<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectWeiMi} style={[styles.titleBar,styles.titleWeiMiBar,this.selectedTitleBar === 'weiMi' && styles.selectedTitleBar || {}]}>
									<Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'weiMi' && styles.selectedTBText || {}]}>超级为蜜区</Text>
								</TouchableOpacity>
							</View>
						</View>
					||
						<View style={styles.titleBarBoxAndroid}>
							<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectMainBoard} style={[styles.titleBarAndroid,styles.titleMainBoardBarAndroid,this.selectedTitleBar === 'mainBoard' && styles.selectedTitleBar || {}]}>
								<Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'mainBoard' && styles.selectedTBText || {}]}>主板区</Text>
							</TouchableOpacity>
							<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectWeiMi} style={[styles.titleBarAndroid,styles.titleWeiMiBarAndroid,this.selectedTitleBar === 'weiMi' && styles.selectedTitleBar || {}]}>
								<Text allowFontScaling={false} style={[styles.titleBarText,this.selectedTitleBar === 'weiMi' && styles.selectedTBText || {}]}>超级为蜜区</Text>
							</TouchableOpacity>
						</View>*/

				}
                {
                	this.selectedTitleBar === 'mainBoard' &&
					<ScrollableTabView
                    renderTabBar={() =>
						<BaseDefaultBar
						tabLabels={['自选区','USDT','挖矿区']}//要么都加空格，要么都不加空格，否则有了"免"字后会影响居中效果
						// tabImageShow={[this.feeDiscount.USDT,this.feeDiscount.BTC,this.feeDiscount.ETH]}
						// tabImage={null}
						// tabImageShow={[1,1,1]}
						/>
                	}
                    initialPage={0}
                    /*tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#3576F5'
                    tabBarInactiveTextColor='#fff'
                    tabBarTextStyle={{fontSize: 14,marginBottom:getHeight(-26)}}
                    tabBarUnderlineStyle={{
                        backgroundColor: '#3576F5',
                        height:getHeight(4),
                        // width:getHeight(DeviceWidth*3/14),
                        // marginLeft:getHeight(DeviceWidth*4/23)
                        marginLeft: DeviceWidth / 6 - (3 * 14 / 2),
                        width: (3 * 14),
                    }}*/
                    style={{backgroundColor:StyleConfigs.bgColor,overflow:'hidden'}}
                    >

                    <MarketItem tabLabel={' 自选区 '} goRouter={'TraddingHall'} index={7}/>
                    <MarketItem tabLabel={' USDT '} goRouter={'TraddingHall'} index={0}/>
                    {/*<MarketItem tabLabel={' BTC '} goRouter={'TraddingHall'} index={1}/>*/}
                    {/*<MarketItem tabLabel={' ETH '} goRouter={'TraddingHall'} index={2}/>*/}
                    {/*<MarketItem tabLabel={' ENX '} goRouter={'TraddingHall'} index={6}/>*/}
                    <MarketItem tabLabel={' 挖矿区 '} goRouter={'TraddingHall'} index={8}/>
                    {/*<MarketItem tabLabel={' BDB '} index={3}/>*/}
                    </ScrollableTabView>
				||
                	/*不再区分主板和为蜜，area={'weimi'}  index={4}参数就没了意义*/
                	<MarketItem tabLabel={' USDT '}  goRouter={'TraddingHall'} area={'weimi'}  index={4}/>
                }

			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	listView: {
        flex: 1,
		// height: getHeight(1020),
		// marginTop: getHeight(20),
		// backgroundColor: '#131316'
	},
	listTitleWrap: {
		width:'100%',
		height: getHeight(60),
		// borderBottomWidth: 1,
		// borderBottomColor: StyleConfigs.listSplitlineColor,
        backgroundColor: StyleConfigs.sectTitleColor,
        flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getWidth(20),
		paddingRight: getWidth(20)
	},
	listTitleBase: {
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txtA2B5D9
	},
	listTitle1: {
		width: '34%'
	},
	listTitle2: {
		width: '41%'

	},
	listTitle3: {
		width: '25%',
		textAlign: 'right'
	},
	listRowWrap: {
		height: getHeight(120),
		borderBottomWidth: 1,
		borderBottomColor: StyleConfigs.listSplitlineColor,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getWidth(20),
		paddingRight: getWidth(20)
	},
	rowBase: {},
	row1: {
		width: '34%'
	},
	row2: {
		width: '41%'
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
	color80: {color: 'rgba(255,255,255,0.8)'},
	color40: {color: 'rgba(255,255,255,0.4)'},
	colorGreen: {color: '#86CB12'},
	colorRed: {color: '#F60076'},
	bgGreen: {backgroundColor: '#86CB12'},
	bgRed: {backgroundColor: '#F60076'},
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
		left: getWidth(750 / 12),
		bottom: 0,
		right: 0,
		height: getHeight(4),
		width: getWidth(750 / 6),
		alignSelf: 'center',
	},
	tabBoxStyle: {
		height: getHeight(80),
		justifyContent: 'center'
	},
    fontWeight:{
        fontWeight:'bold'
    },
    titleBarBox:{
        width:'100%',
        height:getHeight(80),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    titleBar:{
        width:getWidth(236),
        height:getHeight(60),
        borderWidth:getWidth(1),
        borderRadius:getHeight(6),
        borderColor:'#5B5F64',
        alignItems:'center',
        justifyContent:'center'
    },
    titleMainBoardBarView:{
        width:getWidth(230),
        height:getHeight(62),
		overflow:'hidden',
        // borderWidth:getWidth(1),
        // borderRadius:getHeight(6),
        // borderColor:'#5B5F64',
        // alignItems:'center',
        // justifyContent:'center'
	},
    titleMainBoardBar:{
        // borderRightWidth:0,
        // borderTopLeftRadius:getHeight(6),
        // borderBottomLeftRadius:getHeight(6),
		paddingRight:getHeight(3)
    },
    titleWeiMiBarView:{
        width:getWidth(230),
        height:getHeight(62),
        overflow:'hidden',
    },
    titleWeiMiBar:{
        // borderLeftWidth:0,
        // borderTopRightRadius:getHeight(6),
        // borderBottomRightRadius:getHeight(6),
		marginLeft:-getHeight(6),
        paddingLeft:getHeight(3)

    },
    titleBarText:{
        color:'#fff',
        fontSize: 15,
        opacity:0.8
    },
    selectedTitleBar:{
        backgroundColor:'#3576F5',
        borderColor:'#3576F5'
    },
    selectedTBText:{
        opacity:1
    },
    titleBarBoxAndroid:{
        width:'100%',
        height:getHeight(80),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    titleBarAndroid:{
        width:getWidth(230),
        height:getHeight(60),
        borderWidth:getWidth(1),
        borderColor:'#5B5F64',
        alignItems:'center',
        justifyContent:'center'
    },
    titleMainBoardBarAndroid:{
        borderRightWidth:0,
        borderTopLeftRadius:getHeight(6),
        borderBottomLeftRadius:getHeight(6)
    },
    titleWeiMiBarAndroid:{
        borderLeftWidth:0,
        borderTopRightRadius:getHeight(6),
        borderBottomRightRadius:getHeight(6)
    }
});
