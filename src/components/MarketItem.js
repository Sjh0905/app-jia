/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    ListView,
    TouchableOpacity,
    FlatList,
    SectionList,
    TouchableHighlight
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'

import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'

@observer
export default class MarketItem extends RNComponent {

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

    //挖矿区
    @computed get innovationZoneSymbol() {
    	return this.$store.state.innovationZoneSymbol || []
	}

	//整理成线性数据字典，供处理收藏区、挖矿区使用
    @computed get handleMarketObj() {
    	let obj = {};
        Object.keys(this.marketList).forEach(key=>{
        	let arr = this.marketList[key] || [];

        	arr.forEach((v,i)=>{
                let symbol = v.name +'_' + v.denominator
        		obj[symbol] = v

                // if(this.innovationZoneSymbol.indexOf(symbol) > -1){
                // 	//目的是剔除marketList中一条要在挖矿区展示的数据
                //     arr.splice(i,1)
                // }
        	})
		})

		return obj || {}
	}

    @computed get collectionSymbolsMarketList() {
        console.log('this is MarketItem collectionSymbols',this.$store.state.collectionSymbols.toString());
        let collectionMarketList = [];
        let collectionSymbols = this.$store.state.collectionSymbols || [];

        collectionSymbols.forEach(v=>{
            collectionMarketList.push(this.handleMarketObj[v] || {});
		})
        return collectionMarketList
    }

    @computed get innovationZoneSymbolMarketList() {
        let innovationZoneMarketList = [];

        this.innovationZoneSymbol.forEach(v=>{
            innovationZoneMarketList.push(this.handleMarketObj[v] || {});
        })

        return innovationZoneMarketList;
	}

    @observable rate = 0


	@computed get dataList() {
			var data = [];
			/*this.props.index === 0 && (data = this.marketList.USDT && this.marketList.USDT.filter(v => v.honeyArea !== 'true') || []);//honeyArea用来区分是不是为蜜区币对
			this.props.index === 1 && (data = this.marketList.BTC);
			this.props.index === 2 && (data = this.marketList.ETH);
			this.props.index === 3 && (data = this.marketList.BDB);
			this.props.index === 4 && (data = this.marketList.USDT && this.marketList.USDT.filter(v => v.honeyArea === 'true') || []);
			this.props.index === 5 &&
            this.mainPageSymbol.length && this.mainPageSymbol.forEach(v => {
				v = v.split('_');
                this.marketList && this.marketList[v[1]] && this.marketList[v[1]].length && this.marketList[v[1]].forEach((val,inx) => {
					val.name === v[0] && val.honeyArea !== 'true' && data.push(this.marketList[v[1]][inx])
				})
			});*/


		//oneHome ,展示所有市场
		// 只页显示价格非零的币对

		if(this.props.page === 'OneHome'){
			Object.keys(this.marketList).forEach(key=>{
				let item = (this.marketList[key] instanceof Array) && this.marketList[key].slice() || []
				data = data.concat(item)

				data = data.sort((a,b)=>!b.value[4] && b.value[4] - a.value[4]).filter(v=>v.value[4] !=0)
			})
		}


		// 市场页 ,显示单一市场
		// 价格 非零币对在前  价格为零币对在后


		if(this.props.page !== 'OneHome'){
			this.props.index === 0 && (data = this.marketList.USDT || []);
			this.props.index === 6 && (data = this.marketList.ENX || []);
			// data = data.sort((a,b)=>!b.value[4] && b.value[4] - a.value[4])

			let a1 = []
			let a2 = []
			data.length && data.forEach((item) => Number(item.value[4]) > 0 && a1.push(item) || (a2.push(item)))
			data  = [...a1, ...a2]

            this.props.index === 7 && (data = this.collectionSymbolsMarketList);//收藏的币对
            this.props.index === 8 && (data = this.innovationZoneSymbolMarketList);//挖矿区币对
        }




		return data || []
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
			// console.log('temp==symbol====', symbol)

			this.$store.commit('SET_SYMBOL', (symbol.name || 'ETH') +'_' + (symbol.denominator || 'USDT'))
			// console.log('this.$store.state.symbol',this.$store.state.marketPriceMerge)
			this.notify({key: 'CHANGE_SYMBOL'})

			//传递时价过去，延迟是为了等待priceNow有数据
			setTimeout(()=>{
                let quoteScale = this.tradeLObj[symbol.name+"_"+symbol.denominator] ? (this.tradeLObj[symbol.name+"_"+symbol.denominator].quoteScale || 8) : 8
                let price = this.priceNow.price && this.marketUseRate[symbol.denominator] && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate[symbol.denominator]) || 0, quoteScale) || (symbol.value && symbol.value[4] || '');
                this.notify({key: 'CLEAR_INPUT'},false,price);

            },500)

            if(this.props.goRouter){
                this.$router.push('TraddingHall')
				return;
			}

			this.$router.goBack()
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
	listRenderRow = ({item}) => {
    	// console.log(this.props.index,JSON.stringify(item))

    	if((this.props.index != 8 && this.props.index != 7) && this.innovationZoneSymbol.indexOf(item.name+"_"+item.denominator) > -1)return null
		if(!item.value)return null

    	//价格精度显示
    	let quoteScale = this.tradeLObj[item.name+"_"+item.denominator] ? (this.tradeLObj[item.name+"_"+item.denominator].quoteScale || 8) : 8

		return (
			//首页
            this.props.index === 5 &&
			<TouchableHighlight underlayColor={StyleConfigs.bgF7F8FA} onPress={() => this.gotoTrade(item)}>
				<View style={[styles.listRowWrap,{height:getHeight(111)}]}>
					<View style={[styles.rowBase, styles.row1]}>
						<View style={{flexDirection: 'row'}}><Text  allowFontScaling={false}
							style={[styles.size15, styles.color172A4D]}>{item.name || ''}</Text><Text  allowFontScaling={false}
							style={[styles.size10, styles.colorA2B5D9,{marginTop:5}]}> / {item.denominator || 'ETH'}</Text></View>
						{/*<View style={{marginTop: 2.5}}><Text  allowFontScaling={false}*/}
							{/*style={[styles.size13, styles.color40]}>成交量 {Math.floor(item.value[5])}</Text></View>*/}

					</View>
					<View style={[styles.rowBase,styles.row2]}>
						<View>
							<Text  allowFontScaling={false} style={[styles.fontWeight,styles.size15,((item.value[4]-item.value[1])/item.value[1]*100>-0.005 || item.value[1]===0 )&& styles.color172A4D|| styles.color172A4D]}>{this.$globalFunc.accFixed(item.value[4],quoteScale)}</Text>
							{/*<Text  allowFontScaling={false} style={[styles.size13,styles.color40,{marginTop:2.5}]}>¥{this.$globalFunc.accFixed2(item.value[4]*(this.marketUseRate[item.denominator] || '0' )*this.exchangRateDollar || 0,2)}</Text>*/}
						</View>
					</View>
					<View style={[styles.rowBase,styles.row3]}>
						<View style={[styles.row3Btn,((item.value[4]-item.value[1])/item.value[1]*100>-0.005 || item.value[1]===0 ) && styles.bgGreen|| styles.bgRed]}>
							<Text  allowFontScaling={false} style={[styles.colorWhite,styles.size14,{lineHeight:getHeight(58)},PlatformOS == 'ios' && {} || {paddingBottom:1}]}>
								{item.value[1] === 0 || Math.abs((item.value[4]-item.value[1])/item.value[1]*100)<0.005 && ''}
								{(item.value[4]-item.value[1])/item.value[1]*100>=0.005 && '+'}
								{(item.value[4]-item.value[1])/item.value[1]*100<=-0.005 && '-'}
								{item.value[1] === 0 && '0.00%' || Math.abs((item.value[4]-item.value[1])/item.value[1]*100).toFixed(2) + '%'}
								{/*	{item.value[1] === 0 || item.value[4]-item.value[1] <= 0 ? '':'+' }
								{item.value[1] === 0 ? '0%' : ((item.value[4]-item.value[1])/item.value[1]*100).toFixed(2) + '%'}*/}
							</Text>
						</View>

					</View>


				</View>
            </TouchableHighlight>
			||
            <TouchableHighlight underlayColor={StyleConfigs.bgF7F8FA} onPress={() => this.gotoTrade(item)}>
				<View style={styles.listRowWrap}>
					<View style={[styles.rowBase, styles.row1]}>
						<View style={{flexDirection: 'row', marginBottom: 2.5}}><Text  allowFontScaling={false}
																					   style={[styles.size16, styles.color172A4D]}>{item.name || ''}</Text><Text  allowFontScaling={false}
																																							   style={[styles.size10, styles.colorA2B5D9,{marginTop:6}]}> / {item.denominator || 'ETH'}</Text></View>
						<View style={{marginTop: 2.5}}><Text  allowFontScaling={false}
															  style={[styles.size12, styles.color6B7DA2]}>24H {Math.floor(item.value[5])}</Text></View>

					</View>
					<View style={[styles.rowBase,styles.row2]}>
						<View>
							<Text  allowFontScaling={false} style={[styles.fontWeight,styles.size16,((item.value[4]-item.value[1])/item.value[1]*100>-0.005 || item.value[1]===0 )&& styles.color172A4D|| styles.color172A4D,{marginBottom:2.5}]}>{this.$globalFunc.accFixed(item.value[4],quoteScale)}</Text>
							<Text  allowFontScaling={false} style={[styles.size12,styles.color6B7DA2,{marginTop:2.5}]}>¥{this.$globalFunc.accFixed2(item.value[4]*(this.marketUseRate[item.denominator] || '0' )*this.exchangRateDollar || 0,2)}</Text>
						</View>
					</View>
					<View style={[styles.rowBase,styles.row3]}>
						<View style={[styles.row3Btn,((item.value[4]-item.value[1])/item.value[1]*100>-0.005 || item.value[1]===0 ) && styles.bgGreen|| styles.bgRed]}>
							<Text  allowFontScaling={false} style={[styles.colorWhite,styles.size14]}>
								{item.value[1] === 0 || Math.abs((item.value[4]-item.value[1])/item.value[1]*100)<0.005 && ''}
								{(item.value[4]-item.value[1])/item.value[1]*100>=0.005 && '+'}
								{(item.value[4]-item.value[1])/item.value[1]*100<=-0.005 && '-'}


								{item.value[1] === 0 && '0.00%' || Math.abs((item.value[4]-item.value[1])/item.value[1]*100).toFixed(2) + '%'}



								{/*	{item.value[1] === 0 || item.value[4]-item.value[1] <= 0 ? '':'+' }
								{item.value[1] === 0 ? '0%' : ((item.value[4]-item.value[1])/item.value[1]*100).toFixed(2) + '%'}*/}
							</Text>
						</View>

					</View>


				</View>
			</TouchableHighlight>

		)
	}

	@action
	rendItemHeader = () => {
		return (
			!(this.props.page && this.props.page === 'OneHome') &&
			<View style={[styles.listTitleWrap,this.props.area && this.props.area == 'weimi' && {backgroundColor:StyleConfigs.sectTitleColor} || {}]}>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle1]}>名称 / 成交量</Text>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle2]}>最新价</Text>
				<Text  allowFontScaling={false} style={[styles.listTitleBase, styles.listTitle3]}>24H涨跌</Text>
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

	    let sectionData = this.dataList.length && [{data:(this.dataList || []).slice(),key:'dataList',tradeLObj:this.tradeLObj}] || []

		return (
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

                <SectionList
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                    stickySectionHeadersEnabled={true}
                    renderItem={this.listRenderRow}
                    renderSectionHeader={this.rendItemHeader}
                    keyExtractor = {(item,index) => this.props.index+'_'+index.toString()}//由于4个tab页会一起渲染，所以加上this.props.index
                    sections={
                        sectionData
                    }
                    initialNumToRender={9}
                    // getItemLayout={(data, index) => ( {length: getHeight(120), offset: getHeight(120)* index, index})}
                    ListEmptyComponent={this._renderEmptyComponent}

                />

				{
					this.props.index === 5 &&
                    <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.gotoMarket} style={styles.moreBar}>
                        <Text allowFontScaling={false} style={styles.moreBarText}>查看更多</Text>
                    </TouchableOpacity>
					||
						null
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
		backgroundColor: StyleConfigs.bgColor
	},
	listTitleWrap: {
		width:'100%',
		height: getHeight(60),
		// borderBottomWidth: 1,
		// borderBottomColor: StyleConfigs.listSplitlineColor,
        backgroundColor: StyleConfigs.bgColor,
        flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getWidth(30),
		paddingRight: getWidth(30)
	},
	listTitleBase: {
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txtA2B5D9
	},
	listTitle1: {
		width: '38%'
	},
	listTitle2: {
		width: '37%'

	},
	listTitle3: {
		width: '25%',
		textAlign: 'right'
	},
	listRowWrap: {
		height: getHeight(110),
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: StyleConfigs.listSplitlineColor,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getWidth(30),
		paddingRight: getWidth(30)
	},
	rowBase: {},
	row1: {
		width: '38%'
	},
	row2: {
		width: '37%'
	},
	row3: {
		width: '25%',
		justifyContent: 'center',
		alignItems: 'flex-end'
	},


	size10: {fontSize: StyleConfigs.fontSize10},
	size12: {fontSize: StyleConfigs.fontSize12},
	size13: {fontSize: StyleConfigs.fontSize13},
	size14: {fontSize: StyleConfigs.fontSize14},
	size15: {fontSize: StyleConfigs.fontSize15},
	size16: {fontSize: StyleConfigs.fontSize16},
	color100: {color: StyleConfigs.txt172A4D},
	color172A4D: {color: StyleConfigs.txt172A4D},
    colorA2B5D9: {color: StyleConfigs.txtA2B5D9},
    color6B7DA2: {color: StyleConfigs.txt6B7DA2},
    colorWhite: {color: StyleConfigs.txtWhite},
	color40: {color: StyleConfigs.txt9FA7B8},
	colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
	colorGreen: {color: StyleConfigs.btnGreen},
	colorRed: {color: StyleConfigs.btnRed},
	bgGreen: {backgroundColor: '#86CB12'},
	bgRed: {backgroundColor: '#F60076'},
	row3Btn: {
		width: getWidth(160),
		height: getHeight(66),
		borderRadius: StyleConfigs.borderRadius1o5,
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
        color:StyleConfigs.txtA2B5D9,
        fontSize: 14
    }
});
