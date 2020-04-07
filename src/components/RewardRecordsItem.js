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
const typeTextObj = {'recharge':'充币', 'withdrawals':'提币'}

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

@observer
export default class App extends RNComponent {


    static propTypes = {
        type: propTypes.string.isRequired,
    }

    static defaultProps = {
        type: typeArr[0],
    }

    @computed get currencyJingDU(){
        return this.$store.state.currencyJingDU
    }

    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true

    lastId = 0;

    // 充值记录条数
    @observable
    rechargeLimit = 10

    rechargeLimitNum = 10

    // 充值记录正在加载更多
    @observable
    rechargeLoadingMore = false

    // 提现记录条数
    @observable
    withdrawalsLimit = 20

    withdrawalsLimitNum = 10

    // 提现记录正在加载更多
    @observable
    withdrawalsLoadingMore = false

    // 充值记录
    @observable
    rechargeRecords = []

    // 充值记录请求回来了
    @observable
    rechargeRecordsReady = false

    // 提现记录
    @observable
    withdrawalsRecords = []

    // 提现记录请求回来了
    @observable
    withdrawalsRecordsReady = false


    //奖励状态
    statusObj = {
        "SUCCESS":"已发放",
    }


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        // if (this.props.type === typeArr[1]) {
            this.getWithdrawalsRecord()
            // this.$event.listen({bind: this, key: 'GET_WITHDRAWALS_RECORDS', func: this.getWithdrawalsRecord})

        // }
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


    // 获取奖励记录
    @action
    getWithdrawalsRecord = () => {
        this.withdrawalsLoadingMore = true
        console.warn('----------记录参数',{
            rewardId:this.lastId,
            pageSize:this.withdrawalsLimit
        })


        this.$http.send("INITIAL_REWARD", {
            bind: this,
            // params: {
            //     rewardId:this.lastId,
            //     pageSize:this.withdrawalsLimit
            // },
            callBack: this.re_getWithdrawalsRecord,
            errorHandler: this.error_getWithdrawalsRecord
        })
    }
    // 获取记录返回
    @action
    re_getWithdrawalsRecord = (data) => {
        console.log('----------记录',data)
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || !data.dataMap) return
        this.withdrawalsRecords = data.dataMap.registerInviteRewards

        this.lastId = this.withdrawalsRecords[this.withdrawalsRecords.length-1].id || 0


        this.withdrawalsRecordsReady = true
        this.withdrawalsLoadingMore = false
        // console.warn('记录返回', data)
        this.loading = false
    }
    // 获取记录出错
    @action
    error_getWithdrawalsRecord = (err) => {
        console.warn("获取记录出错！", err)
    }

    // 渲染footer组件
    @action
    _withdrawalsListFooterComponent = () => {
        if (this.withdrawalsRecords.length == 0) {
            return null
        }

        let canLoadingMore = true

        if (this.withdrawalsLimit > this.withdrawalsRecords.length) {
            canLoadingMore = false
        }

        return (
            <View style={styles.loadingMore}>
                {this.withdrawalsLoadingMore ?
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

    // 去奖励记录详情页
    @action
    goToWithdrawalsDetail = (item,sourceType) => {

        let transferStatus = (this.statusObj[item.status] || "")

        this.$router.push('MiningRecordsDetail', {item ,transferType:sourceType ,transferStatus})

    }

    // 奖励记录item
    @action
    _renderWithdrawalsRecordsItem = ({item, index}) => {

        item.currency == 'USDT2' && (item.currency = 'USDT')

        let sourceType = item.source =='EXCHANGE'?'首次交易':'实名认证'

        return (
            <TouchableOpacity
                onPress={() => {
                    // return
                    this.goToWithdrawalsDetail(item,sourceType)
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
                            <Text style={styles.itemSectionNum}>{sourceType}</Text>
                        </View>
                        <View style={[styles.baseColumn3,{width:'30%'}]}>
                            <Text style={[styles.itemSectionTitle,{textAlign:'right'}]}>发放日期</Text>
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
    _withdrawalsLoadingMore = () => {
        if (!this.withdrawalsRecordsReady) return
        if (this.withdrawalsLimit > this.withdrawalsRecords.length) return
        this.withdrawalsLimit += this.withdrawalsLimitNum
        this.getWithdrawalsRecord()
        console.warn("奖励记录触底啦")
    }

    // 渲染奖励记录
    @action
    _renderWithdrawals = (records) => {
        // records = [
        //     {currency:100000000,amount:12012.1211,createdAt:1533532114758},
        //
        // ]
        return (
            <View style={styles.flatBox}>
                <FlatList
                    style={styles.container}
                    data={records}
                    renderItem={this._renderWithdrawalsRecordsItem}
                    ListFooterComponent={this._withdrawalsListFooterComponent}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={reachedThreshold}
                    onEndReached={this._withdrawalsLoadingMore}
                    ListEmptyComponent={this._renderEmptyComponent}
                />
            </View>
        )
    }




    /*----------------------- 挂载 -------------------------*/

    render() {


        return (
            <View style={[styles.container, baseStyles.container]}>

                {/*渲染奖励记录 begin*/}
                {
                    this._renderWithdrawals(this.withdrawalsRecords)
                }
                {/*渲染奖励记录 end*/}


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
