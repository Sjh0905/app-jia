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
export default class VerifyPopupsBindBank extends RNComponent {

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
        // cancelText: '取消',
        okText: '确认',
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

        this.$http.send('SEND_MOBILE_VERIFY_CODE', {
            bind: this,
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
            switch (data.errorCode) {
                case 1:
                    this.verificationCodeWA = '请刷新重试'
                    break;
                default:
                    this.verificationCodeWA = '暂不可用'
            }
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


        let method = ''
        let code = ''
        //如果是谷歌
        if(this.pickedGA){
            method = 'ga'
            code = this.GACode

        }else {//如果是手机
            method = 'sms'
            code = this.verificationCode
        }

        this.props.onSure && this.props.onSure(method,code)

    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return <View style={styles.alertBox}>
            <TouchableOpacity activeOpacity={0.6} onPress={this.props.onClose || this.onClose} style={styles.alertBoxBackground}/>
            <View style={[styles.alert,this.props.style || {}]}>

                {
                    this.props.showPicker &&
                    <View style={[styles.alertTitle]}>
                        <TouchableOpacity
                            style={styles.pickedTouch}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.pickGA}
                        >
                            <Text style={[styles.inputField,this.pickedGA && styles.pickedInputField || null]}>
                                谷歌验证
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.pickedTouch}
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.pickMobile}
                        >
                            <Text style={[{marginLeft:getWidth(40)},styles.inputField,!this.pickedGA && styles.pickedInputField || null]}>
                                手机验证
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    !this.props.showPicker &&
                    <View style={[styles.alertTitle]}>
                        <View style={styles.pickedTouch}>
                            <Text style={[styles.pickedInputField]}>
                                {this.pickedGA ? '谷歌验证' : '手机验证'}
                            </Text>
                        </View>
                    </View>
                }

                <View style={styles.buyInputBox}>

                    {this.pickedGA &&<Text style={styles.inputTitle}>谷歌验证码</Text>}
                    {/*谷歌验证*/}
                    {this.pickedGA &&
                        <View style={[styles.buyInputBox, styles.inputItemBox]}>
                            {/*输入框 begin*/}
                            <TextInput
                                allowFontScaling={false}
                                style={[styles.inputLeftInput,{width:'100%'}]}
                                placeholder={'请输入验证码'}
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

                    {!this.pickedGA &&<Text style={styles.inputTitle}>手机验证码</Text>}
                    {/*手机验证*/}
                    {!this.pickedGA &&
                        <View style={[styles.buyInputBox,styles.inputItemBox]}>
                            <View style={styles.inputLeftBox}>
                                {/*输入框 begin*/}
                                <TextInput
                                    allowFontScaling={false}
                                    style={[styles.inputLeftInput,{width:getWidth(DefaultWidth-30-30-170)}]}
                                    placeholder={'请输入验证码'}
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


                <BaseButton
                    style={[styles.alertBtnBlue]}
                    textStyle={styles.alertBtnTextWhite}
                    text={this.props.okText}
                    onPress={this.commitForm}/>
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
        width: getWidth(DefaultWidth),
        paddingBottom:getWidth(180-40)+getDeviceBottom(),//40:错误提示信息所占位置
        paddingHorizontal: getWidth(30),
        // height: getHeight(314),
        // borderRadius: 8,
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
        paddingHorizontal: getWidth(30),
        height: getHeight(100),
        borderColor: StyleConfigs.borderBottomColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row'
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
    alertBtnBlue: {
        position:'absolute',
        left:getWidth(30),
        bottom:getWidth(30)+getDeviceBottom(),
        width:getWidth(DefaultWidth-60),
        height: getHeight(88),
        backgroundColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.borderRadius1o5,
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
        // paddingHorizontal:getWidth(30),
        // backgroundColor:'#ccc',
        // alignItems:'center'
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
        // width:'50%',
        // flexDirection:'row',
        // justifyContent:'center',
        // alignItems:'center',
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
        lineHeight:getWidth(64),
        // width:getWidth(128),
        color:StyleConfigs.txt6B7DA2,
        fontSize:StyleConfigs.fontSize13
    },
    pickedInputField:{
        // width:getWidth(128),
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize16
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
        fontSize: StyleConfigs.fontSize16,
        paddingLeft: 0,
        color: StyleConfigs.txt172A4D,
    },


    // 验证码的文字
    inputRightBox: {

        justifyContent: 'center',
        alignItems: 'center',
        // flex: 25.39,
        width: getWidth(170),
        height: getHeight(30),
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderLeftWidth: StyleSheet.hairlineWidth,
    },

    inputRightText: {
        paddingLeft:getWidth(26),
        color: StyleConfigs.txtBlue,
        fontSize: StyleConfigs.fontSize14,
    },
    inputItemBox: {
        // flex:1,
        width:'100%',
        height:getHeight(90),
        // lineHeight:getHeight(90),
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        // borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: StyleConfigs.borderBottomColor,
        marginTop:getHeight(16),
        marginBottom:getHeight(4)
    },
    wrongText:{
        width:'100%',
        height:getHeight(40),
        lineHeight:getHeight(40),
        color:StyleConfigs.txtRed,
        fontSize:StyleConfigs.fontSize12,
        marginBottom:-getHeight(10),
    },
    inputTitle: {
        paddingTop: getWidth(58),
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontSize: StyleConfigs.fontSize12,
        fontWeight: 'normal',
        fontFamily: 'System',
        color: StyleConfigs.txt172A4D,
    },

})