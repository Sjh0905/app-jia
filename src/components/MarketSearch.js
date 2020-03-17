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

import searchpng from '../assets/MarketDealList/search.png'
import unselect from '../assets/MarketSearch/symbol_unselect.png'
import select from '../assets/MarketSearch/symbol_select.png'
import Loading from "./baseComponent/Loading";

const isIOS = Platform.OS == 'ios' ? true : false

const Sleep = ms => new Promise(res=>setTimeout(res,ms));

const generReg = val =>	new RegExp(`(.*)(${val.split('').join(')(.*)(')})(.*)`, 'i')



@observer
export default class MarketSearch extends RNComponent {


    @computed get allSymbols() {
		return this.$store.state.allSymbols || [];
    }

    @computed get collectionSymbols() {

        console.log('this is collectionSymbols',this.$store.state.collectionSymbols.length);

		return this.$store.state.collectionSymbols || [];
    }

	componentDidMount() {
		super.componentDidMount();
	}

	@observable loading = false
	@observable listData = []

	@observable result = []
	@observable textInput = ''

	@observable collectionSymbolsTemp = ''


	goBack = _ => this.$router.goBack();


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



    textChange = text =>{
		Sleep(200);
		this.textInput = text;
		if(this.textInput){
			this.result = this.allSymbols.filter(v=>v.name.includes(this.textInput) || v.name.includes(this.textInput.toUpperCase()))
		}
	}

    operCollect = (item,itemSelect)=>{

        console.log('修改自选币种状态',{
                symbol: item.name,
                status: !itemSelect
        });

        this.loading = true;

        //如果没有登录本地缓存
        if(!this.$store.state.authMessage.userId){
            let collectionMarket = [];

            // 如果是增加
            if (!itemSelect) {
                collectionMarket = this.$globalFunc.addArray(item.name,(this.collectionSymbols || []).slice())
            }
            // 如果是减少
            if (itemSelect) {
                collectionMarket = this.$globalFunc.removeArray(item.name, (this.collectionSymbols || []).slice())
            }

            AsyncStorage.setItem('collectionSymbols',collectionMarket.toString(),()=>{
                this.notify({key:'GET_COLLECTION_MARKET'});
                this.loading = false;
                this.$globalFunc.toast('操作成功！',{
                    duration:1000
                })
            })
            return;
        }


        this.$http.send('POST_COLLECTION_SYMBOL', {
        	bind: this,
            params: {
                symbol: item.name,
                status: !itemSelect
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
		}
        this.loading = false;

        console.log('this is collectionSymbols',this.collectionSymbols);

	}

    error_operCollect = (err) =>{
        this.loading = false;
        console.log('opper collectionSymbols error',err);
	}


	@action
	listItem = ({item, index}) => {

		var itemSelect = this.collectionSymbols.indexOf(item.name) > -1
        return <MarketSearchItem
					item={item}
					index={index}
					itemSelect={itemSelect}
					gotoTrade={this.gotoTrade}
                    operCollect={this.operCollect}
				/>

	}

	render() {
		// console.log('this.allSymbols======',this.allSymbols);
        console.log('this is render collectionSymbols',this.collectionSymbols);

        this.collectionSymbolsTemp = [...new Set(this.collectionSymbols)];

        let dataList = this.textInput?this.result:this.allSymbols.slice()

		return (

			<View style={styles.container}>
				<View style={[styles.IOSStatusBar, !isIOS && styles.androidStatusBar]}></View>
				<View style={styles.headerWrap}>
					<View style={styles.iptWrap}><Image style={styles.img} source={searchpng}/>
					<TextInput style={styles.input} placeholder={'搜索币种'} maxLength={16} placeholderTextColor={'#8994A5'} underlineColorAndroid={'transparent'} onChangeText={this.textChange} value={this.traditionInputText} /></View>
					<TouchableOpacity onPress={this.goBack}><Text style={styles.text14Gray}>取消</Text></TouchableOpacity>
				</View>
                {/*不明白为什么换成FlatList就不能触发renderItem重新渲染了*/}
				{/*<FlatList data={dataList || []}*/}
						  {/*renderItem={this.listItem}*/}
						  {/*keyExtractor={(item, index) => index.toString()}*/}
				{/*/>*/}

                <SectionList
                    renderItem={this.listItem}
                    // renderSectionHeader={this.renderSecHeader}
                    sections= {[{data:dataList,key:'123'}]}
                    keyExtractor={(item, index) => index.toString()}
                    stickySectionHeadersEnabled={false}
                />

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
		let item = this.props.item;
		let itemSelect = this.props.itemSelect;
        // console.log('this is MarketSearchItem collectionSymbolsTemp',item);

        return (
            <TouchableHighlight underlayColor={StyleConfigs.bgF7F8FA} onPress={() => this.props.gotoTrade(item)}>
                <View style={[styles.listRowWrap,{height:getHeight(111)}]}>
                    <View style={[styles.rowBase, styles.row1]}>
                        {/*<View style={{flexDirection: 'row'}}>*/}
                        <Text  allowFontScaling={false} style={[styles.size15, styles.color172A4D,styles.fontWeight]}>{item.baseName + '/' +item.quoteName}</Text>
                        {/*</View>*/}
                    </View>
                    <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={() => this.props.operCollect(item,itemSelect)} style={[styles.rowBase,styles.row3]}>

                        {itemSelect &&
                        <Image style={styles.selectImg} source={select}/>
                        ||
                        <Image style={styles.selectImg} source={unselect}/>
                        }

                    </TouchableOpacity>
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
        width:getWidth(24),
        height:getWidth(24),
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
    rowBase: {},
    row1: {
        width: '38%'
    },
    row2: {
        width: '37%'
    },
    row3: {
		height:'100%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'flex-end',
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
    bgGreen: {backgroundColor: '#02987D'},
    bgRed: {backgroundColor: '#C73F4F'},
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
});

