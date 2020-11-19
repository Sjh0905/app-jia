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

import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'

// const showCurrency = ['BTC','ETH']
@observer
export default class AssetPageDetailMarket extends RNComponent {

    @computed get exchangRateDollar(){
        return this.$store.state.exchangRateDollar
    }

    @computed get mainPageSymbol() {
        return this.$store.state.mainPageSymbol;
    }

	@computed get marketList() {
		return this.$store.state.marketList || {}
	}

	@computed get exchange_rate() {
		return this.$store.state.exchange_rate
	}

    @computed get marketUseRate() {
        return this.$store.state.marketUseRate || {} /*&& this.$store.state.marketUseRate[this.props.index] || '0'*/;
    }

    @computed get tradeLObj() {
        return this.$store.state.tradeList || {};
    }

    @computed get priceNow() {
        return this.$store.state.newPrice || this.$store.state.depthMerge || {}
    }

	@observable rate = 0

	@observable imgData = [
    ]


	@computed get dataList() {
			var data = [];

			let showCurrency = this.props.showCurrency;

			//展示所有币对
			Object.keys(this.marketList).forEach(key=>{
				var item = (this.marketList[key] instanceof Array) && this.marketList[key].slice() || []
				console.log('this is item',item);
				item = item.filter(v => showCurrency.indexOf(v.name) > -1)
				data = data.concat(item)
			})
			return data.slice() || []
	}

	componentWillMount() {
		// this.props.index === 0 && (this.rate = 1);
		// this.props.index === 1 && (this.rate = this.exchange_rate.btcExchangeRate);
		// this.props.index === 2 && (this.rate = this.exchange_rate.ethExchangeRate);
		// this.props.index === 3 && (this.rate = this.marketList.ETH[0].value[4] * this.exchange_rate.ethExchangeRate)

		// console.log('只希望渲染一次=====',this.props.index)

	}


	@action
	gotoTrade = (() => {
		let last = 0;
		return (symbol) => {
			if (Date.now() - last < 1000) return;
			last = Date.now();
			// var temp;
			// this.props.index === 0 && (temp = '_USDT');
			// this.props.index === 1 && (temp = '_BTC');
			// this.props.index === 2 && (temp = '_ETH');
			// this.props.index === 3 && (temp = '_BDB');
			// this.props.index === 4 && (temp = '_USDT');
			// console.log('temp======', temp)

			this.$store.commit('SET_SYMBOL', (symbol.name || 'ETH') +'_' + (symbol.denominator || 'USDT'))
			// console.log('this.$store.state.symbol',this.$store.state.marketPriceMerge)
			this.notify({key: 'CHANGE_SYMBOL'})
            // this.notify({key: 'CLEAR_INPUT'});

            //传递时价过去，延迟是为了等待priceNow有数据
            setTimeout(()=>{
                let quoteScale = this.tradeLObj[symbol.name+"_"+symbol.denominator] ? (this.tradeLObj[symbol.name+"_"+symbol.denominator].quoteScale || 8) : 8
                let price = this.priceNow.price && this.marketUseRate[symbol.denominator] && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate[symbol.denominator]) || 0, quoteScale) || (symbol.value && symbol.value[4] || '');
                this.notify({key: 'CLEAR_INPUT'},false,price);

            },500)

            this.$router.goBackToRoute('Home')
            setTimeout(()=>{
                this.notify({key: 'CHANGE_TAB'}, 2);
                setTimeout(()=>{
                    this.notify({key: 'SET_TAB_INDEX'},0);
                    this.notify({key: 'CLEAR_INPUT'},false);
                })
            })
			// this.$router.goBack()
		}

	})()

    gotoMarket = ()=>{
        this.notify({key: 'CHANGE_TAB'}, 1);
    }

    // 列表为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有数据</Text>
            </View>
        )
    }


	@action
	listRenderRow = (item,inx) => {


    	//价格精度显示
    	let quoteScale = this.tradeLObj[item.name+"_"+item.denominator] ? (this.tradeLObj[item.name+"_"+item.denominator].quoteScale || 8) : 8

		return (
			<TouchableOpacity key={inx} activeOpacity={StyleConfigs.activeOpacity} style={[styles.listRowWrap]} onPress={() => this.gotoTrade(item)}>
                <View style={styles.listRowWrapTop}>
                    <View style={{flexDirection: 'row', marginBottom: 7}}>
                        <Text  allowFontScaling={false}
                               style={[styles.size15, styles.color172A4D]}>{item.name || ''}</Text>
                        <Text  allowFontScaling={false} style={[styles.size15, styles.color172A4D]}>/{item.denominator || 'USDT'}</Text>
                    </View>
                    <Text  allowFontScaling={false} style={[styles.colorWhite,styles.size13,((item.value[4]-item.value[1])/item.value[1]*100>-0.005 || item.value[1]===0 ) && styles.bgGreen|| styles.bgRed]}>
                        {item.value[1] === 0 || Math.abs((item.value[4]-item.value[1])/item.value[1]*100)<0.005 && ''}
                        {(item.value[4]-item.value[1])/item.value[1]*100>=0.005 && '+'}
                        {(item.value[4]-item.value[1])/item.value[1]*100<=-0.005 && '-'}
                        {item.value[1] === 0 && '0.00%' || Math.abs((item.value[4]-item.value[1])/item.value[1]*100).toFixed(2) + '%'}
                    </Text>
				</View>
                <View style={styles.listRowWrapBottom}>
                    {/*<Text  allowFontScaling={false} style={[styles.size12,((item.value[4]-item.value[1])/item.value[1]*100>-0.005 || item.value[1]===0 )&& styles.bgGreen|| styles.bgRed]}>{this.$globalFunc.accFixed(item.value[4],quoteScale)}</Text>*/}
                    <Text  allowFontScaling={false} style={[styles.size13,styles.colorC5CFD5]}>{this.$globalFunc.accFixed(item.value[4],quoteScale)}</Text>
                    <Text  allowFontScaling={false} style={[styles.size12,styles.colorC5CFD5]}>{'￥'+this.$globalFunc.accFixed2(item.value[4]*(this.marketUseRate[item.denominator] || '0' )*this.exchangRateDollar || 0,2)}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	@action
	rendItemHeader = () => {
		return (
			!(this.props.page && this.props.page === 'OneHome') &&
			<View style={[styles.listTitleWrap,this.props.area && this.props.area == 'weimi' && {backgroundColor:StyleConfigs.sectTitleColor} || {}]}>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle1]}>名称 / 成交量</Text>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle2]}>最新价</Text>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle3]}>24h涨跌</Text>
			</View>
			|| null
		)
	}


	getList = () => {
		console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
		this.props.index === 0 && (this.listData = this.marketList.USDT);
		this.props.index === 1 && (this.listData = this.marketList.BTC);
		this.props.index === 2 && (this.listData = this.marketList.ETH);
		this.props.index === 3 && (this.listData = this.marketList.BDB);
		this.props.index === 4 && (this.listData = this.marketList.USDT);
		return this.listData
	}


	render() {

	    // let sectionData = this.dataList.length && [{data:(this.dataList || []).slice(),key:'dataList',tradeLObj:this.tradeLObj}] || []

		return (
			<View style={styles.container}>
				{
                    this.dataList.length > 0 && <Text style={styles.goTradeText}>
                        去交易
                    </Text>
				}

			<View style={styles.listView}>

				{/*<FlatList
					style={styles.container}
					data={this.dataList || []}
					renderItem={this.listRenderRow}
					keyExtractor={(item, index) => index.toString()}
					ListHeaderComponent={this.rendItemHeader}

					initialNumToRender={9}
					getItemLayout={(data, index) => ( {length: getHeight(120), offset: getHeight(120)* index, index})}
				/>*/}

                {/*<SectionList*/}
                    {/*showsVerticalScrollIndicator={false}*/}
                    {/*style={styles.container}*/}
                    {/*stickySectionHeadersEnabled={true}*/}
                    {/*renderItem={this.listRenderRow}*/}
                    {/*renderSectionHeader={this.rendItemHeader}*/}
                    {/*keyExtractor = {(item,index) => this.props.index+'_'+index.toString()}//由于4个tab页会一起渲染，所以加上this.props.index*/}
                    {/*sections={*/}
                        {/*sectionData*/}
                    {/*}*/}
                    {/*initialNumToRender={9}*/}
                    {/*// getItemLayout={(data, index) => ( {length: getHeight(120), offset: getHeight(120)* index, index})}*/}
                    {/*ListEmptyComponent={this._renderEmptyComponent}*/}

                {/*/>*/}


				{this.dataList.map((v,i)=>{
                    return this.listRenderRow(v,i)
				})}

			</View>
            </View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	listView: {
        width: '100%',
		// height: getWidth(220),
		// marginTop: getHeight(20),
		backgroundColor: StyleConfigs.bgColor,
		flexDirection:'row',
		justifyContent:'space-between',
		// alignItems:'center'
	},
	listTitleWrap: {
		width:'100%',
		height: getHeight(60),
		borderBottomWidth: 1,
		borderBottomColor: StyleConfigs.listSplitlineColor,
        backgroundColor: StyleConfigs.bgColor,
        flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getWidth(20),
		paddingRight: getWidth(20)
	},
	listTitleBase: {
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txt9FA7B8
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
	    flex:0.485,
		height:60,
		backgroundColor:StyleConfigs.bgF7F7FB,
		// borderBottomWidth: StyleSheet.hairlineWidth,
		// borderBottomColor: StyleConfigs.listSplitlineColor,
		// flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
		paddingHorizontal: getWidth(18),
		paddingVertical: getWidth(22)
	},
    listRowWrapBorder:{
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: StyleConfigs.borderBottomColor,
    },
    listRowWrapTop:{
	    // height:62,
		width:'100%',
		flexDirection:'row',
		justifyContent:'space-between'
    },
    listRowWrapBottom:{
        width:'100%',
        // height:62,
        flexDirection:'row',
        justifyContent:'space-between',
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


	size12: {fontSize: StyleConfigs.fontSize12},
	size13: {fontSize: StyleConfigs.fontSize13},
	size14: {fontSize: StyleConfigs.fontSize14},
	size15: {fontSize: StyleConfigs.fontSize15},
	size16: {fontSize: StyleConfigs.fontSize16},
	size18: {fontSize: StyleConfigs.fontSize18},
	color172A4D: {color: StyleConfigs.txt172A4D},
	colorWhite: {color: StyleConfigs.txtWhite},
	color40: {color: StyleConfigs.txt9FA7B8},
	colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
	colorGreen: {color: StyleConfigs.btnGreen},
	colorRed: {color: StyleConfigs.btnRed},
	bgGreen: {color: '#86CB12'},
	bgRed: {color: '#F60076'},
	row3Btn: {
		width: getWidth(156),
		height: getHeight(58),
		borderRadius: StyleConfigs.borderRadius,
		alignItems: 'center',
		justifyContent: 'center'
	},

    fontWeight:{
        fontWeight:'bold'
    },
    emptyIcon: {
        width:getWidth(300),
        height:getWidth(300)
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:getHeight(300),
        paddingBottom:getHeight(200)

    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    },
    moreBar:{
        width:'100%',
        height:getHeight(78),
        alignItems:'center',
        justifyContent:'center'
    },
    moreBarText:{
        color:StyleConfigs.txt9FA7B8,
        fontSize: 14
    },
    kilneImg:{
	    width:getWidth(120),
	    height:getWidth(60)
    },
    goTradeText:{
        width:'100%',
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize13,
        marginTop:23,
        marginBottom:14,
        fontWeight:'bold'
    },
});
