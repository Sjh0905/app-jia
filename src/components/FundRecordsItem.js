
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
export default class FundRecordsItem extends RNComponent {


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
    // @observable
    // withdrawalsLimit = 20

    // withdrawalsLimitNum = 10

    // 转账记录正在加载更多
    // @observable
    // withdrawalsLoadingMore = false

    // 转账记录
    // @observable
    // withdrawalsRecords = []

    // 转账记录请求回来了
    // @observable
    // withdrawalsRecordsReady = false

    // 获取多少条
    @observable
    fundLimit =  10
    //分页加载步长
    @observable
    fundLimitNum =  10
    //是否Fund获取ajax结果 默认为false
    @observable
    ajaxFundFlag = false
    //转账记录
    @observable
    fundLists = []
    // 是否显示转账记录加载更多
    @observable
    isShowGetMoreFund =  true

    //转账状态
    statusObj = {
        "SUCCESS":"成功",
        "FAILED":"失败"
    }


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getFundList()
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
    getFundList = function () {
        if(this.ajaxFundFlag === true){
            return;
        }
        this.ajaxFundFlag = true

        this.$http.send("GET_TKF_PAY_RECORD", {
            bind: this,
            query:{
                // status:0,//0全部，1 失败，2 成功
                // currency:'',
                // pageSize:this.fundLimit
            },
            callBack: this.re_getFundList,
            errorHandler: this.error_getFundList
        })
    }
    // 获取内部转账记录返回，类型为{}
    re_getFundList = function (data) {
        // data = {
        //   "dataMap": {
        //   "userTransferRecordList": [
        //   ]
        // },
        //   "errorCode": -44435161.791536435,
        //   "result": "ut"
        // }

        this.ajaxFundFlag = false
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || !data.dataMap) return
        console.log('获取基金理财记录', data)
        this.fundLists = data.dataMap.list || []

        // if (this.fundLists.length < this.fundLimit){
        //     this.isShowGetMoreFund = false
        // } else {
        //
        // }
    }
    // 获取记录出错
    error_getFundList = function (err) {
        console.warn("转账获取记录出错！", err)
    }

    // 渲染footer组件
    @action
    _fundFooterComponent = () => {

        return (
            <View style={styles.loadingMore}>
                <Text allowFontScaling={false} style={[styles.loadingMoreText]}>已经全部加载完毕</Text>
            </View>
        )


        if (this.fundLists.length == 0) {
            return null
        }


        let canLoadingMore = true

        if (this.fundLists.length < this.fundLimit) {
            canLoadingMore = false
        }

        return (
            <View style={styles.loadingMore}>
                {this.ajaxFundFlag ?
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
    goToFundDetail = (item,fundType) => {
        let fundStatus = (this.statusObj[item.orderStatus] || "")

        this.$router.push('FundRecordsDetail', {item, fundType,fundStatus})

    }

    // 转账记录item
    @action
    _renderFundRecordsItem = ({item, index}) => {

        let fundType = item.fromUserId == this.userId ? "从钱包到基金" : "从基金到钱包"

        if(item.currency == 'USDT2' || item.currency == 'USDT3')item.currency = 'USDT'

        return (
            <TouchableOpacity
                onPress={() => {
                    this.goToFundDetail(item,fundType)
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
                                {this.$globalFunc.accFixed(item.amount, 4)}
                            </Text>
                        </View>
                        <View style={[styles.baseColumn2,{width:'30%'}]}>
                            <Text style={styles.itemSectionTitle}>类型</Text>
                            <Text style={styles.itemSectionNum}>{item.reason}</Text>
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
    _fundLoadingMore = () => {
        if (this.ajaxFundFlag) return
        if (this.fundLists.length < this.fundLimit) return
        this.fundLimit += this.fundLimitNum
        this.getFundList()
        console.warn("转账记录触底啦")
    }

    // 渲染转账记录
    @action
    _renderFund = (records) => {
        // records = [
        //     {currency:100000000,amount:12012.1211,createdAt:1533532114758},
        //
        // ]
        return (
            <View style={styles.flatBox}>
                <FlatList
                    style={styles.container}
                    data={records}
                    renderItem={this._renderFundRecordsItem}
                    ListFooterComponent={this._fundFooterComponent}
                    keyExtractor={(item, index) => index.toString()}
                    // onEndReachedThreshold={reachedThreshold}
                    // onEndReached={this._fundLoadingMore}
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
                 this._renderFund(this.fundLists)
                }

                {/*加载中*/}
                {
                    this.ajaxFundFlag && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
