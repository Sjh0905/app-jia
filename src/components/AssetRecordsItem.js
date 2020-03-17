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

    // 充值记录条数
    @observable
    rechargeLimit = 10

    rechargeLimitNum = 10

    // 充值记录正在加载更多
    @observable
    rechargeLoadingMore = false

    // 提现记录条数
    @observable
    withdrawalsLimit = 10

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


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        if (this.props.type === typeArr[0]) {
            this.getRechargeRecords()
            this.$event.listen({bind: this, key: 'GET_RECHARGE_RECORDS', func: this.getRechargeRecords})
        }
        if (this.props.type === typeArr[1]) {
            this.getWithdrawalsRecord()
            this.$event.listen({bind: this, key: 'GET_WITHDRAWALS_RECORDS', func: this.getWithdrawalsRecord})

        }
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


    // 获取提现记录
    @action
    getWithdrawalsRecord = () => {
        this.withdrawalsLoadingMore = true
        this.$http.send("WITHDRAWS_LOG", {
            bind: this,
            params: {
                currency: this.props.currency || '',//this.props.currency有值说明是AssetPageDetail页面调用
                limit: this.withdrawalsLimit
            },
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
        this.withdrawalsRecords = data.dataMap.requests
        //为了避免接口返回所有币种，前端特此过滤
        if(this.props.currency && this.withdrawalsRecords.length > 0){
            this.withdrawalsRecords = this.withdrawalsRecords.filter(v => {

                v.isUSDT2 = v.currency == 'USDT2';
                v.isUSDT2 && (v.currency = 'USDT')

                return v.currency == this.props.currency
            })
        }

        if(!this.props.currency && this.withdrawalsRecords.length > 0){
            this.withdrawalsRecords.forEach(v=>{

                v.isUSDT2 = v.currency == 'USDT2';
                v.isUSDT2 && (v.currency = 'USDT')

            })
        }

        this.withdrawalsRecordsReady = true
        this.withdrawalsLoadingMore = false
        // console.warn('提现记录返回', data)
        this.loading = false
    }
    // 获取记录出错
    @action
    error_getWithdrawalsRecord = (err) => {
        console.warn("获取提现记录出错！", err)
    }


    // 获取充值记录
    @action
    getRechargeRecords = () => {
        this.rechargeLoadingMore = true
        this.$http.send("RECHARGE_LOG", {
            bind: this,
            params: {
                currency:this.props.currency || '',//this.props.currency有值说明是AssetPageDetail页面调用
                limit: this.rechargeLimit
            },
            callBack: this.re_getRechargeRecords,
            errorHandler: this.error_getRechargeRecords
        })
    }
    // 获取充值记录返回
    @action
    re_getRechargeRecords = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || !data.dataMap) return
        this.rechargeRecords = data.dataMap.deposits
        //为了避免接口返回所有币种，前端特此过滤
        if(this.props.currency && this.rechargeRecords.length > 0){
            this.rechargeRecords = this.rechargeRecords.filter(v => {

                v.isUSDT2 = v.currency == 'USDT2';
                v.isUSDT2 && (v.currency = 'USDT')

                return v.currency == this.props.currency
            })
        }

        if(!this.props.currency && this.rechargeRecords.length > 0){
            this.rechargeRecords.forEach(v=>{
                v.isUSDT2 = v.currency == 'USDT2';
                v.isUSDT2 && (v.currency = 'USDT')

            })
        }

        this.rechargeRecordsReady = true
        this.rechargeLoadingMore = false
        // console.warn('充值记录返回', data)
        this.loading = false
    }
    // 获取充值记录出错
    @action
    error_getRechargeRecords = (err) => {
        console.warn("获取充值记录出错！", err)
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

    // 去提现记录详情页
    @action
    goToWithdrawalsDetail = (item) => {
        this.$router.push('RechargeAndWithdrawalsRecordsDetail', {item: item, type: typeArr[1]})

    }

    // 提现记录item
    @action
    _renderWithdrawalsRecordsItem = ({item, index}) => {
        let status = '成功'

        switch (item.status) {
            case 'SUBMITTED':
                status = '已提交'
                break;
            case 'WAITING_FOR_APPROVAL':
                status = '待审核'
                break;
            case 'WAITING_FOR_WALLET':
                status = '待处理'
                break;
            case 'DENIED':
                status = '被驳回'
                break;
            case 'PROCESSING':
                status = '已处理'
                break;
            case 'FAILED':
                status = '失败'
                break;
            case 'CANCELLED':
                status = '已撤销'
                break;
            case 'DONE':
                status = '已汇出'
                break;
            default:
                status = '----'
        }


        /*return (
            <TouchableOpacity
                onPress={() => {
                    this.goToWithdrawalsDetail(item)
                }}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <View style={styles.withdrawalsRecordsItemBox}>
                    <View style={styles.itemTop}>
                        <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currency]}>{item.currency}</Text>
                        <Text
                            allowFontScaling={false}
                            style={[baseStyles.textColor, styles.total]}>{this.$globalFunc.accFixed(item.amount, 8)}</Text>
                    </View>
                    <View style={styles.itemBottom}>
                        <Text
                            allowFontScaling={false}
                            style={[baseStyles.textC5CFD5, styles.time]}>{this.$globalFunc.formatDateUitl(item.createdAt, 'YYYY-MM-DD hh:mm:ss')}</Text>
                        <Text
                            allowFontScaling={false}
                            style={[baseStyles.textC5CFD5, styles.status]}>{status}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )*/

        return (
            <TouchableOpacity
                onPress={() => {
                    this.goToWithdrawalsDetail(item)
                }}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <View style={styles.rechargeRecordsItemBox2}>
                    <View style={styles.itemTop}>
                        {
                            this.props.currency &&
                            <Text allowFontScaling={false} style={[baseStyles.textColor, baseStyles.size16]}>{typeTextObj[this.props.type]}</Text>
                            ||
                            <Text allowFontScaling={false} style={[baseStyles.textRed, styles.currency]}>{item.currency}</Text>
                        }
                    </View>
                    <View style={[baseStyles.flexRowBetween,styles.itemLineBot]}>
                        <View style={styles.baseColumn1}>
                            <Text style={styles.itemSectionTitle}>数量</Text>
                            <Text style={styles.itemSectionNum}>
                                {this.$globalFunc.accFixed(item.amount, this.currencyJingDU[item.currency] || 3)}
                            </Text>
                        </View>
                        <View style={styles.baseColumn2}>
                            <Text style={styles.itemSectionTitle}>状态</Text>
                            <Text style={styles.itemSectionNum}>{status}</Text>
                        </View>
                        <View style={styles.baseColumn3}>
                            <Text style={[styles.itemSectionTitle,{textAlign:'right'}]}>日期</Text>
                            <Text
                                allowFontScaling={false}
                                style={[baseStyles.textWhite, styles.itemSectionNum,{textAlign:'right'}]}>
                                {this.$globalFunc.formatDateUitl(item.createdAt, 'hh:mm MM/DD')}
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
        console.warn("提现记录触底啦")
    }

    // 渲染充值记录
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


    // 渲染充值footer组件
    @action
    _rechargeListFooterComponent = () => {

        if (this.rechargeRecords.length == 0) {
            return null
        }

        let canLoadingMore = true

        if (this.rechargeLimit > this.rechargeRecords.length) {
            canLoadingMore = false
        }

        return (
            <View style={styles.loadingMore}>
                {this.rechargeLoadingMore ?
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

    // 跳转到充值详情
    @action
    goToRechargeDetail = (item) => {
        this.$router.push('RechargeAndWithdrawalsRecordsDetail', {item: item, type: typeArr[0]})
    }

    // 提现记录item
    @action
    _renderRechargeRecordsItem = ({item, index}) => {

        let status = ''

        switch (item.status) {
            case 'PENDING':
                status = '等待区块确认' + `(${item.confirms}/${item.minimumConfirms})`
                break;
            case 'DEPOSITED':
                status = '充值成功'
                break;
            case 'CANCELLED':
                status = '废弃区块'
                break;
            case 'WAITING_FOR_APPROVAL':
                status = '等待审核'
                break;
            case 'DENIED':
                status = '审核未通过'
                break;
            default:
                status = '---'
        }

        // return (
        //     <TouchableOpacity
        //         onPress={() => {
        //             this.goToRechargeDetail(item)
        //         }}
        //         activeOpacity={StyleConfigs.activeOpacity}
        //     >
        //         <View style={styles.rechargeRecordsItemBox}>
        //             <View style={styles.itemTop}>
        //                 <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currency]}>{item.currency}</Text>
        //                 <Text allowFontScaling={false}
        //                     style={[baseStyles.textColor, styles.total]}>{this.$globalFunc.accFixed(item.amount, 8)}</Text>
        //             </View>
        //             <View style={styles.itemBottom}>
        //                 <Text allowFontScaling={false}
        //                     style={[baseStyles.textColor, styles.time]}>{this.$globalFunc.formatDateUitl(item.createdAt, 'YYYY-MM-DD hh:mm:ss')}</Text>
        //                 <Text allowFontScaling={false} style={[baseStyles.textColor, styles.status]}>{status}</Text>
        //             </View>
        //         </View>
        //     </TouchableOpacity>
        // )

        return (
            <TouchableOpacity
                onPress={() => {
                    this.goToRechargeDetail(item)
                }}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <View style={styles.rechargeRecordsItemBox2}>
                    <View style={styles.itemTop}>
                        {
                            this.props.currency &&
                            <Text allowFontScaling={false} style={[baseStyles.textColor, baseStyles.size16]}>{typeTextObj[this.props.type]}</Text>
                            ||
                            <Text allowFontScaling={false} style={[baseStyles.textRed, styles.currency]}>{item.currency}</Text>
                        }
                    </View>
                    <View style={[baseStyles.flexRowBetween,styles.itemLineBot]}>
                        <View style={styles.baseColumn1}>
                            <Text style={styles.itemSectionTitle}>数量</Text>
                            <Text style={styles.itemSectionNum}>
                                {this.$globalFunc.accFixed(item.amount, this.currencyJingDU[item.currency] || 3)}
                            </Text>
                        </View>
                        <View style={styles.baseColumn2}>
                            <Text style={styles.itemSectionTitle}>状态</Text>
                            <Text style={styles.itemSectionNum}>{status}</Text>
                        </View>
                        <View style={styles.baseColumn3}>
                            <Text style={[styles.itemSectionTitle,{textAlign:'right'}]}>日期</Text>
                            <Text
                                allowFontScaling={false}
                                style={[baseStyles.textWhite, styles.itemSectionNum,{textAlign:'right'}]}>
                                {this.$globalFunc.formatDateUitl(item.createdAt, 'hh:mm MM/DD')}
                            </Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    // 加载更多
    @action
    _rechargeLoadingMore = () => {
        if (!this.rechargeRecordsReady) return
        if (this.rechargeLimit > this.rechargeRecords.length) return
        this.rechargeLimit += this.rechargeLimitNum
        this.getRechargeRecords()
        console.warn('充值记录触底啦')
    }

    // 渲染充值记录
    @action
    _renderRecharge = (records) => {
        // records = [
        //     {currency:100000000,amount:12012.1211,createdAt:1533532114758},
        //
        // ]

        return (
            <View style={styles.flatBox}>
                <FlatList
                    style={styles.container}
                    data={records}
                    renderItem={this._renderRechargeRecordsItem}
                    ListFooterComponent={this._rechargeListFooterComponent}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={reachedThreshold}
                    onEndReached={this._rechargeLoadingMore}
                    ListEmptyComponent={this._renderEmptyComponent}

                />
            </View>
        )
    }


    /*----------------------- 挂载 -------------------------*/

    render() {


        return (
            <View style={[styles.container, baseStyles.container]}>

                {/*渲染充值记录 begin*/}
                {
                    this.props.type == typeArr[0] && this._renderRecharge(this.rechargeRecords)
                }
                {/*渲染充值记录 end*/}


                {/*渲染提现记录 begin*/}
                {
                    this.props.type == typeArr[1] && this._renderWithdrawals(this.withdrawalsRecords)
                }
                {/*渲染提现记录 end*/}


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
