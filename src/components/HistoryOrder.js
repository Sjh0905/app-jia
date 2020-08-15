/**
 * hjx 2018.4.16
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ListView,
    FlatList,
    SectionList,
    Platform
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from './baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";

import baseStyles from '../style/BaseStyle'
import device from "../configs/device/device";
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import Loading from './baseComponent/Loading'
import signBaseStyles from "../style/SignBaseStyle";
import BaseButton from "./baseComponent/BaseButton";

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

const ORDER_STATUS = {
	FULLY_FILLED:'已成交',
	FULLY_CANCELLED:'已撤单',
	PARTIAL_CANCELLED:'部分成交'
}








@observer
export default class HistoryOrder extends RNComponent {


	componentWillMount() {
		this.getOrder()

	}
    @computed get tradeLObj() {
        return this.$store.state.tradeList || {};
    }

	//分页步长,固定值
	pageLimit = 20

    //当前请求数据中最后一条数据的ID作为下一次分页请求的offsetId
    @observable
    offsetId = 0

	//加载中
	@observable
    loadingMore = '上拉加载更多'

    //是否继续加载
    @observable
    loadFlag = true

    // 加载中
    @observable
    loading = true

	// co=0

    @observable
	clickOrder = new Set()

    @observable
	currentOrder = []

    @action
    goDetai = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('HistoryOrderDetail',{order:data})
        }
    })()

    goToTrade = ()=>{
        this.$router.goBackToRoute('Home')
        // setTimeout(()=>{
        //     this.notify({key: 'CHANGE_TAB'}, 2);
            setTimeout(()=>{
                this.notify({key: 'SET_TAB_INDEX'},0);
                this.notify({key: 'CLEAR_INPUT'},false);
            })
        // })
    }

    // 列表为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂无订单记录</Text>
                <Text allowFontScaling={false} style={[styles.emptyText,{marginTop:5}]}>请您先去完成第一笔交易吧！</Text>
                <BaseButton
                    onPress={this.goToTrade}
                    style={[signBaseStyles.button,styles.toTradeBtn]}
                    textStyle={[signBaseStyles.buttonText,{fontSize:StyleConfigs.fontSize16}]}
                    activeOpacity={StyleConfigs.activeOpacity}
                    text={'去交易'}
                />
            </View>
        )
    }

	@action
	listRenderRow = (rowData, index) => {

		rowData = rowData.item;
        //价格精度显示
        let quoteScale = this.tradeLObj[rowData.symbol] ? (this.tradeLObj[rowData.symbol].quoteScale || 8) : 8
        rowData.quoteScale = quoteScale;
        // return(<Text  allowFontScaling={false} style={baseStyles.textColor}>{rowData.item}</Text>)

		return (
			<TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
				onPress={()=>this.goDetai(rowData)}
				style={{
				height: getHeight(120),
				borderBottomColor: StyleConfigs.borderBottomColor,
				borderBottomWidth: 1,
				paddingLeft: getWidth(20),
				paddingRight: getWidth(20),
				flexDirection: 'row',
				alignItems: 'center'
			}}>
				<View style={styles.rowV1}>
					<View style={{marginBottom: 5}}>
						<View style={{flexDirection: 'row'}}>
							<View style={rowData.type === 'BUY_LIMIT' && styles.ballGreen || styles.ballRed}><Text  allowFontScaling={false}
								style={[styles.color100, styles.size12]}>{rowData.type === 'BUY_LIMIT' && '买' || '卖'}</Text>
							</View><Text  allowFontScaling={false}
							style={[styles.color172A4D, styles.size15]}>{rowData.symbol.split('_')[0]}</Text><Text  allowFontScaling={false}
							style={[styles.colorC5CFD5, styles.size13]}> / {rowData.symbol.split('_')[1]}</Text>
						</View>
					</View>
					<View style={{marginTop: 5}}>
						<Text  allowFontScaling={false}
							style={[styles.colorC5CFD5, styles.size13]}>{this.$globalFunc.formatDateUitl(rowData.createdAt, 'MM-DD hh:mm:ss')}</Text>

					</View>
				</View>
				<View style={styles.rowV2}>
					<Text  allowFontScaling={false} style={[styles.color172A4D, styles.size15]}>{this.$globalFunc.accFixed(rowData.price, quoteScale)}</Text>
				</View>

				<View style={styles.rowV3}>
					<Text  allowFontScaling={false} style={[styles.color172A4D, styles.size15, {marginBottom: 5}]}>{rowData.filledAmount}</Text>
					<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size14, {marginTop: 5}]}>{rowData.amount}</Text>
				</View>



			</TouchableOpacity>
		)
	}





	listRenderRow2 = (rowData, index) => {

		rowData = rowData.item;
		//价格精度显示
		let quoteScale = this.tradeLObj[rowData.symbol] ? (this.tradeLObj[rowData.symbol].quoteScale || 8) : 8
		rowData.quoteScale = quoteScale;
		// return(<Text  allowFontScaling={false} style={baseStyles.textColor}>{rowData.item}</Text>)
        // let followText = rowData.isFollow ? '跟单' : ''
		return (
			<TouchableOpacity
				activeOpacity={StyleConfigs.activeOpacity}
				onPress={()=>this.goDetai(rowData)}
				style={{
					borderTopColor: StyleConfigs.borderBottomColor,
					borderTopWidth: 1,
					borderStyle:'solid',
					paddingLeft: getWidth(30),
					paddingRight: getWidth(30),
				}}>

				<View style={styles.itemLine1}>
					<View style={styles.itemLine1Left}>

						<Text style={[styles.itemLine1Txt1, {color:rowData.type.indexOf('BUY') > -1 && StyleConfigs.txtGreen || StyleConfigs.txtRed}]}>{this.$globalFunc.getOrderTypeText(rowData)}</Text>
						<Text style={styles.itemLine1Txt2}>{rowData.symbol.split('_')[0]}/{rowData.symbol.split('_')[1]}</Text>
					</View>
					<View style={styles.itemLine1Right}><Text style={styles.itemLine1Txt3}>{ORDER_STATUS[rowData.status]}</Text></View>
				</View>

				<View style={styles.tableWrap}>
					<View style={styles.tableItem1}>
						<Text style={styles.tableTxt1}>时间</Text>
						<Text style={styles.tableTxt2}>{this.$globalFunc.formatDateUitl(rowData.createdAt, 'hh:mm:ss MM/DD')}</Text>
						{/*<Text style={styles.tableTxt3}>成交总额(btc)</Text>*/}
						{/*<Text style={styles.tableTxt4}>13.8899776655</Text>*/}
					</View>
					<View style={styles.tableItem2}>
						<Text style={styles.tableTxt1}>委托价({rowData.symbol.split('_')[1]})</Text>
						<Text style={styles.tableTxt2}>{this.$globalFunc.accFixed(rowData.price, quoteScale)}</Text>
						{/*<Text style={styles.tableTxt3}>成交均价({rowData.symbol.split('_')[1]})</Text>*/}
						{/*<Text style={styles.tableTxt4}>{this.$globalFunc.accFixed(rowData.price, quoteScale)}</Text>*/}
					</View>
					<View style={styles.tableItem3}>
						<Text style={styles.tableTxt1}>成交量({rowData.symbol.split('_')[0]})</Text>
						<Text style={styles.tableTxt2}>{rowData.filledAmount}</Text>
						{/*<Text style={styles.tableTxt3}>成交量({rowData.symbol.split('_')[0]})</Text>*/}
						{/*<Text style={styles.tableTxt4}>113.87618913</Text>*/}
					</View>
				</View>











{/*
				<View style={styles.rowV1}>
					<View style={{marginBottom: 5}}>
						<View style={{flexDirection: 'row'}}>
							<View style={rowData.type === 'BUY_LIMIT' && styles.ballGreen || styles.ballRed}><Text  allowFontScaling={false}
							                                                                                        style={[styles.color100, styles.size12]}>{rowData.type === 'BUY_LIMIT' && '买' || '卖'}</Text>
							</View><Text  allowFontScaling={false}
							              style={[styles.color172A4D, styles.size15]}>{rowData.symbol.split('_')[0]}</Text><Text  allowFontScaling={false}
							                                                                                                      style={[styles.colorC5CFD5, styles.size13]}> / {rowData.symbol.split('_')[1]}</Text>
						</View>
					</View>
					<View style={{marginTop: 5}}>
						<Text  allowFontScaling={false}
						       style={[styles.colorC5CFD5, styles.size13]}>{this.$globalFunc.formatDateUitl(rowData.createdAt, 'MM-DD hh:mm:ss')}</Text>

					</View>
				</View>
				<View style={styles.rowV2}>
					<Text  allowFontScaling={false} style={[styles.color172A4D, styles.size15]}>{this.$globalFunc.accFixed(rowData.price, quoteScale)}</Text>
				</View>

				<View style={styles.rowV3}>
					<Text  allowFontScaling={false} style={[styles.color172A4D, styles.size15, {marginBottom: 5}]}>{rowData.filledAmount}</Text>
					<Text  allowFontScaling={false} style={[styles.color9FA7B8, styles.size14, {marginTop: 5}]}>{rowData.amount}</Text>
				</View>*/}



			</TouchableOpacity>
		)
	}

	@action
	rendItemHeader = () => {
		return (
			<View style={{
				paddingLeft: getWidth(20),
				paddingRight: getWidth(20),
				flexDirection: 'row',
				alignItems: 'center',
                borderBottomColor: StyleConfigs.listSplitlineColor,
                backgroundColor: StyleConfigs.sectTitleColor,
				height: getHeight(60)
			}}>
				<Text  allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '39%'}]}>市场</Text>
				<Text  allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '35%'}]}>单价</Text>
				<Text  allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '26%'}, {textAlign: 'right'}]}>成交量 / 数量</Text>
			</View>
		)
	}






	rendItemHeader2 = ()=>{
		return (
			<View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:getWidth(30),paddingVertical:getHeight(18),
				backgroundColor:'#fff'}}>
				{/*<Text style={{fontSize:StyleConfigs.fontSize16,color:StyleConfigs.txt6B7DA2, marginRight:getWidth(40),fontWeight:'600',fontFamily:'System'}}>全部委托</Text>*/}
				<Text style={{fontSize:StyleConfigs.fontSize28,color:StyleConfigs.txt172A4D,fontWeight:'600',fontFamily:'System'}}>历史记录</Text>
			</View>
		)
	}










    // 渲染充值footer组件
    @action
    rendItemFooter = (loadingMore) => {

        console.log('this.currentOrder.length',this.currentOrder.length);


        if (this.currentOrder.length == 0)
            return null


        return (
            <View style={styles.loadingMore}>

                <Text  allowFontScaling={false} style={[styles.loadingMoreText]}>{loadingMore}</Text>

            </View>
        )
    }

    @action
	getOrder = () => {
		// console.log('开始加载===',{offsetId: this.offsetId,
         //    limit: this.pageLimit,
         //    isFinalStatus: true,});

		this.loadingMore = '加载中';
        this.loadFlag = false;
        // this.co++;
		this.$http.send('POST_USER_ORDERS',
			{
				bind: this,
				params: {
					offsetId: this.offsetId,
					limit: this.pageLimit,
					isFinalStatus: true,
				},
				callBack: this.re_getOrder,
			})
	}

    @action
	re_getOrder = (data) => {
		console.log('this.currentOrder结束加载=======',data)
        this.loadingMore = '上拉加载更多'
        this.loadFlag = true;
		this.loading = false;
        if(data.orders && data.orders.length == 0){
            this.loadFlag = false;
            this.loadingMore = '已经全部加载完毕'
            return;

        }



		this.currentOrder.push(...data.orders.filter(
			v => {
				return ((v.status === 'PARTIAL_CANCELLED') || (v.status === 'FULLY_CANCELLED') || (v.status === 'FULLY_FILLED'))
			}
		))


		console.log('this.currentOrder===',this.currentOrder)

		this.offsetId = this.currentOrder.length && this.currentOrder[this.currentOrder.length-1].id  || this.offsetId;

        if(data.orders && data.orders.length < this.pageLimit){
            this.loadFlag = false;
            this.loadingMore = '已经全部加载完毕'
            return;

        }


	}

    @action
    loadingMoreData = () => {

	    if(!this.loadFlag)
	        return;
        // console.log('第'+this.co+'次发起加载===',this.currentOrder);

		this.getOrder();
	}
    @action
	goBack = ()=>{
		this.$router.goBack()
	}



	render() {

		let loadingMore = this.loadingMore
		let	sectionsData =this.currentOrder.length &&  [{data:[...this.currentOrder].slice(),key:'currentOrder'}] || [] ;

		return (

			<View style={styles.container}>
				<NavHeader
					headerTitle={''}
					goBack={this.goBack}
				/>

				<View style={styles.flatBox}>
					{!this.loading &&




					 <SectionList
                        stickySectionHeadersEnabled={true}
						renderItem={this.listRenderRow2}
						renderSectionHeader={() => this.rendItemHeader2()}
						ListFooterComponent={() => this.rendItemFooter(loadingMore)}
						keyExtractor={(item, index) => index.toString()}//由于4个tab页会一起渲染，所以加上this.props.index
						onEndReachedThreshold={reachedThreshold}
						onEndReached={this.loadingMoreData}
						sections={
							sectionsData
						}
						getItemLayout={(data, index) => ({
							length: getHeight(120),
							offset: getHeight(120) * index,
							index
						})}
						ListEmptyComponent={this._renderEmptyComponent}

					/>
					||
					<Loading leaveNav={false}/>
					}

				</View>

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
    flatBox: {
        flex: 1,
		height:600,
        marginBottom: (Platform.OS === "ios") && -getHeight(120) || 0,//由于安卓和iOS的分页要求不同
        backgroundColor: StyleConfigs.bgColor,
        paddingBottom: getDeviceBottom()


    },

	listView: {
		// height:getHeight(600),
		marginTop: getHeight(20),
		backgroundColor: '#131316'
	},
	listTitleWrap: {
		height: getHeight(60),
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
	color172A4D: {color: StyleConfigs.txt172A4D},
	colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
	color9FA7B8: {color: StyleConfigs.txt9FA7B8},
	color80: {color: 'rgba(255,255,255,0.8)'},
	color40: {color: 'rgba(255,255,255,0.4)'},
	colorGreen: {color: '#34A753'},
	colorRed: {color: '#EF5656'},
	bgGreen: {backgroundColor: '#34A753'},
	bgRed: {backgroundColor: '#EF5656'},
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
		backgroundColor: '#34A753',
		borderRadius: 4,
		height: getHeight(72),
		alignItems: 'center',
		justifyContent: 'center'
	},
	dealBtnRed: {
		backgroundColor: '#EF5656',
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
		backgroundColor: '#EF5656',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: getWidth(16),
		marginRight: 10
	},
	ballGreen: {
		width: getWidth(32),
		height: getWidth(32),
		backgroundColor: '#34A753',
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
		borderColor: '#3576F5',
		borderStyle: 'solid',
		alignItems: 'center',
		justifyContent: 'center'
	},
    loadingMore: {
        height: getHeight(120),
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: StyleConfigs.txtC5CFD5
    },
    emptyIcon: {
        width:getWidth(300),
        height:getWidth(250)
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:getHeight(250)

    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    },
    toTradeBtn:{
        marginTop:50,
        width:120,
        height:36
    },






	itemLine1:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingVertical:getHeight(24),
	},
	itemLine1Left:{
		flexDirection:'row',
		alignItems:'center',
	},
	itemLine1Right:{},

	itemLine1Txt1:{
		fontSize:StyleConfigs.fontSize16,
		fontWeight:'bold',
		fontFamily:'System'
	},
	itemLine1Txt2:{
		fontSize:StyleConfigs.fontSize16,
		fontWeight:'bold',
		fontFamily:'System',
		color:StyleConfigs.txt172A4D,
		marginLeft:getWidth(10)
	},
	itemLine1Txt3:{
		fontSize:StyleConfigs.fontSize13,
		color:StyleConfigs.txt6B7DA2
	},

	tableWrap:{
		flexDirection:'row',
		justifyContent:'space-between'
	},
	tableItem1:{
		width:'33%',
		alignItems:'flex-start'
	},
	tableItem2:{
		width:'36%',
		alignItems:'flex-start',
		paddingLeft:getWidth(46),

	},
	tableItem3:{
		width:'30%',
		alignItems:'flex-end'
	},
	tableTxt1:{
		color:StyleConfigs.txtC5CFD5,
		fontSize:StyleConfigs.fontSize12,
		marginBottom:getHeight(10)
	},
	tableTxt2:{
		color:StyleConfigs.txt172A4D,
		fontSize:StyleConfigs.fontSize14,
		marginBottom:getHeight(22)
	},
	tableTxt3:{
		color:StyleConfigs.txtC5CFD5,
		fontSize:StyleConfigs.fontSize12,
		marginBottom:getHeight(10)
	},
	tableTxt4:{
		color:StyleConfigs.txt172A4D,
		fontSize:StyleConfigs.fontSize14,
		marginBottom:getHeight(28)
	}

});