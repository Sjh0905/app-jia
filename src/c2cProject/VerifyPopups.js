import React from 'react';
import {StyleSheet, View, Modal,TextInput,Text,TouchableOpacity,Image} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import BaseStyle from '../style/BaseStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import BaseButton from '../components/baseComponent/BaseButton'
import CountDown from '../components/baseComponent/BaseCountDown'

import SignBaseStyle from "../style/SignBaseStyle";
import CheckBox from '../components/baseComponent/BaseCheckBox'
import close from '../assets/AdditionalRewards/close.jpg';
import gaIcon from '../assets/SignVerification/google-icon.png'
// import mobileIcon from '../assets/SignVerification/phone-icon.png'
import closeIcon from '../assets/Modal/close-icon.png';
import propTypes from 'prop-types'
import Toast from 'react-native-root-toast'


@observer
export default class VerifyPopups extends RNComponent {

    static propTypes = {
        order:propTypes.any,
        showPicker:propTypes.bool,
        picked: propTypes.string,
        title: propTypes.string,
        onSure: propTypes.func,
        onCancel: propTypes.func,
        onClose: propTypes.func,
        close: propTypes.bool,
        cancelText: propTypes.string,
        okText: propTypes.string,
        style:propTypes.any,
        alertBtnBlueStyle:propTypes.any
    }

    static defaultProps = {
        order:{},
        showPicker:true,
        picked:'bindGA',//bindMobile bindGA
        title: '安全验证',
        tips:'',
        close: true,
        cancelText: '取消',
        okText: '确定',
        style:null,
        alertBtnBlueStyle:null
    }


    /*----------------------- data -------------------------*/

    @observable
    GACode = ''

    @observable
    GACodeWA = ''

    @observable
    verificationCode = '';

    @observable
    verificationCodeWA = '';

    @observable
    pickedGA = this.props.picked == 'bindGA';//是否绑定谷歌

    @observable
    sending: false

    @observable
    popText: '系统繁忙'

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    @action
    pickGA = ()=>{
        this.pickedGA = true
        console.log('选择了GA');
    }
    @action
    pickMobile = ()=>{
        this.pickedGA = false
        console.log('选择了Mobile');
    }
    @action
    onCancel = ()=>{}

    @action
    onSure = ()=>{
        // let that = this;
        // that.props.onSure && that.props.onSure()
    }

    @action
    onClose = ()=>{}

    //获取手机验证码
    click_getVerificationCode = ()=>{

        this.$http.send('ORDER_MAIL_CODE', {
            bind: this,
            params: {
                type: "mobile",
                mun: "",
                purpose:"Confirm"
            },
            callBack: this.re_getVerificationCode,
            errorHandler: this.error_getVerificationCode
        })
    }

    // 验证码回复
    @action
    re_getVerificationCode = (data) => {
        if (typeof data === 'string') data = JSON.parse(data)
        console.log('发送手机验证码回复', data)
        if (data.errorCode) {
            data.errorCode === 1 && (this.verificationCodeWA = '用户未登录')
            data.errorCode === 2 && (this.verificationCodeWA = '过于频繁')
            data.errorCode === 3 && (this.verificationCodeWA = '手机验证码发送异常')
            data.errorCode === 4 && (this.verificationCodeWA = '过于频繁')
            data.errorCode === 100 && (this.verificationCodeWA = '过于频繁被锁定')
        }
    }

    // 验证码回复出错
    @action
    error_getVerificationCode = (err) => {
        console.warn("获取验证码出错！", err)
    }

    //点击确定
    commitForm = ()=>{

        let canSend = true;

        if (this.pickedGA && this.GACode === '') {
            this.GACodeWA = '请输入谷歌验证码'
            canSend = false
        }
        if (!this.pickedGA && this.verificationCode === '') {
            this.verificationCodeWA = '请输入手机验证码'
            canSend = false
        }

        if (!canSend) {
            // console.log("不能发送！")
            return
        }


        let pickedType = ''
        let code = ''
        //如果是谷歌
        if(this.pickedGA){
            pickedType = 'ga'
            code = this.GACode

        }else {//如果是手机
            pickedType = 'mobile'
            code = this.verificationCode
        }

        this.sending = true;

        this.$http.send('COMMEN_AUTH_FORCTC', {
            bind: this,
            params: {
                "type": pickedType,
                "code": code,
                "purpose":"Confirm",
                "ctcOrderId": this.props.order.id
            },
            callBack: this.re_commitForm,
            errorHandler: this.error_commitForm
        })
    }

    // 验证码回复
    @action
    re_commitForm = (data) => {
        if (typeof data === 'string') data = JSON.parse(data)
        console.log('确定已收款回复', data)

        let code = data.errorCode;
        this.sending = false;
        let self = this;
        if (code == 0) {
            //回调
            self.props.onSure && self.props.onSure()

            // this.show_buy_sell_btn = false;
            // this.show_ga_sms_dialog = false;
            // 跳到已完成界面
            // this.GO_ORDER_COMPELETE();
        }
        if (code > 0) {
            switch (code) {
                case 1:
                    self.popText = '用户未登录';
                    break;
                case 3:
                    self.popText = '系统繁忙';
                    break;
                case 5:
                    self.popText = '验证码过期/错误';
                    break;
                default:
                    break;
            }

            Toast.show(self.popText, {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        }

    }

    // 验证码回复出错
    @action
    error_commitForm = (err) => {
        console.warn("确定已收款出错！", err)
    }




    /*----------------------- 挂载 -------------------------*/

    render() {
        return <View style={styles.alertBox}>
            <View style={styles.alertBoxBackground}></View>
            <View style={[styles.alert,this.props.style || {}]}>
                <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} style={styles.alertClose} onPress={this.props.onClose || this.onClose}>
                    <Image style={styles.alertIcon} source={closeIcon} resizeMode={'stretch'}/>
                </TouchableOpacity>
                <View style={styles.alertTitle}>
                    <Text allowFontScaling={false} style={[styles.alertTitleText]}>{this.props.title}</Text>
                </View>

                <View style={styles.buyInputBox}>
                    {
                        this.props.showPicker &&
                        <View style={styles.pickedBox}>
                            <TouchableOpacity
                                style={styles.pickedTouch}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.pickGA}
                            >
                                <View style={[styles.pickRadio,this.pickedGA && styles.pickedStyle || null]}/>
                                <Text style={styles.inputField}>
                                    谷歌验证
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pickedTouch}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.pickMobile}
                            >
                                <View style={[styles.pickRadio,!this.pickedGA && styles.pickedStyle || null]}/>
                                <Text style={styles.inputField}>
                                    手机验证
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/*谷歌验证*/}
                    {this.pickedGA &&
                        <View style={[styles.buyInputBox, styles.inputItemBox]}>
                            {/*输入框 begin*/}
                            <TextInput
                                allowFontScaling={false}
                                style={[styles.inputLeftInput,{width:'100%'}]}
                                placeholder={'请输入谷歌验证码'}
                                placeholderTextColor={StyleConfigs.placeholderTextColorHui}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.GACode = text
                                }}
                                returnKeyType={'done'}
                                keyboardType={'numeric'}
                            />
                            {/*输入框 end*/}
                        </View>
                    }
                    {
                        this.pickedGA && <Text style={styles.wrongText}>
                            {this.GACodeWA != '' && this.GACodeWA || ''}
                        </Text>
                    }


                    {/*手机验证*/}
                    {!this.pickedGA &&
                        <View style={[styles.buyInputBox,styles.inputItemBox]}>
                            <View style={styles.inputLeftBox}>
                                {/*输入框 begin*/}
                                <TextInput
                                    allowFontScaling={false}
                                    style={[styles.inputLeftInput,{width:getWidth(650-40-40-170)}]}
                                    placeholder={'请输入手机验证码'}
                                    placeholderTextColor={StyleConfigs.placeholderTextColorHui}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.verificationCode = text
                                    }}
                                    returnKeyType={'done'}
                                    keyboardType={'numeric'}

                                />
                                {/*输入框 end*/}
                            </View>

                            {/*获取验证码 begin*/}
                            <CountDown
                                onPress={this.click_getVerificationCode}
                                boxStyle={styles.inputRightBox}
                                textStyle={[styles.inputRightText,{color:StyleConfigs.txtBlue}]}
                                countingTextStyle={styles.inputRightText}
                                text={'发送验证码'}
                                time={60}
                            ></CountDown>
                            {/*获取验证码 end*/}
                        </View>
                    }

                    {!this.pickedGA &&
                        <Text style={styles.wrongText}>
                            {this.verificationCodeWA != '' && this.verificationCodeWA || ''}
                        </Text>
                    }


                </View>

                <View style={styles.alertBtnBox}>
                    {
                        this.props.cancelText
                        &&
                        <BaseButton style={[styles.alertBtnWhite]}
                                    textStyle={[styles.alertBtnTextBlue]}
                                    text={this.props.cancelText}
                                    onPress={this.props.onCancel || this.onCancel}/>
                        ||
                        null
                    }
                    <BaseButton
                        style={[styles.alertBtnBlue]}
                        textStyle={styles.alertBtnTextWhite}
                        text={this.props.okText}
                        onPress={this.commitForm}/>
                </View>
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    alertBox:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBoxBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        opacity: 0.6
    },
    alert:{
        backgroundColor: '#fff',
        width: getWidth(650),
        // height: getHeight(314),
        borderRadius: 8,
        // marginTop: getHeight(300)
    },
    alertClose:{
        width: getWidth(40),
        height: getWidth(40),
        position: 'absolute',
        right: 0,
        top: getWidth(-60)
    },
    alertIcon:{
        width: '100%',
        height: '100%'
    },
    alertTitle:{
        marginLeft: getWidth(40),
        marginRight: getWidth(40),
        height: getHeight(96),
        borderColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertTitleText:{
        fontSize: 16,
        color: StyleConfigs.txtBlue,
        fontWeight: 'bold'
    },
    tipsText:{
        marginTop:getHeight(10),
        fontSize:13,
        color:StyleConfigs.txtRed,
        flexWrap:'wrap',
        lineHeight:getHeight(34)
    },
    alertBtnBox:{
        height: getHeight(72),
        marginBottom: getHeight(40),
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    alertBtnWhite:{
        width:getWidth(250),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnBlue,
        backgroundColor: StyleConfigs.btnWhite,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnBlue:{
        width:getWidth(250),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnBlue,
        backgroundColor: StyleConfigs.btnBlue,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnTextBlue:{
        fontSize: 15,
        color: StyleConfigs.txtBlue
    },
    alertBtnTextWhite:{
        fontSize: 15,
        color: StyleConfigs.txtWhite
    },
    buyInputBox:{
        marginLeft: getWidth(40),
        marginRight: getWidth(40),
        width:getWidth(650-40-40),
        // backgroundColor:'#ccc',
        paddingVertical:getHeight(20),
        alignItems:'center'
    },
    pickedBox:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:getHeight(50),
        // paddingHorizontal:getWidth(50)
    },
    pickedTouch:{
        width:'50%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    pickRadio:{
        width:getWidth(18),
        height:getWidth(18),
        borderRadius:getWidth(18)/2,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.borderColor,
        marginRight:getWidth(10)
    },
    pickedStyle:{
        borderColor:StyleConfigs.btnBlue,
        backgroundColor:StyleConfigs.btnBlue
    },
    inputField:{
        // width:getWidth(128),
        color:StyleConfigs.txt333333,
        fontSize:StyleConfigs.fontSize14
    },
    // 如果有验证码的输入框
    inputLeftBox: {
        // width:getWidth(650-40-40),
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputLeftIconBox: {
        width: getWidth(30),
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    inputLeftInput: {
        // flex: 1,
        // width: getWidth(540),
        fontSize: StyleConfigs.fontSize14,
        paddingLeft: getWidth(30),
        color: StyleConfigs.txt333333,
    },


    // 验证码的文字
    inputRightBox: {

        justifyContent: 'center',
        alignItems: 'center',
        // flex: 25.39,
        width: getWidth(170),
        height: getHeight(30),
        borderColor: StyleConfigs.borderColor,
        borderStyle: 'solid',
        borderLeftWidth: StyleSheet.hairlineWidth,
    },

    inputRightText: {
        color: StyleConfigs.txtBlue,
        fontSize: StyleConfigs.fontSize14,
    },
    inputItemBox: {
        // flex:1,
        width:getWidth(650-40-40),
        // height:getHeight(44),
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: StyleConfigs.borderColor,
        borderRadius:StyleConfigs.borderRadius,
        marginTop:getHeight(16),
        marginBottom:getHeight(4)
    },
    wrongText:{
        width:getWidth(650-40-40),
        height:getHeight(40),
        lineHeight:getHeight(40),
        color:StyleConfigs.txtRed,
        fontSize:StyleConfigs.fontSize12,
        marginBottom:-getHeight(10),
        paddingLeft:getWidth(30)
    }
})