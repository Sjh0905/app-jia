/**
 * hjx 2018.4.16
 */

import React from 'react';
import {TextInput, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetWithdrawalsCodeVerifyItemStyle'
import propTypes from 'prop-types'

import keccak from 'keccakjs'


import BaseButton from './baseComponent/BaseButton'

import CountDown from './baseComponent/BaseCountDown'


import StyleConfigs from '../style/styleConfigs/StyleConfigs'


const typeArr = ['ga', 'mobile']

// 需要改变地址的币种
const NEED_TO_CHANGE = new Set(['BTC'])


@observer
export default class App extends RNComponent {

    static propTypes = {
        type: propTypes.string.isRequired
    }

    static defaultProps = {
        type: typeArr[0],
    }

    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    gaCode = ''

    @observable
    verificationCode = ''

    @observable
    address = ''

    @observable
    description = ''

    @observable
    amount = ''

    @observable
    realAmount = ''

    @observable
    currency = ''


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()


    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        this.currency = this.$beforeParams.currency
        this.address = this.$beforeParams.address
        this.description = this.$beforeParams.description
        this.amount = this.$beforeParams.amount
        this.realAmount = this.$beforeParams.realAmount

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
    commit = (() => {
        let last = 0;
        return () => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            let verifyCode = ''


            // 如果是谷歌验证
            if (this.props.type === typeArr[0]) {

                if (this.gaCode === '') {


                    this.$globalFunc.toast('请输入验证码')
                    return
                }


                verifyCode = this.gaCode


            }

            // 如果是手机验证
            if (this.props.type === typeArr[1]) {

                if (this.verificationCode === '') {


                    this.$globalFunc.toast('请输入验证码')


                    return
                }

                verifyCode = this.verificationCode

            }


            let address = this.address

            if(!this.$store.state.currency){
                this.$globalFunc.toast('网络异常,请稍后再试!');
                return;
            }

            let currencyObj = this.$store.state.currency.get(this.currency)

            if (currencyObj && currencyObj.addressAliasTo === 'ETH') {
                address = this.toChecksumAddress(address)
            }


            this.$http.send('POST_COMMON_AUTH', {
                bind: this,
                params: {
                    type: this.props.type,
                    purpose: 'withdraw',
                    code: verifyCode,
                    currency: this.currency,
                    description: this.description,
                    address: address,
                    amount: parseFloat(this.realAmount),
                },
                callBack: this.re_commit,
                errorHandler: this.error_commit,
                timeoutHandler: this.timeoutHandler,
            })

            this.loading = true

        }
    })()

    // 超时
    timeoutHandler = () => {
        this.$globalFunc.timeoutHandler
        this.loading = false
    }


    // 提交谷歌或手机验证码成功
    @action
    re_commit = (data) => {
        console.log('yanzheng',data)
        typeof data === 'string' && (data = JSON.parse(data))
        this.loading = false


        if (data.errorCode) {
            let msg = ''

            switch (data.errorCode) {
                case 1:
                    msg = '用户未登录'
                    break;
                case 2:
                    msg = '验证超时，请刷新重试'
                    break;
                case 3:
                    msg = '验证未通过，详情请提交工单'
                    // msg = '验证未通过，请联系客服处理'
                    break;
                case 4:
                    msg = '验证码错误/过期'
                    break;
                case 5:
                    msg = '提现地址不可超过10个，请删除历史提现地址后重试'
                    break;
                case 6:
                    msg = '提现地址错误'
                    break;
                case 7:
                    msg = '资金冻结失败'
                    break;
                case 8:
                    msg = '不支持的币种类型'
                    break;
                case 9:
                    msg = '缺少此币种提币规则'
                    break;
                case 10:
                    msg = '小于最小提币数量'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }


            this.$globalFunc.toast(msg)


            if (data.errorCode !== 4)
                this.$router.goBackToRoute('Withdrawals')

            return
        }


        this.$globalFunc.toast('申请成功')


        this.$router.goBackToRoute('AssetDetail')

    }


    //提交谷歌或手机验证码失败
    @action
    error_commit = (err) => {
        // console.warn('提交谷歌或手机验证码失败', err)
        this.loading = false

        this.$globalFunc.toast('暂不可用，请稍后再试')

    }


    // 渲染谷歌验证
    _renderGa = () => {
        return (
            <View style={[baseStyles.paddingBox, styles.container]}>
                <View style={[styles.inputBox]}>
                    <TextInput
                        allowFontScaling={false}
                        style={[styles.input,{color:StyleConfigs.txt131F30}]}
                        placeholder={'谷歌验证码'}
                        placeholderTextColor={StyleConfigs.txtC5CFD5}
                        underlineColorAndroid={'transparent'}
                        value={this.gaCode}
                        onChangeText={(text) => {
                            this.gaCode = text
                        }}
                        returnKeyType={'done'}
                        keyboardType={'numeric'}
                    />
                </View>

                <BaseButton
                    onPress={this.commit}
                    text={'确定'}
                    textStyle={[baseStyles.textWhite, styles.btnText]}
                    style={[baseStyles.btnBlue, styles.btn]}
                />
            </View>
        )
    }


    // 获取手机验证码
    @action
    getMobileVerification = (() => {
        let last = 0;
        return () => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$http.send('POST_VERIFICATION_CODE', {
                bind: this,
                params: {
                    type: 'mobile',
                    purpose: 'withdraw'
                },
                callBack: this.re_getMobileVerification,
                errorHandler: this.error_getMobileVerification,
            })
        }
    })()
    // 获取手机验证码
    @action
    re_getMobileVerification = (data) => {
        console.log(data);
        typeof data === 'string' && (data = JSON.parse(data))

        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '用户未登录'
                    break;
                case 2:
                    msg = '未绑定手机'
                    break;
                case 3:
                    msg = '已发送'
                    break;
                case 4:
                    msg = '系统异常'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'

            }

            this.$globalFunc.toast(msg)


        }
    }
    // 获取手机验证码出错
    @action
    error_getMobileVerification = (err) => {
        console.warn('获取手机验证码出错！', err)
    }


    // 渲染手机验证
    _renderMobile = () => {
        return (
            <View style={[baseStyles.paddingBox, styles.container]}>
                <View style={[styles.inputBox]}>
                    <TextInput
                        allowFontScaling={false}
                        style={[styles.doubleInput,{color:StyleConfigs.txt131F30}]}
                        placeholder={'手机验证码'}
                        placeholderTextColor={StyleConfigs.txtC5CFD5}
                        underlineColorAndroid={'transparent'}
                        value={this.verificationCode}
                        onChangeText={(text) => {
                            this.verificationCode = text
                        }}
                        returnKeyType={'done'}
                        keyboardType={'numeric'}

                    />
                    <CountDown
                        onPress={this.getMobileVerification}
                        text={'获取'}
                        textStyle={[baseStyles.textBlue, styles.countDownText]}
                        boxStyle={[styles.countDownBox]}
                        time={60}
                        ref={'CountDown'}
                    />
                </View>
                <BaseButton
                    onPress={this.commit}
                    text={'确定'}
                    textStyle={[baseStyles.textWhite, styles.btnText]}
                    style={[baseStyles.btnBlue, styles.btn]}
                />
            </View>
        )
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.bgColor]}>

                {/*渲染谷歌认证*/}
                {
                    this.props.type === typeArr[0] && this._renderGa()
                }
                {/*渲染手机认证*/}
                {
                    this.props.type === typeArr[1] && this._renderMobile()
                }

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
