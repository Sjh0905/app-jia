
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
    WebView,
    FlatList,
    Keyboard,
    SectionList,
    Platform, AsyncStorage, ImageBackground
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import BaseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import BaseTabView from './baseComponent/BaseTabView'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Toast from 'react-native-root-toast'
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
// import changeSymbolIcon from '../assets/DealPage/change-symbol.png'
// import klineIcon from '../assets/DealPage/kline.png'
// import moreIcon from '../assets/DealPage/more.png'
// import buyGray from '../assets/DealPage/buy-gray.png'
// import sellGray from '../assets/DealPage/sell-gray.png'
// import buySelected from '../assets/DealPage/buy-selected.png'
// import sellSelected from '../assets/DealPage/sell-selected.png'
// import buyBtn from '../assets/DealPage/buy-btn.png'
// import sellBtn from '../assets/DealPage/sell-btn.png'
// import depthDefault from '../assets/DealPage/depth-default.png'
// import triangleDown from '../assets/DealPage/triangle-down.png'
// import triangleUp from '../assets/DealPage/triangle-up.png'
// import depthBuy from '../assets/DealPage/depth-buy.png'
// import depthSell from '../assets/DealPage/depth-sell.png'
// import allOrderIcon from '../assets/DealPage/all-order-icon.png'
// import device from "../configs/device/device";
// import Loading from './baseComponent/Loading'
// import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
// import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
// import BaseDefaultBar from './baseComponent/BaseDefaultBar'
// import GestureProgressBar from './GestureProgressBar'
// import signBaseStyles from "../style/SignBaseStyle";
// import BaseButton from "./baseComponent/BaseButton";
import styles from "../style/DealPageStyle"
import ModalDropdown from 'react-native-modal-dropdown';
import DealPageDropDownStyle from "../style/DealPageDropDownStyle"
// const WEBVIEWRESOURCE = {
//     uri: ''
// }

// const WEBVIEWRESOURCE = require('../assets/chart/chart/index_min.html');

const WEBVIEWRESOURCE = Platform.select({
    ios: require('../assets/chart/chart/index_min.html'),
    android: __DEV__ && require('../assets/chart/chart/index_min.html') || {uri:"file:///android_asset/chart/chart/index_min.html"},
});
const loadingImg = require('../assets/TraddingHall/gif.gif');

let bar = new Promise(function(resolve){});
let loadBar = function(){
    return bar;
}

@observer
export default class CurrentOrder extends RNComponent {


    constructor(){
        super();
        this.state = {
            refreshing:false
        }
        console.log('deal只需要渲染一次',3);
    }

    @computed get tradeLObj() {
        return this.$store.state.tradeList || {};
    }


    componentDidMount() {
        this.getOrder()
        this.listen({key: 'RE_CURRCENY_ORDER', func: this.getOrder});

    }
    // 列表为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
            </View>
        )
    }


    @action
    listRenderRow = ({item, index}) => {

        let rowData = item
        //价格精度显示
        let quoteScale = this.tradeLObj[rowData.symbol] ? (this.tradeLObj[rowData.symbol].quoteScale || 8) : 8
        // let followText = rowData.isFollow ? '跟单' : ''
        // let orderTypeTextMap = {
        //     'BUY_LIMIT':'限价买入',
        //     'SELL_LIMIT':'限价卖出',
        //     'BUY_MARKET':'市价买入',
        //     'SELL_MARKET':'市价卖出'
        // }

        return (
            <View style={{
                height: getDealHeight(203),
                borderBottomColor: StyleConfigs.borderBottomColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
                paddingLeft: getWidth(30),
                paddingRight: getWidth(30),
                paddingVertical: getHeight(20),
                // flexDirection: 'row',
                // alignItems: 'center'
            }}
            >
                <View style={[BaseStyles.flexRowBetween,styles.itemLineTop]}>
                    <View style={[BaseStyles.flexRowBetween,styles.itemLineTopLeft]}>
                        <Text style={[rowData.type.indexOf('BUY') > -1  && styles.colorGreen || styles.colorRed, styles.size16]}>
                            {this.$globalFunc.getOrderTypeText(rowData)}</Text>
                        <Text style={[styles.size12,styles.color6B7DA2,{marginLeft:5}]}>{this.$globalFunc.formatDateUitl(rowData.createdAt, 'MM-DD hh:mm')}</Text>
                    </View>
                    <TouchableOpacity  style={styles.chedanTouch} onPress={() => this.cancelOrder(rowData, index)}>
                        <Text style={[{color:StyleConfigs.txtBlue},styles.size12]}>撤单</Text>
                    </TouchableOpacity>
                </View>

                <View style={[BaseStyles.flexRowBetween,styles.itemLineBot]}>
                    <View>
                        <Text style={styles.itemSectionTitle}>价格({rowData.symbol.split('_')[1]})</Text>
                        <Text style={styles.itemSectionNum}>{this.$globalFunc.accFixed(rowData.price,quoteScale)}</Text>
                    </View>
                    <View>
                        <Text style={styles.itemSectionTitle}>数量({rowData.symbol.split('_')[0]})</Text>
                        <Text style={styles.itemSectionNum}>{rowData.amount}</Text>
                    </View>
                    <View>
                        <Text style={styles.itemSectionTitle}>成交量({rowData.symbol.split('_')[0]})</Text>
                        <Text style={styles.itemSectionNum}>{rowData.filledAmount}</Text>
                    </View>
                </View>


                {/*<View style={styles.rowV1}>*/}
                    {/*<View style={{marginBottom: 5}}>*/}
                        {/*<View style={{flexDirection: 'row'}}>*/}
                            {/*<View style={rowData.type === 'BUY_LIMIT' && styles.ballGreen || styles.ballRed}><Text allowFontScaling={false}*/}
                                {/*style={[styles.color100, styles.size12]}>{rowData.type === 'BUY_LIMIT' && '买' || '卖'}</Text>*/}
                            {/*</View><Text allowFontScaling={false}*/}
                            {/*style={[styles.color172A4D, styles.size15]}>{rowData.symbol.split('_')[0]}</Text><Text allowFontScaling={false}*/}
                            {/*style={[styles.colorC5CFD5, styles.size13]}> / {rowData.symbol.split('_')[1]}</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    {/*<View style={{marginTop: 5}}>*/}
                        {/*<Text allowFontScaling={false}*/}
                            {/*style={[styles.colorC5CFD5, styles.size13]}>{this.$globalFunc.formatDateUitl(rowData.createdAt, 'MM-DD hh:mm:ss')}</Text>*/}

                    {/*</View>*/}
                {/*</View>*/}
                {/*<View style={styles.rowV2}>*/}
                    {/*<Text allowFontScaling={false} style={[styles.color172A4D, styles.size15]}>{this.$globalFunc.accFixed(rowData.price,quoteScale)}</Text>*/}
                {/*</View>*/}

                {/*<View style={styles.rowV3}>*/}
                    {/*<Text allowFontScaling={false} style={[styles.color172A4D, styles.size15, {marginBottom: 5}]}>{rowData.filledAmount}</Text>*/}
                    {/*<Text allowFontScaling={false} style={[styles.color9FA7B8, styles.size14, {marginTop: 5}]}>{rowData.amount}</Text>*/}
                {/*</View>*/}

                {/*<View style={styles.rowV4}>*/}
                    {/*<TouchableOpacity style={styles.chedan} onPress={() => this.cancelOrder(rowData, index)}*/}
                                      {/*/*disabled={rowData.chedan === '撤销中'}>*/}
                        {/*<Text allowFontScaling={false} style={{color: '#3576F5', fontSize: 12}}>{rowData.chedan}</Text>*/}


                    {/*</TouchableOpacity>*/}
                {/*</View>*/}


            </View>
        )
    }

    @action
    rendItemHeader = () => {
        return null
        return (
            <View style={{
                paddingLeft: getWidth(20),
                paddingRight: getWidth(20),
                flexDirection: 'row',
                alignItems: 'center',
                // borderBottomWidth:1,
                // borderBottomColor: StyleConfigs.listSplitlineColor,
                backgroundColor: StyleConfigs.sectTitleColor,
                height: getDealHeight(60)
            }}>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '34%'}]}>市场</Text>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '29%'}]}>价格</Text>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '21%'}, {textAlign: 'right'}]}>成交量 / 数量</Text>
                <Text allowFontScaling={false} style={[styles.size12, styles.color9FA7B8, {width: '16%'}, {textAlign: 'right'}]}>操作</Text>
            </View>
        )
    }


    refreshData = () =>{
        // console.warn('this is refreshing','刷新啦！');

        if(this.refreshFlag){
            this.refreshFlag = false;
            this.getOrder();
            return;
        }

    }


    @observable    clickOrder = new Set()
    @observable    currentOrder = []
    @observable    refreshFlag = true

    @observable currentOrderMap = new Map()

    getOrder() {
        if (!this.$store.state.authMessage.userId) {
            this.loading = false
            return
        }

        // this.loading = true
        this.$http.send('POST_USER_ORDERS',
            {
                bind: this,
                params: {
                    offsetId: 0,
                    limit: 20,
                    isFinalStatus: false,
                },
                callBack: this.re_getOrder,
            })
    }


    re_getOrder(data) {
        console.log('re_getOrder------', data)

        this.refreshFlag = true;
        this.currentOrderMap.clear()
        data.orders.forEach((val, key) => {
            val.chedan = '撤销'
            this.currentOrderMap.set(val.id, val)
        })
    }


    // 撤销
    @action
    cancelOrder = (order, index) => {

        let currentObj = this.currentOrderMap.get(order.id)

        currentObj.chedan = '撤销'

        currentObj = JSON.parse(JSON.stringify(currentObj))

        this.currentOrderMap.set(order.id, currentObj)


        let params = {
            targetOrderId: order.id,
            symbol: order.symbol,
            type: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY' : 'CANCEL_SELL',
            source :'iOS'
        }
        console.log('撤销参数===',params)

        this.$http.send('TRADE_ORDERS', {
            bind: this,
            params: params,
            callBack: this.re_cancelOrder,
            errorHandler: this.error_cancelOrder
        })
    }
    re_cancelOrder =  (data)=> {
        console.log("撤销返回！", data)

        setTimeout(()=>{
            Toast.show('撤销成功', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        },1000)

        setTimeout(()=>{
            this.getOrder();
        },2000)


    }

    error_cancelOrder = (data)=> {
        console.log("撤销返回_error_cancelOrder", data)

    }

    goToTrade = ()=>{
        this.notify({key: 'SET_TAB_INDEX'},0);
        this.notify({key: 'CLEAR_INPUT'},false);
    }


    render() {


        let currentOrder = [...this.currentOrderMap.values()]
        return (
            <View style={{backgroundColor:StyleConfigs.bgColor,flex:1, paddingBottom:getHeight(180)}}>
                {/*{!this.$store.state.authMessage.userId }?

				<View style={{flexDirection:'row',justifyContent:'center'}}>
					<Text allowFontScaling={false} style={[styles.size14,styles.color100]}>请登录后查看</Text>
				</View> :*/}

                {
                    this.$store.state.authMessage.userId && (!!currentOrder.length) &&
                        <View style={styles.flatBox}>

                            <SectionList
                                style={[styles.container]}
                                stickySectionHeadersEnabled={true}
                                renderItem={this.listRenderRow}
                                renderSectionHeader={() => this.rendItemHeader()}
                                keyExtractor = {(item,index) => index.toString()}
                                sections={
                                    [{data:currentOrder,key:'currentOrder'}]
                                }
                                onRefresh={this.refreshData}
                                refreshing={this.state.refreshing}
                                // getItemLayout={(data, index) => ( {length: getDealHeight(120), offset: getDealHeight(120)* index, index})}

                            />
                        </View>
                    || this.$store.state.authMessage.userId &&
                        <View style={[styles.emptyBox]}>
                            <Image source={EmptyIcon} style={styles.emptyIcon}/>
                            <Text allowFontScaling={false} style={[styles.emptyText]}>暂无订单记录</Text>
                            {/*<BaseButton*/}
                                {/*onPress={this.goToTrade}*/}
                                {/*style={[signBaseStyles.button,styles.toTradeBtn]}*/}
                                {/*textStyle={[signBaseStyles.buttonText,{fontSize:StyleConfigs.fontSize16}]}*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*text={'去交易'}*/}
                            {/*/>*/}
                        </View>
                    ||
                    null

                }

            </View>
        );
    }
}