/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Platform,Text, TextInput, View,TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/MineBindMobileStyle'
import inputStyles from "../style/MineInputStyle"
import BaseButton from './baseComponent/BaseButton'
import CountDown from './baseComponent/BaseCountDown'
import JiYan from "./baseComponent/JiYan";
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import GetGeetestAndroid from "../../native/GetGeetest";
import ENV from "../configs/environmentConfigs/env";
import Toast from "react-native-root-toast";

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    // 密码
    @observable
    psw = ''

    // 手机号
    @observable
    mobile = ''

    // 验证码
    @observable
    verificationCode = ''


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()

        // 获取认证状态
        this.getAuthState()


    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        JiYan.setOptions('bindMobile', this.onJiYanResult)

    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        JiYan.deleteOptions('bindMobile')

    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    // 获取验证码
    @action
    getVerificationCode = () => {

        if (this.mobile === '') {
            this.$globalFunc.toast('请输入手机号')

            return
        }

        if (!this.$globalFunc.testMobile(this.mobile)) {
            this.$globalFunc.toast('请输入正确的手机号')

            return
        }

        this.onJiYanResult();
        /*if(Platform.OS === 'ios'){

            JiYan.startJiYan('bindMobile')
            return;
        }


        let API1=this.$globalFunc.getGeetestApi("/user/pullGeetest?client_type='APP'");
        let API2=this.$globalFunc.getGeetestApi('/user/checkGeetest');

        GetGeetestAndroid.tryPromise(ENV.networkConfigs.domain, API2).then((map)=> {
            // alert(map['gtStr']);
            // console.log('android_cookie======',map.cookie);
            // ENV.networkConfigs.headers.cookie = map.cookie;
            this.onJiYanResult({result:map['gtStr']});
        });*/
    }

    // 极验返回
    @action
    onJiYanResult = result => {
        // let jiYanResult = JSON.parse(result.result)
        let params = {
            // geetest_challenge: jiYanResult.geetest_challenge,
            // geetest_seccode: jiYanResult.geetest_seccode,
            // geetest_validate: jiYanResult.geetest_validate,
            client_type: 'APP',
            "type": "mobile",
            "mun": this.mobile,
            "purpose": "bind",
	         areaCode:this.$store.state.areaCode
        }
        console.log('bindMobile',params);

        this.$http.send('POST_VERIFICATION_CODE', {
            bind: this,
            timeout:3000,
            params: params,
            callBack: this.re_postVerificationCode,
            errorHandler: this.error_postVerificationCode,
            timeoutHandler:this.timeoutHandler
        })

        // Platform.OS === "android" && this.$globalFunc.deleteHeaderCookie();

    }

    // 获取验证码返回
    @action
    re_postVerificationCode = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '此手机已被其他用户绑定'
                    break;
                case 2:
                    msg = '发送过于频繁'
                    break;
                case 3:
                    msg = '暂不可用，请您稍后再试'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'
            }


            this.$globalFunc.toast(msg)

            return
        }
        this.refs.CountDown.beginCountDown()
    }
    // 获取验证码出错
    @action
    error_postVerificationCode = (err) => {
        console.warn('绑定手机号获取手机验证码失败！', err)

        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })

        // this.$globalFunc.toast('暂不可用，请稍后再试')

    }


    // 获取认证状态
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
        if (!data || data.errorCode) {
            return
        }
        this.$store.commit('SET_AUTH_STATE', data.dataMap)
        if (data.dataMap.sms) {
            this.$router.goBack()
        }
        this.loading = false
    }

    // 判断验证状态出错
    @action
    error_getAuthState = (err) => {
        console.warn("获取验证状态出错！", err)
        this.$router.goBack()
    }


    // 提交
    @action
    commit = () => {

        if (this.loading) return

        if (this.psw === '') {

            this.$globalFunc.toast('请输入密码')

            return
        }

        if (this.mobile === '') {

            this.$globalFunc.toast('请输入手机号')

            return
        }

        if (!this.$globalFunc.testMobile(this.mobile)) {

            this.$globalFunc.toast('请输入正确的手机号')

            return
        }

        if (this.verificationCode === '') {

            this.$globalFunc.toast('请输入验证码')

            return
        }


        let email = this.$store.state.authMessage.email

        this.$http.send('POST_COMMON_AUTH', {
            bind: this,
            timeout:3000,
            params: {
                type: 'mobile',
                purpose: 'bind',
                examinee: this.mobile,
                code: this.verificationCode,
                password: this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
	            areaCode:this.$store.state.areaCode
            },
            callBack: this.re_commit,
            errorHandler: this.error_commit,
            timeoutHandler:this.timeoutHandler
        })

        this.loading = true
    }

    // 超时
    timeoutHandler = ()=>{
        // this.$globalFunc.timeoutHandler
        this.loading = false
        Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
            duration: 1200,
            position: Toast.positions.CENTER
        })
    }


    // 提交回复
    @action
    re_commit = function (data) {
        typeof data === 'string' && (data = JSON.parse(data))
        this.loading = false

        //清空验证码
        this.verificationCode = '';

        if (!data) return
        if (data.errorCode) {
            let msg = ''
            switch (data.errorCode) {
                case 1:
                    msg = '此手机已被其他用户绑定'
                    break;
                case 2:
                    msg = '验证码或手机号错误'
                    break;
                case 3:
                    msg = '登录密码错误'
                    break;
                default:
                    msg = '暂不可用，请稍后再试'

            }


            this.$globalFunc.toast(msg)


            return
        }
        // this.getAuthState()


        this.$globalFunc.toast('绑定成功')


        this.$store.commit('SET_MOBILE_STATE', true)

        this.$router.popToTop()
    }

    // 提交出错
    @action
    error_commit = function (err) {
        // console.warn("绑定手机出错", err)
        this.loading = false
        err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
            duration: 1200,
            position: Toast.positions.CENTER
        })

        // this.$globalFunc.toast('暂不可用，请稍后再试')

    }

	goAreaPage = ()=>this.$router.push('RegisterArea')

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.bgColor,styles.container2]}>
                <NavHeader goBack={this.goBack}/>
                <Text style={[baseStyles.securityCenterTitle,{marginBottom:15}]}>绑定手机</Text>

                <View style={[baseStyles.paddingBox, inputStyles.containerBox,{backgroundColor:StyleConfigs.bgColor, flex:1}]}>
                    {/*登录密码*/}
                    <Text  allowFontScaling={false} style={inputStyles.titleText}>登录密码</Text>
                    <View style={[inputStyles.inputDetailBox, inputStyles.inputBoxBottom]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[inputStyles.inputDetail]}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            placeholder={'输入你的登录密码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            value={this.psw}
                            onChangeText={(text) => {
                                this.psw = text
                            }}
                            returnKeyType={'done'}
                        />
                    </View>

                    {/*手机号*/}
                    <Text  allowFontScaling={false} style={inputStyles.titleText}>手机</Text>
                    <View style={[inputStyles.inputDetailBox, inputStyles.inputBoxBottom]}>
                        <TouchableOpacity style={inputStyles.inputMobileTitleBox} onPress={this.goAreaPage}>
                            <Text  allowFontScaling={false} style={inputStyles.inputMobileTitle}>{this.$store.state.areaCode.replace(/00/,'+')}</Text>
                        </TouchableOpacity>
                        <TextInput
                            allowFontScaling={false}
                            style={[inputStyles.inputDetail,{paddingLeft:10}]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'输入你的手机'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            value={this.mobile}
                            onChangeText={(text) => {
                                this.mobile = text
                            }}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}
                        />
                    </View>

                    {/*短信验证码*/}
                    <Text  allowFontScaling={false} style={inputStyles.titleText}>短信验证码</Text>
                    <View style={[inputStyles.inputDetailBox, inputStyles.inputBoxBottom, inputStyles.spaceBetweenBox]}>
                        <TextInput
                            allowFontScaling={false}
                            style={[inputStyles.inputVerificationDetail]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'输入验证码'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            value={this.verificationCode}
                            onChangeText={(text) => {
                                this.verificationCode = text

                                this.$globalFunc.testVerificationCode(text,this.commit)
                            }}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}
                        />
                        <CountDown
                            boxStyle={[inputStyles.inputVerificationTitleBox]}
                            textStyle={[inputStyles.inputVerificationTitle]}
                            time={60}
                            text={'发送验证码'}
                            delay={true}
                            onPress={this.getVerificationCode}
                            ref={'CountDown'}
                        />

                    </View>

                    {/*点击确认*/}
                    <BaseButton
                        onPress={this.commit}
                        text={'确认'}
                        textStyle={[inputStyles.btnText]}
                        style={[inputStyles.btnbot]}
                    />


                </View>


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
