/**
 * hjx 2018.4.16
 */

import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View, ImageBackground, ScrollView, Alert} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetPageStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import EyeClose from '../assets/AssetPage/eye-close-icon.png'
import EyeOpen from '../assets/AssetPage/eye-open-icon.png'
import ShowAssets from '../assets/AssetPage/show-assets.png'
import HideAssets from '../assets/AssetPage/hide-assets.png'
import rechargeIcon from '../assets/AssetPage/recharge.png'
import withdrawalsIcon from '../assets/AssetPage/withdrawals.png'
import internalTransferIcon from '../assets/AssetPage/internal_transfer.png'
import lockHouseIcon from '../assets/AssetPage/lock_house.png'
import HistoricalRecordsIcon from '../assets/AssetPage/historical-records.png'
import device from "../configs/device/device";
import Env from  '../configs/environmentConfigs/env.js'
import IntoIcon from '../assets/MinePage/into-icon.png'
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    // @observable
    // loading = true

    // @observable
    // currencyReady = false

    // @observable
    // accountReady = false

    @computed get exchangRateDollar(){
        return this.$store.state.exchangRateDollar
    }

    @computed get currencyJingDU(){
        return this.$store.state.currencyJingDU
    }

    @observable
    totalAssetShow = true

    @observable
    currency = []

    @observable
    getAccountInterval = null

    @observable
    exchangeRate = 0

    @observable
    exchangeRateInterval = null

    @observable
    hide0AssetCurrency = false

    @observable
    assetAccountType = 'wallet'//当前账户类型,默认显示我的钱包wallet，法币currency，合约futures

    @observable
    otcCurrencyList = ''//法币币种列表

    @observable
    futuresShowType = 'holdPosition'//持有仓位holdPosition 全部合约资产allFuturesAsset

    futuresCurrency = 'USDT';

    @observable
    balance = {}

    @observable
    totalWalletBalance = 0

    @observable
    totalUnrealizedProfit = 0

    @observable
    totalMarginBalance = 0

    @observable
    isOpenFutures = false//默认如果为true的话会导致调用仓位接口闪退

    @observable
    positionArr = []

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

        //切换到资产页及时更新合约账户信息
        this.listen({key: 'RE_CURRENCY', func:()=>{
            //及时更新合约账户开通状态以及获取合约资产
            this.getFuturesAccount()
            // 暂时不在这里调用了，仓位接口调用放到getFuturesAccount回调了
            // if(this.assetAccountType == 'futures' && this.isOpenFutures){
            //     //获取合约仓位
            //     this.getFuturesPosition()
            // }
        }})
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        // 获取OTC账户信息
        this.getOtcCurrency()

        // 获取账户信息
        this.getCurrency()

        // 获取人民币汇率
        this.getExchangeRate()

        // 获取初始数据
        // this.getInitData()
        // socket监听价格
        this.getPrice()

        // 获取认证状态
        this.getAuthState()

        //获取合约资产
        this.getFuturesAccount()
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

    // 去历史记录
    @action
    goToHistoricalRecords = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('RechargeAndWithdrawalsRecords');
        }
    })()

    // 改变图标
    @action
    changeAssetShow = () => {
        this.totalAssetShow = !this.totalAssetShow
    }


    /*---------------------- 初始化begin ---------------------*/
    // 获取初始data
    // @action
    // getInitData = () => {
    //     this.$http.send('MARKET_PRICES', {
    //         bind: this,
    //         callBack: this.re_getInitData,
    //         errorHandler: this.error_getInitData
    //     })
    // }
    // // 返回初始data
    // @action
    // re_getInitData = (data) => {
    //     typeof data === 'string' && (data = JSON.parse(data))
    //     // console.warn("this is initdata",data)
    //     if (!data) return
    //     this.$store.commit('CHANGE_PRICE_TO_BTC', data)
    // }
    // // 获取data出错
    // @action
    // error_getInitData = (err) => {
    //     console.warn('获取init数据出错', err)
    // }
    /*---------------------- 初始化end ---------------------*/


    /*---------------------- socket监听价格begin ---------------------*/
    // 通过socket获取价格
    @action
    getPrice = () => {
        this.$socket.on({
                key: 'topic_prices',
                bind: this,
                callBack: this.re_getPrice
            }
        )
    }
    // 通过socket获取价格的回调
    @action
    re_getPrice = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data) return
        this.$store.commit('CHANGE_PRICE_TO_BTC', data)
    }
    /*---------------------- socket监听价格end ---------------------*/


    /*---------------------- 获取汇率begin ---------------------*/
    @action
    getExchangeRate = () => {
        this.$http.send('GET_EXCHANGE_RAGE', {
            bind: this,
            callBack: this.re_getExchangeRate,
            errorHandler: this.error_getExchangeRate
        })
    }

    // 获取人民币汇率回调
    @action
    re_getExchangeRate = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        // console.warn("获取人民币费率", data)
        if (!data || !data.dataMap) return
        if (data.result === 'SUCCESS') {
            this.$store.commit('SET_EXCHANGE_RATE', data.dataMap.exchangeRate)
        }
    }
    // 获取人民币汇率失败
    @action
    error_getExchangeRate = (err) => {
    }

    /*---------------------- 获取汇率end ---------------------*/


    // 获取OTC币种
    @action
    getOtcCurrency = () => {
        this.$http.send('GET_OTC_CURRENCY', {
            bind: this,
            callBack: this.re_getOtcCurrency,
            errorHandler: this.error_getOtcCurrency,
        })
    }

    // 获取OTC币种的状态
    @action
    re_getOtcCurrency = (data) => {
        console.log(data)
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data) {
            return
        }

        let otcCurrencyList = []
        data.map(v=>otcCurrencyList.push(v.currency))
        this.otcCurrencyList = otcCurrencyList;
    }

    // 获取OTC币种失败
    @action
    error_getOtcCurrency = (err) => {
        console.warn("获取OTC币种失败", err)
    }

    // 获取币种
    @action
    getCurrency = () => {
        this.$http.send('GET_CURRENCY', {
            bind: this,
            callBack: this.re_getCurrency,
            errorHandler: this.error_getCurrency,
        })
    }

    // 获取币种的状态
    @action
    re_getCurrency = (data) => {
        console.log(data)
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data.dataMap || !data.dataMap.currencys) {
            return
        }
        this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
        // this.currencyReady = true
        // this.loading = !(this.currencyReady && this.accountReady)
        this.getAccounts()

        if(this.otcCurrencyList.length == 0){
            console.log('要开始调用了啊')
          this.getOtcCurrency()
        }
    }

    // 获取币种失败
    @action
    error_getCurrency = (err) => {
        console.warn("获取币种列表失败", err)
    }

    //获取账户信息
    @action
    getAccounts = () => {

        if (!this.$store.state.authMessage.userId) return
        // 请求各项估值userid
        this.$http.send('GET_ACCOUNTS', {
            bind: this,
            callBack: this.re_getAccount,
            errorHandler: this.error_getAccount
        })
    }
    // 获取账户信息回调
    @action
    re_getAccount = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data || !data.accounts) {
            return
        }
        console.warn("获取账户内容", data)
        this.$store.commit('CHANGE_ACCOUNT', data.accounts)
        // this.accountReady = true
        // this.loading = !(this.currencyReady && this.accountReady)
        // 关闭loading
    }
    // 获取账户信息失败
    @action
    error_getAccount = (err) => {
        console.warn("获取账户内容失败", err)
    }


    // 去资产详情
    @action
    pressCurrencyItem = (() => {
        let last = 0;
        return (item) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('AssetDetail', {currency: item.currency, fullName: item.description,assetAccountType:this.assetAccountType})
        }
    })()


    // 判断验证状态
    @action
    getAuthState = () => {
        this.$http.send('GET_AUTH_STATE', {
            bind: this,
            callBack: this.re_getAuthState,
            errorHandler: this.error_getAuthState
        })
    }


    // 判断验证状态回调
    @action
    re_getAuthState = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return
        this.$store.commit('SET_AUTH_STATE', data.dataMap)
    }
    // 判断验证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
    }

    // 获取合约资产
    @action
    getFuturesAccount = () => {
        this.$http.send('GET_USER_ACCOUNT_V2', {
            bind: this,
            query: {
                timestamp: new Date().getTime()
            },
            callBack: this.re_getFuturesAccount,
            errorHandler: this.error_getFuturesAccount
        })
    }
    // 获取合约资产回调
    @action
    re_getFuturesAccount = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return

        if (data.code == 1000) {
            this.isOpenFutures = false;
            return;
        }

        if (!data.data)return

        this.isOpenFutures = true;
        // console.info('币安接口账户余额',data)
        this.totalWalletBalance = data.data.totalWalletBalance
        this.totalUnrealizedProfit = data.data.totalUnrealizedProfit
        this.totalMarginBalance = data.data.totalMarginBalance
        this.balance = (data.data.assets || []).find(v=>this.futuresCurrency == v.asset) || {}
        // console.info('this.$store.state.exchange_rate_dollar',this.totalMarginBalance)

        //获取合约仓位
        this.getFuturesPosition()
    }
    // 获取合约资产出错
    @action
    error_getFuturesAccount = (err) => {
        console.warn("获取合约资产出错！", err)
    }

    // 获取合约仓位，只有开通合约的情况下才能调用此接口
    @action
    getFuturesPosition = () => {
        this.$http.send('GET_POSITION_RISK_V2', {
            bind: this,
            callBack: this.re_getFuturesPosition,
            errorHandler: this.error_getFuturesPosition
        })
    }
    // 获取合约仓位回调
    @action
    re_getFuturesPosition = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data || !data.data) return
        let pos = data.data
        this.positionArr = pos.filter(v=>v.positionAmt != 0 && v.symbol == 'BTCUSDT')

    }
    // 获取合约仓位出错
    @action
    error_getFuturesPosition = (err) => {
        console.warn("获取合约资产出错！", err)
    }

    // 切换账户类型
    changeAssetAccountType = function (type) {
        if(this.assetAccountType == type)return

        if(type == 'futures' && !this.isOpenFutures){
            Alert.alert("提示", "您暂未开通合约账户", [{
                text: "我知道了", onPress: () => {console.log("点了我知道了");}
            }])
            return
        }

        if(type == 'futures' && this.isOpenFutures){
            this.getFuturesPosition();
        }

        this.assetAccountType = type
    };

    // 切换合约账户列表显示类型
    changefuturesShowType = function (type) {
        if(this.futuresShowType == type)return

        this.futuresShowType = type
    };

    //隐藏零资产
    @action
    hideCurrency = ()=>{
        this.hide0AssetCurrency = !this.hide0AssetCurrency
    }

    @action
    _renderCurrencyItem = ({item, index, separators}) => {

        let available = 'available'
        let frozen = 'frozen'
        let appraisement = 'appraisement'

        if(this.assetAccountType == 'currency'){
             available = 'otcAvailable'
             frozen = 'otcFrozen'
             appraisement = 'otcAppraisement'
        }

        // let exchangeRate = this.$globalFunc.accMul(this.$globalFunc.accMul(item.total, this.$store.state.exchange_rate.btcExchangeRate || 0), this.exchangRateDollar)
        let appraisementToRMB = this.$globalFunc.accMul(this.$globalFunc.accMul(item[appraisement], this.$store.state.exchange_rate.btcExchangeRate || 0), this.exchangRateDollar)

        return (
            <View>
                {
                    (item.total == 0 && this.hide0AssetCurrency) ? null :
                    <TouchableOpacity
                        stlye={styles.currencyItemBoxTouch}
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={() => {
                            this.pressCurrencyItem(item)
                        }}
                    >
                        <View style={[styles.currencyItemBox, index == 0 && styles.currencyItemFirstBox]}>
                            <View style={styles.currencyItemLeft}>
                                {/*<Image source={{uri: Env.networkConfigs.currencyLogoUrl + item.currency + '.png'}} style={styles.currencyIcon}/>*/}
                                <Text allowFontScaling={false} style={[baseStyles.textCurrencyTitle, styles.currencyText]}>
                                    {item.currency}
                                </Text>
                            </View>
                            <View style={styles.currencyItemRight}>
                                {/*{*/}
                                    {/*this.totalAssetShow ?*/}
                                        {/*<Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTotal]}>*/}
                                            {/*{item.total > 0 && this.$globalFunc.accFixed(item.total, 8) || '0'}*/}
                                        {/*</Text>*/}
                                        {/*:*/}
                                        {/*<Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTotal]}>****</Text>*/}
                                {/*}*/}
                                <Image source={IntoIcon} style={styles.intoIcon}/>
                            </View>

                        </View>
                        <View style={[baseStyles.flexRowBetween,styles.itemLineBot]}>
                            <View style={styles.baseColumn1}>
                                <Text style={styles.itemSectionTitle}>可用</Text>
                                {
                                    this.totalAssetShow ?
                                        <Text style={styles.itemSectionNum}>{item[available] > 0 && this.$globalFunc.accFixed(item[available], this.currencyJingDU[item.currency] || 3) || '0'}</Text>
                                        :
                                        <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTotal]}>****</Text>
                                }
                            </View>
                            <View style={styles.baseColumn2}>
                                <Text style={styles.itemSectionTitle}>冻结</Text>
                                {
                                    this.totalAssetShow ?
                                        <Text style={styles.itemSectionNum}>{item[frozen] > 0 && this.$globalFunc.accFixed(item[frozen], this.currencyJingDU[item.currency] || 3) || '0'}</Text>
                                        :
                                        <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTotal]}>****</Text>
                                }
                            </View>
                            <View style={styles.baseColumn3}>
                                <Text style={[styles.itemSectionTitle,{textAlign:'right'}]}>折合(CNY)</Text>
                                {/*<Text style={styles.itemSectionNum}>{rowData.filledAmount}</Text>*/}
                                {
                                    this.totalAssetShow ?
                                        <Text
                                            allowFontScaling={false}
                                            style={[baseStyles.textWhite, styles.itemSectionNum,styles.itemSectionNumToRMB]}>{this.totalAssetShow ? this.$globalFunc.accFixed2(appraisementToRMB, 2) : '----'}</Text>
                                        :
                                        <Text
                                            allowFontScaling={false}
                                            style={[baseStyles.textWhite, styles.itemSectionNum,styles.itemSectionNumToRMB,styles.totalAssetRMBHide]}>{'****'}</Text>

                                }
                            </View>
                        </View>

                    </TouchableOpacity>
                }
            </View>

        )
    }

    // 仓位为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
            </View>
        )
    }

    /*----------------------- 挂载 -------------------------*/

    render() {

        let currencyArr = [...this.$store.state.currency.values()]
        let total = 0
        let otcTotal = 0, futuresTotal = 0

        currencyArr.forEach((v, i) => {
            total = this.$globalFunc.accAdd(total, v.appraisement)
            if(this.otcCurrencyList.indexOf(v.currency) > -1){
                otcTotal = this.$globalFunc.accAdd(otcTotal, v.otcAppraisement)
            }
            if(this.futuresCurrency == v.currency){
                //合约目前只有USDT，直接在这里算BTC估值
                futuresTotal = this.$globalFunc.accMul(v.rate,(this.balance.walletBalance || 0))
            }
            // console.log('名称',v);
            // console.log('名称 估值 总和',v.currency,v.appraisement,total);
            // console.log('名称 汇率',v.currency,v.rate);
        })

        //我的钱包总资产
        let totalDisplay = this.$globalFunc.accFixed(total, 8);
        //法币账户总资产
        let otcTotalDisplay = this.$globalFunc.accFixed(otcTotal, 8);
        //合约账户总资产，目前只有USDT
        let futuresTotalDisplay = this.$globalFunc.accFixed(futuresTotal, 8);

        //需要截取后的数值相加，如果用接口返回真实的数据相加，截取后的总资产会出现 ≠ 多个账户相加的和
        let totalAssets = this.$globalFunc.accAdd(totalDisplay, otcTotalDisplay)
            totalAssets = this.$globalFunc.accAdd(totalAssets, futuresTotalDisplay)
        let totalAssetsDisplay = this.$globalFunc.accFixed(totalAssets, 8);

        //计算我的钱包估值
        let exchangeRate = this.$globalFunc.accMul(this.$globalFunc.accMul(totalDisplay, this.$store.state.exchange_rate.btcExchangeRate || 0), this.exchangRateDollar)
        //计算法币账户估值
        let otcExchangeRate = this.$globalFunc.accMul(this.$globalFunc.accMul(otcTotalDisplay, this.$store.state.exchange_rate.btcExchangeRate || 0), this.exchangRateDollar)

        //精度处理
        let exchangeRateDisplay = this.$globalFunc.accFixed2(exchangeRate,2)
        let otcExchangeRateDisplay = this.$globalFunc.accFixed2(otcExchangeRate,2)

        //合约保证金
        let totalMarginBalanceDisplay = this.$globalFunc.accFixed(this.totalMarginBalance, 8);
        //合约账户余额
        let totalWalletBalanceDisplay = this.$globalFunc.accFixed(this.totalWalletBalance, 8);
        //合约账户未实现盈亏
        let totalUnrealizedProfitDisplay = this.$globalFunc.accFixed(this.totalUnrealizedProfit, 8);

        //合约保证金余额估值
        let totalMarginBalanceRate = this.$globalFunc.accMul(totalMarginBalanceDisplay, this.exchangRateDollar)
        let totalMarginBalanceRDis = this.$globalFunc.accFixed2(totalMarginBalanceRate,2)
        //合约账户余额估值
        let totalWalletBalanceRate = this.$globalFunc.accMul(totalWalletBalanceDisplay, this.exchangRateDollar)
        let totalWalletBalanceRDis = this.$globalFunc.accFixed2(totalWalletBalanceRate,2)
        //合约账户未实现盈亏估值
        let totalUnrealizedProfitRate = this.$globalFunc.accMul(totalUnrealizedProfitDisplay, this.exchangRateDollar)
        let totalUnrealizedProfitRDis = this.$globalFunc.accFixed2(totalUnrealizedProfitRate,2)


        //需要截取后的数值相加，如果用接口返回真实的数据相加，截取后的总估值会出现 ≠ 多个账户估值相加的和
        let totalAssetsExchangeRate = this.$globalFunc.accAdd(exchangeRateDisplay, otcExchangeRateDisplay)
            totalAssetsExchangeRate = this.$globalFunc.accAdd(totalAssetsExchangeRate, totalWalletBalanceRDis)
        let totalAssetsExchangeRateDisplay = this.$globalFunc.accFixed2(totalAssetsExchangeRate, 2)

        // console.log('totalDisplay otcTotalDisplay totalAssetsDisplay =',totalDisplay, otcTotalDisplay, totalAssetsDisplay)
        // console.log('exchangeRateDisplay otcExchangeRateDisplay totalAssetsExchangeRateDisplay =',this.$globalFunc.accFixed(this.$globalFunc.accAdd(exchangeRateDisplay, otcExchangeRateDisplay),2) , totalAssetsExchangeRate,this.$globalFunc.accFixed(this.$globalFunc.accAdd(exchangeRateDisplay, otcExchangeRateDisplay),2) == totalAssetsExchangeRate)

        // console.log('this.otcCurrencyList',this.otcCurrencyList);


        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.bgAssetPageTop},PlatformOS == 'ios' && styles.containerMargin || {}]}>
                <NavHeader
                    headerTitle={'资产'}
                    navStyle={{backgroundColor:StyleConfigs.bgAssetPageTop}}
                    headerTitleStyle={{color:StyleConfigs.txtWhite}}
                    touchCompRight={<Image style={{width: getWidth(56), height: getWidth(56)}}
                                           source={HistoricalRecordsIcon}
                                           resizeMode={'contain'}
                    />}
                    touchCompRightClick={this.goToHistoricalRecords}
                />

                {/*总资产 begin*/}
                <ImageBackground style={styles.totalAssetBox2}>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.changeAssetShow}
                        style={styles.totalAssetTitleTouch}
                    >
                        <View style={[styles.totalAssetTitleBox]}>
                            <Text allowFontScaling={false} style={[baseStyles.text9FA7B8, styles.totalAssetTitle]}>总资产折合(BTC)</Text>

                            {
                                this.totalAssetShow ?
                                    <Image source={EyeOpen} style={styles.eyeIcon}/>
                                    :
                                    <Image source={EyeClose} style={styles.eyeIcon}/>
                            }
                        </View>
                    </TouchableOpacity>

                    <View style={styles.totalAssetDetailBox}>
                        {
                            this.totalAssetShow ?
                                <Text
                                    allowFontScaling={false}
                                    style={[baseStyles.textWhite, styles.totalAssetBTC]}>{(totalAssetsDisplay || '-----')} </Text>
                                :
                                <Text
                                    allowFontScaling={false}
                                    style={[baseStyles.textWhite, styles.totalAssetBTC]}>*****</Text>
                        }

                        {
                            this.totalAssetShow ?
                                <Text
                                    allowFontScaling={false}
                                    style={[baseStyles.textWhite, styles.totalAssetRMB,{opacity:0.8}]}>≈{(totalAssetsExchangeRateDisplay || '-----')}CNY</Text>
                                :
                                <Text
                                    allowFontScaling={false}
                                    style={[baseStyles.textWhite, styles.totalAssetRMB,{opacity:0.8},styles.totalAssetRMBHide]}>{''}</Text>

                        }


                    </View>
                    <View style={styles.operTouch}>
                        <TouchableOpacity
                            style={[styles.rechargeTouch]}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={()=>{
                                this.$router.push('AssetPageSearch')
                            }}
                        >
                            <Image
                                source={rechargeIcon}
                                style={styles.rechargeImage}
                            />
                            <Text
                                style={styles.rechargeText}
                                allowFontScaling={false}
                            >充币</Text>
                        </TouchableOpacity>
                        <View style={styles.rechargeLine}/>
                        <TouchableOpacity
                            style={[styles.rechargeTouch,styles.withdrawalsTouch]}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={()=>{
                                this.$router.push('AssetPageSearch')
                            }}
                        >
                            <Image
                                source={withdrawalsIcon}
                                style={styles.rechargeImage}
                            />
                            <Text
                                style={styles.rechargeText}
                                allowFontScaling={false}
                            >提币</Text>
                        </TouchableOpacity>
                        <View style={styles.rechargeLine}/>
                        <TouchableOpacity
                            style={[styles.rechargeTouch,styles.withdrawalsTouch]}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={()=>{
                                this.$globalFunc.lookForward()
                                // this.$router.push('AssetPageSearch')
                            }}
                        >
                            <Image
                                source={internalTransferIcon}
                                style={styles.rechargeImage}
                            />
                            <Text
                                style={styles.rechargeText}
                                allowFontScaling={false}
                            >内转</Text>
                        </TouchableOpacity>
                        <View style={styles.rechargeLine}/>
                        <TouchableOpacity
                            style={[styles.rechargeTouch,styles.withdrawalsTouch]}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={()=>{
                                this.$globalFunc.lookForward()
                                // this.$router.push('AssetPageSearch')
                            }}
                        >
                            <Image
                                source={lockHouseIcon}
                                style={styles.rechargeImage}
                            />
                            <Text
                                style={styles.rechargeText}
                                allowFontScaling={false}
                            >锁仓</Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>

                {/*切换账户类型 begin*/}
                <View style={[styles.assetCheckBox,baseStyles.flexRowAround]}>
                    <TouchableOpacity
                        style={[styles.assetCheckItem,this.assetAccountType == 'wallet' && styles.assetCheckItemSelected || {}]}
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={()=>{
                            // this.$globalFunc.lookForward()
                            // this.$router.push('AssetPageSearch')

                            this.changeAssetAccountType('wallet');
                        }}
                    >
                        <Text
                            style={[styles.assetCheckItemText,this.assetAccountType == 'wallet' && styles.assetCheckItemTextSelected || {}]}
                            allowFontScaling={false}
                        >我的钱包</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.assetCheckItem,this.assetAccountType == 'currency' && styles.assetCheckItemSelected || {}]}
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={()=>{
                            // this.$globalFunc.lookForward()
                            // this.$router.push('AssetPageSearch')
                            this.changeAssetAccountType('currency');
                        }}
                    >
                        <Text
                            style={[styles.assetCheckItemText,this.assetAccountType == 'currency' && styles.assetCheckItemTextSelected || {}]}
                            allowFontScaling={false}
                        >法币账户</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.assetCheckItem,this.assetAccountType == 'futures' && styles.assetCheckItemSelected || {}]}
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={()=>{
                            // this.$globalFunc.lookForward()
                            // this.$router.push('AssetPageSearch')
                            this.changeAssetAccountType('futures');
                        }}
                    >
                        <Text
                            style={[styles.assetCheckItemText,this.assetAccountType == 'futures' && styles.assetCheckItemTextSelected || {}]}
                            allowFontScaling={false}
                        >合约账户</Text>
                    </TouchableOpacity>
                </View>
                {/*切换账户类型 end*/}

                {/*单个账户资产 start*/}
                {this.assetAccountType == 'wallet' &&
                    <View style={styles.singleAccountBox}>
                        <Text style={styles.singleAccountTitle}>我的钱包总资产折合(BTC)</Text>
                        <View style={styles.singleAccountVal}>
                            <Text style={styles.singleAccountTotal}>{this.totalAssetShow ? (totalDisplay || '-----') : '*****'}</Text>
                            <Text style={styles.singleAccountValuation}> {this.totalAssetShow ? ('≈' + (exchangeRateDisplay || '-----') + 'CNY') : ''}</Text>
                        </View>
                    </View>
                        || this.assetAccountType == 'currency' &&
                    <View style={styles.singleAccountBox}>
                        <Text style={styles.singleAccountTitle}>法币账户总资产折合(BTC)</Text>
                        <View style={styles.singleAccountVal}>
                            <Text style={styles.singleAccountTotal}>{this.totalAssetShow ? (otcTotalDisplay || '-----') : '*****'}</Text>
                            <Text style={styles.singleAccountValuation}> {this.totalAssetShow ? ('≈' + (otcExchangeRateDisplay || '-----') + 'CNY') :''}</Text>
                        </View>
                    </View>
                        ||
                    <View style={[styles.singleAccountBox,styles.accountBoxFutures]}>
                        <Text style={styles.marginBalanceTitle}>保证金余额</Text>
                        <Text style={styles.marginBalanceVal}>{this.totalAssetShow ? (totalMarginBalanceDisplay || '-----') : '*****'} USDT</Text>
                        <Text style={styles.marginBalanceCNY}>{this.totalAssetShow ? ('≈' + (totalMarginBalanceRDis || '-----') + 'CNY') :''}</Text>
                        <View style={[baseStyles.flexRow,styles.marginBalanceBot]}>
                            <View style={styles.itemBalanceBox}>
                                <Text style={styles.itemBalanceTitle}>账户余额</Text>
                                <Text style={styles.itemBalanceVal}>{this.totalAssetShow ? (totalWalletBalanceDisplay || '-----') : '*****'}</Text>
                                <Text style={styles.itemBalanceCNY}>{this.totalAssetShow ? ('≈' + (totalWalletBalanceRDis || '-----') + 'CNY') :''}</Text>
                            </View>
                            <View style={styles.itemBalanceBox}>
                                <Text style={styles.itemBalanceTitle}>未实现盈亏</Text>
                                <Text style={styles.itemBalanceVal}>{this.totalAssetShow ? (totalUnrealizedProfitDisplay || '-----') : '*****'}</Text>
                                <Text style={styles.itemBalanceCNY}>{this.totalAssetShow ? ('≈' + (totalUnrealizedProfitRDis || '-----') + 'CNY') :''}</Text>
                            </View>
                        </View>
                    </View>

                }
                {/*单个账户资产 end*/}

                {/*<View style={styles.totalAssetBox}>*/}
                    {/*<TouchableOpacity*/}
                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                        {/*onPress={this.changeAssetShow}*/}
                    {/*>*/}
                        {/*<View style={[styles.totalAssetTitleBox]}>*/}
                            {/*<Text allowFontScaling={false} style={[baseStyles.text9FA7B8, styles.totalAssetTitle]}>总资产</Text>*/}

                            {/*{*/}
                                {/*this.totalAssetShow ?*/}
                                    {/*<Image source={EyeOpen} style={styles.eyeIcon}/>*/}
                                    {/*:*/}
                                    {/*<Image source={EyeClose} style={styles.eyeIcon}/>*/}
                            {/*}*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                    {/*<View style={styles.totalAssetDetailBox}>*/}
                        {/*{*/}
                            {/*this.totalAssetShow ?*/}
                                {/*<Text*/}
                                    {/*allowFontScaling={false}*/}
                                    {/*style={[baseStyles.textBlue, styles.totalAssetBTC]}>{this.$globalFunc.accFixed(total, 8)} BTC</Text>*/}
                                {/*:*/}
                                {/*<Text*/}
                                    {/*allowFontScaling={false}*/}
                                    {/*style={[baseStyles.textBlue, styles.totalAssetBTC]}>****</Text>*/}
                        {/*}*/}

                        {/*{*/}
                            {/*this.totalAssetShow ?*/}
                                {/*<Text*/}
                                    {/*allowFontScaling={false}*/}
                                    {/*style={[baseStyles.text9FA7B8, styles.totalAssetRMB]}>￥{this.totalAssetShow ? this.$globalFunc.accFixed2(exchangeRate, 2) : '----'}</Text>*/}
                                {/*:*/}
                                {/*<Text*/}
                                    {/*allowFontScaling={false}*/}
                                    {/*style={[baseStyles.text9FA7B8, styles.totalAssetRMB,styles.totalAssetRMBHide]}>****</Text>*/}

                        {/*}*/}


                    {/*</View>*/}

                {/*</View>*/}
                {/*总资产 end*/}
                {this.assetAccountType != 'futures' &&
                    <View style={styles.assetsTitleBox}>
                    {/*<Text style={styles.assetsTitle}>资产明细</Text>*/}
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={styles.assetsTitleTouch}
                        onPress={this.hideCurrency}
                    >
                        {
                            !this.hide0AssetCurrency &&
                            <Image source={HideAssets} style={styles.hideImg} resizeMode={'contain'}/>
                            ||
                            <Image source={ShowAssets} style={styles.hideImg} resizeMode={'contain'}/>
                        }
                        <Text style={styles.hideText}>隐藏小额币种</Text>
                    </TouchableOpacity>
                </View>}
                {/*资产列表 begin*/}
                {this.assetAccountType != 'futures' &&
                    <View
                        style={styles.listBox}
                    >
                        {this.assetAccountType == 'wallet' &&
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={[...this.$store.state.currency.values()].filter((item,i,arr)=>{

                                    let isDisplay = (Number(item.displayTime) < Number(this.$store.state.serverTime)/1000);
                                    return isDisplay

                                })}
                                renderItem={this._renderCurrencyItem}
                                keyExtractor={(item, index) => index.toString()}
                                // getItemLayout={(data, index) => (//为了避免资产页只刷新一屏的BUG暂时注释
                                //     {
                                //         length: getHeight(106),
                                //         offset: getHeight(106) * index,
                                //         index
                                //     }
                                // )}
                            />
                        ||
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={[...this.$store.state.currency.values()].filter((item,i,arr)=>{

                                    let isDisplay = (Number(item.displayTime) < Number(this.$store.state.serverTime)/1000);
                                    //法币币种
                                    let isOtcCurrency = this.otcCurrencyList.indexOf(item.currency) > -1
                                    return isDisplay && isOtcCurrency
                                })}
                                renderItem={this._renderCurrencyItem}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        }
                    </View>
                    || null
                }

                {this.assetAccountType == 'futures' &&
                    <ScrollView
                        style={styles.listBox}
                        showsVerticalScrollIndicator={false}
                        // onMomentumScrollEnd={this.scrollEnd}
                        // canCancelContentTouches={false}
                        ref={'scrollBox'}
                    >
                        <View style={[baseStyles.flexRow,styles.fAssetTitleBox]}>
                            <TouchableOpacity
                                style={[styles.fAssetTitleTouch]}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={()=>{
                                    this.changefuturesShowType('holdPosition');
                                }}
                            >
                                <Text style={[styles.fAssetTitle,this.futuresShowType == 'holdPosition' && styles.fAssetTitleSelected || null]}>持有仓位</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.fAssetTitleTouch,styles.fAssetTitleTouch2]}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={()=>{
                                    this.changefuturesShowType('allFuturesAsset');
                                }}
                            >
                                <Text style={[styles.fAssetTitle,this.futuresShowType == 'allFuturesAsset' && styles.fAssetTitleSelected || null]}>全部资产</Text>
                            </TouchableOpacity>
                        </View>


                        {(this.futuresShowType == 'holdPosition' && this.positionArr.length > 0) &&
                            this.positionArr.map((fv,i) => {
                                return <View key={i} style={styles.itemPositionBox}>
                                    <View style={[baseStyles.flexRow,styles.itemPositionTitleBox]}>
                                        <Text style={[styles.itemPosType,fv.positionAmt > 0 && styles.itemPosTypeBuy || {}]}>{fv.positionAmt > 0 ? '买' : '卖'}</Text>
                                        <Text style={styles.itemPosSymbol}>{fv.symbol}</Text>
                                    </View>
                                    {/*<Text style={styles.itemPosTitleBox}>全仓 20X</Text>*/}
                                    <View style={[baseStyles.flexRow,styles.itemPosDetailBox]}>
                                        <View style={styles.itemPosDetailOne}>
                                            <Text style={styles.itemPosDetailTitle}>持仓数量(BTC)</Text>
                                            <Text style={styles.itemPosDetailVal}>{fv.positionAmt}</Text>
                                        </View>
                                        <View style={styles.itemPosDetailOne}>
                                            <Text style={styles.itemPosDetailTitle}>未实现盈亏</Text>
                                            <Text style={[styles.itemPosDetailVal,fv.unrealizedProfit > 0 && baseStyles.textGreen || baseStyles.textRed]}>{fv.unrealizedProfit}</Text>
                                        </View>
                                    </View>
                                    <View style={[baseStyles.flexRow,styles.itemPosDetailBox,styles.itemPosDetailBox2]}>
                                        <View style={styles.itemPosDetailOne}>
                                            <Text style={styles.itemPosDetailTitle}>开仓价格</Text>
                                            <Text style={styles.itemPosDetailVal}>{this.$globalFunc.accFixed(fv.entryPrice,2)}</Text>
                                        </View>
                                        <View style={styles.itemPosDetailOne}>
                                            <Text style={styles.itemPosDetailTitle}>标记价格</Text>
                                            <Text style={styles.itemPosDetailVal}>{this.$globalFunc.accFixed(fv.markPrice,2)}</Text>
                                        </View>
                                    </View>
                                </View>
                            })
                            || (this.futuresShowType == 'holdPosition' && this.positionArr.length <= 0) && this._renderEmptyComponent() ||
                            <View stlye={styles.currencyItemBoxTouch}>
                                <View style={[styles.currencyItemBox,styles.currencyItemFirstBox]}>
                                    <View style={styles.currencyItemLeft}>
                                        <Text allowFontScaling={false} style={[baseStyles.textCurrencyTitle, styles.currencyText]}>{this.futuresCurrency}</Text>
                                    </View>
                                    <View style={styles.currencyItemRight}>
                                        {/*<Image source={IntoIcon} style={styles.intoIcon}/>*/}
                                    </View>
                                </View>
                                <View style={[baseStyles.flexRow,styles.itemLineBot]}>
                                    <View style={styles.futuresAssetColumn1}>
                                        <Text style={styles.itemSectionTitle}>账户余额</Text>
                                        {
                                            this.totalAssetShow ?
                                                <Text style={styles.itemSectionNum}>{this.balance.walletBalance > 0 && this.$globalFunc.accFixed(this.balance.walletBalance, this.currencyJingDU[this.futuresCurrency] || 3) || '0'}</Text>
                                                :
                                                <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTotal]}>****</Text>
                                        }
                                    </View>
                                    <View style={styles.futuresAssetColumn1}>
                                        <Text style={styles.itemSectionTitle}>可用划转余额</Text>
                                        {
                                            this.totalAssetShow ?
                                                <Text style={styles.itemSectionNum}>{this.balance.availableBalance > 0 && this.$globalFunc.accFixed(this.balance.availableBalance, this.currencyJingDU[this.futuresCurrency] || 3) || '0'}</Text>
                                                :
                                                <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTotal]}>****</Text>
                                        }
                                    </View>
                                </View>

                            </View>

                        }





                    </ScrollView>
                    || null
                }

                {/*资产列表 end*/}


                {/*加载中*/}
                {
                    !(currencyArr.length > 0) && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
