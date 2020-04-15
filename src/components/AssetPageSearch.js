/**
 * hjx 2018.4.16
 */

import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View,ImageBackground,SectionList,StyleSheet,TextInput} from 'react-native';
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
import searchIcon from '../assets/AssetPage/search.png'
import rechargeIcon from '../assets/AssetPage/recharge.png'
import withdrawalsIcon from '../assets/AssetPage/withdrawals.png'
import device from "../configs/device/device";
import Env from  '../configs/environmentConfigs/env.js'
import IntoIcon from '../assets/MinePage/into-icon.png'

@observer
export default class AssetPageSearch extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    // @observable
    // loading = true

    // @observable
    // currencyReady = false

    // @observable
    // accountReady = false


    @observable
    totalAssetShow = true

    // @observable
    // currency = []

    @observable
    getAccountInterval = null

    @observable
    exchangeRate = 0

    @observable
    exchangeRateInterval = null

    // @computed get currency(){
    //     var currencyData = {};
    //     [...this.$store.state.currency.values()].map((item,i,arr)=>{
    //         if((Number(item.displayTime) < Number(this.$store.state.serverTime)/1000)){
    //             let k = item.currency[0] && item.currency[0].toUpperCase();
    //             if(!currencyData[k]){
    //                 currencyData[k]= {letter:k.toUpperCase(),data:[]};
    //             }
    //             currencyData[k].data.push(item);
    //         }
    //     })
    //     var currencyArr = [];
    //     for(let k in currencyData){
    //         currencyArr.push(currencyData[k]);
    //     }
    //     return currencyArr
    // }

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.state={
            currency : this.operCurrency()
        }
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
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


    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }



    operCurrency=()=>{
        var currencyData = {};
        [...this.$store.state.currency.values()].map((item,i,arr)=>{
            if((Number(item.displayTime) < Number(this.$store.state.serverTime)/1000)){
                let k = item.currency[0] && item.currency[0].toUpperCase();
                if(!currencyData[k]){
                    currencyData[k]= {letter:k.toUpperCase(),data:[]};
                }
                currencyData[k].data.push(item);
            }
        })
        var currencyArr = [];
        for(let k in currencyData){
            currencyArr.push(currencyData[k]);
        }
        return currencyArr
    }

    //搜索框内容改变
    changeText = (text) => {
        console.log("改变的文本: " + text);
        text = text.trim();

        var currency = this.operCurrency();

        if(text == ''){
            console.log("===数据为空刷新===")
            this.setState({
                currency:currency
            })
            return;
        }

        // console.log("打印setstate===================")
        // let isChinese = /^[\u4e00-\u9fa5]/.test(text);//是否是中文
        // console.log("===是否有中文===",isChinese)

        // if () {//是否有中文
        let mCityData = [];
        // console.log("原始数据: " ,cityTotalDtata);
        for (let i = 0; i < currency.length; i++) {
            let data = currency[i].data;
            console.log("data = " + data);

            var matchData = [];
            for (let j = 0; j < data.length; j++) {
                // console.log("字符串是否相等"+data[j].name);
                // console.log("字符串是否相等"+data[j].name.includes(text));

                // if ((isChinese && !data[j].name.includes(text)) && (!isChinese && !data[j].pinyin.includes(text.toUpperCase())))continue;
                if (!data[j].currency.includes(text) && !data[j].currency.includes(text.toUpperCase()) && !data[j].currency.includes(text.toUpperCase()))continue;

                console.log("this is match data = " , currency[i].data);
                matchData.push(data[j]);
            }
            //内层循环结束
            console.log("matchData = " ,matchData);
            if (!matchData.length)continue;

            let obj = {'letter': currency[i].letter, 'data': matchData};
            mCityData.push(obj);
        }
        // console.log("过滤后的数据: "+mCityData );
        // mCityData.map((item, i) => {
        //     console.log("\n" + item.data);
        // })
        this.updateData(mCityData);

        // } else {//否则是英文
        //
        //     for (let i = 0; i < cityTotalDtata.length; i++) {
        //         console.log("===英文===")
        //         // console.log("打印改变的文字 " + text.toUpperCase());
        //         if (cityTotalDtata[i].letter == text.toUpperCase()) {
        //             let mCityData = [];
        //             mCityData.push(cityTotalDtata[i]);
        //             this.updateData(mCityData);
        //             return;
        //         }
        //     }
        // }

    }
    //更新数据
    updateData = (mCityData) => {
        console.log("更新的数据: " , mCityData);
        this.setState({
            currency: mCityData,
        })
    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
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

            //回到币种充值页面
            if(this.$beforeParams && this.$beforeParams.changeCurrency){

                let type = this.$beforeParams.type;
                let currencyObj = this.$store.state.currency.get(item.currency)

                if(type == 'recharge'){

                    let rechargeOpenTime = currencyObj && currencyObj.rechargeOpenTime

                    //只有当USDT MONI类型未开放充值时才判断USDT2、3是否开放，当三个都未开放时才拦截
                    if(item.currency == 'USDT' && (currencyObj && !currencyObj.depositEnabled)){

                        let currencyUSDT2 = this.$store.state.currency.get('USDT2')
                        let currencyUSDT3 = this.$store.state.currency.get('USDT3')

                        if((currencyUSDT2 && !currencyUSDT2.depositEnabled) && (currencyUSDT3 && !currencyUSDT3.depositEnabled)){
                            this.$globalFunc.toast('该币种暂未开放充值功能，敬请期待！')
                            return
                        }
                    }


                    if (item.currency != 'USDT' && rechargeOpenTime && this.$store.state.serverTime / 1000 < rechargeOpenTime) {

                        this.$globalFunc.toast('该币种暂未开放充值功能，敬请期待！')

                        return
                    }

                }

                if(type == 'withdrawals'){

                    let withdrawOpenTime = currencyObj && currencyObj.withdrawOpenTime

                    //只有当USDT MONI类型未开放提现时才判断USDT2、3是否开放，当三个都未开放时才拦截
                    if(item.currency == 'USDT' && (currencyObj && !currencyObj.withdrawEnabled)){

                        let currencyUSDT2 = this.$store.state.currency.get('USDT2')
                        let currencyUSDT3 = this.$store.state.currency.get('USDT3')

                        if((currencyUSDT2 && !currencyUSDT2.withdrawEnabled) && (currencyUSDT3 && !currencyUSDT3.withdrawEnabled)){
                            this.$globalFunc.toast('该币种暂未开放提现功能，敬请期待！')
                            return
                        }
                    }

                    if (item.currency != 'USDT' && withdrawOpenTime && this.$store.state.serverTime / 1000 < withdrawOpenTime) {

                        this.$globalFunc.toast('该币种暂未开放提现功能，敬请期待！')
                        return
                    }

                }

                this.$beforeParams.changeCurrency(item);
                this.goBack();
                return
            }

            //回到币种详情页
            this.$router.push('AssetDetail', {currency: item.currency, fullName: item.description})
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



    _renderSectionHeader = ({section})=> {
        // console.log('_renderSectionHeader',section);
        return (
            <Text style={{width:'100%',height:30,lineHeight:30,color:StyleConfigs.txtBlue,fontSize:StyleConfigs.fontSize14,backgroundColor:StyleConfigs.sectTitleColor,paddingLeft:15}}>
                {section.letter}
            </Text>
        )

    }

    _ItemSeparatorComponent = ()=> {
        return(
            <View style={[{height: StyleSheet.hairlineWidth,backgroundColor: StyleConfigs.listSplitlineColor,opacity:1}]}/>
        )

    }

    //组件会根据每一个section自动识别改组下边的数组，并对每一项渲染，所以就不用在写Flatlist
    _renderItem = ({item,index})=> {
        console.log('_renderRow',item);
        if(item.currency == 'USDT2' || item.currency == 'USDT3')return null//做个加强过滤
        return(
            <TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
                onPress={()=>{
                    console.log('点击了',item);
                    this.pressCurrencyItem(item);
                }}
            >
                <Text style={{width:'100%',height:40,lineHeight:40,color:StyleConfigs.txt4D4D4D,fontSize:StyleConfigs.fontSize14,backgroundColor:"#FFF",paddingLeft:15}}>
                    {item.currency}
                </Text>
            </TouchableOpacity>
        )
    }


    /*----------------------- 挂载 -------------------------*/

    render() {

        // let currencyArr = this.currency

        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602,paddingTop:getDeviceTop(),paddingBottom:getDeviceBottom()}]}>
                {/*<NavHeader*/}
                    {/*headerTitle={'资产'}*/}
                    {/*headerRightTitle={'历史记录'}*/}
                    {/*headerRightOnPress={this.goToHistoricalRecords}*/}
                {/*/>*/}
                {/*资产列表 begin*/}
                <View
                    // onLayout={({nativeEvent: e}) => this.searchLayout(e)}
                    style={[styles.searchBox,PlatformOS == 'ios' && {paddingTop:20} || {}]}>
                    <Image source={searchIcon} style={{width:15,height:15}}/>
                    <TextInput style={styles.inputText}
                               onChangeText={this.changeText}
                               underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                               placeholder='搜索币种'/>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        style={{paddingRight:20}}
                        onPress={this.goBack}
                    >
                        <Text style={{color:StyleConfigs.txt9FA7B8,fontSize:StyleConfigs.fontSize14}}>取消</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.listBox}
                >
                    <SectionList
                        // style={{flex:1,backgroundColor:'green'}}
                        ref={'_sectionList'}//this._sectionList = _sectionList
                        showsVerticalScrollIndicator={false}
                        stickySectionHeadersEnabled={true}//安卓专用,吸顶
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSectionHeader}
                        sections={this.state.currency}
                        keyExtractor={(section, index) => index.toString()}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                    />
                    {/*<View style={styles.letters}>*/}
                        {/*{myLetters.map((letter, index) => this._renderRightLetters(letter, index))}*/}
                    {/*</View>*/}

                </View>
                {/*资产列表 end*/}
            </View>
        )
    }
}
