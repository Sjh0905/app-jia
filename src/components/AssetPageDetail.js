/**
 * hjx 2018.4.16
 */

import React from 'react';
import {FlatList, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetPageDetailStyle'
import Modal from 'react-native-modal'

import BaseButton from './baseComponent/BaseButton'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import filterDefault from '../assets/AssetPageDetail/filter-default.png'
import dealIcon from '../assets/AssetPageDetail/deal-icon.png'
import withdrawalsIcon from '../assets/AssetPageDetail/withdrawals-icon.png'
import rechargeIcon from '../assets/AssetPageDetail/recharge-icon.png'

import MyConfirm from './baseComponent/MyConfirm'
import Env from "../configs/environmentConfigs/env";
import AssetPageDetailMarket from "./AssetPageDetailMarket";
import BindMobile from "./MineBindMobile";
import ModalClose from '../assets/BaseAssets/modal-close.png'
import AssetRecordsItem from "./AssetRecordsItem";

@observer
export default class AssetPageDetail extends RNComponent {


    /*----------------------- data -------------------------*/

    @computed get exchangRateDollar(){
        return this.$store.state.exchangRateDollar
    }

    @computed get identityAuthState(){
        return this.$store.state.getIdentityInfo.identityAuthState
    }

    @computed get currencyJingDU(){
        return this.$store.state.currencyJingDU
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

    @computed get dataList() {
        var data = [];

        let showCurrency = this.currency == 'USDT' ? ['BTC'] : this.currency;//如果当前币种是USDT，默认跳转到BTC_USDT
        Object.keys(this.marketList).forEach(key=>{
            var item = (this.marketList[key] instanceof Array) && this.marketList[key].slice() || []
            // console.log('this is item',item);
            item = item.filter(v => showCurrency.indexOf(v.name) > -1)
            data = data.concat(item)
        })
        return data.slice() || []
    }

    // 加载中
    @observable
    loading = true

    // 去认证的弹窗
    @observable
    showAlert = false;

    @observable
    modalMsg = ''

    @observable
    currencyReady = false

    @observable
    accountReady = false

    @observable
    authStateReady = false


    @observable
    currency = ''

    @observable
    fullName = ''

    @observable
    marketPrice = {}

    @observable
    recordsType = 'recharge'// recharge:充值 withdrawals提现

    @observable
    // Modal弹窗
    showRecordsModal = false;


    state = {
        marketPrice: {}
    }
    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        this.currency = this.$params && this.$params.currency || 'BTC'

        this.fullName = this.$params && this.$params.fullName || ''

        // 如果没有获取
        if (!this.$store.state.currency) {
            this.getCurrency()
        } else {
            this.currencyReady = true
            this.loading = !(this.currencyReady && this.accountReady && this.authStateReady)
            this.getAccounts()
        }

        // 获取汇率

        // this.getExchangeRate()

        // 获取市场价格
        // this.getPrice()

        // socket监听市场价格
        // this.socketGetPrice()

        // 获取认证状态
        this.getAuthState()

        // let routes = this.$router.state.routes;

        // console.log('this is routes',routes);

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


    // 判断验证状态
    @action
    getAuthState = () => {
        if (!this.$store.state.authState) {
            this.$http.send('GET_AUTH_STATE', {
                bind: this,
                callBack: this.re_getAuthState,
                errorHandler: this.error_getAuthState
            })
            return
        }
        // 获取认证状态成功
        this.authStateReady = true
        this.loading = !(this.currencyReady && this.authStateReady && this.authStateReady)
    }


    // 判断验证状态回调
    @action
    re_getAuthState = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return
        this.$store.commit('SET_AUTH_STATE', data.dataMap)
        this.authStateReady = true
        this.loading = !(this.currencyReady && this.authStateReady && this.authStateReady)
    }
    // 判断验证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
    }

    //关闭弹窗
    closeVerifyModal = () =>{
        this.showAlert = false
    }

    goRealNameCertification = ()=>{
        this.showAlert = false
        if(this.modalMsg.indexOf('实名') > -1)this.$router.push('RealNameCertification');
        if(this.modalMsg.indexOf('邮箱') > -1)this.$router.push('BindEmail');
    }

    goBindMobile = () =>{
        this.showAlert = false
        this.$router.push('BindMobile')
    }
    goBindGoogle = () =>{
        this.showAlert = false
        this.$router.push('BindGoogle')
    }

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
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data.dataMap || !data.dataMap.currencys) {
            return
        }
        this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
        this.currencyReady = true
        this.loading = !(this.currencyReady && this.authStateReady && this.authStateReady)
        this.getAccounts()
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
        // 请求各项估值
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
        this.$store.commit('CHANGE_ACCOUNT', data.accounts)
        this.accountReady = true
        this.loading = !(this.currencyReady && this.authStateReady && this.authStateReady)
        // 关闭loading
    }
    // 获取账户信息失败
    @action
    error_getAccount = (err) => {
        console.warn("获取账户内容失败", err)
    }


    // 获取市场信息
    @action
    getPrice = () => {
        this.$http.send('MARKET_PRICES', {
            bind: this,
            callBack: this.re_getPrice,
            errorHandler: this.error_getPrice
        })
    }

    // 获取市场信息回调
    @action
    re_getPrice = (data) => {
        typeof data == 'string' && (data = JSON.parse(data))
        this.setState({marketPrice: Object.assign(this.state.marketPrice, data)})
    }
    // 获取市场信息出错
    @action
    error_getPrice = (err) => {
        console.warn('获取市场价格出错', err)
    }

    // socket监听市场价格
    @action
    socketGetPrice = () => {
        this.$socket.on({
            key: 'topic_prices',
            bind: this,
            callBack: this.re_socketGetPrice
        })
    }

    // socket监听市场价格回调
    @action
    re_socketGetPrice = (data) => {
        this.setState({marketPrice: Object.assign(this.state.marketPrice, data)})
    }

    // 点击市场
    @action
    pressMarketItem = (item) => {

    }


    // 渲染市场价格
    @action
    _renderMarket = (marketPrice) => {


        return (
            <View style={[styles.toTradeBox]}>
                <Text allowFontScaling={false} style={[baseStyles.textColor, styles.toTradeTitle]}>去交易</Text>
                <View style={[styles.toTradeDetailBox]}>
                    <FlatList
                        style={[styles.toTradeDetail]}
                        numColumns={2}
                        data={marketPrice}
                        renderItem={this._renderMarketItem}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            </View>
        )

    }

    @action
    _renderMarketItem = ({item, index}) => {

        return (
            <View style={[styles.marketItemBox, index % 2 != 0 ? styles.marketItemBoxOdd : styles.marketItemBoxEven]}>
                <TouchableOpacity
                    onPress={() => {
                        this.pressMarketItem(item)
                    }}
                    activeOpacity={StyleConfigs.activeOpacity}
                >
                    <View
                        style={[styles.marketItemBg, styles.marketItem]}>
                        <View style={[styles.marketItemTop]}>
                            <Text allowFontScaling={false} style={[baseStyles.textColor, styles.marketName]}>{item.name}</Text>
                            <Text
                                allowFontScaling={false}
                                style={[baseStyles.textColor, styles.marketUpAndDown, item.isUp == 2 && styles.priceUp, item.isUp == 0 && styles.priceDown]}>{item.upAndDown}</Text>
                        </View>
                        <View style={[styles.marketItemBottom]}>
                            <Text allowFontScaling={false} style={[baseStyles.textColor, styles.marketCurrentPrice]}>{item.currentPrice}</Text>
                            <Text allowFontScaling={false} style={[baseStyles.textColor, styles.marketAppraisement]}>￥{item.appraisement}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )

    }

    //充值或者提现页面会用到
    changeCurrency = (item)=>{
        console.log('this item currency');

        this.currency = item.currency || 'BTC'
        this.fullName = item.fullName || ''
        // 如果没有获取
        if (!this.$store.state.currency) {
            this.getCurrency()
        } else {
            this.currencyReady = true
            this.loading = !(this.currencyReady && this.accountReady && this.authStateReady)
            this.getAccounts()
        }
        // 获取认证状态
        this.getAuthState()
    }


    // 去充值
    @action
    goToRecharge = (() => {
        let last = 0;
        return () => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            let currencyObj = this.$store.state.currency.get(this.currency)

            let rechargeOpenTime = currencyObj && currencyObj.rechargeOpenTime

            //只有当USDT MONI类型未开放充值时才判断USDT2是否开放，当两个都未开放时才拦截
            if(this.currency == 'USDT' && (currencyObj && !currencyObj.depositEnabled)){

                let currencyUSDT2 = this.$store.state.currency.get('USDT2')

                if(currencyUSDT2 && !currencyUSDT2.depositEnabled){
                    this.$globalFunc.toast('该币种暂未开放充值功能，敬请期待！')
                    return
                }
            }


            if (this.currency != 'USDT' && rechargeOpenTime && this.$store.state.serverTime / 1000 < rechargeOpenTime) {

                this.$globalFunc.toast('该币种暂未开放充值功能，敬请期待！')

                return
            }

            // 如果没有绑定谷歌或手机，不允许打开充值
            if (!this.$store.state.authState.ga && !this.$store.state.authState.sms) {
                // this.$globalFunc.toast('请进行手机认证或谷歌认证')
                this.modalMsg = '请先进行手机认证或谷歌认证'
                // 打开到认证窗口
                this.showAlert = true;
                return
            }

            if(!this.$store.state.authState.email){
                // this.$globalFunc.toast('请进行邮箱认证')
                this.modalMsg = '请先进行邮箱认证'
                // 打开到认证窗口
                this.showAlert = true;
                return
            }


            this.$router.push('Recharge', {currency: this.currency,changeCurrency1:this.changeCurrency})
        }
    })()

    // 去提现
    @action
    goToWithdrawals = (() => {
        let last = 0;
        return (available) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();


            let currencyObj = this.$store.state.currency.get(this.currency)

            let withdrawOpenTime = currencyObj && currencyObj.withdrawOpenTime

            //只有当USDT MONI类型未开放提现时才判断USDT2是否开放，当两个都未开放时才拦截
            if(this.currency == 'USDT' && (currencyObj && !currencyObj.withdrawEnabled)){

                let currencyUSDT2 = this.$store.state.currency.get('USDT2')

                if(currencyUSDT2 && !currencyUSDT2.withdrawEnabled){
                    this.$globalFunc.toast('该币种暂未开放提现功能，敬请期待！')
                    return
                }
            }

            if (this.currency != 'USDT' && withdrawOpenTime && this.$store.state.serverTime / 1000 < withdrawOpenTime) {

                this.$globalFunc.toast('该币种暂未开放提现功能，敬请期待！')

                return
            }

            if (currencyObj.withdrawDisabled) {//目前接口没有withdrawDisabled这个属性
                this.$globalFunc.toast('该币种暂未开放提现功能，敬请期待！')
                return
            }


            let identityAuthState = this.$store.state.getIdentityInfo.identityAuthState

            // 如果是认证了还没有通过
            if(identityAuthState == '5'){
                this.$globalFunc.toast('请耐心等待实名认证反馈');
                return;
            }

            // 如果没有实名认证不允许打开提现
            if (!this.$store.state.getIdentityInfo.identityAuth) {
                // this.$globalFunc.toast('请先进行实名认证')
                this.modalMsg = '请先进行实名认证'
                // 打开到认证窗口
                this.showAlert = true;
                return
            }

            // 如果没有绑定谷歌或手机，不允许打开提现
            if (!this.$store.state.authState.ga && !this.$store.state.authState.sms) {
                // this.$globalFunc.toast('请进行手机认证或谷歌认证')
                this.modalMsg = '请先进行手机认证或谷歌认证'
                // 打开到认证窗口
                this.showAlert = true;
                return
            }

            if (!this.$store.state.authState.email) {
                // this.$globalFunc.toast('请进行邮箱认证')
                this.modalMsg = '请先进行邮箱认证'
                // 打开到认证窗口
                this.showAlert = true;
                return
            }

            if (available === 0) {
                this.$globalFunc.toast('资产为0，请先充值')
                return
            }


            this.$router.push('Withdrawals', {currency: this.currency, available: this.$globalFunc.accFixed(available, 8),changeCurrency1:this.changeCurrency})
        }
    })()

    @action
    onCancel = ()=>{
        this.showAlert = false;
    }

    @action
    onGoCertification = ()=>{
        this.showAlert = false;
        // 这里要根据获取到的步骤情况跳转到身份证 或者 身份证反面 或者 视频验证 这里先按照身份证计算
        if(!this.$store.state.getIdentityInfo.identityAuth){
            this.$router.push(
                this.$store.state.getIdentityInfo.cerificatePage
                ,{
                    cardType: this.$store.state.getIdentityInfo.cardType,
                    from: 'AssetDetail'
                });
        }
    }

    /*----------------------- 充提记录弹窗相关操作 -------------------------*/
    @action
    showRecordsModalFunc = ()=>{
        this.showRecordsModal = true
        setTimeout(()=>{
            this.refs.scrollView.scrollToEnd();
        })
    }

    @action
    hideRecordsModalFunc = ()=>{
        // if(!this.showRecordsModal)return;
        this.refs.scrollView.scrollTo({
            y: 0,animated: true
        });
        setTimeout(()=>{
            this.showRecordsModal = false;
        },17)
    }

    @action
    onRecharge = ()=>{
        this.recordsType = 'recharge'
        this.hideRecordsModalFunc();
    }

    @action
    onWithdrawals = ()=>{
        this.recordsType = 'withdrawals'
        this.hideRecordsModalFunc();
    }
    /*----------------------- 充提记录弹窗相关操作end -------------------------*/

    /*----------------------- 跳转到交易页 -------------------------*/
    @action
    gotoTrade = (() => {
        let last = 0;
        return (symbol) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            symbol = symbol || {}

            this.$store.commit('SET_SYMBOL', (symbol.name || 'BTC') +'_' + (symbol.denominator || 'USDT'))
            this.notify({key: 'CHANGE_SYMBOL'})
            // this.notify({key: 'CLEAR_INPUT'});

            //传递时价过去，延迟是为了等待priceNow有数据
            setTimeout(()=>{
                let quoteScale = this.tradeLObj[symbol.name+"_"+symbol.denominator] ? (this.tradeLObj[symbol.name+"_"+symbol.denominator].quoteScale || 4) : 4
                let price = this.priceNow.price && this.marketUseRate[symbol.denominator] && this.$globalFunc.accFixed2((this.priceNow.price * this.marketUseRate[symbol.denominator]) || 0, quoteScale) || (symbol.value && symbol.value[4] || '');
                this.notify({key: 'CLEAR_INPUT'},false,price);

            },500)

            this.$router.goBackToRoute('Home')
            setTimeout(()=>{
                this.notify({key: 'CHANGE_TAB'}, 2);
                setTimeout(()=>{
                    this.notify({key: 'SET_TAB_INDEX'},0);
                    this.notify({key: 'CLEAR_INPUT'},false);
                })
            })
            // this.$router.goBack()
        }

    })()
    /*----------------------- 跳转到交易页end -------------------------*/


    /*----------------------- 挂载 -------------------------*/

    render() {

        let currencyObj = this.$store.state.currency.get(this.currency)

        let total = currencyObj.total
        let available = currencyObj.available
        let frozen = currencyObj.frozen
        let appraisementToBTC = currencyObj.appraisement
        let appraisementToRMB = this.$globalFunc.accMul(this.$globalFunc.accMul(currencyObj.appraisement, this.$store.state.exchange_rate.btcExchangeRate || 0), this.exchangRateDollar)

        // console.warn('this is marketPrice', this.state.marketPrice)

        let marketPrice = Object.keys(this.state.marketPrice)
            .filter(v =>
                v.split('_')[0] == this.currency
            ).map((v) => {
                let currency = v.split('_')
                let price = this.state.marketPrice[v]
                if (!price) return
                let isUp = 2
                let upAndDown = this.$globalFunc.accFixed(this.$globalFunc.accDiv(this.$globalFunc.accMinus(price[4], price[1]), price[1]), 4)
                let upAndDownStr = ''

                // 涨为2，跌为0，平为1
                if (upAndDown > 0) {
                    isUp = 2
                    upAndDownStr = '+' + this.$globalFunc.accMul(upAndDown, 100) + '%'
                }
                if (upAndDown == 0) {
                    isUp = 1
                    upAndDownStr = '0.00%'
                }
                if (upAndDown < 0) {
                    isUp = 0
                    upAndDownStr = this.$globalFunc.accMul(upAndDown, 100) + '%'
                }

                return {
                    name: currency[0] + '/' + currency[1],
                    currentPrice: this.$globalFunc.accFixed(price[4], 8),
                    upAndDown: upAndDownStr,
                    isUp: isUp,
                    appraisement: this.$globalFunc.accFixed(this.$globalFunc.accMul(this.$globalFunc.accMul(this.$store.state.currency.get(currency[0]).rate, price[4]), this.$store.state.exchange_rate.btcExchangeRate || 0), 2)
                }
            })
        let showCurrency = this.currency == 'USDT' ? ['BTC','ETH'] : this.currency

        return (
            <View style={[styles.container, styles.container2]}>
                <NavHeader goBack={this.goBack}/>
                <View style={{backgroundColor:StyleConfigs.bgColor,flex:1,paddingBottom: getHeight(getDeviceTop(true)+169),}}>

                    {/*币种详情 begin*/}
                    {/*<View style={[styles.boxPadding,{flex:1}]}>*/}

                        {/*/!*币种title begin*!/*/}
                        {/*<View style={styles.titleBox}>*/}
                            {/*<Image source={{uri: Env.networkConfigs.currencyLogoUrl + this.currency + '.png'}}*/}
                                   {/*style={styles.currencyIcon}*/}
                            {/*/>*/}
                            {/*<Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTitle]}>{this.currency}</Text>*/}

                        {/*</View>*/}
                        {/*/!*币种title end*!/*/}

                        {/*/!*币种全称 begin*!/*/}
                        {/*<View style={styles.fullNameBox}>*/}
                            {/*<Text allowFontScaling={false} style={[styles.fullNameText]}>({this.fullName})</Text>*/}
                        {/*</View>*/}
                        {/*/!*币种全称 end*!/*/}


                        {/*/!*币种主要内容 begin*!/*/}
                        {/*<View style={[styles.detailBox]}>*/}
                            {/*<View style={[styles.itemBox]}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemTitle]}>总额</Text>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemArticle]}>*/}
                                    {/*{total == 0 ? '0' :this.$globalFunc.accFixed(total, 8)}*/}
                                {/*</Text>*/}
                            {/*</View>*/}

                            {/*<View style={[styles.itemBox]}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemTitle]}>可用</Text>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemArticle]}>*/}
                                    {/*{available == 0 ? '0' :this.$globalFunc.accFixed(available, 8)}*/}
                                {/*</Text>*/}
                            {/*</View>*/}

                            {/*<View style={[styles.itemBox]}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemTitle]}>冻结</Text>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemArticle]}>*/}
                                    {/*{frozen == 0 ? '0' :this.$globalFunc.accFixed(frozen, 8)}*/}
                                {/*</Text>*/}
                            {/*</View>*/}

                            {/*<View style={[styles.line]}>*/}

                            {/*</View>*/}

                            {/*<View style={[styles.itemBox]}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemTitle]}>估值(BTC)</Text>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemArticle]}>*/}
                                    {/*{appraisementToBTC == 0 ? '0' :this.$globalFunc.accFixed(appraisementToBTC, 8)}*/}
                                {/*</Text>*/}
                            {/*</View>*/}

                            {/*<View style={[styles.itemBox]}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemTitle]}>折合(￥)</Text>*/}
                                {/*<Text allowFontScaling={false} style={[styles.itemArticle]}>{this.$globalFunc.accFixed2(appraisementToRMB, 2)}</Text>*/}
                            {/*</View>*/}

                        {/*</View>*/}
                        {/*/!*币种主要内容 begin*!/*/}

                        {/*/!*去交易 begin*!/*/}
                        {/*/!*{marketPrice.length !== 0 && this._renderMarket(marketPrice)}*!/*/}
                        {/*/!*<Text style={styles.goTradeText}>*!/*/}
                            {/*/!*去交易*!/*/}
                        {/*/!*</Text>*!/*/}
                        {/*<AssetPageDetailMarket showCurrency={showCurrency} page={'OneHome'}/>*/}
                        {/*/!*去交易 end*!/*/}

                    {/*</View>*/}

                    {/*币种名称*/}
                    <Text style={styles.currencyName}>{this.currency}</Text>
                    {/*资产分类*/}
                    <View style={[baseStyles.flexRowBetween,styles.itemLineBot]}>
                        <View style={styles.baseColumn1}>
                            <Text style={styles.itemSectionTitle}>可用</Text>

                            <Text style={styles.itemSectionNum}>
                                {available > 0 && this.$globalFunc.accFixed(available, this.currencyJingDU[this.currency] || 3) || '0'}
                            </Text>

                        </View>
                        <View style={styles.baseColumn2}>
                            <Text style={styles.itemSectionTitle}>冻结</Text>
                            <Text style={styles.itemSectionNum}>
                                {frozen > 0 && this.$globalFunc.accFixed(frozen, this.currencyJingDU[this.currency] || 3) || '0'}</Text>
                        </View>
                        <View style={styles.baseColumn3}>
                            <Text style={[styles.itemSectionTitle,{textAlign:'right'}]}>折合(CNY)</Text>
                            <Text
                                allowFontScaling={false}
                                style={[baseStyles.textWhite, styles.itemSectionNum,{color:StyleConfigs.txt6B7DA2,textAlign:'right'}]}>{this.$globalFunc.accFixed2(appraisementToRMB, 2)}</Text>
                        </View>
                    </View>

                    <View style={[baseStyles.flexRowBetween,styles.recordTitleBox]}>
                        <Text style={styles.recordTitle}>财务记录</Text>
                        <TouchableOpacity style={styles.filterTouch} onPress={this.showRecordsModalFunc}>
                            <Image source={filterDefault} style={styles.filterImg}/>
                        </TouchableOpacity>
                    </View>

                    {
                        this.recordsType == 'recharge' &&
                        <AssetRecordsItem tabLabel={' 充值记录 '} type={'recharge'} currency={this.currency}/>
                    }
                    {
                        this.recordsType == 'withdrawals' &&
                        <AssetRecordsItem tabLabel={' 提现记录 '} type={'withdrawals'} currency={this.currency}/>
                    }

                    {/*币种详情 end*/}

                    {/*充值和提现按钮 begin*/}
                    {/*<View style={[styles.btnBox]}>*/}
                        {/*<View style={[styles.btnLeftBox]}>*/}
                            {/*<BaseButton*/}
                                {/*onPress={() => {this.goToRecharge(available)}}*/}
                                {/*text={'充值'}*/}
                                {/*textStyle={[styles.btnText, baseStyles.textWhite]}*/}
                                {/*style={[styles.btn, styles.rechargeBtn, baseStyles.btnGreen]}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        {/*<View style={[styles.btnRightBox]}>*/}
                            {/*<BaseButton*/}
                                {/*onPress={() => {*/}
                                    {/*this.goToWithdrawals(available)*/}
                                {/*}}*/}
                                {/*text={'提现'}*/}
                                {/*textStyle={[styles.btnText, baseStyles.textWhite]}*/}
                                {/*style={[styles.btn, styles.withdrawalsBtn, baseStyles.btnRed]}*/}
                            {/*/>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                    <View style={[styles.btnBox,baseStyles.flexRowAround]}>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={styles.itembtnView}
                            onPress={() => {this.goToRecharge(available)}}
                        >
                            <Image source={rechargeIcon} style={styles.itemIcon}/>
                            <Text style={styles.itemIconTxt}>充币</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={styles.itembtnView}
                            onPress={() => {this.goToWithdrawals(available)}}
                        >
                            <Image source={withdrawalsIcon} style={[styles.itemIcon,{width:getWidth(116)}]}/>
                            <Text style={styles.itemIconTxt}>提币</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={styles.itembtnView}
                            onPress={() => this.gotoTrade(this.dataList[0])}//默认显示第一个
                        >
                            <Image source={dealIcon} style={[styles.itemIcon]}/>
                            <Text style={[styles.itemIconTxt,baseStyles.textRed]}>交易</Text>
                        </TouchableOpacity>
                    </View>
                    {/*充值和提现按钮 end*/}

                    {/*加载中*/}
                    {
                        this.loading && <Loading leaveNav={true}/>
                    }
                </View>
                {/*充提记录类型选择*/}
                {this.showRecordsModal &&
                    <ScrollView
                        ref={'scrollView'}
                        scrollEnabled={false}
                        style={baseStyles.modalScrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            onPress={this.hideRecordsModalFunc}
                            activeOpecity={1}
                            style={{height: RealWindowHeight}}
                        />
                        <View style={{backgroundColor:StyleConfigs.bgColor}}>
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={baseStyles.modalBtn}
                                textStyle={[baseStyles.modalBtnTxt,this.recordsType == 'recharge' && baseStyles.textRed || {}]}
                                text={'充币'}
                                onPress={this.onRecharge}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={baseStyles.modalPhotoBtn}
                                textStyle={[baseStyles.modalBtnTxt,this.recordsType == 'withdrawals' && baseStyles.textRed || {}]}
                                text={'提币'}
                                onPress={this.onWithdrawals}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                onPress={this.hideRecordsModalFunc}
                                style={baseStyles.modalBtn}
                                textStyle={baseStyles.modalBtnCancleTxt}
                                text={'取消'}
                            />
                        </View>

                    </ScrollView>
                }

                {/*{!!this.showAlert && <MyConfirm okText={'我知道了'} title={'提现提示'} message={['您尚未通过身份验证','请前往二零二零官网','(www.2020.exchange)进行认证']} onSure={this.onCancel} onClose={this.onCancel}/>}*/}

                {/*去认证模态框 begin*/}
                <Modal
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.showAlert}
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                    style={{alignItems:'center'}}
                >
                    <View style={styles.verifyModalBox}>
                        <View style={styles.modalArticleBox}>
                            <Text  allowFontScaling={false} style={styles.modalArticleText}>{this.modalMsg}</Text>
                            {/*{this.modalMsg2 != '' && <Text  allowFontScaling={false} style={styles.modalArticleText}>{this.modalMsg2}</Text>}*/}
                        </View>

                        {
                            this.modalMsg.indexOf('手机') > -1 &&
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.closeVerifyModal}
                                style={styles.modalFooterView}
                            >

                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    style={styles.modalFooterMobile}
                                    onPress={this.goBindMobile}
                                >
                                    <Text  allowFontScaling={false} style={styles.modalFooterText}>绑定手机</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    style={[styles.modalFooterMobile,styles.modalFooterMobileLine]}
                                    onPress={this.goBindGoogle}
                                >
                                    <Text  allowFontScaling={false} style={styles.modalFooterText}>绑定谷歌</Text>
                                </TouchableOpacity>

                            </TouchableOpacity>
                            ||
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.closeVerifyModal}
                                style={styles.modalFooterView}
                            >

                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    style={styles.modalFooterMobile}
                                    onPress={this.closeVerifyModal}
                                >
                                    <Text  allowFontScaling={false} style={styles.modalFooterText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    style={[styles.modalFooterMobile,styles.modalFooterMobileLine]}
                                    onPress={this.goRealNameCertification}
                                >
                                    <Text  allowFontScaling={false} style={styles.modalFooterText}>去认证</Text>
                                </TouchableOpacity>

                            </TouchableOpacity>

                        }

                        {/*<TouchableOpacity*/}
                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                        {/*style={styles.modalFooterBox}*/}
                        {/*onPress={this.goRealNameCertification}*/}
                        {/*>*/}
                        {/*<Text  allowFontScaling={false} style={styles.modalFooterText}>去认证</Text>*/}
                        {/*</TouchableOpacity>*/}

                    </View>

                    {
                        this.modalMsg.indexOf('手机') > -1 &&
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={styles.closeImgTouch}
                            onPress={this.closeVerifyModal}
                        >
                            <Image source={ModalClose} style={styles.closeImg} resizeMode={'contain'}/>
                        </TouchableOpacity>
                    }

                </Modal>
                {/*去认证模态框 end*/}
            </View>
        )
    }
}
