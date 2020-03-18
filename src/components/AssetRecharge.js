/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Clipboard, Image, Text, TextInput, TouchableOpacity, View,Alert, ScrollView} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetRechargeStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import QRCode from 'react-native-qrcode'
import MyAlert from './baseComponent/MyAlert'

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true

    // 币种
    @observable
    currency = ''

    @observable
    address = ''

    @observable
    isEOS = false;

    @observable
    isWCG = false;

    @observable
    memoAddress = '';

    @observable
    publicKey = '';//仅供WCG系列币种使用

    @observable
    showAlert = false;

    @observable
    myAlertContent = '';

    @observable
    usdtChainType = 1;//1:OMNI 2:ERC20

    closeTips = '该币种暂未开放充值功能，敬请期待！'

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.currency = this.$params && this.$params.currency || 'BTC'

        let currencyObj = this.$store.state.currency.get(this.currency)

        //能进入此页面说明至少有一个开放充值，当OMNI关闭时默认显示ERC20
        if(this.currency == 'USDT'){
            let currencyUSDT2 = this.$store.state.currency.get('USDT2')
            this.depositEnabledUSDT = currencyObj && currencyObj.depositEnabled
            this.depositEnabledUSDT2 = currencyUSDT2 && currencyUSDT2.depositEnabled
            !this.depositEnabledUSDT && this.depositEnabledUSDT2 && (this.usdtChainType = 2)

            //如果外边没拦住，提示并返回上一级路由，这种可能性比较小
            if(!this.depositEnabledUSDT && !this.depositEnabledUSDT2){
                this.$globalFunc.toast(this.closeTips);
                this.goBack();
            }
        }

        this.isEOS = currencyObj && currencyObj.memo;
        this.showAlert = this.isEOS;
        this.isWCG = currencyObj && (currencyObj.addressAliasTo == 'WCG' || this.currency == 'WCG')

        this.isEOS && (this.myAlertContent = ('充值' + this.currency + '上的合约币到欧联须同时具备充值地址及' + this.currency + ' memo (备注) , 未遵守' + this.currency + '充值规则将导致资产无法找回。'))
        this.isWCG && (this.myAlertContent = ('充值' + this.currency + '上的合约币到欧联须同时具备充值地址、' + this.currency + ' memo (备注)、'+ this.currency +' publicKey, 未遵守' + this.currency + '充值规则将导致资产无法找回。'))

        this.getRecharge()
        this.changeCurrency1 = this.$beforeParams && this.$beforeParams.changeCurrency1
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

    // 点击复制
    @action
    copyAddress = (address) => {
        Clipboard.setString(address)
        this.$globalFunc.toast('复制成功')
    }

    @action
    isERC20 = () => {
        return (this.currency == "USDT" && this.usdtChainType == 2) ? "USDT2" : this.currency;
    }


// 获取数据
    @action
    getRecharge = () => {
        // let params = {"currency": this.currency}

        this.loading = true;
        let params = {"currency": this.isERC20()}
        this.$http.send('GET_RECHARGE_ADDRESS', {
            bind: this,
            callBack: this.re_getRecharge,
            errorHandler: this.error_getRecharge,
            params: params
        })
    }


    // 初始化返回
    @action
    re_getRecharge = (data) => {
        this.loading = false;
        console.log('充值--', data)
        typeof data == 'string' && (data = JSON.parse(data))
        this.loading = false
        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    Alert.alert("提示", "监测到您的账户存在异常行为，为了亲的资产安全，暂不可用，请联系客服处理", [
                        {
                            text: "我知道了", onPress: () => {
                                this.$router.goBack()
                            }
                        }
                    ])
                    break;
                default:

            }
            return
        }

        if(this.isWCG){
            let address = data.dataMap.addressBean.address || '';
            let addressArr = address.split('?');
            this.address = addressArr[0] || '';
            this.publicKey = addressArr[1] || '';

            return;
        }

        this.address = data.dataMap.addressBean.address;
        this.memoAddress = data.dataMap.addressBean.memoAddress;
        // 加载中关闭
    }
    // 初始化返回出错
    @action
    error_getRecharge = (err) => {
        this.loading = false
        console.warn('获取充值地址失败', err)
    }

    // 去历史记录
    @action
    goToHistoricalRecords = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('RechargeAndWithdrawalsRecords')
        }
    })()

    @action
    onPressAlert = (data)=>{
        if(data.agreement){
            this.showAlert = false;
        }
    }

    @action
    onCloseAlert = (data)=>{
        this.showAlert = false;
        this.goBack()
    }

    changeCurrency = (item)=>{
        console.log('this item currency');

        this.currency = item.currency || 'BTC'

        let currencyObj = this.$store.state.currency.get(this.currency)

        //能进入此页面说明至少有一个开放充值，当OMNI关闭时默认显示ERC20
        if(this.currency == 'USDT'){
            let currencyUSDT2 = this.$store.state.currency.get('USDT2')
            this.depositEnabledUSDT = currencyObj && currencyObj.depositEnabled
            this.depositEnabledUSDT2 = currencyUSDT2 && currencyUSDT2.depositEnabled
            !this.depositEnabledUSDT && this.depositEnabledUSDT2 && (this.usdtChainType = 2)

            //如果外边没拦住，提示并返回上一级路由，这种可能性比较小
            if(!this.depositEnabledUSDT && !this.depositEnabledUSDT2){
                this.$globalFunc.toast(this.closeTips)
                this.goBack();
            }
        }

        this.isEOS = currencyObj && currencyObj.memo;
        this.showAlert = this.isEOS;
        this.isWCG = currencyObj && (currencyObj.addressAliasTo == 'WCG' || this.currency == 'WCG')

        this.isEOS && (this.myAlertContent = ('充值' + this.currency + '上的合约币到欧联须同时具备充值地址及' + this.currency + ' memo (备注) , 未遵守' + this.currency + '充值规则将导致资产无法找回。'))
        this.isWCG && (this.myAlertContent = ('充值' + this.currency + '上的合约币到欧联须同时具备充值地址、' + this.currency + ' memo (备注)、'+ this.currency +' publicKey, 未遵守' + this.currency + '充值规则将导致资产无法找回。'))
        this.getRecharge()

        //调用资产详情页的方法
        this.changeCurrency1(item || {})
    }
    @action
    goToAssetPageSearch =()=>{
        this.$router.push('AssetPageSearch',{changeCurrency:this.changeCurrency,type:'recharge'})
    }

    @action
    setUsdtChainType = (type)=>{

        if(type == 1 && !this.depositEnabledUSDT){
            this.$globalFunc.toast('OMNI暂未开放充值功能，敬请期待！')
            return
        }

        if(type == 2 && !this.depositEnabledUSDT2){
            this.$globalFunc.toast('ERC20暂未开放充值功能，敬请期待！')
            return
        }

        if(this.usdtChainType == type)return;

        this.usdtChainType = type;

        //获取充值地址
        this.getRecharge()
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container,styles.container2]}>
                <NavHeader
                    headerTitle={this.currency + '充值'}
                    goBack={this.goBack}
                    headerRightTitle={'历史记录'}
                    headerRightOnPress={this.goToHistoricalRecords}
                />

                <ScrollView style={[styles.boxPadding,{backgroundColor:StyleConfigs.bgColor,flex:1}]}>
                    <View style={styles.tibiWrap}><Text allowFontScaling={false} style={styles.tibiTxt}>充币</Text></View>
                    {/*选择币种*/}
                    <TouchableOpacity style={styles.xuanzebizhongWrap} activeOpacity={StyleConfigs.activeOpacity}
                                      onPress={this.goToAssetPageSearch}>
                        <Text style={styles.currencyName}>{this.currency}</Text>
                        <Text style={styles.selectCurrency}>{'选择币种 ＞'}</Text>
                    </TouchableOpacity>

                    {/*USDT专有区分链*/}
                    {(this.currency == 'USDT' || this.currency == 'USDT2') &&
                        <Text style={styles.chainNameText}>链名称</Text>
                        ||
                        null
                    }
                    {(this.currency == 'USDT' || this.currency == 'USDT2') &&
                        <View style={styles.chainNameBtnBox}>
                            <TouchableOpacity style={[styles.chainNameBtn,this.usdtChainType == 1 && styles.chainNameBtnSel || null]}
                                              activeOpacity={StyleConfigs.activeOpacity}
                                              onPress={()=>this.setUsdtChainType(1)}>
                                <Text style={[styles.usdtTypeText,this.usdtChainType ==1 && styles.usdtTypeTextSel]}>OMNI</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.chainNameBtn,this.usdtChainType == 2 && styles.chainNameBtnSel || null]}
                                              activeOpacity={StyleConfigs.activeOpacity}
                                              onPress={()=>this.setUsdtChainType(2)}>
                                <Text style={[styles.usdtTypeText,this.usdtChainType ==2 && styles.usdtTypeTextSel]}>ERC20</Text>
                            </TouchableOpacity>
                        </View>
                        ||
                        null
                    }
                    {/*USDT专有区分链 end*/}

                    <View style={styles.rechargeAddressBox2}>
                        {/*<View style={styles.qrCodeDetailBox}>*/}
                            <View style={styles.qrCodeBg}>
                                <QRCode
                                    value={this.address}
                                    size={getWidth(300)}
                                    bgColor={'#1F3F59'}
                                    fgColor={'#F7F8FA'}
                                />
                            </View>
                        {/*</View>*/}

                        <Text allowFontScaling={false} style={[styles.rechargeAddressTitle]}>充币地址</Text>
                        <Text allowFontScaling={false} style={styles.rechargeAddress2}>{this.address}</Text>
                        <TouchableOpacity
                            style={styles.copyBtnTouch}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={() => {
                                this.copyAddress(this.address)
                            }}
                        >
                            <Text allowFontScaling={false} style={[baseStyles.text6B7DA2, baseStyles.size12]}>复制地址</Text>
                        </TouchableOpacity>

                    </View>


                    {/*币种title begin*/}
                    {/*<View style={styles.titleBox}>*/}
                        {/*<Image source={{uri: 'http://logo.eunex.group/' + this.currency + '.png'}}*/}
                               {/*style={styles.currencyIcon}*/}
                        {/*/>*/}
                        {/*<Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTitle]}>{this.currency}</Text>*/}
                    {/*</View>*/}
                    {/*币种title end*/}

                    {/*充值地址 begin*/}
                    {/*<View style={styles.rechargeAddressBox}>*/}
                        {/*<Text allowFontScaling={false} style={[styles.rechargeAddressTitle]}>充值地址</Text>*/}
                        {/*<TextInput*/}
                            {/*allowFontScaling={false}*/}
                            {/*style={[baseStyles.textColor, styles.rechargeAddress]}*/}
                            {/*editable={false}*/}
                            {/*value={this.address}*/}
                            {/*multiline={true}*/}
                            {/*underlineColorAndroid={'transparent'}*/}

                        {/*/>*/}
                        {/*<View style={styles.copyBox}>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={() => {*/}
                                    {/*this.copyAddress(this.address)*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*<View style={styles.copyBtn}>*/}
                                    {/*<Text allowFontScaling={false} style={[baseStyles.textBlue, styles.copyText]}>复制</Text>*/}
                                {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    {/*充值地址 end*/}

                    {/*提示开始*/}
                    {
                        (this.currency == 'USDT' && this.usdtChainType != 2) &&
                        <Text style={styles.AssetRechargeTip}>
                            注：请确认是基于比特网络(OMNI)的USDT地址。
                        </Text>
                    }
                    {
                        (this.currency == 'USDT2' || this.usdtChainType == 2) &&
                        <Text style={styles.AssetRechargeTip}>
                            注：请确认是基于以太网络(ERC20)的USDT地址。
                        </Text>
                    }

                    {/*提示结束*/}

                    {/*分割线 begin*/}
                    {/*<View style={[styles.line]}></View>*/}
                    {/*分割线 end*/}

                    {/*扫描二维码 begin*/}
                    {/*<View style={styles.qrCodeBox}>*/}
                        {/*<Text allowFontScaling={false} style={[styles.qrCodeTitle]}>扫描二维码</Text>*/}

                        {/*<View style={styles.qrCodeDetailBox}>*/}
                            {/*<View style={styles.qrCodeBg}>*/}
                                {/*<QRCode*/}
                                    {/*value={this.address}*/}
                                    {/*size={getWidth(200)}*/}
                                    {/*bgColor={'black'}*/}
                                    {/*fgColor={'white'}*/}
                                {/*/>*/}
                            {/*</View>*/}
                        {/*</View>*/}

                    {/*</View>*/}
                    {/*扫描二维码 end*/}


                    {
                        this.isEOS &&
                        <View style={[styles.rechargeAddressBox2]}>
                            {/*<View style={styles.qrCodeDetailBox}>*/}
                            <View style={styles.qrCodeBg}>
                                <QRCode
                                    value={this.memoAddress}
                                    size={getWidth(300)}
                                    bgColor={'#1F3F59'}
                                    fgColor={'#F7F8FA'}
                                />
                            </View>
                            {/*</View>*/}

                            <Text allowFontScaling={false} style={[styles.rechargeAddressTitle]}>memo（备注）</Text>
                            <Text allowFontScaling={false} style={styles.rechargeAddress2}>{this.memoAddress}</Text>
                            <TouchableOpacity
                                style={styles.copyBtnTouch}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={() => {
                                    this.copyAddress(this.memoAddress)
                                }}
                            >
                                <Text allowFontScaling={false} style={[baseStyles.text6B7DA2, baseStyles.size12]}>复制memo</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    {
                        this.isWCG &&
                        <View style={[styles.rechargeAddressBox2]}>
                            {/*<View style={styles.qrCodeDetailBox}>*/}
                            <View style={styles.qrCodeBg}>
                                <QRCode
                                    value={this.publicKey}
                                    size={getWidth(300)}
                                    bgColor={'#1F3F59'}
                                    fgColor={'#F7F8FA'}
                                />
                            </View>
                            {/*</View>*/}

                            <Text allowFontScaling={false} style={[styles.rechargeAddressTitle]}>publicKey</Text>
                            <Text allowFontScaling={false} style={styles.rechargeAddress2}>{this.publicKey}</Text>
                            <TouchableOpacity
                                style={styles.copyBtnTouch}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={() => {
                                    this.copyAddress(this.publicKey)
                                }}
                            >
                                <Text allowFontScaling={false} style={[baseStyles.text6B7DA2, baseStyles.size12]}>复制publicKey</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    {/*{*/}
                        {/*// this.isEOS &&*/}
                        {/*<View>*/}
                            {/*<View style={[styles.line]} />*/}
                            {/*/!*充值地址 begin*!/*/}
                            {/*<View style={styles.rechargeAddressBox}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.rechargeAddressTitle]}>memo（备注）</Text>*/}
                                {/*<TextInput*/}
                                    {/*allowFontScaling={false}*/}
                                    {/*style={[baseStyles.textColor, styles.rechargeAddress]}*/}
                                    {/*editable={false}*/}
                                    {/*value={this.memoAddress}*/}
                                    {/*multiline={true}*/}
                                    {/*underlineColorAndroid={'transparent'}*/}

                                {/*/>*/}
                                {/*<View style={styles.copyBox}>*/}
                                    {/*<TouchableOpacity*/}
                                        {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                        {/*onPress={() => {*/}
                                            {/*this.copyAddress(this.memoAddress)*/}
                                        {/*}}*/}
                                    {/*>*/}
                                        {/*<View style={styles.copyBtn}>*/}
                                            {/*<Text allowFontScaling={false} style={[baseStyles.textBlue, styles.copyText]}>复制</Text>*/}
                                        {/*</View>*/}
                                    {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                            {/*/!*充值地址 end*!/*/}

                            {/*/!*分割线 begin*!/*/}
                            {/*<View style={[styles.line]}>*/}

                            {/*</View>*/}
                            {/*/!*分割线 end*!/*/}

                            {/*/!*扫描二维码 begin*!/*/}
                            {/*<View style={styles.qrCodeBox}>*/}
                                {/*<Text allowFontScaling={false} style={[styles.qrCodeTitle]}>扫描二维码</Text>*/}

                                {/*<View style={styles.qrCodeDetailBox}>*/}
                                    {/*<View style={styles.qrCodeBg}>*/}
                                        {/*<QRCode*/}
                                            {/*value={this.memoAddress}*/}
                                            {/*size={getWidth(200)}*/}
                                            {/*bgColor={'black'}*/}
                                            {/*fgColor={'white'}*/}
                                        {/*/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}

                            {/*</View>*/}
                            {/*/!*扫描二维码 end*!/*/}
                        {/*</View>*/}

                    {/*}*/}
                    <View style={styles.footer}/>
                </ScrollView>
                {this.showAlert && <MyAlert
                    content={this.myAlertContent}
                    contentStyle={{
                        color: StyleConfigs.txtRed
                    }}
                    checkboxText={'我已知晓'+this.currency+'充值规则'}
                    onClose={this.onCloseAlert}
                    onPress={this.onPressAlert}
                    buttonText={'继续充值'}
                    buttonDisabledStyle={{
                        backgroundColor: '#B1B3B4'
                    }}
                />}

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
