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
    Alert
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from '../components/baseComponent/NavigationHeader'
import Loading from '../components/baseComponent/Loading'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import BaseButton from '../components/baseComponent/BaseButton'
import Toast from 'react-native-root-toast'
import CheckBox from '../components/baseComponent/BaseCheckBox'
import VerifyPopupsBindBank from "./VerifyPopupsBindBank";
import {getAuthStateForC2C} from "./C2CPublicAPI";


@observer
export default class BindBank extends RNComponent {

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getBankList();
    }
    /*----------------------- data -------------------------*/

    @computed get authStateForC2C(){
        return this.$store.state.authStateForC2C;
    }
    @computed get showVerifyPicker(){
        return this.authStateForC2C.ga && this.authStateForC2C.sms;
    }
    @computed get isEdit(){
        return this.$params.bankType == 'edit'
    }
    //要编辑的银行卡信息
    @computed get bankInfo(){
        return this.$params.bankInfo
    }

    // 加载中
    @observable
    loading = false

    @observable
    selected = null;

    @observable
    selectedId = null;

    @observable
    isShowPicker = false

    @observable
    headerHeight = 0;

    @observable
    bankSelectList = [];

    // 标题
    @observable
    title = ''

    @observable bankAccount = this.isEdit ? this.bankInfo.username : '';
    @observable bankBranchName = this.isEdit ? this.bankInfo.bankAddr : '';
    @observable bankCard = this.isEdit ? this.bankInfo.cardNumber : '';
    @observable bankDefault = this.isEdit ? !!this.bankInfo.isDefault : (this.$params.bankList && this.$params.bankList == 0);
    @observable bankMark = this.isEdit ? this.bankInfo.mark : '';
    @observable bankSelectList= [] // 下拉银行列表
    @observable verifyType = this.isEdit ? 3 : 4// 验证方式 1 2 3 4 1为绑定支付宝 2为修改支付宝 3为绑定银行卡 4为修改银行卡
    @observable secondVerifyOpen = false// 验证弹窗


    /*----------------------- 生命周期 -------------------------*/

    componentDidMount(){
        super.componentDidMount()
        //获取用户认证状态
        // this.doGetAuthStateForC2C();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    //async必须和()连在一起哦
    // doGetAuthStateForC2C = async()=>{
    //     await getAuthStateForC2C(this.$http,this.$store);
    // }

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

        for(var i = 0;i<this.bankSelectList.length;i++){
            if(this.bankSelectList[i].chineseName == this.bankInfo.bankNameCN){
                this.selected = i;
                break;
            }
        }

    }
    // 获取银行列表出错
    error_getBankList = (err) => {
        Toast.show('获取银行列表请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    /*----------------------- 函数 -------------------------*/

    onHeaderLayout = (e)=>{
        console.log(e.nativeEvent);
        this.headerHeight = e.nativeEvent.layout.height;
    }

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    @action
    onChangeSelected = (index)=>{
        this.selected = index;
        this.selectedId = this.bankSelectList[index].id;
        this.hidePicker();
    }

    // 开始二次验证弹窗  验证方式type: 1 2 3 4 1为绑定支付宝 2为修改支付宝 3为绑定银行卡 4为修改银行卡
    beginVerify=(type)=>{
        if(!this.testInput())return
        this.verifyType = type
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
        if (!this.isEdit) {
            this.addBankPay(method, code)
        }

        // 修改银行卡
        if (this.isEdit) {
            this.modifyBankPay(method, code,this.bankInfo.id)
        }

    }


    @action
    testInput = ()=>{
        let result = true;
        let errMessage = '';

        if(result && this.bankAccount.trim() === ''){
            errMessage = '请输入账户名';
            result = false;
        }

        if(result && this.selected === null){
            errMessage = '请选择开户银行';
            result = false;
        }
        if(result && this.bankBranchName.trim() === ''){
            errMessage = '请输入开户支行';
            result = false;
        }
        if(result && this.bankCard.trim() === ''){
            errMessage = '请输入银行卡号';
            result = false;
        }if(result && this.bankMark.trim() === ''){
            errMessage = '请输入备注信息';
            result = false;
        }

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
                'username': this.bankAccount,
                'bankName': this.bankSelectList[this.selected].chineseName,
                'bankId': this.bankSelectList[this.selected].id,
                'bankAddr': this.bankBranchName,
                'cardNumber': this.bankCard,
                'isDefault': this.bankDefault ? 1 : 0,
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

    //修改银行卡支付
    @action
    modifyBankPay = (method, code, bankId)=>{

        let params = {
            'type': 'BANKCARD',
            'mark': this.bankMark,
            'username': this.bankAccount,
            'bankName': this.bankSelectList[this.selected].chineseName,
            'bankId': this.bankSelectList[this.selected].id,
            'bankAddr': this.bankBranchName,
            'cardNumber': this.bankCard,
            'isDefault': this.bankDefault ? 1 : 0,
            'id': bankId,
            'method': method,
            'code': code
        }
        let formData = new FormData();
        formData.append('userPayInfoBean',JSON.stringify(params));

        this.$http.send('CHANGE_PAYMENT_INFO', {
            formData:formData,
            bind: this,
            callBack: this.re_modifyBankPay,
            errorHandler: this.err_modifyBankPay
        })
        this.loading = true;
    }

    @action
    re_modifyBankPay = (data)=> {
        this.loading = false;
        console.log('this is PaymenSet addBankPay', data);
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
                    message = '修改失败，可能有未完成的订单或挂单'
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
        Toast.show('修改成功', {
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
    err_modifyBankPay = (err)=>{
        this.loading = false;
        console.warn('修改银行卡支付请求出错',err);
        Toast.show('修改银行卡支付请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }


        // 点击设置默认银行卡
    @action
    addChoseDefaultBank = () => {
        if(this.$params.bankList.length == 0){// || this.bankId === this.defaultBankId 修改时候用到
            return
        }
        this.bankDefault = !this.bankDefault
    }

    @action
    showPicker = ()=>{
        this.isShowPicker = true;
    }

    @action
    hidePicker = ()=>{
        this.isShowPicker = false;
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return <View style={[styles.container, styles.background]}>
            <KeyboardAvoidingView style={[styles.container, styles.deviceBox]} behavior={'padding'}>
                <NavHeader headerTitle={'绑定银行卡'} goBack={this.goBack} onLayout={this.onHeaderLayout}/>
                <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    style={[styles.container]}>
                    {/*账户名 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBoxRow}>
                            {/*<Text allowFontScaling={false} style={styles.inputStar}>*</Text>*/}
                            <Text
                            allowFontScaling={false}
                            style={styles.inputTitle}>账户名</Text>
                        </View>
                        <TextInput
                            maxLength={30}
                            allowFontScaling={false}
                            style={styles.input}
                            placeholder={'请输入账户名'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.bankAccount = text
                            }}
                            value={this.bankAccount}
                            returnKeyType={'done'}
                        />
                    </View>
                    {/*请选择开户银行 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBoxRow}>
                            {/*<Text allowFontScaling={false} style={styles.inputStar}>*</Text>*/}
                            <Text
                            allowFontScaling={false}
                            style={styles.inputTitle}>开户行</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={this.showPicker}
                            style={[styles.inputView, false && styles.box || {}]}>
                            {this.selected !== null &&
                                <Text allowFontScaling={false} style={styles.selectedText}>{this.bankSelectList[this.selected].chineseName}</Text>
                                ||
                                <Text allowFontScaling={false} style={{color:StyleConfigs.placeholderTextColor}}>请选择开户银行</Text>
                            }
                            {this.isShowPicker &&
                                <View style={styles.arrowDown}>
                                </View>
                                ||
                                <View style={styles.arrowUp}>
                                </View>
                            }

                        </TouchableOpacity>
                    </View>
                    {/*开户支行 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBoxRow}>
                            {/*<Text allowFontScaling={false} style={styles.inputStar}>*</Text>*/}
                            <Text
                            allowFontScaling={false}
                            style={styles.inputTitle}>开户支行</Text>
                        </View>
                        <TextInput
                            maxLength={30}
                            allowFontScaling={false}
                            style={styles.input}
                            placeholder={'请输入开户支行'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.bankBranchName = text
                            }}
                            value={this.bankBranchName}
                            returnKeyType={'done'}
                        />
                    </View>

                    {/*银行卡号 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBoxRow}>
                            {/*<Text allowFontScaling={false} style={styles.inputStar}>*</Text>*/}
                            <Text
                            allowFontScaling={false}
                            style={styles.inputTitle}>银行卡号</Text>
                        </View>
                        <TextInput
                            allowFontScaling={false}
                            style={styles.input}
                            placeholder={'请输入银行卡号'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.bankCard = text
                            }}
                            value={this.bankCard}
                            returnKeyType={'done'}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={StyleConfigs.activeOpacity}
                        onPress={this.addChoseDefaultBank}
                        style={[styles.inputTitleBoxRow,{marginTop: getWidth(16),marginLeft: getWidth(24),marginBottom:-getHeight(20)}]}>
                        <CheckBox
                            checked={this.bankDefault}
                            keys={1}
                            onPress={this.addChoseDefaultBank}
                        />
                        <Text allowFontScaling={false} style={[styles.inputTitle,{marginLeft:getWidth(8)}]}>设为默认收款银行卡</Text>
                    </TouchableOpacity>
                    {/*备注信息 begin*/}
                    <View style={[styles.inputItemBox]}>
                        <View style={styles.inputTitleBoxRow}>
                            {/*<Text allowFontScaling={false} style={styles.inputStar}>*</Text>*/}
                            <Text
                            allowFontScaling={false}
                            style={styles.inputTitle}>备注信息 (不超过50个字）</Text>
                        </View>
                        <TextInput
                            maxLength={50}
                            placeholder={'请输入备注信息'}
                            placeholderTextColor={StyleConfigs.placeholderTextColor}
                            allowFontScaling={false}
                            style={styles.inputTextArea}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.bankMark = text
                            }}
                            multiline={true}
                            value={this.bankMark}
                            textAlignVertical={'top'}
                            returnKeyType={'done'}
                        />
                    </View>

                    {/*确认按钮 begin*/}
                    <BaseButton
                        onPress={()=>{
                            this.beginVerify()
                        }}
                        style={[styles.btn]}
                        text={this.isEdit ? '确认修改' : '确认绑定'}
                        textStyle={[styles.btnText]}
                    >
                    </BaseButton>
                    {/*确认按钮 end*/}
                </ScrollView>
                {/*picker*/}
                {
                    this.isShowPicker && <TouchableOpacity onPress={this.hidePicker} activeOpacity={1} style={styles.modal}>
                        <View
                            style={{
                                marginTop: getHeight(80 + 88) * 2 + this.headerHeight, //由于每次渲染可能不一样 因此就放在这里了
                                marginRight:getWidth(24),
                                marginLeft:getWidth(24),
                                backgroundColor:'#101319',
                                borderColor: '#1B2432',
                                borderWidth: 1,
                                height:getHeight(78)*6
                            }}>
                            <ScrollView>
                            {
                                this.bankSelectList.map((v,i)=>{
                                    return <TouchableOpacity key={i} activeOpacity={StyleConfigs.activeOpacity} style={[styles.orderListOne,i != 0 && styles.orderListSplitTop || {}]} onPress={this.onChangeSelected.bind(this,i)}>
                                        <Text allowFontScaling={false} style={styles.orderListText}>{v.chineseName}</Text>
                                    </TouchableOpacity>
                                })
                            }
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                }

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </KeyboardAvoidingView>

            {this.secondVerifyOpen &&
            <VerifyPopupsBindBank
                showPicker={this.showVerifyPicker}
                picked={this.authStateForC2C.ga ? 'bindGA' : 'bindMobile'}
                onSure={this.verifyOnSure}
                onCancel={this.verifyOnCancel}
                onClose={this.verifyOnClose}
            />
            }
        </View>
    }
}

const styles = new StyleSheet.create({
    container:{
        flex: 1
    },
    deviceBox:{
        marginTop: getDeviceTop(),
        marginBottom: getDeviceBottom()
    },
    background:{
        backgroundColor:StyleConfigs.bgColor
    },
    box: {
        // overflow:'hidden'
    },
    padding:{
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    margin:{
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    inputBox: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    inputItemBox: {
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    inputTitleBox: {
        height: getHeight(80),
        justifyContent: 'center',
    },
    inputTitleBoxRow: {
        height: getHeight(80),
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputStar:{
        color: '#ed4949',
        fontSize:26,
        marginBottom: -9,
        marginRight: 4
    },
    inputTitle: {
        color: StyleConfigs.txtWhiteOpacity,
        fontSize: 13,
    },
    inputTitleGray:{
        color: StyleConfigs.txtWhiteMoreOpacity,
        fontSize: 13
    },
    input: {
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: '#20252E',
        borderRadius: StyleConfigs.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingLeft: getWidth(20),
        color: StyleConfigs.txtWhite,
        backgroundColor: '#181C22'
    },
    selectedText:{
        color: StyleConfigs.txtWhite,
    },
    inputView:{
        borderColor: '#20252E',
        borderRadius: StyleConfigs.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingLeft: getWidth(20),
        backgroundColor: '#181C22',
        justifyContent:'center'
    },
    inputTextArea:{
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: '#20252E',
        borderRadius: StyleConfigs.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(160),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingLeft: getWidth(20),
        color: StyleConfigs.txtWhite,
        backgroundColor: '#181C22'
    },
    wrongAns: {
        fontSize: 12,
        paddingTop: getHeight(20),
        paddingLeft: getWidth(20),
    },
    btn: {
        height: getHeight(88),
        marginTop: getHeight(60),
        marginBottom: getHeight(60),
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    btnText: {
        // fontWeight: 'bold',
        color: '#fff',
        fontSize: 18,
    },
    pickerButton:{
        width: '200%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0
    },
    pickerAndroid:{
        width: '200%',
        color: StyleConfigs.txtWhite,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0
    },
    pickerIOS:{
        backgroundColor: '#fff',
        paddingLeft: 0,
        paddingRight: 0
    },
    arrowDown:{
        width: 0,
        height: 0,
        right: 10,
        top: getHeight(88)/2 - 2.5,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderLeftColor: '#181C22',
        borderRightColor: '#181C22',
        borderBottomColor: StyleConfigs.btnBlue,
        position: 'absolute'
    },
    arrowUp:{
        width: 0,
        height: 0,
        right: 10,
        top: getHeight(88)/2 - 2.5,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderLeftColor: '#181C22',
        borderRightColor: '#181C22',
        borderTopColor: StyleConfigs.btnBlue,
        position: 'absolute'
    },
    imageBox:{
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
    },
    imageItems:{
        width: getWidth(220),
        height: getWidth(160)
    },
    deleteItems:{
        position: 'absolute',
        top: 0,
        right: getWidth(-10),
        height: getWidth(30),
        width :getWidth(30)
    },
    image: {
      width: '100%',
      height: '100%'
    },
    modal:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top:0,
        left: 0,
        backgroundColor: 'transparent'
    },
    orderListOne:{
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(78),
    },
    orderListSplitTop:{
        borderTopWidth: 1,
        borderTopColor: '#303031'
    },
    orderListText: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
        color: '#fff',
        fontSize: 13
    }
})
