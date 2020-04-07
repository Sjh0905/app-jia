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
export default class InternalTransferRecordsItem extends RNComponent {


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

    // 获取多少条
    @observable
    internalTransferLimit =  10
    //分页加载步长
    @observable
    internalTransferLimitNum =  10
    //是否Transfer获取ajax结果 默认为false
    @observable
    ajaxInternalTransferFlag = false
    //挖矿记录
    @observable
    internalTransferLists = []
    // 是否显示挖矿记录加载更多
    @observable
    isShowGetMoreInternalTransfer =  true

    //挖矿状态
    statusObj = {
        "DONE":"已发放",
    }

    @observable
    lastId = 0;

    @observable
    pageSize = 30;
    //挖矿记录
    @observable
    ActivityRecord = []


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getInternalTransferList()
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

    // 获取挖矿记录
    getInternalTransferList = function () {
        if(this.ajaxInternalTransferFlag === true){
            return;
        }
        this.ajaxInternalTransferFlag = true

        this.$http.send("KK_ACTIVITY_REWARDS", {
            bind: this,
            params: {
                rewardId:this.lastId,
                pageSize:this.internalTransferLimit
                // currentPage:this.selectIndex,
                // pageSize:this.pageSize
                // fromIndex: this.fromIndex,
                // toIndex: this.toIndex
            },
            callBack: this.re_getInternalTransferList,
            errorHandler: this.error_getInternalTransferList
        })
    }
    // 获取挖矿记录返回，类型为{}
    re_getInternalTransferList = function (data) {

        this.ajaxInternalTransferFlag = false
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || !data.dataMap) return
        console.log('获取挖矿记录', data)
        this.ActivityRecord = data.dataMap.kkActivityRewardList || []

        // if (this.ActivityRecord.length < this.internalTransferLimit){
        //     this.isShowGetMoreInternalTransfer = false
        // } else {
        //
        // }
    }
    // 获取记录出错
    error_getInternalTransferList = function (err) {
        console.warn("挖矿获取记录出错！", err)
    }

    // 渲染footer组件
    @action
    _internalTransferFooterComponent = () => {
        if (this.ActivityRecord.length == 0) {
            return null
        }


        let canLoadingMore = true

        if (this.ActivityRecord.length < this.internalTransferLimit) {
            canLoadingMore = false
        }

        return (
            <View style={styles.loadingMore}>
                {this.ajaxInternalTransferFlag ?
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

    // 去挖矿记录详情页
    @action
    goToInternalTransferDetail = (item,transferType) => {
        let transferStatus = (this.statusObj[item.status] || "")

        this.$router.push('MiningRecordsDetail', {item ,transferType ,transferStatus})

    }

    // 挖矿记录item
    @action
    _renderInternalTransferRecordsItem = ({item, index}) => {
        let transferType = item.descritption
        item.currency == 'USDT2' && (item.currency = 'USDT')

        return (
            <TouchableOpacity
                onPress={() => {
                    this.goToInternalTransferDetail(item,transferType)
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
    _internalTransferLoadingMore = () => {
        if (this.ajaxInternalTransferFlag) return
        if (this.ActivityRecord.length < this.internalTransferLimit) return
        this.internalTransferLimit += this.internalTransferLimitNum
        this.getInternalTransferList()
        console.warn("挖矿记录触底啦")
    }

    // 渲染挖矿记录
    @action
    _renderInternalTransfer = (records) => {
        // records = [
        //     {currency:100000000,amount:12012.1211,createdAt:1533532114758},
        //
        // ]
        return (
            <View style={styles.flatBox}>
                <FlatList
                    style={styles.container}
                    data={records}
                    renderItem={this._renderInternalTransferRecordsItem}
                    ListFooterComponent={this._internalTransferFooterComponent}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={reachedThreshold}
                    onEndReached={this._internalTransferLoadingMore}
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
                 this._renderInternalTransfer(this.ActivityRecord)
                }

                {/*加载中*/}
                {
                    this.ajaxInternalTransferFlag && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
