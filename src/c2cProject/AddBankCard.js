import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Picker,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert, Keyboard,

} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'

import NavHeader from '../components/baseComponent/NavigationHeader'
import Loading from '../components/baseComponent/Loading'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Toast from "react-native-root-toast";
import VerifyPopupsBindBank from "./VerifyPopupsBindBank";
import BaseButton from "../components/baseComponent/BaseButton";
import baseStyles from '../style/BaseStyle'
import Modal from 'react-native-modal'

@observer
export default class AddBankCard extends RNComponent {


    @computed get authStateForC2C(){
        return this.$store.state.authStateForC2C;
    }
    @computed get showVerifyPicker(){
        return this.authStateForC2C.ga && this.authStateForC2C.sms;
    }

    // 加载中
    @observable loading = false
    @observable selected = null;
    @observable selectedId = null;
    @observable isShowPicker = false
    @observable headerHeight = 0;
    @observable bankSelectList = [];

	@observable name = ''
	@observable cardNumber = ''
	@observable openBank = ''
	@observable bankAddress = ''
	@observable bankMark = ''
    @observable secondVerifyOpen = false// 二次验证弹窗

    @observable bankDefault = this.$params.bankList && this.$params.bankList == 0

    @action changeName = v => this.name = v;
	@action changeCardNumber = v => this.cardNumber = v;
	@action changeOpenBank = v => this.openBank = v;
	@action changeBankAddress = v => this.bankAddress = v;
	@action changeBankMark = v => this.bankMark = v;

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getBankList();
    }

    // 获取银行列表
    getBankList = () => {
        this.$http.send('GET_BANK', {
            bind: this,
            callBack: this.re_getBankList,
            errorHandler: this.error_getBankList
        })
        this.loading = true;
        return
    }


    // 获取银行列表回调
    re_getBankList = (data) => {
        this.loading = false;
        typeof data === 'string' && (data = JSON.parse(data));
        console.log('this is PaymenSet getBankList',data);
        this.bankSelectList = data;

        // for(var i = 0;i<this.bankSelectList.length;i++){
        //     if(this.bankSelectList[i].chineseName == this.bankInfo.bankNameCN){
        //         this.selected = i;
        //         break;
        //     }
        // }

    }
    // 获取银行列表出错
    error_getBankList = (err) => {
        Toast.show('获取银行列表请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    onChangeSelected = (index)=>{
        this.selected = index;
        this.selectedId = this.bankSelectList[index].id;
        this.hidePicker();
    }

    //显示银行列表选择
    showPicker = ()=>{
        Keyboard.dismiss()
        this.isShowPicker = true;
    }

    //隐藏银行列表选择
    hidePicker = ()=>{
        // setTimeout(()=>{
            this.isShowPicker = false;
        // },17)
    }


    // 开始二次验证弹窗  验证方式type: 1 2 3 4 1为绑定支付宝 2为修改支付宝 3为绑定银行卡 4为修改银行卡
    beginVerify=(type)=>{
        if(!this.testInput())return
        // this.verifyType = type
        this.secondVerifyOpen = true
    }
    verifyOnCancel = () =>{
        this.secondVerifyOpen = false;
    }
    verifyOnClose = () =>{
        this.secondVerifyOpen = false;
    }
    verifyOnSure = (method,code)=>{
        // this.secondVerifyOpen = false;

        // 绑定银行卡
        // if (!this.isEdit) {
            this.addBankPay(method, code)
        // }

        // // 修改银行卡
        // if (this.isEdit) {
        //     this.modifyBankPay(method, code,this.bankInfo.id)
        // }

    }

    @action
    testInput = ()=>{
        let result = true;
        let errMessage = '';

        if(result && this.name.trim() === ''){
            errMessage = '请输入姓名';
            result = false;
        }
        if(result && this.cardNumber.trim() === ''){
            errMessage = '请输入银行卡号';
            result = false;
        }
        // if(result && this.openBank === ''){
        //     errMessage = '请选择开户银行';
        //     result = false;
        // }

        if(result && this.selected === null){
            errMessage = '请选择开户银行';
            result = false;
        }

        if(result && this.bankAddress.trim() === ''){
            errMessage = '请输入开户支行';
            result = false;
        }

        // if(result && this.bankMark.trim() === ''){
        //     errMessage = '请输入备注信息';
        //     result = false;
        // }

        if(!result){
            Toast.show(errMessage, {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        }
        return result;
    }

    //添加银行卡支付
    @action
    addBankPay = (method, code)=>{
        let params = {
            'type': 'BANKCARD',
            'mark': this.bankMark,
            'username': this.name,
            'bankName': this.bankSelectList[this.selected].chineseName,
            'bankId': this.bankSelectList[this.selected].id,
            'bankAddr': this.bankAddress,
            'cardNumber': this.cardNumber,
            'isDefault': this.bankDefault ? 1 : 0,
            // 'isDefault': 1,
            'method': method,
            'code': code
        }
        let formData = new FormData();
        formData.append('userPayInfoBean',JSON.stringify(params));

        this.$http.send('ADD_PAYMENT_INFO', {
            formData:formData,
            bind: this,
            callBack: this.re_addBankPay,
            errorHandler: this.err_addBankPay
        })
        this.loading = true;
    }

    @action
    re_addBankPay = (data)=>{
        this.loading = false;
        console.log('this is PaymenSet addBankPay',data);
        typeof data === 'string' && (data = JSON.parse(data));

        if (data.resultCode) {
            let message = ''
            switch (data.resultCode) {
                case 1:
                    message = '失败，请重试'
                    break;
                case 2:
                    message = '暂不支持该银行卡'
                    break;
                case 3:
                    message = '图片保存失败'
                    break;
                case 4:
                    message = '重复绑定'
                    break;
                case 5:
                    message = '信息填写不完整'
                    break;
                case 6:
                    message = '未接收到图片'
                    break;
                case 7:
                    message = '图片过大超过2m'
                    break;
                case 8:
                    message = '上传图片不是jpg格式'
                    break;
                case 9:
                    message = '您的银行卡开户名，和在本网站账户实名认证姓名不一致或未实名认证'
                    break;
                case 10:
                    message = '验证码错误'
                    // if (method === 'ga') {
                    //     this.GACodeWA = '验证码错误'
                    // }
                    // if (method === 'sms') {
                    //     this.verificationCodeWA = '验证码错误'
                    // }
                    break;
                case 11:
                    message = '您未绑定谷歌验证或手机'
                    break;
                case 20:
                    message = '您有未完成的订单或挂单，不能重置默认收款银行卡'
                    break;
                default:
                    message = '暂不可用'
            }
            message && Toast.show(message, {
                duration: 1000,
                position: Toast.positions.CENTER
            })

            return
        }
        this.verifyOnClose();
        Toast.show('绑卡成功', {
            duration: 1000,
            position: Toast.positions.CENTER
        })

        this.notify({key: 'REFRESH_BANK_LIST'});
        setTimeout(()=>{
            if(this){
                this.goBack();
            }
        },1000);
    }

    @action
    err_addBankPay = (err)=>{
        this.loading = false;
        console.warn('添加银行卡支付请求出错',err);
        Toast.show('添加银行卡支付请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    goBack = () => {
        this.$router.goBack();
    }

    render() {
		return (
			<View style={styles.container}>
                <KeyboardAvoidingView style={[styles.container, styles.deviceBox]} behavior={'padding'}>

                <NavHeader headerTitle={''} goBack={this.goBack}/>
                    <ScrollView
                        keyboardShouldPersistTaps={'always'}
                        style={[styles.container]}>
                    {/*标题*/}
                    <View style={styles.titleWrap}>
                        <Text style={styles.title}>添加银行卡</Text>
                    </View>
                    {/*姓名*/}
                    <View style={styles.content}>
                        <Text style={styles.inputTitle}>姓名</Text>
                        {/*<Text style={styles.name}>姜楠</Text>*/}
                        <TextInput style={styles.input}
                                   placeholder={'请输入姓名'}
                                   maxLength={30}
                                   secureTextEntry={false}
                                   placeholderTextColor={StyleConfigs.placeholderTextColor}
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={this.changeName}
                                   allowFontScaling={false}
                                   returnKeyType={'done'}
                        />
                    </View>


                    {/*input框*/}
                    <View style={styles.bankContent}>
                        <Text style={styles.inputTitle}>银行卡号</Text>
                        <TextInput style={styles.input}
                                   placeholder={'请输入银行卡号'}
                                   // maxLength={30}
                                   secureTextEntry={false}
                                   placeholderTextColor={StyleConfigs.placeholderTextColor}
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={this.changeCardNumber}
                                   allowFontScaling={false}
                                   returnKeyType={'done'}

                        />
                    </View>

                    <View style={styles.bankContent}>
                        <Text style={styles.inputTitle}>开户银行</Text>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={this.showPicker}
                            style={[styles.inputTouch]}>
                            {this.selected !== null &&
                            <Text allowFontScaling={false} style={styles.selectedText}>{this.bankSelectList[this.selected].chineseName}</Text>
                            ||
                            <Text allowFontScaling={false} style={{color:StyleConfigs.placeholderTextColor}}>请选择银行卡名称</Text>
                            }

                            {this.isShowPicker && <View style={styles.arrowDown}/> || <View style={styles.arrowUp}/>}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bankContent}>
                        <Text style={styles.inputTitle}>开户支行</Text>
                        <TextInput style={styles.input}
                                   placeholder={'请输入开户支行'}
                                   maxLength={30}
                                   secureTextEntry={false}
                                   placeholderTextColor={StyleConfigs.placeholderTextColor}
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={this.changeBankAddress}
                                   allowFontScaling={false}
                                   returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.bankContent}>
                        <Text style={styles.inputTitle}>备注信息</Text>
                        <TextInput style={styles.input}
                                   placeholder={'请输入备注信息'}
                                   maxLength={30}
                                   placeholderTextColor={StyleConfigs.placeholderTextColor}
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={this.changeBankMark}
                                   allowFontScaling={false}
                                   // style={styles.inputTextArea}
                                   // multiline={true}
                                   // textAlignVertical={'top'}
                                   returnKeyType={'done'}
                        />
                    </View>
                    </ScrollView>
                    {/*保存按钮*/}
                    <View style={styles.btn}>
                        <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity}  style={styles.buttonsave} onPress={this.beginVerify}>
                            <Text style={styles.button}>保存</Text>
                        </TouchableOpacity>
                    </View>

                {/*选择银行卡模态框 begin*/}
                <Modal
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.isShowPicker}
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                    style={{margin:0}}
                >

                    <TouchableOpacity
                        onPress={this.hidePicker}
                        activeOpecity={1}
                        style={{flex:1}}
                    />
                    {/*0.618黄金比例*/}
                    <View style={{width:'100%',height: RealWindowHeight * 0.618,backgroundColor:StyleConfigs.bgColor,paddingBottom:getDeviceBottom()}}>
                        <ScrollView>
                            {
                                this.bankSelectList.map((v,i)=>{
                                    return <BaseButton
                                        key={i}
                                        activeOpecity={StyleConfigs.activeOpacity}
                                        style={[baseStyles.modalBtn,i != 0 && baseStyles.modalBtnborderTop || {}]}
                                       textStyle={[baseStyles.modalBtnTxt,this.selected == i && baseStyles.textRed || {}]}
                                        text={v.chineseName}
                                        onPress={this.onChangeSelected.bind(this,i)}
                                    />
                                })
                            }
                        </ScrollView>
                        <BaseButton
                            activeOpecity={StyleConfigs.activeOpacity}
                            onPress={this.hidePicker}
                            style={[baseStyles.modalBtn,{borderTopColor:StyleConfigs.borderBottomColor,borderTopWidth:5}]}
                            textStyle={baseStyles.modalBtnCancleTxt}
                            text={'取消'}
                        />
                    </View>
                </Modal>
                {/*选择银行卡模态框 end*/}


                {this.secondVerifyOpen &&
                <VerifyPopupsBindBank
                    showPicker={this.showVerifyPicker}
                    picked={this.authStateForC2C.ga ? 'bindGA' : 'bindMobile'}
                    onSure={this.verifyOnSure}
                    // onCancel={this.verifyOnCancel}
                    onClose={this.verifyOnClose}
                />
                }
                </KeyboardAvoidingView>

			</View>
		)
	}


}

const styles = new StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
    deviceBox:{
        marginTop: getDeviceTop(),
        marginBottom: getDeviceBottom()
    },
	content: {
		// height:getHeight(136),
		borderColor: 'red',
		paddingTop: getHeight(20),
		borderStyle: 'solid',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#E7EBEE',
		marginLeft: getWidth(30),
	},
	titleWrap: {
		marginHorizontal: getWidth(30),
		marginVertical: getHeight(26)
	},
	title: {
		fontSize: 28,
		fontWeight: '600',
		fontFamily: 'System',
		color: '#172A4D'
	},

	name: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		fontWeight: 'normal',
		color: '#172a4d',
		marginTop: getHeight(40),
		marginBottom: getHeight(22),
		// marginLeft:getWidth(30),
	},

	inputTextArea: {
		borderColor: '#E7EBEE',
		borderStyle: 'solid',
		width: '100%',
		fontSize: 16,
		// height: getHeight(41),
		// marginLeft:getWidth(30),
		// textAlignVertical: 'top',
		paddingLeft: getWidth(30),
	},
	bankContent: {
		height: getHeight(118),
		marginTop: getHeight(61),
		borderStyle: 'solid',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#E7EBEE',
		paddingLeft: getWidth(30),
	},
	input: {
		padding: 0,
		fontSize: 16,
		marginTop: getHeight(38),
        color: StyleConfigs.txt172A4D,
        // backgroundColor:'yellow'
	},
    inputTouch: {
		padding: 0,
		marginTop: getHeight(38),
        // backgroundColor:'yellow'
	},
	inputTitle: {
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 12,
		fontWeight: 'normal',
		fontFamily: 'System',
		color: '#172a4d',
	},
	btn: {
		position: 'absolute',
		bottom: 0+getDeviceBottom(),
		width: '100%',
		padding: 15,
		// marginTop: getHeight(151),
	},
	buttonsave: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: getHeight(88),
		borderRadius: StyleConfigs.borderRadius1o5,
		backgroundColor: '#C43E4E',
		// fontWeight:'600',
		// fontFamily:'System',
	},
	button: {
		fontSize: 16,
		color: 'white',
	},
    selectedText:{
        fontSize: 16,
        color: StyleConfigs.txt172A4D,
    },
    arrowDown:{
        width: 0,
        height: 0,
        right: 10,
        top: 6,
        borderLeftWidth: 4.5,
        borderRightWidth: 4.5,
        borderBottomWidth: 6.4,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderBottomColor: StyleConfigs.borderB5BCC6,
        position: 'absolute'
    },
    arrowUp:{
        width: 0,
        height: 0,
        right: 10,
        top: 6,
        borderLeftWidth: 4.5,
        borderRightWidth: 4.5,
        borderTopWidth: 6.4,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderTopColor: StyleConfigs.borderB5BCC6,
        position: 'absolute'
    },
})
