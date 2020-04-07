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
export default class InternalTransferRecordsDetail extends RNComponent {


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
        this.transferType = this.$params && this.$params.transferType || ''
        this.transferStatus = this.$params && this.$params.transferStatus || ''
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

    // 提现详情
    @action
    _internalTransferDetail = (item, transferType, transferStatus) => {
        let fromUserIsMe = item.fromUserId == this.$store.state.authMessage.userId
        // console.warn("item", item)
        return (
            <View style={[styles.itemBox]}>
                {/*订单编号 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>订单编号</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{item.transferId}</Text>
                </View>
                {/*订单编号 begin*/}

                {/*类型 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>类型</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{transferType}</Text>
                </View>
                {/*类型 begin*/}

                {/*分割线 begin*/}
                {/*<View style={styles.line}/>*/}
                {/*分割线 end*/}

                {/*姓名 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>姓名</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{fromUserIsMe ? item.toName : item.fromName}</Text>
                </View>
                {/*姓名 end*/}

                {/*账号 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>账号</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{fromUserIsMe ? item.toEmail : item.fromEmail}</Text>
                </View>
                {/*账号 end*/}

                {/*UID begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>UID</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{fromUserIsMe ? item.toUserId : item.fromUserId}</Text>
                </View>
                {/*UID end*/}

                {/*币种 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>币种</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{item.currency}</Text>
                </View>
                {/*币种 end*/}

                {/*数量 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>数量</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{this.$globalFunc.accFixed(item.amount, 8)}</Text>
                </View>
                {/*数量 end*/}

                {/*日期 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>日期</Text>
                    <Text allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{this.$globalFunc.formatDateUitl(item.updatedAt, 'YYYY-MM-DD hh:mm:ss')}</Text>
                </View>
                {/*日期 end*/}

                {/*状态 begin*/}
                <View style={[styles.itemDetailBox]}>
                    <Text allowFontScaling={false} style={[styles.itemTitle]}>状态</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.itemDetail, baseStyles.text0D0E23]}>{transferStatus}</Text>
                </View>
                {/*状态 end*/}

            </View>
        )

    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        // let headerTitle = this.recordsItem.currency
        let headerTitle = '内部转账详情'

        return (
            <View style={[styles.container]}>
                <NavHeader headerTitle={headerTitle} goBack={this.goBack}/>

                <View style={[styles.boxPadding, styles.container,{backgroundColor:StyleConfigs.bgColor}]}>
                    {/*币种title begin*/}
                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={[styles.currencyTitle]}>{this.$globalFunc.accFixed(this.recordsItem.amount, 8) + this.recordsItem.currency}</Text>
                    </View>
                    {/*币种title end*/}

                    {
                        this._internalTransferDetail(this.recordsItem,this.transferType, this.transferStatus)
                    }
                </View>
                {/*加载中*/}
                {/*{*/}
                    {/*this.loading && <Loading leaveNav={false}/>*/}
                {/*}*/}
            </View>
        )
    }
}
