/**
 * hjx 2018.4.16
 */

import React from 'react';
import {FlatList, Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetRecordsItemStyle'
import propTypes from 'prop-types'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'

import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'

const typeArr = ['recharge', 'withdrawals']

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

@observer
export default class CapitalTransferRecordsItem extends RNComponent {


    static propTypes = {
        type: propTypes.string.isRequired,
    }

    static defaultProps = {
        type: typeArr[0],
    }

    @computed get currencyJingDU(){
        return this.$store.state.currencyJingDU
    }

    @computed get userId(){
        return this.$store.state.authMessage.userId
    }

    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true

    lastId = 0;

    // 转账记录条数
    @observable
    withdrawalsLimit = 20

    withdrawalsLimitNum = 10

    // 转账记录正在加载更多
    @observable
    withdrawalsLoadingMore = false

    // 转账记录
    @observable
    withdrawalsRecords = []

    // 转账记录请求回来了
    @observable
    withdrawalsRecordsReady = false

    // 获取多少条
    @observable
    capitalTransferLimit =  10
    //分页加载步长
    @observable
    capitalTransferLimitNum =  10
    //是否Transfer获取ajax结果 默认为false
    @observable
    ajaxCapitalTransferFlag = false
    //转账记录
    @observable
    capitalTransferLists = []
    // 是否显示转账记录加载更多
    @observable
    isShowGetMoreCapitalTransfer =  true

    //转账状态
    statusObj = {
        "SUCCESS":"成功",
        "FAILED":"失败"
    }

    //划转类型 映射transferTo字段 WALLET, SPOTS, MARGIN, CONTRACTS,OTC, BINANCE;
    transferTypeMap = {
        'OTC_WALLET': '从法币到钱包',
        'WALLET_OTC':'从钱包到法币',
        'BINANCE_WALLET': '从现货到钱包',
        'WALLET_BINANCE': '从钱包到现货',
        'SPOTS_WALLET':'从现货到钱包',
        'WALLET_SPOTS':'从钱包到现货',
        'MARGIN_WALLET': '从杠杆到钱包',
        'WALLET_MARGIN': '从钱包到杠杆',
        'CONTRACTS_WALLET' : '从合约到钱包',
        'WALLET_CONTRACTS': '从钱包到合约',
        'PURCHASE': '申购',
    }

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getCapitalTransferList()
            // this.$event.listen({bind: this, key: 'GET_WITHDRAWALS_RECORDS', func: this.getWithdrawalsRecord})
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    // 列表为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox,this.props.currency && {paddingTop:getHeight(190) || {}}]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
            </View>
        )
    }

    // 获取内部转账记录
    getCapitalTransferList = function () {
        if(this.ajaxCapitalTransferFlag === true){
            return;
        }
        this.ajaxCapitalTransferFlag = true

        this.$http.send("GET_TRANSFER_SPOT_LIST", {
            bind: this,
            query:{
                status:0,//0全部，1 失败，2 成功
                currency:'',
                pageSize:this.capitalTransferLimit
            },
            callBack: this.re_getCapitalTransferList,
            errorHandler: this.error_getCapitalTransferList
        })
    }
    // 获取内部转账记录返回，类型为{}
    re_getCapitalTransferList = function (data) {
        // data = {
        //   "dataMap": {
        //   "userTransferRecordList": [
        //     {
        //       "amount": 99102492.29972367,
        //       "createdAt": -67236617.9753992,//是毫秒
        //       "currency": "EOS",
        //       "dateTime": "do proident ex aute",
        //       "description": "ut consequat",
        //       "fee": 59822729.33552468,//还有手续费？×多余预留字段
        //       "flowType": "ipsum",
        //       "fromEmail": "proident",
        //       "fromUserId": 100002,
        //       "id": 19424641.65654689,
        //       "name": "jack",
        //       "status": "SUCCESS",
        //       "toEmail": "enim pariatur",
        //       "toUserId": 17017505.532742217,
        //       "transferId": "20200123143701",
        //       "updatedAt": 1578226647197,
        //       "version": 44518193.95575386
        //     },
        //     {
        //       "amount": 38305184.36958821,
        //       "createdAt": 50407408.0127503,
        //       "currency": "USDT",
        //       "dateTime": "ut eu aliqua nisi",
        //       "description": "velit proident",
        //       "fee": 5515030.240045607,
        //       "flowType": "eiusmod exercitation est culpa mollit",
        //       "fromEmail": "dolore proident adipisicing",
        //       "fromUserId": 10003,
        //       "id": 98574061.35561192,
        //       "name": "tom",
        //       "status": "FAILED",
        //       "toEmail": "aute reprehenderit",
        //       "toUserId": -61289931.75798434,
        //       "transferId": "20200123143702",
        //       "updatedAt": 1578208180984,
        //       "version": 16172230.43511355
        //     }
        //   ]
        // },
        //   "errorCode": -44435161.791536435,
        //   "result": "ut"
        // }

        this.ajaxCapitalTransferFlag = false
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || !data.dataMap) return
        console.log('获取划转记录', data)
        this.capitalTransferLists = data.dataMap.userTransferRecordList || []

        // if (this.capitalTransferLists.length < this.capitalTransferLimit){
        //     this.isShowGetMoreCapitalTransfer = false
        // } else {
        //
        // }
    }
    // 获取记录出错
    error_getCapitalTransferList = function (err) {
        console.warn("转账获取记录出错！", err)
    }

    // 渲染footer组件
    @action
    _capitalTransferFooterComponent = () => {
        if (this.capitalTransferLists.length == 0) {
            return null
        }


        let canLoadingMore = true

        if (this.capitalTransferLists.length < this.capitalTransferLimit) {
            canLoadingMore = false
        }

        return (
            <View style={styles.loadingMore}>
                {this.ajaxCapitalTransferFlag ?
                    <Text allowFontScaling={false} style={[styles.loadingMoreText]}>加载中</Text>
                    :
                    canLoadingMore ?
                        <Text allowFontScaling={false} style={[styles.loadingMoreText]}>上拉加载更多</Text>
                        :
                        <Text allowFontScaling={false} style={[styles.loadingMoreText]}>已经全部加载完毕</Text>
                }
            </View>
        )
    }

    // 去转账记录详情页
    @action
    goToCapitalTransferDetail = (item,transferType) => {
        let transferStatus = (this.statusObj[item.done] || "")

        this.$router.push('CapitalTransferRecordsDetail', {item, transferType,transferStatus})

    }

    // 转账记录item
    @action
    _renderCapitalTransferRecordsItem = ({item, index}) => {

        // let transferType = item.transferFrom == 'OTC' ? "从法币到钱包" : "从钱包到法币"
        let transferType = this.transferTypeMap[item.transferTo] || ''

        if(item.currency == 'USDT2' || item.currency == 'USDT3')item.currency = 'USDT'

        return (
            <TouchableOpacity
                onPress={() => {
                    this.goToCapitalTransferDetail(item,transferType)
                }}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <View style={styles.rechargeRecordsItemBox2}>
                    <View style={styles.itemTop}>
                        {
                            <Text allowFontScaling={false} style={[baseStyles.textCurrencyTitle, styles.currency]}>{item.currency}</Text>
                        }
                    </View>
                    <View style={[baseStyles.flexRowBetween,styles.itemLineBot]}>
                        <View style={[styles.baseColumn1,{width:'40%'}]}>
                            <Text style={styles.itemSectionTitle}>数量</Text>
                            <Text style={styles.itemSectionNum}>
                                {this.$globalFunc.accFixed(item.amount, this.currencyJingDU[item.currency] || 3)}
                            </Text>
                        </View>
                        <View style={[styles.baseColumn2,{width:'30%'}]}>
                            <Text style={styles.itemSectionTitle}>类型</Text>
                            <Text style={styles.itemSectionNum}>{transferType}</Text>
                        </View>
                        <View style={[styles.baseColumn3,{width:'30%'}]}>
                            <Text style={[styles.itemSectionTitle,{textAlign:'right'}]}>日期</Text>
                            <Text
                                allowFontScaling={false}
                                style={[baseStyles.textWhite, styles.itemSectionNum,{textAlign:'right'}]}>
                                {this.$globalFunc.formatDateUitl(item.updatedAt, 'hh:mm MM/DD')}
                            </Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    // 加载更多
    @action
    _capitalTransferLoadingMore = () => {
        if (this.ajaxCapitalTransferFlag) return
        if (this.capitalTransferLists.length < this.capitalTransferLimit) return
        this.capitalTransferLimit += this.capitalTransferLimitNum
        this.getCapitalTransferList()
        console.warn("转账记录触底啦")
    }

    // 渲染转账记录
    @action
    _renderCapitalTransfer = (records) => {
        // records = [
        //     {currency:100000000,amount:12012.1211,createdAt:1533532114758},
        //
        // ]
        return (
            <View style={styles.flatBox}>
                <FlatList
                    style={styles.container}
                    data={records}
                    renderItem={this._renderCapitalTransferRecordsItem}
                    ListFooterComponent={this._capitalTransferFooterComponent}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={reachedThreshold}
                    onEndReached={this._capitalTransferLoadingMore}
                    ListEmptyComponent={this._renderEmptyComponent}
                />
            </View>
        )
    }

    /*----------------------- 挂载 -------------------------*/

    render() {


        return (
            <View style={[styles.container, baseStyles.container]}>

                {
                 this._renderCapitalTransfer(this.capitalTransferLists)
                }

                {/*加载中*/}
                {
                    this.ajaxCapitalTransferFlag && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
