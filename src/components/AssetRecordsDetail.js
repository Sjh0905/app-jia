/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Clipboard, Image, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetRecordsDetailStyle'
import BaseButton from './baseComponent/BaseButton'
import Modal from 'react-native-modal'
import StyleConfigs from "../style/styleConfigs/StyleConfigs"
import ModalStyles from "../style/ModalStyle"
import CloseIcon from '../assets/Modal/close-icon.png'


const typeArr = ['recharge', 'withdrawals']

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    recordsItem = {}

    @observable
    type = ''

    @observable
    cancelWithdrawalsModalShow = false

    @observable
    cancelId = 0

    @observable
    canCancel = false

    @observable
    status = ''

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.recordsItem = this.$params && this.$params.item || {}
        this.type = this.$params && this.$params.type || typeArr[0]
        if (this.type === typeArr[0]) {

            switch (this.recordsItem.status) {
                case 'PENDING':
                    this.status = '等待区块确认' + `(${this.recordsItem.confirms}/${this.recordsItem.minimumConfirms})`
                    break;
                case 'DEPOSITED':
                    this.status = '充值成功'
                    break;
                case 'CANCELLED':
                    this.status = '废弃区块'
                    break;
                case 'WAITING_FOR_APPROVAL':
                    this.status = '等待审核'
                    break;
                case 'DENIED':
                    this.status = '审核未通过'
                    break;
                default:
                    this.status = '---'
            }

        }

        if (this.type === typeArr[1]) {
            switch (this.recordsItem.status) {
                case 'SUBMITTED':
                    this.status = '已提交'
                    this.canCancel = true
                    break;
                case 'WAITING_FOR_APPROVAL':
                    this.status = '待审核'
                    this.canCancel = true
                    break;
                case 'WAITING_FOR_WALLET':
                    this.status = '待处理'
                    this.canCancel = true
                    break;
                case 'DENIED':
                    this.status = '被驳回'
                    break;
                case 'PROCESSING':
                    this.status = '已处理'
                    break;
                case 'FAILED':
                    this.status = '失败'
                    break;
                case 'CANCELLED':
                    this.status = '已撤销'
                    break;
                case 'DONE':
                    this.status = '已汇出'
                    break;
                default:
                    this.status = '----'
            }
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

    // 拷贝充值Txid
    @action
    copyRechargeTxid = (txid) => {
        Clipboard.setString(txid)

        this.$globalFunc.toast('复制成功')

    }

    // 检查充值Txid
    @action
    checkRechargeTxid = (item) => {

        let url = ''

        let currencyObj = item.isUSDT2 ? this.$store.state.currency.get('USDT2') : this.$store.state.currency.get(item.currency)

        // 如果是ETH的
        if (item.currency === 'ETH' || (currencyObj && currencyObj.addressAliasTo === 'ETH')) {
            url = `https://etherscan.io/tx/${item.uniqueId}`
        } else if (item.currency === 'ACT' ||  (currencyObj && currencyObj.addressAliasTo === 'ACT')) {
            url = `https://browser.achain.com/#/tradeInfo/${item.uniqueId}`
        } else if (item.currency === 'EOSFORCEIO' || currencyObj && currencyObj.addressAliasTo === 'EOSFORCEIO'){
            url = `https://explorer.eosforce.io/#/transaction_detail_view/${item.uniqueId}`
        } else if (item.currency === 'OMNI' || currencyObj && currencyObj.addressAliasTo === 'OMNI'){
            url = `https://www.omniexplorer.info/tx/${item.uniqueId}`
        } else if (item.currency === 'EOSIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSIO')) {
            url = `https://eosflare.io/tx/${item.uniqueId}`
        } else {
            url = `https://blockchain.info/zh-cn/tx/${item.uniqueId}`
        }

        this.$router.push('WebPage', {
            url: url,
            navHide: false,
            title: '检查Txid'
        })

    }

    // 充值记录
    @action
    _renderRechargeDetail = (item, status) => {

        return (
            <View style={[styles.itemBox]}>
                {/*数量 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>数量</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{this.$globalFunc.accFixed(item.amount, 8)}</Text>
                </View>
                {/*数量 begin*/}

                {/*状态 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>状态</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{status}</Text>
                </View>
                {/*状态 end*/}

                {/*分割线 begin*/}
                <View style={styles.line}>

                </View>
                {/*分割线 end*/}

                {/*地址 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>地址</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23, styles.toAddress]}>{item.toAddress}</Text>
                </View>
                {/*地址 end*/}

                {/*memo begin*/}
                {!!item.memoAddress && <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>memo(备注）</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23, styles.toAddress]}>{item.memoAddress}</Text>
                </View>}
                {/*memo end*/}

                {/*Txid begin*/}
                {
                    !!item.uniqueId &&
                    <View style={[styles.itemDetailBox]}>
                        <Text allowFontScaling={false} style={[styles.itemTitle]}>Txid</Text>
                        <Text allowFontScaling={false}
                            style={[styles.itemDetail, baseStyles.text0D0E23, styles.txid]}>{item.uniqueId}</Text>
                    </View>
                }
                {/*Txid end*/}

                {/*日期 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>日期</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{this.$globalFunc.formatDateUitl(item.createdAt, 'YYYY-MM-DD hh:mm:ss')}</Text>
                </View>
                {/*日期 end*/}


                {/*点击复制 begin*/}

                <View style={styles.btnBox}>
                    {
                        !!item.uniqueId
                        &&
                        <View style={styles.txidBox}>
                            <View style={styles.btnLeftBox}>
                                <BaseButton
                                    onPress={() => {
                                        this.copyRechargeTxid(item.uniqueId)
                                    }}
                                    text={'复制Txid'}
                                    textStyle={styles.btnText}
                                    style={styles.btn}
                                />
                            </View>
                            <View style={styles.btnRightBox}>
                                <BaseButton
                                    onPress={() => {
                                        this.checkRechargeTxid(item)
                                    }}
                                    text={'检查Txid'}
                                    textStyle={styles.btnText}
                                    style={styles.btn}
                                />
                            </View>
                        </View>
                    }

                </View>

                {/*点击复制 end*/}


            </View>
        )
    }


    // 拷贝提现Txid
    @action
    copyWithdrawalsTxid = (txid) => {
        Clipboard.setString(txid)

        this.$globalFunc.toast('复制成功')

    }

    // 检查提现Txid
    @action
    checkWithdrawalsTxid = (item) => {
        let url = ''


        let currencyObj = item.isUSDT2 ? this.$store.state.currency.get('USDT2') : this.$store.state.currency.get(item.currency)


        // 如果是ETH的
        if (item.currency === 'ETH' || (currencyObj && currencyObj.addressAliasTo === 'ETH')) {
            url = `https://etherscan.io/tx/${item.tx}`
        } else if (item.currency === 'ACT' || (currencyObj && currencyObj.addressAliasTo === 'ACT')) {
            url = `https://browser.achain.com/#/tradeInfo/${item.tx}`
        } else if (item.currency === 'EOSFORCEIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSFORCEIO')) {
            url = `https://explorer.eosforce.io/#/transaction_detail_view/${item.tx}`
        } else if (item.currency === 'OMNI' || (currencyObj && currencyObj.addressAliasTo === 'OMNI')) {
            url = `https://www.omniexplorer.info/tx/${item.tx}`
        } else if (item.currency === 'EOSIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSIO')) {
            url = `https://eosflare.io/tx/${item.tx}`
        } else {
            url = `https://blockchain.info/zh-cn/tx/${item.tx}`
        }


        this.$router.push('WebPage', {
            url: url,
            navHide: false,
            title: '检查Txid'
        })

    }


    // 打开取消提现modal
    @action
    openCancelWithdrawalsModal = () => {
        this.cancelWithdrawalsModalShow = true
    }

    // 关闭取消提现modal
    @action
    closeCancelWithdrawalsModal = () => {
        this.cancelWithdrawalsModalShow = false
    }

    // 撤销提现
    @action
    cancelWithdrawals = () => {
        this.openCancelWithdrawalsModal()
        this.cancelId = this.recordsItem.id
    }

    // 确认取消
    @action
    confirmCancelWithdrawals = () => {
        this.closeCancelWithdrawalsModal()
        this.loading = true
        this.$http.send('POST_CANCEL_WITHDRAWALS', {
            bind: this,
            params: {
                withdrawRequestId: this.cancelId
            },
            callBack: this.re_confirmCancelWithdrawals,
            errorHandler: this.error_confirmCancelWithdrawals,
        })
    }

    // 点击撤销返回
    @action
    re_confirmCancelWithdrawals = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        // console.warn('撤单返回', data)
        this.loading = false


        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '用户未登录'
                    break;
                case 2:
                    msg = '找不到对应记录'
                    break;
                case 3:
                    msg = '当前状态不可撤销'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }


            this.$globalFunc.toast(msg)

            return
        }


        this.$globalFunc.toast('撤销成功')


        this.canCancel = false
        this.status = '已撤销'
        this.$event.notify({key: 'GET_WITHDRAWALS_RECORDS'})


    }

    // 点击撤销错误
    @action
    error_confirmCancelWithdrawals = (err) => {
        console.warn('撤单出错', err)
        this.loading = false

        this.$globalFunc.toast('暂不可用，请稍后再试')


    }


    // 提现详情
    @action
    _renderWithdrawalsDetail = (item, cancelWithdrawalsModalShow, status, canCancel) => {
        // console.warn("item", item)
        return (
            <View style={[styles.itemBox]}>
                {/*数量 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>数量</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{this.$globalFunc.accFixed(item.amount, 8)}</Text>
                </View>
                {/*数量 begin*/}

                {/*状态 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>状态</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{status}</Text>
                </View>
                {/*状态 end*/}

                {/*分割线 begin*/}
                <View style={styles.line}>

                </View>
                {/*分割线 end*/}

                {/*地址 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>地址</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23, styles.toAddress]}>{item.toAddress}</Text>
                </View>
                {/*地址 end*/}
                {/*memo begin*/}
                {
                    !!item.memoAddress && <View style={[styles.itemDetailBox]}>
                        <Text allowFontScaling={false} style={[styles.itemTitle]}>memo(备注）</Text>
                        <Text allowFontScaling={false}
                          style={[styles.itemDetail, baseStyles.text0D0E23, styles.toAddress]}>{item.memoAddress}</Text>
                    </View>
                }
                {/*memo end*/}
                {/*Txid begin*/}
                {
                    !!item.tx &&
                    <View style={[styles.itemDetailBox]}>
                        <Text allowFontScaling={false} style={[styles.itemTitle]}>Txid</Text>
                        <Text allowFontScaling={false}
                            style={[styles.itemDetail, baseStyles.text0D0E23, styles.txid]}>{item.tx}</Text>
                    </View>
                }
                {/*Txid end*/}

                {/*日期 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>日期</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{this.$globalFunc.formatDateUitl(item.createdAt, 'YYYY-MM-DD hh:mm:ss')}</Text>
                </View>
                {/*日期 end*/}

                {/*驳回理由 begin*/}
                {
                    !!item.errorMessage && <View style={[styles.itemDetailBox]}>
                        <Text allowFontScaling={false} style={[styles.itemTitle]}>{this.status === '被驳回' && '驳回理由' || '失败理由'}</Text>
                        <Text allowFontScaling={false}
                            style={[styles.itemDetail, baseStyles.text0D0E23, styles.errorMessage]}>{item.errorMessage}</Text>
                    </View>
                }
                {/*驳回理由 end*/}


                {/*点击复制 begin*/}

                <View style={styles.btnBox}>

                    {/*提现撤销按钮*/}
                    {
                        !!canCancel && <BaseButton
                            onPress={this.cancelWithdrawals}
                            text={'撤销提现'}
                            textStyle={[baseStyles.textWhite, styles.cancelWithdrawalsText]}
                            style={[baseStyles.btnBlue, styles.cancelWithdrawalsBtn]}

                        />
                    }

                    {
                        !!item.tx &&
                        <View style={styles.txidBox}>
                            <View style={styles.btnLeftBox}>
                                <BaseButton
                                    onPress={() => {
                                        this.copyWithdrawalsTxid(item.tx)
                                    }}
                                    text={'复制Txid'}
                                    textStyle={styles.btnText}
                                    style={styles.btn}
                                />
                            </View>
                            <View style={styles.btnRightBox}>
                                <BaseButton
                                    onPress={() => {
                                        this.checkWithdrawalsTxid(item)
                                    }}
                                    text={'检查Txid'}
                                    textStyle={styles.btnText}
                                    style={styles.btn}
                                />
                            </View>
                        </View>
                    }
                </View>

                {/*点击复制 end*/}


                {/*提现撤销弹窗 begin*/}
                <Modal
                    isVisible={cancelWithdrawalsModalShow}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                >
                    <View style={ModalStyles.modalBox}>
                        <View style={ModalStyles.modalCloseBox}>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.closeCancelWithdrawalsModal}
                            >
                                <Image source={CloseIcon} style={ModalStyles.modalCloseIcon}/>
                            </TouchableOpacity>
                        </View>
                        <View style={ModalStyles.modalArticleBox}>
                            <View style={ModalStyles.modalTitleBox}>
                                <Text allowFontScaling={false} style={[ModalStyles.modalTitle]}>确定撤销？</Text>
                            </View>
                            <View style={ModalStyles.modalArticleDetailBox}>
                                <Text allowFontScaling={false} style={ModalStyles.articleText}>
                                    确定撤销此次提现？
                                </Text>

                                <View style={ModalStyles.btnBox}>
                                    <BaseButton
                                        onPress={this.closeCancelWithdrawalsModal}
                                        text={'取消'}
                                        style={[ModalStyles.btn, ModalStyles.cancelBtn]}
                                        textStyle={[ModalStyles.btnText, ModalStyles.cancelBtnText]}
                                    />
                                    <BaseButton
                                        onPress={this.confirmCancelWithdrawals}
                                        text={'确认'}
                                        style={[ModalStyles.btn, ModalStyles.confirmBtn]}
                                        textStyle={[ModalStyles.btnText, ModalStyles.confirmBtnText]}
                                    />
                                </View>


                            </View>
                        </View>
                    </View>

                </Modal>
                {/*提现撤销弹窗 end*/}


            </View>
        )

    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        // let headerTitle = this.recordsItem.currency
        let headerTitle = ''
        this.type === typeArr[0] ? headerTitle += '充币详情' : headerTitle += '提币详情'


        return (
            <View style={[styles.container]}>
                <NavHeader headerTitle={headerTitle} goBack={this.goBack}/>

                <View style={[styles.boxPadding, styles.container,{backgroundColor:StyleConfigs.bgColor}]}>
                    {/*币种title begin*/}
                    <View style={styles.titleBox}>
                        {/*<Image source={{uri: 'http://logo.2020.exchange/' + this.recordsItem.currency + '.png'}}*/}
                               {/*style={styles.currencyIcon}*/}
                        {/*/>*/}
                        <Text allowFontScaling={false} style={[baseStyles.textColor, styles.currencyTitle]}>{this.recordsItem.currency}</Text>
                    </View>
                    {/*币种title end*/}
                    {/*如果是充值*/}
                    {
                        this.type === typeArr[0] && this._renderRechargeDetail(this.recordsItem, this.status)
                    }
                    {/*如果是提现*/}
                    {
                        this.type === typeArr[1] && this._renderWithdrawalsDetail(this.recordsItem, this.cancelWithdrawalsModalShow, this.status, this.canCancel)
                    }
                </View>
                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
