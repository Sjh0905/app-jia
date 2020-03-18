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
    FlatList, Platform, ActivityIndicator, TouchableHighlight, SectionList, AsyncStorage,
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Fetch from '../otcProject/common/FetchUtil'
import NavHeader from './baseComponent/NavigationHeader'
import BaseStyles from '../style/BaseStyle'

import searchpng from '../assets/MarketDealList/search.png'
import up from '../assets/MarketSearch/up.png'
import down from '../assets/MarketSearch/down.png'
import Loading from "./baseComponent/Loading";

const isIOS = Platform.OS == 'ios' ? true : false

const Sleep = ms => new Promise(res=>setTimeout(res,ms));

const generReg = val =>	new RegExp(`(.*)(${val.split('').join(')(.*)(')})(.*)`, 'i')



@observer
export default class MarketCollectEdit extends RNComponent {


    @computed get allSymbols() {
		return this.$store.state.allSymbols || [];
    }

    @computed get collectionSymbols() {

        console.log('this is collectionSymbols',this.$store.state.collectionSymbols.length);

		return this.$store.state.collectionSymbols || [];
    }

    componentWillMount(){
        super.componentWillMount();

        this.listen({key: 'REFRESH_MARKET_COLLECT_EDIT', func: this.initData})

        this.initData();
    }

	componentDidMount() {
		super.componentDidMount();
	}

	@observable loading = false
	@observable listData = []

    //需要排序的数组
    @observable collectionSymbolsTemp = []
    //当前需要排序的币对
    @observable sortCurrSymbol = ''
    //选中的币对
	@observable choiceSymbols = []

    @action
    initData = ()=>{
        this.collectionSymbolsTemp = []
        this.collectionSymbols.map(v=>
            this.collectionSymbolsTemp.indexOf(v) == -1 && this.collectionSymbolsTemp.push(v)
        )
    }

	goBack = _ => this.$router.goBack();

    addCollect = _ => this.$router.push('MarketSearch');

    @action
    gotoTrade = (() => {
        let last = 0;
        return (symbol) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            this.$store.commit('SET_SYMBOL', (symbol.baseName || 'ETH') +'_' + (symbol.quoteName || 'USDT'))
            this.notify({key: 'CHANGE_SYMBOL'})

			this.$router.push('TraddingHall')
        }

    })()


    //币种排序
    orderCollect = () =>{

        //没有需要排序的币种直接返回
        if(this.collectionSymbolsTemp.toString() == this.collectionSymbols.toString()){
            this.goBack();
            return;
        }
        // this.goBack()
        this.loading = true;

        //如果没有登录本地缓存
        if(!this.$store.state.authMessage.userId){

            AsyncStorage.setItem('collectionSymbols',this.collectionSymbolsTemp.toString(),()=>{
                this.notify({key:'GET_COLLECTION_MARKET'});
                this.loading = false;
                this.$globalFunc.toast('操作成功！',{
                    duration:1000
                })
                this.goBack()
            })
            return;
        }

        this.$http.send('POST_ORDER_SYMBOL', {
            bind: this,
            params: {
                symbol: this.collectionSymbolsTemp.toString(),
            },
            callBack: this.re_orderCollect,
            errorHandler: this.error_orderCollect
        })
    }

    re_orderCollect = (data)=>{
        typeof data === 'string' && (data = JSON.parse(data))

        if(data.errorCode == 0){
            this.notify({key:'GET_COLLECTION_MARKET'})
            this.$globalFunc.toast('操作成功！',{
                duration:1000
            })

        }
        this.loading = false;
        this.goBack()

        console.log('this is collectionSymbols',this.collectionSymbols);

    }

    error_orderCollect = (err) =>{
        this.loading = false;
        console.log('opper collectionSymbols error',err);
    }

    //改变币对状态
    operCollect = (item,itemSelect)=>{

        this.loading = true;

        //如果没有登录本地缓存
        if(!this.$store.state.authMessage.userId){
            // let collectionMarket = [];
            let collectionSymbolsReplace = this.collectionSymbols.slice();

            for (let i = 0; i < this.choiceSymbols.length; i++) {
                for (let j = 0; j < collectionSymbolsReplace.length; j++) {
                    if(this.choiceSymbols[i] == collectionSymbolsReplace[j]){
                        collectionSymbolsReplace.splice(j,1);
                        break;
                    }
                }
            }

            AsyncStorage.removeItem('collectionSymbols',()=>{
                AsyncStorage.setItem('collectionSymbols',collectionSymbolsReplace.toString(),()=>{
                    this.notify({key:'GET_COLLECTION_MARKET'});
                    this.loading = false;
                    this.$globalFunc.toast('操作成功！',{
                        duration:1000
                    })
                    // this.initData();
                })
            });
            return;
        }


        console.log('this is params',{
            symbol: this.choiceSymbols.toString(),
            status: false
        });

        this.$http.send('POST_COLLECTION_SYMBOL', {
            bind: this,
            params: {
                symbol: this.choiceSymbols.toString(),
                status: false
            },
            callBack: this.re_operCollect,
            errorHandler: this.error_operCollect
        })

    }

    re_operCollect = (data)=>{
        typeof data === 'string' && (data = JSON.parse(data))

        if(data.errorCode == 0){
            this.notify({key:'GET_COLLECTION_MARKET'})
            this.$globalFunc.toast('操作成功！',{
                duration:1000
            })
            this.choiceSymbols = []
        }
        this.loading = false;

        console.log('this is collectionSymbols',this.collectionSymbols);

    }

    error_operCollect = (err) =>{
        this.loading = false;
        console.log('opper collectionSymbols error',err);
    }

    //当前要排序的币对
    longPressToSort = (item) =>{
        this.sortCurrSymbol = item;
    }

    //选择币对
    @action
    choiceSymbolsFunc = (item) => {

        let inx = this.choiceSymbols.indexOf(item)
        if(inx > -1){
            this.choiceSymbols.splice(inx,1);
            console.log('this is choiceSymbols=======',this.choiceSymbols.toString());

            return;
        }

        this.choiceSymbols.push(item);
        console.log('this is choiceSymbols=======',this.choiceSymbols.toString());

    }

    //全选
    @action
    choiceAllSymbols = ()=>{

        if(this.choiceSymbols.length == this.collectionSymbols.length){
            this.choiceSymbols = [];

            return;
        }

        this.choiceSymbols = this.collectionSymbols.slice();

        // this.collectionSymbols.map(v=>this.choiceSymbols)
    }

    @action
    sortSymbols = (item,index,direction)=>{
        var tempArr = this.collectionSymbolsTemp.slice();

        var temp = tempArr[index];
        var nextInx = index;
        direction == 'up' && (nextInx = index - 1)
        direction == 'down' && (nextInx = index + 1)

        tempArr[index] = tempArr[nextInx];
        tempArr[nextInx] = temp;

        this.collectionSymbolsTemp = tempArr;

        console.log('this is collectionSymbolsTemp',this.collectionSymbolsTemp.toString());

        // this.$store.commit('SET_COLLECTION_SYMBOLS',tempArr);
        // this.initData();
    }

	@action
	listItem = ({item, index}) => {

        if(item.name == 'choiceSymbols')return null
        // if(item.name == 'choiceSymbols')return <Text>{item.choiceSymbols.length}</Text>

        console.log('this is render listItem',item);
        var itemSelect = this.choiceSymbols.indexOf(item) > -1

        return <MarketSearchItem
					item={item}
					index={index}
					itemSelect={itemSelect}
                    choiceSymbols={this.choiceSymbols}
                    sortCurrSymbol={this.sortCurrSymbol}
                    total={this.collectionSymbols.length}
					sortSymbols={this.sortSymbols}
                    choiceSymbolsFunc={this.choiceSymbolsFunc}
                    longPressToSort={this.longPressToSort}
				/>

	}

	render() {
        console.log('this is render collectionSymbols',this.collectionSymbols);

        var choiceSymbols = [...new Set(this.choiceSymbols)];

		return (

			<View style={styles.container}>
				{/*<View style={[styles.IOSStatusBar, !isIOS && styles.androidStatusBar]}></View>*/}
                <NavHeader
                    headerTitle={'编辑自选区'}
                    headerLeftTitle={'添加'}
                    headerLeftOnPress={this.addCollect}
                    headerRightTitle={'完成'}
                    headerRightOnPress={this.orderCollect}
                    leftTitleStyle={{color:StyleConfigs.txt172A4D}}
                    rightTitleStyle={{color:StyleConfigs.txtBlue}}
                />

                {/*不明白为什么换成FlatList就不能触发renderItem重新渲染了*/}
                {/*<FlatList data={this.collectionSymbolsTemp || []}*/}
						  {/*renderItem={this.listItem}*/}
						  {/*keyExtractor={(item, index) => index.toString()}*/}
                {/*/>*/}

                <View style={[BaseStyles.flexRowBetween,styles.tipsBox]}>
                    <Text style={styles.tipsText}>币种</Text>
                    <Text style={styles.tipsText}>长按排序</Text>
                </View>

                {/*多写一行'name':'choiceSymbols'的数据是为了保证能重新渲染*/}
                <SectionList
                    renderItem={this.listItem}
                    // renderSectionHeader={this.renderSecHeader}
                    sections={[
                        {data:[{'name':'choiceSymbols',choiceSymbols:this.choiceSymbols,
                                sortCurrSymbol:this.sortCurrSymbol,total:this.collectionSymbols.toString()
                        }],key:'choiceSymbols'},
                        {data:this.collectionSymbolsTemp.slice() || [],key:'dataList'}
                    ]}
                    keyExtractor={(item, index) => index.toString()}
                    stickySectionHeadersEnabled={false}
                />
                <View style={{width: '100%', height:getHeight(100),}}/>

                <View style={styles.btnBotBox}>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={[BaseStyles.flexRowBetween,styles.choiceAllBox]} onPress={this.choiceAllSymbols}>
                        <View style={styles.radioBorder}>
                            {(this.collectionSymbols.length > 0 && this.choiceSymbols.length == this.collectionSymbols.length) &&
                            <View style={styles.radioSelect}></View> || null}
                        </View>
                        <Text allowFontScaling={false} style={{color: StyleConfigs.txt172A4D, fontSize: 15}}>全选</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={[BaseStyles.flexRowBetween,styles.choiceAllBox,{flexDirection:'row-reverse',width:50}]}
                        onPress={this.operCollect}
                    >

                        {this.choiceSymbols.length > 0 &&
                        <Text allowFontScaling={false} style={[styles.deleteText,{color: StyleConfigs.txtBlue}]}>删除</Text>
                        ||
                        <Text allowFontScaling={false} style={styles.deleteText}>删除</Text>
                        }
                    </TouchableOpacity>
                </View>

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }

			</View>
		)
	}
}

@observer
class MarketSearchItem extends RNComponent {
	render(){
		var item = this.props.item;
        var index = this.props.index;
        var total = this.props.total;
        var itemSelect = this.props.itemSelect;
        var choiceSymbols = this.props.choiceSymbols;
        var sortCurrSymbol = this.props.sortCurrSymbol;
        console.log('this is MarketCollectEdit collectionSymbolsTemp',item);

        return (
            <TouchableHighlight underlayColor={StyleConfigs.bgF7F8FA}
                                onPress={() => {
                                    this.props.choiceSymbolsFunc(item)
                                }}
                                onLongPress={() => {
                                    // this.props.sortCurrSymbol = item;
                                    this.props.longPressToSort(item)
                                }}
            >
                <View style={[styles.listRowWrap,{height:getHeight(111)}]}>
                    {/*操作按钮*/}
                    <View style={[styles.rowBase, styles.row1]}>
                        <View style={styles.radioBorder}>
                            {choiceSymbols.indexOf(item) > -1 &&<View style={styles.radioSelect}></View> || null}
                        </View>
                    </View>
                    <View style={[styles.rowBase, styles.row2]}>
                        <Text  allowFontScaling={false} style={[styles.size15, styles.color172A4D,styles.fontWeight]}>{item}</Text>
                    </View>

                    {sortCurrSymbol == item &&
                        <View style={[styles.rowBase, styles.row3]}>
                            {index != 0 &&
                            <TouchableOpacity style={[styles.row3Item]} activeOpacity={StyleConfigs.activeOpacity}
                                              onPress={() => this.props.sortSymbols(item,index,'up')}>
                                <Image style={styles.selectImg} source={up}/>
                            </TouchableOpacity> ||
                            <View style={[styles.row3Item]}/>
                            }
                            {index != total - 1 &&
                            <TouchableOpacity style={[styles.row3Item]}  activeOpacity={StyleConfigs.activeOpacity}
                                              onPress={() => this.props.sortSymbols(item,index,'down')}>
                                <Image style={styles.selectImg} source={down}/>
                            </TouchableOpacity>
                            ||
                            <View style={[styles.row3Item]}/>
                            }
                        </View>
                        ||
                        null
                    }

                </View>
            </TouchableHighlight>
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
	},

    selectImg:{
	    opacity:0.7,
        width:getWidth(52),
        height:getWidth(52),
	},
    listRowWrap: {
        height: getHeight(110),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: StyleConfigs.listSplitlineColor,
        flexDirection: 'row',
		justifyContent:'space-between',
        alignItems: 'center',
        paddingLeft: getWidth(30),
        // paddingRight: getWidth(30)
    },
    rowBase: {
        height:'100%',
        justifyContent: 'center',
    },
    row1: {
        // width: '38%'
        width:30,
    },
    row2: {
        // width: (DeviceWidth - 180),
        flex:1
    },
    row3: {
        width: 120,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
		// backgroundColor:'green',
        paddingRight: getWidth(30)
    },


    size10: {fontSize: StyleConfigs.fontSize10},
    size12: {fontSize: StyleConfigs.fontSize12},
    size13: {fontSize: StyleConfigs.fontSize13},
    size14: {fontSize: StyleConfigs.fontSize14},
    size15: {fontSize: StyleConfigs.fontSize15},
    size16: {fontSize: StyleConfigs.fontSize16},
    color100: {color: StyleConfigs.txt172A4D},
    color172A4D: {color: StyleConfigs.txt172A4D},
    colorB5BCC6: {color: StyleConfigs.txtB5BCC6},
    color8994A5: {color: StyleConfigs.txt8994A5},
    colorWhite: {color: StyleConfigs.txtWhite},
    color40: {color: StyleConfigs.txt9FA7B8},
    colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
    colorGreen: {color: StyleConfigs.btnGreen},
    colorRed: {color: StyleConfigs.btnRed},
    bgGreen: {backgroundColor: '#34A753'},
    bgRed: {backgroundColor: '#EF5656'},
    row3Btn: {
        width: getWidth(160),
        height: getHeight(66),
        borderRadius: StyleConfigs.borderRadius1,
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
    radioBorder:{
        width: getHeight(30),
        height: getHeight(30),
        justifyContent:'center',
        alignItems:'center',
        marginRight:getWidth(10),
        borderStyle: 'solid',
        borderWidth:getWidth(4),
        borderColor:StyleConfigs.borderE8EBEE
    },
    radioSelect:{
        width:getWidth(14),
        height:getWidth(14),
        backgroundColor:StyleConfigs.txtBlue
    },
    row3Item:{
	    width:'50%',
        height:'100%',
        alignItems:'flex-end',
        justifyContent:'center',
        // backgroundColor:'green'
    },
    btnBotBox:{
        width: '100%',
        height:getHeight(100),
        position: 'absolute',
        paddingBottom: getHeight(getDeviceTop(true) + 10),
        paddingTop:getHeight(10),
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:StyleConfigs.bgF2FFFFFF,
        alignItems:'center',
        paddingHorizontal:getWidth(30),
        shadowColor:  StyleConfigs.borderShadowColor,
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 5//安卓专用
    },
    choiceAllBox:{
	    height:'100%',
        width:80,
        justifyContent:'flex-start'
    },
    deleteText:{
        color: StyleConfigs.txt8994A5,
        fontSize: 15,
    },
    tipsBox:{
        marginHorizontal:getWidth(30),
        paddingVertical:getHeight(20),
        borderBottomColor:StyleConfigs.borderC8CFD5,
        borderBottomWidth:StyleSheet.hairlineWidth
    },
    tipsText:{
        color:StyleConfigs.txt8994A5,
        fontSize:StyleConfigs.fontSize12,
    },
});

