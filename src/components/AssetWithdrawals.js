/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView} from 'react-native'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetWithdrawalsStyle'
import StyleConfigs from "../style/styleConfigs/StyleConfigs"
import BaseButton from './baseComponent/BaseButton'
import Modal from 'react-native-modal'
import ModalStyles from '../style/ModalStyle'
import MyAlert from './baseComponent/MyAlert'
// 图片
import DeleteIcon from '../assets/AssetWithdrawals/delete-address-icon.png'
import CloseIcon from '../assets/Modal/close-icon.png'
import keccak from "keccakjs";
import Toast from "react-native-root-toast";

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 键盘高度
    @observable
    keyboardHeight = 0;

    // 加载中
    @observable
    loading = false

    // 币种
    @observable
    currency = ''

    // 提现金额
    @observable
    amount = ''

    // 实际到账
    @observable
    realAmount = ''

    // 可用资产
    @observable
    available = 0

    // 最小提现数量
    @observable
    minimumAmount = 0

    // 单笔最大提现数量
    @observable
    singleMaximumAmount = 0

    // 提现费率
    @observable
    feeRate = 0

    // 手续费
    @observable
    fee = 0

    // 最大提现费
    @observable
    maximumFee = 0

    // 最小提现费
    @observable
    minimumFee = 0

    @observable
    address = ''

    @observable
    description = ''

    @observable
    addressId = 0

    // 获取费率标准成功
    @observable
    feeReady = false

    // 获取提现地址成功
    @observable
    addressReady = false

    @observable
    addressList = []


    // 是否打开下拉
    @observable
    showAddressList = false

    // 是否添加新地址
    @observable
    addNewAddress = false

    // 是否已经选择
    @observable
    selectAddress = true

    // 删除确认弹窗
    @observable
    deleteAddressConfirmShow = false

    // 删除的地址ID
    @observable
    deleteAddressId = 0

    @observable
    selectAddressId = 0

    @observable
    isEOS = false;//是否需要memo，由于一开始只有eos需要，起了这个名字，按理说是isMemo

    @observable
    isWCG = false;

    @observable
    memoAddress = '';

    @observable
    publicKey = '';

    @observable
    showAlert = false;

    @observable
    myAlertContent = '';

    // 键盘弹起高度修正值
    @observable
    keyboardVerticalOffset = 0;

    @observable
    usdtChainType = 1;//1:OMNI 2:ERC20 3:TRC20

    closeTips = '该币种暂未开放提现功能，敬请期待！'


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.currency = this.$params.currency
        this.available = this.$params.available

        let currencyObj = this.$store.state.currency.get(this.currency)

        //能进入此页面说明至少有一个开放提现，当OMNI关闭时默认显示ERC20
        if(this.currency == 'USDT'){

            this.canUSDTWithdraw(currencyObj);

            // let currencyUSDT2 = this.$store.state.currency.get('USDT2')
            // let currencyUSDT3 = this.$store.state.currency.get('USDT3')
            // this.withdrawEnabledUSDT = currencyObj && currencyObj.withdrawEnabled
            // this.withdrawEnabledUSDT2 = currencyUSDT2 && currencyUSDT2.withdrawEnabled
            // this.withdrawEnabledUSDT3 = currencyUSDT3 && currencyUSDT3.withdrawEnabled
            //
            // !this.withdrawEnabledUSDT && this.withdrawEnabledUSDT2 && (this.usdtChainType = 2)
            // !this.withdrawEnabledUSDT && !this.withdrawEnabledUSDT2 && (this.usdtChainType = 3)
            //
            // //如果外边没拦住，提示并返回上一级路由，这种可能性比较小
            // if(!this.withdrawEnabledUSDT && !this.withdrawEnabledUSDT2 && !this.withdrawEnabledUSDT3){
            //     this.$globalFunc.toast(this.closeTips);
            //     this.goBack();
            // }
        }

        this.isEOS = currencyObj && currencyObj.memo;
        this.isWCG = currencyObj && (currencyObj.addressAliasTo == 'WCG' || this.currency == 'WCG')
        this.showAlert = (this.isEOS && !this.isWCG);//只有eos才会弹窗

        this.isEOS && (this.myAlertContent = ('提现' + this.currency + '原力上的合约币须同时具备提现地址及' + this.currency + ' memo (备注) , 未遵守' + this.currency + '提现规则将导致资产无法找回。'))
        // this.isWCG && (this.myAlertContent = ('提现' + this.currency + '上的合约币须同时具备提现地址、' + this.currency + ' memo (备注), 未遵守' + this.currency + '提现规则将导致资产无法找回。'))
        // 获取地址,暂时屏蔽
        // this.getWithdrawalsAddress()

        // 获取费率详情
        this.getWithdrawalsFee()

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

    @action
    goToWithdrawalsRecords = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('RechargeAndWithdrawalsRecords')
        }
    })()


    // 获取提现地址
    @action
    getWithdrawalsAddress = () => {
        this.$http.send("POST_WITHDRAW_ADDRESS", {
            bind: this,
            params: {
                currency: this.currency
            },
            callBack: this.re_getWithdrawalsAddress,
            errorHandler: this.error_getWithdrawalsAddress,
        })
    }

    // 获取地址回调
    @action
    re_getWithdrawalsAddress = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        // console.warn("获取历史地址", data)
        if (!data || !data.dataMap) {
            return
        }

        this.addressList = data.dataMap.withdrawAddressList
        this.addressList.sort((a, b) => {
            return b.createdAt - a.createdAt
        })

        if (this.addressList.length === 0) {
            this.addNewAddress = true
            this.selectAddress = false
            this.showAddressList = false
        }

        if (this.addressList.length !== 0) {
            this.description = this.addressList[0].description
            this.address = this.addressList[0].address
            if(this.isEOS){
                this.memoAddress = this.addressList[0].memoAddress;
            }

            this.addNewAddress = false
            this.selectAddress = true
            this.showAddressList = false
        }


        this.addressReady = true
        console.log('ready',this.feeReady,this.addressReady)
        this.loading = !(this.feeReady && this.addressReady)
    }

    // 获取地址出错
    @action
    error_getWithdrawalsAddress = (err) => {
        console.warn("获取提现地址出错！", err)
    }


    /*------------------ 获取提现费率 begin -------------------*/

    // 获取提现费率
    @action
    getWithdrawalsFee = () => {
        this.loading = true;

        this.$http.send('POST_WITHDRAW_FEE_INFO', {
            bind: this,
            params: {
                currency:this.isERC20(),//this.currency
            },
            callBack: this.re_getWithdrawalsFee,
            errorHandler: this.error_getWithdrawalsFee
        })
    }

    // 获取提现费率回调
    @action
    re_getWithdrawalsFee = function (data) {
        console.log(JSON.stringify(data))
        typeof data === 'string' && (data = JSON.parse(data))

        console.warn('获取费率', data)

        if (!data || !data.dataMap) {
            return
        }

        this.feeRate = data.dataMap.withdrawRule.feeRate
        this.maximumFee = data.dataMap.withdrawRule.maximumFee
        this.minimumFee = data.dataMap.withdrawRule.minimumFee
        this.minimumAmount = data.dataMap.withdrawRule.minimumAmount
        this.singleMaximumAmount = data.dataMap.withdrawSingle.amount

        this.loading = false;
        // 获取费率成功
        // this.feeReady = true
        // this.loading = !(this.feeReady && this.addressReady)

    }
    // 获取提现费率失败
    @action
    error_getWithdrawalsFee = function (err) {
        this.loading = false;
        console.warn("获取最小费率失败", err)
    }
    /*------------------ 获取提现费率 end -------------------*/


    // 打开和关闭下拉
    @action
    openAddressList = () => {

        this.showAddressList = !this.showAddressList
    }

    // 点击新增地址
    @action
    clickAddNewAddress = () => {
        this.description = '';
        this.address = '';
        this.memoAddress = '';

        this.showAddressList = false
        this.addNewAddress = true
        this.selectAddress = false
    }

    // 点击选择地址
    @action
    clickToSelectAddress = (item) => {
        this.description = item.description
        this.address = item.address
        this.memoAddress = item.memoAddress || '';
        this.selectAddressId = item.id

        this.showAddressList = false
        this.addNewAddress = false
        this.selectAddress = true
    }


    // 点击删除地址
    @action
    clickToDeleteAddress = (item) => {
        this.deleteAddressConfirmShow = true
        this.deleteAddressId = item.id
    }

    // 确认删除地址
    @action
    confirmDeleteAddress = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.deleteAddressConfirmShow = false
            this.loading = true
            this.$http.send('POST_DELETE_ADDRESS', {
                bind: this,
                params: {
                    addressId: this.deleteAddressId
                },
                callBack: this.re_confirmDeleteAddress,
                errorHandler: this.error_confirmDeleteAddress
            })
        }
    })()
    // 确认删除地址回调
    re_confirmDeleteAddress = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        // console.warn('删除地址回调', data)

        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '删除失败'
                    break;
                case 2:
                    msg = '没有这个地址'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }

            this.$globalFunc.toast(msg)
            return
        }
        // 重新请求

        this.$globalFunc.toast('删除成功')


        this.getWithdrawalsAddress()
    }
    // 确认删除地址出错
    error_confirmDeleteAddress = (err) => {
        console.warn('删除地址失败！', err)
        this.loading = false

        this.$globalFunc.toast('暂不可用，请稍后再试')

    }


    // 关闭删除地址弹窗
    @action
    closeModal = () => {
        this.deleteAddressConfirmShow = false
    }


    // 渲染增加提现新地址
    @action
    _renderAddNewAddress = () => {
        return (
            <View>
                <View style={styles.addNewAddressBox}>
                    <View style={[styles.addressInputItem, styles.addNewAddressInputItem]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[styles.addressInput]}
                            placeholder={'备注233'}
                            placeholderTextColor={StyleConfigs.txtC5CFD5}
                            underlineColorAndroid={'transparent'}
                            // value={this.description}
                            onChangeText={(text) => {
                                this.description = text
                            }}
                            returnKeyType={'done'}
                            onFocus = {this.onFocus_beizhu}

                        />
                    </View>
                    <View
                        style={[styles.addressInputItem, styles.addressInputItemMarginTop, styles.addNewAddressInputItem]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[styles.addressInput]}
                            placeholder={'地址'}
                            placeholderTextColor={StyleConfigs.txtC5CFD5}
                            underlineColorAndroid={'transparent'}
                            // value={this.address}
                            onChangeText={(text) => {
                                this.address = text
                            }}
                            returnKeyType={'done'}
                            onFocus = {this.onFocus_dizhi}

                        />
                    </View>
                </View>
                {
                    this.isEOS &&
                    <View>
                        <Text allowFontScaling={false} style={[styles.withdrawalsAddressTitle, baseStyles.textColor]}>提现备注</Text>
                        <View
                            style={[styles.addressInputItem, styles.addressInputItemMarginTop, styles.addNewAddressInputItem]}>
                            <TextInput
                                allowFontScaling={false}
                                style={[styles.addressInput]}
                                placeholder={'添加提现备注'}
                                placeholderTextColor={StyleConfigs.txtC5CFD5}
                                underlineColorAndroid={'transparent'}
                                // value={this.memoAddress}
                                onChangeText={(text) => {
                                    this.memoAddress = text
                                }}
                                returnKeyType={'done'}
                                onFocus = {this.onFocus_memo}

                            />
                        </View>
                    </View>
                }
            </View>
        )
    }


    // 渲染提现列表
    @action
    _renderAddressList = () => {
        return (
            <ScrollView style={styles.addressListBox}>
                {
                    this.addressList.map((item, index) => {
                        return (
                            <View key={index} style={{
                                marginTop: index != 0 && getHeight(20) || 0
                            }}>
                                <View style={styles.transparentBox}>
                                <Text allowFontScaling={false} style={[styles.value,styles.colorTransparnet]}>{(this.isEOS && 'memo(备注) ' || '') + item.description}</Text>
                                <Text allowFontScaling={false} style={[styles.value,styles.colorTransparnet]}>{(this.isEOS && 'memo(备注) ' || '') + item.address}</Text>

                                    {this.isEOS && <Text allowFontScaling={false} style={[styles.value,styles.colorTransparnet]}>{'memo(备注) ' + item.memoAddress}</Text>}
                                </View>
                            <View style={[styles.addressListItemBox, styles.addressInputItem,this.showAddressList && {paddingRight: 0},{position:'absolute'}]}>
                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    onPress={() => {
                                        this.clickToSelectAddress(item)
                                    }}
                                >
                                    <View style={styles.addressListItem}>
                                        <View style={styles.addressTextBox}>
                                            {this.isEOS && <Text allowFontScaling={false} style={styles.label}>备注</Text>}
                                            <Text allowFontScaling={false} style={[baseStyles.textColor,styles.value]}>{item.description}</Text>
                                        </View>
                                        <View style={styles.addressTextBox}>
                                            {this.isEOS && <Text allowFontScaling={false} style={styles.label}>地址</Text>}
                                            <Text allowFontScaling={false} style={[baseStyles.textColor,styles.value]}>{item.address}</Text>
                                        </View>
                                        { this.isEOS && <View style={styles.addressTextBox}>
                                            <Text allowFontScaling={false} style={styles.label}>memo(备注)</Text><Text allowFontScaling={false} style={[baseStyles.textColor,styles.value]}>{item.memoAddress}</Text>
                                        </View>}
                                    </View>
                                </TouchableOpacity>

                                {/*删除图标*/}
                                <TouchableOpacity
                                    style={[styles.addressDeleteButton]}
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    onPress={() => {
                                        this.clickToDeleteAddress(item)
                                    }}
                                >
                                    <Image source={DeleteIcon} style={styles.deleteIcon}/>
                                </TouchableOpacity>
                            </View>
                            </View>
                        )
                    })
                }
                {
                    !this.addNewAddress &&
                    <View style={[styles.addressInputItem, styles.addressInputItemMarginTop, styles.addressAddNewBox]}>
                        <TouchableOpacity
                            onPress={this.clickAddNewAddress}
                            activeOpacity={StyleConfigs.activeOpacity}
                        >
                            <View style={styles.addNewAddressDetailBox}>
                                <Image source={null} style={styles.addAddressIcon}/>
                                <Text allowFontScaling={false} style={[baseStyles.textBlue, styles.addNewAddressText]}>新增地址</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        )
    }

    // 渲染已选择的提现地址
    @action
    _renderAddressSelected = () => {
        return (
            <View style={styles.addressSelectedBox}>
                <View style={[styles.addressListItemBox, styles.addressInputItem]}>
                    <View style={styles.addressSelectedItem}>
                        <View style={styles.addressTextBox}>
                            {this.isEOS && <Text allowFontScaling={false} style={styles.label}>备注</Text>}
                            <Text allowFontScaling={false} style={[baseStyles.textColor,styles.value]}>{this.description}</Text>
                        </View>
                        <View style={styles.addressTextBox}>
                            {this.isEOS && <Text allowFontScaling={false} style={styles.label}>地址</Text>}
                            <Text allowFontScaling={false} style={[baseStyles.textColor,styles.value]}>{this.address}</Text>
                        </View>
                        { this.isEOS && <View style={styles.addressTextBox}>
                            <Text allowFontScaling={false} style={styles.label}>memo(备注)</Text><Text allowFontScaling={false} style={[baseStyles.textColor,styles.value]}>{this.memoAddress}</Text>
                            </View>}
                    </View>
                </View>
            </View>
        )
    }


    // 输入数量
    @action
    changeAmount = (text) => {
        this.amount = parseFloat(text)
    }


    // 点击全提
    @action
    withdrawalsAll = () => {
        this.amount = this.available
    }

    @action
    isERC20 = () => {
        if(this.currency == "USDT" && this.usdtChainType == 2)return "USDT2";
        if(this.currency == "USDT" && this.usdtChainType == 3)return "USDT3";
        return this.currency;
    }

    // 点击提现
    @action
    clickToWithdrawals = (() => {
        let last = 0;
        return (fee) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            // 提现金额未输入
            if (this.amount === '') {
                this.$globalFunc.toast('请输入提现金额')
                return false
            }

            // 提现金额输入有误
            let num = (this.amount.toString()).search(/^\d+(\.\d+)?$/)
            if (num === -1) {
                this.$globalFunc.toast('请输入正确的金额')
                return false
            }

            // 可用资产不足
            if (parseFloat(this.$globalFunc.accMinus(parseFloat(this.amount), this.available)) > 0) {
                this.$globalFunc.toast('可用资产不足')
                return false
            }

            // 小于最小提现数量
            if (parseFloat(this.$globalFunc.accMinus(this.amount, this.minimumAmount)) < 0) {
                this.$globalFunc.toast('小于最小提现数量')
                return false
            }

            // 大于单笔最大提现数量
            if (this.singleMaximumAmount > 0 && parseFloat(this.$globalFunc.accMinus(this.realAmount, this.singleMaximumAmount)) > 0) {
                this.$globalFunc.toast('大于单笔最大提现数量')
                return false
            }

            // 未输入备注
            if ((/*!this.isWCG &&*/ this.description === '')) {
                this.$globalFunc.toast('请输入提现备注')
                return false
            }

            if (this.address === '') {
                this.$globalFunc.toast('请输入提现地址')
                return false
            }

            if (this.address != '' && this.address.indexOf(" ") > -1) {
                this.$globalFunc.toast('您输入的提现地址含有空格，请检查后重试')
                return false
            }

            if ((!this.isWCG && this.isEOS) && this.memoAddress === ''){
                this.$globalFunc.toast('请输入memo')
                return false
            }

            if (this.isWCG && this.publicKey === ''){
                this.$globalFunc.toast('请输入publicKey')
                return false
            }

            let currencyObj = this.$store.state.currency.get(this.isERC20())
            if (currencyObj && (currencyObj.addressAliasTo === 'ACT' || this.currency === 'ACT') && !this.$globalFunc.testACTAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }
            if (currencyObj && (currencyObj.addressAliasTo === 'BTC' || this.currency === 'BTC') && !this.$globalFunc.testBTCAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if (currencyObj && (currencyObj.addressAliasTo === 'ETH' || this.currency === 'ETH') && !this.$globalFunc.testETHAddress(this.toChecksumAddress(this.address))) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if (currencyObj && (currencyObj.addressAliasTo === 'OMNI' || this.currency === 'OMNI') && !this.$globalFunc.testOMNIAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if (currencyObj && (currencyObj.addressAliasTo === 'EOSFORCEIO' || this.currency === 'EOSFORCEIO') && !this.$globalFunc.testEOSAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if (currencyObj && (currencyObj.addressAliasTo === 'EOSIO' || this.currency === 'EOSIO') && !this.$globalFunc.testEOSAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if (currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG') && !this.$globalFunc.testWCGAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if (currencyObj && (currencyObj.addressAliasTo === 'TRX' || this.currency === 'TRX') && !this.$globalFunc.testTRXAddress(this.address)) {
                this.$globalFunc.toast('请输入正确提现地址，以免造成资产损失！')
                return false
            }

            if(this.isWCG){
                this.$router.push('WithdrawalsEmailVerify', {
                    amount: this.amount,
                    description: this.description + 'a0f0bc95016c862498bbad29d1f4d9d4' + this.publicKey,
                    address: this.address,
                    currency: this.isERC20(),//this.currency,
                    realAmount: this.realAmount,
                })

                return;
            }

            this.$router.push('WithdrawalsEmailVerify', {
                amount: this.amount,
                description: this.isEOS && (this.description + 'a0f0bc95016c862498bbad29d1f4d9d4' + this.memoAddress) || this.description,
                address: this.address,
                currency: this.isERC20(),//this.currency,
                realAmount: this.realAmount,
            })
        }
    })()


    /*------------------ 提现地址修改 begin -------------------*/
    toChecksumAddress = (address) => {
        address = address.toLowerCase().replace('0x', '')
        let keccakObj = new keccak(256)
        let hash = keccakObj.update(address).digest('hex')
        let ret = '0x'

        for (let i = 0; i < address.length; i++) {
            if (parseInt(hash[i], 16) >= 8) {
                ret += address[i].toUpperCase()
            } else {
                ret += address[i]
            }
        }
        return ret
    }
    /*------------------ 提现地址修改 end -------------------*/




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

    @action
    onFocus_dizhi = ()=>{
        this.keyboardVerticalOffset = -getHeight(100);
    }

    @action
    onFocus_beizhu = ()=>{
        this.keyboardVerticalOffset = -getHeight(200);
    }

    @action
    onFocus_shuliang = ()=>{
        this.keyboardVerticalOffset = -getHeight(300);
    }

    @action
    onFocus_memo = ()=>{
        this.keyboardVerticalOffset = 0;
    }

    //USDT系列能否提现
    canUSDTWithdraw = (currencyObj) =>{

        let currencyUSDT2 = this.$store.state.currency.get('USDT2')
        let currencyUSDT3 = this.$store.state.currency.get('USDT3')
        this.withdrawEnabledUSDT = currencyObj && currencyObj.withdrawEnabled
        this.withdrawEnabledUSDT2 = currencyUSDT2 && currencyUSDT2.withdrawEnabled
        this.withdrawEnabledUSDT3 = currencyUSDT3 && currencyUSDT3.withdrawEnabled

        !this.withdrawEnabledUSDT && this.withdrawEnabledUSDT2 && (this.usdtChainType = 2)
        !this.withdrawEnabledUSDT && !this.withdrawEnabledUSDT2 && (this.usdtChainType = 3)

        //如果外边没拦住，提示并返回上一级路由，这种可能性比较小
        if(!this.withdrawEnabledUSDT && !this.withdrawEnabledUSDT2 && !this.withdrawEnabledUSDT3){
            this.$globalFunc.toast(this.closeTips);
            this.goBack();
        }
    }

    changeCurrency = (item)=>{

        this.currency = item.currency || 'BTC'
        this.available = item.available

        let currencyObj = this.$store.state.currency.get(this.currency)

        //能进入此页面说明至少有一个开放充值，当OMNI关闭时默认显示ERC20
        if(this.currency == 'USDT'){

            this.canUSDTWithdraw(currencyObj);

            // let currencyUSDT2 = this.$store.state.currency.get('USDT2')
            // this.withdrawEnabledUSDT = currencyObj && currencyObj.withdrawEnabled
            // this.withdrawEnabledUSDT2 = currencyUSDT2 && currencyUSDT2.withdrawEnabled
            // !this.withdrawEnabledUSDT && this.withdrawEnabledUSDT2 && (this.usdtChainType = 2)
            //
            // //如果外边没拦住，提示并返回上一级路由，这种可能性比较小
            // if(!this.withdrawEnabledUSDT && !this.withdrawEnabledUSDT2){
            //     this.$globalFunc.toast(this.closeTips);
            //     this.goBack();
            // }
        }

        this.isEOS = currencyObj && currencyObj.memo;
        this.isWCG = currencyObj && (currencyObj.addressAliasTo == 'WCG' || this.currency == 'WCG')
        this.showAlert = (this.isEOS && !this.isWCG);

        this.isEOS && (this.myAlertContent = ('提现' + this.currency + '原力上的合约币须同时具备提现地址及' + this.currency + ' memo (备注) , 未遵守' + this.currency + '提现规则将导致资产无法找回。'))
        // this.isWCG && (this.myAlertContent = ('提现' + this.currency + '上的合约币须同时具备提现地址、' + this.currency + ' memo (备注), 未遵守' + this.currency + '提现规则将导致资产无法找回。'))

        // 获取地址
        // this.getWithdrawalsAddress()

        // 获取费率详情
        this.getWithdrawalsFee()

        //调用资产详情页的方法
        this.changeCurrency1(item || {})

        //变量初始化，目前还不起作用，后边排查
        this.address = '';
        this.amount = '';
        this.description = '';
        this.memoAddress = '';
    }

    @action
    goToAssetPageSearch =()=>{
        this.$router.push('AssetPageSearch',{changeCurrency:this.changeCurrency,type:'withdrawals'})
    }

    @action
    setUsdtChainType = (type)=>{

        if(type == 1 && !this.withdrawEnabledUSDT){
            this.$globalFunc.toast('OMNI暂未开放提现功能，敬请期待！')
            return
        }

        if(type == 2 && !this.withdrawEnabledUSDT2){
            this.$globalFunc.toast('ERC20暂未开放提现功能，敬请期待！')
            return
        }

        if(type == 3 && !this.withdrawEnabledUSDT3){
            this.$globalFunc.toast('TRC20暂未开放提现功能，敬请期待！')
            return
        }

        if(this.usdtChainType == type)return

        this.usdtChainType = type;

        // 获取费率详情
        this.getWithdrawalsFee()
    }

    /*----------------------- 挂载 -------------------------*/

    render() {

        let available = this.available


        let fee = this.$globalFunc.accFixed(this.$globalFunc.accMul(this.amount || 0, this.feeRate), 8)

        if (fee > this.maximumFee) fee = this.maximumFee
        if (fee <= this.minimumFee) fee = this.minimumFee

        // let minimumAmount = this.$globalFunc.accAdd(this.minimumAmount, fee)
        let minimumAmount = this.$globalFunc.accAdd(this.minimumAmount, 0)//最小提现不增加手续费

        this.fee = fee


        let realAmount = this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.amount || 0, fee), 8)

        if (realAmount < 0) realAmount = 0

        this.realAmount = realAmount


        return (
            <ScrollView style={[styles.container,styles.container2]}>
                <NavHeader
                    headerTitle={this.currency + '提现'}
                    goBack={this.goBack}
                    headerRightTitle={'历史记录'}
                    headerRightOnPress={this.goToWithdrawalsRecords}
                />
                    <View behavior={'position'} contentContainerStyle={[styles.container]} keyboardVerticalOffset={this.keyboardVerticalOffset}
                          style={[styles.overflow,styles.boxPadding, styles.container,{backgroundColor:StyleConfigs.bgColor}]}>

					    <View style={styles.tibiWrap}><Text allowFontScaling={false} style={styles.tibiTxt}>提币</Text></View>

	                    {/*<View style={styles.xuanzebizhongWrap}>*/}
	                    {/*</View>*/}

                        <TouchableOpacity style={styles.xuanzebizhongWrap} activeOpacity={StyleConfigs.activeOpacity}
                                          onPress={this.goToAssetPageSearch}>
                            <Text style={styles.currencyName}>{this.currency}</Text>
                            <Text style={styles.selectCurrency}>{'选择币种 ＞'}</Text>
                        </TouchableOpacity>

                        {/*USDT专有区分链*/}
                        {(this.currency == 'USDT' || this.currency == 'USDT2' || this.currency == 'USDT3') &&
                        <Text style={styles.chainNameText}>链名称</Text>
                        ||
                        null
                        }
                        {(this.currency == 'USDT' || this.currency == 'USDT2' || this.currency == 'USDT3') &&
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
                                <TouchableOpacity style={[styles.chainNameBtn,this.usdtChainType == 3 && styles.chainNameBtnSel || null]}
                                                  activeOpacity={StyleConfigs.activeOpacity}
                                                  onPress={()=>this.setUsdtChainType(3)}>
                                    <Text style={[styles.usdtTypeText,this.usdtChainType ==3 && styles.usdtTypeTextSel]}>TRC20</Text>
                                </TouchableOpacity>
                            </View>
                            ||
                            null
                        }
                        {/*USDT专有区分链 end*/}

						{/*提币地址*/}
	                    <View style={styles.tibidizhiWrap}><Text allowFontScaling={false} style={styles.tibidizhiTxt}>提币地址</Text></View>
	                    <View style={styles.inputBoxMiddle2}>
		                    <TextInput
			                    allowFontScaling={false}
			                    style={[styles.input2]}
			                    placeholder={'输入提币地址'}
			                    placeholderTextColor={'#A2B5D9'}
			                    underlineColorAndroid={'transparent'}
			                    // value={this.address}
			                    onChangeText={(text) => {
				                    this.address = text
			                    }}
			                    returnKeyType={'done'}
			                    // onFocus = {this.onFocus_dizhi}
		                    />
		                    <TouchableOpacity
			                    activeOpacity={StyleConfigs.activeOpacity}
			                    onPress={_=>_}
			                    hitSlop={{top:15,left:15,bottom:15, right:15}}
		                    >
			                    {/*<Image style={{width:getWidth(44),height:getHeight(44)}} source={require('../assets/AssetWithdrawals/tibidizhi2.png')}/>*/}
		                    </TouchableOpacity>
	                    </View>

	                    {/*数量*/}
	                    <View style={styles.tibidizhiWrap}><Text allowFontScaling={false} style={styles.tibidizhiTxt}>数量</Text></View>
	                    <View style={styles.inputBoxMiddle3}>
		                    <TextInput
			                    allowFontScaling={false}
			                    style={[styles.input22]}
			                    placeholder={'最小提币数量'+minimumAmount}
			                    placeholderTextColor={'#A2B5D9'}
			                    underlineColorAndroid={'transparent'}
			                    value={this.amount}
			                    onChangeText={(text) => {
				                    this.changeAmount(text)
			                    }}
			                    returnKeyType={'done'}
			                    // onFocus = {this.onFocus_dizhi}
		                    />
		                    <View style={{flexDirection: 'row'}}>
			                    <Text style={{fontSize:StyleConfigs.fontSize14,color:StyleConfigs.txt6B7DA2}}>{this.currency}</Text>
			                    <View style={{height:getHeight(30), width:1,backgroundColor:'#A2B5D9',marginLeft:getWidth(30),marginRight:getWidth(24)}}/>
			                    <Text onPress={this.withdrawalsAll} style={{fontSize:StyleConfigs.fontSize14,color:StyleConfigs.txt1F3F59,
				                    fontWeight:'600',fontFamily:'System'}} hitSlop={{top:15,left:15,bottom:15, right:15}}>全部</Text>
		                    </View>
	                    </View>
	                    <View style={{marginBottom:getHeight(30)}}><Text style={{color:StyleConfigs.txtA2B5D9,fontSize:StyleConfigs.fontSize12}}>可用 {available+this.currency}</Text></View>
						{/*备注*/}
	                    <View style={styles.tibidizhiWrap}><Text allowFontScaling={false} style={styles.tibidizhiTxt}>备注</Text></View>
	                    <View style={styles.inputBoxMiddle2}>
		                    <TextInput
			                    allowFontScaling={false}
			                    style={[styles.input2]}
			                    placeholder={'输入备注'}
			                    placeholderTextColor={'#A2B5D9'}
			                    underlineColorAndroid={'transparent'}
			                    onChangeText={(text) => {
				                    this.description = text
			                    }}
			                    returnKeyType={'done'}
			                    // onFocus = {this.onFocus_dizhi}
		                    />
	                    </View>


	                    {/*memo 备注*/}
	                    {this.isEOS && <View style={styles.tibidizhiWrap}><Text allowFontScaling={false} style={styles.tibidizhiTxt}>提现备注</Text></View>}
	                    {this.isEOS &&  <View style={styles.inputBoxMiddle2}>
		                    <TextInput
			                    allowFontScaling={false}
			                    style={[styles.input2]}
			                    placeholder={'输入提现备注'}
			                    placeholderTextColor={'#A2B5D9'}
			                    underlineColorAndroid={'transparent'}
			                    onChangeText={(text) => {
				                    this.memoAddress = text
			                    }}
			                    returnKeyType={'done'}
			                    // onFocus = {this.onFocus_dizhi}
		                    />
	                    </View>}

	                    {/*publicKey*/}
	                    {this.isWCG && <View style={styles.tibidizhiWrap}><Text allowFontScaling={false} style={styles.tibidizhiTxt}>PublicKey</Text></View>}
	                    {this.isWCG &&  <View style={styles.inputBoxMiddle2}>
		                    <TextInput
			                    allowFontScaling={false}
			                    style={[styles.input2]}
			                    placeholder={'输入PublicKey'}
			                    placeholderTextColor={'#A2B5D9'}
			                    underlineColorAndroid={'transparent'}
			                    onChangeText={(text) => {
				                    this.publicKey = text
			                    }}
			                    returnKeyType={'done'}
			                    // onFocus = {this.onFocus_dizhi}
		                    />
	                    </View>}





	                    {/*手续费*/}
	                    <View style={styles.tibidizhiWrap}><Text allowFontScaling={false} style={styles.tibidizhiTxt}>手续费</Text></View>
	                    <View style={styles.inputBoxMiddle2}>
		                   <Text style={{fontSize:StyleConfigs.fontSize16,color:StyleConfigs.txt172A4D, fontWeight:'600',fontFamily:'System'}}>{fee}</Text>
		                   <Text style={{fontSize:StyleConfigs.fontSize14,color:StyleConfigs.txt6B7DA2}}>{this.currency}</Text>
	                    </View>


	                    {/*说明*/}
	                    <View style={styles.wordsWrap}>
		                    <Text style={{color:'#8c9fad', fontSize:StyleConfigs.fontSize12, lineHeight:15}}>
			                    为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。
		                    </Text>
		                    <Text style={{color:'#8c9fad', fontSize:StyleConfigs.fontSize12, lineHeight:15}}>请务必确认手机安全，防止信息被篡改或泄露。</Text>
	                    </View>


	                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:getHeight(104)}}>
		                    <Text style={{color:StyleConfigs.txt6B7DA2,fontSize:StyleConfigs.fontSize16}}>到账数量</Text>
		                    <Text style={{color:StyleConfigs.txt172A4D,fontSize:StyleConfigs.fontSize16}}>{realAmount} {this.currency}</Text>
	                    </View>


	                    {/*提现按钮 begin*/}
		                    <BaseButton
			                    onPress={this.clickToWithdrawals}
			                    text={'提币'}
			                    style={[baseStyles.btnBlue, styles.btn,{ marginTop:getHeight(20),marginBottom:getHeight(20)+getDeviceBottom()}]}
			                    textStyle={[baseStyles.textWhite, styles.btnText]}
		                    >
		                    </BaseButton>























	                    {/*可用资产 begin*/}
                       {/* <View style={styles.availableBox}>
                            <Text allowFontScaling={false} style={styles.availableTitle}>可用资产</Text>
                            <Text allowFontScaling={false} style={styles.availableArticle}>{available} {this.currency}</Text>
                        </View>*/}
                        {/*可用资产 end*/}

                        {/*提现框 begin*/}
                        {/*<View style={styles.inputBox}>
                            <View style={styles.inputBoxTop}>
                                <Text allowFontScaling={false} style={styles.withdrawalsAmountTitle}>提现金额</Text>
                                <View style={styles.withdrawalsMinimumAmountBox}>
                                    <Text allowFontScaling={false} style={styles.withdrawalsMinimumAmountTitle}>最小提现：</Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.withdrawalsMinimumAmountDetail}>{minimumAmount} {this.currency}</Text>
                                </View>
                            </View>

                            <View style={styles.inputBoxMiddle}>
                                <TextInput
                                    allowFontScaling={false}
                                    style={[styles.input]}
                                    placeholder={'可提' + available}
                                    placeholderTextColor={StyleConfigs.txt9FA7B8}
                                    underlineColorAndroid={'transparent'}
                                    value={this.amount}
                                    onChangeText={(text) => {
                                        this.changeAmount(text)
                                    }}
                                    returnKeyType={'done'}
                                    keyboardType={'numeric'}
                                    onFocus = {this.onFocus_shuliang}

                                />
                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    onPress={this.withdrawalsAll}
                                >
                                    <View style={styles.withdrawalsAllBox}>
                                        <Text allowFontScaling={false} style={[styles.withdrawalsAllText, baseStyles.textBlue]}>全提</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>*/}
                        {/*提现框 end*/}


                        {/*手续费 begin*/}
                        {/*<View style={styles.withdrawalsFeeBox}>
                            <View style={styles.withdrawalsFee}>
                                <Text allowFontScaling={false} style={styles.withdrawalsFeeTitle}>手续费：</Text>
                                <Text allowFontScaling={false} style={styles.withdrawalsFeeArticle}>{fee} {this.currency}</Text>
                            </View>
                            <View style={styles.withdrawalsRealAmount}>
                                <Text allowFontScaling={false} style={[styles.withdrawalsFeeTitle,{color:StyleConfigs.txt9FA7B8}]}>实际到账：</Text>
                                <Text allowFontScaling={false} style={styles.withdrawalsFeeArticle}>{realAmount} {this.currency}</Text>
                            </View>
                        </View>*/}
                        {/*手续费 end*/}


                        {/*提现地址 begin*/}
                        {/*<View style={styles.withdrawalsAddressBox}>
                            提现地址 title begin
                            <View style={styles.withdrawalsAddressTitleBox}>
                                <Text allowFontScaling={false} style={[styles.withdrawalsAddressTitle, baseStyles.text9FA7B8]}>提现地址</Text>

                                {
                                    this.addressList.length !== 0 &&
                                    <TouchableOpacity
                                        style={styles.addressListButton}
                                        activeOpacity={StyleConfigs.activeOpacity}
                                        onPress={this.openAddressList}
                                    >
                                        <View style={styles.withdrawalsAddressTitleIconBox}>
                                            {
                                                this.showAddressList ?
                                                    <Image source={null} style={styles.upAndDownIcon}/> :
                                                    <Image source={null} style={styles.upAndDownIcon}/>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                }


                            </View>
                            提现地址 title begin

                            <View style={styles.withdrawalsAddressDetailBox}>


                                新增提现地址输入框 begin
                                {
                                    !this.showAddressList && this.addNewAddress && this._renderAddNewAddress()
                                }
                                新增提现地址输入框 end
                                {

                                }

                                已选择地址输入框 begin

                                {
                                    this.selectAddress && !this.showAddressList && this._renderAddressSelected()
                                }
                                已选择地址输入框 end


                                选择地址下拉 begin
                                {
                                    this.showAddressList && this._renderAddressList()
                                }

                                选择地址下拉 end
                                {
                                    this.isEOS && !this.showAddressList && <View>
                                        <Text allowFontScaling={false} style={styles.EOSWarning}>
                                            注：memo填写错误将会导致资产丢失，请仔细核对！若钱包无memo，请输入任意字符。
                                        </Text>
                                    </View>
                                }

                            </View>


                        </View>*/}
                        {/*提现地址 end*/}


                       {/* {this.isEOS && !!this.showAddressList && <View>
                            <Text allowFontScaling={false} style={styles.EOSWarning}>
                                注：memo填写错误将会导致资产丢失，请仔细核对！若钱包无memo，请输入任意字符。
                            </Text>
                        </View>}*/}


                    </View>


                {/*提现按钮 begin*/}
                {/*<View style={styles.inputBoxButton}>
                    <BaseButton
                        onPress={this.clickToWithdrawals}
                        text={'提现'}
                        style={[baseStyles.btnBlue, styles.btn]}
                        textStyle={[baseStyles.textWhite, styles.btnText]}
                    >
                    </BaseButton>

                </View>*/}
                {/*提现按钮 end*/}

               {/* <Modal
	            isVisible={this.deleteAddressConfirmShow}
	            animationIn={'fadeIn'}
	            animationOut={'fadeOut'}
	            backdropColor={'black'}
	            backdropOpacity={0.5}
            >
	            <View style={ModalStyles.modalBox}>
		            <View style={ModalStyles.modalCloseBox}>
			            <TouchableOpacity
				            activeOpacity={StyleConfigs.activeOpacity}
				            onPress={this.closeModal}
			            >
				            <Image source={CloseIcon} style={ModalStyles.modalCloseIcon}/>
			            </TouchableOpacity>
		            </View>
		            <View style={ModalStyles.modalArticleBox}>
			            <View style={ModalStyles.modalTitleBox}>
				            <Text allowFontScaling={false} style={[ModalStyles.modalTitle]}>确定删除？</Text>
			            </View>
			            <View style={ModalStyles.modalArticleDetailBox}>
				            <Text allowFontScaling={false} style={ModalStyles.articleText}>
					            确定删除此条提现地址？
				            </Text>

				            <View style={ModalStyles.btnBox}>
					            <BaseButton
						            onPress={this.closeModal}
						            text={'取消'}
						            style={[ModalStyles.btn, styles.cancelBtn]}
						            textStyle={[ModalStyles.btnText, styles.cancelBtnText]}
					            />
					            <BaseButton
						            onPress={this.confirmDeleteAddress}
						            text={'确认'}
						            style={[ModalStyles.btn, styles.confirmBtn]}
						            textStyle={[ModalStyles.btnText, styles.confirmBtnText]}
					            />
				            </View>


			            </View>
		            </View>
	            </View>
            </Modal>*/}


                {/*{this.showAlert && <MyAlert*/}
                    {/*// content={'提现' + this.currency + '原力上的合约币须同时具备提现地址及' + this.currency + ' memo (备注) , 未遵守' + this.currency + '提现规则将导致资产无法找回。'}*/}
                    {/*content={this.myAlertContent}*/}
                    {/*contentStyle={{*/}
                        {/*color: '#e13b3b'*/}
                    {/*}}*/}
                    {/*checkboxText={'我已知晓'+this.currency+'提现规则'}*/}
                    {/*onClose={this.onCloseAlert}*/}
                    {/*onPress={this.onPressAlert}*/}
                    {/*buttonText={'继续提现'}*/}
                    {/*buttonDisabledStyle={{*/}
                        {/*backgroundColor: '#B1B3B4'*/}
                    {/*}}*/}
                {/*/>}*/}

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </ScrollView>
        )
    }
}
